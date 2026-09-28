import { db } from '$lib/server/db';
import { transaksiKas, kategoriKas } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const semuaTransaksi = await db
    .select({
      id: transaksiKas.id,
      jenis: transaksiKas.jenis,
      nominal: transaksiKas.nominal,
      keterangan: transaksiKas.keterangan,
      kategoriId: transaksiKas.kategoriId,
      namaKategori: kategoriKas.nama,
      tanggal: transaksiKas.tanggal,
      dicatatOleh: transaksiKas.dicatatOleh
    })
    .from(transaksiKas)
    .leftJoin(kategoriKas, eq(transaksiKas.kategoriId, kategoriKas.id))
    .orderBy(transaksiKas.tanggal);

  const [saldoResult] = await db
    .select({
      totalPemasukan: sql<number>`COALESCE(SUM(CASE WHEN ${transaksiKas.jenis} = 'pemasukan' THEN ${transaksiKas.nominal} ELSE 0 END), 0)`,
      totalPengeluaran: sql<number>`COALESCE(SUM(CASE WHEN ${transaksiKas.jenis} = 'pengeluaran' THEN ${transaksiKas.nominal} ELSE 0 END), 0)`
    })
    .from(transaksiKas);

  const saldo = saldoResult.totalPemasukan - saldoResult.totalPengeluaran;

  return {
    semuaTransaksi,
    saldo,
    totalPemasukan: saldoResult.totalPemasukan,
    totalPengeluaran: saldoResult.totalPengeluaran
  };
};
