import { db } from '$lib/server/db';
import { warga, kk, rt, transaksiKas, transaksiKasRt, tagihan, pengumuman, surat } from '$lib/server/db/schema';
import { and, desc, eq, isNull, or, sql } from 'drizzle-orm';
import { hitungBucketUsia } from '$lib/server/usia';
import { hitungSaldo } from '$lib/server/kas';
import { permissionsOf } from '$lib/server/rbac';
import { scopeFromRole } from '$lib/server/scope';
import type { PageServerLoad } from './$types';

/**
 * Filter baris per RT.
 *
 * - `undefined` → tanpa batasan (peran ber-scope `all`).
 * - `eq(...)` → satu RT (peran ber-scope `rt` dengan penugasan).
 * - `0 = 1` → tidak ada baris (belum ditugaskan), supaya angka RW tidak bocor
 *   ke akun yang belum dipetakan ke wilayah.
 */
function filterRt(scope: ReturnType<typeof scopeFromRole>) {
  if (scope.kind === 'all') return undefined;
  if (scope.kind === 'rt') return eq(kk.rtId, scope.rtId);
  return sql`0 = 1`;
}

export const load: PageServerLoad = async ({ locals }) => {
  const scope = scopeFromRole(locals);
  const izin = permissionsOf(locals);

  // Setiap blok dashboard hanya dihitung kalau akun memang boleh membaca
  // modulnya. Ini mencegah angka modul yang tidak boleh dilihat ikut terkirim
  // ke browser lewat data halaman.
  const akses = {
    warga: izin.can('warga', 'read'),
    kas: izin.can('kas', 'read'),
    iuran: izin.can('iuran', 'read'),
    surat: izin.can('surat', 'read'),
    pengumuman: izin.can('pengumuman', 'read')
  };

  // 1. Total warga & KK — mengikuti wilayah kerja pengurus RT.
  const batasWarga = filterRt(scope);

  let wargaCount: { total: number; totalAktif: number } | undefined;
  let kkCount: { total: number } | undefined;
  let rtCount: { total: number } | undefined;

  if (akses.warga) {
    [wargaCount] = await db
      .select({
        total: sql<number>`count(*)`,
        totalAktif: sql<number>`COALESCE(SUM(CASE WHEN ${warga.aktif} = 1 THEN 1 ELSE 0 END), 0)`
      })
      .from(warga)
      .innerJoin(kk, eq(warga.kkId, kk.id))
      .where(batasWarga);

    [kkCount] = await db
      .select({ total: sql<number>`count(*)` })
      .from(kk)
      .where(
        scope.kind === 'all'
          ? undefined
          : scope.kind === 'rt'
            ? eq(kk.rtId, scope.rtId)
            : sql`0 = 1`
      );

    [rtCount] = await db
      .select({ total: sql<number>`count(*)` })
      .from(rt)
      .where(
        scope.kind === 'all'
          ? undefined
          : scope.kind === 'rt'
            ? eq(rt.id, scope.rtId)
            : sql`0 = 1`
      );
  }

  // 2. Kas — RW penuh melihat kas RW, pengurus RT melihat kas RT-nya.
  let ringkasanKas = { pemasukan: 0, pengeluaran: 0, saldo: 0 };

  if (akses.kas && scope.kind === 'all') {
    const [kasSummary] = await db
      .select({
        totalPemasukan: sql<number>`COALESCE(SUM(CASE WHEN ${transaksiKas.jenis} = 'pemasukan' AND ${transaksiKas.dibatalkan} = false THEN ${transaksiKas.nominal} ELSE 0 END), 0)`,
        totalPengeluaran: sql<number>`COALESCE(SUM(CASE WHEN ${transaksiKas.jenis} = 'pengeluaran' AND ${transaksiKas.dibatalkan} = false THEN ${transaksiKas.nominal} ELSE 0 END), 0)`
      })
      .from(transaksiKas);

    const pemasukan = kasSummary?.totalPemasukan ?? 0;
    const pengeluaran = kasSummary?.totalPengeluaran ?? 0;
    ringkasanKas = { pemasukan, pengeluaran, saldo: pemasukan - pengeluaran };
  } else if (akses.kas && scope.kind === 'rt') {
    // Aturan Midtrans sama dengan halaman /kas: pemasukan online baru dihitung
    // setelah settlement/capture.
    const barisKasRt = await db
      .select({
        jenis: transaksiKasRt.jenis,
        nominal: transaksiKasRt.nominal,
        dibatalkan: transaksiKasRt.dibatalkan,
        metodePembayaran: transaksiKasRt.metodePembayaran,
        midtransStatus: transaksiKasRt.midtransStatus
      })
      .from(transaksiKasRt)
      .where(eq(transaksiKasRt.rtId, scope.rtId));

    const terhitung = barisKasRt.filter(
      (t) =>
        t.jenis === 'pengeluaran' ||
        t.metodePembayaran !== 'midtrans' ||
        t.midtransStatus === 'settlement' ||
        t.midtransStatus === 'capture'
    );

    const { pemasukan, pengeluaran, saldo } = hitungSaldo(terhitung);
    ringkasanKas = { pemasukan, pengeluaran, saldo };
  }

  // 3. Iuran / tagihan — hanya tagihan milik KK di wilayah yang boleh dilihat.
  let tagihanSummary: {
    belumBayarCount: number;
    lunasCount: number;
    totalTagihanPending: number;
  } | undefined;

  if (akses.iuran) {
    [tagihanSummary] = await db
      .select({
        belumBayarCount: sql<number>`COALESCE(SUM(CASE WHEN ${tagihan.status} = 'belum_bayar' THEN 1 ELSE 0 END), 0)`,
        lunasCount: sql<number>`COALESCE(SUM(CASE WHEN ${tagihan.status} = 'lunas' THEN 1 ELSE 0 END), 0)`,
        totalTagihanPending: sql<number>`COALESCE(SUM(CASE WHEN ${tagihan.status} = 'belum_bayar' THEN ${tagihan.nominal} ELSE 0 END), 0)`
      })
      .from(tagihan)
      .innerJoin(kk, eq(tagihan.kkId, kk.id))
      .where(batasWarga);
  }

  // 4. Pengajuan Surat Pengantar menunggu proses
  let suratPendingCount = 0;
  if (akses.surat) {
    const [sc] = await db
      .select({ count: sql<number>`count(*)` })
      .from(surat)
      .innerJoin(warga, eq(surat.wargaId, warga.id))
      .innerJoin(kk, eq(warga.kkId, kk.id))
      .where(and(eq(surat.status, 'diajukan'), batasWarga));
    suratPendingCount = Number(sc?.count ?? 0);
  }

  // 5. Pengumuman: RW global + pengumuman RT sendiri untuk pengurus RT.
  const pengumumanTerbaru = akses.pengumuman
    ? await db
        .select({
          id: pengumuman.id,
          judul: pengumuman.judul,
          kategori: pengumuman.kategori,
          createdAt: pengumuman.createdAt
        })
        .from(pengumuman)
        .where(
          and(
            eq(pengumuman.ditampilkan, true),
            scope.kind === 'rt'
              ? or(isNull(pengumuman.rtId), eq(pengumuman.rtId, scope.rtId))
              : undefined
          )
        )
        .orderBy(desc(pengumuman.createdAt))
        .limit(4)
    : [];

  // 5. Transaksi terbaru: kas RW untuk RW penuh, kas RT untuk pengurus RT.
  const transaksiTerbaru = !akses.kas
    ? []
    : scope.kind === 'all'
      ? await db
          .select({
            id: transaksiKas.id,
            jenis: transaksiKas.jenis,
            nominal: transaksiKas.nominal,
            keterangan: transaksiKas.keterangan,
            tanggal: transaksiKas.tanggal
          })
          .from(transaksiKas)
          .orderBy(desc(transaksiKas.tanggal), desc(transaksiKas.id))
          .limit(5)
      : scope.kind === 'rt'
        ? await db
            .select({
              id: transaksiKasRt.id,
              jenis: transaksiKasRt.jenis,
              nominal: transaksiKasRt.nominal,
              keterangan: transaksiKasRt.keterangan,
              tanggal: transaksiKasRt.tanggal
            })
            .from(transaksiKasRt)
            .where(and(eq(transaksiKasRt.rtId, scope.rtId), eq(transaksiKasRt.dibatalkan, false)))
            .orderBy(desc(transaksiKasRt.tanggal), desc(transaksiKasRt.id))
            .limit(5)
        : [];

  // 6. Demografi ringkas untuk grafik dashboard (KP-03).
  // Pakai util bersama agar bucket tidak bercabang antara rekap, dashboard & landing.
  const semuaTglLahir = akses.warga
    ? await db
        .select({ tanggalLahir: warga.tanggalLahir })
        .from(warga)
        .innerJoin(kk, eq(warga.kkId, kk.id))
        .where(and(eq(warga.aktif, true), batasWarga))
    : [];

  const demografi = hitungBucketUsia(semuaTglLahir);

  // Label wilayah untuk judul kartu & banner.
  let nomorRt: number | null = null;
  if (scope.kind === 'rt') {
    const [row] = await db
      .select({ nomor: rt.nomor })
      .from(rt)
      .where(eq(rt.id, scope.rtId))
      .limit(1);
    nomorRt = row?.nomor ?? null;
  }

  const scopeLabel =
    scope.kind === 'all'
      ? 'Seluruh RW'
      : scope.kind === 'rt'
        ? nomorRt !== null
          ? `RT ${String(nomorRt).padStart(2, '0')}`
          : 'RT tugas Anda'
        : null;

  return {
    user: locals.user,
    akses,
    scopeKind: scope.kind,
    scopeLabel,
    kasLabel: scope.kind === 'all' ? 'Saldo kas RW' : 'Saldo kas RT',
    bisaCatatKas: izin.can('kas', 'create'),
    bisaBuatPengumuman: izin.can('pengumuman', 'create'),
    bisaTambahWarga: izin.can('warga', 'create'),
    stats: {
      totalWarga: wargaCount?.total ?? 0,
      totalWargaAktif: wargaCount?.totalAktif ?? 0,
      totalKk: kkCount?.total ?? 0,
      totalRt: rtCount?.total ?? 0,
      saldoKas: ringkasanKas.saldo,
      totalPemasukan: ringkasanKas.pemasukan,
      totalPengeluaran: ringkasanKas.pengeluaran,
      belumBayarCount: tagihanSummary?.belumBayarCount ?? 0,
      lunasCount: tagihanSummary?.lunasCount ?? 0,
      totalTagihanPending: tagihanSummary?.totalTagihanPending ?? 0,
      suratPendingCount
    },
    pengumumanTerbaru,
    transaksiTerbaru,
    demografi: {
      balita: demografi.balita,
      sekolah: demografi.usiaSekolah,
      produktif: demografi.produktif,
      lansia: demografi.lansia,
      kelahiranBaru: demografi.kelahiranBaru,
      total: demografi.total
    }
  };
};
