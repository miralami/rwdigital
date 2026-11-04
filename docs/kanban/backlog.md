# Backlog Kanban — SI-RW

> Sumber kartu untuk papan Kanban. Aturan mainnya di `workflow.md`.
> Otoritas isi/scope: `docs/laporan/laporan.md`.
> Status: **as-is + back-fill** (rekonstruksi jujur, lihat `workflow.md` §10).

Kode status: `Done` · `In Progress` · `Todo/Ready` · `Backlog` · `Won't`
Bukti = path kode/route/skema yang bisa diverifikasi (atau `—` bila belum ada).

---

## Ringkasan

| Epic | Nama | PIC | Done | In Progress | Todo | Won't |
|---|---|---|---|---|---|---|
| `EPIC-0` | Fondasi & Infrastruktur | Afif | 8 | 0 | 0 | 0 |
| `EPIC-1` | Publik, Landing Page & Profil RW | Afif | 2 | 0 | 0 | 0 |
| `EPIC-2` | Informasi, Event & Humas | Alizha | 3 | 0 | 3 | 0 |
| `EPIC-3` | Keluarga (KK) & Dashboard Internal | Josua | 9 | 0 | 0 | 0 |
| `EPIC-4` | Keuangan, Kas RT & Iuran | Safira | 9 | 0 | 0 | 0 |
| `EPIC-5` | Surat-Menyurat | Zidan | 9 | 0 | 0 | 0 |
| Iterasi 2 | Iuran, surat, landing, CI, scoping | — | 9 | 0 | 0 | 0 |
| Iterasi 3 | RBAC, notifikasi, KK-first, iuran 2 tingkat | — | 4 | 0 | 0 | 0 |
| — | Grey-out lintas epic | — | 3 | 0 | 0 | 3 |
| **Total** | | | **61** | **0** | **4** | **3** |

> Total item papan: **68** (6 Epic + 43 kartu fungsional + 6 grey-out + 9 kartu iterasi 2 + 4 kartu iterasi 3).
> Lima kartu fungsional berasal dari audit commit lama (lihat §Jejak Lama di bawah).

> Status per **3 Nov 2026** setelah rekonsiliasi pasca-refactor KK-first. Tidak ada kartu `In Progress`;
> sisa pekerjaan berupa 4 `Todo` (EPIC-2, EV-02, EV-03, EV-BUG-01) dan 3 `Won't`
> (W-01, W-04, W-05). Lihat `board.md` §5.2.
>
> **Aturan revisi:** kartu `Done` tidak dibuka ulang. Perubahan kebutuhan dari mitra dicatat
> sebagai **kartu baru** yang merujuk kartu asalnya (mis. `R-xx`), supaya riwayat papan tetap
> jujur dan jumlah kartu bertambah sesuai pekerjaan nyata.

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

## EPIC-3 — Modul Keluarga (KK) & Dashboard Internal

PIC: Josua (`josuasahat`)

> Sejak 3 Nov 2026 data kependudukan dikelola **keluarga-first** (KK → anggota), route `/warga`
> dipindah ke `/kk`. Istilah kartu diselaraskan; kode kartu lama tetap dipakai.

