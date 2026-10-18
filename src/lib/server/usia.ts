/**
 * Utilitas perhitungan usia — single source of truth untuk seluruh modul
 * kependudukan. Sebelumnya logika ini diduplikasi di rekap, dashboard, dan
 * landing page sehingga definisi bucket bisa bercabang.
 *
 * Spesifikasi bucket (KP-01):
 *   Balita       : 0 –  4 tahun
 *   Usia Sekolah : 5 – 14 tahun  (usia 15 masuk Produktif)
 *   Produktif    : 15 – 64 tahun  (usia 65 masuk Lansia)
 *   Lansia       : ≥ 65 tahun
 *
 * kelahiranBaru  : lahir dalam 365 hari terakhir (bukan tahun kalender berjalan)
 */

export interface BucketUsia {
  balita: number;      // 0–4
  usiaSekolah: number; // 5–14
  produktif: number;   // 15–64
  lansia: number;      // ≥65
  kelahiranBaru: number;
  total: number;
  /** Jumlah baris dengan tanggal lahir tidak valid (data kotor). */
  dataKotor: number;
}

/**
 * Hitung usia tepat dalam tahun penuh.
 * Memperhitungkan bulan & hari supaya batas 14/15 dan 64/65 akurat.
 *
 * @returns usia dalam tahun, atau `null` jika `tanggalLahirStr` tidak valid.
 *   Mengembalikan `null` (bukan fallback tersembunyi) agar data kotor terlihat
 *   dan tidak diam-diam masuk bucket Produktif.
 */
export function hitungUsia(tanggalLahirStr: string, sekarang: Date): number | null {
  const tgl = new Date(tanggalLahirStr);
  if (isNaN(tgl.getTime())) return null;

  let usia = sekarang.getFullYear() - tgl.getFullYear();
  const belumUlangTahun =
    sekarang.getMonth() < tgl.getMonth() ||
    (sekarang.getMonth() === tgl.getMonth() && sekarang.getDate() < tgl.getDate());
  if (belumUlangTahun) usia--;
  return Math.max(0, usia);
}

/**
 * Agregasi bucket usia dari daftar tanggal lahir warga aktif.
 *
 * @param tglLahirList - array objek yang mengandung `tanggalLahir: string`
 * @param sekarang     - titik waktu referensi (biasanya `new Date()`)
 */
export function hitungBucketUsia(
  tglLahirList: { tanggalLahir: string }[],
  sekarang: Date = new Date()
): BucketUsia {
  let balita = 0;
  let usiaSekolah = 0;
  let produktif = 0;
  let lansia = 0;
  let kelahiranBaru = 0;
  let dataKotor = 0;

  const setahunLalu = new Date(sekarang);
  setahunLalu.setFullYear(setahunLalu.getFullYear() - 1);

  for (const w of tglLahirList) {
    const usia = hitungUsia(w.tanggalLahir, sekarang);

    if (usia === null) {
      dataKotor++;
      continue; // jangan masukkan ke bucket mana pun
    }

    const tgl = new Date(w.tanggalLahir);
    if (tgl >= setahunLalu) kelahiranBaru++;

    if (usia <= 4) balita++;
    else if (usia <= 14) usiaSekolah++;
    else if (usia <= 64) produktif++;
    else lansia++;
  }

  return {
    balita,
    usiaSekolah,
    produktif,
    lansia,
    kelahiranBaru,
    total: tglLahirList.length - dataKotor,
    dataKotor
  };
}
