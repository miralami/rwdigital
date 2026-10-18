# afifscope.md — Scope Kerja Afif Nur Sena (`miralami`)

> Daftar **semua** yang dikerjakan Afif dalam capstone SI-RW, plus batas scope dan hal yang
> **bukan** tanggung jawabnya. Dasar: `docs/laporan/pembagian.md`, `docs/laporan/planAfif.md`,
> papan GitHub Projects *Capstone - Gr30*, riwayat commit/PR, dan `docs/laporan/analisis-panduan.md`.
>
> **Status: DIKONFIRMASI Afif — 19 Okt 2026.** Keputusan scope ada di §9. Disusun: 19 Okt 2026.
>
> **File terkait:** `bab4-proses-perancangan.md` (§4.1 siap port) · `draft-3.5-mekanisme.md` (§3.5) ·
> `diagram-prompts.md` (prompt diagram) · `pembagian-tugas.md` (pembagian semua orang). Indeks: `README.md`.

---

## 1. Peran

| Peran | Inti |
|---|---|
| **PIC Metodologi (Kanban)** | Pemilik cara kerja tim: papan, alur/WIP/DoR-DoD, metrik aliran, dan **tulisan metodologi** di laporan (§2.2.3, §3.5, §4.1). |
| **Lead Teknis** | Fondasi repo, arsitektur, RBAC, review & merge PR, penjaga `main` (CODEOWNERS). |
| Referensi peran lain | Zidan = PIC narasumber + koordinator · Safira = PIC laporan · Alizha/Josua/Safira/Zidan = PIC Epic modul. |

---

## 2. Bukti yang Sudah Selesai (GitHub)

### 2.1 Kartu/Epic yang di-assign & ditutup atas nama `miralami`

**Milik sendiri (bukan back-fill):**
- `FND-06` #21 — Membangun papan Kanban + mengisi backlog
- `LP-01` #20 — Landing Page Publik
- `LP-02` #19 — Visualisasi Statistik Publik
- `EPIC-1` #13 — Modul Publik, Landing Page & Profil RW

