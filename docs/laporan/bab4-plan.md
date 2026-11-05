# Rencana BAB IV — HASIL PERANCANGAN (v3)

> **Sumber arah:** `Panduan Capstone Design Rev 1.3 2026.pdf` (hlm. 52–53) + `Contoh LAPORAN AKHIR
> CAPSTONE-1.pdf` (hlm. 37–104). Dasar isi: `laporan.md`, `Capstone.docx`, `docs/kanban/backlog.md`
> (3 Nov 2026), `diagram-prompts.md`, `pembagian-tugas.md`, `git log main`.
>
> v3 = v2 + **framing metodologi** (Iterative & Incremental + Kanban) dan penyesuaian 4.1.3 menjadi
> tiga iterasi nyata. v2 = semua artefak pemodelan masuk 4.1 (bukan 4.2), 4.2 murni screenshot,
> penomoran maksimal 3 tingkat dengan sub-butir a), b), c).

---

## 1. Apa yang Panduan & Contoh Perintahkan

**Panduan (hlm. 52–53)** — Bab IV hanya 3 subbab:
- `4.1 Proses perancangan` — tahapan yang dilakukan, **harus disesuaikan dengan tahap di §3.5.1**
- `4.2 Hasil rancangan` — dokumentasi hasil; untuk SI: **capture fitur + penjelasan kegunaan**
- `4.3 Verifikasi hasil rancangan` — pemeriksaan error + **kesesuaian dengan spesifikasi**

**Contoh laporan** (sistem surat-menyurat, Waterfall) — terbukti diterima, struktur aktualnya:

```
4.1 Proses Perancangan
    4.1.1 Analisis Kebutuhan        → tabel wawancara, kebutuhan
    4.1.2 Perancangan Sistem
          a) Use Case Diagram
          b) Use Case Description   → 1 tabel per use case
          c) Activity Diagram       → 1 gambar per alur
          d) Class Diagram
          a) ERD                    (penomoran contoh berantakan — jangan ditiru)
          a) Sequence Diagram
4.2 Hasil Rancangan
    • Halaman X  → 1 paragraf fungsi + Gambar 4.x (screenshot)
4.3 Verifikasi Hasil Rancangan
    4.3.1 Modul Autentikasi → Tabel (Website | Page + link test case | Teknik Testing) + paragraf
    4.3.2 Modul ... dst per modul
```

**Pelajaran kunci:**
1. Artefak UML/ERD **bukan** di 4.2 — semuanya di dalam 4.1.2, sebagai sub-butir huruf.
2. 4.2 = **screenshot** saja, formatnya `• Halaman → paragraf fungsi → Gambar`.
3. 4.3 = **per modul**, bukan per fitur, dengan tabel ringkas + tautan test case.
4. Penomoran TOC maksimal 3 tingkat → jangan bikin `4.1.2.1`. Pakai `a) b) c)`.

---

## 2. Framing Metodologi → `../keputusan.md`

Semua keputusan metodologi **tidak lagi ditulis di sini**. Rujuk:

- **K-01** judul · **K-02** istilah SI-RW / RW Digital
- **K-03** I&I + Kanban + MoSCoW (kalimat kunci untuk 4.1.3)
- **K-04** rekap 3 iterasi, pemicu iterasi, bukti rombakan Kas, framing adopsi Kanban
- **K-06** WIP limit · **K-07** pengujian CI + Black Box

Konsekuensi ke Bab III: flowchart §3.5.1 wajib punya **panah loop** dari tahap 6 kembali ke
Backlog berlabel "Iterasi berikutnya". Tanpa loop, klaim I&I tidak terlihat.

---

## 3. Struktur BAB IV Final (untuk proyek kita)

6 subbab = 6 tahap siklus iteratif; Kanban mengendalikan alurnya dan siklus diulang tiga iterasi.
Sub-butir huruf agar tetap 3 tingkat.

```
4.1 Proses Perancangan
    4.1.1 Analisis Kebutuhan                          (tahap 1 — Product Backlog)
          a) Gambaran Sistem dan Aktor
          b) Proses Bisnis Saat Ini (BPMN As-Is)
          c) Hasil Elisitasi Kebutuhan
          d) Kebutuhan Fungsional (FR)
          e) Kebutuhan Non-Fungsional (NFR)
          f) Prioritisasi MoSCoW dan Product Backlog
    4.1.2 Perancangan Sistem                          (tahap 2 — Desain)
          a) Proses Bisnis Usulan (BPMN To-Be)
          b) Arsitektur Enterprise (ArchiMate)
          c) Use Case Diagram
          d) Use Case Description
          e) Activity Diagram
          f) Class Diagram
          g) Entity Relationship Diagram dan Kamus Data
          h) Sequence Diagram
          i) Perancangan Antarmuka (UI/UX)
          j) Arsitektur Perangkat Lunak dan Kontrol Akses
    4.1.3 Pelaksanaan Pengembangan Inkremental         (tahap 3 — diulang 3 iterasi)
          a) Iterasi 1 — MVP
          b) Iterasi 2 — Penyempurnaan Keuangan dan Portal
          c) Iterasi 3 — RBAC, Notifikasi, dan KK-First
          d) WIP Limit, Feature Branch, dan Bukti Commit
    4.1.4 Peninjauan Kode dan Verifikasi               (tahap 4)
          a) Kebijakan Review dan CI
          b) Temuan dan Perbaikan Disiplin PR
    4.1.5 Penggabungan Fitur dan Metrik Aliran          (tahap 5)
          a) Definition of Done dan Bukti Kartu Done
          b) Metrik Aliran per Iterasi
    4.1.6 Validasi Akhir dan Catatan Metodologis        (tahap 6)
          a) Rencana UAT (rujuk Bab VI)
          b) Adopsi Kanban dan Rekonstruksi As-Is

4.2 Hasil Rancangan        → per halaman: paragraf fungsi + screenshot
4.3 Verifikasi Hasil Rancangan → per modul: tabel uji + paragraf hasil
```

Alasan 4.1.3–4.1.6 tetap ada: itu bukti mata kuliah **Manajemen Proyek & PL**. Contoh laporan
tidak punya karena Waterfall; kita Kanban, jadi papan + PR + DoD wajib terlihat.

