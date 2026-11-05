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

## 2. Framing Metodologi (keputusan final)

**Yang dipakai:** *Iterative & Incremental* sebagai siklus pengembangan + **Kanban** sebagai metode
pengelolaan alur kerja + **MoSCoW** sebagai prioritisasi.

**Alasan:** Kanban bukan SDLC penuh, jadi secara akademik memang harus dipasangkan dengan siklus.
Tiga gelombang iterasi kita nyata dan terdokumentasi, sehingga tidak perlu mengarang artefak baru
(Scrum butuh sprint planning/review/retro; Waterfall terbantah oleh 12.229 baris kode 28 Sep).

**Kalimat kunci yang harus muncul di §2.2.3 dan §3.5.1:**

> "Perancangan dilaksanakan dalam siklus *iterative and incremental*. Setiap iterasi menghasilkan
> penambahan atau penyempurnaan fitur yang tetap berfungsi. **Arah setiap iterasi ditentukan oleh
> umpan balik pengurus RW 06 terhadap hasil iterasi sebelumnya**, sehingga revisi terjadi secara
> bertahap, bukan dalam satu spesifikasi awal yang kaku. Di dalam setiap iterasi, alur kerja
> dikendalikan melalui papan Kanban enam tahap. Siklus dijalankan dalam tiga gelombang: Iterasi 1
> (MVP), Iterasi 2 (penyempurnaan keuangan dan portal), dan Iterasi 3 (RBAC, notifikasi, dan
> konsolidasi kependudukan). Kanban diadopsi pada minggu ketiga dan menjadi alat kendali utama sejak
> Iterasi 2."

**Judul (diperbarui 5 Nov 2026):** I&I dan nama produk naik ke judul →
`RANCANG BANGUN RW DIGITAL: SISTEM INFORMASI ADMINISTRASI RUKUN WARGA BERBASIS WEB MENGGUNAKAN
METODE ITERATIVE AND INCREMENTAL DEVELOPMENT (STUDI KASUS: RW 06 KELURAHAN KOTA BARU, KOTA BEKASI)`.
**Menunggu persetujuan pembimbing.** Kalau ditolak, kembali ke judul lama dan tambahkan klausa di
abstrak: *"dengan Kanban sebagai metode pengelolaan alur kerja dalam siklus iteratif-incremental"*.
§2.2.3 di `laporan.md` sudah menjadi **"Siklus Iterative & Incremental, Kanban, dan Prioritisasi
MoSCoW"** (2.2.3.1 IID · 2.2.3.2 Kanban · 2.2.3.3 MoSCoW).

**Istilah:** **SI-RW** = konsep sistem informasi tingkat RW (teori, Bab II). **RW Digital** = produk
kita (Bab III–IV, screenshot, studi kasus). "Rancang bangun" = analisis → desain → implementasi →
pengujian dari nol; "dan Implementasi" hanya ditambahkan bila sistem benar-benar dipakai mitra.

**Konsekuensi ke §3.5.1:** flowchart wajib punya **panah loop** dari tahap 6 kembali ke tahap 1
berlabel "Iterasi berikutnya". Tanpa loop, klaim I&I tidak terlihat.

**Rekap iterasi (dipakai di 4.1.3):**

| Iterasi | Periode | Fokus | Kartu utama |
|---|---|---|---|
| 1 | 25 Sep – 20 Okt | MVP: kependudukan, kas, iuran, surat, pengumuman, landing, portal. Papan Kanban diadopsi 12 Okt; 21 kartu direkonstruksi | `KP-A..E`, `KU-A..`, `SR-A..`, `EV-A`, `LP-01/02`, `FND-06` |
| 2 | 27–28 Okt | Penyempurnaan keuangan & portal | `KU-01b`, `KU-02b`, `KP-06`, `KP-07`, `SR-02b`, `LP-03`, `FND-07`, `T0-01`, `T0-02` |
| 3 | 2–3 Nov | RBAC, notifikasi, KK-first, iuran 2 tingkat, TTD | `FND-08`, `FND-09`, `KP-08`, `KU-05`, `SR-06`, `EV-04` |

Status akhir 3 Nov: **61 Done · 0 In Progress · 4 Todo · 3 Won't**.

**Pemicu iterasi:** Iterasi 2 dan 3 bukan sekadar "menambah fitur", melainkan merespons revisi
pengurus RW 06 terhadap hasil iterasi sebelumnya (mis. alur iuran 2 tingkat, KK-first, TTD RT).
Kalimat ini wajib muncul di 4.1.3a–c supaya klaim I&I punya sebab, bukan hanya kronologi.

**Bukti iterasi terhadap implementasi yang sudah ada — modul Kas** (dipakai di 4.1.3b–c). Pemicunya:
implementasi awal **belum berfungsi dan tidak sesuai** dengan alur kas yang dibutuhkan, ditemukan
saat evaluasi hasil iterasi. Tulis apa adanya.

