# BAB IV — HASIL PERANCANGAN · §4.1 Proses Perancangan

> **Status: DRAFT siap port** (untuk dipindahkan ke `docs/laporan/laporan.md` lalu ke
> `Capstone_Kelompok_30.docx`). PIC: **Afif**. Struktur mengikuti **§3.5.1** (6 tahap Kanban) sesuai
> panduan Capstone. Gambar di-*generate* via prompt di `diagram-prompts.md`.
>
> Menggantikan versi lama di `laporanRevisi.md` (angkanya masih 12 Okt: `Done 21`.
> Versi ini memakai data **19 Okt: Done 29 kartu**).
> Tanda `[[ISI: ...]]` = menunggu data/screenshot dari PIC modul. Disusun: 19 Okt 2026.

---

## 4.1 Proses Perancangan

Pelaksanaan perancangan Sistem Informasi RW mengikuti enam tahap sistematika Kanban yang telah
dijelaskan pada §3.5.1. Papan kerja berada pada **GitHub Projects “Capstone - Gr30”** yang terhubung
langsung dengan repositori sumber `miralami/rwdigital`. Bagian ini menguraikan pelaksanaan tiap tahap
beserta buktinya.

### 4.1.1 Pembentukan Product Backlog (Tahap Analisis)

Product backlog disusun dari tiga sumber: **(1)** spesifikasi fungsional laporan (`SF-KP`, `SF-SR`,
`SF-KS`, `SF-IU`, `SF-PG`), **(2)** kebutuhan tambahan mitra yang belum memiliki kode SF (Landing Page
dan Kas RT), serta **(3)** temuan teknis saat penelusuran kode. Setiap kebutuhan diuraikan menjadi satu
kartu kerja (GitHub Issue) yang wajib memuat *acceptance criteria*, lalu dikelompokkan ke dalam **Epic**
dan diberi label prioritas **MoSCoW**.

Pekerjaan diorganisasi menjadi **enam Epic** dengan seorang penanggung jawab (PIC) per Epic, sebagaimana
pada Tabel 4.1.

**Tabel 4.1 Peta Epic, PIC, dan Sebaran Kartu (per 19 Oktober 2026)**

| Epic | Lintas Kerja | PIC | Done | In Progress | Backlog | Won't |
|---|---|---|---|---|---|---|
| `EPIC-0` | Fondasi & Infrastruktur | Afif | 6 | 0 | 0 | 0 |
| `EPIC-1` | Publik, Landing Page & Profil RW | Afif | 2 | 0 | 0 | 0 |
| `EPIC-2` | Informasi, Event & Humas | Alizha | 2 | 0 | 3 | 1 |
| `EPIC-3` | Kependudukan & Dashboard Internal | Josua | 9 | 0 | 0 | 0 |
| `EPIC-4` | Keuangan & Kas RT | Safira | 5 | 2 | 1 | 1 |
| `EPIC-5` | Surat-Menyurat | Zidan | 5 | 1 | 2 | 0 |
| — | Grey-out lintas Epic | — | — | — | — | 4 |
| **Total** | | | **29** | **3** | **6** | **6** |

> Total **38 kartu fungsional + 6 grey-out = 44 kartu**, ditambah 6 Epic menjadi **50 item papan**.
> PIC menandai pemilik Epic; seluruh kartu `Done` hasil rekonstruksi *as-is* diatribusikan kepada Afif
> karena merupakan penulis kode eksisting (lihat §4.1.7).

**Tabel 4.2 Distribusi Kartu Berdasarkan Prioritas MoSCoW**

| Prioritas | Jumlah Kartu | Contoh |
|---|---|---|
| Must Have | 30 | CRUD warga, kas RW, surat, pemisahan kas RT |
| Should Have | 8 | Ekspor CSV, portal warga, lampiran notulen event |
| Could Have | 0 | — |
| Won't Have | 6 | CCTV, inventaris fisik, absensi event, CMS dinamis |
| **Total** | **44** | 38 kartu fungsional + 6 grey-out |

> Kandidat “Integrasi QRIS produksi” yang semula dicontohkan sebagai *Could Have* digolongkan
> **Won't Have** (grey-out `W-03`) karena masih sebatas konsep/*mock*, sehingga *Could Have* berisi 0
> kartu. Temuan ini dicatat pada `docs/kanban/temuan-inkonsistensi.md`.

**Gambar 4.1** *(opsional)* Peta Epic → kartu — prompt: Activity/flowchart di `diagram-prompts.md` §1.

### 4.1.2 Perancangan Konseptual & Arsitektur (Tahap Desain)

