import { db } from '$lib/server/db';
import {
  konfirmasiBayar,
  tagihan,
  kk,
  rt,
  jenisIuran,
  pembayaran
} from '$lib/server/db/schema';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { requirePermission } from '$lib/server/rbac';
import { requireRtAccess, requireScope, scopeFromRole } from '$lib/server/scope';
import { catatPembayaran, hitungSisa } from '$lib/server/pembayaran';
import type { PageServerLoad, Actions } from './$types';

const tolakSchema = z.object({
  id: z.coerce.number().int().positive(),
  alasanTolak: z.string().trim().max(300, 'Alasan terlalu panjang').optional()
});

export const load: PageServerLoad = async ({ locals }) => {
  const scope = requireScope(scopeFromRole(locals));

  const baris = await db
    .select({
      id: konfirmasiBayar.id,
      tagihanId: konfirmasiBayar.tagihanId,
      jumlah: konfirmasiBayar.jumlah,
      metodeBayar: konfirmasiBayar.metodeBayar,
      catatan: konfirmasiBayar.catatan,
      status: konfirmasiBayar.status,
      alasanTolak: konfirmasiBayar.alasanTolak,
      createdAt: konfirmasiBayar.createdAt,
      diprosesPada: konfirmasiBayar.diprosesPada,
      namaJenis: jenisIuran.nama,
      periode: tagihan.periode,
      nominalTagihan: tagihan.nominal,
      statusTagihan: tagihan.status,
      noKk: kk.noKk,
      alamat: kk.alamat,
      nomorRt: rt.nomor
    })
    .from(konfirmasiBayar)
    .innerJoin(tagihan, eq(konfirmasiBayar.tagihanId, tagihan.id))
    .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
    .innerJoin(kk, eq(tagihan.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .where(scope.kind === 'rt' ? eq(kk.rtId, scope.rtId) : undefined)
    .orderBy(desc(konfirmasiBayar.createdAt));

  const idTagihan = [...new Set(baris.map((b) => b.tagihanId))];
  const semuaBayar =
    idTagihan.length > 0
      ? await db
          .select({ tagihanId: pembayaran.tagihanId, jumlah: pembayaran.jumlah })
          .from(pembayaran)
          .where(inArray(pembayaran.tagihanId, idTagihan))
      : [];

  const dibayar = new Map<number, number>();
  for (const bayar of semuaBayar) {
    dibayar.set(bayar.tagihanId, (dibayar.get(bayar.tagihanId) ?? 0) + bayar.jumlah);
  }

  const daftar = baris.map((b) => ({
    ...b,
    sisa: hitungSisa(b.nominalTagihan, dibayar.get(b.tagihanId) ?? 0)
  }));

  return {
    menunggu: daftar.filter((k) => k.status === 'menunggu'),
    riwayat: daftar.filter((k) => k.status !== 'menunggu').slice(0, 20)
  };
};

export const actions: Actions = {
  terima: async ({ request, locals }) => {
    requirePermission(locals, 'iuran', 'update');
    const scope = requireScope(scopeFromRole(locals));

    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'Konfirmasi tidak valid.' });
    }

    const [konfirmasi] = await db
      .select({
        id: konfirmasiBayar.id,
        tagihanId: konfirmasiBayar.tagihanId,
        jumlah: konfirmasiBayar.jumlah,
        metodeBayar: konfirmasiBayar.metodeBayar,
        catatan: konfirmasiBayar.catatan,
        status: konfirmasiBayar.status,
        rtId: kk.rtId,
        nominal: tagihan.nominal
      })
      .from(konfirmasiBayar)
      .innerJoin(tagihan, eq(konfirmasiBayar.tagihanId, tagihan.id))
      .innerJoin(kk, eq(tagihan.kkId, kk.id))
      .where(eq(konfirmasiBayar.id, id));

    if (!konfirmasi) return fail(404, { error: 'Konfirmasi tidak ditemukan.' });
    if (konfirmasi.status !== 'menunggu') {
      return fail(400, { error: 'Konfirmasi ini sudah diproses.' });
    }

    requireRtAccess(scope, konfirmasi.rtId);

    const sudahBayar = await db
      .select({ jumlah: pembayaran.jumlah })
      .from(pembayaran)
      .where(eq(pembayaran.tagihanId, konfirmasi.tagihanId));
    const sisa = hitungSisa(
      konfirmasi.nominal,
      sudahBayar.reduce((total, row) => total + row.jumlah, 0)
    );

    if (konfirmasi.jumlah > sisa) {
      return fail(400, {
        error: `Jumlah konfirmasi melebihi sisa tagihan (Rp${sisa.toLocaleString('id-ID')}). Tolak dan minta warga mengajukan ulang.`
      });
    }

    const operator = locals.user?.name ?? locals.user?.id ?? 'Bendahara';
    const sekarang = new Date().toISOString();

    await catatPembayaran({
      tagihanId: konfirmasi.tagihanId,
      jumlah: konfirmasi.jumlah,
      metodeBayar: konfirmasi.metodeBayar,
      catatan: konfirmasi.catatan
        ? `${konfirmasi.catatan} (konfirmasi #${konfirmasi.id})`
        : `Konfirmasi portal #${konfirmasi.id}`,
      dibayarPada: sekarang,
      operator
    });

    await db
      .update(konfirmasiBayar)
      .set({ status: 'diterima', diprosesOleh: operator, diprosesPada: sekarang })
      .where(eq(konfirmasiBayar.id, id));

    redirect(303, '/iuran/konfirmasi');
  },

  tolak: async ({ request, locals }) => {
    requirePermission(locals, 'iuran', 'update');
    const scope = requireScope(scopeFromRole(locals));

    const formData = await request.formData();
    const parsed = tolakSchema.safeParse({
      id: formData.get('id'),
      alasanTolak: formData.get('alasanTolak') || undefined
    });

    if (!parsed.success) {
      return fail(400, { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' });
    }

    const [konfirmasi] = await db
      .select({ id: konfirmasiBayar.id, status: konfirmasiBayar.status, rtId: kk.rtId })
      .from(konfirmasiBayar)
      .innerJoin(tagihan, eq(konfirmasiBayar.tagihanId, tagihan.id))
      .innerJoin(kk, eq(tagihan.kkId, kk.id))
      .where(eq(konfirmasiBayar.id, parsed.data.id));

    if (!konfirmasi) return fail(404, { error: 'Konfirmasi tidak ditemukan.' });
    if (konfirmasi.status !== 'menunggu') {
      return fail(400, { error: 'Konfirmasi ini sudah diproses.' });
    }

    requireRtAccess(scope, konfirmasi.rtId);

    const operator = locals.user?.name ?? locals.user?.id ?? 'Bendahara';
    await db
      .update(konfirmasiBayar)
      .set({
        status: 'ditolak',
        alasanTolak: parsed.data.alasanTolak || null,
        diprosesOleh: operator,
        diprosesPada: new Date().toISOString()
      })
      .where(
        and(eq(konfirmasiBayar.id, parsed.data.id), eq(konfirmasiBayar.status, 'menunggu'))
      );

    redirect(303, '/iuran/konfirmasi');
  }
};
