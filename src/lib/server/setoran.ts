import { db } from '$lib/server/db';
import {
  kategoriKas,
  kk,
  jenisIuran,
  pembayaran,
  rw,
  setoranRt,
  tagihan,
  transaksiKas,
  transaksiKasRt
} from '$lib/server/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

/**
 * Porsi RW yang benar-benar terkumpul dari satu tagihan.
 *
 * Porsi mengikuti uang yang sudah masuk, bukan nominal tagihan: kalau warga
 * baru membayar separuh, RW hanya berhak atas separuh porsinya. Hasil selalu
 * dibulatkan ke rupiah penuh dan tidak pernah melebihi `porsiRw`.
 */
export function porsiTerkumpul(nominal: number, porsiRw: number, totalDibayar: number): number {
  const tagihanRp = Math.round(Number(nominal) || 0);
  const porsiRp = Math.round(Number(porsiRw) || 0);
  if (tagihanRp <= 0 || porsiRp <= 0) return 0;

  const dibayarRp = Math.max(0, Math.round(Number(totalDibayar) || 0));
  if (dibayarRp <= 0) return 0;
  if (dibayarRp >= tagihanRp) return porsiRp;

  return Math.round((porsiRp * dibayarRp) / tagihanRp);
}

export type BarisSetoran = {
  nominal: number;
  porsiRw: number;
  totalDibayar: number;
  status: string;
};

export type RingkasanSetoran = {
  totalTerkumpul: number;
  porsiRw: number;
  jumlahTagihan: number;
  jumlahLunas: number;
};

/** Ringkas tagihan satu RT satu periode menjadi angka yang siap disetor. */
export function ringkasSetoran(rows: readonly BarisSetoran[]): RingkasanSetoran {
  let totalTerkumpul = 0;
  let porsiRw = 0;
  let jumlahLunas = 0;

  for (const row of rows) {
    totalTerkumpul += Math.round(Number(row.totalDibayar) || 0);
    porsiRw += porsiTerkumpul(row.nominal, row.porsiRw, row.totalDibayar);
    if (row.status === 'lunas') jumlahLunas += 1;
  }

  return {
    totalTerkumpul,
    porsiRw,
    jumlahTagihan: rows.length,
    jumlahLunas
  };
}

/** Sisa porsi RW yang belum disetor, tidak pernah negatif. */
export function sisaPorsi(porsiRw: number, sudahDisetor: number): number {
  return Math.max(
    0,
    Math.round(Number(porsiRw) || 0) - Math.round(Number(sudahDisetor) || 0)
  );
}

/**
 * Hitung setoran satu RT untuk satu periode dari data tagihan + pembayaran.
 *
 * Hanya tagihan ber-scope `rt` yang dihitung: iuran ber-scope `rw` sudah masuk
 * kas RW saat dibayar, jadi tidak boleh disetorkan dua kali.
 */
export async function hitungSetoranRt(rtId: number, periode: string): Promise<RingkasanSetoran> {
  const baris = await db
    .select({
      id: tagihan.id,
      nominal: tagihan.nominal,
      porsiRw: tagihan.porsiRw,
      status: tagihan.status
    })
    .from(tagihan)
    .innerJoin(kk, eq(tagihan.kkId, kk.id))
    .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
    .where(
      and(eq(kk.rtId, rtId), eq(tagihan.periode, periode), eq(jenisIuran.scope, 'rt'))
    );

  if (baris.length === 0) {
    return { totalTerkumpul: 0, porsiRw: 0, jumlahTagihan: 0, jumlahLunas: 0 };
  }

  const bayar = await db
    .select({ tagihanId: pembayaran.tagihanId, jumlah: pembayaran.jumlah })
    .from(pembayaran)
    .where(
      inArray(
        pembayaran.tagihanId,
        baris.map((b) => b.id)
      )
    );

  const dibayarPerTagihan = new Map<number, number>();
  for (const row of bayar) {
    dibayarPerTagihan.set(row.tagihanId, (dibayarPerTagihan.get(row.tagihanId) ?? 0) + row.jumlah);
  }

  return ringkasSetoran(
    baris.map((b) => ({
      nominal: b.nominal,
      porsiRw: b.porsiRw,
      totalDibayar: dibayarPerTagihan.get(b.id) ?? 0,
      status: b.status
    }))
  );
}

export type CatatSetoranInput = {
  rtId: number;
  periode: string;
  tanggal: string;
  catatan?: string | null;
  bukti?: string | null;
  operator: string;
};

export type HasilSetoran = {
  id: number;
  porsiRw: number;
  totalTerkumpul: number;
};

/**
 * Catat setoran RT → RW.
 *
 * Membuat tiga baris yang saling terhubung: kas RT keluar, kas RW masuk, dan
 * `setoran_rt` sebagai bukti rekonsiliasi. Semua nominal berasal dari snapshot
 * perhitungan saat tombol ditekan, sehingga perubahan pembayaran setelahnya
 * tidak menggeser setoran yang sudah tercatat.
 */
