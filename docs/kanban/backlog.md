# Backlog Kanban — SI-RW

> Sumber kartu untuk papan Kanban. Aturan mainnya di `workflow.md`.
> Otoritas isi/scope: `docs/laporan/laporan.md`.
> Status: **as-is + back-fill** (rekonstruksi jujur, lihat `workflow.md` §10).

Kode status: `Done` · `In Progress` · `Todo/Ready` · `Backlog` · `Won't`
Bukti = path kode/route/skema yang bisa diverifikasi (atau `—` bila belum ada).

---

## Ringkasan

| Epic | Nama | PIC | Done | In Progress | Backlog | Won't |
|---|---|---|---|---|---|---|
| `EPIC-0` | Fondasi & Infrastruktur | Afif | 6 | 0 | 0 | 0 |
| `EPIC-1` | Publik, Landing Page & Profil RW | Afif | 2 | 0 | 0 | 0 |
| `EPIC-2` | Informasi, Event & Humas | Alizha | 2 | 0 | 3 | 1 |
| `EPIC-3` | Kependudukan & Dashboard Internal | Josua | 9 | 0 | 0 | 0 |
| `EPIC-4` | Keuangan & Kas RT | Safira | 5 | 2 | 1 | 1 |
| `EPIC-5` | Surat-Menyurat | Zidan | 5 | 1 | 2 | 0 |
| — | Grey-out lintas epic | — | — | — | — | 4 |
| **Total** | | | **29** | **3** | **6** | **6** |

> Total kartu: **38** kartu fungsional + **6** grey-out = **44** item papan (+ 6 Epic = **50** item di board).

> Angka `In Progress` = 3 dari limit papan 10 (**KU-02, KU-03, SR-01**). Pelanggaran WIP per orang
> sudah direkonsiliasi — lihat `board.md` §3.

---

## EPIC-0 — Fondasi & Infrastruktur

PIC: Afif (`miralami`) · Epic ini tidak muncul di laporan sebagai modul, tapi menjadi prasyarat semua modul.

| Kode | Kartu | SF | MoSCoW | Status | Bukti |
|---|---|---|---|---|---|
| FND-01 | Scaffold repo: SvelteKit 2 + Svelte 5 (runes) + TypeScript + Tailwind v4 | — | must | **Done** | `package.json`, `vite.config.ts`, `src/app.css`, PR #1 |
| FND-02 | Skema basis data + Drizzle ORM + SQLite (`local.db`) + migrasi | — | must | **Done** | `src/lib/server/db/schema.ts` (13 tabel), `drizzle/` |
| FND-03 | Autentikasi (Better Auth) + RBAC 4 peran + route guard *fail-closed* | — | must | **Done** | `src/lib/server/auth.ts`, `guard.ts`, `permissions.ts` |
| FND-04 | Pustaka komponen UI bersama (Button, Card, DataTable, Modal, Sheet, StatCard, …) | — | must | **Done** | `src/lib/components/` (14 komponen) |
| FND-05 | Dokumentasi & panduan kerja proyek | — | should | **Done** | `CLAUDE.md`, `PROJECT.md`, `README.md`, `docs/` |
| FND-06 | **Membangun papan Kanban + mengisi backlog (rekonstruksi as-is)** | — | must | **Done** | `docs/kanban/*` (backlog, board, workflow) + papan *Capstone - Gr30* (50 item) |

---

## EPIC-1 — Modul Publik, Landing Page & Profil RW

PIC: Afif (`miralami`) · **Selesai 15 Okt 2026.** Landing page publik ada di
`src/routes/+page.svelte` (data di `+page.server.ts`), diakses tanpa login. Pengumuman & agenda
dibaca dari tabel `pengumuman` (`ditampilkan=true`); tanggal diformat di server agar tidak ada
*hydration mismatch*.

| Kode | Kartu | SF | MoSCoW | Status | Bukti |
|---|---|---|---|---|---|
| LP-01 | Landing Page Publik (statis): profil RW (visi, misi, sejarah singkat), SOTK/bagan pengurus, seksi prestasi + galeri foto | *belum ada kode SF* | must | **Done** | `src/routes/+page.svelte`, `+page.server.ts` (commit `1234ab0`) |
| LP-02 | Visualisasi statistik publik: grafik distribusi penduduk per RT, komposisi usia (produktif vs lansia/pensiun), indikator ringkas (kelahiran baru, total warga, rasio produktif) | turunan `SF-KP-07` | must | **Done** | `src/routes/+page.svelte`, `src/lib/components/BarChart.svelte`, `DonutChart.svelte` (commit `1234ab0`) |

