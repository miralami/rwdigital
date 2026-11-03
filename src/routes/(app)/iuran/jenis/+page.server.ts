import { db } from '$lib/server/db';
import { jenisIuran, rw, rt, tagihan, paketIuranItem } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { and, asc, eq, isNull, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { requirePermission } from '$lib/server/rbac';
import { requireScope, scopeFromRole } from '$lib/server/scope';
import { bacaFormJenis, jenisSchema } from '$lib/server/iuran-schema';
import type { PageServerLoad, Actions } from './$types';

const ubahSchema = jenisSchema.extend({
  id: z.coerce.number().int().positive('ID jenis iuran tidak valid')
});

/**
 * Jenis iuran milik satu RT: scope `rt` dan rtId-nya cocok.
 * Jenis `rw` (global) atau `rt` tanpa rtId (semua RT) adalah milik RW dan
 * hanya bisa dibaca Pengurus RT.
 */
function milikRt(
  row: { scope: string; rtId: number | null },
  scope: ReturnType<typeof scopeFromRole>
): boolean {
  return (
    scope.kind === 'all' ||
    (scope.kind === 'rt' && row.scope === 'rt' && row.rtId === scope.rtId)
  );
}

export const load: PageServerLoad = async ({ locals }) => {
  const scope = requireScope(scopeFromRole(locals));

  const semuaJenis = await db
    .select({
      id: jenisIuran.id,
      nama: jenisIuran.nama,
      nominal: jenisIuran.nominal,
      porsiRw: jenisIuran.porsiRw,
      periode: jenisIuran.periode,
      scope: jenisIuran.scope,
      rtId: jenisIuran.rtId,
      urutan: jenisIuran.urutan,
      aktif: jenisIuran.aktif
    })
    .from(jenisIuran)
    .where(
      scope.kind === 'rt'
        ? or(
            eq(jenisIuran.scope, 'rw'),
            and(
              eq(jenisIuran.scope, 'rt'),
              or(isNull(jenisIuran.rtId), eq(jenisIuran.rtId, scope.rtId))
            )
          )
        : undefined
    )
    .orderBy(asc(jenisIuran.urutan), asc(jenisIuran.nama));

  const daftarRt =
    scope.kind === 'rt'
      ? await db
          .select({ id: rt.id, nomor: rt.nomor })
          .from(rt)
          .where(eq(rt.id, scope.rtId))
      : await db.select({ id: rt.id, nomor: rt.nomor }).from(rt).orderBy(asc(rt.nomor));

  return {
    semuaJenis: semuaJenis.map((row) => ({ ...row, bisaKelola: milikRt(row, scope) })),
    daftarRt,
    scopeKind: scope.kind
  };
};

export const actions: Actions = {
  tambah: async ({ request, locals }) => {
    requirePermission(locals, 'iuran', 'create');
    const scope = requireScope(scopeFromRole(locals));
    const formData = await request.formData();
    const result = jenisSchema.safeParse(bacaFormJenis(formData));

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    // Pengurus RT selalu membuat jenis milik RT-nya sendiri; pilihan scope/RT
    // dari form diabaikan supaya tidak bisa membuat aturan global.
    const nilai =
      scope.kind === 'rt'
        ? { ...result.data, scope: 'rt' as const, rtId: scope.rtId }
        : {
            ...result.data,
            // rtId hanya bermakna untuk scope 'rt'.
            rtId: result.data.scope === 'rt' ? (result.data.rtId ?? null) : null
          };

    const [rwData] = await db.select().from(rw).limit(1);

    await db.insert(jenisIuran).values({
      ...nilai,
      rwId: rwData.id
    });

    redirect(303, '/iuran/jenis');
  },

  ubah: async ({ request, locals }) => {
    requirePermission(locals, 'iuran', 'update');
    const scope = requireScope(scopeFromRole(locals));
    const formData = await request.formData();
    const result = ubahSchema.safeParse({
      ...bacaFormJenis(formData),
      id: formData.get('id')
    });

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    const { id, ...nilai } = result.data;

    const [lama] = await db.select().from(jenisIuran).where(eq(jenisIuran.id, id)).limit(1);
    if (!lama) return fail(404, { error: 'Jenis iuran tidak ditemukan.' });
    if (!milikRt(lama, scope)) {
      return fail(403, { error: 'Anda hanya boleh mengubah jenis iuran milik RT sendiri.' });
    }

    // Perubahan nominal/porsi hanya berlaku untuk tagihan berikutnya; tagihan
    // lama menyimpan snapshot sendiri sehingga tidak ikut berubah.
    await db
      .update(jenisIuran)
      .set({
        ...nilai,
        scope: scope.kind === 'rt' ? 'rt' : nilai.scope,
        rtId:
          scope.kind === 'rt'
            ? scope.rtId
            : nilai.scope === 'rt'
              ? (nilai.rtId ?? null)
              : null,
        updatedAt: new Date().toISOString()
      })
      .where(eq(jenisIuran.id, id));

    redirect(303, '/iuran/jenis');
  },

  hapus: async ({ request, locals }) => {
    requirePermission(locals, 'iuran', 'delete');
    const scope = requireScope(scopeFromRole(locals));
    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (!id) return fail(400, { error: 'ID jenis iuran tidak valid.' });

    const [lama] = await db.select().from(jenisIuran).where(eq(jenisIuran.id, id)).limit(1);
    if (!lama) return fail(404, { error: 'Jenis iuran tidak ditemukan.' });
    if (!milikRt(lama, scope)) {
      return fail(403, { error: 'Anda hanya boleh menghapus jenis iuran milik RT sendiri.' });
    }

    // Jenis yang sudah punya tagihan tidak boleh dihapus (jejak keuangan).
    // Nonaktifkan saja supaya riwayat tetap utuh.
    const [dipakai] = await db
      .select({ jumlah: sql<number>`count(*)` })
      .from(tagihan)
      .where(eq(tagihan.jenisIuranId, id));

    if (Number(dipakai?.jumlah ?? 0) > 0) {
      return fail(400, {
        error: 'Jenis ini sudah dipakai tagihan. Nonaktifkan saja agar riwayat tetap utuh.'
      });
    }

    await db.delete(paketIuranItem).where(eq(paketIuranItem.jenisIuranId, id));
    await db.delete(jenisIuran).where(eq(jenisIuran.id, id));

    redirect(303, '/iuran/jenis');
  }
};
