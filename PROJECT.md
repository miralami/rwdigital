# PROJECT.md — Sistem Informasi RW

> **Otoritas tertinggi proyek: `docs/laporan/laporan.md`.** Dokumen ini (dan `plan.md`,
> `docs/checklist.md`) adalah dokumen pendukung yang diselaraskan ke laporan.
> Status pengerjaan aktual per modul: `docs/kanban/backlog.md`.

## Ringkasan

Aplikasi digitalisasi administrasi tingkat RW (Rukun Warga), dikembangkan sebagai capstone project bersama mitra RW nyata. Tujuannya membantu pengurus RW mengelola data kependudukan, keuangan kas, iuran warga, informasi/pengumuman, dan (berpotensi) surat-menyurat — secara terpusat, menggantikan proses yang saat ini tersebar di WhatsApp, dokumen fisik, dan spreadsheet terpisah per RT.

## Prinsip Pengembangan

Fitur dalam proyek ini ditetapkan berdasarkan **analisis regulasi resmi** (UU Desa 6/2014, Permendagri 18/2018) dan **evaluasi plausibility** untuk implementasi capstone, mengingat kondisi mitra yang memungkinkan untuk diwawancara. 

Idealnya, sebuah fitur memiliki validasi lewat:
1. Deskripsi proses aktual mitra saat ini
2. Kendala koncret yang dialami
3. Dampak kendala terhadap pekerjaan pengurus atau warga

Dalam ketiadaan wawancara, regulasi resmi menjadi dasar utama penentuan scope — dengan asumsi bahwa fitur yang diatur dalam tupoksi RW secara hukum adalah fitur yang paling plausible untuk dibutuhkan.

## Status Fitur (Final — Berdasarkan Regulasi & Plausibility Analysis)

> Feature set ini ditetapkan tanpa wawancara mitra (tidak memungkinkan), berdasarkan analisis regulasi resmi (UU Desa 6/2014, Permendagri 18/2018) dan plausibility untuk implementasi capstone.

### Core MVP (Confirmed — Berdasarkan laporan.md)

| # | Fitur | Dasar Hukum / Regulasi | Status |
|---|---|---|---|
| 1 | Manajemen Kependudukan | Facilitative duty — RW bantu pendataan warga (Permendagri 18/2018) | Sudah ada (perlu penyempurnaan) |
| 2 | Surat-Menyurat | Pelayanan administrasi warga (SF-SR-01..07) | Dalam perancangan / scaffolding |
| 3 | Kas RW | Dana swadaya masyarakat diakui | Sudah ada (perlu penyempurnaan) |
| 4 | Kas RT | Dana swadaya masyarakat per RT (uang sosial, kematian, dll.) | Baru — tambahan MVP |
| 5 | Iuran | Dana swadaya masyarakat | Sudah ada (perlu penyempurnaan) |
| 6 | Pengumuman & Event | Distribusi informasi = fungsi resmi | Perluasan: event time-based + attachment |
| 7 | Landing Page & Dashboard Statistik | Analisis data internal + profil RW publik | Baru — MVP |

### High Priority (Phase 2)

| # | Fitur | Dasar Hukum | Status |
|---|---|---|---|
| 8 | Aspirasi & Pengaduan | Fungsi resmi — Permendagri 18/2018 | Belum ada |
| 9 | Notifikasi | Pendukung fungsi distribusi informasi | Belum ada |
| 10 | Angka Kelahiran / Produktif / Pensiun (Computed Stats) | Turunan data kependudukan | Belum ada |
| 11 | Statistik Event (Kehadiran) | Analisis data internal | Belum ada |

### Medium (Phase 3)

| # | Fitur | Dasar Hukum | Status |
|---|---|---|---|
| 12 | Agenda & Kegiatan | Musyawarah = fungsi resmi | Belum ada |
| 13 | Dashboard Statistik Lanjutan (Trend, Prediksi) | Analisis data internal | Belum ada |

### Out of Scope

| Fitur | Alasan |
|---|---|
| CCTV | Bukan fungsi RW |
| Inventaris | Bukan fungsi inti |
| Manajemen Pengurus Kompleks | Cukup disederhanakan via role-based access |

### Referensi Hukum
- UU No. 6 Tahun 2014 tentang Desa
- Permendagri No. 18 Tahun 2018 tentang Lembaga Kemasyarakatan Desa dan Lembaga Adat Desa
- PP No. 43 Tahun 2014 tentang Pelaksanaan UU Desa

## Fitur Dikesampingkan dari MVP

Modul-modul berikut **sengaja tidak masuk scope** dan tidak ada rencana pengerjaannya:

- Manajemen CCTV / Keamanan Lingkungan
- Manajemen Pengurus (struktur organisasi, hak akses granular)
- Fasilitas & Inventaris RW
- Absensi / Check-in Event (belum ada urgensi)
- CMS untuk Landing Page (konten statis cukup)

