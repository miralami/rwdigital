import { db } from '$lib/server/db';
import {
  tagihan,
  kk,
  warga,
  jenisIuran,
  paketIuran,
  paketIuranItem,
  rt
} from '$lib/server/db/schema';
import { and, asc, eq, inArray } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { requirePermission } from '$lib/server/rbac';
import { requireScope, scopeFromRole, visibleRt } from '$lib/server/scope';
import { bolehDitagihKeRt, jatuhTempoPeriode, kkAktifDari } from '$lib/server/iuran';
import type { PageServerLoad, Actions } from './$types';

const idOpsional = z.preprocess(
  (nilai) => (nilai === '' || nilai === null || nilai === undefined ? undefined : nilai),
  z.coerce.number().int().positive().optional()
);

const generateSchema = z.object({
  periode: z.string().regex(/^\d{4}-\d{2}$/, 'Periode harus format YYYY-MM'),
  rtId: idOpsional,
  paketId: idOpsional,
  jenisIds: z.array(z.coerce.number().int().positive()).default([])
});

export const load: PageServerLoad = async ({ locals }) => {
  const scope = requireScope(scopeFromRole(locals));

  const semuaJenis = await db
    .select()
    .from(jenisIuran)
    .orderBy(asc(jenisIuran.urutan), asc(jenisIuran.nama));

  const semuaPaket = await db
    .select()
    .from(paketIuran)
    .where(eq(paketIuran.aktif, true))
    .orderBy(asc(paketIuran.nama));

  const itemPaket =
    semuaPaket.length > 0
      ? await db
          .select({
            paketId: paketIuranItem.paketId,
            jenisIuranId: paketIuranItem.jenisIuranId
          })
          .from(paketIuranItem)
          .where(
            inArray(
              paketIuranItem.paketId,
              semuaPaket.map((p) => p.id)
            )
          )
      : [];

  const daftarRt = visibleRt(
    scope,
    await db.select({ id: rt.id, nomor: rt.nomor }).from(rt).orderBy(asc(rt.nomor))
  );

  return { semuaJenis, semuaPaket, itemPaket, daftarRt, scopeKind: scope.kind };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    requirePermission(locals, 'iuran', 'create');

    const scope = requireScope(scopeFromRole(locals));
    const formData = await request.formData();

    const hasil = generateSchema.safeParse({
      periode: formData.get('periode'),
      rtId: formData.get('rtId'),
      paketId: formData.get('paketId'),
      jenisIds: formData.getAll('jenisIds')
    });

    if (!hasil.success) {
      return fail(400, { errors: hasil.error.flatten().fieldErrors });
    }

    const { periode, paketId } = hasil.data;

    // Pengurus RT hanya boleh menagih RT-nya sendiri, apa pun isi form.
    if (scope.kind === 'rt' && hasil.data.rtId && hasil.data.rtId !== scope.rtId) {
      return fail(403, { error: 'Anda hanya bisa menagih RT tugas Anda.' });
    }
    const rtTarget = scope.kind === 'rt' ? scope.rtId : (hasil.data.rtId ?? null);

    // ── 1. Tentukan jenis iuran yang ditagih ────────────────────────────────
    let jenisTerpilih: (typeof jenisIuran.$inferSelect)[] = [];

    if (paketId) {
      const [paket] = await db
        .select()
        .from(paketIuran)
        .where(and(eq(paketIuran.id, paketId), eq(paketIuran.aktif, true)));

      if (!paket) return fail(404, { error: 'Paket iuran tidak ditemukan atau nonaktif.' });

      jenisTerpilih = await db
        .select({
          id: jenisIuran.id,
          nama: jenisIuran.nama,
          nominal: jenisIuran.nominal,
          porsiRw: jenisIuran.porsiRw,
          periode: jenisIuran.periode,
          scope: jenisIuran.scope,
          rtId: jenisIuran.rtId,
          urutan: jenisIuran.urutan,
          aktif: jenisIuran.aktif,
          rwId: jenisIuran.rwId,
          createdAt: jenisIuran.createdAt,
          updatedAt: jenisIuran.updatedAt
        })
        .from(paketIuranItem)
        .innerJoin(jenisIuran, eq(paketIuranItem.jenisIuranId, jenisIuran.id))
        .where(eq(paketIuranItem.paketId, paketId))
        .orderBy(asc(paketIuranItem.urutan), asc(jenisIuran.nama));
    } else if (hasil.data.jenisIds.length > 0) {
      jenisTerpilih = await db
        .select()
        .from(jenisIuran)
        .where(inArray(jenisIuran.id, hasil.data.jenisIds))
        .orderBy(asc(jenisIuran.urutan), asc(jenisIuran.nama));
    }

    if (jenisTerpilih.length === 0) {
      return fail(400, { error: 'Pilih minimal satu jenis iuran atau satu paket.' });
    }

    // Jenis milik RW tidak ditagihkan lewat RT.
    const tidakBoleh = jenisTerpilih.filter((j) => !bolehDitagihKeRt(j));
    if (tidakBoleh.length > 0) {
      return fail(400, {
        error: `Jenis berikut bukan iuran RT (atau nonaktif): ${tidakBoleh
          .map((j) => j.nama)
          .join(', ')}.`
      });
    }

    // ── 2. Kumpulkan KK aktif (punya minimal satu warga aktif) ──────────────
    const barisWarga = await db
      .select({ kkId: kk.id, rtId: kk.rtId, aktif: warga.aktif })
      .from(kk)
      .innerJoin(warga, eq(warga.kkId, kk.id))
      .where(rtTarget === null ? undefined : eq(kk.rtId, rtTarget));

    const kkAktif = kkAktifDari(barisWarga);

    if (kkAktif.size === 0) {
      return fail(400, {
        error: 'Tidak ada KK aktif pada wilayah yang dipilih untuk periode ini.'
      });
    }

    // ── 3. Lewati kombinasi yang sudah pernah ditagih (idempoten) ───────────
    const jenisIds = jenisTerpilih.map((j) => j.id);
    const sudahAda = await db
      .select({ kkId: tagihan.kkId, jenisIuranId: tagihan.jenisIuranId })
      .from(tagihan)
      .where(and(eq(tagihan.periode, periode), inArray(tagihan.jenisIuranId, jenisIds)));

    const kunciAda = new Set(sudahAda.map((t) => `${t.kkId}-${t.jenisIuranId}`));
    const jatuhTempo = jatuhTempoPeriode(periode);

    const barisBaru = [...kkAktif.keys()].flatMap((kkId) =>
      jenisTerpilih
        .filter((jenis) => !kunciAda.has(`${kkId}-${jenis.id}`))
        .map((jenis) => ({
          kkId,
          jenisIuranId: jenis.id,
          periode,
          nominal: jenis.nominal,
          porsiRw: jenis.porsiRw,
          status: 'belum_bayar' as const,
          jatuhTempo
        }))
    );

    // Pecah insert agar tidak menabrak batas jumlah variabel SQLite.
    for (let i = 0; i < barisBaru.length; i += 100) {
      await db.insert(tagihan).values(barisBaru.slice(i, i + 100)).onConflictDoNothing();
    }

    // ── 4. Ringkasan untuk ditampilkan kembali ke pengguna ──────────────────
    const kandidat = kkAktif.size * jenisTerpilih.length;
    const totalNominal = barisBaru.reduce((jumlah, row) => jumlah + row.nominal, 0);
    const totalPorsiRw = barisBaru.reduce((jumlah, row) => jumlah + row.porsiRw, 0);

    return {
      sukses: {
        periode,
        rtTarget,
        jumlahKkAktif: kkAktif.size,
        jumlahJenis: jenisTerpilih.length,
        dibuat: barisBaru.length,
        dilewati: kandidat - barisBaru.length,
        totalNominal,
        totalPorsiRw
      }
    };
  }
};
