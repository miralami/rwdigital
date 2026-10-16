import { db } from '$lib/server/db';
import { warga, kk, rt, tagihan, jenisIuran, pembayaran, pengumuman, surat } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user?.id;

  const [linkedWarga] = userId
    ? await db
        .select({
          id: warga.id,
          nama: warga.nama,
          nik: warga.nik,
          tempatLahir: warga.tempatLahir,
          tanggalLahir: warga.tanggalLahir,
          jenisKelamin: warga.jenisKelamin,
          agama: warga.agama,
          pendidikan: warga.pendidikan,
          pekerjaan: warga.pekerjaan,
          statusPerkawinan: warga.statusPerkawinan,
          statusHubunganKk: warga.statusHubunganKk,
          kkId: warga.kkId,
          noKk: kk.noKk,
          nomorRt: rt.nomor,
          alamat: kk.alamat,
          statusHuni: kk.statusHuni
        })
        .from(warga)
        .innerJoin(kk, eq(warga.kkId, kk.id))
        .innerJoin(rt, eq(kk.rtId, rt.id))
        .where(eq(warga.userId, userId))
    : [];

  // Pengumuman aktif dari DB
  const rawPengumuman = await db
    .select({
      id: pengumuman.id,
      judul: pengumuman.judul,
      isi: pengumuman.isi,
      kategori: pengumuman.kategori,
      createdAt: pengumuman.createdAt
    })
    .from(pengumuman)
    .where(eq(pengumuman.ditampilkan, true))
    .orderBy(desc(pengumuman.createdAt))
    .limit(5);

  const listPengumuman = rawPengumuman.map(p => ({
    id: String(p.id),
    judul: p.judul,
    tanggal: p.createdAt
  }));

  if (!linkedWarga) {
    return {
      namaPengguna: locals.user?.name ?? null,
      terhubung: false,
      warga: null,
      anggotaKk: [],
      iuran: null,
      pengumuman: listPengumuman,
      riwayatPembayaran: [],
      daftarSurat: []
    };
  }

  // Anggota KK (KP-04): seluruh warga dalam satu KK
  const anggotaKk = await db
    .select({
      id: warga.id,
      nama: warga.nama,
      nik: warga.nik,
      tanggalLahir: warga.tanggalLahir,
      jenisKelamin: warga.jenisKelamin,
      statusHubunganKk: warga.statusHubunganKk,
      aktif: warga.aktif
    })
    .from(warga)
    .where(eq(warga.kkId, linkedWarga.kkId))
    .orderBy(warga.statusHubunganKk, warga.nama);

  // Tagihan milik KK warga
  const semuaTagihan = await db
    .select({
      id: tagihan.id,
      periode: tagihan.periode,
      nominal: tagihan.nominal,
      status: tagihan.status,
      namaJenis: jenisIuran.nama
    })
    .from(tagihan)
    .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
    .where(eq(tagihan.kkId, linkedWarga.kkId))
    .orderBy(desc(tagihan.periode));

  const tagihanPending = semuaTagihan.find(t => t.status === 'belum_bayar') ?? semuaTagihan[0] ?? null;

  // Riwayat pembayaran KK warga
  const rawRiwayat = await db
    .select({
      id: pembayaran.id,
      jumlah: pembayaran.jumlah,
      dibayarPada: pembayaran.dibayarPada,
      metodeBayar: pembayaran.metodeBayar,
      namaJenis: jenisIuran.nama,
      periode: tagihan.periode
    })
    .from(pembayaran)
    .innerJoin(tagihan, eq(pembayaran.tagihanId, tagihan.id))
    .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
    .where(eq(tagihan.kkId, linkedWarga.kkId))
    .orderBy(desc(pembayaran.dibayarPada))
    .limit(5);

  const riwayatPembayaran = rawRiwayat.map(r => ({
    id: String(r.id),
    keterangan: `${r.namaJenis} (${r.periode})`,
    nominal: r.jumlah,
    tanggal: r.dibayarPada
  }));

  // Surat yang diajukan warga
  const daftarSurat = await db
    .select({
      id: surat.id,
      nomorSurat: surat.nomorSurat,
      jenis: surat.jenis,
      keperluan: surat.keperluan,
      status: surat.status,
      tanggalTerbit: surat.tanggalTerbit,
      catatanPengurus: surat.catatanPengurus,
      createdAt: surat.createdAt
    })
    .from(surat)
    .where(eq(surat.wargaId, linkedWarga.id))
    .orderBy(desc(surat.createdAt));

  return {
    namaPengguna: locals.user?.name ?? linkedWarga.nama,
    terhubung: true,
    warga: linkedWarga,
    anggotaKk,
    iuran: tagihanPending
      ? {
          bulan: tagihanPending.periode,
          nominal: tagihanPending.nominal,
          status: tagihanPending.status as 'belum_bayar' | 'lunas',
          namaJenis: tagihanPending.namaJenis
        }
      : null,
    pengumuman: listPengumuman,
    riwayatPembayaran,
    daftarSurat
  };
};
