# Laporan Revisi — Bagian yang Diperbarui

> **Cara pakai:** file ini adalah *holding area* revisi. Setiap potongan diberi penanda:
> - `[GANTI]` → ganti bagian `laporan.md` yang lama dengan versi di sini.
> - `[SISIP]` → tambahkan sebagai paragraf/tabel baru di bagian yang disebut.
> - `[BARU]` → bagian yang sebelumnya masih kosong (Bab IV) dan sekarang diisi.
>
> Nomor halaman/baris mengacu ke `docs/laporan/laporan.md` pada 12 Okt 2026.
> Otoritas tetap `laporan.md`; file ini hanya usulan perubahan yang belum dimasukkan.
>
> ⚠️ **Per 19 Okt 2026 angkanya sudah usang** (mis. Bab IV memakai `Done 21`; kini `Done 29`).
> Versi **Bab IV §4.1 terbaru** ada di `bab4-proses-perancangan.md`. Navigasi: `README.md`.

---

## Ringkasan Perubahan

| Bagian laporan | Jenis | Ringkas |
|---|---|---|
| §2.2.3.1 Metode Kanban & GitHub Projects | `[GANTI]` | Kolom 5 + kriteria transisi eksplisit + WIP limit tegas |
| §3.1 Batasan Realistis | `[GANTI]` | Perbaiki kontradiksi: hapus "surat-menyurat" dari daftar di luar scope |
| §3.3.4 Spesifikasi Fungsional | `[SISIP]` | Tambah kode SF untuk Landing Page (`SF-LP`) & Kas RT (`SF-KS-07/08`) |
| §3.5.1 Sistematika Perancangan | `[GANTI]` | Alur 6 langkah + *entry/exit criteria* + DoR/DoD |
| §3.5.4 Tabel 12 Jadwal | `[GANTI]` | Disesuaikan dengan realita (setup papan & rekonstruksi as-is) |
| **Bab IV §4.1 Proses Perancangan** | `[BARU]` | **Diisi penuh** dengan bukti pelaksanaan Kanban |
| Bab IV §4.2 & §4.3 | `[BARU]` | Kerangka isi (menyusul saat fitur tuntas) |

---

## §2.2.3.1 Metode Kanban dan GitHub Projects `[GANTI]`

> Ganti paragraf setelah kalimat pembuka Anderson (2010). Isi baru:

Penerapan metode Kanban pada proyek ini diwujudkan melalui platform **GitHub Projects** yang
terintegrasi langsung dengan repositori kode sumber (`miralami/rwdigital`). Aliran kerja dibagi ke
dalam lima kolom visual berikut:

1. **Backlog** — seluruh kebutuhan fungsional dan teknis hasil elisitasi, direpresentasikan sebagai
   GitHub Issues dan diklasifikasikan dengan metode MoSCoW.
2. **Todo / Ready** — tugas yang telah memenuhi *Definition of Ready* (spesifikasi jelas, acceptance
   criteria, PIC, dan dependensi beres) sehingga siap dikerjakan.
3. **In Progress** — tugas yang sedang aktif dikembangkan, dengan pembatasan ketat *Work in Progress*
   sebesar **1–2 kartu per orang** dan maksimum 10 kartu pada papan.
4. **Review / Verification** — modul yang telah selesai dikodekan dan sedang menjalani peninjauan
   kode (*pull request review*) serta pengujian fungsional.
5. **Done** — fitur yang telah lulus verifikasi, disetujui, dan berhasil digabungkan (*merged*) ke
   cabang utama `main`.

Transisi antar kolom tidak dilakukan bebas, melainkan mengikuti kriteria masuk/keluar yang ditetapkan
(lihat §3.5.1). Integrasi GitHub Projects memungkinkan pembaruan status tugas secara otomatis ketika
Pull Request dibuat atau digabungkan, sehingga transparansi dan pelacakan progres tim terjaga secara
*waktu nyata*.

