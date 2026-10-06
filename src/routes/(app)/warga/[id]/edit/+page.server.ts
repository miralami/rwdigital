import { db } from '$lib/server/db';
import { warga, riwayatWarga } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';

const editSchema = z.object({
  nik: z.string().length(16, 'NIK harus tepat 16 digit'),
  nama: z.string().min(1, 'Nama wajib diisi'),
  tempatLahir: z.string().min(1, 'Tempat lahir wajib diisi'),
  tanggalLahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  jenisKelamin: z.enum(['L', 'P']),
  agama: z.string().min(1, 'Agama wajib diisi'),
  pendidikan: z.string().optional(),
  pekerjaan: z.string().optional(),
  statusPerkawinan: z.enum(['belum_kawin', 'kawin', 'cerai_hidup', 'cerai_mati']),
  statusHubunganKk: z.enum(['kepala_keluarga', 'istri', 'anak', 'lainnya']),
  alasan: z.string().min(5, 'Alasan perubahan data harus diisi minimal 5 karakter')
});

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  const [data] = await db.select().from(warga).where(eq(warga.id, id));
  if (!data) redirect(302, '/warga');
  return { data };
};

export const actions: Actions = {
  default: async ({ params, request, locals }) => {
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
      statusHubunganKk: formData.get('statusHubunganKk'),
      alasan: formData.get('alasan')
    });

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    const { alasan, ...wargaData } = result.data;
    await db.update(warga).set(wargaData).where(eq(warga.id, id));

    // Rekam jejak audit riwayat_warga (SF-KP-02)
    const operator = locals.user?.name ?? locals.user?.id ?? 'Pengurus';
    await db.insert(riwayatWarga).values({
      wargaId: id,
      diubahOleh: operator,
      alasan,
      ringkasan: `Perubahan data warga: ${result.data.nama}`
    });

    redirect(303, `/warga/${id}`);
  }
};