---

## 4. Isi Tiap Subbab

### 4.1.1 Analisis Kebutuhan

| Butir | Isi | Artefak | Jml |
|---|---|---|---|
| a | Aktor (Publik, Warga, Pengurus RT, Bendahara, Admin RW) + batasan sistem | Tabel aktor & tanggung jawab | 1 |
| b | **BPMN as-is**: pendataan warga, iuran & kas, surat, pengumuman | Gambar BPMN (pool/lane per aktor) | 2–4 |
| c | Dasar kebutuhan: regulasi (UU 6/2014, Permendagri 18/2018, Perwali Bekasi 58/2020) + **checklist kebutuhan mitra RW 06** + umpan balik/revisi mitra pada tiap iterasi | Tabel kebutuhan vs dasar & sumber | 1 |
| d | **FR**: 34 fungsi `SF-KP/SR/KS/IU/PG/NT` | 6 tabel (satu per modul) | 6 |
| e | **NFR**: `NFR-SEC` (12), `NFR-ACC` (10), + `NFR-PERF`, `NFR-USA`, `NFR-COM`, `NFR-MNT` | 1 tabel gabungan (ID, kategori, target, prioritas) | 1 |
| f | MoSCoW 30 Must / 8 Should / 0 Could / 3 Won't + peta Epic | 2 tabel + screenshot board | 2 |

Format tabel FR (contoh, konsisten dengan §3.3.4 `laporan.md`):

| ID | Nama Fungsi | Deskripsi | Aktor | Prioritas |
|---|---|---|---|---|
| `SF-KP-01` | Tambah Data Warga | ... | admin_rw, pengurus_rt | Must |

Format tabel NFR:

| ID | Kategori | Deskripsi | Target/Ukuran | Prioritas |
|---|---|---|---|---|
| `NFR-PERF-01` | Performance | Pencarian 10.000 data | ≤ 3 detik | Must |

### 4.1.2 Perancangan Sistem

| Butir | Artefak | Jml | Sumber |
|---|---|---|---|
| a | **BPMN to-be** (tambah lane "Sistem SI-RW", gateway validasi & RBAC) | 2–4 | alur aplikasi; dibandingkan dengan b 4.1.1 |
| b | **ArchiMate**: (1) motivasi+bisnis, (2) aplikasi+teknologi | 2 | **baru** |
| c | Use case diagram: 1 global (4 aktor) + per modul | 1 + 5 | `diagram-prompts.md` §3 |
| d | Use case description: 6–8 UC kunci (nama, aktor, trigger, pre/post, normal course, sub-flow, alternate) | 6–8 tabel | **baru** |
| e | Activity diagram 7 alur kritis | 7 | `diagram-prompts.md` §4 |
| f | **Class diagram** 13 kelas domain + relasi + operasi | 1 | **baru**, dari `schema.ts` |
| g | **ERD** crow's foot + kamus data | 1 + 1 | prompt §2 + **baru** |
| h | **Sequence diagram**: surat, pembayaran+webhook Midtrans, input KK-first, guard RBAC | 4 | 1 prompt ada, 3 baru |
| i | **UI/UX**: design token, wireframe 3 alur, hi-fi 4–6 layar, tabel prinsip interaksi | 1 + 3 + 4–6 + 1 | `docs/design-preview/` |
| j | Arsitektur software (deployment) + tabel komponen + matriks RBAC final | 1 + 2 | prompt §6 |

Format use case description — **wajib persis seperti contoh** (dipakai dosen sebagai acuan):

```
Tabel 4.x  Mengajukan Surat
Use Case Name : Mengajukan Surat          ID : UC-03      Priority : High
Actor         : Warga
Description   : ...
Trigger       : ...
Preconditions : ...
Normal Course : 1. ... 2. ... 3. ...
Postconditions: ...
Sub Flows     : S-1 ...
Alternate/Exceptional Flows : A-1 ...
```

### 4.1.3–4.1.6 (siklus iteratif + Kanban)

| Subbab | Isi | Tabel |
|---|---|---|
| 4.1.3 | **Tiga iterasi** (lihat §2): a) Iterasi 1 MVP, b) Iterasi 2 keuangan & portal, c) Iterasi 3 RBAC/notifikasi/KK-first, d) WIP limit, feature branch, bukti commit | 3–4 |
| 4.1.4 | **CI** (`.github/workflows/ci.yml`: `check` → unit test → build → e2e), gate PR, temuan "kolom Review kosong" (F5), pernyataan jujur bahwa review manusia terbatas | 1 |
| 4.1.5 | DoD + contoh kartu Done & bukti PR/commit; throughput dan cycle time **per iterasi** | 2 |
| 4.1.6 | **UAT dengan pengurus RW 06** (23–24 Nov 2026), adopsi Kanban 12 Okt + back-fill, batas kejujuran | 1–2 |

**Angka wajib 3 Nov 2026:** 61 Done · 0 In Progress · 4 Todo · 3 Won't · 68 item papan.
Draft lama `arsip/bab4-proses-perancangan.md` masih memakai 29 Done (19 Okt) → **jangan dipakai mentah**.

**Framing 4.1.3d & WIP:** lihat `../keputusan.md` K-04 dan K-06.

**Strategi pengujian final (keputusan):** **CI + Black Box saja.** Tidak ada klaim peer review
manual, tidak ada klaim UAT yang belum terjadi, tidak ada klaim pengujian yang tidak punya bukti.

| Lapis | Alat | Bukti | Letak di laporan |
|---|---|---|---|
| Otomatis (regresi) | CI `.github/workflows/ci.yml`: `check` → `npm test` (100 unit) → `build` → e2e Playwright (8) | log/screenshot run CI (dilampirkan menyusul) | 4.1.4a + 4.3 pembuka |
| Manual (fungsional) | Black Box per modul: equivalence partitioning, boundary value, decision table | tabel kasus uji + screenshot | 4.3.1–4.3.8 |
| Validasi pengguna | UAT bersama pengurus RW 06 | berita acara + rekap | 4.1.6a, rinci di Bab VI |

