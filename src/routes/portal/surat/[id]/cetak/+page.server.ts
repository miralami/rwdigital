import { db } from '$lib/server/db';
import { surat, warga, kk, rt, rw } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import { isStaff } from '$lib/server/guard';
import { requireRtAccess, requireScope, scopeFromRole } from '$lib/server/scope';
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
      butuhTtdRt: surat.butuhTtdRt,
      butuhTtdRw: surat.butuhTtdRw,
      ttdRtUrl: surat.ttdRtUrl,
      ttdRtNama: surat.ttdRtNama,
      ttdRtJabatan: surat.ttdRtJabatan,
      ttdRwUrl: surat.ttdRwUrl,
      ttdRwNama: surat.ttdRwNama,
      ttdRwJabatan: surat.ttdRwJabatan,
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
      rtId: rt.id,
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

  const isOwner = detail.userId === locals.user.id;

  // Staf boleh membuka dokumen ini sesuai wilayahnya: RW melihat semua surat,
  // pengurus RT hanya surat dari RT tugasnya. Warga hanya surat miliknya.
  if (isStaff(locals)) {
    const scope = requireScope(scopeFromRole(locals));
    requireRtAccess(scope, detail.rtId);
  } else if (!isOwner) {
    throw error(403, 'Anda tidak berhak mengakses dokumen surat ini.');
  }

  // Cetak hanya dibuka setelah seluruh pihak yang diminta selesai TTD.
  if (detail.status !== 'terbit') {
    throw error(
      400,
      'Surat belum bisa dicetak. Surat baru terbit setelah semua tanda tangan yang diminta lengkap.'
    );
  }

  return { detail };
};