**Catatan:** kode SF untuk kedua kartu ini belum ada di `laporan.md` §3.3.4 → lihat `temuan-inkonsistensi.md` (F3).

**Acceptance criteria ringkas — LP-01**
- [x] Halaman publik dapat diakses **tanpa login**.
- [x] Memuat visi, misi, sejarah, SOTK/bagan pengurus, prestasi. *(galeri foto belum ada — belum ada foto asli; area foto memakai placeholder jujur)*
- [x] Tanpa CMS baru — profil/visi/misi/sejarah/SOTK/prestasi tetap statis. *Catatan deviasi: pengumuman & agenda dibaca dari modul eksisting (tabel `pengumuman`), bukan konten statis.*

**Acceptance criteria ringkas — LP-02**
- [x] Grafik distribusi penduduk per RT. (`src/lib/components/BarChart.svelte`)
- [x] Grafik komposisi usia (produktif vs lansia/pensiun). (`src/lib/components/DonutChart.svelte`)
- [x] Indikator ringkas: kelahiran baru, total warga, rasio produktif.
- [x] Grafik ringan (SVG native) dan benar saat data kosong.

---

## EPIC-2 — Modul Informasi, Event & Humas

PIC: Alizha (`alizha13`)

| Kode | Kartu | SF | MoSCoW | Status | Bukti |
|---|---|---|---|---|---|
| EV-A | *(back-fill)* CRUD pengumuman: tambah, edit, arsipkan, daftar terurut | `SF-PG-02`, `SF-PG-03` | must | **Done** | `(app)/pengumuman/+page.server.ts`, `tambah/`, `[id]/edit/` |
| EV-01 | Refactor pengumuman → model **time-based**: field tanggal mulai, tanggal selesai, **lokasi**; status otomatis (Akan Datang / Berlangsung / Selesai) | `SF-PG-01` | must | **Done** | `tanggalMulai`/`tanggalSelesai`/`lokasi` di skema; status otomatis di UI — PR #60 (merge `c1487b5`), issue #22 |
| EV-02 | Attachment berkas notulen/dokumen (PDF/gambar) pada postingan event + akses unduh | *belum ada kode SF* | should | **Backlog** | — |
| EV-03 | Saring & cari pengumuman (kategori + rentang tanggal) | `SF-PG-04` | should | **Backlog** | `load()` masih `select all` tanpa filter |
| EV-BUG-01 | **Defect:** aksi `hapus` melakukan `DELETE` permanen, melanggar `SF-PG-02` (harus arsip, bukan hapus) | `SF-PG-02` | must | **Backlog** | `(app)/pengumuman/+page.server.ts` baris 16–23 |

> Grey-out terkait: **absensi/kehadiran event** (`W-01`) — dinonaktifkan, tidak dikerjakan.

**Acceptance criteria ringkas — EV-01**
- [x] Ada field `lokasi` pada postingan event.
- [x] Status dihitung otomatis dari waktu server: sebelum `tanggalMulai` = "Akan Datang", di antara = "Berlangsung", setelah `tanggalSelesai` = "Selesai".
- [x] Pengumuman tanpa tanggal diperlakukan sebagai "umum" (selalu tampil).
- [x] Test: 3 kondisi batas (sebelum/selama/sesudah) terverifikasi.

---

## EPIC-3 — Modul Kependudukan & Dashboard Internal

PIC: Josua (`josuasahat`)

| Kode | Kartu | SF | MoSCoW | Status | Bukti |
|---|---|---|---|---|---|
| KP-A | *(back-fill)* CRUD warga + validasi NIK/No KK 16 digit + cegah duplikat | `SF-KP-01` | must | **Done** | `(app)/warga/tambah/`, `[id]/edit/` |
| KP-B | *(back-fill)* Audit perubahan warga (riwayat, alasan, pelaku) | `SF-KP-02` | must | **Done** | tabel `riwayat_warga` |
| KP-C | *(back-fill)* Nonaktifkan warga (tanggal + alasan) tanpa hapus permanen | `SF-KP-03` | must | **Done** | `warga.alasanNonaktif`, `tanggalNonaktif` |
| KP-D | *(back-fill)* Masking NIK & No. KK pada daftar | `SF-KP-05` | must | **Done** | `src/lib/format.ts` → `maskNik`, `maskNoKk` |
| KP-02 | Impor massal data warga (CSV) + validasi per baris + pelaporan error | `SF-KP-06` | must | **Done** | `(app)/warga/impor/+page.server.ts` (parser + error list) |
| KP-01 | Perhitungan demografis otomatis **sesuai spesifikasi**: Balita, Usia Sekolah, Produktif (15–64), Pensiun/Lansia (≥65), angka kelahiran baru | `SF-KP-07` | must | **Done** | `src/lib/server/usia.ts`; bucket sesuai + angka kelahiran — PR #61 (merge `8009f72`), issue #33 |
| KP-03 | Dashboard pengurus internal: saldo kas total, total penduduk, grafik demografi | `SF-KS-04` + `SF-KP-07` | must | **Done** | `dashboard/+page.server.ts` + grafik demografi — PR #61, issue #32 |
| KP-04 | Portal warga (profil individu): periksa data KK & anggota keluarga terdaftar | `SF-IU-05` | should | **Done** | `portal/` (KK & anggota) — PR #61, issue #34 |
| KP-05 | Pengajuan pembaruan data kependudukan oleh warga + alur persetujuan | `SF-KP-08` | should | **Done** | `portal/perbaruan/*` state machine + validasi Zod — PR #61, issue #35 |