> CI **sudah ada** di repo. Yang "ditambahkan nanti" adalah **bukti run-nya** (screenshot/log) untuk
> dilampirkan ke laporan — bukan pipeline-nya. Tulis apa adanya agar tidak jadi temuan.

### 4.2 Hasil Rancangan

Format persis contoh: `• Halaman X` → 1 paragraf fungsi → `Gambar 4.x`.

Urutan halaman (±25 screenshot):
1. Landing & statistik publik
2. Masuk / klaim akun / reset kata sandi
3. Beranda dashboard (KPI 5 modul)
4. Data KK (daftar, form, detail + anggota, impor CSV)
5. Rekap demografis
6. Pengajuan pembaruan data (warga) + verifikasi (pengurus)
7. Ajukan surat, unggah syarat, riwayat status
8. Verifikasi & persetujuan surat, cetak PDF bertanda tangan
9. Kas RW (daftar, form, void, laporan periode)
10. Kas RT
11. Jenis iuran & tagihan otomatis
12. Konfirmasi pembayaran + QRIS/Midtrans
13. Setoran RT → RW
14. Pengumuman (buat, daftar, galeri)
15. Pengaturan pengguna, peran/izin, TTD RT
16. Halaman 403 / redirect (bukti kontrol akses)

Modul EPIC-2 yang masih `Todo` (EV-02, EV-03, EV-BUG-01) → screenshot seadanya + catatan
"belum selesai" di 4.3.4. Jangan diklaim selesai.

### 4.3 Verifikasi Hasil Rancangan

Pembuka: strategi **dua lapis** — **CI otomatis** untuk regresi dan **Black Box manual** untuk
kesesuaian perilaku dengan spesifikasi. Teknik Black Box: equivalence partitioning, boundary value,
decision table. Sertakan lingkungan uji, data uji anonim, dan pembagian peran penguji.

Per modul (`4.3.1`–`4.3.8`), format mengikuti contoh tapi sedikit diperkaya:

| Website | SI-RW RW 06 |
|---|---|
| Page | Daftar warga (tautan: `e2e/smoke.spec.ts`) |
| Teknik Testing | Equivalence Partitioning + Boundary Value |
| Skenario | 8 kasus |
| Hasil | 7 lulus, 1 tidak lulus (defect D-02) |

Lalu paragraf hasil. Modul: Autentikasi & RBAC · Publik · Kependudukan · Surat · Keuangan/Kas ·
Iuran · Informasi · Pengaturan. Total ±60–80 kasus uji.

Tautan bukti otomatis yang sudah ada di repo: CI `.github/workflows/ci.yml` (check + unit + build +
e2e) dan `src/lib/server/{kas,iuran,pembayaran,rbac,guard,scope,setoran,surat-ttd,akses}.test.ts` +
`e2e/smoke.spec.ts`.

**Jangan tulis** "peer review" atau "ditinjau oleh rekan" di 4.3. Yang ada: CI, self-review terbatas,
dan Black Box. Kolom Review di papan kosong (temuan F5) → jujur saja di 4.1.4b.

---

## 5. Peta 6 Mata Kuliah → Bab IV

| Mata kuliah | Artefak | Letak | Porsi |
|---|---|---|---|
| Manajemen Proyek & PL | Kanban, Epic, MoSCoW, DoD, metrik, PR | 4.1.1f, 4.1.3–4.1.6 | Sedang |
| Pemodelan & Rekayasa Proses Bisnis | BPMN as-is & to-be | 4.1.1b, 4.1.2a | Sedang |
| Arsitektur Enterprise | ArchiMate 2 view | 4.1.2b | Kecil |
| APSI (UML) | Use case, activity, class, ERD, sequence | 4.1.2c–h | Besar |
| Perancangan Interaksi | Token, wireframe, hi-fi, prinsip interaksi | 4.1.2i | Sedang |
| Pengujian Implementasi | CI (unit + e2e) dan Black Box per modul | 4.1.4a, 4.3 | Besar |

---

## 6. Rekap Artefak

| Jenis | Minimum | Ideal |
|---|---|---|
| Gambar 4.x | ~35 | ~60 |
| Tabel 4.x | ~20 | ~28 |
| Halaman estimasi | ~35 hlm | ~55 hlm |

**Belum ada sama sekali (harus dibuat):** BPMN (0) · ArchiMate (0) · Class diagram (0) ·
Sequence (0 gambar) · Use case description (0) · Wireframe/hi-fi (0 terkurasi) ·
NFR non-keamanan (0) · Kamus data (0) · Tabel kasus uji (0) · Screenshot (0) ·
Teori BPMN/ArchiMate/IxD di Bab II (0) · FR di Word (0).

> **Bahan mentah untuk semua artefak di atas sudah digenerate:** `docs/laporan/handover-kit.md`
> (41 route + aktor + FR · 26 tabel + relasi · peta 34 FR → route · inventaris 100 unit + 8 e2e ·
> bukti commit/PR per Epic). PIC tinggal menulis narasi & menggambar diagram dari bahan itu.

---

## 7. Pembagian PIC per Artefak (bukan per fitur)

**Arah sudah disetujui:** pembagian **per artefak lintas proyek**, bukan per fitur/modul. Jadi
seseorang memegang satu jenis artefak untuk seluruh modul (mis. semua BPMN, semua FR), supaya tidak
ada modul yang tercecer. Nama di bawah adalah usulan beban; tinggal dikonfirmasi.

**Prinsip tanpa blocker:** setiap artefak mengambil bahan dari **sumber yang sudah ada** (aplikasi
yang berjalan, `schema.ts`, `laporan.md`, `handover-kit.md`, hasil wawancara narsum), bukan dari
artefak PIC lain. Konsistensi dijaga oleh satu **kerangka bersama** (§7.1) yang dibuat di hari
pertama, bukan oleh rantai urutan pengerjaan.

### 7.1 Kerangka Bersama (Afif, 6 Nov) ✅

Acuan wajib semua PIC. Sumber: `src/routes/`, `src/lib/akses.ts` (peran bawaan),
`handover-kit.md` §2 dan §4.

