import { db } from '$lib/server/db';
import { surat, warga, kk, rt, rw } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Detail surat untuk warga. Hanya pemilik surat yang boleh membuka halaman
 * ini; pengurus tetap memakai halaman /surat/[id].
 */
export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    redirect(302, '/login');
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw error(404, 'Surat tidak ditemukan.');
  }

  const [pemilik] = await db
    .select({ id: warga.id })
    .from(warga)
    .where(eq(warga.userId, locals.user.id))
    .limit(1);

  if (!pemilik) {
    redirect(302, '/portal');
  }

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
      butuhTtdRt: surat.butuhTtdRt,
      butuhTtdRw: surat.butuhTtdRw,
      ttdRtUrl: surat.ttdRtUrl,
      ttdRtPada: surat.ttdRtPada,
      ttdRtNama: surat.ttdRtNama,
      ttdRtJabatan: surat.ttdRtJabatan,
      ttdRwUrl: surat.ttdRwUrl,
      ttdRwPada: surat.ttdRwPada,
      ttdRwNama: surat.ttdRwNama,
      ttdRwJabatan: surat.ttdRwJabatan,
      tanggalTerbit: surat.tanggalTerbit,
      createdAt: surat.createdAt,
      ditolakPada: surat.ditolakPada,
      namaWarga: warga.nama,
      nomorRt: rt.nomor,
      namaRw: rw.nama
    })
    .from(surat)
    .innerJoin(warga, eq(surat.wargaId, warga.id))
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .innerJoin(rw, eq(rt.rwId, rw.id))
    .where(and(eq(surat.id, id), eq(surat.wargaId, pemilik.id)));

  if (!detail) {
    throw error(404, 'Surat tidak ditemukan atau bukan milik Anda.');
  }

  return { detail };
};
