import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { warga, kk, rt } from '$lib/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { landingPathFor } from '$lib/server/guard';
import type { StatistikPublik } from '$lib/types';

/**
 * Halaman publik akar `/`.
 *
 * Pengunjung anonim melihat landing page + statistik agregat. Warga/pengurus
 * yang sudah login tidak perlu melihat halaman pra-login lagi, jadi diarahkan
 * ke area miliknya (portal warga atau dashboard) — sekaligus menjaga alur
 * `goto('/')` setelah login tetap bekerja.
 *
 * Data yang dikirim ke klien MURNI agregat: total, sebaran per RT, komposisi
 * usia. Tidak ada NIK/nama/identitas per orang (patuh UU PDP).
 */
export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) throw redirect(302, landingPathFor(locals));

  // 1. Total warga (aktif) & total KK
  const [wargaAgg] = await db
    .select({
      totalAktif: sql<number>`COALESCE(SUM(CASE WHEN ${warga.aktif} = 1 THEN 1 ELSE 0 END), 0)`
    })
    .from(warga);

  const [kkAgg] = await db.select({ total: sql<number>`count(*)` }).from(kk);
  const [rtAgg] = await db.select({ total: sql<number>`count(*)` }).from(rt);

  // 2. Sebaran warga aktif & KK per RT
  const perRt = await db
    .select({
      nomor: rt.nomor,
      totalWarga: sql<number>`count(distinct ${warga.id})`,
      totalKk: sql<number>`count(distinct ${kk.id})`
    })
    .from(rt)
    .leftJoin(kk, eq(kk.rtId, rt.id))
    .leftJoin(warga, and(eq(warga.kkId, kk.id), eq(warga.aktif, true)))
    .groupBy(rt.id, rt.nomor)
    .orderBy(rt.nomor);

  // 3. Komposisi usia & kelahiran baru (dihitung dari tanggal lahir warga aktif)
  const wargaAktif = await db
    .select({ tanggalLahir: warga.tanggalLahir })
    .from(warga)
    .where(eq(warga.aktif, true));

  const tahunIni = new Date().getFullYear();
  let anak = 0; // 0–14 tahun
  let produktif = 0; // 15–64 tahun
  let lansia = 0; // 65+ tahun
  let kelahiranBaru = 0; // lahir pada tahun berjalan

  for (const w of wargaAktif) {
    const thn = new Date(w.tanggalLahir).getFullYear();
    const usia = Number.isNaN(thn) ? 30 : Math.max(0, tahunIni - thn);

    if (usia <= 14) anak++;
    else if (usia <= 64) produktif++;
    else lansia++;

    if (thn === tahunIni) kelahiranBaru++;
  }

  const totalUsia = anak + produktif + lansia;
  const rasioProduktif = totalUsia > 0 ? Math.round((produktif / totalUsia) * 100) : 0;

  const statistik: StatistikPublik = {
    totalWarga: wargaAgg?.totalAktif ?? 0,
    totalKk: kkAgg?.total ?? 0,
    totalRt: rtAgg?.total ?? 0,
    kelahiranBaru,
    rasioProduktif,
    usia: { anak, produktif, lansia, total: totalUsia },
    perRt: perRt.map((r) => ({
      nomor: r.nomor,
      totalWarga: r.totalWarga,
      totalKk: r.totalKk
    }))
  };

  return { tahunIni, statistik };
};
