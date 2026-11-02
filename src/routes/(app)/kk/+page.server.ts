import { db } from '$lib/server/db';
import { warga, kk, rt, permintaanPembaruan } from '$lib/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { hitungBucketUsia } from '$lib/server/usia';
import { requireScope, scopeFromRole, visibleRt } from '$lib/server/scope';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const scope = requireScope(scopeFromRole(locals));
  const filterRt = scope.kind === 'rt' ? eq(kk.rtId, scope.rtId) : undefined;

  // 1. Rekap Demografis
  const rekapRt = await db
    .select({
      rtId: rt.id,
      nomorRt: rt.nomor,
      totalWarga: sql<number>`count(distinct ${warga.id})`,
      totalKk: sql<number>`count(distinct ${kk.id})`
    })
    .from(rt)
    .leftJoin(kk, eq(kk.rtId, rt.id))
    .leftJoin(warga, eq(warga.kkId, kk.id))
    .where(scope.kind === 'rt' ? eq(rt.id, scope.rtId) : undefined)
    .groupBy(rt.id, rt.nomor)
    .orderBy(rt.nomor);

  const rekapGender = await db
    .select({
      lakiLaki: sql<number>`COALESCE(SUM(CASE WHEN ${warga.jenisKelamin} = 'L' THEN 1 ELSE 0 END), 0)`,
      perempuan: sql<number>`COALESCE(SUM(CASE WHEN ${warga.jenisKelamin} = 'P' THEN 1 ELSE 0 END), 0)`,
      total: sql<number>`count(*)`
    })
    .from(warga)
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .where(and(eq(warga.aktif, true), filterRt));

  const rekapHuni = await db
    .select({
      tetap: sql<number>`COALESCE(SUM(CASE WHEN ${kk.statusHuni} = 'tetap' THEN 1 ELSE 0 END), 0)`,
      kontrak: sql<number>`COALESCE(SUM(CASE WHEN ${kk.statusHuni} = 'kontrak' THEN 1 ELSE 0 END), 0)`,
      kos: sql<number>`COALESCE(SUM(CASE WHEN ${kk.statusHuni} = 'kos' THEN 1 ELSE 0 END), 0)`,
      totalKk: sql<number>`count(*)`
    })
    .from(kk)
    .where(filterRt);

  const semuaTglLahir = await db
    .select({ tanggalLahir: warga.tanggalLahir })
    .from(warga)
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .where(and(eq(warga.aktif, true), filterRt));

  const usia = hitungBucketUsia(semuaTglLahir);

  // 2. Data KK dan Warga (Grouped)
  const semuaKkRaw = await db
    .select({
      id: kk.id,
      noKk: kk.noKk,
      alamat: kk.alamat,
      statusHuni: kk.statusHuni,
      rtId: rt.id,
      nomorRt: rt.nomor
    })
    .from(kk)
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .where(scope.kind === 'rt' ? eq(kk.rtId, scope.rtId) : undefined)
    .orderBy(rt.nomor, kk.noKk);

  const semuaWargaRaw = await db
    .select({
      id: warga.id,
      nik: warga.nik,
      nama: warga.nama,
      jenisKelamin: warga.jenisKelamin,
      statusHubunganKk: warga.statusHubunganKk,
      kkId: warga.kkId,
      aktif: warga.aktif
    })
    .from(warga)
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .where(scope.kind === 'rt' ? eq(kk.rtId, scope.rtId) : undefined)
    .orderBy(warga.nama);

  // Group warga by kkId
  const wargaByKk = new Map<number, typeof semuaWargaRaw>();
  for (const w of semuaWargaRaw) {
    const list = wargaByKk.get(w.kkId) ?? [];
    list.push(w);
    wargaByKk.set(w.kkId, list);
  }

  const semuaKk = semuaKkRaw.map((k) => {
    const anggota = wargaByKk.get(k.id) ?? [];
    const kepala = anggota.find((a) => a.statusHubunganKk === 'kepala_keluarga') ?? anggota[0];
    return {
      ...k,
      kepalaKeluarga: kepala ? kepala.nama : '—',
      jumlahAnggota: anggota.length,
      anggota
    };
  });

  // 3. Count Permintaan Pembaruan
  const statusPembaruan = await db
    .select({
      status: permintaanPembaruan.status,
      count: sql<number>`count(*)`
    })
    .from(permintaanPembaruan)
    .innerJoin(warga, eq(permintaanPembaruan.wargaId, warga.id))
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .where(scope.kind === 'rt' ? eq(kk.rtId, scope.rtId) : undefined)
    .groupBy(permintaanPembaruan.status);

  let pembaruanPending = 0;
  let pembaruanDone = 0;
  for (const s of statusPembaruan) {
    if (s.status === 'diajukan' || s.status === 'diverifikasi') {
      pembaruanPending += Number(s.count);
    } else if (s.status === 'disetujui') {
      pembaruanDone += Number(s.count);
    }
  }

  const semuaRt = visibleRt(scope, await db.select().from(rt).orderBy(rt.nomor));

  return {
    semuaKk,
    semuaRt,
    pembaruanCounts: {
      pending: pembaruanPending,
      done: pembaruanDone
    },
    demografi: {
      rekapRt,
      gender: rekapGender[0] ?? { lakiLaki: 0, perempuan: 0, total: 0 },
      huni: rekapHuni[0] ?? { tetap: 0, kontrak: 0, kos: 0, totalKk: 0 },
      usia,
      kelahiranBaru: usia.kelahiranBaru
    }
  };
};
