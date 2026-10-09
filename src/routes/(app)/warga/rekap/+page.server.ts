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

  // 4. Perhitungan Rentang Usia
  const semuaTglLahir = await db
    .select({ tanggalLahir: warga.tanggalLahir })
    .from(warga)
    .where(eq(warga.aktif, true));

  const sekarangTahun = new Date().getFullYear();
  let balita = 0; // 0-5
  let anak = 0; // 6-12
  let remaja = 0; // 13-17
  let dewasa = 0; // 18-59
  let lansia = 0; // 60+

  for (const w of semuaTglLahir) {
    const thn = new Date(w.tanggalLahir).getFullYear();
    const usia = Number.isNaN(thn) ? 30 : Math.max(0, sekarangTahun - thn);

    if (usia <= 5) balita++;
    else if (usia <= 12) anak++;
    else if (usia <= 17) remaja++;
    else if (usia <= 59) dewasa++;
    else lansia++;
  }

  return {
    rekapRt,
    gender: rekapGender[0] ?? { lakiLaki: 0, perempuan: 0, total: 0 },
    huni: rekapHuni[0] ?? { tetap: 0, kontrak: 0, kos: 0, totalKk: 0 },
    usia: { balita, anak, remaja, dewasa, lansia, total: semuaTglLahir.length }
  };
};