**Aturan utama:** nama aktor, nama modul, dan **nama use case disalin persis** dari subbab ini ke
semua artefak (FR, use case diagram dan description, activity, sequence, BPMN to-be, black box,
caption screenshot). Jangan diparafrasekan. Kalau butuh UC baru atau nama perlu diganti, ubah di
sini dulu, lalu kabari grup. Dengan begitu tiap PIC bisa jalan paralel sejak hari pertama.

#### 7.1.1 Aktor

Aktor diturunkan dari **peran yang benar-benar ada di aplikasi** (`src/lib/akses.ts`), karena
screenshot, black box, dan UAT dilakukan di aplikasi itu.

| Aktor (tulis persis) | Peran di kode | Akun uji | Tanggung jawab di sistem |
|---|---|---|---|
| **Publik** | — (tanpa login) | — | Melihat landing page: profil RW, pengurus, pengumuman, galeri |
| **Warga** | `warga` | `warga@rw.id` | Portal warga: tagihan dan pembayaran iuran, pengajuan surat, pembaruan data, notifikasi |
| **Pengurus RT** | `pengurus_rt` | `pengurus@rw.id` (RT 01) | Mengelola KK, warga, surat, iuran, dan kas untuk RT-nya sendiri; tanpa akses Pengaturan |
| **Pengurus RW** | `pengurus_rw` | `admin@rw.id` | Akses penuh ke seluruh modul, termasuk Kas RW, Pengaturan, peran dan izin |
| **Midtrans** *(aktor sekunder)* | — (sistem eksternal) | — | *Payment gateway* QRIS; mengirim notifikasi status bayar (*webhook*) |

Kata sandi akun uji ada di [`credentials.md`](../../credentials.md) (hanya untuk lokal).

**Yang tidak digambar sebagai aktor:**

- **Bendahara.** Di aplikasi tidak ada peran `bendahara`; pekerjaan bendahara (kas, iuran,
  konfirmasi bayar) dijalankan dengan akun **Pengurus RW**, atau peran kustom yang dibuat lewat
  *Pengaturan → Peran & Izin*. Di narasi boleh disebut "bendahara RW", tetapi di diagram, tabel FR,
  dan black box aktornya **Pengurus RW**.
- **Superadmin.** Peran ada di kode, tetapi akunnya belum dibuat. Tidak digambar.
- **`admin_rw`** (istilah lama di Bab III dan matriks RBAC `laporan.md` 4.1.2j) = **Pengurus RW**.
  Matriks itu akan disesuaikan oleh Afif (artefak 4.1.2j).

> Keputusan aktor ini tercatat sebagai **K-14** di [`../keputusan.md`](../keputusan.md).


#### 7.1.2 Modul

Delapan modul. Urutan dan nama ini dipakai juga untuk subbab 4.3.1–4.3.8 dan urutan screenshot 4.2.

| No | Modul (tulis persis) | Kode | FR | Rentang UC | Subbab 4.3 | PIC domain |
|---|---|---|---|---|---|---|
| 1 | Autentikasi dan Akun | `AUT` | `SF-NT-01..03` | UC-01 – UC-05 | 4.3.1 | Afif |
| 2 | Publik | `PUB` | `SF-PG-03` (landing) | UC-06 | 4.3.2 | Afif |
| 3 | Kependudukan | `KP` | `SF-KP-01..08` | UC-07 – UC-16 | 4.3.3 | Josua |
| 4 | Surat-Menyurat | `SR` | `SF-SR-01..07` | UC-17 – UC-23 | 4.3.4 | Zidan |
| 5 | Kas RW | `KS` | `SF-KS-01..06` | UC-24 – UC-30 | 4.3.5 | Safira |
| 6 | Iuran Warga | `IU` | `SF-IU-01..06` | UC-31 – UC-38 | 4.3.6 | Safira |
| 7 | Pengumuman | `PG` | `SF-PG-01..04` | UC-39 – UC-41 | 4.3.7 | Alizha |
| 8 | Pengaturan | `PGT` | — (`FND-08`, `W-02`, `W-06`, `SR-03b`) | UC-42 – UC-47 | 4.3.8 | Afif |


#### 7.1.3 Daftar Use Case

Nama memakai bentuk kata kerja **me-** (sesuai contoh laporan: "Mengajukan Surat"). Kolom aktor
diturunkan dari guard dan izin bawaan; kalau saat menjalankan aplikasi ternyata berbeda, **lapor ke
Afif**, jangan diubah sendiri di artefak.

##### 7.1.3.1 Autentikasi dan Akun (`AUT`)

| ID | Use Case | Aktor | FR | Route |
|---|---|---|---|---|
| UC-01 | Masuk | Warga, Pengurus RT, Pengurus RW | `FND-06` | `/login` |
| UC-02 | Mengklaim Akun Warga | Warga | `SF-NT-02` | `/login` |
| UC-03 | Memulihkan Kata Sandi | Warga, Pengurus RT, Pengurus RW | `SF-NT-03` | `/login` |
| UC-04 | Melihat Notifikasi | Warga | `SF-NT-01` | `/portal` (laci notifikasi) |
| UC-05 | Melihat Dasbor | Pengurus RT, Pengurus RW | `SF-KS-04`, `SF-KP-07` | `/dashboard` |

##### 7.1.3.2 Publik (`PUB`)

| ID | Use Case | Aktor | FR | Route |
|---|---|---|---|---|
| UC-06 | Melihat Profil RW | Publik | `SF-PG-03`, `LP-01/02` | `/` |

##### 7.1.3.3 Kependudukan (`KP`)

| ID | Use Case | Aktor | FR | Route |
|---|---|---|---|---|
| UC-07 | Menambah Data KK | Pengurus RT, Pengurus RW | `SF-KP-01` | `/kk/tambah` |
| UC-08 | Mengubah Data Warga | Pengurus RT, Pengurus RW | `SF-KP-02` | `/kk/[id]/edit` |
| UC-09 | Menonaktifkan Data Warga | Pengurus RT, Pengurus RW | `SF-KP-03` | `/kk/[id]/edit` |
| UC-10 | Mencari Data KK | Pengurus RT, Pengurus RW | `SF-KP-04` | `/kk` |
| UC-11 | Melihat Detail KK | Pengurus RT, Pengurus RW | `SF-KP-05` | `/kk/[id]` |
| UC-12 | Mengimpor Data Warga | Pengurus RW | `SF-KP-06` | `/kk/impor` |
| UC-13 | Melihat Rekap Demografis | Pengurus RT, Pengurus RW | `SF-KP-07` | `/kk/rekap` |
| UC-14 | Mengajukan Pembaruan Data | Warga | `SF-KP-08` | `/portal/perbaruan` |
| UC-15 | Memverifikasi Pembaruan Data | Pengurus RT, Pengurus RW | `SF-KP-08` | `/kk/pembaruan` |
| UC-16 | Membuat Akun Portal Warga | Pengurus RT, Pengurus RW | `SF-NT-02` | `/kk/[id]` |

