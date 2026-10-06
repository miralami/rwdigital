import { db } from '$lib/server/db';
import { surat, warga, kk, rt, rw } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);

  const [detail] = await db
    .select({
      id: surat.id,
      nomorSurat: surat.nomorSurat,
      jenis: surat.jenis,
      keperluan: surat.keperluan,
      keterangan: surat.keterangan,
      dokumenSyarat: surat.dokumenSyarat,
      status: surat.status,
      catatanPengurus: surat.catatanPengurus,
      diverifikasiOleh: surat.diverifikasiOleh,
      disetujuiOleh: surat.disetujuiOleh,
      tanggalTerbit: surat.tanggalTerbit,
      createdAt: surat.createdAt,
      wargaId: warga.id,
      namaWarga: warga.nama,
      nikWarga: warga.nik,
      tempatLahir: warga.tempatLahir,
      tanggalLahir: warga.tanggalLahir,
      jenisKelamin: warga.jenisKelamin,
      agama: warga.agama,
      pekerjaan: warga.pekerjaan,
      statusPerkawinan: warga.statusPerkawinan,
      noKk: kk.noKk,
      alamatKk: kk.alamat,
      nomorRt: rt.nomor,
      namaRw: rw.nama
    })
    .from(surat)
    .innerJoin(warga, eq(surat.wargaId, warga.id))
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .innerJoin(rw, eq(rt.rwId, rw.id))
    .where(eq(surat.id, id));

  if (!detail) {
    redirect(302, '/surat');
  }

  return { detail };
};

export const actions: Actions = {
  verifikasi: async ({ params, locals }) => {
    const id = Number(params.id);
    const userId = locals.user?.id ?? 'system';

    await db
      .update(surat)
      .set({
        status: 'diverifikasi',
        diverifikasiOleh: userId
      })
      .where(eq(surat.id, id));

    return { success: true };
  },

  setujui: async ({ params, locals }) => {
    const id = Number(params.id);
    const userId = locals.user?.id ?? 'system';

    const sekarang = new Date();
    const bulan = sekarang.getMonth() + 1;
    const tahun = sekarang.getFullYear();
    const nomor = `470/${String(id).padStart(3, '0')}/RW.01/${bulan}/${tahun}`;
    const tanggalTerbit = sekarang.toISOString().slice(0, 10);

    await db
      .update(surat)
      .set({
        status: 'disetujui',
        nomorSurat: nomor,
        disetujuiOleh: userId,
        tanggalTerbit
      })
      .where(eq(surat.id, id));

    return { success: true };
  },

  tolak: async ({ params, request }) => {
    const id = Number(params.id);
    const formData = await request.formData();
    const alasan = String(formData.get('catatan') || 'Dokumen persyaratan tidak lengkap').trim();

    await db
      .update(surat)
      .set({
        status: 'ditolak',
        catatanPengurus: alasan
      })
      .where(eq(surat.id, id));

    return { success: true };
  }
};
