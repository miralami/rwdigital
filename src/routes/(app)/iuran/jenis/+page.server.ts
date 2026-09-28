import { db } from '$lib/server/db';
import { jenisIuran, rw } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';

const jenisSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  nominal: z.coerce.number().positive('Nominal harus lebih dari 0'),
  periode: z.enum(['bulanan', 'tahunan', 'insidental']).default('bulanan'),
  aktif: z.boolean().default(true)
});

export const load: PageServerLoad = async () => {
  const semuaJenis = await db.select().from(jenisIuran);
  return { semuaJenis };
};

export const actions: Actions = {
  tambah: async ({ request }) => {
    const formData = await request.formData();
    const result = jenisSchema.safeParse({
      nama: formData.get('nama'),
      nominal: formData.get('nominal'),
      periode: formData.get('periode'),
      aktif: formData.get('aktif') === 'on'
    });

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    const [rwData] = await db.select().from(rw).limit(1);

    await db.insert(jenisIuran).values({
      ...result.data,
      rwId: rwData.id
    });

    redirect(303, '/iuran/jenis');
  },

  hapus: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (id) {
      await db.delete(jenisIuran).where(eq(jenisIuran.id, id));
    }
    redirect(303, '/iuran/jenis');
  }
};