##### 7.1.3.4 Surat-Menyurat (`SR`)

| ID | Use Case | Aktor | FR | Route |
|---|---|---|---|---|
| UC-17 | Mengajukan Surat | Warga | `SF-SR-01` | `/portal/surat/ajukan` |
| UC-18 | Mengunggah Dokumen Persyaratan | Warga | `SF-SR-02` | `/portal/surat/ajukan` |
| UC-19 | Memantau Status Surat | Warga | `SF-SR-03` | `/portal/surat/[id]` |
| UC-20 | Memverifikasi Pengajuan Surat | Pengurus RT | `SF-SR-04` | `/surat/[id]` |
| UC-21 | Menyetujui dan Menandatangani Surat | Pengurus RT, Pengurus RW | `SF-SR-05` | `/surat/[id]` |
| UC-22 | Mengunduh Surat | Warga, Pengurus RT | `SF-SR-06` | `/portal/surat/[id]/cetak`, `/surat/[id]/cetak` |
| UC-23 | Melihat Riwayat Surat | Warga, Pengurus RT, Pengurus RW | `SF-SR-07` | `/surat`, `/portal` |

Relasi: UC-17 `<<include>>` UC-18.

##### 7.1.3.5 Kas RW (`KS`)

| ID | Use Case | Aktor | FR | Route |
|---|---|---|---|---|
| UC-24 | Mencatat Pemasukan Kas | Pengurus RW | `SF-KS-01` | `/kas/tambah` |
| UC-25 | Mencatat Pengeluaran Kas | Pengurus RW | `SF-KS-02` | `/kas/tambah` |
| UC-26 | Mengunggah Bukti Transaksi | Pengurus RW | `SF-KS-03` | `/kas/tambah` |
| UC-27 | Melihat Saldo Kas | Pengurus RT, Pengurus RW | `SF-KS-04` | `/kas` |
| UC-28 | Melihat Laporan Kas per Periode | Pengurus RT, Pengurus RW | `SF-KS-05` | `/kas` |
| UC-29 | Membatalkan Transaksi Kas | Pengurus RW | `SF-KS-06` | `/kas` |
| UC-30 | Mengelola Kategori Kas | Pengurus RW | `SF-KS-01`, `SF-KS-02` | `/kas/kategori` |

Relasi: UC-25 `<<include>>` UC-26; UC-24 `<<extend>>` UC-26.
Pengurus RT hanya **membaca** Kas RW (Kas RT disembunyikan sejak rancangan Kas versi C).

##### 7.1.3.6 Iuran Warga (`IU`)

| ID | Use Case | Aktor | FR | Route |
|---|---|---|---|---|
| UC-31 | Mengelola Jenis Iuran | Pengurus RW | `SF-IU-01` | `/iuran/jenis` |
| UC-32 | Menerbitkan Tagihan Iuran | Pengurus RW | `SF-IU-02` | `/iuran/generate` |
| UC-33 | Mencatat Pembayaran Iuran | Pengurus RT, Pengurus RW | `SF-IU-03` | `/iuran/[id]/bayar` |
| UC-34 | Mengonfirmasi Bukti Pembayaran | Pengurus RT, Pengurus RW | `SF-IU-03` | `/iuran/konfirmasi` |
| UC-35 | Membayar Iuran secara Online | Warga, Midtrans | `SF-IU-04` | `/portal/iuran` |
| UC-36 | Melihat Tagihan Iuran | Warga | `SF-IU-05` | `/portal/iuran`, `/portal` |
| UC-37 | Melihat Rekap Iuran per RT | Pengurus RT, Pengurus RW | `SF-IU-05` | `/iuran`, `/iuran/rekap` |
| UC-38 | Mencatat Setoran RT ke RW | Pengurus RW | `SF-IU-06` | `/iuran/setoran` |

Relasi: UC-35 `<<include>>` UC-36. UC-38 hanya Pengurus RW: dicek 6 Nov, akun Pengurus RT mendapat
403 di `/iuran/setoran` (`handover-kit.md` §2.2 yang menulis pengurus_rt sudah usang).

##### 7.1.3.7 Pengumuman (`PG`)

| ID | Use Case | Aktor | FR | Route |
|---|---|---|---|---|
| UC-39 | Membuat Pengumuman | Pengurus RT, Pengurus RW | `SF-PG-01`, `SF-PG-04` | `/pengumuman/tambah` |
| UC-40 | Mengubah dan Mengarsipkan Pengumuman | Pengurus RT, Pengurus RW | `SF-PG-02` | `/pengumuman/[id]/edit` |
| UC-41 | Melihat Pengumuman | Publik, Warga, Pengurus RT, Pengurus RW | `SF-PG-03` | `/pengumuman`, `/` |

`SF-PG-04` (siaran notifikasi) tidak punya layar; ia terjadi di dalam UC-39 dan diuji lewat UC-04.
Kartu `Todo` EPIC-2 (`EV-02` lampiran, `EV-03` filter, `EV-BUG-01`) **tidak** dijadikan UC.

##### 7.1.3.8 Pengaturan (`PGT`)

| ID | Use Case | Aktor | FR / kartu | Route |
|---|---|---|---|---|
| UC-42 | Mengelola Akun Pengguna | Pengurus RW | `FND-09`, `SF-NT-02` | `/pengaturan/pengguna` |
| UC-43 | Mengelola Peran dan Izin | Pengurus RW | `FND-08` | `/pengaturan/peran` |
| UC-44 | Mengelola Data RT | Pengurus RW | `W-06` | `/pengaturan/rt` |
| UC-45 | Mengelola Pengurus | Pengurus RW | `W-06` | `/pengaturan/pengurus` |
| UC-46 | Mengunggah Tanda Tangan Pejabat | Pengurus RW | `SF-SR-05`, `SR-03b` | `/pengaturan/ttd` |
| UC-47 | Mengelola Konten Landing Page | Pengurus RW | `W-02` | `/pengaturan/landing` |

