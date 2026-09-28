import type { PageServerLoad } from './$types';

/**
 * ── DATA CONTOH ──────────────────────────────────────────────────────────────
 * Halaman ini masih berjalan di atas placeholder. Tabel `warga` belum punya
 * kolom `userId`, jadi akun yang login belum bisa dipetakan ke tagihan atau
 * pembayarannya sendiri — menambah kolom itu di luar scope ronde ini.
 *
 * Semua nilai di bawah WAJIB dibaca sebagai contoh:
 *  - tidak ada NIK / No. KK / nama warga fiktif yang bisa disalahartikan,
 *  - isi pengumuman dan riwayat diberi awalan "Contoh:",
 *  - `contoh: true` dibaca UI untuk menandai data ini secara terlihat.
 *
 * Nominal sengaja dibuat bulat (50.000) supaya jelas bukan transaksi nyata.
 * Ganti sumbernya dengan query `tagihan` + `pembayaran` yang di-join lewat `kk`
 * begitu pemetaan user tersedia.
 * ─────────────────────────────────────────────────────────────────────────────
 */

type StatusIuran = 'belum_bayar' | 'lunas';

export const load: PageServerLoad = async ({ locals }) => {
  const sekarang = new Date();
  const tahun = sekarang.getFullYear();
  const bulan = sekarang.getMonth();

  const namaBulan = (offset: number) =>
    new Date(tahun, bulan + offset, 1).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric'
    });

  /** Tanggal lokal → "YYYY-MM-DD", tanpa pergeseran zona waktu. */
  const tanggal = (offsetBulan: number, hari: number) => {
    const d = new Date(tahun, bulan + offsetBulan, hari);
    const bulanStr = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${bulanStr}-${String(hari).padStart(2, '0')}`;
  };

  return {
    // Data nyata: hanya untuk sapaan di header.
    namaPengguna: locals.user?.name ?? null,

    // Penanda placeholder, dibaca UI supaya pengguna tidak salah paham.
    contoh: true,
    catatanContoh: 'Data contoh untuk tampilan portal. Belum terhubung ke data warga.',

    iuran: {
      bulan: namaBulan(0),
      nominal: 50_000,
      status: 'belum_bayar' as StatusIuran,
      jatuhTempo: tanggal(0, 10),
      dibayarPada: null as string | null
    },

    pengumuman: [
      { id: 'contoh-1', judul: 'Contoh: jadwal ronda malam', tanggal: tanggal(0, 12) },
      { id: 'contoh-2', judul: 'Contoh: jadwal kerja bakti bulan ini', tanggal: tanggal(0, 8) },
      { id: 'contoh-3', judul: 'Contoh: pengumuman iuran bulan ini', tanggal: tanggal(-1, 20) }
    ],

    riwayatPembayaran: [
      { id: 'contoh-a', keterangan: `Contoh: iuran ${namaBulan(-1)}`, nominal: 50_000, tanggal: tanggal(-1, 10) },
      { id: 'contoh-b', keterangan: `Contoh: iuran ${namaBulan(-2)}`, nominal: 50_000, tanggal: tanggal(-2, 10) },
      { id: 'contoh-c', keterangan: `Contoh: iuran ${namaBulan(-3)}`, nominal: 50_000, tanggal: tanggal(-3, 10) }
    ]
  };
};
