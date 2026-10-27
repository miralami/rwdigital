import { db } from '$lib/server/db';
import { kk, pengurus, rt, rw } from '$lib/server/db/schema';
import { and, eq, ne, sql } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { permissionsOf, requirePermission } from '$lib/server/rbac';
import type { PageServerLoad, Actions } from './$types';

const rtSchema = z.object({
  nomor: z.coerce
    .number()
    .int('Nomor RT harus bilangan bulat')
    .min(1, 'Nomor RT minimal 1')
    .max(99, 'Nomor RT maksimal 99')
});

async function rwIdPertama(): Promise<number | null> {
  const [rwData] = await db.select({ id: rw.id }).from(rw).limit(1);
  return rwData?.id ?? null;
}

/** Cek nomor RT sudah dipakai atau belum di RW yang sama. */
async function nomorDipakai(rwId: number, nomor: number, kecualiId?: number): Promise<boolean> {
  const kondisi = kecualiId
    ? and(eq(rt.rwId, rwId), eq(rt.nomor, nomor), ne(rt.id, kecualiId))
    : and(eq(rt.rwId, rwId), eq(rt.nomor, nomor));

  const [row] = await db.select({ id: rt.id }).from(rt).where(kondisi).limit(1);
  return Boolean(row);
}

export const load: PageServerLoad = async ({ locals }) => {
  const daftarRt = await db
    .select({
      id: rt.id,
      nomor: rt.nomor,
      jumlahKk: sql<number>`(SELECT COUNT(*) FROM ${kk} WHERE ${kk.rtId} = ${rt.id})`,
      jumlahPengurus: sql<number>`(SELECT COUNT(*) FROM ${pengurus} WHERE ${pengurus.rtId} = ${rt.id})`
    })
    .from(rt)
    .orderBy(rt.nomor);

  return {
    daftarRt,
    bisaUbah: permissionsOf(locals).canUpdate('rt')
  };
};

export const actions: Actions = {
  tambah: async ({ request, locals }) => {
    requirePermission(locals, 'rt', 'update');

    const formData = await request.formData();
    const hasil = rtSchema.safeParse({ nomor: formData.get('nomor') });

    if (!hasil.success) {
      return fail(400, { error: hasil.error.issues[0]?.message ?? 'Nomor RT tidak valid.' });
    }

    const rwId = await rwIdPertama();
    if (!rwId) {
      return fail(400, { error: 'Data RW belum ada. Jalankan seed terlebih dahulu.' });
    }

    if (await nomorDipakai(rwId, hasil.data.nomor)) {
      return fail(400, { error: `RT ${String(hasil.data.nomor).padStart(2, '0')} sudah ada.` });
    }

    await db.insert(rt).values({ nomor: hasil.data.nomor, rwId });

    return { sukses: `RT ${String(hasil.data.nomor).padStart(2, '0')} ditambahkan.` };
  },

  ubah: async ({ request, locals }) => {
    requirePermission(locals, 'rt', 'update');

    const formData = await request.formData();
    const id = Number(formData.get('id'));
    const hasil = rtSchema.safeParse({ nomor: formData.get('nomor') });

    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID RT tidak valid.' });
    }
    if (!hasil.success) {
      return fail(400, { error: hasil.error.issues[0]?.message ?? 'Nomor RT tidak valid.' });
    }

    const rwId = await rwIdPertama();
    if (!rwId) {
      return fail(400, { error: 'Data RW belum ada. Jalankan seed terlebih dahulu.' });
    }

    if (await nomorDipakai(rwId, hasil.data.nomor, id)) {
      return fail(400, { error: `RT ${String(hasil.data.nomor).padStart(2, '0')} sudah ada.` });
    }

    await db.update(rt).set({ nomor: hasil.data.nomor }).where(eq(rt.id, id));

    return { sukses: 'Nomor RT diperbarui.' };
  },

  hapus: async ({ request, locals }) => {
    requirePermission(locals, 'rt', 'update');

    const formData = await request.formData();
    const id = Number(formData.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID RT tidak valid.' });
    }

    // Jangan hapus RT yang masih punya KK atau pengurus: datanya akan yatim.
    const [kkRow] = await db
      .select({ jumlah: sql<number>`COUNT(*)` })
      .from(kk)
      .where(eq(kk.rtId, id));
    if (Number(kkRow?.jumlah ?? 0) > 0) {
      return fail(400, {
        error: 'RT ini masih punya data KK. Pindahkan atau hapus KK-nya lebih dulu.'
      });
    }

    const [pengurusRow] = await db
      .select({ jumlah: sql<number>`COUNT(*)` })
      .from(pengurus)
      .where(eq(pengurus.rtId, id));
    if (Number(pengurusRow?.jumlah ?? 0) > 0) {
      return fail(400, {
        error: 'RT ini masih punya data pengurus. Hapus pengurusnya lebih dulu.'
      });
    }

    await db.delete(rt).where(eq(rt.id, id));

    return { sukses: 'RT dihapus.' };
  }
};