Jangan build fitur-fitur ini tanpa konfirmasi eksplisit dari pengguna — lihat `CLAUDE.md` § Aturan Utama.

## Entitas Domain Utama

| Entitas | Deskripsi |
|---|---|
| **RW** | Unit tertinggi, mitra dari proyek ini |
| **RT** | Sub-unit di bawah RW |
| **KK (Kartu Keluarga)** | Unit keluarga, terhubung ke satu RT |
| **Warga** | Individu, terhubung ke satu KK |
| **Iuran** | Tagihan periodik ke warga/KK (nominal, periode, jenis) |
| **Transaksi Kas RW** | Pemasukan/pengeluaran kas tingkat RW, terhubung ke kategori |
| **Transaksi Kas RT** | Pemasukan/pengeluaran kas tingkat RT (uang sosial, kematian, dll.), terpisah per RT |
| **Surat** | Pengajuan & penerbitan surat (SKCK, SKTM, domisili, dll.) — SF-SR-01..07 |
| **Pengumuman** | Informasi yang disebarkan ke warga |
| **Event** | Kegiatan berbasis waktu (jadwal, attachment notulen, statistik kehadiran) |

## Aktor / Role & Manajemen Akun

- **Admin RW** — akses penuh ke semua modul, pembuatan/penugasan akun staf dan warga (mencegah pendaftaran NIK fiktif/ganda)
- **Pengurus RT** — kelola data warga di wilayahnya, verifikasi pengajuan surat warga
- **Bendahara** — kelola keuangan kas & iuran
- **Warga** — lihat info RW, ajukan surat, pantau tagihan & riwayat iuran pribadi

> **Kebijakan Pendaftaran Akun**: Akun warga dibuat langsung oleh Admin RW (bukan registrasi publik mandiri) untuk menjamin validitas NIK dan mencegah penyalahgunaan identitas.

## Penyimpanan Berkas

Berkas bukti transaksi kas dan dokumen persyaratan surat disimpan di direktori lokal server (`static/uploads/` atau folder upload lokal yang aman).

## Data Sensitif

Aplikasi ini menyimpan data kependudukan (NIK, No. KK, alamat, tempat/tanggal lahir) dan data keuangan warga. Data ini harus diperlakukan sebagai PII dan data finansial: validasi input, kontrol akses berbasis role, dan tidak boleh diekspos tanpa autentikasi yang layak — meski ini masih tahap capstone/MVP.

## Metodologi Latar Belakang (konteks akademik)

Justifikasi tiap fitur dalam laporan capstone mengikuti struktur:

**Konteks digitalisasi → dasar regulasi (tupoksi RW) → plausibility analysis → kebutuhan sistem → fitur sebagai respons.**

Karena mitra tidak dapat diwawancarai, justifikasi fitur mengacu pada:
1. **Regulasi resmi** — UU Desa 6/2014, Permendagri 18/2018 sebagai dasar tupoksi RW
2. **Plausibility analysis** — evaluasi kelayakan implementasi untuk konteks capstone
3. **Praktik umum** — de facto practices yang luas diterima di lingkungan RW Indonesia

Data eksternal (mis. statistik penetrasi internet nasional, adopsi QRIS nasional) hanya dipakai sebagai konteks kelayakan teknologi secara umum.

## Status Proyek Saat Ini

- [x] Diskusi awal & brainstorming fitur
- [x] Draft checklist fitur lengkap untuk presentasi ke RW
- [x] Draft latar belakang capstone (struktur sudah benar)
- [x] Analisis regulasi & plausibility (pengganti wawancara mitra)
- [x] Finalisasi scope MVP berdasarkan regulasi
- [x] Penentuan tech stack & arsitektur
- [x] Desain database
- [ ] Implementasi — sedang berjalan (status per modul: `docs/kanban/backlog.md`)
- [ ] Pengujian dengan mitra

## Referensi

- `CLAUDE.md` — panduan kerja untuk Claude Code di repo ini
- `docs/laporan/laporan.md` — laporan capstone (otoritas tertinggi)
- `docs/kanban/backlog.md` — status pengerjaan aktual per modul
- `docs/checklist.md` — checklist fitur untuk presentasi ke RW

## Tech Stack

- **Bahasa & Framework**: SvelteKit 2 + Svelte 5 (TypeScript, runes mode)
- **CSS**: Tailwind CSS v4 via `@tailwindcss/vite` — design tokens di `src/app.css` (@theme)
- **Database**: SQLite via Turso/libsql (`file:local.db` lokal, `libsql://...` production)
- **ORM / Query Layer**: Drizzle ORM (`drizzle-orm/libsql`) + drizzle-kit migrations
- **Autentikasi**: Better Auth dengan `admin` plugin — roles: `admin_rw`, `pengurus_rt`, `bendahara`, `warga`
- **Payment Gateway / QRIS Provider**: `[TODO — konfirmasi mitra dulu]`
- **Hosting/Deployment**: `[TODO]`