export async function catatSetoran(input: CatatSetoranInput): Promise<HasilSetoran> {
  const ringkasan = await hitungSetoranRt(input.rtId, input.periode);
  if (ringkasan.porsiRw <= 0) {
    throw new Error('Belum ada porsi RW yang bisa disetor untuk periode ini.');
  }

  const [aktif] = await db
    .select({ id: setoranRt.id })
    .from(setoranRt)
    .where(
      and(
        eq(setoranRt.rtId, input.rtId),
        eq(setoranRt.periode, input.periode),
        eq(setoranRt.dibatalkan, false)
      )
    )
    .limit(1);

  if (aktif) {
    throw new Error('RT ini sudah menyetor porsi RW untuk periode tersebut.');
  }

  const [rwData] = await db.select().from(rw).limit(1);
  const rwId = rwData?.id ?? 1;

  let kategori = await db
    .select({ id: kategoriKas.id })
    .from(kategoriKas)
    .where(and(eq(kategoriKas.nama, 'Setoran RT'), eq(kategoriKas.rwId, rwId)))
    .limit(1);

  if (kategori.length === 0) {
    await db.insert(kategoriKas).values({
      nama: 'Setoran RT',
      jenis: 'pemasukan',
      scope: 'rw',
      rwId
    });
    kategori = await db
      .select({ id: kategoriKas.id })
      .from(kategoriKas)
      .where(and(eq(kategoriKas.nama, 'Setoran RT'), eq(kategoriKas.rwId, rwId)))
      .limit(1);
  }

  const hasil = await db.transaction(async (tx) => {
    const [keluar] = await tx
      .insert(transaksiKasRt)
      .values({
        rtId: input.rtId,
        namaKas: 'Iuran RT',
        jenis: 'pengeluaran',
        nominal: ringkasan.porsiRw,
        keterangan: `Setoran porsi RW periode ${input.periode}`,
        tanggal: input.tanggal,
        bukti: input.bukti || null,
        dicatatOleh: input.operator
      })
      .returning({ id: transaksiKasRt.id });

    const [masuk] = await tx
      .insert(transaksiKas)
      .values({
        jenis: 'pemasukan',
        nominal: ringkasan.porsiRw,
        keterangan: `Setoran porsi RW dari RT periode ${input.periode}`,
        kategoriId: kategori[0]?.id ?? null,
        tanggal: input.tanggal,
        bukti: input.bukti || null,
        dicatatOleh: input.operator,
        rwId
      })
      .returning({ id: transaksiKas.id });

    const [setoran] = await tx
      .insert(setoranRt)
      .values({
        rtId: input.rtId,
        periode: input.periode,
        totalTerkumpul: ringkasan.totalTerkumpul,
        porsiRw: ringkasan.porsiRw,
        catatan: input.catatan || null,
        bukti: input.bukti || null,
        disetorPada: input.tanggal,
        dicatatOleh: input.operator,
        transaksiRwId: masuk?.id ?? null,
        transaksiRtId: keluar?.id ?? null
      })
      .returning({ id: setoranRt.id });

    return { id: setoran.id, porsiRw: ringkasan.porsiRw, totalTerkumpul: ringkasan.totalTerkumpul };
  });

  return hasil;
}

/**
 * Batalkan setoran.
 *
 * Kedua transaksi kas ikut dibatalkan, bukan dihapus, supaya jejak audit tetap
 * ada dan saldo kembali ke kondisi sebelum setoran.
 */
export async function batalkanSetoran(
  id: number,
  alasan: string | null,
  operator: string
): Promise<void> {
  const [setoran] = await db.select().from(setoranRt).where(eq(setoranRt.id, id)).limit(1);
  if (!setoran) throw new Error('Setoran tidak ditemukan.');
  if (setoran.dibatalkan) throw new Error('Setoran ini sudah dibatalkan.');

  await db.transaction(async (tx) => {
    await tx
      .update(setoranRt)
      .set({
        dibatalkan: true,
        alasanBatal: alasan,
        dibatalkanOleh: operator
      })
      .where(eq(setoranRt.id, id));

    if (setoran.transaksiRtId) {
      await tx
        .update(transaksiKasRt)
        .set({ dibatalkan: true, alasanBatal: alasan, dibatalkanOleh: operator })
        .where(eq(transaksiKasRt.id, setoran.transaksiRtId));
    }

    if (setoran.transaksiRwId) {
      await tx
        .update(transaksiKas)
        .set({ dibatalkan: true, alasanBatal: alasan, dibatalkanOleh: operator })
        .where(eq(transaksiKas.id, setoran.transaksiRwId));
    }
  });
}