| Versi | Commit / PR | Rancangan |
|---|---|---|
| A | `6162e8f` (#62, 28 Okt) | Kas RT mandiri + rekap iuran RT + Midtrans |
| B | `300c14d`, `6aaabcd` (#64), `62da849` / `40d3f9c` (#65 / #85) | Setoran porsi RW dari RT ke Kas RW + rekonsiliasi |
| C | `2a1a30c` (2 Nov) | Satu payment gateway ke RW; UI Kas RT disembunyikan, pembagian ke RT secara manual |

Alasan perubahan: ruang lingkup kas sempat ambigu (RT saja atau RW saja), dan payment gateway
terpisah per RT tidak layak diterapkan, sehingga dipilih satu gateway ke RW. Ini contoh terkuat
bahwa iterasi menyentuh arsitektur dan logika bisnis, bukan sekadar bug fixing.

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
          i) State Machine Diagram
          j) Perancangan Antarmuka (UI/UX)
          k) Arsitektur Perangkat Lunak dan Kontrol Akses
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
| a | **BPMN to-be** (tambah lane "Sistem SI-RW", gateway validasi & RBAC) | 2–4 | turunan dari b 4.1.1 |
| b | **ArchiMate**: (1) motivasi+bisnis, (2) aplikasi+teknologi | 2 | **baru** |
| c | Use case diagram: 1 global (4 aktor) + per modul | 1 + 5 | `diagram-prompts.md` §3 |
| d | Use case description: 6–8 UC kunci (nama, aktor, trigger, pre/post, normal course, sub-flow, alternate) | 6–8 tabel | **baru** |
| e | Activity diagram 7 alur kritis | 7 | `diagram-prompts.md` §4 |
| f | **Class diagram** 13 kelas domain + relasi + operasi | 1 | **baru**, dari `schema.ts` |
| g | **ERD** crow's foot + kamus data | 1 + 1 | prompt §2 + **baru** |
| h | **Sequence diagram**: surat, pembayaran+webhook Midtrans, input KK-first, guard RBAC | 4 | 1 prompt ada, 3 baru |
| i | **State machine**: status surat, tagihan, permintaan pembaruan | 2–3 | **baru** |
| j | **UI/UX**: design token, wireframe 3 alur, hi-fi 4–6 layar, tabel prinsip interaksi | 1 + 3 + 4–6 + 1 | `docs/design-preview/` |
| k | Arsitektur software (deployment) + tabel komponen + matriks RBAC final | 1 + 2 | prompt §6 |

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

**Framing wajib di 4.1.3d:** jangan klaim Kanban sejak hari pertama. Kalimat yang dipakai:
*"Kanban diadopsi pada minggu ketiga (commit `17da42b`) dan menjadi alat kendali utama sejak
Iterasi 2; 21 kartu berstatus Done pada Iterasi 1 merupakan rekonstruksi as-is."* Ini yang membuat
klaim Iterative & Incremental konsisten dengan `git log`.

**WIP limit:** aturan 1–2 kartu per orang (≤ 10 per papan) ada di `kanban/workflow.md` §4 dan
diaudit di `kanban/board.md` §3 (pelanggaran awal Josua 3 kartu → direkonsiliasi). Tulis di 4.1.3d
sebagai aturan + temuan audit, bukan klaim "selalu patuh".

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
| APSI (UML) | Use case, activity, class, ERD, sequence, state | 4.1.2c–i | Besar |
| Perancangan Interaksi | Token, wireframe, hi-fi, prinsip interaksi | 4.1.2j | Sedang |
| Pengujian Implementasi | CI (unit + e2e) dan Black Box per modul | 4.1.4a, 4.3 | Besar |

---

## 6. Rekap Artefak

| Jenis | Minimum | Ideal |
|---|---|---|
| Gambar 4.x | ~35 | ~60 |
| Tabel 4.x | ~20 | ~28 |
| Halaman estimasi | ~35 hlm | ~55 hlm |

**Belum ada sama sekali (harus dibuat):** BPMN (0) · ArchiMate (0) · Class diagram (0) ·
Sequence (0 gambar) · State machine (0) · Use case description (0) · Wireframe/hi-fi (0 terkurasi) ·
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

Usulan, menyeimbangkan beban: Josua & Afif tanpa kartu kode → ambil artefak berat.

| Artefak | PIC | Alasan |
|---|---|---|
| BPMN as-is + to-be | **Josua** | Tanpa kartu kode; erat dengan analisis data/proses |
| FR (34 fungsi, 6 tabel) | **Zidan** | Menguasai scope surat & koordinasi mitra |
| NFR (semua kategori) | **Alizha** | PIC keamanan, sudah pegang NFR-SEC/ACC |
| ArchiMate (2 view) | **Afif** | Lead teknis, sudah pegang arsitektur & deployment |
| Use case diagram + description | **Zidan** | Turunan langsung FR |
| Activity diagram (7) | **Josua** | Lanjutan BPMN yang ia pegang |
| Class diagram | **Afif** | Dari `schema.ts` |
| ERD + kamus data | **Afif** | Sudah pegang ERD global |
| Sequence diagram (4) | **Safira** | Dekat dengan UI/UX & alur iuran |
| State machine (2–3) | **Safira** | Status tagihan/surat |
| UI/UX (token, wireframe, hi-fi) | **Safira** | PIC laporan & UI/UX |
| Arsitektur software + RBAC | **Afif** | Lead teknis |
| 4.1.3–4.1.5 (Kanban, DoD, metrik) | **Afif** | PIC metodologi |
| 4.2 Screenshot per modul | **PIC modul** (kumpul ke Afif) | Harus orang yang paham layar |
| 4.3 Black Box per modul | **Alizha** (koordinasi) + PIC modul (skenario) | Alizha PIC keamanan/pengujian |
| Polish caption & daftar gambar | **Afif** | Konsistensi |

