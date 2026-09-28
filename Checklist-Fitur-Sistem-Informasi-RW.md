# Identifikasi Kebutuhan Sistem Informasi RW

**Silakan centang (✅) fitur yang dibutuhkan oleh pengurus RW.**
Fitur dapat disesuaikan dengan kondisi dan kebutuhan lingkungan — tidak semua fitur harus dipilih.

---

## Cara Menggunakan Dokumen Ini

Dokumen ini adalah **katalog kebutuhan**, bukan daftar "akan kami buat semua". Tujuannya:

1. Pengurus RW menandai fitur mana yang benar-benar dibutuhkan.
2. Hasil checklist dijadikan **requirement resmi** untuk pengembangan sistem.
3. Tim pengembang menyusun scope, prioritas, dan MVP berdasarkan hasil checklist ini — bukan tebakan sendiri.

---

## A. Manajemen Kependudukan 🔴 *Core*

- [ ] Data warga (NIK, Nama, No. KK, tempat/tanggal lahir, jenis kelamin, no. HP, alamat, status perkawinan, pekerjaan)
- [ ] Status tinggal warga (tetap / kontrak / kos / lainnya) dan lama tinggal
- [ ] Data keluarga / anggota KK
- [ ] Pencatatan warga masuk
- [ ] Pencatatan warga keluar
- [ ] Pencatatan warga meninggal
- [ ] Pencatatan warga pindah rumah
- [ ] Pencarian & filter data warga
- [ ] Riwayat perubahan data warga
- [ ] Import data kependudukan
- [ ] Export data kependudukan
- [ ] Upload dokumen pendukung (KK, KTP, dll.)

## B. Surat-Menyurat 🔴 *Core*

- [ ] Pengajuan surat oleh warga (online)
- [ ] Surat pengantar RT/RW
- [ ] Surat keterangan domisili
- [ ] Surat keterangan usaha
- [ ] Surat keterangan tidak mampu
- [ ] Surat keterangan lainnya (custom)
- [ ] Template surat otomatis
- [ ] Nomor surat otomatis
- [ ] Alur persetujuan / tanda tangan Ketua RW
- [ ] Download / cetak surat
- [ ] Riwayat surat yang pernah dibuat

## C. Keuangan / Kas RW 🔴 *Core*

- [ ] Pencatatan pemasukan
- [ ] Pencatatan pengeluaran
- [ ] Kategori transaksi
- [ ] Saldo kas otomatis
- [ ] Kas berdasarkan sumber/dana
- [ ] Bukti transaksi (upload nota/struk)
- [ ] Laporan keuangan bulanan
- [ ] Laporan keuangan tahunan
- [ ] Export laporan ke Excel/PDF
- [ ] Riwayat transaksi

## D. Iuran Warga 🟠 *Penting*

- [ ] Menentukan jenis iuran (kebersihan, keamanan, sosial, dll.)
- [ ] Menentukan nominal iuran
- [ ] Menentukan periode pembayaran (bulanan/tahunan)
- [ ] Pencatatan pembayaran iuran
- [ ] Daftar warga yang sudah/belum membayar
- [ ] Rekap iuran per bulan
- [ ] Riwayat pembayaran per warga

## E. Pengumuman & Informasi RW 🟠 *Penting*

- [ ] Pengumuman RW
- [ ] Berita / informasi lingkungan
- [ ] Jadwal kegiatan
- [ ] Informasi kerja bakti
- [ ] Informasi rapat warga
- [ ] Informasi acara/kegiatan RW
- [ ] Notifikasi ke warga (in-app)
- [ ] Notifikasi via WhatsApp *(tanyakan kebutuhan — biasanya lebih efektif daripada warga harus buka website)*

## F. Pengaduan / Aspirasi Warga 🟠 *Penting*

- [ ] Warga dapat membuat laporan/pengaduan
- [ ] Kategori pengaduan (infrastruktur, keamanan, kebersihan, fasilitas umum, lainnya)
- [ ] Upload foto laporan
- [ ] Status laporan (diajukan → diproses → selesai)
- [ ] Riwayat pengaduan
- [ ] Tanggapan dari pengurus

