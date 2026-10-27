import { db } from '$lib/server/db';
import {
  pembayaran,
  tagihan,
  jenisIuran,
  kk,
  transaksiKas,
  kategoriKas
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Aturan status tagihan setelah pembayaran.
 *
 * Angka dibulatkan ke rupiah penuh supaya selisih floating point tidak membuat
 * tagihan yang sebenarnya lunas tetap berstatus "sebagian".
 */
export function statusTagihan(nominal: number, totalDibayar: number): 'lunas' | 'sebagian' | 'belum_bayar' {
  const tagihanRp = Math.round(Number(nominal) || 0);
  const dibayarRp = Math.round(Number(totalDibayar) || 0);

  if (dibayarRp <= 0) return 'belum_bayar';
  return dibayarRp >= tagihanRp ? 'lunas' : 'sebagian';
}

/** Sisa tagihan, tidak pernah negatif. */
export function hitungSisa(nominal: number, totalDibayar: number): number {
  const sisa = Math.round(Number(nominal) || 0) - Math.round(Number(totalDibayar) || 0);
  return Math.max(0, sisa);
}

export type RingkasanTagihan = {
  totalTagihan: number;
  totalDibayar: number;
  sisa: number;
  jumlahBelumLunas: number;
};

/** Ringkasan untuk kartu portal warga. */
export function ringkasTagihan(
  rows: readonly { nominal: number; totalDibayar: number; status: string }[]
): RingkasanTagihan {
  let totalTagihan = 0;
  let totalDibayar = 0;
  let jumlahBelumLunas = 0;

  for (const row of rows) {
    totalTagihan += Number(row.nominal) || 0;
    totalDibayar += Number(row.totalDibayar) || 0;
    if (row.status !== 'lunas') jumlahBelumLunas += 1;
  }

  return {
    totalTagihan,
    totalDibayar,
    sisa: Math.max(0, totalTagihan - totalDibayar),
    jumlahBelumLunas
  };
}

export type CatatPembayaranInput = {
  tagihanId: number;
  jumlah: number;
  metodeBayar: 'qris' | 'tunai' | 'transfer';
  referensi?: string | null;
  catatan?: string | null;
  dibayarPada: string;
  operator: string;
};

export type HasilPembayaran = {
  status: 'lunas' | 'sebagian' | 'belum_bayar';
  totalDibayar: number;
  sisa: number;
};

/**
 * Catat pembayaran resmi untuk satu tagihan.
 *
 * Satu tempat untuk seluruh alur (staf mencatat langsung maupun bendahara
 * menerima konfirmasi warga) supaya status tagihan dan kas RW tidak pernah
 * dihitung dengan cara berbeda.
 */
export async function catatPembayaran(input: CatatPembayaranInput): Promise<HasilPembayaran> {
  const [tagihanData] = await db.select().from(tagihan).where(eq(tagihan.id, input.tagihanId));
  if (!tagihanData) throw new Error('Tagihan tidak ditemukan.');

  const [detail] = await db
    .select({
      jenisNama: jenisIuran.nama,
      noKk: kk.noKk,
      rwId: jenisIuran.rwId,
      periode: tagihan.periode
    })
    .from(tagihan)
    .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
    .innerJoin(kk, eq(tagihan.kkId, kk.id))
    .where(eq(tagihan.id, input.tagihanId));

  const sebelumnya = await db
    .select({ jumlah: pembayaran.jumlah })
    .from(pembayaran)
    .where(eq(pembayaran.tagihanId, input.tagihanId));
  const totalSebelum = sebelumnya.reduce((jumlah, row) => jumlah + row.jumlah, 0);

  await db.insert(pembayaran).values({
    tagihanId: input.tagihanId,
    jumlah: input.jumlah,
    metodeBayar: input.metodeBayar,
    referensi: input.referensi || null,
    catatan: input.catatan || null,
    dibayarPada: input.dibayarPada,
    dicatatOleh: input.operator
  });

  const totalDibayar = totalSebelum + input.jumlah;
  const status = statusTagihan(tagihanData.nominal, totalDibayar);
  await db.update(tagihan).set({ status }).where(eq(tagihan.id, input.tagihanId));

  // Rekam ke kas RW supaya laporan keuangan ikut bergerak.
  const [katIuran] = await db
    .select()
    .from(kategoriKas)
    .where(eq(kategoriKas.nama, 'Iuran'))
    .limit(1);

  await db.insert(transaksiKas).values({
    jenis: 'pemasukan',
    nominal: input.jumlah,
    keterangan: `Pembayaran ${detail?.jenisNama ?? 'Iuran'} (${detail?.periode ?? tagihanData.periode}) - No. KK ${detail?.noKk ?? ''}`,
    kategoriId: katIuran?.id ?? null,
    tanggal: input.dibayarPada.slice(0, 10),
    dicatatOleh: input.operator,
    rwId: detail?.rwId ?? 1
  });

  return {
    status,
    totalDibayar,
    sisa: hitungSisa(tagihanData.nominal, totalDibayar)
  };
}