Tahap desain memindahkan kartu ke kolom **Todo / Ready** setelah memenuhi *Definition of Ready* (DoR).
Artefak desain yang dihasilkan:

**Tabel 4.3 Artefak Tahap Desain dan Padanannya di Sistem**

| Artefak | Wujud dalam Sistem | Keterangan |
|---|---|---|
| Model data (ERD) | `src/lib/server/db/schema.ts` — **13 tabel**: `rw`, `rt`, `kk`, `warga`, `riwayat_warga`, `permintaan_pembaruan`, `pengumuman`, `jenis_iuran`, `tagihan`, `pembayaran`, `kategori_kas`, `transaksi_kas`, `surat` | Pemodelan relasional + Drizzle ORM |
| Diagram UML | Use case + activity per modul | Lihat `diagram-prompts.md` |
| Arsitektur perangkat lunak | SvelteKit (SSR + *form actions*) · Drizzle ORM · SQLite/Turso (libSQL) · Better Auth · Zod | Monolit modular |
| Matriks RBAC | 4 peran: `admin_rw`, `pengurus_rt`, `bendahara`, `warga` | Diwujudkan di `permissions.ts` + `route guard` |
| Antarmuka (UI/UX) | Landing page publik + dashboard internal + portal warga | Pratinjau desain di `docs/design-preview/` |

**Gambar 4.2 ERD SI-RW** — *generate* dengan prompt ERD di `diagram-prompts.md` §2.
**Gambar 4.3 Arsitektur Sistem** — *generate* dengan prompt deployment di `diagram-prompts.md` §6.

Prinsip desain keamanan yang ditetapkan pada tahap ini: **fail-closed** (akses tanpa peran yang sesuai
ditolak secara *default*), masking NIK/No. KK pada tampilan daftar, serta *audit trail* untuk perubahan
data warga dan transaksi kas.

### 4.1.3 Pengembangan Fitur Inkremental (*Continuous Flow Development*)

Kartu dikerjakan pada kolom **In Progress** dengan pembatasan **WIP 1–2 kartu per orang** (maksimum 10
kartu pada papan). Kode dikembangkan pada **cabang fitur modular**, mis. `feat/<kode>-<slug>`, kemudian
diajukan melalui Pull Request.

Pada **kondisi awal papan** ditemukan **pelanggaran batas WIP**: seorang anggota memegang tiga kartu
`In Progress` sekaligus. Melalui peninjauan aliran mingguan, kartu yang belum benar-benar berjalan
dikembalikan ke `Todo / Ready` sehingga jumlah WIP papan **turun dari 8 menjadi 3 kartu**. Kejadian ini
dicatat sebagai bukti bahwa prinsip *limit WIP* benar-benar dijalankan, bukan hanya formalitas.

Bukti pengembangan inti (riwayat commit pada `main`):

- `5dbdfe9` — implementasi modul inti (warga, kas, iuran, pengumuman, autentikasi) + skema + dokumentasi;
- `71ecc6a` — portal warga, *route guard* berbasis peran, komponen UI bersama;
- `4f4f09e` — perbaikan *bootstrap* basis data lokal (dua sistem migrasi bertabrakan);
- `1234ab0`, `9cacc5e` — landing page publik + visualisasi statistik publik;
- `67c88ba` — perbaikan `_journal.json` migrasi Drizzle;
- `7e34167` — penambahan `CODEOWNERS` (wajib peninjauan *maintainer*).

**Tabel 4.4 Status Pengembangan per Epic**

| Epic | Modul | Kartu tuntas | Sisa |
|---|---|---|---|
| `EPIC-0` | Fondasi & Infrastruktur | 6/6 | — |
| `EPIC-1` | Publik & Landing Page | 2/2 | — |
| `EPIC-2` | Informasi, Event & Humas | 2/6 | 3 backlog + 1 grey-out |
| `EPIC-3` | Kependudukan & Dashboard | 9/9 | — |
| `EPIC-4` | Keuangan & Kas RT | 5/9 | 2 in progress + 1 backlog + 1 grey-out |
| `EPIC-5` | Surat-Menyurat | 5/8 | 1 in progress + 2 backlog |

### 4.1.4 Peninjauan Kode & Verifikasi (*Review & Testing*)

Pembuatan Pull Request memindahkan kartu ke kolom **Review / Verification** untuk menjalani *code review*
dan pengujian fungsional *Black Box*. Kebijakan peninjauan memberlakukan **wajib satu peninjau**
(*CODEOWNERS*), dengan Afif sebagai peninjau utama.