## G. Kegiatan & Agenda RW 🟡 *Opsional*

- [ ] Kalender kegiatan RW
- [ ] Jadwal rapat
- [ ] Jadwal kerja bakti
- [ ] Jadwal kegiatan sosial
- [ ] Pendataan peserta kegiatan
- [ ] Dokumentasi kegiatan (foto/video)
- [ ] Rekap kegiatan RW

## H. Fasilitas & Inventaris RW 🟡 *Opsional*

- [ ] Pendataan fasilitas RW (balai warga, pos ronda, lapangan, dll.)
- [ ] Pendataan inventaris (kursi, tenda, sound system, meja, dll.)
- [ ] Kondisi & lokasi barang
- [ ] Peminjaman barang
- [ ] Pengembalian barang
- [ ] Riwayat peminjaman
- [ ] Jadwal penggunaan fasilitas

## I. Manajemen Pengurus 🟡 *Opsional*

- [ ] Data pengurus RW
- [ ] Data RT
- [ ] Jabatan & struktur organisasi
- [ ] Kontak pengurus
- [ ] Hak akses sistem (role: admin RW / RT / warga)
- [ ] Riwayat aktivitas pengguna

## J. Keamanan Lingkungan 🟡 *Opsional — cek dulu apakah RW sudah punya CCTV*

- [ ] Manajemen CCTV
- [ ] Daftar lokasi CCTV
- [ ] Status CCTV (aktif/offline)
- [ ] Monitoring CCTV (live/rekaman)
- [ ] Riwayat/rekaman kejadian
- [ ] Data petugas keamanan
- [ ] Pencatatan & laporan kejadian keamanan
- [ ] Jadwal ronda / siskamling

> ⚠️ **Catatan untuk tim:** Jangan asumsikan fitur CCTV harus dibangun. Tanyakan dulu ke RW: apakah mereka sudah punya perangkat CCTV, dan apakah mereka butuh integrasi monitoring di sistem, atau cukup pencatatan manual (lokasi, status, jadwal ronda) tanpa live feed.

## K. Dashboard 🟢 *Pengembangan Lanjutan*

- [ ] Jumlah warga & jumlah KK
- [ ] Komposisi warga tetap/kontrak/kos
- [ ] Statistik warga masuk/keluar
- [ ] Saldo kas & ringkasan pemasukan/pengeluaran
- [ ] Status iuran (lunas/belum)
- [ ] Jumlah pengaduan aktif
- [ ] Kegiatan terdekat
- [ ] Status CCTV (jika modul CCTV dipilih)

---

## Ringkasan Prioritas (Rekomendasi Tim)

| Prioritas | Modul |
|---|---|
| 🔴 Core | A. Manajemen Kependudukan |
| 🔴 Core | B. Surat-Menyurat |
| 🔴 Core | C. Keuangan / Kas RW |
| 🟠 Penting | D. Iuran Warga |
| 🟠 Penting | E. Pengumuman & Informasi |
| 🟠 Penting | F. Pengaduan Warga |
| 🟡 Opsional | G. Kegiatan & Agenda |
| 🟡 Opsional | H. Fasilitas & Inventaris |
| 🟡 Opsional | I. Manajemen Pengurus |
| 🟡 Opsional | J. Keamanan Lingkungan (CCTV) |
| 🟢 Pengembangan | K. Dashboard Statistik |
| 🟢 Pengembangan | Notifikasi WhatsApp (bagian dari E) |

**Catatan penting saat presentasi ke RW:**
- Sampaikan dokumen ini sebagai **pilihan kebutuhan**, bukan komitmen untuk membangun semuanya.
- Modul Core (A, B, C) adalah fondasi minimum yang direkomendasikan untuk MVP.
- Modul lain dipilih berdasarkan kebutuhan riil di lapangan — hasil checklist inilah yang akan menjadi dasar penentuan scope, aktor, use case, dan fitur MVP dalam tahap analisis/perancangan sistem.

---

## Catatan Tambahan / Kebutuhan Khusus RW

*(diisi saat sesi presentasi/wawancara)*

- ______________________________________________
- ______________________________________________
- ______________________________________________
