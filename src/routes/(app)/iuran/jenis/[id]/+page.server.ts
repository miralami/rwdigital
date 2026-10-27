import { db } from '$lib/server/db';
import { jenisIuran, rt } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { requirePermission } from '$lib/server/rbac';
import { bacaFormJenis, jenisSchema } from '$lib/server/iuran-schema';
import type { PageServerLoad, Actions } from './$types';

const ubahSchema = jenisSchema.extend({
  id: z.coerce.number().int().positive('ID jenis iuran tidak valid')
});

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) redirect(302, '/iuran/jenis');

  const [detail] = await db.select().from(jenisIuran).where(eq(jenisIuran.id, id));
  if (!detail) redirect(302, '/iuran/jenis');

  const daftarRt = await db.select({ id: rt.id, nomor: rt.nomor }).from(rt).orderBy(asc(rt.nomor));

  return { detail, daftarRt };
};

export const actions: Actions = {
  default: async ({ params, request, locals }) => {
    requirePermission(locals, 'iuran', 'update');

    const result = ubahSchema.safeParse({
      ...bacaFormJenis(await request.formData()),
      id: params.id
    });

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    const { id, ...nilai } = result.data;

    // Nominal & porsi baru hanya dipakai tagihan berikutnya. Tagihan yang
    // sudah terbit menyimpan snapshot sendiri (lihat komentar di schema).
    await db
      .update(jenisIuran)
      .set({
        ...nilai,
        rtId: nilai.scope === 'rt' ? (nilai.rtId ?? null) : null,
        updatedAt: new Date().toISOString()
      })
      .where(eq(jenisIuran.id, id));

    redirect(303, '/iuran/jenis');
  }
};