**Acceptance criteria ringkas — KP-01**
- [x] Bucket persis: Balita, Usia Sekolah, Produktif (15–64), Pensiun/Lansia (≥65).
- [x] Metrik angka kelahiran baru (periode terpilih).
- [x] Rekap per RT + ekspor CSV (sudah ada, cukup disesuaikan).
- [x] Uji batas usia 14/15 dan 64/65.
> Bukti: PR #61 (merge `8009f72`) — lihat `src/lib/server/usia.ts`.

**Acceptance criteria ringkas — KP-03**
- [x] Widget saldo kas total & total penduduk (sudah).
- [x] Grafik ringkas demografi internal (perlu).
- [x] Hanya peran internal yang dapat mengakses.
> Bukti: PR #61 — lihat `dashboard/+page.server.ts`.

---

## EPIC-4 — Modul Keuangan & Kas RT

PIC: Safira (`shaffiraindanazulfa`)

| Kode | Kartu | SF | MoSCoW | Status | Bukti |
|---|---|---|---|---|---|
| KU-A | *(back-fill)* Kas RW: pemasukan, pengeluaran, saldo otomatis | `SF-KS-01`/`02`/`04` | must | **Done** | `(app)/kas/`, `kas/tambah/` |
| KU-B | *(back-fill)* Audit trail & koreksi via pembatalan (void + alasan, tanpa hapus fisik) | `SF-KS-06` | must | **Done** | `dibatalkan`, `alasanBatal`, `dibatalkanOleh`; aksi void di `kas/+page.svelte` |
| KU-C | *(back-fill)* Laporan kas per periode + ekspor CSV | `SF-KS-05` | must | **Done** | ekspor `laporan_kas_*.csv` di `(app)/kas/+page.svelte` |
| KU-04 | Manajemen kategori transaksi (pos pengeluaran & penerimaan) | `SF-KS-02` (kategori) | should | **Done** | tabel `kategori_kas` + `(app)/kas/kategori/` |
| KU-D | *(back-fill)* Iuran: jenis, generate tagihan, bayar manual → masuk kas, status di portal | `SF-IU-01`/`02`/`03`/`05` | must | **Done** | `iuran/jenis/`, `iuran/generate/`, `iuran/[id]/bayar/`, `portal/` |
| KU-02 | **Rekapitulasi iuran wajib RT** (pergeseran fokus dari tagihan murni → rekap penerimaan) | `SF-IU-06` | must | **In Progress** | `iuran/rekap/` sudah ada + ekspor CSV; model masih berbasis `tagihan` |
| KU-01 | **Pemisahan Kas RT** (sub-modul kas mandiri per RT: kas sosial/kematian, tiap RT berbeda) | *belum ada kode SF* | must | **Backlog** | — (tidak ada tabel/route `kas_rt`) |
| KU-03 | Ekspor laporan keuangan ke CSV (kas RW **dan kas RT**) | `SF-KS-05` | should | **In Progress** | kas RW **sudah**; kas RT menunggu KU-01 |

> Grey-out: **QRIS / payment gateway live** (`W-03`) — saat ini hanya mock (`pembayaran.metodeBayar = 'qris'`, field `referensi`).

**Acceptance criteria ringkas — KU-01**
- [ ] Skema `transaksi_kas_rt` (atau setara) terpisah dari `transaksi_kas` RW, terhubung ke `rt`.
- [ ] Halaman kas per RT untuk bendahara/pengurus RT.
- [ ] Kas RW tetap berjalan sebagai kas internal tingkat RW (tidak tercampur).
- [ ] Total/saldo per RT dan agregat RW dihitung benar.

**Acceptance criteria ringkas — KU-02**
- [ ] Fokus berubah dari "tagihan wajib bayar" → "rekapitulasi penerimaan iuran wajib RT".
- [ ] Rekap per RT per periode (siapa sudah/belum) + ekspor CSV.
- [ ] Tautan `laporan.md`: selaraskan istilah `SF-IU-02`/`SF-IU-06`.