Beban: Afif (5 artefak), Josua (2 berat), Zidan (2), Safira (4), Alizha (2). Kalau terlalu berat
di Afif, Class Diagram bisa digeser ke Josua (sama-sama dari skema).

---

## 8. Urutan Pengerjaan — Jadwal Tetap

**Tenggat final: Kamis, 26 November 2026** (buffer submit Jumat, 27 November 2026).
Mulai: Jumat, 6 November 2026. Total 3 minggu kalender, 15 hari kerja.

| Tanggal | Pekerjaan | Penanggung jawab | Output |
|---|---|---|---|
| 6–7 Nov | **P0**: sinkron Word ← `laporan.md` (§3.5 Kanban + loop iterasi, paragraf rujukan §3.3.4, perbaikan nomor tabel/gambar, RBAC rusak, typo) | Afif | Word = `laporan.md` |
| 6–8 Nov | Teori Bab II: BPMN, ArchiMate, Interaction Design, Kanban/MoSCoW, UML/ERD, Black Box | Afif + Alizha | §2.2 lengkap |
| 7–10 Nov | BPMN as-is → to-be | Josua | 4.1.1b, 4.1.2a |
| 7–11 Nov | FR (6 tabel) + NFR (1 tabel) + MoSCoW | Zidan + Alizha | 4.1.1d–f |
| 9–13 Nov | ArchiMate + arsitektur software + ERD + kamus data | Afif | 4.1.2b, g, k |
| 11–14 Nov | Use case diagram + 6–8 use case description | Zidan | 4.1.2c–d |
| 11–15 Nov | Activity diagram (7 alur) | Josua | 4.1.2e |
| 13–17 Nov | Class diagram + sequence (4) + state machine (2–3) | Afif + Safira | 4.1.2f, h, i |
| 14–18 Nov | UI/UX: token, 3 wireframe, 4–6 hi-fi, tabel prinsip | Safira | 4.1.2j |
| 16–20 Nov | Screenshot per modul + paragraf fungsi | PIC modul → Afif | 4.2 |
| 19–22 Nov | Tabel Black Box per modul + rekap + defect log + lampiran bukti CI | Alizha + PIC modul | 4.3 |
| **23–24 Nov** | **UAT bersama pengurus RW 06** + rekap hasil | Zidan (koordinasi) + Afif | 4.1.6a, bahan Bab VI |
| 24–25 Nov | Polish: caption, daftar gambar/tabel, konsistensi angka, cek silang | Afif | Bab IV final |
| **26 Nov** | **Batas akhir Bab IV** — freeze, tidak ada tambahan | Afif | Siap submit |
| 27 Nov | Buffer submit | Afif | — |

Dependency keras: **BPMN to-be → use case → activity → sequence**. Jangan dibalik.
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

## 11. Status Keputusan

Sudah final:

| # | Keputusan | Nilai |
|---|---|---|
| 1 | Framing metodologi | Iterative & Incremental + Kanban sebagai pengelola alur kerja (§2) |
| 2 | Lokasi artefak | Semua pemodelan di **4.1.2** (a–k); 4.2 screenshot; 4.3 verifikasi |
| 3 | FR & NFR | Seluruhnya di **4.1.1d–e**; §3.3.4 Word cukup paragraf rujukan |
| 4 | Pembagian kerja | **Per artefak**, bukan per fitur (§7) |
| 5 | Strategi pengujian | **CI + Black Box**; tanpa klaim peer review |
| 6 | UAT | **Dengan pengurus RW 06**, 23–24 Nov 2026 |
| 7 | Tenggat Bab IV | **26 Nov 2026** (buffer submit 27 Nov) |
| 8 | Figma | *Reverse engineer* menyusul; sementara `docs/design-preview/`, tidak klaim Figma |

Yang masih perlu tindakan (bukan keputusan):

1. **Konfirmasi nama PIC** di §7 ke masing-masing orang (terutama Josua & Safira).
2. **Lampirkan bukti run CI** (screenshot/log) saat menulis 4.1.4a.
3. **Jadwalkan UAT** 23–24 Nov dengan Zidan sebagai penghubung mitra.
4. **Judul laporan** tetap "… MENGGUNAKAN METODOLOGI KANBAN"; naikkan I&I ke judul hanya kalau
   dosen pembimbing menyarankan.