##### 7.1.3.9 UC Kunci (untuk artefak yang tidak mencakup semua UC)

Usulan awal; PIC artefak boleh menyesuaikan **dengan memilih dari daftar di atas**, bukan membuat nama baru.

| Artefak | UC yang dipakai |
|---|---|
| Use case description (6–8) — Alizha | UC-01, UC-07, UC-14, UC-17, UC-21, UC-32, UC-35, UC-43 |
| Activity diagram (7) — Josua | UC-07, UC-15, UC-17, UC-21, UC-25, UC-34, UC-35 |
| Sequence diagram (4) — Safira | UC-17 (+UC-21), UC-35 (*webhook* Midtrans), UC-07 (KK-*first*), UC-01 (guard akses) |


#### 7.1.4 Konvensi Penomoran dan Caption

##### 7.1.4.1 Caption

| Aturan | Isi |
|---|---|
| Penomoran | Pakai **Insert Caption** di Word (label `Gambar` / `Tabel`, sertakan nomor bab). Jangan ketik nomor manual. |
| Di draf Markdown | Tulis `Gambar 4.n` / `Tabel 4.n` (huruf `n` apa adanya); nomor final diisi Word. |
| Letak | **Gambar**: caption di **bawah** gambar, rata tengah. **Tabel**: caption di **atas** tabel, rata kiri. |
| Format | `Gambar 4.n Judul` — tanpa titik di akhir, judul Title Case. |
| Rujukan | Setiap gambar/tabel wajib dirujuk di paragraf sebelumnya ("... ditunjukkan pada Gambar 4.n"). |
| Sumber | Gambar dari luar tim diberi baris `Sumber: ...` di bawah caption. Diagram buatan tim tidak perlu. |

##### 7.1.4.2 Pola Judul Caption per Artefak

| Artefak | Pola judul | Contoh |
|---|---|---|
| BPMN as-is | `Proses Bisnis Saat Ini <Proses>` | Gambar 4.n Proses Bisnis Saat Ini Pembayaran Iuran |
| BPMN to-be | `Proses Bisnis Usulan <Proses>` | Gambar 4.n Proses Bisnis Usulan Pembayaran Iuran |
| ArchiMate | `Arsitektur Enterprise <Lapisan>` | Gambar 4.n Arsitektur Enterprise Lapisan Aplikasi dan Teknologi |
| Use case diagram | `Use Case Diagram <Modul>` / `Use Case Diagram Global` | Gambar 4.n Use Case Diagram Surat-Menyurat |
| Use case description | `<Nama UC>` (tabel) | Tabel 4.n Mengajukan Surat |
| Activity diagram | `Activity Diagram <Nama UC>` | Gambar 4.n Activity Diagram Mengajukan Surat |
| Sequence diagram | `Sequence Diagram <Nama UC>` | Gambar 4.n Sequence Diagram Membayar Iuran secara Online |
| Class diagram / ERD | `Class Diagram RW Digital` / `Entity Relationship Diagram RW Digital` | — |
| Kamus data | `Kamus Data Tabel <nama_tabel>` | Tabel 4.n Kamus Data Tabel surat |
| FR | `Kebutuhan Fungsional Modul <Modul>` | Tabel 4.n Kebutuhan Fungsional Modul Kas RW |
| UI/UX | `Wireframe <Halaman>` / `Rancangan Antarmuka <Halaman>` | Gambar 4.n Wireframe Pengajuan Surat |
| Screenshot 4.2 | `Halaman <Nama Halaman>` | Gambar 4.n Halaman Daftar Kartu Keluarga |
| Black box 4.3 | `Pengujian Black Box Modul <Modul>` | Tabel 4.n Pengujian Black Box Modul Iuran Warga |

`<Modul>` dan `<Nama UC>` **disalin dari §7.1.2 dan §7.1.3**. ID UC tidak ditulis di caption, tetapi wajib ada
di kolom/isi artefaknya (tabel FR, use case description, tabel black box).

##### 7.1.4.3 ID Turunan

| Jenis | Format | Contoh |
|---|---|---|
| Kebutuhan fungsional | tetap `SF-<MODUL>-nn` dari `laporan.md` | `SF-SR-01` |
| Kebutuhan non-fungsional | `NFR-<KATEGORI>-nn` | `NFR-PERF-01` |
| Kasus uji black box | `BB-<KODE MODUL>-nn` + kolom UC | `BB-SR-03` (UC-20) |
| Defect | `D-nn` | `D-02` |


#### 7.1.5 Penamaan Berkas Diagram dan Screenshot

Simpan di **`docs/laporan/gambar/bab4/`** (satu folder untuk semua PIC). Ekspor PNG 300 dpi; berkas
sumber (`.vpp`, `.bpmn`, `.drawio`, Figma link) disimpan dengan nama dasar yang sama.

Pola: **`<butir>-<jenis>-<subjek>.png`**, huruf kecil, pisah tanda hubung, tanpa spasi.

| Bagian | `<butir>` | `<jenis>` | Contoh |
|---|---|---|---|
| 4.1.1b BPMN as-is | `411b` | `bpmn-asis` | `411b-bpmn-asis-iuran.png` |
| 4.1.2a BPMN to-be | `412a` | `bpmn-tobe` | `412a-bpmn-tobe-iuran.png` |
| 4.1.2b ArchiMate | `412b` | `archimate` | `412b-archimate-aplikasi.png` |
| 4.1.2c Use case | `412c` | `usecase` | `412c-usecase-sr.png`, `412c-usecase-global.png` |
| 4.1.2e Activity | `412e` | `activity` | `412e-activity-uc17-mengajukan-surat.png` |
| 4.1.2f Class | `412f` | `class` | `412f-class-domain.png` |
| 4.1.2g ERD | `412g` | `erd` | `412g-erd.png` |
| 4.1.2h Sequence | `412h` | `sequence` | `412h-sequence-uc35-membayar-iuran-online.png` |
| 4.1.2i UI/UX | `412i` | `wireframe` / `hifi` | `412i-wireframe-surat-ajukan.png` |
| 4.1.2j Arsitektur | `412j` | `arsitektur` | `412j-arsitektur-deployment.png` |
| 4.2 Screenshot | `42` | `ss` | `42-ss-kk-daftar.png`, `42-ss-portal-surat-ajukan.png` |
| 4.3 Bukti uji | `43` | `bb` / `ci` | `43-bb-sr-03.png`, `43-ci-run.png` |

