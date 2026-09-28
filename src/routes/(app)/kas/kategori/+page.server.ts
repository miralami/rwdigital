import { db } from '$lib/server/db';
import { kategoriKas, rw } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';

const kategoriSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  jenis: z.enum(['pemasukan', 'pengeluaran'])
});

export const load: PageServerLoad = async () => {
  const semuaKategori = await db.select().from(kategoriKas);
  return { semuaKategori };
};

export const actions: Actions = {
  tambah: async ({ request }) => {
    const formData = await request.formData();
    const result = kategoriSchema.safeParse({
      nama: formData.get('nama'),
      jenis: formData.get('jenis')
    });

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    const [rwData] = await db.select().from(rw).limit(1);

    await db.insert(kategoriKas).values({
      ...result.data,
      rwId: rwData.id
    });

    redirect(303, '/kas/kategori');
  },

  hapus: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (id) {
      await db.delete(kategoriKas).where(eq(kategoriKas.id, id));
    }
    redirect(303, '/kas/kategori');
  }
};
