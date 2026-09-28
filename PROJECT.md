# PROJECT.md — Sistem Informasi RW

## Ringkasan

Aplikasi digitalisasi administrasi tingkat RW (Rukun Warga), dikembangkan sebagai capstone project bersama mitra RW nyata. Tujuannya membantu pengurus RW mengelola data kependudukan, keuangan kas, iuran warga, informasi/pengumuman, dan (berpotensi) surat-menyurat — secara terpusat, menggantikan proses yang saat ini tersebar di WhatsApp, dokumen fisik, dan spreadsheet terpisah per RT.

## Prinsip Pengembangan

Fitur dalam proyek ini **lahir dari masalah yang dikonfirmasi lewat wawancara/observasi ke mitra**, bukan dari daftar fitur yang secara umum dianggap bagus untuk RW pada umumnya. Sebelum sebuah fitur dianggap final scope, idealnya sudah ada:

1. Deskripsi proses aktual mitra saat ini (siapa melakukan apa, lewat media apa)
2. Kendala konkret yang dialami dalam proses tersebut
3. Dampak kendala itu terhadap pekerjaan pengurus atau warga

Kalau salah satu dari tiga hal itu belum terkonfirmasi, fitur tersebut berstatus **belum tervalidasi sepenuhnya** — statusnya ditandai di tabel bawah.

## Status Fitur (Confirmed untuk MVP)

| # | Fitur | Status | Catatan |
|---|---|---|---|
| 1 | Manajemen Kependudukan | 🟢 Confirmed | Data warga, KK, status tinggal (tetap/kontrak/kos), riwayat masuk/keluar/pindah |
| 2 | Manajemen Keuangan Internal (Kas RW) | 🟢 Confirmed | Pencatatan pemasukan/pengeluaran, laporan berkala |
| 3 | Pembayaran Iuran via QRIS / Payment Gateway | 🟢 Confirmed secara teknologi / 🟡 detail rekonsiliasi mitra masih perlu digali | Menggantikan pencatatan manual + mempermudah rekonsiliasi bendahara |
| 4 | Informasi & Pengumuman RW | 🟢 Confirmed | Distribusi pengumuman, jadwal kegiatan, arsip informasi |
| 5 | Surat-Menyurat | 🟡 Pending konfirmasi | Perlu klarifikasi: jenis surat tersering, alur approval, tanda tangan digital/basah, volume permintaan per bulan |

## Fitur Dikesampingkan dari MVP

Modul-modul berikut sempat dibahas dalam eksplorasi awal tapi **sengaja tidak masuk MVP** kecuali ada kebutuhan eksplisit dari mitra yang terkonfirmasi lewat wawancara:

- Manajemen CCTV / Keamanan Lingkungan
- Dashboard statistik
- Manajemen Pengurus (struktur organisasi, hak akses granular)
- Fasilitas & Inventaris RW
- Kegiatan & Agenda RW
- Pengaduan / Aspirasi Warga

Jangan build fitur-fitur ini tanpa konfirmasi eksplisit dari pengguna — lihat `CLAUDE.md` § Aturan Utama.

## Entitas Domain Utama

| Entitas | Deskripsi |
|---|---|
| **RW** | Unit tertinggi, mitra dari proyek ini |
| **RT** | Sub-unit di bawah RW |
| **KK (Kartu Keluarga)** | Unit keluarga, terhubung ke satu RT |
| **Warga** | Individu, terhubung ke satu KK |
| **Iuran** | Tagihan periodik ke warga/KK (nominal, periode, jenis) |
| **Transaksi Kas** | Pemasukan/pengeluaran kas RW, terhubung ke kategori |
| **Surat** | Pengajuan & penerbitan surat (domisili, usaha, dll.) — *pending konfirmasi* |
| **Pengumuman** | Informasi yang disebarkan ke warga |

## Aktor / Role

- **Admin RW** — akses penuh ke semua modul
- **Pengurus RT** — kelola data warga di wilayahnya, ajukan surat atas nama warga
- **Bendahara** — kelola keuangan & iuran
- **Warga** — lihat info RW, ajukan surat, bayar iuran

> Role ini masih indikatif berdasarkan asumsi struktur RW umum — sesuaikan setelah wawancara mitra mengonfirmasi struktur pengurus sebenarnya.

## Data Sensitif

Aplikasi ini menyimpan data kependudukan (NIK, No. KK, alamat, tempat/tanggal lahir) dan data keuangan warga. Data ini harus diperlakukan sebagai PII dan data finansial: validasi input, kontrol akses berbasis role, dan tidak boleh diekspos tanpa autentikasi yang layak — meski ini masih tahap capstone/MVP.

## Metodologi Latar Belakang (konteks akademik)

Justifikasi tiap fitur dalam laporan capstone mengikuti struktur:

**Konteks digitalisasi → kondisi mitra → masalah aktual (dari wawancara) → dampak → kebutuhan sistem → fitur sebagai respons.**

Data eksternal (mis. statistik penetrasi internet nasional, adopsi QRIS nasional) hanya dipakai sebagai konteks kelayakan teknologi secara umum — **bukan** sebagai bukti bahwa mitra spesifik ini membutuhkan fitur tertentu. Bukti kebutuhan mitra harus berasal dari wawancara/observasi langsung dan dikutip dengan sumber (nama/jabatan narasumber, tanggal).

## Status Proyek Saat Ini

- [x] Diskusi awal & brainstorming fitur
- [x] Draft checklist fitur lengkap untuk presentasi ke RW
- [x] Draft latar belakang capstone (struktur sudah benar, menunggu data wawancara mitra untuk mengisi bagian `[...]`)
- [ ] Wawancara/observasi terstruktur ke mitra per modul
- [ ] Finalisasi scope MVP berdasarkan hasil wawancara
- [ ] Penentuan tech stack & arsitektur
- [ ] Desain database
- [ ] Implementasi
- [ ] Pengujian dengan mitra

## Referensi

- `CLAUDE.md` — panduan kerja untuk Claude Code di repo ini
- `[TODO: path ke draft latar belakang, mis. /docs/latar-belakang.md]`
- `[TODO: path ke checklist fitur untuk presentasi ke RW, mis. /docs/checklist-fitur-rw.md]`

## Tech Stack

> ⚠️ Belum ditentukan dalam percakapan sejauh ini — lengkapi begitu stack sudah diputuskan.

- Backend: `[TODO]`
- Frontend: `[TODO]`
- Database: `[TODO]`
- Payment gateway / QRIS provider: `[TODO]`
- Hosting: `[TODO]`
