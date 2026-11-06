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

### 7.1 Kerangka Bersama (Afif, ±1 jam, 6 Nov)

Satu berkas acuan yang dipakai semua PIC, berisi:
- Daftar aktor dan daftar modul.
- **Daftar ID use case** (`UC-01 Masuk`, `UC-07 Mengajukan Surat`, dst.), cukup nama, tanpa
  deskripsi, diturunkan dari route di `src/routes/(app)/` dan `handover-kit.md`.
- Konvensi caption (`Gambar 4.x`, `Tabel 4.x`) dan penamaan berkas diagram.

Aturan: nama use case **disalin persis** dari kerangka di semua artefak (FR, use case, activity,
sequence, black box). Dengan begitu tiap PIC bisa jalan paralel sejak hari pertama.

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

- **Semua PIC harus bisa menjalankan aplikasi** (`npm run dev` + seed lokal, atau satu staging
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
| 6 Nov | **Kerangka bersama** (§7.1): aktor, modul, UC-ID, konvensi caption + bantu setup aplikasi lokal | Afif | Berkas kerangka |
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
- Caption: pakai *Insert Caption* Word, jangan ketik manual → `Gambar 4.1`, `Tabel 4.1`.
- Font Times New Roman 12, spasi 1.5, judul bab 14 bold.
- Setiap gambar wajib dirujuk di paragraf ("...ditunjukkan pada Gambar 4.5").
- Setiap tabel wajib punya nomor + judul di atasnya.
- Daftar Gambar & Daftar Tabel auto-generate dari caption.

---

## 11. Status Keputusan → `../keputusan.md`

Keputusan final (framing, lokasi artefak, FR/NFR, pembagian kerja, pengujian, UAT, tenggat, Figma)
ada di register **K-01 … K-12**. Sisa tindakan juga dicatat di sana.