Subjek per modul memakai **kode modul** §7.1.2 (`aut`, `pub`, `kp`, `sr`, `ks`, `iu`, `pg`, `pgt`);
subjek per UC memakai `uc<nomor>-<slug nama UC>`.


#### 7.1.6 Setup Aplikasi Lokal (untuk semua PIC)

Dibutuhkan untuk activity, sequence, screenshot, black box, dan BPMN to-be. Cukup sekali.

**Prasyarat:** Git, **Node.js 22.6 atau lebih baru** (cek `node -v`).

```bash
git clone https://github.com/miralami/rwdigital.git
```

```bash
cd rwdigital
```

```bash
npm install
```

```bash
cp .env.example .env
```

(Di PowerShell/CMD: `copy .env.example .env`.)

```bash
npm run db:setup
```

```bash
npm run db:seed
```

```bash
npm run dev
```

Buka <http://localhost:5173>, masuk dengan akun uji di [`credentials.md`](../../credentials.md):
`admin@rw.id` (Pengurus RW), `pengurus@rw.id` (Pengurus RT 01), `warga@rw.id` (Warga).

**Catatan:**

- Urutan wajib: `db:setup` sebelum `dev`. Kalau muncul `no such table: user`, jalankan ulang
  `npm run db:setup` lalu `npm run db:seed` (keduanya aman diulang).
- Data seed bertanda "Contoh"; jangan memasukkan data warga asli saat mengambil screenshot.
- **Bayar online (UC-35)** butuh kunci Midtrans *sandbox* di `.env` (`MIDTRANS_SERVER_KEY`,
  `MIDTRANS_CLIENT_KEY`). Minta ke Afif lewat chat pribadi, jangan di-commit. Tanpa kunci, halaman
  tagihan tetap tampil, hanya tombol bayar yang gagal.
- Jangan jalankan `npx drizzle-kit push` (lihat [`README.md`](../../README.md)).
- Ambil versi terbaru sebelum screenshot: `git pull` lalu `npm run db:setup`.
- Macet lebih dari 15 menit → kirim tangkapan layar error ke Afif.

### 7.2 Pembagian

| Artefak | PIC | Sumber | Alasan |
|---|---|---|---|
| BPMN as-is | **Zidan** | Wawancara narsum | Narasumber utama ke mitra, paling paham proses lapangan saat ini |
| BPMN to-be | **Josua** | Alur di aplikasi yang berjalan | Analisis proses dari kondisi saat ini ke sistem usulan |
| FR (34 fungsi, 6 tabel) | **Alizha** | SF-xx di `laporan.md` + aplikasi, dipetakan ke UC-ID | Menguasai scope modul surat dan kebutuhan mitra |
| NFR (semua kategori) | **Alizha** | NFR-SEC/ACC yang ada + kode | PIC keamanan, sudah pegang NFR-SEC/ACC |
| Use case diagram + description | **Alizha** | Kerangka UC-ID + aplikasi | Satu orang dengan FR agar istilah dan cakupan konsisten |
| Activity diagram (7) | **Josua** | Menjalankan alur di aplikasi per UC-ID | Lanjutan analisis proses di level use case |
| Kamus data | **Josua** | `schema.ts` langsung | Dokumentasi atribut dan tipe data tabel |
| Class diagram | **Afif** | `schema.ts` | Lead teknis, pegang model domain |
| ERD | **Afif** | `schema.ts` | Lead teknis, pegang skema basis data |
| ArchiMate (2 view) | **Afif** | Kode + dokumen arsitektur | Lead teknis, pegang arsitektur dan deployment |
| Arsitektur software + RBAC | **Afif** | Kode (`rbac`, `guard`, `scope`) | Lead teknis |
| 4.1.3–4.1.5 (Kanban, DoD, metrik) | **Afif** | Papan Kanban + `git log` | PIC metodologi |
| Sequence diagram (4) | **Safira** | Kode route/server action per UC-ID | Dekat dengan alur antarmuka dan integrasi pembayaran iuran |
| UI/UX (token, wireframe, hi-fi) | **Safira** | Aplikasi + `docs/design-preview/` | PIC UI/UX |
| 4.2 Screenshot per modul | **Safira** (kumpul ke Afif) | Aplikasi | Paling paham tampilan layar dari sisi UI/UX |
| 4.3 Black Box per modul | **Zidan** | Aplikasi + kerangka UC-ID | Koordinasi validasi skenario uji dengan mitra |
| Polish caption & daftar gambar | **Safira** | Konvensi caption §7.1 | PIC laporan, menjaga konsistensi format |

Beban: Zidan (2), Alizha (3, paling berat secara isi), Josua (3), Safira (5, ringan–sedang),
Afif (5, teknis). Zidan ringan di laporan karena porsi besarnya ada di koordinasi mitra, narsum,
dan UAT.

### 7.3 Konsekuensi

- **Semua PIC harus bisa menjalankan aplikasi** (langkah di §7.1.6; `npm run dev` + seed lokal, atau satu staging
  bersama). Josua dan Safira dibantu setup sekali di awal.
- **Cek konsistensi di akhir, bukan blocker di tengah:** Alizha mencocokkan FR ↔ UC ↔
  activity/sequence ↔ black box berdasarkan UC-ID (lihat §8, 24–25 Nov).
- Polish caption tetap di akhir, tapi ringan karena konvensi sudah dipakai sejak awal.

---

## 8. Urutan Pengerjaan — Jadwal Tetap