**FND-01..05** (#17, #16, #14, #15, #18) — fondasi: scaffold, skema DB + Drizzle, Better Auth + RBAC,
pustaka UI, dokumentasi.

**Back-fill (kode eksisting dikerjakan Afif, di-assign ke `miralami` sebagai penulisnya):**
`EV-A` #25 · `KP-A/B/C/D` #26/#27/#29/#30 · `KP-02` #31 · `KU-A/B/C` #39/#36/#38 · `KU-04` #37 ·
`KU-D` #41 · `SR-A/B/C/D/E` #46/#44/#45/#52/#51.

### 2.2 Commit/PR teknis kunci (author = `miralami`)

- `5dbdfe9` — implementasi modul inti (warga, kas, iuran, pengumuman, auth) + schema + docs
- `71ecc6a` — portal warga, route guard role, komponen UI bersama
- `4f4f09e` — perbaikan bootstrap DB lokal (dua sistem migrasi bertabrakan)
- `7375226` — pin DB lokal + catatan compose.yaml tidak terpakai
- `1234ab0` / `9cacc5e` — landing page publik + statistik (LP-01/LP-02)
- `57c953b` — pratinjau desain landing page (Opsi A/B/C) — *kompetensi UI/UX*
- `17da42b`, `17928ee`, `3b21a44` — papan Kanban, `laporanRevisi.md`, sinkronisasi EPIC-1/EPIC-3
- `7e34167` — CODEOWNERS (wajib review maintainer)
- `67c88ba` — perbaikan `_journal.json` migrasi Drizzle
- **Aksi maintainer:** merge PR #59, #60, #61 (reviewer/penggabung `main`)

### 2.3 Yang masih terbuka atas nama Afif

- `EPIC-0` #8 — status papan masih `Todo` padahal 6 kartu FND selesai → **harus di-close** (konsistensi).
- `#3` "Fondasi awal proyek, template, starter kit" — issue lama, perlu dibereskan/ditutup.

---

## 3. Scope A — Metodologi (Kanban) ✅ berjalan

| # | Deliverable | Status |
|---|---|---|
| A1 | Papan GitHub Project *Capstone - Gr30* (50 item) + peta kartu ↔ issue | ✅ |
| A2 | `docs/kanban/workflow.md` (kolom, WIP, DoR/DoD, MoSCoW, grey-out) | ✅ |
| A3 | `docs/kanban/backlog.md` (38 kartu + 6 grey-out + bukti) | ✅ (perlu update EV-01) |
| A4 | `docs/kanban/board.md` (snapshot, audit WIP, metrik) | 🔶 perlu update |
| A5 | `docs/kanban/temuan-inkonsistensi.md` (F1–F7) | ✅ |
| A6 | **Jaga irama mingguan**: pindahkan kartu sesuai realita, catat WIP/throughput/cycle time | 🔁 berkelanjutan |
| A7 | **Disiplin alur PR** — aktifkan kolom `Review / Verification` (belum pernah terisi) | 🚧 |
| A8 | **Rekap metrik aliran** untuk Bab IV | 🚧 |

---

## 4. Scope B — Teknis / Lead

| # | Deliverable | Status |
|---|---|---|
| B1 | Fondasi repo, tech stack, arsitektur (FND-01..05) | ✅ |
| B2 | RBAC 4 peran + route guard fail-closed (`guard.ts`, `permissions.ts`) | ✅ |
| B3 | Modul publik: landing page + statistik (LP-01/LP-02) | ✅ |
| B4 | **Review + merge semua PR**, jaga `main` protected, CODEOWNERS | 🔁 berkelanjutan |
| B5 | Bantu/koordinasi implementasi modul lain bila PIC-nya terhambat | opsional |
| B6 | Menjelang laporan akhir: pastikan app bisa dijalankan untuk **screenshot §4.2** | 🚧 |
| B7 | Penyelarasan dokumen hidup (`PROJECT.md`, `plan.md`) ke `laporan.md` | 🔶 sebagian |

> **Catatan:** kartu fitur modul (KP/EV/KU/SR) **bukan** tanggung jawab Afif — lihat §7.

---

## 5. Scope C — Penulisan Laporan (sub-bab)

Dari `pembagian.md` + panduan:

| Sub-bab | PIC | Status |
|---|---|---|
| 1.1 Latar Belakang | Afif | ✅ terisi |
| 1.2 Alternatif Solusi | Afif | ✅ terisi |
| 1.3 Perumusan Masalah | Afif | ✅ terisi |
| 3.1 Batasan Realistis | **Afif + Zidan** | 🔶 perlu koordinasi |
| 3.4 Batasan Asumsi | **Afif + Zidan** | ✅ terisi |
| Closing Bab III | **Afif + Zidan** | 🚧 |
| **§3.5 Mekanisme Perancangan (3.5.1–3.5.5)** | **Afif** — diambil alih 19 Okt | 🚧 **porting dari `laporan.md` §3.5** (tabel 11–13 sudah siap) + tambah **flowchart** |
| **§2.2.x Teori metodologi/Kanban** | **Afif** | ❌ TODO |
| **Bab IV §4.1 Proses Perancangan (Kanban)** | **Afif** | 🚧 (draft di `laporanRevisi.md`) |
| Bab IV §4.2 / §4.3 | **PIC modul** → dikumpulkan & distandarkan **Afif** | ❌ TODO |

---

## 6. Scope D — Artefak per Fitur (diagram + bagian bab)

> Ini kebutuhan "per fitur ada diagram + bab-nya". Bentuk pasti mengikuti §3.5.1 (Kanban) & Bab IV.
> Untuk **tiap modul**: Kependudukan · Surat-Menyurat · Kas RW · Kas RT · Iuran · Pengumuman/Event ·
> Landing/Dashboard.

| Artefak | Keterangan | PIC |
|---|---|---|
| **ERD global** (semua entitas) | sudah dirancang di `schema.ts` (12 tabel) | **Afif** |
| **Template & standar diagram** (penomoran `Gambar 3.x`, gaya) | dipakai seragam semua PIC | **Afif** |
| **Use Case Diagram** per modul | aktor: admin_rw, pengurus_rt, bendahara, warga | **PIC modul** |
| **Activity/Flowchart** per alur kritis (pengajuan surat, pembayaran iuran, input kas, dll.) | contoh laporan punya "Alur Pengajuan & Persetujuan Surat" (Gambar 3.1) dst. | **PIC modul** |
| **Sequence Diagram** alur kritikal | opsional, tergantung kebutuhan | **PIC modul** |
| **RBAC matrix** | sudah ada di docx §3.3 | ✅ |
| **Spesifikasi fungsional (SF-*)** | sudah ada di `laporan.md` §3.3.4 | ✅ |
| **Bab IV §4.2** screenshot + fungsi tiap halaman | per modul | **PIC modul** (dirapikan Afif) |
| **Bab IV §4.3** tabel verifikasi per modul + test case | per modul | **PIC modul** (dirapikan Afif) |

> **Keputusan 19 Okt 2026:** PIC modul membuat diagram modulnya masing-masing; Afif menyediakan
> **template + standar** (penomoran, gaya) lalu menyeragamkan. **ERD global + template** dipegang Afif.
> **Bab IV §4.2/§4.3** diisi PIC modul, lalu dikumpulkan & dirapikan Afif.

---

## 7. Bukan Scope Afif (batas)

- Implementasi kartu fitur modul: `KP-*` (Josua), `EV-*` (Alizha), `KU-*` (Safira), `SR-*` (Zidan).
- Bab V (biaya/kelayakan) = **Safira**; Bab VI–VII = **Zidan** — rincian di `pembagian-tugas.md`.
- Data mitra / narasumber / koordinasi eksternal (Zidan).
- Penulisan sub-bab teori spesifik: UI/UX (Shaffira), keamanan (Alizha), data (Josua), SW eng (Zidan).

---

## 8. Urutan Pengerjaan (dikonfirmasi: semua dikerjakan)

1. **§3.5.1–3.5.5 (proposal)** — ** bukan tulis dari nol**: isi sudah lengkap di `laporan.md` §3.5
   (Tabel 11–13). Sisa: **buat flowchart §3.5.1** + rapikan penomoran tabel/judul → pindah ke docx.
2. ~~**Rapikan papan**: tutup `EPIC-0` #8; update `backlog.md`/`board.md` (EV-01 sudah Done).~~ ✅ **selesai 19 Okt**
3. **Bab IV §4.1** (proses Kanban) — draft ada di `laporanRevisi.md`, sesuaikan ke §3.5.1.
4. **Sediakan template & standar diagram** → teruskan ke PIC modul.
5. **Aktifkan alur PR/review** (Afif = reviewer wajib) supaya kolom `Review/Verification` terpakai.
6. **Kumpulkan & seragamkan §4.2/§4.3 + diagram** dari PIC modul saat modul tuntas.
7. **Manfaatkan data wawancara mitra** (RW 06) yang sudah ada → isi/verifikasi §3.5.2 & §3.5.3, dan
   nanti §6.1 Validasi. Data ini dipegang Zidan (PIC narasumber).

---

## 9. Keputusan Scope (19 Okt 2026)

| # | Pertanyaan | **Keputusan** |
|---|---|---|
| Q1 | Penulis §3.5 | **Afif mengambil alih §3.5.1–3.5.5.** Zidan tetap di 3.1/3.4 (bersama Afif) + closing Bab III. |
| Q2 | Cakupan Bab IV | **Afif tulis §4.1**; **mengkoordinasikan & merapikan §4.2/§4.3** yang diisi PIC modul. |
| Q3 | Diagram per fitur | **PIC modul** bikin diagram modulnya; **Afif** sediakan template/standar + ERD global, lalu seragamkan. |
| Q4 | Gate PR | **Ya — semua PR wajib lewat Afif** sampai UAT. |
| Q5 | Prioritas | **Kerjakan semua** (lihat urutan di §8). |
| Q6 | Bab V (§5.1–5.3) | Belum ditetapkan — usul: **Safira (PIC laporan)**; perlu dikonfirmasi. |

---

## 10. Tracker

| Item | Status |
|---|---|
| Papan Kanban + dokumen aturan | ✅ |
| Landing page + statistik publik | ✅ |
| Fondasi & RBAC | ✅ |
| §1.1–1.3 laporan | ✅ |
| §3.5.1–3.5.5 (proposal) | 🚧 porting `laporan.md` → docx + flowchart |
| Bab IV §4.1 Kanban | 🚧 (draft) |
| Artefak diagram per fitur | ❌ TODO |
| Alur PR/review aktif | 🚧 |
| Sinkron papan (EPIC-0, EV-01) | ❌ TODO |
