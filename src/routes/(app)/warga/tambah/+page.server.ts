import { db } from '$lib/server/db';
import { kk, rt, warga } from '$lib/server/db/schema';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

const kkSchema = z.object({
  noKk: z.string().min(16, 'No. KK harus 16 digit').max(16, 'No. KK harus 16 digit'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  rtId: z.coerce.number().int().positive('RT wajib dipilih'),
  statusHuni: z.enum(['tetap', 'kontrak', 'kos']).default('tetap')
});

const wargaSchema = z.object({
  nik: z.string().min(16, 'NIK harus 16 digit').max(16, 'NIK harus 16 digit'),
  nama: z.string().min(1, 'Nama wajib diisi'),
  tempatLahir: z.string().min(1, 'Tempat lahir wajib diisi'),
  tanggalLahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  jenisKelamin: z.enum(['L', 'P']),
  agama: z.string().min(1, 'Agama wajib diisi'),
  pendidikan: z.string().optional(),
  pekerjaan: z.string().optional(),
  statusPerkawinan: z.enum(['belum_kawin', 'kawin', 'cerai_hidup', 'cerai_mati']).default('belum_kawin'),
  statusHubunganKk: z.enum(['kepala_keluarga', 'istri', 'anak', 'lainnya']).default('kepala_keluarga')
});

export const load: PageServerLoad = async () => {
  const semuaRt = await db.select().from(rt).orderBy(rt.nomor);
  return { semuaRt };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    // Parse KK data
    const kkResult = kkSchema.safeParse({
      noKk: formData.get('noKk'),
      alamat: formData.get('alamat'),
      rtId: formData.get('rtId'),
      statusHuni: formData.get('statusHuni')
    });

    if (!kkResult.success) {
      return fail(400, { errors: kkResult.error.flatten().fieldErrors });
    }

    // Parse warga data
    const wargaResult = wargaSchema.safeParse({
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

    if (!wargaResult.success) {
      return fail(400, { errors: wargaResult.error.flatten().fieldErrors });
    }

    // Insert KK first
    const [newKk] = await db.insert(kk).values(kkResult.data).returning();

    // Insert warga as kepala keluarga
    const [newWarga] = await db.insert(warga).values({
      ...wargaResult.data,
      kkId: newKk.id
    }).returning();

    redirect(303, `/warga/${newWarga.id}`);
  }
};
