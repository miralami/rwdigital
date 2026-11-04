# Strategi Dokumentasi Proyek → Bab IV

> Dokumen diskusi. Basis: `git log main` (92 commit, 25 Sep–3 Nov 2026), GitHub PR/issue,
> `docs/kanban/backlog.md`, dan draft `bab4-proses-perancangan.md`.
> Tujuan: menyelaraskan **cerita laporan** dengan **bukti repo**, lalu membagi kerja dokumen
> tanpa menjadikan Afif bottleneck.

---

## 1. Apa yang Commit `main` Katakan

**Angka dasar**

| Metrik | Nilai |
|---|---|
| Total commit di `main` | 92 |
| Commit merge | 28 |
| Commit non-merge | 64 |
| Rentang | 25 Sep → 3 Nov 2026 (±40 hari) |
| Pull request (merged) | 28 |
| Issue | 99 (label `T0`–`T5`, `must`/`should`, `req-stakeholder`, `iterasi-2`) |
| Baris kode (`src/`) | ±29.900 |
| Halaman route | 38 |
| Tabel basis data | 26 |
| File uji | 10 (100 unit test) + 8 e2e |

**Kontribusi (non-merge, lockfile dikecualikan)**

| Orang | Commit | % commit | Baris ditambah | % baris |
|---|---|---|---|---|
| Afif (`miralami` + `afifnursena`) | 50 | 78% | ±46.400 | ±82% |
| Zidan | 6 | 9% | ±2.700 | ±5% |
| Shaffira | 1 (PR #62) | 2% | ±4.700 | ±8% |
| Josua | 2 | 3% | ±2.400 | ±4% |
| Alizha | 3 | 5% | ±560 | ±1% |
| Copilot | 2 | 3% | ±175 | ±0,3% |

> Catatan: `git shortlog` biasa **melebih-lebihkan** jumlah orang karena commit merge ikut terhitung.
> Untuk laporan, selalu pakai `--no-merges`.

**Pola waktu**

| Fase | Tanggal | Isi |
|---|---|---|
| **1. Big-bang** | 25 Sep – 11 Okt | Scaffold, lalu `5dbdfe9` (28 Sep) berisi **69 file / 12.229 baris**: warga, kas, iuran, pengumuman, auth sekaligus. Portal + guard menyusul hari yang sama. Belum ada papan, belum ada PR per fitur |
| **2. Retrofit Kanban** | 12 – 20 Okt | `17da42b` "terapkan papan Kanban & selaraskan laporan". Issue = kartu, MoSCoW, PIC, `CODEOWNERS` (17 Okt). Kontribusi Josua & Alizha masuk di sini |
| **3. Aliran disiplin** | 27 Okt – 3 Nov | PR per kartu (#74–#90), CI Vitest + Playwright, iterasi 2 (setoran RT, iuran config-driven, landing dinamis) dan iterasi 3 (RBAC dinamis, notifikasi, KK-first, iuran 2 tingkat, TTD) |

**Detail yang perlu diketahui sebelum menulis**

- Commit 28 Sep = 12 ribu baris dalam satu tembakan → **tidak ada "continuous flow"** di 2 minggu pertama.
- CODEOWNERS baru ada **17 Okt**, bukan sejak awal.
- Beberapa PR dibuat dan di-merge oleh akun yang sama dalam **1–3 menit** (mis. #83: 21:34:19 → 21:35:59; #90: 12:04:33 → 12:05:42) → **tidak ada peer review nyata**.
- Commit message lemah: `1229670 "balbal"`, `39882b3 "add gemini progress"`.
- Papan Kanban menyusul **2,5 minggu** setelah modul inti jadi.

---

## 2. Klaim Draft Bab IV vs Bukti

| Klaim di `bab4-proses-perancangan.md` | Bukti repo | Status |
|---|---|---|
| "Kode dikembangkan pada cabang fitur modular" (§4.1.3) | Sep–awal Okt commit langsung ke `main` | ❌ perlu dikoreksi: branch discipline **mulai 27 Okt** |
| "Wajib satu peninjau, Afif peninjau utama" (§4.1.4) | Afif menulis **dan** merge PR-nya sendiri dalam hitungan menit | ❌ jangan diklaim — ganti dengan **CI + self-review** |
| "WIP 1–2 kartu per orang, maks 10" (§4.1.3) | Papan baru ada 12 Okt; sebelum itu tidak ada kendali WIP | ⚠️ benar **hanya** untuk fase 3 |
| "PIC per Epic" (Tabel 4.1) | PIC ≠ penulis kode | ⚠️ pertahankan, tapi definisikan sebagai **pemilik domain** |
| "PR #59, #60, #61 ditinjau dan digabungkan" (§4.1.5) | PR-nya ada; "ditinjau" tidak terbukti | ⚠️ ganti jadi "digabungkan lewat gate CI", review manusia sebut apa adanya |
| Angka 29 Done / WIP 3 / Todo 6 | Board 3 Nov: 61 Done / 0 WIP / 4 Todo / 3 Won't | ❌ usang |

**Kesimpulan:** masalahnya bukan "Afif kebanyakan koding". Masalahnya adalah **laporan mengklaim proses
yang tidak terjadi**. Satu klik ke GitHub langsung terlihat. Yang harus diperbaiki adalah narasinya,
bukan history-nya (jangan rewrite git).

---

## 3. Reframing yang Jujur dan Justru Lebih Kuat

### 3.1 Framing: siklus Iterative & Incremental, Kanban sebagai pengelola alur kerja

**Jangan ganti metodenya — ganti framing-nya.** Kanban bukan SDLC penuh, jadi secara akademik
paling rapi kalau dipasangkan dengan siklus pengembangan. Rumusan yang dipakai:

> Pengembangan Sistem Informasi RW dilaksanakan dalam siklus ***iterative and incremental***.
> Setiap iterasi menghasilkan penambahan atau penyempurnaan fitur yang tetap berfungsi.
> **Arah setiap iterasi ditentukan oleh umpan balik pengurus RW 06 terhadap hasil iterasi
> sebelumnya**, sehingga revisi terjadi bertahap. Di dalam setiap iterasi, alur kerja dikendalikan
> melalui **papan Kanban enam tahap** dan prioritisasi **MoSCoW**. Siklus berjalan dalam tiga
> gelombang: **Iterasi 1 (MVP)**, **Iterasi 2 (penyempurnaan keuangan dan portal)**, dan
> **Iterasi 3 (RBAC, notifikasi, dan konsolidasi kependudukan)**. Kanban diadopsi pada minggu ketiga
> dan menjadi alat kendali utama sejak Iterasi 2.

Mengapa ini yang dipilih (dan bukan yang lain):

| Opsi | Bukti yang kita punya | Risiko klaim | Biaya ubah |
|---|---|---|---|
| **I&I + Kanban** (dipakai) | Papan GitHub Projects, issue = kartu, MoSCoW, WIP, dua gelombang iterasi nyata | Rendah — justru paling cocok | Kecil: judul §2.2.3 + 1 paragraf + panah loop §3.5.1 |
| Kanban saja (sekarang) | Sama, tapi iterasi 2/3 tidak punya tempat | Rendah | 0 |
| Scrum | Tidak ada sprint planning/review/retro, PO/SM | **Tinggi** — harus mengarang 4 jenis artefak | Besar |
| Waterfall | Terbantah: 12.229 baris kode 28 Sep, dokumen desain belakangan | **Sangat tinggi** | Sangat besar |
| Prototyping / RAD | Fase awal memang build-first | Sedang — harus jelaskan kenapa desain menyusul | Sedang |

Efeknya ke narasi fase (tetap dipakai, tapi sebagai **isi iterasi**, bukan sebagai "kematangan
proses yang naik"):

- Iterasi 1 menjelaskan kenapa 21 kartu `Done` berasal dari back-fill dan kenapa papan baru
  diadopsi 12 Okt;
- Iterasi 2 & 3 menjelaskan lonjakan 29 → 61 kartu tanpa perlu klaim "Kanban sejak awal";
- MK **Manajemen Proyek & PL** tetap kuat karena ada retrospektif + perbaikan berkesinambungan;
- sejalan dengan §4.1.6b yang sudah menulis rekonstruksi as-is.

**Yang harus dihindari:** menyebut Scrum hanya karena ada iterasi; menyebut Waterfall hanya karena
urutan bab I–VII linear; dan kalimat "Kanban sejak awal".

### 3.2 Peran: pemilik domain ≠ penulis kode

| Orang | Peran yang jujur | Bukti yang bisa ditunjuk |
|---|---|---|
| **Afif** | Lead teknis, implementasi inti, arsitektur & skema, gate PR, PIC metodologi | 50 commit, ±82% baris, 20+ PR |
| **Zidan** | Pemilik domain surat-menyurat, koordinasi mitra, TTD elektronik | 6 commit, PR #63/#89/#90 |
| **Shaffira** | Pemilik domain keuangan & kas RT, UI/UX, PIC laporan, Bab V | PR #62 (±4.700 baris) |
| **Alizha** | Pemilik domain informasi/pengumuman + keamanan | 3 commit, PR #60 |
| **Josua** | Pemilik domain kependudukan (KK-first) + data | 2 commit, PR #59/#61 |

Tulis eksplisit di 4.1: *"Kepemilikan domain mencakup definisi kebutuhan, validasi, dan pengujian modul;
implementasi kode terpusat pada lead teknis karena batasan waktu."* Ini juga menjawab pertanyaan
"kok satu orang 80%?" sebelum ditanya.

### 3.3 Label setiap artefak

Tambahkan tabel kecil di awal 4.1 atau 4.1.6:

| Artefak | Status |
|---|---|
| ERD, class, arsitektur, BPMN to-be | **Rekonstruksi** (diturunkan dari kode yang sudah berjalan) |
| FR, NFR, use case, BPMN as-is | **Campuran** (sebagian ditulis sebelum, sebagian setelah) |
| Papan Kanban, issue, PR, CI | **Eks-ante** (bukti asli, bukan karangan) |

Satu tabel ini memberi sinyal integritas dan mematikan pertanyaan "kok diagramnya identik dengan kode?".

---

## 4. Handover Kit — supaya Afif Tidak Jadi Bottleneck

> **Sudah digenerate:** `docs/laporan/handover-kit.md` (3 Nov 2026). Isinya 41 route + aktor + FR,
> 26 tabel + relasi, peta 34 FR → route, inventaris 100 unit + 8 e2e, dan bukti commit/PR per Epic.

Kalau Afif fokus web, orang lain harus bisa menulis tanpa menebak. Bahan yang sudah tersedia
(diturunkan dari repo, bukan ditulis manual):

| Bahan | Isi | Untuk siapa |
|---|---|---|
| **Peta halaman** | 41 route + fungsi + aktor berwenang | 4.2 screenshot, PIC modul |
| **Peta entitas** | 26 tabel + kolom + relasi | ERD, kamus data, class diagram |
| **Peta FR → halaman** | 34 `SF-*` → route yang mewujudkannya | Zidan (FR), 4.2.9 traceability |
| **Inventaris uji** | 100 unit test + 8 e2e, per modul | Alizha (4.3) |
| **Bukti proses** | commit/PR/issue per Epic | Afif (4.1.3–4.1.5) |

Dengan ini: Josua bisa menulis BPMN & activity tanpa bimbingan, Zidan bisa menulis use case,
Alizha bisa menyusun tabel uji, Safira bisa memetakan layar.

**Beban dokumen usulan (Afif diringankan):**

| Afif | Orang lain |
|---|---|
| ERD + kamus data | BPMN as-is/to-be → **Josua** |
| Class diagram | Activity 7 alur → **Josua** |
| Arsitektur + ArchiMate | FR 6 tabel → **Zidan** |
| 4.1.3–4.1.5 (Kanban) | Use case + description → **Zidan** |
| Review & polish | NFR + Black Box → **Alizha** |
| | Sequence + state + UI/UX → **Safira** |

---

## 5. Dampak ke Bab Lain (bukan cuma Bab IV)

| Bab | Konsekuensi dari temuan ini |
|---|---|
| **III** | §3.5 harus versi Kanban (bukan 7 tahap generik) + **panah loop "Iterasi berikutnya"** dari tahap 6 ke tahap 1, karena tanpa loop klaim I&I tidak terlihat. §3.3.4 FR: satu paragraf rujukan ke 4.1.1d (FR seluruhnya di Bab IV) |
| **II** | Wajib tambah teori: BPMN, ArchiMate, Interaction Design, Kanban/MoSCoW, UML/ERD, Black Box. Tanpa ini, artefak Bab IV tanpa dasar. **§2.2.3 diganti judul** menjadi "Siklus Iterative & Incremental dan Kanban sebagai Metode Pengelolaan Alur Kerja" |
| **Abstrak** | Tambah satu klausa: *"dengan Kanban sebagai metode pengelolaan alur kerja dalam siklus iteratif-incremental"* |
| **V** | Biaya bisa dihitung dari **data commit** (rentang waktu, jumlah commit per fase, jam kerja) — jauh lebih kredibel daripada angka karangan. Ini nilai plus |
| **VI** | UAT adalah bukti **validasi**. **Mitra RW 06 masih dapat diakses** dan revisi tiap iterasi memang berasal dari mereka, jadi UAT dijadwalkan **23–24 Nov 2026**. Siapkan berita acara + rekap temuan; pertimbangkan SUS sebagai pelengkap |
| **VII** | Kesimpulan harus cocok: 61/68 kartu selesai, 4 Todo, 3 Won't — bukan "seluruh sistem selesai" |

---

## 6. Status Keputusan

Semua keputusan inti sudah final:

| Keputusan | Nilai |
|---|---|
| Framing | **I&I + Kanban** (§3.1) |
| Lokasi FR & NFR | **Seluruhnya di Bab IV** (4.1.1d–e) |
| Pembagian kerja | **Per artefak**, bukan per fitur |
| Pengujian | **CI + Black Box**; tanpa klaim peer review |
| UAT | **Pengurus RW 06**, 23–24 Nov 2026 |
| Tenggat Bab IV | **26 Nov 2026** |
| Handover kit | **Sudah digenerate** → `handover-kit.md` |

Sisa tindakan (bukan keputusan): konfirmasi nama PIC, lampirkan bukti run CI, dan jadwalkan UAT
lewat Zidan.
