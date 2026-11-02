import { db } from '$lib/server/db';
import { warga, kk, rt } from '$lib/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { hitungBucketUsia } from '$lib/server/usia';
import { requireScope, scopeFromRole } from '$lib/server/scope';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Pengurus RT hanya menerima rekap wilayahnya; admin & bendahara melihat RW.
  const scope = requireScope(scopeFromRole(locals));
  const filterRt = scope.kind === 'rt' ? eq(kk.rtId, scope.rtId) : undefined;

  // 1. Data per RT
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

  // 2. Jenis Kelamin
  const rekapGender = await db
    .select({
      lakiLaki: sql<number>`COALESCE(SUM(CASE WHEN ${warga.jenisKelamin} = 'L' THEN 1 ELSE 0 END), 0)`,
      perempuan: sql<number>`COALESCE(SUM(CASE WHEN ${warga.jenisKelamin} = 'P' THEN 1 ELSE 0 END), 0)`,
      total: sql<number>`count(*)`
    })
    .from(warga)
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .where(and(eq(warga.aktif, true), filterRt));

  // 3. Status Huni KK
  const rekapHuni = await db
    .select({
      tetap: sql<number>`COALESCE(SUM(CASE WHEN ${kk.statusHuni} = 'tetap' THEN 1 ELSE 0 END), 0)`,
      kontrak: sql<number>`COALESCE(SUM(CASE WHEN ${kk.statusHuni} = 'kontrak' THEN 1 ELSE 0 END), 0)`,
      kos: sql<number>`COALESCE(SUM(CASE WHEN ${kk.statusHuni} = 'kos' THEN 1 ELSE 0 END), 0)`,
      totalKk: sql<number>`count(*)`
    })
    .from(kk)
    .where(filterRt);

  // 4. Perhitungan Rentang Usia (KP-01). Pakai util bersama agar definisi
  //    bucket tidak bercabang antara rekap, dashboard, dan landing page.
  const semuaTglLahir = await db
    .select({ tanggalLahir: warga.tanggalLahir })
    .from(warga)
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .where(and(eq(warga.aktif, true), filterRt));

  const usia = hitungBucketUsia(semuaTglLahir);

  return {
    rekapRt,
    gender: rekapGender[0] ?? { lakiLaki: 0, perempuan: 0, total: 0 },
    huni: rekapHuni[0] ?? { tetap: 0, kontrak: 0, kos: 0, totalKk: 0 },
    usia,
    kelahiranBaru: usia.kelahiranBaru
  };
};
