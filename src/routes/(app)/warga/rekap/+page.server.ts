import { db } from '$lib/server/db';
import { warga, kk, rt } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // 1. Data per RT
  const rekapRt = await db
    .select({
      rtId: rt.id,
      nomorRt: rt.nomor,
      totalWarga: sql<number>`count(distinct ${warga.id})`,
      totalKk: sql<number>`count(distinct ${kk.id})`
    })
    .from(rt)
    .leftJoin(kk, eq(kk.rtId, rt.id))
    .leftJoin(warga, eq(warga.kkId, kk.id))
    .groupBy(rt.id, rt.nomor)
    .orderBy(rt.nomor);

  // 2. Jenis Kelamin
  const rekapGender = await db
    .select({
      lakiLaki: sql<number>`COALESCE(SUM(CASE WHEN ${warga.jenisKelamin} = 'L' THEN 1 ELSE 0 END), 0)`,
      perempuan: sql<number>`COALESCE(SUM(CASE WHEN ${warga.jenisKelamin} = 'P' THEN 1 ELSE 0 END), 0)`,
      total: sql<number>`count(*)`
    })
    .from(warga)
    .where(eq(warga.aktif, true));

  // 3. Status Huni KK
  const rekapHuni = await db
    .select({
      tetap: sql<number>`COALESCE(SUM(CASE WHEN ${kk.statusHuni} = 'tetap' THEN 1 ELSE 0 END), 0)`,
      kontrak: sql<number>`COALESCE(SUM(CASE WHEN ${kk.statusHuni} = 'kontrak' THEN 1 ELSE 0 END), 0)`,
      kos: sql<number>`COALESCE(SUM(CASE WHEN ${kk.statusHuni} = 'kos' THEN 1 ELSE 0 END), 0)`,
      totalKk: sql<number>`count(*)`
    })
    .from(kk);

  // 4. Perhitungan Rentang Usia (KP-01)
  const semuaTglLahir = await db
    .select({ tanggalLahir: warga.tanggalLahir })
    .from(warga)
    .where(eq(warga.aktif, true));

  const sekarang = new Date();

  /**
   * Hitung usia tepat dalam tahun penuh berdasarkan tanggal lahir lengkap.
   * Memperhitungkan bulan & hari supaya batas usia 14/15 dan 64/65 akurat.
   */
  function hitungUsia(tanggalLahirStr: string): number {
    const tgl = new Date(tanggalLahirStr);
    if (isNaN(tgl.getTime())) return 30; // fallback aman
    let usia = sekarang.getFullYear() - tgl.getFullYear();
    const belumUlangTahun =
      sekarang.getMonth() < tgl.getMonth() ||
      (sekarang.getMonth() === tgl.getMonth() && sekarang.getDate() < tgl.getDate());
    if (belumUlangTahun) usia--;
    return Math.max(0, usia);
  }

  // Bucket sesuai spesifikasi KP-01:
  //   Balita       : 0 – 4  tahun
  //   Usia Sekolah : 5 – 14 tahun  (usia 15 masuk Produktif)
  //   Produktif    : 15 – 64 tahun  (usia 65 masuk Lansia)
  //   Lansia       : ≥ 65 tahun
  let balita = 0;
  let usiaSekolah = 0;
  let produktif = 0;
  let lansia = 0;
  let kelahiranBaru = 0; // lahir dalam 365 hari terakhir (angka kelahiran baru)

  const setahunLalu = new Date(sekarang);
  setahunLalu.setFullYear(setahunLalu.getFullYear() - 1);

  for (const w of semuaTglLahir) {
    const tgl = new Date(w.tanggalLahir);
    const usia = hitungUsia(w.tanggalLahir);

    if (!isNaN(tgl.getTime()) && tgl >= setahunLalu) kelahiranBaru++;

    if (usia <= 4) balita++;
    else if (usia <= 14) usiaSekolah++;
    else if (usia <= 64) produktif++;
    else lansia++;
  }

  return {
    rekapRt,
    gender: rekapGender[0] ?? { lakiLaki: 0, perempuan: 0, total: 0 },
    huni: rekapHuni[0] ?? { tetap: 0, kontrak: 0, kos: 0, totalKk: 0 },
    usia: { balita, usiaSekolah, produktif, lansia, total: semuaTglLahir.length },
    kelahiranBaru
  };
};