Perlu dicatat bahwa pekerjaan tim diorganisasi menjadi lima **Epic** (satu per lintas kerja/*track*),
sedangkan kartu Kanban adalah **item pekerjaan** di dalam Epic. Batas WIP diberlakukan pada kartu,
bukan pada Epic.

---

## §3.1 Batasan Realistis — koreksi scope `[GANTI]`

> Ganti kalimat/paragraf yang menyatakan surat-menyurat di luar scope. Versi baru:

Hanya fitur Core MVP yang dikerjakan dalam proyek ini, yaitu **manajemen data kependudukan, kas RW
dan kas RT, iuran warga, pengumuman/informasi, surat-menyurat, serta landing page dan dashboard
statistik**. Fitur-fitur di luar scope — termasuk manajemen CCTV, inventaris fisik, manajemen
pengurus yang kompleks, CMS dinamis landing page, absensi/check-in event, dan integrasi payment
gateway produksi — tidak termasuk dalam cakupan pengerjaan.

> **Alasan koreksi:** §3.3.4 memuat `SF-SR-01`–`SF-SR-07` (surat-menyurat) secara lengkap, dan modul
> ini telah memiliki lintas kerja tersendiri (Track 5). Menyebutnya "di luar scope" menimbulkan
> kontradiksi internal pada laporan.

---

## §3.3.4 Spesifikasi Fungsional — penambahan kode SF `[SISIP]`

> Sisipkan baris berikut pada tabel spesifikasi fungsional, dan tambahkan pada tabel yang sesuai.

### Modul Publik & Landing Page (baru — `SF-LP`)

| Kode | Fitur | Deskripsi | Aktor |
|---|---|---|---|
| `SF-LP-01` | Landing Page Publik | Halaman publik (tanpa login) berisi profil RW (visi, misi, sejarah), struktur organisasi dan tata kerja (SOTK/bagan pengurus), serta prestasi lingkungan dan galeri. | Publik |
| `SF-LP-02` | Visualisasi Statistik Publik | Menampilkan grafik distribusi penduduk per RT, komposisi usia (produktif vs lansia/pensiun), dan indikator demografis ringkas (kelahiran baru, total warga, rasio produktif). | Publik |

### Modul Keuangan — Kas RT (tambahan pada `SF-KS`)

| Kode | Fitur | Deskripsi | Aktor |
|---|---|---|---|
| `SF-KS-07` | Pemisahan Kas RT | Pengelolaan kas mandiri per RT (misalnya kas sosial/kematian) terpisah dari kas RW, dengan skema pencatatan tersendiri per RT. | `bendahara`, `pengurus_rt` |
| `SF-KS-08` | Rekapitulasi Kas per RT | Menghasilkan rekapitulasi mutasi dan saldo kas per RT untuk periode terpilih, dapat diekspor ke CSV. | `bendahara`, `admin_rw` |

### Penegasan `SF-IU-02` (model iuran) `[SISIP]`

> Tambahkan catatan: fokus `SF-IU-02` adalah **rekapitulasi penerimaan iuran wajib RT** (menyesuaikan
> praktik mitra), bukan penagihan berbasis tagihan individual; `SF-IU-06` menjadi keluaran rekapnya.

---

## §3.5.1 Sistematika Perancangan `[GANTI]`

> Ganti isi §3.5.1 dengan versi berikut (memperjelas kriteria, bukan mengubah pendekatan).

Sistematika perancangan Sistem Informasi RW dilaksanakan menggunakan pendekatan Kanban yang
terintegrasi dengan GitHub Projects. Alur tahapan kerja dirancang sebagai aliran berkesinambungan
(*continuous flow*) sebagai berikut:

1. **Pembentukan Product Backlog (Tahap Analisis).** Kebutuhan sistem diuraikan menjadi kartu tugas
   (GitHub Issues), diklasifikasikan dengan metode MoSCoW, dan dikelompokkan ke dalam Epic per
   lintas kerja. Setiap kartu wajib memuat *acceptance criteria*.
2. **Perancangan Konseptual & Arsitektur (Tahap Desain).** Tugas perancangan ERD, diagram UML, UI/UX,
   dan RBAC dipindahkan ke kolom **Todo / Ready** setelah memenuhi *Definition of Ready*.
3. **Pengembangan Fitur Inkremental (*Continuous Flow Development*).** Tugas dikerjakan pada kolom
   **In Progress** dengan batas WIP 1–2 kartu per orang; kode dikembangkan pada cabang fitur modular.
4. **Peninjauan Kode & Verifikasi.** Pembuatan Pull Request memindahkan kartu ke kolom
   **Review / Verification** untuk peninjauan kode dan pengujian fungsional *Black Box*.
5. **Penggabungan Fitur (*Merge & Done*).** Tiket yang lulus pengujian dan disetujui digabungkan ke
   `main` dan dipindahkan ke **Done**.
6. **Validasi Akhir & Evaluasi (Tahap UAT).** Purwarupa fungsional diuji bersama pemangku kepentingan
   mitra dan dievaluasi menggunakan instrumen SUS.

### Kriteria Transisi Antar Kolom

| Kolom | Kriteria Masuk | Kriteria Keluar |
|---|---|---|
| Backlog | Terdaftar sebagai Issue + berlabel `moscow:*` | Memenuhi Definition of Ready |
| Todo / Ready | DoR terpenuhi, ada PIC, dependensi beres | Pengerjaan dimulai (cabang dibuat) |
| In Progress | Cabang fitur dibuat; WIP di bawah batas | Kode selesai dan pengujian mandiri lulus |
| Review / Verification | Pull Request dibuka dan tertaut pada kartu | *Code review* disetujui & uji fungsional lulus |
| Done | PR *merged* ke `main` dan Definition of Done terpenuhi | — |

### Definition of Ready (DoR)
Kartu siap dikerjakan bila memiliki: judul + kode kartu, Epic, label MoSCoW, *acceptance criteria* yang
terukur, PIC, dependensi teridentifikasi, dan kode SF (bila ada padanannya di laporan).

### Definition of Done (DoD)
Kartu dinyatakan selesai bila: *acceptance criteria* terpenuhi; pengujian fungsional, validasi
masukan, dan kontrol akses lulus; kode di-*merge* ke `main` melalui Pull Request yang ditinjau;
serta kartu menautkan Issue, PR, dan bukti.

---

## §3.5.4 Jadwal Pelaksanaan Perancangan `[GANTI]`

> Tabel 12 tetap dipertahankan sebagai *rencana*, tetapi ditambahi catatan realita berikut.

**Catatan pelaksanaan:** pembangunan papan Kanban dan pengisian backlog dilakukan **secara
rekonstruktif** (as-is) karena sebagian modul telah berkembang sebelum papan berdiri. Kartu yang
sudah tuntas dicatat sebagai `Done` melalui mekanisme *back-fill* dengan mencantumkan bukti kode
(commit/PR/berkas), dan **tanggal pengerjaan tidak direkayasa**. Hal ini dijelaskan pada Bab IV §4.1
agar tidak menimbulkan klaim kronologis yang tidak akurat.

---

## BAB IV — HASIL PERANCANGAN `[BARU]`

### 4.1 Proses Perancangan

#### 4.1.1 Organisasi Pekerjaan (Epic dan Kartu)

Pekerjaan perancangan diorganisasi menjadi enam Epic (EPIC-0 fondasi lintas modul + EPIC-1..5 untuk
lima modul) dengan seorang penanggung jawab (PIC) per Epic, sebagaimana disajikan pada Tabel 14.

**Tabel 14 Peta Epic, PIC, dan Jumlah Kartu**

| Epic | Lintas Kerja | PIC | Done | In Progress | Backlog |
|---|---|---|---|---|---|
| `EPIC-0` | Fondasi & Infrastruktur | Afif | 5 | 1 | 0 |
| `EPIC-1` | Modul Publik, Landing Page & Profil RW | Afif | 0 | 0 | 2 |
| `EPIC-2` | Modul Informasi, Event & Humas | Alizha | 1 | 1 | 3 |
| `EPIC-3` | Modul Kependudukan & Dashboard Internal | Josua | 5 | 3 | 1 |
| `EPIC-4` | Modul Keuangan & Kas RT | Safira | 5 | 2 | 1 |
| `EPIC-5` | Modul Surat-Menyurat | Zidan | 5 | 1 | 2 |
| **Total** | | | **21** | **8** | **9** |

> PIC menandai pemilik Epic untuk pekerjaan yang belum selesai (*upcoming*). Seluruh kartu `Done`
> (rekonstruksi *as-is*) diatribusikan kepada Afif karena kode eksisting dikerjakan Afif.

Setiap Epic diturunkan menjadi kartu tugas berlabel MoSCoW. Rincian kartu beserta bukti kode
terdokumentasi pada lampiran backlog (lihat juga Lampiran A).

#### 4.1.2 Pembentukan dan Pengisian Backlog

Product backlog disusun dari tiga sumber: (1) spesifikasi fungsional laporan (`SF-KP`, `SF-SR`,
`SF-KS`, `SF-IU`, `SF-PG`), (2) kebutuhan tambahan mitra yang belum ber-kode SF (Landing Page dan
Kas RT), dan (3) temuan teknis saat penelusuran kode. Seluruh kartu diklasifikasikan dengan MoSCoW.

**Tabel 15 Distribusi Kartu Berdasarkan Prioritas MoSCoW**

| Prioritas | Jumlah Kartu | Contoh |
|---|---|---|
| Must Have | 30 | CRUD warga, kas RW, surat, pemisahan kas RT |
| Should Have | 8 | Ekspor CSV, portal warga, attachment notulen |
| Could Have | 0 | — |
| Won't Have | 6 | CCTV, inventaris, absensi event, CMS dinamis |
| **Total** | **44** | 38 kartu fungsional + 6 grey-out |

> Catatan: kandidat "Integrasi QRIS" yang semula dicontohkan sebagai *Could Have* kini digolongkan
> **Won't Have** (grey-out `W-03`) karena masih sebatas konsep/*mock*, sehingga *Could Have* berisi 0
> kartu. Temuan ini dicatat pada `docs/kanban/temuan-inkonsistensi.md`.

#### 4.1.3 Rekonstruksi As-Is (*Back-fill*)

Karena papan Kanban baru dibangun setelah sebagian pekerjaan berjalan, status kartu direkonstruksi
secara **transparan**. Langkah yang ditempuh:

1. Setiap kandidat kartu diverifikasi keberadaannya melalui pencarian kode (keberadaan route, tabel
   skema, aksi server, dan riwayat commit).
2. Kartu diklasifikasikan menjadi `Done` (kode ada dan berfungsi), `In Progress` (sebagian), atau
   `Backlog` (belum ada).
3. Kartu `Done` dibuat lalu langsung ditutup dengan catatan bukti; kartu `In Progress` dijadikan
   *baseline* WIP papan.

Sebagai contoh, modul surat-menyurat dinyatakan `Done` untuk `SF-SR-01`–`SF-SR-07` karena telah
memiliki berkas `portal/surat/ajukan/`, `(app)/surat/[id]/`, `(app)/surat/[id]/cetak/`, dan tabel
`surat`; sedangkan Kas RT (`SF-KS-07`) berstatus `Backlog` karena tidak ditemukan tabel maupun rute
terkait. **Batas kejujuran:** tanggal pengerjaan kartu hasil rekonstruksi tidak dikarang; bila tidak
tercatat, ditulis `n/a`.

#### 4.1.4 Pelaksanaan Aliran Kerja dan Penegakan WIP

Pada kondisi awal papan, ditemukan **pelanggaran batas WIP**: seorang anggota (PIC `EPIC-3`) memegang
tiga kartu `In Progress`, melampaui batas 1–2 kartu per orang. Melalui peninjauan aliran mingguan,
kartu yang belum benar-benar berjalan dikembalikan ke `Todo / Ready` sehingga jumlah WIP papan
turun dari 8 menjadi 6 kartu. Kejadian ini dicatat sebagai bukti bahwa prinsip *limit WIP* dijalankan
dan bukan hanya formalitas. Selain itu ditemukan bahwa kolom **Review / Verification** belum pernah
terisi, yang menjadi dasar perbaikan disiplin Pull Request.

#### 4.1.5 Temuan dan Penyelarasan

Penelusuran kode menghasilkan sejumlah temuan yang diselesaikan sebagai bagian dari proses
perancangan, antara lain: (1) kontradiksi scope surat-menyurat pada laporan yang diperbaiki;
(2) kebutuhan menambah kode SF untuk Landing Page dan Kas RT; (3) penyesuaian fokus modul iuran
menjadi rekapitulasi; serta (4) dua cacat teknis (penghapusan pengumuman permanen yang melanggar
spesifikasi arsip, dan aksi verifikasi surat yang belum memberlakukan pemeriksaan peran) yang
dicatat sebagai kartu `type:bug`. Seluruh temuan terdokumentasi pada lampiran temuan.

#### 4.1.6 Metrik Aliran

Metrik aliran dicatat sebagai dasar evaluasi perbaikan berkesinambungan: *throughput* (jumlah kartu
`Done` per minggu), *WIP* (jumlah kartu `In Progress` dibanding batas), *cycle time* (waktu
`Todo`→`Done`), dan jumlah kartu terblokir. Nilai awal dan catatan keterbatasan (khususnya *cycle
time* kartu hasil rekonstruksi) disajikan pada lampiran papan.

---

### 4.2 Hasil Perancangan `[BARU — kerangka]`

> Bagian ini diisi saat modul tuntas; kerangka:

- Rekap modul yang telah selesai beserta tangkapan layar antarmuka.
- Daftar kartu `Done` beserta tautan Pull Request (bukti pemenuhan DoD).
- Diagram alir data/ERD aktual dan matriks RBAC hasil implementasi.

### 4.3 Verifikasi Hasil Rancangan `[BARU — kerangka]`

- Hasil pengujian fungsional (*Black Box*) per kartu `Done`.
- Hasil pengujian validasi masukan dan kontrol akses.
- Rekap kartu yang lulus/tidak lulus verifikasi.

---

## Lampiran A — Peta Kartu ↔ MoSCoW ↔ SF

> Tabel panjang; cantumkan versi ringkas di laporan dan versi lengkap di lampiran. Sumber lengkap:
> `docs/kanban/backlog.md`.

| Kode Kartu | Judul | SF | MoSCoW | Status |
|---|---|---|---|---|
| `LP-01` | Landing Page Publik (Statis) | `SF-LP-01` | must | Backlog |
| `LP-02` | Visualisasi Statistik Publik | `SF-LP-02` | must | Backlog |
| `EV-01` | Pengumuman Time-Based (tanggal + lokasi + status otomatis) | `SF-PG-01` | must | In Progress |
| `EV-02` | Attachment Notulen pada Event | — | should | Backlog |
| `EV-03` | Saring & Cari Pengumuman | `SF-PG-04` | should | Backlog |
| `KP-01` | Perhitungan Demografis (Balita/Usia Sekolah/Produktif/Pensiun) | `SF-KP-07` | must | In Progress |
| `KP-02` | Impor Massal CSV + Validasi | `SF-KP-06` | must | Done |
| `KP-03` | Dashboard Pengurus Internal | `SF-KS-04`, `SF-KP-07` | must | In Progress |
| `KP-04` | Portal Warga (Profil Individu) | `SF-IU-05` | should | In Progress |
| `KU-01` | Pemisahan Kas RT | `SF-KS-07` | must | Backlog |
| `KU-02` | Rekapitulasi Iuran Wajib RT | `SF-IU-06` | must | In Progress |
| `KU-03` | Ekspor Laporan Keuangan (RW & RT) | `SF-KS-05`, `SF-KS-08` | should | In Progress |
| `KU-04` | Manajemen Kategori Transaksi | `SF-KS-02` | should | Done |
| `SR-01` | Katalog Template Surat A–G | `SF-SR-01` | must | In Progress |
| `SR-B`, `SR-C` | Manajemen, Verifikasi & Persetujuan Surat (alur RT→RW) | `SF-SR-04`, `SF-SR-05` | must | Done |
| `SR-03b` | Tanda Tangan Digital Pengurus | `SF-SR-05` | must | Backlog |
| `W-01`..`W-06` | Fitur dikecualikan (grey-out) | — | won't | Won't |

*(Daftar lengkap 38 kartu + 6 grey-out ada di `docs/kanban/backlog.md`.)*

---

## Lampiran B — Dokumen Pendukung yang Diselaraskan

| Dokumen | Perubahan |
|---|---|
| `docs/kanban/workflow.md` | Aturan operasional Kanban (kolom, WIP, DoR/DoD, MoSCoW, grey-out) |
| `docs/kanban/backlog.md` | Daftar 38 kartu + 6 grey-out + bukti kode |
| `docs/kanban/board.md` | Snapshot papan, audit WIP, metrik, kondisi papan terpasang + peta kartu ↔ issue |
| `docs/kanban/temuan-inkonsistensi.md` | Temuan F1–F7 dan arah penyelesaian |
| `PROJECT.md`, `plan.md`, `docs/checklist.md`, `docs/arsip/planAfif.md` | Diselaraskan dengan `laporan.md` |

---

## Langkah Selanjutnya (setelah revisi ini disetujui)

1. Pindahkan potongan `[GANTI]`/`[SISIP]`/`[BARU]` ke `laporan.md`.
2. Bangun GitHub Project + Issues sesuai `board.md` §5 (langkah GitHub).
3. Jalankan irama mingguan; isi metrik aliran di Bab IV.
