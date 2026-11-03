/**
 * Tipe kontrak yang dipakai bersama antara server load dan komponen halaman.
 * Client-safe (tanpa impor `$lib/server`), jadi aman diimpor dari `+page.svelte`.
 */

/** Agregat statistik kependudukan yang ditampilkan di halaman publik. */
export interface StatistikPublik {
  totalWarga: number;
  totalKk: number;
  totalRt: number;
  kelahiranBaru: number;
  rasioProduktif: number;
  usia: { anak: number; produktif: number; lansia: number; total: number };
  perRt: { nomor: number; totalWarga: number; totalKk: number }[];
}

/** Sebaran per RT (elemen tunggal). */
export type SebaranRt = StatistikPublik['perRt'][number];

/** Kategori pengumuman — sumber enum: tabel `pengumuman`. */
export type KategoriPengumuman = 'umum' | 'kegiatan' | 'keuangan' | 'darurat';

/**
 * Pengumuman publik yang tampil di landing page.
 *
 * Tanggal sengaja sudah diformat di server (bukan `Date` mentah) supaya render
 * SSR dan hidrasi browser identik — tidak ada risiko beda zona waktu atau
 * perbedaan parsing tanggal antar browser.
 */
export interface PengumumanPublik {
  id: number;
  judul: string;
  isi: string;
  kategori: KategoriPengumuman;
  /** Tanggal terbit lengkap, mis. "12 Okt 2026". */
  tanggal: string;
  /** Komponen badge tanggal: "12". */
  hari: string;
  /** Komponen badge tanggal: "Okt". */
  bulan: string;
}

/**
 * Agenda mendatang — pengumuman yang punya `tanggalMulai` di masa depan.
 * Tidak ada tabel Event terpisah di MVP: agenda diturunkan dari tabel
 * pengumuman, dan tanggalnya juga sudah diformat di server.
 */
export interface AgendaPublik {
  id: number;
  judul: string;
  isi: string;
  kategori: KategoriPengumuman;
  /** Tanggal mulai, mis. "19 Okt 2026". */
  tanggal: string;
  hari: string;
  bulan: string;
}

/** Konfigurasi landing page yang bisa diubah pengurus tanpa deploy. */
export interface PengaturanLandingPublik {
  heroJudul: string;
  heroSubjudul: string;
  /** Warna hex (#0f172a) atau path gambar (/uploads/landing/...). */
  heroBackground: string;
  sambutan: string;
  namaKetua: string;
  fotoKetua: string | null;
  visi: string;
  misi: string[];
  sejarah: string;
  kontak: { alamat: string; telepon: string; email: string };
}

/** Satu foto pada galeri landing page. */
export interface GaleriPublik {
  id: number;
  judul: string;
  keterangan: string | null;
  fotoUrl: string;
}

/** Pengurus aktif yang ditampilkan di bagan landing page. */
export interface PengurusPublik {
  id: number;
  jabatan: string;
  nama: string;
  fotoUrl: string | null;
  nomorRt: number | null;
  urutan: number;
}
