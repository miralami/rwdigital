import { db } from '$lib/server/db';
import { jenisIuran, rw, rt, tagihan, paketIuranItem } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { asc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { requirePermission } from '$lib/server/rbac';
import { bacaFormJenis, jenisSchema } from '$lib/server/iuran-schema';
import type { PageServerLoad, Actions } from './$types';

const ubahSchema = jenisSchema.extend({
  id: z.coerce.number().int().positive('ID jenis iuran tidak valid')
});

export const load: PageServerLoad = async () => {
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
    .orderBy(asc(jenisIuran.urutan), asc(jenisIuran.nama));

  const daftarRt = await db.select({ id: rt.id, nomor: rt.nomor }).from(rt).orderBy(asc(rt.nomor));

  return { semuaJenis, daftarRt };
};

export const actions: Actions = {
  tambah: async ({ request, locals }) => {
    requirePermission(locals, 'iuran', 'create');
    const formData = await request.formData();
    const result = jenisSchema.safeParse(bacaFormJenis(formData));

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    const [rwData] = await db.select().from(rw).limit(1);

    await db.insert(jenisIuran).values({
      ...result.data,
      // rtId hanya bermakna untuk scope 'rt'.
      rtId: result.data.scope === 'rt' ? (result.data.rtId ?? null) : null,
      rwId: rwData.id
    });

    redirect(303, '/iuran/jenis');
  },

  ubah: async ({ request, locals }) => {
    requirePermission(locals, 'iuran', 'update');
    const formData = await request.formData();
    const result = ubahSchema.safeParse({
      ...bacaFormJenis(formData),
      id: formData.get('id')
    });

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    const { id, ...nilai } = result.data;

    // Perubahan nominal/porsi hanya berlaku untuk tagihan berikutnya; tagihan
    // lama menyimpan snapshot sendiri sehingga tidak ikut berubah.
    await db
      .update(jenisIuran)
      .set({
        ...nilai,
        rtId: nilai.scope === 'rt' ? (nilai.rtId ?? null) : null,
        updatedAt: new Date().toISOString()
      })
      .where(eq(jenisIuran.id, id));

    redirect(303, '/iuran/jenis');
  },

  hapus: async ({ request, locals }) => {
    requirePermission(locals, 'iuran', 'delete');
    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (!id) return fail(400, { error: 'ID jenis iuran tidak valid.' });

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
