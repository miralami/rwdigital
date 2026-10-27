import { db } from '$lib/server/db';
import { jenisIuran, rw, paketIuran, paketIuranItem } from '$lib/server/db/schema';
import { asc, eq, inArray } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { requirePermission } from '$lib/server/rbac';
import type { PageServerLoad, Actions } from './$types';

const paketSchema = z.object({
  nama: z.string().trim().min(1, 'Nama paket wajib diisi').max(100, 'Nama terlalu panjang'),
  keterangan: z.string().trim().max(300, 'Keterangan terlalu panjang').optional(),
  aktif: z.boolean().default(true),
  jenisIds: z.array(z.coerce.number().int().positive()).default([])
});

function bacaForm(formData: FormData) {
  return {
    nama: formData.get('nama'),
    keterangan: formData.get('keterangan') || undefined,
    aktif: formData.get('aktif') === 'on',
    jenisIds: formData.getAll('jenisIds')
  };
}

export const load: PageServerLoad = async () => {
  const semuaPaket = await db.select().from(paketIuran).orderBy(asc(paketIuran.nama));
  const semuaJenis = await db
    .select({
      id: jenisIuran.id,
      nama: jenisIuran.nama,
      nominal: jenisIuran.nominal,
      scope: jenisIuran.scope,
      aktif: jenisIuran.aktif
    })
    .from(jenisIuran)
    .orderBy(asc(jenisIuran.urutan), asc(jenisIuran.nama));

  const item =
    semuaPaket.length > 0
      ? await db
          .select({
            paketId: paketIuranItem.paketId,
            jenisIuranId: paketIuranItem.jenisIuranId,
            urutan: paketIuranItem.urutan
          })
          .from(paketIuranItem)
          .where(
            inArray(
              paketIuranItem.paketId,
              semuaPaket.map((p) => p.id)
            )
          )
          .orderBy(asc(paketIuranItem.urutan))
      : [];

  const paket = semuaPaket.map((p) => ({
    ...p,
    item: item.filter((i) => i.paketId === p.id)
  }));

  return { paket, semuaJenis };
};

export const actions: Actions = {
  tambah: async ({ request, locals }) => {
    requirePermission(locals, 'iuran', 'create');
    const result = paketSchema.safeParse(bacaForm(await request.formData()));

    if (!result.success) {
      return fail(400, { error: result.error.issues[0]?.message ?? 'Data paket tidak valid.' });
    }

    if (result.data.jenisIds.length === 0) {
      return fail(400, { error: 'Pilih minimal satu jenis iuran untuk paket ini.' });
    }

    const [rwData] = await db.select().from(rw).limit(1);
    const [paket] = await db
      .insert(paketIuran)
      .values({
        nama: result.data.nama,
        keterangan: result.data.keterangan || null,
        aktif: result.data.aktif,
        rwId: rwData.id
      })
      .returning();

    await db.insert(paketIuranItem).values(
      result.data.jenisIds.map((jenisIuranId, index) => ({
        paketId: paket.id,
        jenisIuranId,
        urutan: index
      }))
    );

    redirect(303, '/iuran/paket');
  },

  ubah: async ({ request, locals }) => {
    requirePermission(locals, 'iuran', 'update');
    const formData = await request.formData();
    const id = Number(formData.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID paket tidak valid.' });
    }

    const result = paketSchema.safeParse(bacaForm(formData));
    if (!result.success) {
      return fail(400, { error: result.error.issues[0]?.message ?? 'Data paket tidak valid.' });
    }

    if (result.data.jenisIds.length === 0) {
      return fail(400, { error: 'Paket harus punya minimal satu jenis iuran.' });
    }

    await db
      .update(paketIuran)
      .set({
        nama: result.data.nama,
        keterangan: result.data.keterangan || null,
        aktif: result.data.aktif,
        updatedAt: new Date().toISOString()
      })
      .where(eq(paketIuran.id, id));

    // Isi paket diganti utuh supaya urutan dan pilihan selalu konsisten.
    await db.delete(paketIuranItem).where(eq(paketIuranItem.paketId, id));
    await db.insert(paketIuranItem).values(
      result.data.jenisIds.map((jenisIuranId, index) => ({
        paketId: id,
        jenisIuranId,
        urutan: index
      }))
    );

    redirect(303, '/iuran/paket');
  },

  hapus: async ({ request, locals }) => {
    requirePermission(locals, 'iuran', 'delete');
    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID paket tidak valid.' });
    }

    await db.delete(paketIuranItem).where(eq(paketIuranItem.paketId, id));
    await db.delete(paketIuran).where(eq(paketIuran.id, id));

    redirect(303, '/iuran/paket');
  }
};
