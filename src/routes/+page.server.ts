import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { warga, kk, rt, pengumuman, pengaturanLanding, galeri, pengurus } from '$lib/server/db/schema';
import { and, asc, desc, eq, gte, isNotNull, sql } from 'drizzle-orm';
import { landingPathFor } from '$lib/server/guard';
import { hitungBucketUsia } from '$lib/server/usia';
import type {
  AgendaPublik,
  GaleriPublik,
  PengaturanLandingPublik,
  PengumumanPublik,
  PengurusPublik,
  StatistikPublik
} from '$lib/types';
/**
 * Default konten landing. Dipakai kalau baris `pengaturan_landing` belum ada
 * atau kolomnya kosong, sehingga instalasi baru tetap menampilkan halaman utuh.
 */
const DEFAULT_LANDING: PengaturanLandingPublik = {
  heroJudul: 'RW 06 Kota Baru',
  heroSubjudul:
    'Warga terhubung, lingkungan tertata. Pantau pengumuman, layanan surat, dan data kependudukan RW 06 dalam satu tempat.',
  heroBackground: '',
  sambutan:
    'Selamat datang di portal RW 06. Portal ini kami hadirkan agar informasi lingkungan mudah diakses warga — dari pengumuman, layanan surat, sampai data kependudukan.',
  namaKetua: 'Nama Ketua RW',
  fotoKetua: null,
  visi:
    'Mewujudkan RW 06 sebagai lingkungan yang aman, bersih, rukun, dan mandiri melalui pelayanan administrasi yang transparan serta partisipasi aktif seluruh warga.',
  misi: [
    'Menyelenggarakan administrasi kependudukan yang tertib, akurat, dan mudah diakses warga.',
    'Mendorong transparansi dan akuntabilitas pengelolaan kas serta iuran lingkungan.',
    'Meningkatkan keamanan, kebersihan, dan ketertiban lingkungan secara bergotong royong.',
    'Memberdayakan pemuda, posyandu, dan kegiatan sosial-keagamaan warga.',
    'Membangun komunikasi dan penyampaian informasi RW yang cepat dan merata.'
  ],
  sejarah:
    'RW 06 terbentuk seiring pertumbuhan permukiman di Kelurahan Kota Baru, Kecamatan Bekasi Barat. Dari lingkungan perumahan yang dikelola secara swadaya, warga secara bertahap membangun struktur pengurus RT dan RW, mengembangkan kegiatan sosial, keamanan lingkungan (siskamling), posyandu, serta pengelolaan iuran lingkungan. Kini RW 06 menaungi sejumlah RT dengan tata kelola yang terus dibenahi menuju pelayanan yang lebih modern dan transparan.',
  kontak: {
    alamat: 'Balai RW 06, Kelurahan Kota Baru, Kecamatan Bekasi Barat, Kota Bekasi',
    telepon: '0812-0000-0000',
    email: 'rw06@kotabaru.id'
  }
};

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

  // 3. Komposisi usia & kelahiran baru — pakai util bersama (365 hari terakhir)
  //    agar angka di landing konsisten dengan halaman rekap & dashboard internal.
  const wargaAktif = await db
    .select({ tanggalLahir: warga.tanggalLahir })
    .from(warga)
    .where(eq(warga.aktif, true));

  const bucketUsia = hitungBucketUsia(wargaAktif);

  // Landing page memakai label "anak" (0–14) yang menggabungkan balita + sekolah
  // untuk tampilan publik yang lebih ringkas.
  const anak = bucketUsia.balita + bucketUsia.usiaSekolah;
  const { produktif, lansia, kelahiranBaru } = bucketUsia;

  const totalUsia = anak + produktif + lansia;
  const rasioProduktif = totalUsia > 0 ? Math.round((produktif / totalUsia) * 100) : 0;

  const tahunIni = new Date().getFullYear();

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

  // 6. Konfigurasi landing + galeri + pengurus (bisa diubah lewat /pengaturan).
  const [landingRow] = await db
    .select()
    .from(pengaturanLanding)
    .where(eq(pengaturanLanding.id, 1))
    .limit(1);

  const pengaturan: PengaturanLandingPublik = {
    heroJudul: landingRow?.heroJudul?.trim() || DEFAULT_LANDING.heroJudul,
    heroSubjudul: landingRow?.heroSubjudul?.trim() || DEFAULT_LANDING.heroSubjudul,
    heroBackground: landingRow?.heroBackground?.trim() || DEFAULT_LANDING.heroBackground,
    sambutan: landingRow?.sambutan?.trim() || DEFAULT_LANDING.sambutan,
    namaKetua: landingRow?.namaKetua?.trim() || DEFAULT_LANDING.namaKetua,
    fotoKetua: landingRow?.fotoKetua || null,
    visi: landingRow?.visi?.trim() || DEFAULT_LANDING.visi,
    misi: landingRow?.misi?.trim()
      ? landingRow.misi
          .split('\n')
          .map((baris) => baris.trim())
          .filter(Boolean)
      : DEFAULT_LANDING.misi,
    sejarah: landingRow?.sejarah?.trim() || DEFAULT_LANDING.sejarah,
    kontak: {
      alamat: landingRow?.alamat?.trim() || DEFAULT_LANDING.kontak.alamat,
      telepon: landingRow?.telepon?.trim() || DEFAULT_LANDING.kontak.telepon,
      email: landingRow?.email?.trim() || DEFAULT_LANDING.kontak.email
    }
  };

  const galeriRows = await db
    .select({
      id: galeri.id,
      judul: galeri.judul,
      keterangan: galeri.keterangan,
      fotoUrl: galeri.fotoUrl
    })
    .from(galeri)
    .where(eq(galeri.aktif, true))
    .orderBy(asc(galeri.urutan), asc(galeri.id));

  const galeriPublik: GaleriPublik[] = galeriRows;

  // Pengurus RW (rtId NULL) lebih dulu, lalu pengurus RT per nomor RT.
  const pengurusRows = await db
    .select({
      id: pengurus.id,
      jabatan: pengurus.jabatan,
      nama: pengurus.nama,
      fotoUrl: pengurus.fotoUrl,
      urutan: pengurus.urutan,
      nomorRt: rt.nomor
    })
    .from(pengurus)
    .leftJoin(rt, eq(pengurus.rtId, rt.id))
    .where(eq(pengurus.aktif, true))
    .orderBy(asc(pengurus.rtId), asc(pengurus.urutan), asc(pengurus.id));

  const pengurusPublik: PengurusPublik[] = pengurusRows.map((p) => ({
    id: p.id,
    jabatan: p.jabatan,
    nama: p.nama,
    fotoUrl: p.fotoUrl,
    nomorRt: p.nomorRt,
    urutan: p.urutan
  }));

  return {
    tahunIni,
    statistik,
    pengumumanTerbaru,
    agenda,
    pengaturan,
    galeri: galeriPublik,
    pengurus: pengurusPublik
  };
};