| Kode | Kartu | SF | MoSCoW | Status | Bukti |
|---|---|---|---|---|---|
| KP-A | *(back-fill)* CRUD KK & anggota keluarga + validasi NIK/No KK 16 digit + cegah duplikat | `SF-KP-01` | must | **Done** | `(app)/kk/tambah/`, `[id]/edit/` |
| KP-B | *(back-fill)* Audit perubahan data keluarga (riwayat, alasan, pelaku) | `SF-KP-02` | must | **Done** | tabel `riwayat_warga` |
| KP-C | *(back-fill)* Nonaktifkan anggota keluarga (tanggal + alasan) tanpa hapus permanen | `SF-KP-03` | must | **Done** | `warga.alasanNonaktif`, `tanggalNonaktif` |
| KP-D | *(back-fill)* Masking NIK & No. KK pada daftar | `SF-KP-05` | must | **Done** | `src/lib/format.ts` → `maskNik`, `maskNoKk` |
| KP-02 | Impor massal data KK & warga (CSV) + validasi per baris + pelaporan error | `SF-KP-06` | must | **Done** | `(app)/kk/impor/+page.server.ts` (parser + error list) |
| KP-01 | Perhitungan demografis otomatis **sesuai spesifikasi**: Balita, Usia Sekolah, Produktif (15–64), Pensiun/Lansia (≥65), angka kelahiran baru | `SF-KP-07` | must | **Done** | `src/lib/server/usia.ts`; bucket sesuai + angka kelahiran — PR #61 (merge `8009f72`), issue #33 |
| KP-03 | Dashboard pengurus internal: KPI saldo kas, total KK/warga, grafik demografi | `SF-KS-04` + `SF-KP-07` | must | **Done** | `dashboard/+page.server.ts` + grafik demografi — PR #61, issue #32 |
| KP-04 | Portal warga (profil KK): periksa data KK & anggota keluarga terdaftar | `SF-IU-05` | should | **Done** | `portal/` (KK & anggota) — PR #61, issue #34 |
| KP-05 | Pengajuan pembaruan data keluarga oleh warga + alur persetujuan | `SF-KP-08` | should | **Done** | `portal/perbaruan/*` state machine + validasi Zod — PR #61, issue #35 |
| KP-08 | Refactor KK-first: migrasi `/warga` → `/kk`, tabel KK terkelompok, alur tambah KK + anggota | — | must | **Done** | commit `d18065c`, `8e9e31a` — issue #93 |

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

## EPIC-4 — Modul Keuangan, Kas RT & Iuran

PIC: Safira (`shaffiraindanazulfa`)

| Kode | Kartu | SF | MoSCoW | Status | Bukti |
|---|---|---|---|---|---|
| KU-A | *(back-fill)* Kas RW: pemasukan, pengeluaran, saldo otomatis | `SF-KS-01`/`02`/`04` | must | **Done** | `(app)/kas/`, `kas/tambah/` |
| KU-B | *(back-fill)* Audit trail & koreksi via pembatalan (void + alasan, tanpa hapus fisik) | `SF-KS-06` | must | **Done** | `dibatalkan`, `alasanBatal`, `dibatalkanOleh`; aksi void di `kas/+page.svelte` |
| KU-C | *(back-fill)* Laporan kas per periode + ekspor CSV | `SF-KS-05` | must | **Done** | filter periode + `unduhFileCsv`/`unduhFileExcel` di `(app)/kas/+page.svelte` |
| KU-04 | Manajemen kategori transaksi (pos pengeluaran & penerimaan) | `SF-KS-02` (kategori) | should | **Done** | tabel `kategori_kas` + `(app)/kas/kategori/` |
| KU-D | *(back-fill)* Iuran: jenis, generate tagihan, bayar manual → masuk kas, status di portal | `SF-IU-01`/`02`/`03`/`05` | must | **Done** | `iuran/jenis/`, `iuran/generate/`, `iuran/[id]/bayar/`, `portal/` |
| KU-02 | **Rekapitulasi iuran wajib RT** (pergeseran fokus dari tagihan murni → rekap penerimaan) | `SF-IU-06` | must | **Done** | `iuran/rekap/` + rekap per periode di `kas/+page.svelte` |
| KU-01 | **Pemisahan Kas RT** (sub-modul kas mandiri per RT: kas sosial/kematian, tiap RT berbeda) | *belum ada kode SF* | must | **Done** | tabel `transaksi_kas_rt` + bagian "Kas Mandiri per-RT" di `(app)/kas/` — commit `6162e8f` |
| KU-03 | Ekspor laporan keuangan ke CSV/Excel (kas RW **dan kas RT**) | `SF-KS-05` | should | **Done** | `unduhFileCsv`/`unduhFileExcel` di `(app)/kas/+page.svelte` (RW, RT, rekap iuran) |
| KU-05 | Iuran 2 tingkat RT/RW, tagihan otomatis, dan pembayaran Midtrans di portal | `SF-IU-01`–`06` | must | **Done** | commit `2a1a30c`, `6a89b42` — `iuran/*`, `portal/iuran/*`, `api/midtrans/charge-iuran` — issue #94 |