**Tenggat final: Kamis, 26 November 2026** (buffer submit Jumat, 27 November 2026).
Mulai: Jumat, 6 November 2026. Total 3 minggu kalender, 15 hari kerja.

| Tanggal | Pekerjaan | Penanggung jawab | Output |
|---|---|---|---|
| 6 Nov | **Kerangka bersama** (§7.1): aktor, modul, UC-ID, konvensi caption + bantu setup aplikasi lokal ✅ | Afif | §7.1 |
| 6–7 Nov | **P0**: sinkron Word ← `laporan.md` (§3.5 Kanban + loop iterasi, paragraf rujukan §3.3.4, perbaikan nomor tabel/gambar, RBAC rusak, typo) | Afif | Word = `laporan.md` |
| 6–8 Nov | Teori Bab II: BPMN, ArchiMate, Interaction Design, Kanban/MoSCoW, UML/ERD, Black Box | Afif + Alizha | §2.2 lengkap |
| 7–11 Nov | BPMN as-is | Zidan | 4.1.1b |
| 7–11 Nov | BPMN to-be | Josua | 4.1.2a |
| 7–13 Nov | FR (6 tabel) + NFR (1 tabel) + MoSCoW | Alizha | 4.1.1d–f |
| 7–15 Nov | Use case diagram + 6–8 use case description | Alizha | 4.1.2c–d |
| 9–13 Nov | ArchiMate + arsitektur software + RBAC + ERD + class diagram | Afif | 4.1.2b, f, g, j |
| 9–15 Nov | Activity diagram (7) + kamus data | Josua | 4.1.2e, g |
| 9–15 Nov | Sequence diagram (4) | Safira | 4.1.2h |
| 9–18 Nov | UI/UX: token, 3 wireframe, 4–6 hi-fi, tabel prinsip | Safira | 4.1.2i |
| 12–20 Nov | Screenshot per modul + paragraf fungsi | Safira → Afif | 4.2 |
| 12–22 Nov | Tabel Black Box per modul + rekap + defect log + lampiran bukti CI | Zidan | 4.3 |
| **23–24 Nov** | **UAT bersama pengurus RW 06** + rekap hasil | Zidan (koordinasi) + Afif | 4.1.6a, bahan Bab VI |
| 24–25 Nov | Cek konsistensi FR ↔ UC ↔ activity/sequence ↔ black box (per UC-ID) | Alizha | Daftar perbaikan |
| 24–25 Nov | Polish: caption, daftar gambar/tabel, konsistensi angka | Safira | Bab IV final |
| **26 Nov** | **Batas akhir Bab IV** — freeze, tidak ada tambahan | Afif | Siap submit |
| 27 Nov | Buffer submit | Afif | — |

**Tidak ada dependency keras antar-PIC** setelah kerangka 6 Nov: semua artefak bersumber dari
aplikasi/kode/narsum dan memakai UC-ID yang sama (§7). Satu-satunya urutan wajib: kerangka →
semua artefak → cek konsistensi → polish.
Kalau satu artefak mundur >2 hari, potong ke versi **Minimum** di §6, jangan geser tenggat.

---

## 9. Audit Bab I–III (ringkas)

| Temuan | Dampak | Aksi |
|---|---|---|
| 🔴 §3.3.4 FR tidak ada di Word (lompat 3.3.3 → 3.4) | Bab IV 4.1.1d merujuk FR yang tidak ada di dokumen | **Keputusan: FR seluruhnya di 4.1.1d.** Di Word, §3.3.4 diisi satu paragraf rujukan silang ("spesifikasi fungsional dirinci pada 4.1.1d") agar tidak ada lompatan penomoran |
| 🔴 §3.5 Word narasi generik, "Kanban" 0 kemunculan | 4.1 tidak "mengikuti" §3.5.1 → temuan reviewer | Ganti dengan versi `laporan.md` (6 tahap) **dan** tambahkan framing I&I + panah loop "Iterasi berikutnya" |
| 🟠 Bab II tanpa teori Kanban/UML/ERD/BlackBox/BPMN/ArchiMate/IxD | Artefak Bab IV tanpa dasar teori | Tambah 3–4 subbab teori |
| 🟠 Tabel `3.1, 3.3, 3.5` (3.2/3.4 hilang); Daftar Gambar `1..6` vs body `3.1..3.4` | Nomor silang di seluruh laporan | Renumber sekali di akhir |
| 🟠 Matriks RBAC baris Surat rusak (5 grup nilai untuk 4 peran) | Data salah | Perbaiki |
| 🟠 Fishbone (Gambar 1) tidak ter-embed; InlineShapes hanya 5 | Gambar hilang saat dicetak | Cek & sisipkan ulang |
| 🟠 Klaim wawancara RW 06 (§3.1, §3.5.2) vs `PROJECT.md` "tanpa wawancara" | Inkonsistensi lintas bab | **Terjawab: mitra RW 06 memang terlibat — revisi tiap iterasi berasal dari mereka.** Selaraskan `PROJECT.md` dan §3.1/§3.5.2 ke narasi ini; 4.1.1c memakai "checklist + umpan balik per iterasi" |
| 🟡 Typo: `engguna`, `bendaharahanya`, `sistemBoK`, `pada  berfokus`; heading Bab I kehilangan nomor | Nilai formalitas | Sapu bersih |

---

## 10. Format & Aturan Teknis

- Penomoran: `BAB IV` → `4.1` → `4.1.1` → sub-butir `a) b) c)` (**jangan** 4.1.2.1).
- Caption: pakai *Insert Caption* Word, jangan ketik manual → `Gambar 4.1`, `Tabel 4.1` (aturan lengkap §7.1.4).
- Font Times New Roman 12, spasi 1.5, judul bab 14 bold.
- Setiap gambar wajib dirujuk di paragraf ("...ditunjukkan pada Gambar 4.5").
- Setiap tabel wajib punya nomor + judul di atasnya.
- Daftar Gambar & Daftar Tabel auto-generate dari caption.

---

## 11. Status Keputusan → `../keputusan.md`

Keputusan final (framing, lokasi artefak, FR/NFR, pembagian kerja, pengujian, UAT, tenggat, Figma)
ada di register **K-01 … K-12**. Sisa tindakan juga dicatat di sana.
