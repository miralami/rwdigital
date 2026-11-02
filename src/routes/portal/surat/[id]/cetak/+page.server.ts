import { db } from '$lib/server/db';
import { surat, warga, kk, rt, rw, pengurus } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import { isStaff } from '$lib/server/guard';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
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

  if (!isStaff(locals) && !isOwner) {
    throw error(403, 'Anda tidak berhak mengakses dokumen surat ini.');
  }

  // Cari data Ketua RT untuk tanda tangan
  const [ketuaRt] = await db
    .select({
      nama: pengurus.nama,
      fotoUrl: pengurus.fotoUrl
    })
    .from(pengurus)
    .where(and(eq(pengurus.rtId, detail.rtId), eq(pengurus.aktif, true)))
    .limit(1);

  // Cek apakah ada file TTD elektronik RT
  const ttdFileName = `ttd-rt-${String(detail.nomorRt).padStart(2, '0')}.png`;
  const ttdPath = join(process.cwd(), 'static', 'uploads', 'ttd', ttdFileName);
  const ttdUrl = existsSync(ttdPath) ? `/uploads/ttd/${ttdFileName}` : null;

  return {
    detail: {
      ...detail,
      namaKetuaRt: ketuaRt?.nama ?? null,
      ttdRtUrl: ttdUrl
    }
  };
};
