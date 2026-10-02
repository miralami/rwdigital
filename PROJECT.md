# PROJECT.md — Sistem Informasi RW

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

### Core MVP (Confirmed)

| # | Fitur | Dasar Hukum | Status |
|---|---|---|---|
| 1 | Manajemen Kependudukan | Facilitative duty — RW bantu pendataan warga (Permendagri 18/2018) | Sudah ada |
| 2 | Kas RW | Dana swadaya masyarakat diakui | Sudah ada |
| 3 | Iuran | Dana swadaya masyarakat | Sudah ada |
| 4 | Pengumuman | Distribusi informasi = fungsi resmi | Sudah ada |

### High Priority (Phase 2)

| # | Fitur | Dasar Hukum | Status |
|---|---|---|---|
| 5 | Aspirasi & Pengaduan | Fungsi resmi — Permendagri 18/2018 mewajibkan RT/RW tampilkan & salurkan aspirasi | Belum ada |
| 6 | Notifikasi | Pendukung fungsi distribusi informasi | Belum ada |

### Medium (Phase 3)

| # | Fitur | Dasar Hukum | Status |
|---|---|---|---|
| 7 | Agenda & Kegiatan | Musyawarah = fungsi resmi | Belum ada |
| 8 | Dashboard Statistik | Analisis data internal | Belum ada |

### Out of Scope

| Fitur | Alasan |
|---|---|
| Surat-Menyurat | Bukan tupoksi resmi — de facto practice, diatur Perdes/Perbup lokal. Kompleksitas approval flow tinggi. |
| CCTV | Bukan fungsi RW |
| Inventaris | Bukan fungsi inti |
| Manajemen Pengurus | Bisa disederhanakan via role-based access |

### Referensi Hukum
- UU No. 6 Tahun 2014 tentang Desa
- Permendagri No. 18 Tahun 2018 tentang Lembaga Kemasyarakatan Desa dan Lembaga Adat Desa
- PP No. 43 Tahun 2014 tentang Pelaksanaan UU Desa

## Fitur Dikesampingkan dari MVP

Modul-modul berikut **sengaja tidak masuk scope** dan tidak ada rencana pengerjaannya:

- Manajemen CCTV / Keamanan Lingkungan
- Manajemen Pengurus (struktur organisasi, hak akses granular)
- Fasilitas & Inventaris RW
- Dashboard statistik (sudah diprioritaskan sebagai Phase 3 — lihat tabel di atas)

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
| **Surat** | Pengajuan & penerbitan surat (domisili, usaha, dll.) — *out of scope (bukan tupoksi resmi)* |
| **Pengumuman** | Informasi yang disebarkan ke warga |

## Aktor / Role

- **Admin RW** — akses penuh ke semua modul
- **Pengurus RT** — kelola data warga di wilayahnya, ajukan surat atas nama warga
- **Bendahara** — kelola keuangan & iuran
- **Warga** — lihat info RW, ajukan surat, bayar iuran

> Role ini berdasarkan asumsi struktur RW umum — sesuaikan jika nanti ada klarifikasi dari mitra.

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
- [ ] Implementasi
- [ ] Pengujian dengan mitra

## Referensi

- `CLAUDE.md` — panduan kerja untuk Claude Code di repo ini
- `docs/laporan/draft.md` — draft laporan capstone
- `docs/checklist.md` — checklist fitur untuk presentasi ke RW

## Tech Stack

> ⚠️ Belum ditentukan dalam percakapan sejauh ini — lengkapi begitu stack sudah diputuskan.

- Backend: `[TODO]`
- Frontend: `[TODO]`
- Database: `[TODO]`
- Payment gateway / QRIS provider: `[TODO]`
- Hosting: `[TODO]`
