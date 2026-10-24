import { db } from '$lib/server/db';
import {
  transaksiKas,
  transaksiKasRt,
  kategoriKas,
  rt,
  rw,
  kk,
  tagihan,
  jenisIuran,
  pembayaran
} from '$lib/server/db/schema';
import { eq, sql, desc, and } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { saveUploadedFile } from '$lib/server/storage';
import { getMidtransConfig, checkMidtransTransactionStatus } from '$lib/server/midtrans';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const midtransConfig = getMidtransConfig();

  // Sinkronkan status return jika ada redirect dari Midtrans (harus diverifikasi ke server Midtrans)
  const returnOrderId = url.searchParams.get('order_id');
  if (returnOrderId) {
    try {
      const checkRes = await checkMidtransTransactionStatus(returnOrderId);
      if (checkRes.verified && (checkRes.transactionStatus === 'settlement' || checkRes.transactionStatus === 'capture')) {
        const typeStr = checkRes.paymentType || 'midtrans';
        await db
          .update(transaksiKasRt)
          .set({
            midtransStatus: 'settlement',
            midtransPaymentType: typeStr,
            bukti: `Midtrans ${typeStr.toUpperCase()} (Lunas - ${returnOrderId})`
          })
          .where(eq(transaksiKasRt.midtransOrderId, returnOrderId));
      }
    } catch (err) {
      console.warn('[Midtrans Return Verification Error]:', err);
    }
  }

  const [rwData] = await db.select().from(rw).limit(1);
  const rwId = rwData?.id ?? 1;

  // ─── 1. Daftar RT & Kategori ───────────────────────────────────────────────
  const daftarRt = await db.select().from(rt).where(eq(rt.rwId, rwId)).orderBy(rt.nomor);
  const semuaKategori = await db.select().from(kategoriKas).where(eq(kategoriKas.rwId, rwId));

  // ─── 2. Kas Internal RW ───────────────────────────────────────────────────
  const semuaTransaksiRw = await db
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
      dibatalkanOleh: transaksiKas.dibatalkanOleh,
      createdAt: transaksiKas.createdAt
    })
    .from(transaksiKas)
    .leftJoin(kategoriKas, eq(transaksiKas.kategoriId, kategoriKas.id))
    .where(eq(transaksiKas.rwId, rwId))
    .orderBy(desc(transaksiKas.tanggal), desc(transaksiKas.id));

  const [saldoRwResult] = await db
    .select({
      totalPemasukan: sql<number>`COALESCE(SUM(CASE WHEN ${transaksiKas.jenis} = 'pemasukan' AND ${transaksiKas.dibatalkan} = false THEN ${transaksiKas.nominal} ELSE 0 END), 0)`,
      totalPengeluaran: sql<number>`COALESCE(SUM(CASE WHEN ${transaksiKas.jenis} = 'pengeluaran' AND ${transaksiKas.dibatalkan} = false THEN ${transaksiKas.nominal} ELSE 0 END), 0)`
    })
    .from(transaksiKas)
    .where(eq(transaksiKas.rwId, rwId));

  const totalPemasukanRw = saldoRwResult?.totalPemasukan ?? 0;
  const totalPengeluaranRw = saldoRwResult?.totalPengeluaran ?? 0;
  const saldoRw = totalPemasukanRw - totalPengeluaranRw;

  // ─── 3. Kas Mandiri per-RT (KU-01) ─────────────────────────────────────────
  const semuaTransaksiRt = await db
    .select({
      id: transaksiKasRt.id,
      rtId: transaksiKasRt.rtId,
      nomorRt: rt.nomor,
      namaKas: transaksiKasRt.namaKas,
      jenis: transaksiKasRt.jenis,
      nominal: transaksiKasRt.nominal,
      keterangan: transaksiKasRt.keterangan,
      kategoriId: transaksiKasRt.kategoriId,
      namaKategori: kategoriKas.nama,
      tanggal: transaksiKasRt.tanggal,
      bukti: transaksiKasRt.bukti,
      dicatatOleh: transaksiKasRt.dicatatOleh,
      dibatalkan: transaksiKasRt.dibatalkan,
      alasanBatal: transaksiKasRt.alasanBatal,
      dibatalkanOleh: transaksiKasRt.dibatalkanOleh,
      metodePembayaran: transaksiKasRt.metodePembayaran,
      midtransOrderId: transaksiKasRt.midtransOrderId,
      midtransPaymentType: transaksiKasRt.midtransPaymentType,
      midtransStatus: transaksiKasRt.midtransStatus,
      snapToken: transaksiKasRt.snapToken,
      createdAt: transaksiKasRt.createdAt
    })
    .from(transaksiKasRt)
    .innerJoin(rt, eq(transaksiKasRt.rtId, rt.id))
    .leftJoin(kategoriKas, eq(transaksiKasRt.kategoriId, kategoriKas.id))
    .orderBy(desc(transaksiKasRt.tanggal), desc(transaksiKasRt.id));

  // Rekapitulasi Saldo per-RT
  const rekapSaldoRt = daftarRt.map((rtItem) => {
    const transaksiRtIni = semuaTransaksiRt.filter(
      (t) => t.rtId === rtItem.id && !t.dibatalkan
    );
    const totalPemasukan = transaksiRtIni
      .filter((t) =>
        t.jenis === 'pemasukan' &&
        (t.metodePembayaran !== 'midtrans' || t.midtransStatus === 'settlement' || t.midtransStatus === 'capture')
      )
      .reduce((sum, t) => sum + t.nominal, 0);
    const totalPengeluaran = transaksiRtIni
      .filter((t) => t.jenis === 'pengeluaran')
      .reduce((sum, t) => sum + t.nominal, 0);
    const saldo = totalPemasukan - totalPengeluaran;

    // Sub-kas yang ada di RT ini (misal Kas Sosial Kematian, Kas Operasional RT)
    const bukuKasSet = new Set<string>();
    for (const t of transaksiRtIni) {
      if (t.namaKas) bukuKasSet.add(t.namaKas);
    }

    return {
      rtId: rtItem.id,
      nomorRt: rtItem.nomor,
      totalPemasukan,
      totalPengeluaran,
      saldo,
      jumlahTransaksi: transaksiRtIni.length,
      daftarBukuKas: [...bukuKasSet]
    };
  });

  const totalPemasukanRtAgregat = rekapSaldoRt.reduce((s, r) => s + r.totalPemasukan, 0);
  const totalPengeluaranRtAgregat = rekapSaldoRt.reduce((s, r) => s + r.totalPengeluaran, 0);
  const totalSaldoRtAgregat = totalPemasukanRtAgregat - totalPengeluaranRtAgregat;

  // Nama-nama kas RT mandiri yang telah tercatat
  const namaKasSet = new Set<string>(['Kas Sosial Kematian', 'Kas Rukun Kematian', 'Kas Operasional RT']);
  for (const t of semuaTransaksiRt) {
    if (t.namaKas) namaKasSet.add(t.namaKas);
  }
  const daftarNamaKas = [...namaKasSet];

  // ─── 4. Rekapitulasi Iuran Wajib RT (KU-02) ───────────────────────────────
  // Ambil daftar KK dan tagihannya
  const semuaKk = await db
    .select({
      id: kk.id,
      rtId: kk.rtId,
      nomorRt: rt.nomor,
      noKk: kk.noKk
    })
    .from(kk)
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .where(eq(rt.rwId, rwId));

  const semuaTagihan = await db
    .select({
      id: tagihan.id,
      kkId: tagihan.kkId,
      rtId: kk.rtId,
      nomorRt: rt.nomor,
      periode: tagihan.periode,
      nominal: tagihan.nominal,
      status: tagihan.status,
      namaJenis: jenisIuran.nama
    })
    .from(tagihan)
    .innerJoin(kk, eq(tagihan.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
    .where(eq(rt.rwId, rwId));

  // Ambil daftar periode tagihan
  const periodeSet = new Set<string>();
  for (const t of semuaTagihan) {
    if (t.periode) periodeSet.add(t.periode);
  }
  const daftarPeriodeIuran = [...periodeSet].sort().reverse();
  const periodeAktif = url.searchParams.get('periodeIuran') || daftarPeriodeIuran[0] || '2026-10';

  // Rekap penerimaan iuran per RT untuk periode aktif
  const tagihanPeriodeIni = semuaTagihan.filter((t) => t.periode === periodeAktif);

  const rekapIuranRt = daftarRt.map((rtItem) => {
    const kkDiRt = semuaKk.filter((k) => k.rtId === rtItem.id);
    const tagihanDiRt = tagihanPeriodeIni.filter((t) => t.rtId === rtItem.id);

    const totalKk = kkDiRt.length;
    const lunas = tagihanDiRt.filter((t) => t.status === 'lunas').length;
    const belumBayar = tagihanDiRt.filter((t) => t.status === 'belum_bayar').length;
    const sebagian = tagihanDiRt.filter((t) => t.status === 'sebagian').length;

    const nominalTerkumpul = tagihanDiRt
      .filter((t) => t.status === 'lunas')
      .reduce((sum, t) => sum + t.nominal, 0);

    const targetNominal = tagihanDiRt.reduce((sum, t) => sum + t.nominal, 0);
    const persen = targetNominal > 0 ? Math.round((nominalTerkumpul / targetNominal) * 100) : 0;

    return {
      rtId: rtItem.id,
      nomorRt: rtItem.nomor,
      totalKk,
      lunas,
      belumBayar,
      sebagian,
      nominalTerkumpul,
      targetNominal,
      persentase: persen
    };
  });

  const totalIuranTerkumpul = rekapIuranRt.reduce((s, r) => s + r.nominalTerkumpul, 0);
  const totalIuranTarget = rekapIuranRt.reduce((s, r) => s + r.targetNominal, 0);
  const persentaseIuranRw = totalIuranTarget > 0 ? Math.round((totalIuranTerkumpul / totalIuranTarget) * 100) : 0;

  return {
    rwData,
    daftarRt,
    semuaKategori,
    // Kas RW
    semuaTransaksiRw,
    totalPemasukanRw,
    totalPengeluaranRw,
    saldoRw,
    // Kas RT (KU-01)
    semuaTransaksiRt,
    rekapSaldoRt,
    totalPemasukanRtAgregat,
    totalPengeluaranRtAgregat,
    totalSaldoRtAgregat,
    daftarNamaKas,
    // Rekap Iuran RT (KU-02)
    rekapIuranRt,
    daftarPeriodeIuran,
    periodeAktif,
    totalIuranTerkumpul,
    totalIuranTarget,
    persentaseIuranRw,
    // Midtrans Config
    midtransClientKey: midtransConfig.clientKey,
    midtransSnapUrl: midtransConfig.snapUrl,
    midtransIsProduction: midtransConfig.isProduction
  };
};

export const actions: Actions = {
  // ─── Aksi Kas RW ─────────────────────────────────────────────────────────
  tambahKasRw: async ({ request, locals }) => {
    const formData = await request.formData();
    const jenis = String(formData.get('jenis')) as 'pemasukan' | 'pengeluaran';
    const nominal = Number(formData.get('nominal'));
    const keterangan = String(formData.get('keterangan') || '').trim();
    const kategoriId = formData.get('kategoriId') ? Number(formData.get('kategoriId')) : null;
    const tanggal = String(formData.get('tanggal') || new Date().toISOString().slice(0, 10));

    if (!nominal || nominal <= 0 || !keterangan) {
      return fail(400, { errorKasRw: 'Nominal dan keterangan wajib diisi.' });
    }

    const [rwData] = await db.select().from(rw).limit(1);
    const buktiFile = formData.get('buktiFile') as File | null;
    let buktiPath: string | null = null;
    if (buktiFile && buktiFile.size > 0) {
      buktiPath = await saveUploadedFile(buktiFile, 'kas');
    }

    const operator = locals.user?.name ?? locals.user?.id ?? 'Bendahara RW';

    await db.insert(transaksiKas).values({
      jenis,
      nominal,
      keterangan,
      kategoriId,
      tanggal,
      bukti: buktiPath,
      dicatatOleh: operator,
      rwId: rwData?.id ?? 1
    });

    return { successKasRw: true };
  },

  batalkanKasRw: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = Number(formData.get('transaksiId'));
    const alasan = String(formData.get('alasan') || 'Koreksi pembukuan kas RW').trim();
    const operator = locals.user?.name ?? locals.user?.id ?? 'Bendahara';

    await db
      .update(transaksiKas)
      .set({
        dibatalkan: true,
        alasanBatal: alasan,
        dibatalkanOleh: operator
      })
      .where(eq(transaksiKas.id, id));

    return { successBatalRw: true };
  },

  // ─── Aksi Kas RT (KU-01) ──────────────────────────────────────────────────
  tambahKasRt: async ({ request, locals }) => {
    const formData = await request.formData();
    const rtId = Number(formData.get('rtId'));
    const namaKas = String(formData.get('namaKas') || 'Kas Sosial Kematian').trim();
    const jenis = String(formData.get('jenis')) as 'pemasukan' | 'pengeluaran';
    const nominal = Number(formData.get('nominal'));
    const keterangan = String(formData.get('keterangan') || '').trim();
    const kategoriId = formData.get('kategoriId') ? Number(formData.get('kategoriId')) : null;
    const tanggal = String(formData.get('tanggal') || new Date().toISOString().slice(0, 10));

    if (!rtId || !nominal || nominal <= 0 || !keterangan) {
      return fail(400, { errorKasRt: 'RT, nominal, dan keterangan wajib diisi.' });
    }

    const buktiFile = formData.get('buktiFile') as File | null;
    let buktiPath: string | null = null;
    if (buktiFile && buktiFile.size > 0) {
      buktiPath = await saveUploadedFile(buktiFile, 'kas');
    }

    const operator = locals.user?.name ?? locals.user?.id ?? `Bendahara RT`;

    await db.insert(transaksiKasRt).values({
      rtId,
      namaKas,
      jenis,
      nominal,
      keterangan,
      kategoriId,
      tanggal,
      bukti: buktiPath,
      dicatatOleh: operator,
      metodePembayaran: String(formData.get('metodePembayaran') || 'tunai')
    });

    return { successKasRt: true };
  },

  batalkanKasRt: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = Number(formData.get('transaksiId'));
    const alasan = String(formData.get('alasan') || 'Koreksi pembukuan kas RT').trim();
    const operator = locals.user?.name ?? locals.user?.id ?? 'Bendahara';

    if (!id) {
      return fail(400, { errorKasRt: 'ID transaksi tidak valid.' });
    }

    const [transaksi] = await db
      .select()
      .from(transaksiKasRt)
      .where(eq(transaksiKasRt.id, id))
      .limit(1);

    if (!transaksi) {
      return fail(404, { errorKasRt: 'Transaksi tidak ditemukan.' });
    }

    if (
      transaksi.metodePembayaran === 'midtrans' &&
      (transaksi.midtransStatus === 'settlement' || transaksi.midtransStatus === 'capture')
    ) {
      return fail(400, {
        errorKasRt: 'Transaksi online Midtrans yang sudah lunas (settlement) tidak dapat dibatalkan.'
      });
    }

    await db
      .update(transaksiKasRt)
      .set({
        dibatalkan: true,
        alasanBatal: alasan,
        dibatalkanOleh: operator
      })
      .where(eq(transaksiKasRt.id, id));

    return { successBatalRt: true };
  },

  // ─── Aksi Rekapitulasi Setoran Iuran RT (KU-02) ───────────────────────────
  catatSetoranRt: async ({ request, locals }) => {
    const formData = await request.formData();
    const rtId = Number(formData.get('rtId'));
    const periode = String(formData.get('periode') || '').trim();
    const rawJumlah = formData.get('jumlahKkDisetor');
    const jumlahKkDisetor = rawJumlah && String(rawJumlah).trim() !== '' ? Number(rawJumlah) : null;

    if (!rtId) {
      return fail(400, { errorSetoran: 'Pilih RT yang menyetor.' });
    }
    if (!periode || !/^\d{4}-\d{2}$/.test(periode)) {
      return fail(400, { errorSetoran: 'Periode iuran wajib diisi dengan format YYYY-MM (misal: 2026-10).' });
    }
    if (jumlahKkDisetor !== null && (isNaN(jumlahKkDisetor) || jumlahKkDisetor < 1)) {
      return fail(400, { errorSetoran: 'Jumlah KK yang disetor harus berupa angka positif minimal 1.' });
    }

    // Ambil tagihan yang belum lunas di RT tersebut dengan urutan deterministik (nomor KK lalu ID tagihan)
    const baseQuery = db
      .select({ id: tagihan.id, nominal: tagihan.nominal, noKk: kk.noKk })
      .from(tagihan)
      .innerJoin(kk, eq(tagihan.kkId, kk.id))
      .where(
        and(
          eq(kk.rtId, rtId),
          eq(tagihan.periode, periode),
          eq(tagihan.status, 'belum_bayar')
        )
      )
      .orderBy(kk.noKk, tagihan.id);

    const tagihanBelumLunas = jumlahKkDisetor ? await baseQuery.limit(jumlahKkDisetor) : await baseQuery;

    if (tagihanBelumLunas.length === 0) {
      return fail(400, { errorSetoran: `Tidak ada tagihan 'belum_bayar' untuk RT ini pada periode ${periode}.` });
    }

    const operator = locals.user?.name ?? locals.user?.id ?? 'Bendahara RT';
    const nowIso = new Date().toISOString();

    for (const item of tagihanBelumLunas) {
      await db
        .update(tagihan)
        .set({ status: 'lunas' })
        .where(eq(tagihan.id, item.id));

      await db.insert(pembayaran).values({
        tagihanId: item.id,
        jumlah: item.nominal,
        metodeBayar: 'tunai',
        referensi: `REKAP-RT-${rtId}-${periode}`,
        catatan: `Setoran kolektif rekap iuran warga RT (KK: ${item.noKk})`,
        dibayarPada: nowIso,
        dicatatOleh: operator
      });
    }

    return { successSetoran: true, jumlahTersetor: tagihanBelumLunas.length };
  },

  // ─── Aksi Kategori Kas (KU-04) ────────────────────────────────────────────
  tambahKategori: async ({ request }) => {
    const formData = await request.formData();
    const nama = String(formData.get('nama') || '').trim();
    const jenis = String(formData.get('jenis')) as 'pemasukan' | 'pengeluaran';
    const scope = String(formData.get('scope') || 'semua') as 'semua' | 'rw' | 'rt';

    if (!nama) {
      return fail(400, { errorKategori: 'Nama kategori wajib diisi.' });
    }

    const [rwData] = await db.select().from(rw).limit(1);

    await db.insert(kategoriKas).values({
      nama,
      jenis,
      scope,
      rwId: rwData?.id ?? 1
    });

    return { successKategori: true };
  },

  hapusKategori: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get('id'));

    if (!id) {
      return fail(400, { errorHapusKategori: 'ID kategori tidak valid.' });
    }

    // Cek relasi foreign key sebelum menghapus
    const [usedInRw] = await db
      .select({ id: transaksiKas.id })
      .from(transaksiKas)
      .where(eq(transaksiKas.kategoriId, id))
      .limit(1);

    if (usedInRw) {
      return fail(400, {
        errorHapusKategori: 'Kategori tidak dapat dihapus karena masih digunakan dalam catatan transaksi Kas RW.'
      });
    }

    const [usedInRt] = await db
      .select({ id: transaksiKasRt.id })
      .from(transaksiKasRt)
      .where(eq(transaksiKasRt.kategoriId, id))
      .limit(1);

    if (usedInRt) {
      return fail(400, {
        errorHapusKategori: 'Kategori tidak dapat dihapus karena masih digunakan dalam catatan transaksi Kas RT.'
      });
    }

    try {
      await db.delete(kategoriKas).where(eq(kategoriKas.id, id));
      return { successHapusKategori: true };
    } catch (err: any) {
      return fail(400, {
        errorHapusKategori: 'Gagal menghapus kategori: terdapat data yang terkait pada database.'
      });
    }
  }
};