> Grey-out lama **W-03 (QRIS/payment gateway)** sudah **naik ke dalam scope** dan ditutup sebagai
> bagian KU-05: integrasi Midtrans tersedia di sandbox, siap produksi dengan kredensial resmi.

**Acceptance criteria ringkas — KU-01**
- [x] Skema `transaksi_kas_rt` (atau setara) terpisah dari `transaksi_kas` RW, terhubung ke `rt`.
- [x] Halaman kas per RT untuk bendahara/pengurus RT.
- [x] Kas RW tetap berjalan sebagai kas internal tingkat RW (tidak tercampur).
- [x] Total/saldo per RT dan agregat RW dihitung benar.

**Acceptance criteria ringkas — KU-02**
- [x] Fokus berubah dari "tagihan wajib bayar" → "rekapitulasi penerimaan iuran wajib RT".
- [x] Rekap per RT per periode (siapa sudah/belum) + ekspor CSV.
- [x] Tautan `laporan.md`: selaraskan istilah `SF-IU-02`/`SF-IU-06`.

---

## EPIC-5 — Modul Surat-Menyurat

PIC: Zidan (`elfarizidan`) · **Selesai 3 Nov 2026** (termasuk TTD elektronik & otorisasi aksi surat).

| Kode | Kartu | SF | MoSCoW | Status | Bukti |
|---|---|---|---|---|---|
| SR-A | *(back-fill)* Pengajuan surat warga + unggah dokumen syarat + pantau status | `SF-SR-01`/`02`/`03` | must | **Done** | `portal/surat/ajukan/`, `src/lib/server/storage.ts` |
| SR-B | *(back-fill)* Manajemen & verifikasi surat pengurus (daftar + detail) | `SF-SR-04` | must | **Done** | `(app)/surat/`, `(app)/surat/[id]/` |
| SR-C | *(back-fill)* Setujui + nomor surat otomatis + tanggal terbit | `SF-SR-05` | must | **Done** | aksi `setujui` membuat `nomorSurat` `470/…/RW.01/…` |
| SR-D | *(back-fill)* Cetak/unduh surat (slip siap cetak) | `SF-SR-06` | must | **Done** | `(app)/surat/[id]/cetak/`, `portal/surat/[id]/cetak/` |
| SR-E | *(back-fill)* Riwayat surat (staff) + riwayat milik warga | `SF-SR-07` | should | **Done** | `(app)/surat/+page.server.ts` |
| SR-01 | Katalog jenis surat standar (SKCK, SKTM, Domisili, Usaha, Umum) | `SF-SR-01` | must | **Done** | `portal/surat/ajukan/+page.server.ts` (5 jenis) — issue #49 |
| SR-03b | Tanda tangan digital pengurus pada dokumen surat | `SF-SR-05` (pelengkap) | must | **Done** | tabel `ttd_pejabat`, `/pengaturan/ttd`, snapshot TTD di cetak surat — commit `c3fb151` (PR #90), issue #48 |
| SR-BUG-01 | **Defect:** aksi verifikasi/setujui/tolak memakai fallback `system` dan tidak memvalidasi peran | `SF-SR-04`/`05` | must | **Done** | `requirePermission(locals, 'surat', 'update')` + `requireRtAccess` di tiap aksi — issue #50 |

**Acceptance criteria ringkas — SR-01**
- [x] Tersedia katalog jenis surat standar dengan formulir sesuai jenis.
- [x] Pemilihan jenis surat memuat formulir yang sesuai.
- [x] Data warga terisi otomatis dari modul keluarga (KK).

**Acceptance criteria ringkas — SR-03b**
- [x] Tanda tangan pengurus tertanam pada dokumen terbit (bukan ruang kosong).
- [x] Dapat diverifikasi/diunduh sebagai PDF.

---

## Grey-out — Lintas Epic

### Masih `Won't` (3)

| Kode | Fitur dikecualikan | Alasan |
|---|---|---|
| W-01 | Absensi / check-in event warga | Belum ada urgensi |
| W-04 | Modul CCTV / keamanan lingkungan | Bukan tupoksi inti RW |
| W-05 | Inventaris fisik barang | Bukan fungsi inti |

### Naik ke dalam scope (3 Nov 2026)

| Kode | Fitur | Status baru | Bukti |
|---|---|---|---|
| W-02 | Pengaturan landing page dinamis + galeri foto | **Done** | PR #77 (`678ccca`) — `/pengaturan/landing`, tabel `pengaturan_landing` & `galeri` |
| W-03 | Payment gateway QRIS via Midtrans | **Done** (sandbox, siap produksi) | `api/midtrans/*`, `src/lib/server/midtrans.ts` — commit `2a1a30c` |
| W-06 | Manajemen pengurus, RT & peran | **Done** | commit `d4d0b42`, `2a1a30c`, `b085473`, `d692418` — `/pengaturan/pengurus`, `/rt`, `/peran` |

---

## Iterasi 2 & 3 — Kartu Tambahan

Kartu yang dibuat setelah baseline 12 Okt dan tidak memakai kode `FND/KP/KU/SR` semula.

| Kode | Kartu | Issue | Status |
|---|---|---|---|
| KU-01b | Setoran RT → RW & rekonsiliasi | #65 | **Done** |
| KU-02b | Skema iuran & generate tagihan per RT | #66 | **Done** |
| FND-07 | CI + test harness (Vitest & Playwright) | #67 | **Done** |
| LP-03 | Landing & galeri | #68 | **Done** |
| KP-06 | Portal warga: rincian tagihan & pembayaran | #69 | **Done** |
| SR-02b | Alur surat RW (verifikasi, nomor, cetak) | #70 | **Done** |
| KP-07 | Row-level scoping pengurus_rt | #73 | **Done** |
| T0-01 | Keputusan bisnis iterasi 2 (D1–D5) | #71 | **Done** (asumsi kerja diterapkan; revisi = kartu baru) |
| T0-02 | Import data keuangan lama | #72 | **Done** (spesifikasi CSV + saldo awal ditetapkan) |
| FND-08 | RBAC dinamis + peran ketua_rw/sekretaris + halaman Peran & Izin | #91 | **Done** |
| FND-09 | Notifikasi in-app + reset password email + klaim akun warga | #92 | **Done** |
| KP-08 | Refactor KK-first (`/warga` → `/kk`, tabel terkelompok) | #93 | **Done** |
| KU-05 | Iuran 2 tingkat RT/RW + tagihan otomatis + Midtrans | #94 | **Done** |

---

## Jejak Lama — Kartu Hasil Audit Commit

Kartu untuk pekerjaan yang **sudah ada di riwayat commit** tetapi belum pernah tercatat di papan.
Sebagian sudah digantikan refactor; tetap dicatat sebagai `Done` supaya jejaknya tidak hilang.

| Kode | Kartu | SF | MoSCoW | Issue | Status | Bukti |
|---|---|---|---|---|---|---|
| FND-10 | Bootstrap DB lokal 1-perintah + Docker Compose | — | should | #95 | **Done** | `scripts/db-setup.mts`, `scripts/db-auth.mts`, `compose.yaml` — commit `7873e36`, `4f4f09e`, `7375226` |
| FND-11 | Optimasi loading: import ikon per-file + ikon PWA | — | should | #96 | **Done** | commit `3028591` — `src/lib/nav.ts`, `src/lib/components/*`, `src/app.html` |
| KU-06 | Halaman paket iuran config-driven | — | should | #97 | **Done**, UI dihapus | commit `4ee3b69` (tambah) → `d18065c` (hapus `iuran/paket/*`); skema config-driven tetap dipakai KU-05 |
| SR-06 | Generator PDF surat resmi (unduh/cetak) | `SF-SR-05` | must | #98 | **Done** | `src/lib/pdf-surat.ts`, `src/routes/(app)/surat/[id]/cetak/` — commit `c3fb151` |
| EV-04 | Pengumuman berkala + galeri foto | `SF-PG-01` | should | #99 | **Done** | `schema.ts` (`periodeUlang`, `intervalHari`, `thumbnailUrl`, `lampiranUrls`), `pengumuman/tambah/` — commit `d5731c8` |

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
