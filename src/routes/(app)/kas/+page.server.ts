import { db } from '$lib/server/db';
import { transaksiKas, kategoriKas } from '$lib/server/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

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
      bukti: transaksiKas.bukti,
      dicatatOleh: transaksiKas.dicatatOleh,
      dibatalkan: transaksiKas.dibatalkan,
      alasanBatal: transaksiKas.alasanBatal,
      dibatalkanOleh: transaksiKas.dibatalkanOleh
    })
    .from(transaksiKas)
    .leftJoin(kategoriKas, eq(transaksiKas.kategoriId, kategoriKas.id))
    .orderBy(desc(transaksiKas.tanggal), desc(transaksiKas.id));

  // Hanya hitung transaksi yang TIDAK dibatalkan
  const [saldoResult] = await db
    .select({
      totalPemasukan: sql<number>`COALESCE(SUM(CASE WHEN ${transaksiKas.jenis} = 'pemasukan' AND ${transaksiKas.dibatalkan} = false THEN ${transaksiKas.nominal} ELSE 0 END), 0)`,
      totalPengeluaran: sql<number>`COALESCE(SUM(CASE WHEN ${transaksiKas.jenis} = 'pengeluaran' AND ${transaksiKas.dibatalkan} = false THEN ${transaksiKas.nominal} ELSE 0 END), 0)`
    })
    .from(transaksiKas);

  const saldo = (saldoResult?.totalPemasukan ?? 0) - (saldoResult?.totalPengeluaran ?? 0);

  return {
    semuaTransaksi,
    saldo,
    totalPemasukan: saldoResult?.totalPemasukan ?? 0,
    totalPengeluaran: saldoResult?.totalPengeluaran ?? 0
  };
};

export const actions: Actions = {
  batalkan: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = Number(formData.get('transaksiId'));
    const alasan = String(formData.get('alasan') || 'Koreksi pembukuan kas').trim();
    const operator = locals.user?.name ?? locals.user?.id ?? 'Bendahara';

    await db
      .update(transaksiKas)
      .set({
        dibatalkan: true,
        alasanBatal: alasan,
        dibatalkanOleh: operator
      })
      .where(eq(transaksiKas.id, id));

    return { success: true };
  }
};
