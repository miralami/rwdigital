import { db } from '$lib/server/db';
import { surat, warga, kk, rt, rw } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import { rolesOf, STAFF_ROLES } from '$lib/server/guard';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    redirect(302, '/login');
  }

  const id = Number(params.id);

  const [detail] = await db
    .select({
      id: surat.id,
      nomorSurat: surat.nomorSurat,
      jenis: surat.jenis,
      keperluan: surat.keperluan,
      keterangan: surat.keterangan,
      status: surat.status,
      tanggalTerbit: surat.tanggalTerbit,
      wargaId: warga.id,
      userId: warga.userId,
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
      namaRw: rw.nama,
      kelurahan: rw.kelurahan,
      kecamatan: rw.kecamatan,
      kota: rw.kota
    })
    .from(surat)
    .innerJoin(warga, eq(surat.wargaId, warga.id))
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .innerJoin(rw, eq(rt.rwId, rw.id))
    .where(eq(surat.id, id));

  if (!detail) {
    throw error(404, 'Surat tidak ditemukan');
  }

  const roles = rolesOf(locals);
  const isStaff = roles.some((r) => (STAFF_ROLES as readonly string[]).includes(r));
  const isOwner = detail.userId === locals.user.id;

  if (!isStaff && !isOwner) {
    throw error(403, 'Anda tidak berhak mengakses dokumen surat ini.');
  }

  return { detail };
};
