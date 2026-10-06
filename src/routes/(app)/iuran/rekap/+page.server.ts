import { db } from '$lib/server/db';
import { tagihan, jenisIuran, kk, rt, pembayaran } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // Semua tagihan dengan data terkait
  const semuaTagihan = await db
    .select({
      id: tagihan.id,
      periode: tagihan.periode,
      nominal: tagihan.nominal,
      status: tagihan.status,
      namaJenis: jenisIuran.nama,
      noKk: kk.noKk,
      namaWarga: sql<string>`(SELECT nama FROM warga WHERE warga.kk_id = ${kk.id} AND warga.status_hubungan_kk = 'kepala_keluarga' LIMIT 1)`,
      nomorRt: rt.nomor
    })
    .from(tagihan)
    .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
    .innerJoin(kk, eq(tagihan.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .orderBy(desc(tagihan.periode), desc(tagihan.id));

  // Summary stats
  const totalTagihan = semuaTagihan.length;
  const totalLunas = semuaTagihan.filter((t) => t.status === 'lunas').length;
  const totalBelumBayar = semuaTagihan.filter((t) => t.status === 'belum_bayar').length;
  const totalSebagian = semuaTagihan.filter((t) => t.status === 'sebagian').length;
  const totalNominal = semuaTagihan.reduce((sum, t) => sum + t.nominal, 0);
  const totalTerbayar = semuaTagihan
    .filter((t) => t.status === 'lunas')
    .reduce((sum, t) => sum + t.nominal, 0);

  // Daftar periode unik
  const periodeSet = new Set<string>();
  for (const t of semuaTagihan) {
    periodeSet.add(t.periode);
  }
  const daftarPeriode = [...periodeSet].sort().reverse();

  return {
    semuaTagihan,
    totalTagihan,
    totalLunas,
    totalBelumBayar,
    totalSebagian,
    totalNominal,
    totalTerbayar,
    daftarPeriode
  };
};
