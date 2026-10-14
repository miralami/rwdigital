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
