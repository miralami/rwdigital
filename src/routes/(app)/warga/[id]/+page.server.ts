import { db } from '$lib/server/db';
import { warga, kk, rt } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);

  const [detail] = await db
    .select({
      id: warga.id,
      nik: warga.nik,
      nama: warga.nama,
      tempatLahir: warga.tempatLahir,
      tanggalLahir: warga.tanggalLahir,
      jenisKelamin: warga.jenisKelamin,
      agama: warga.agama,
      pendidikan: warga.pendidikan,
      pekerjaan: warga.pekerjaan,
      statusPerkawinan: warga.statusPerkawinan,
      statusHubunganKk: warga.statusHubunganKk,
      aktif: warga.aktif,
      kkId: kk.id,
      noKk: kk.noKk,
      alamatKk: kk.alamat,
      statusHuni: kk.statusHuni,
      rtId: rt.id,
      nomorRt: rt.nomor
    })
    .from(warga)
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .where(eq(warga.id, id));

  if (!detail) {
    redirect(302, '/warga');
  }

  const anggotaKk = await db
    .select()
    .from(warga)
    .where(eq(warga.kkId, detail.kkId))
    .orderBy(warga.nama);

  return { detail, anggotaKk };
};

export const actions: Actions = {
  nonaktifkan: async ({ params }) => {
    const id = Number(params.id);
    await db.update(warga).set({ aktif: false }).where(eq(warga.id, id));
    redirect(303, '/warga');
  }
};