---

## EPIC-5 — Modul Surat-Menyurat

PIC: Zidan (`elfarizidan`) · **Status scope perlu ditegaskan** (lihat `temuan-inkonsistensi.md` F1). Secara kode, modul ini **sudah cukup jauh terbangun**.

| Kode | Kartu | SF | MoSCoW | Status | Bukti |
|---|---|---|---|---|---|
| SR-A | *(back-fill)* Pengajuan surat warga + unggah dokumen syarat + pantau status | `SF-SR-01`/`02`/`03` | must | **Done** | `portal/surat/ajukan/`, `src/lib/server/storage.ts` |
| SR-B | *(back-fill)* Manajemen & verifikasi surat pengurus (daftar + detail) | `SF-SR-04` | must | **Done** | `(app)/surat/`, `(app)/surat/[id]/` |
| SR-C | *(back-fill)* Setujui + nomor surat otomatis + tanggal terbit | `SF-SR-05` | must | **Done** | aksi `setujui` membuat `nomorSurat` `470/…/RW.01/…` |
| SR-D | *(back-fill)* Cetak/unduh surat (slip siap cetak) | `SF-SR-06` | must | **Done** | `(app)/surat/[id]/cetak/`, `portal/surat/[id]/cetak/` |
| SR-E | *(back-fill)* Riwayat surat (staff) + riwayat milik warga | `SF-SR-07` | should | **Done** | `(app)/surat/+page.server.ts` |
| SR-01 | Katalog template surat standar **A s/d G** (Domisili, SKCK, SKTM, Kematian, Kelahiran, Usaha, Umum) | `SF-SR-01` | must | **In Progress** | `jenis` baru mencakup `skck/sktm/domisili/usaha/umum`; kematian/kelahiran & template per jenis belum |
| SR-03b | Tanda tangan digital pengurus pada dokumen surat | `SF-SR-05` (pelengkap) | must | **Backlog** | halaman cetak sudah punya **ruang ttd kosong** (`.ttd-space`), belum ada tanda tangan digital |
| SR-BUG-01 | **Defect:** aksi verifikasi/setujui/tolak memakai fallback `locals.user?.id ?? 'system'` dan tidak memvalidasi peran pada aksi | `SF-SR-04`/`05` | must | **Backlog** | `(app)/surat/[id]/+page.server.ts` baris 55, 70 |

**Acceptance criteria ringkas — SR-01**
- [ ] Tersedia katalog template A–G dengan field khusus per jenis.
- [ ] Pemilihan jenis surat memuat formulir yang sesuai.
- [ ] Data warga terisi otomatis dari modul kependudukan.

**Acceptance criteria ringkas — SR-03b**
- [ ] Tanda tangan pengurus tertanam pada dokumen terbit (bukan ruang kosong).
- [ ] Dapat diverifikasi/diunduh sebagai PDF.

---

## Grey-out (Won't) — Lintas Epic

| Kode | Fitur dikecualikan | Alasan |
|---|---|---|
| W-01 | Absensi / check-in event warga | Belum ada urgensi |
| W-02 | CMS dinamis landing page | Konten cukup statis |
| W-03 | Payment Gateway / QRIS live production | Masih konsep/mock |
| W-04 | Modul CCTV / keamanan lingkungan | Bukan tupoksi inti RW |
| W-05 | Inventaris fisik barang | Bukan fungsi inti |
| W-06 | Manajemen pengurus kompleks | Cukup RBAC 4 peran |

---

## Kartu Terverifikasi "Tidak Ada" (bukti ketiadaan)

Hasil pencarian kode (grep) untuk memastikan status `Backlog` bukan tebakan
(**audit per 12 Okt 2026**, saat kartu masih `Backlog`; LP-01/LP-02 kini sudah diimplementasikan):

| Kata kunci dicari | Hasil | Implikasi |
|---|---|---|
| `kas_rt` / `kasRt` / `transaksiKasRt` | tidak ditemukan | KU-01 benar-benar belum ada |
| `prestasi` / `sotk` / `visi` / `misi` / `sejarah` | tidak ditemukan *(saat audit)* | LP-01 belum ada saat audit — **kini sudah ada** di `src/routes/+page.svelte` |
| `lokasi` (sebagai field event) | tidak ditemukan | EV-01 belum lengkap |
| `produktif` | tidak ditemukan | KP-01 bucket belum sesuai spesifikasi |
| `tandaTangan` / `signature` (logika) | tidak ditemukan | SR-03b belum ada |
