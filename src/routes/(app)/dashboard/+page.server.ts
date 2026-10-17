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

  // 2. Kas Summary (hanya transaksi yang tidak dibatalkan)
  const [kasSummary] = await db
    .select({
      totalPemasukan: sql<number>`COALESCE(SUM(CASE WHEN ${transaksiKas.jenis} = 'pemasukan' AND ${transaksiKas.dibatalkan} = false THEN ${transaksiKas.nominal} ELSE 0 END), 0)`,
      totalPengeluaran: sql<number>`COALESCE(SUM(CASE WHEN ${transaksiKas.jenis} = 'pengeluaran' AND ${transaksiKas.dibatalkan} = false THEN ${transaksiKas.nominal} ELSE 0 END), 0)`
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

  // 6. Demografi ringkas untuk grafik dashboard (KP-03)
  // Hitung bucket usia dari semua warga aktif
  const semuaTglLahir = await db
    .select({ tanggalLahir: warga.tanggalLahir })
    .from(warga)
    .where(eq(warga.aktif, true));

  const sekarang = new Date();

  function hitungUsia(tglStr: string): number {
    const tgl = new Date(tglStr);
    if (isNaN(tgl.getTime())) return 30;
    let usia = sekarang.getFullYear() - tgl.getFullYear();
    const belumUlangTahun =
      sekarang.getMonth() < tgl.getMonth() ||
      (sekarang.getMonth() === tgl.getMonth() && sekarang.getDate() < tgl.getDate());
    if (belumUlangTahun) usia--;
    return Math.max(0, usia);
  }

  let demografiBalita = 0;
  let demografiSekolah = 0;
  let demografiProduktif = 0;
  let demografiLansia = 0;
  let kelahiranBaru = 0;
  const setahunLalu = new Date(sekarang);
  setahunLalu.setFullYear(setahunLalu.getFullYear() - 1);

  for (const w of semuaTglLahir) {
    const tgl = new Date(w.tanggalLahir);
    const usia = hitungUsia(w.tanggalLahir);
    if (!isNaN(tgl.getTime()) && tgl >= setahunLalu) kelahiranBaru++;
    if (usia <= 4) demografiBalita++;
    else if (usia <= 14) demografiSekolah++;
    else if (usia <= 64) demografiProduktif++;
    else demografiLansia++;
  }

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
    transaksiTerbaru,
    demografi: {
      balita: demografiBalita,
      sekolah: demografiSekolah,
      produktif: demografiProduktif,
      lansia: demografiLansia,
      kelahiranBaru,
      total: semuaTglLahir.length
    }
  };
};
