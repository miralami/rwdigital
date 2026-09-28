import { db } from '$lib/server/db';
import { warga, kk, rt, transaksiKas, tagihan, pengumuman } from '$lib/server/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // 1. Total warga & kk
  const [wargaCount] = await db
    .select({
      total: sql<number>`count(*)`,
      totalAktif: sql<number>`COALESCE(SUM(CASE WHEN ${warga.aktif} = 1 THEN 1 ELSE 0 END), 0)`
    })
    .from(warga);

  const [kkCount] = await db
    .select({ total: sql<number>`count(*)` })
    .from(kk);

  const [rtCount] = await db
    .select({ total: sql<number>`count(*)` })
    .from(rt);

  // 2. Kas Summary
  const [kasSummary] = await db
    .select({
      totalPemasukan: sql<number>`COALESCE(SUM(CASE WHEN ${transaksiKas.jenis} = 'pemasukan' THEN ${transaksiKas.nominal} ELSE 0 END), 0)`,
      totalPengeluaran: sql<number>`COALESCE(SUM(CASE WHEN ${transaksiKas.jenis} = 'pengeluaran' THEN ${transaksiKas.nominal} ELSE 0 END), 0)`
    })
    .from(transaksiKas);

  const saldoKas = (kasSummary?.totalPemasukan ?? 0) - (kasSummary?.totalPengeluaran ?? 0);

  // 3. Iuran / Tagihan Pending
  const [tagihanSummary] = await db
    .select({
      belumBayarCount: sql<number>`COALESCE(SUM(CASE WHEN ${tagihan.status} = 'belum_bayar' THEN 1 ELSE 0 END), 0)`,
      lunasCount: sql<number>`COALESCE(SUM(CASE WHEN ${tagihan.status} = 'lunas' THEN 1 ELSE 0 END), 0)`,
      totalTagihanPending: sql<number>`COALESCE(SUM(CASE WHEN ${tagihan.status} = 'belum_bayar' THEN ${tagihan.nominal} ELSE 0 END), 0)`
    })
    .from(tagihan);

  // 4. Latest pengumuman
  const pengumumanTerbaru = await db
    .select({
      id: pengumuman.id,
      judul: pengumuman.judul,
      kategori: pengumuman.kategori,
      createdAt: pengumuman.createdAt
    })
    .from(pengumuman)
    .where(eq(pengumuman.ditampilkan, true))
    .orderBy(desc(pengumuman.createdAt))
    .limit(4);

  // 5. Recent transaksi kas
  const transaksiTerbaru = await db
    .select({
      id: transaksiKas.id,
      jenis: transaksiKas.jenis,
      nominal: transaksiKas.nominal,
      keterangan: transaksiKas.keterangan,
      tanggal: transaksiKas.tanggal
    })
    .from(transaksiKas)
    .orderBy(desc(transaksiKas.tanggal), desc(transaksiKas.id))
    .limit(5);

  return {
    user: locals.user,
    stats: {
      totalWarga: wargaCount?.total ?? 0,
      totalWargaAktif: wargaCount?.totalAktif ?? 0,
      totalKk: kkCount?.total ?? 0,
      totalRt: rtCount?.total ?? 0,
      saldoKas,
      totalPemasukan: kasSummary?.totalPemasukan ?? 0,
      totalPengeluaran: kasSummary?.totalPengeluaran ?? 0,
      belumBayarCount: tagihanSummary?.belumBayarCount ?? 0,
      lunasCount: tagihanSummary?.lunasCount ?? 0,
      totalTagihanPending: tagihanSummary?.totalTagihanPending ?? 0
    },
    pengumumanTerbaru,
    transaksiTerbaru
  };
};
