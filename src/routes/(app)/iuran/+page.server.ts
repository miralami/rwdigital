import { db } from '$lib/server/db';
import { tagihan, kk, jenisIuran, rt, konfirmasiBayar, setoranRt, warga, pembayaran } from '$lib/server/db/schema';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { requireScope, scopeFromRole, visibleRt } from '$lib/server/scope';
import { menunggak, jatuhTempoPeriode } from '$lib/server/iuran';
import type { PageServerLoad, Actions } from './$types';

function bulanIni(): string {
  return new Date().toISOString().slice(0, 7);
}

export const load: PageServerLoad = async ({ locals }) => {
  const scope = requireScope(scopeFromRole(locals));
  const hariIni = new Date().toISOString().slice(0, 10);
  const periodeSekarang = bulanIni();

  // 1. AUTO-BILLING: Ensure active monthly dues are automatically billed for active KKs for current period
  const jenisAktif = await db
    .select()
    .from(jenisIuran)
    .where(and(eq(jenisIuran.aktif, true), eq(jenisIuran.periode, 'bulanan')));

  if (jenisAktif.length > 0) {
    const semuaKkAktif = await db
      .select({ id: kk.id, rtId: kk.rtId })
      .from(kk)
      .where(scope.kind === 'rt' ? eq(kk.rtId, scope.rtId) : undefined);

    const tagihanBulanIni = await db
      .select({ kkId: tagihan.kkId, jenisIuranId: tagihan.jenisIuranId })
      .from(tagihan)
      .where(eq(tagihan.periode, periodeSekarang));

    const existingSet = new Set(tagihanBulanIni.map((t) => `${t.kkId}-${t.jenisIuranId}`));
    const tagihanBaru: (typeof tagihan.$inferInsert)[] = [];

    const jt = jatuhTempoPeriode(periodeSekarang) ?? `${periodeSekarang}-10`;

    for (const k of semuaKkAktif) {
      for (const j of jenisAktif) {
        // If RT scope, only bill matching RT
        if (j.scope === 'rt' && j.rtId && j.rtId !== k.rtId) continue;
        if (!existingSet.has(`${k.id}-${j.id}`)) {
          tagihanBaru.push({
            kkId: k.id,
            jenisIuranId: j.id,
            periode: periodeSekarang,
            nominal: j.nominal,
            porsiRw: j.porsiRw,
            status: 'belum_bayar',
            jatuhTempo: jt
          });
        }
      }
    }

    if (tagihanBaru.length > 0) {
      await db.insert(tagihan).values(tagihanBaru);
    }
  }

  // 2. Fetch all tagihan
  const semuaTagihanRaw = await db
    .select({
      id: tagihan.id,
      kkId: kk.id,
      noKk: kk.noKk,
      alamatKk: kk.alamat,
      rtId: rt.id,
      nomorRt: rt.nomor,
      jenisIuranId: jenisIuran.id,
      namaJenisIuran: jenisIuran.nama,
      scopeJenis: jenisIuran.scope,
      periode: tagihan.periode,
      nominal: tagihan.nominal,
      porsiRw: tagihan.porsiRw,
      status: tagihan.status,
      jatuhTempo: tagihan.jatuhTempo
    })
    .from(tagihan)
    .innerJoin(kk, eq(tagihan.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
    .where(scope.kind === 'rt' ? eq(kk.rtId, scope.rtId) : undefined)
    .orderBy(desc(tagihan.periode), desc(tagihan.id));

  // Find head of family names for per-KK display
  const kepalaList = await db
    .select({ kkId: warga.kkId, nama: warga.nama })
    .from(warga)
    .where(eq(warga.statusHubunganKk, 'kepala_keluarga'));
  const kepalaMap = new Map(kepalaList.map((k) => [k.kkId, k.nama]));

  const semuaTagihan = semuaTagihanRaw.map((t) => ({
    ...t,
    kepalaKeluarga: kepalaMap.get(t.kkId) ?? '—',
    menunggak: menunggak(t.status, t.jatuhTempo, hariIni)
  }));

  // 3. Konfirmasi Bayar Counts
  const konfirmasiCounts = await db
    .select({
      status: konfirmasiBayar.status,
      count: sql<number>`count(*)`
    })
    .from(konfirmasiBayar)
    .innerJoin(tagihan, eq(konfirmasiBayar.tagihanId, tagihan.id))
    .innerJoin(kk, eq(tagihan.kkId, kk.id))
    .where(scope.kind === 'rt' ? eq(kk.rtId, scope.rtId) : undefined)
    .groupBy(konfirmasiBayar.status);

  let konfirmasiMenunggu = 0;
  let konfirmasiDiterima = 0;
  for (const c of konfirmasiCounts) {
    if (c.status === 'menunggu') konfirmasiMenunggu = Number(c.count);
    if (c.status === 'diterima') konfirmasiDiterima = Number(c.count);
  }

  // 4. Aggregates per RT (for 2-tier RW view)
  const daftarRt = visibleRt(scope, await db.select().from(rt).orderBy(rt.nomor));
  const setoranBulanIni = await db
    .select()
    .from(setoranRt)
    .where(eq(setoranRt.periode, periodeSekarang));

  const setoranMap = new Map(setoranBulanIni.map((s) => [s.rtId, s]));

  const rekapRt = daftarRt.map((r) => {
    const tagihanRt = semuaTagihan.filter((t) => t.rtId === r.id);
    const totalTagihan = tagihanRt.reduce((s, t) => s + t.nominal, 0);
    const terbayar = tagihanRt.filter((t) => t.status === 'lunas').reduce((s, t) => s + t.nominal, 0);
    const porsiRwTotal = tagihanRt.filter((t) => t.status === 'lunas').reduce((s, t) => s + (t.porsiRw ?? 0), 0);
    const setoran = setoranMap.get(r.id);
    const unikKk = new Set(tagihanRt.map((t) => t.kkId)).size;

    return {
      rtId: r.id,
      nomorRt: r.nomor,
      totalKk: unikKk,
      totalTagihan,
      terbayar,
      porsiRwTotal,
      statusSetoran: setoran ? (setoran.dibatalkan ? 'dibatalkan' : 'disetor') : 'belum_setor',
      setoranId: setoran?.id ?? null,
      disetorPada: setoran?.disetorPada ?? null
    };
  });

  // KPI Metrics
  const totalNominal = semuaTagihan.reduce((s, t) => s + t.nominal, 0);
  const totalTerbayar = semuaTagihan.filter((t) => t.status === 'lunas').reduce((s, t) => s + t.nominal, 0);
  const totalTunggakan = semuaTagihan.filter((t) => t.menunggak).reduce((s, t) => s + t.nominal, 0);
  const totalPorsiRw = semuaTagihan.filter((t) => t.status === 'lunas').reduce((s, t) => s + (t.porsiRw ?? 0), 0);

  return {
    isRwView: scope.kind === 'all',
    semuaTagihan,
    rekapRt,
    daftarRt,
    kpi: {
      totalNominal,
      totalTerbayar,
      totalTunggakan,
      totalPorsiRw,
      persenBayar: totalNominal > 0 ? Math.round((totalTerbayar / totalNominal) * 100) : 0
    },
    konfirmasiCounts: {
      menunggu: konfirmasiMenunggu,
      diterima: konfirmasiDiterima
    }
  };
};