Temuan penting pada tahap ini: kolom **Review / Verification ternyata belum pernah terisi** pada papan
(F5). Hal ini menjadi dasar perbaikan disiplin Pull Request agar setiap kartu yang selesai dikodekan
benar-benar melewati peninjauan sebelum `Done`.

Verifikasi dilakukan pada empat aras (selaras §3.5.3.1):
1. **Fungsional** — keluaran tiap fungsi diuji terhadap spesifikasi, termasuk kondisi batas;
2. **Validasi masukan** — NIK 16 digit, field wajib, pencegahan duplikasi, pesan galat Bahasa Indonesia;
3. **Kontrol akses** — setiap rute dan *server action* diuji untuk peran berwenang/tidak berwenang/tanpa sesi;
4. **Keamanan aplikasi** — merujuk OWASP Top 10 (injeksi, atribut cookie, *rate limiting*).

**Gambar 4.4** *(opsional)* Sekuens Verifikasi & Persetujuan Surat — prompt di `diagram-prompts.md` §5.

### 4.1.5 Penggabungan Fitur (*Merge & Done*)

Kartu yang lulus verifikasi dan disetujui digabungkan ke cabang `main` dan dipindahkan ke **Done**
setelah memenuhi *Definition of Done*. Pada periode 17–18 Oktober 2026, beberapa Pull Request dari PIC
modul (**#59, #60, #61**) ditinjau dan digabungkan ke `main`, termasuk perbaikan modul Kependudukan.

**Tabel 4.5 Contoh Kartu `Done` Beserta Bukti (pemenuhan DoD)**

| Kartu | Issue | Bukti (PR/commit) |
|---|---|---|
| `LP-01` Landing Page Publik | #20 | `1234ab0` |
| `LP-02` Visualisasi Statistik Publik | #19 | `9cacc5e` |
| `FND-06` Papan Kanban + Backlog | #21 | `17da42b`, `3b21a44` |
| `EV-01` Pengumuman *time-based* | #22 | PR #60 (`7093798`) |
| `KP-01` Rekap Demografis | #33 | PR #61 (`8009f72`) |
| `KP-02` Impor Massal CSV | #31 | PR #61 |
| `KP-03` Dashboard Pengurus | #32 | PR #61 |
| `KP-04` Portal Warga | #34 | PR #61 |
| `KP-05` Pengajuan Pembaruan Data | #35 | PR #61 |

> Daftar lengkap 38 kartu + bukti ada di `docs/kanban/backlog.md`.

### 4.1.6 Validasi Akhir & Evaluasi (Tahap UAT)

Tahap validasi berupa pengujian purwarupa fungsional bersama pemangku kepentingan mitra (**RW 06,
Kelurahan Kota Baru, Kecamatan Bekasi Barat**) dan evaluasi kemudahan penggunaan dengan instrumen
**System Usability Scale (SUS)**. Rencananya dilaksanakan pada **Minggu 14–15** (lihat Tabel 12 §3.5.4).

`[[ISI: tanggal pelaksanaan UAT, daftar responden per peran, hasil skor SUS]]`

> Hasil lengkap validasi disajikan pada **Bab VI §6.1** (PIC: Zidan). Bagian ini hanya mencatat bahwa
> tahap UAT **belum dilaksanakan** pada saat penulisan (bukan klaim hasil).

### 4.1.7 Catatan Metodologis: Rekonstruksi *As-Is* (*Back-fill*)

Papan Kanban baru dibangun **setelah** sebagian pekerjaan berjalan, sehingga status kartu direkonstruksi
secara transparan dengan langkah: **(1)** verifikasi keberadaan setiap kandidat kartu melalui penelusuran
kode (rute, tabel skema, *server action*, riwayat commit); **(2)** klasifikasi menjadi `Done`,
`In Progress`, atau `Backlog`; **(3)** pencatatan kartu `Done` beserta bukti kode.

Contoh: modul surat-menyurat dinyatakan `Done` untuk `SF-SR-01`–`SF-SR-07` karena tersedia berkas
`portal/surat/ajukan/`, `(app)/surat/[id]/`, `(app)/surat/[id]/cetak/`, dan tabel `surat`; sedangkan
Kas RT (`SF-KS-07`) berstatus `Backlog` karena belum ada tabel maupun rute terkait.

**Batas kejujuran:** tanggal pengerjaan kartu hasil rekonstruksi **tidak dikarang**; bila tidak tercatat,
ditulis `n/a`.

### 4.1.8 Metrik Aliran dan Evaluasi Berkesinambungan

Metrik aliran dicatat sebagai dasar perbaikan berkesinambungan.

**Tabel 4.6 Metrik Aliran Awal**

| Metrik | Nilai | Catatan |
|---|---|---|
| Throughput kumulatif | 29 kartu `Done` | termasuk 24 kartu rekonstruksi *as-is* |
| WIP saat ini | 3 kartu (batas 10) | KU-02, KU-03, SR-01 |
| Pelanggaran WIP awal | 1 orang memegang 3 kartu | direkonsiliasi → WIP turun 8 → 3 |
| Kolom `Review / Verification` | belum pernah terisi (F5) | diperbaiki lewat disiplin PR |
| *Cycle time* | `n/a` untuk kartu rekonstruksi | tidak ada stempel waktu asli (lihat §4.1.7) |

> Keterbatasan: *cycle time* hanya dapat diukur andal untuk kartu yang dibuat **setelah** papan berdiri.

---

## 4.2 Hasil Rancangan — *Kerangka & Template*

> Diisi **per modul** oleh PIC modul (lihat `pembagian-tugas.md`), lalu dirapikan Afif.
> Panduan: **screenshot tiap halaman + 1 paragraf fungsi**.

### Template per modul

```
#### 4.2.x Modul <Nama> (PIC: <nama>)
Tabel 4.x Daftar Halaman Modul <Nama>
| No | Halaman | Fungsi |
|---|---|---|
| 1 | <judul halaman> | <kegunaan bagi pengguna> |

Gambar 4.x Halaman <nama halaman>
<1 paragraf penjelasan fungsi halaman & perannya dalam alur kerja>
```

### Daftar modul & halaman (untuk diisi)

| Modul | PIC | Halaman yang perlu di-capture |
|---|---|---|
| Publik / Landing | Afif | Landing (profil, SOTK, galeri), statistik publik |
| Kependudukan | Josua | Daftar warga, form tambah/ubah, profil + riwayat, impor CSV, rekap demografis |
| Surat-Menyurat | Zidan | Ajukan surat, unggah syarat, riwayat/status, verifikasi (RT/RW), cetak/unduh PDF |
| Keuangan & Kas | Safira | Daftar transaksi, catat pemasukan/pengeluaran, unggah bukti, saldo dashboard, laporan periode, kas RT |
| Iuran | Safira | Kelola jenis iuran, buat tagihan, catat pembayaran, status iuran warga, rekap |
| Informasi & Event | Alizha | Buat/ubah pengumuman, daftar pengumuman, saring & cari |
| Auth & RBAC | Afif | Halaman masuk, contoh 403/deny |

---

## 4.3 Verifikasi Hasil Rancangan — *Kerangka & Template*

> Panduan meminta: pengujian **Black Box per modul** + tautan *test case*. Diisi PIC modul.

### Template tabel per modul

```
Tabel 4.x Verifikasi Modul <Nama>
| No | Skenario Uji | Peran | Input | Hasil Diharapkan | Hasil Aktual | Status | Tautan Test Case |
|---|---|---|---|---|---|---|---|
| 1 | <skenario> | <peran> | <data uji> | <ekspektasi> | <aktual> | Lulus/Tidak | <link> |
```

### Rekap lintas modul

| Modul | Skenario uji | Lulus | Tidak lulus | Tautan rekap |
|---|---|---|---|---|
| Auth & RBAC | 0 | 0 | 0 | — |
| Publik / Landing | 0 | 0 | 0 | — |
| Kependudukan | 0 | 0 | 0 | — |
| Surat-Menyurat | 0 | 0 | 0 | — |
| Keuangan & Kas | 0 | 0 | 0 | — |
| Iuran | 0 | 0 | 0 | — |
| Informasi & Event | 0 | 0 | 0 | — |

> **Catatan (verifikasi ≠ validasi):** Bab ini menguji **kesesuaian dengan spesifikasi** (internal).
> Umpan balik mitra & skor SUS masuk **Bab VI §6.1**.

---

## Bahan yang Perlu Dilengkapi (checklist)

- [ ] `[[ISI]]` tanggal & responden UAT + skor SUS (§4.1.6) — PIC Zidan
- [ ] Screenshot per halaman (§4.2) — PIC modul masing-masing
- [ ] Tabel hasil Black Box per modul (§4.3) — PIC modul
- [ ] Flowchart §3.5.1 → `Gambar 3.1` (prompt tersedia)
- [ ] ERD + arsitektur → `Gambar 4.2`, `Gambar 4.3` (prompt tersedia)
- [ ] Verifikasi angka Tabel 4.1 & 4.2 terhadap `docs/kanban/backlog.md` sebelum final
