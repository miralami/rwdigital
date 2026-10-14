import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { warga, kk, rt, pengumuman } from '$lib/server/db/schema';
import { and, asc, desc, eq, gte, isNotNull, sql } from 'drizzle-orm';
import { landingPathFor } from '$lib/server/guard';
import type { AgendaPublik, PengumumanPublik, StatistikPublik } from '$lib/types';

const BULAN_SINGKAT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

/**
 * Memecah tanggal ISO "YYYY-MM-DD[ ...]" menjadi komponen tampilan.
 *
 * Sengaja TIDAK memakai `new Date()`: nilai `created_at` SQLite tidak punya
 * penanda zona waktu, sehingga parsing bisa berbeda antara server dan browser
 * (dan menimbulkan hydration mismatch). Mengambil komponen dari string mentah
 * selalu menghasilkan output yang sama di mana pun.
 */
function komponenTanggal(iso: string): { hari: string; bulan: string; tanggal: string } {
  const cocok = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  if (!cocok) return { hari: '', bulan: '', tanggal: '' };

  const tahun = cocok[1];
  const bulanInv = Number(cocok[2]);
  const hari = String(Number(cocok[3]));
  const bulan = BULAN_SINGKAT[bulanInv - 1] ?? '';

  return { hari, bulan, tanggal: `${hari} ${bulan} ${tahun}` };
}

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

  // 4. Pengumuman aktif terbaru untuk modul "Pengumuman & Agenda".
  //    Hanya yang ditandai tampil; murni informasi publik, tanpa data pribadi.
  const pengumumanRows = await db
    .select({
      id: pengumuman.id,
      judul: pengumuman.judul,
      isi: pengumuman.isi,
      kategori: pengumuman.kategori,
      createdAt: pengumuman.createdAt
    })
    .from(pengumuman)
    .where(eq(pengumuman.ditampilkan, true))
    .orderBy(desc(pengumuman.createdAt))
    .limit(4);

  const pengumumanTerbaru: PengumumanPublik[] = pengumumanRows.map((p) => ({
    id: p.id,
    judul: p.judul,
    isi: p.isi,
    kategori: p.kategori,
    ...komponenTanggal(p.createdAt)
  }));

  // 5. Agenda mendatang — diturunkan dari pengumuman yang punya tanggal mulai
  //    di masa depan (tidak ada tabel Event terpisah di MVP). Perbandingan
  //    string aman karena tanggal disimpan sebagai ISO "YYYY-MM-DD".
  const hariIni = new Date().toISOString().slice(0, 10);
  const agendaRows = await db
    .select({
      id: pengumuman.id,
      judul: pengumuman.judul,
      isi: pengumuman.isi,
      kategori: pengumuman.kategori,
      tanggalMulai: pengumuman.tanggalMulai
    })
    .from(pengumuman)
    .where(
      and(
        eq(pengumuman.ditampilkan, true),
        isNotNull(pengumuman.tanggalMulai),
        gte(pengumuman.tanggalMulai, hariIni)
      )
    )
    .orderBy(asc(pengumuman.tanggalMulai))
    .limit(3);

  const agenda: AgendaPublik[] = agendaRows
    // `isNotNull` sudah menyaring di SQL; filter ini hanya menegaskan tipe
    // (kolomnya tetap `string | null` bagi TypeScript).
    .filter((a): a is typeof a & { tanggalMulai: string } => a.tanggalMulai !== null)
    .map((a) => ({
      id: a.id,
      judul: a.judul,
      isi: a.isi,
      kategori: a.kategori,
      ...komponenTanggal(a.tanggalMulai)
    }));

  return { tahunIni, statistik, pengumumanTerbaru, agenda };
};
