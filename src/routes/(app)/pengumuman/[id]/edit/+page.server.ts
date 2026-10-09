import { db } from '$lib/server/db';
import { pengumuman } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';

const editSchema = z.object({
  judul: z.string().min(1),
  isi: z.string().min(1),
  kategori: z.enum(['umum', 'kegiatan', 'keuangan', 'darurat']),
  tanggalMulai: z.string().optional(),
  tanggalSelesai: z.string().optional(),
  ditampilkan: z.boolean()
});

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  const [data] = await db.select().from(pengumuman).where(eq(pengumuman.id, id));
  if (!data) redirect(302, '/pengumuman');
  return { data };
};

export const actions: Actions = {
  default: async ({ params, request }) => {
    const id = Number(params.id);
    const formData = await request.formData();

    const result = editSchema.safeParse({
      judul: formData.get('judul'),
      isi: formData.get('isi'),
      kategori: formData.get('kategori'),
      tanggalMulai: formData.get('tanggalMulai') || undefined,
      tanggalSelesai: formData.get('tanggalSelesai') || undefined,
      ditampilkan: formData.get('ditampilkan') === 'on'
    });

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    await db.update(pengumuman).set(result.data).where(eq(pengumuman.id, id));
    redirect(303, '/pengumuman');
  }
};
