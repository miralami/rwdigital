import { db } from '$lib/server/db';
import { warga } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';

const editSchema = z.object({
  nik: z.string().min(16).max(16),
  nama: z.string().min(1),
  tempatLahir: z.string().min(1),
  tanggalLahir: z.string().min(1),
  jenisKelamin: z.enum(['L', 'P']),
  agama: z.string().min(1),
  pendidikan: z.string().optional(),
  pekerjaan: z.string().optional(),
  statusPerkawinan: z.enum(['belum_kawin', 'kawin', 'cerai_hidup', 'cerai_mati']),
  statusHubunganKk: z.enum(['kepala_keluarga', 'istri', 'anak', 'lainnya'])
});

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  const [data] = await db.select().from(warga).where(eq(warga.id, id));
  if (!data) redirect(302, '/warga');
  return { data };
};

export const actions: Actions = {
  default: async ({ params, request }) => {
    const id = Number(params.id);
    const formData = await request.formData();

    const result = editSchema.safeParse({
      nik: formData.get('nik'),
      nama: formData.get('nama'),
      tempatLahir: formData.get('tempatLahir'),
      tanggalLahir: formData.get('tanggalLahir'),
      jenisKelamin: formData.get('jenisKelamin'),
      agama: formData.get('agama'),
      pendidikan: formData.get('pendidikan'),
      pekerjaan: formData.get('pekerjaan'),
      statusPerkawinan: formData.get('statusPerkawinan'),
      statusHubunganKk: formData.get('statusHubunganKk')
    });

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    await db.update(warga).set(result.data).where(eq(warga.id, id));
    redirect(303, `/warga/${id}`);
  }
};
