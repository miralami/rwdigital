# Register Keputusan — RW Digital

> **Satu-satunya tempat keputusan lintas dokumen.** Kalau sebuah keputusan berubah, ubah **di sini
> dulu**, lalu tulis usulan prosanya di `laporan/laporan.md` (cermin docx) → tempel ke Word. Dokumen lain (`bab4-plan.md`,
> `strategi-dokumentasi.md`, `PROJECT.md`, `kanban/*`) **hanya merujuk ID** (`K-03`), tidak
> menyalin isinya.
>
> Status: ✅ final · ⏳ menunggu pihak lain · 🔁 diganti (lihat entri pengganti).

## Ringkasan

| ID | Topik | Keputusan singkat | Status | Diturunkan ke |
|---|---|---|---|---|
| K-01 | Judul laporan | *Rancang Bangun RW Digital … Menggunakan Metode Kanban (Studi Kasus RW 06)* | ⏳ pembimbing | `laporan.md` judul |
| K-02 | Istilah | **SI-RW** = konsep · **RW Digital** = produk · "rancang bangun" | ✅ | §2.2.1 |
| K-03 | Metodologi | **Kanban** (GitHub Projects) + **MoSCoW**; I&I dibatalkan 6 Nov | ✅ | §2.2.4, §3.5.1, 4.1 |
| K-04 | Rilis | 3 rilis nyata (bukan iterasi); pemicu = umpan balik mitra + evaluasi tim → kartu baru | ✅ | §3.5.1, 4.1.3 |
| K-05 | Keterlibatan mitra | Mitra RW 06 terlibat intensif; regulasi = dasar scope awal saja | ✅ | §3.1 butir 2 |
| K-06 | WIP limit | 1–2 kartu/orang, ≤ 10/papan; diaudit, ada pelanggaran awal | ✅ | §2.2.3.2, §3.5.1, 4.1.3d |
| K-07 | Pengujian | **CI + Black Box**; tanpa klaim peer review | ✅ | §3.5.1, 4.1.4, 4.3 |
| K-08 | UAT | Dengan pengurus RW 06, 23–24 Nov 2026 | ✅ | 4.1.6, Bab VI |
| K-09 | Lokasi artefak Bab IV | Pemodelan di 4.1.2 (a–j, tanpa state machine); FR/NFR di 4.1.1d–e; 4.2 screenshot; 4.3 verifikasi | ✅ | Bab IV |
| K-10 | Pembagian kerja | Per artefak, bukan per fitur; pemilik domain ≠ penulis kode | ✅ | 4.1, `pembagian-tugas.md` |
| K-11 | Tenggat Bab IV | 26 Nov 2026 (buffer submit 27 Nov) | ✅ | jadwal |
| K-12 | Figma | Tidak klaim Figma; sementara `design-preview/`, reverse engineer menyusul | ✅ | 4.1.2 |
| K-13 | Batas Bab III vs IV | Bab III = spesifikasi terukur + mekanisme; diagram, flow, UI/UX, tabel NFR rinci, matriks RBAC → Bab IV | ⏳ tim | Bab III, 4.1.1e, 4.1.2e/i/j |
| K-14 | Aktor sistem | Aktor = peran di kode: **Publik, Warga, Pengurus RT, Pengurus RW** (+ Midtrans sekunder); Bendahara & `admin_rw` → Pengurus RW | ✅ | `laporan/bab4-plan.md` §7.1, 4.1.1a, 4.1.2c–j, 4.3 |

---

## K-01 · Judul laporan ⏳

**Usulan (diperbarui 6 Nov 2026, kembali ke Kanban):**

> RANCANG BANGUN RW DIGITAL: SISTEM INFORMASI ADMINISTRASI RUKUN WARGA BERBASIS WEB MENGGUNAKAN
> METODE KANBAN (STUDI KASUS: RW 06 KELURAHAN KOTA BARU, KOTA BEKASI)

- Berangkat dari judul proposal *SISTEM INFORMASI RW MENGGUNAKAN METODOLOGI KANBAN*; yang ditambah
  hanya "rancang bangun", nama produk, dan studi kasus. Usulan judul I&I (5 Nov) **dibatalkan** (K-03).
- **Menunggu persetujuan pembimbing.** Kalau ditolak → pakai judul proposal apa adanya.
- "Rancang bangun", bukan "pengembangan" (sistem dibuat dari nol) dan bukan "perancangan" (ada
  kode). Tambah "dan Implementasi" **hanya** kalau sistem benar-benar dipakai mitra sebelum sidang.

## K-02 · Istilah ✅

| Istilah | Dipakai untuk | Letak |
|---|---|---|
| **SI-RW** | Konsep sistem informasi tingkat RW secara umum | Teori Bab II, analisis alternatif Bab I |
| **RW Digital** | Produk kita (sama dengan `short_name` di manifest PWA) | Judul, Bab III–IV, screenshot, studi kasus |
| Rancang bangun | Analisis → desain → implementasi → pengujian dari nol | Judul |

## K-03 · Metodologi ✅ (diubah 6 Nov 2026)

**Kanban** pada GitHub Projects adalah metode perancangan; **MoSCoW** untuk prioritisasi.
Framing *Iterative and Incremental Development* (5 Nov) **dibatalkan**: kembali ke metode proposal.

- **Tahap rekayasa perangkat lunak** (analisis → desain → implementasi → verifikasi → integrasi →
  validasi) dipetakan ke **kolom papan** (Backlog → Todo/Ready → In Progress → Review/Verification →
  Done), bukan ke fase berurutan.
- **Perubahan kebutuhan** (revisi mitra, rombakan Kas) masuk lewat **umpan balik Kanban**: temuan
  menjadi kartu baru di Backlog; kartu Done tidak dibuka ulang (`kanban/workflow.md` §7).
- **Praktik inti yang diklaim** (Anderson, 2010; Anderson & Carmichael, 2016) dan buktinya:

| Praktik Kanban | Wujud di proyek | Bukti (screenshot GitHub Projects/repo) |
|---|---|---|
| Visualisasi alur kerja | 5 kolom papan, 1 Issue = 1 kartu, 6 Epic | Tampilan *Board* |
| Batasi WIP | 1–2 kartu/orang, ≤ 10/papan (K-06) | *Board* dikelompokkan per *Assignee*; audit `board.md` |
| Kelola aliran | Cuplikan distribusi papan; *throughput* per rilis | *Insights* (grafik status terhadap waktu) |
| Kebijakan eksplisit | DoR, DoD, konvensi branch/PR | `workflow.md`, deskripsi kolom, templat Issue |
| Umpan balik | Demo ke mitra → kartu revisi; CI di setiap PR | Issue berlabel `req-stakeholder`; tab *Checks* PR |
| Perbaikan bertahap | Rombakan Kas A→B→C; perbaikan disiplin PR | Riwayat PR #62, #64, #65, #94 |

**Kalimat kunci** (pakai di §3.5.1 dan Bab IV):

> Perancangan RW Digital dikelola dengan metode Kanban pada GitHub Projects. Setiap kebutuhan
> dicatat sebagai kartu yang mengalir dari Backlog hingga Done, dengan batas pekerjaan dalam proses
> dan kebijakan perpindahan kolom yang eksplisit. Umpan balik pengurus RW 06 dan evaluasi tim dicatat
> sebagai kartu baru di Backlog, sehingga perubahan kebutuhan masuk ke aliran kerja tanpa
> menghentikan pengembangan. Papan Kanban diadopsi pada minggu ketiga (12 Oktober 2026); pekerjaan
> sebelumnya direkonstruksi sebagai kartu *Done*.

**Kenapa bukan yang lain:**

| Opsi | Bukti yang kita punya | Risiko klaim |
|---|---|---|
| **Kanban** (dipakai) | Papan GitHub Projects, MoSCoW, WIP, DoR/DoD, PR + CI, kartu revisi mitra | Rendah; wajib jujur soal adopsi minggu ke-3 |
| I&I + Kanban | Sama, ditambah label "iterasi" | Dibatalkan 6 Nov: menambah teori model proses yang tidak ada di proposal |
| Scrum | Tidak ada sprint planning/review/retro, PO/SM | **Tinggi** — harus mengarang artefak |
| Waterfall | Terbantah: 12.229 baris kode 28 Sep, dokumen desain menyusul | **Sangat tinggi** |

**Jangan:** menyebut Scrum, "sprint", "iterasi" sebagai model proses, atau "Kanban sejak hari
pertama". Label GitHub `iterasi-2` boleh disebut sebagai nama label historis.

## K-04 · Rilis ✅ (diubah 6 Nov 2026)

Tiga titik rilis = batch kartu yang selesai lalu diperagakan ke mitra (*delivery*), **bukan** iterasi.

| Rilis | Periode | Fokus | Kartu utama |
|---|---|---|---|
| 1 | 25 Sep – 20 Okt | MVP: kependudukan, kas, iuran, surat, pengumuman, landing, portal. Papan diadopsi 12 Okt; 21 kartu direkonstruksi | `KP-A..E`, `KU-A..`, `SR-A..`, `EV-A`, `LP-01/02`, `FND-06` |
| 2 | 27–28 Okt | Penyempurnaan keuangan & portal (label GitHub `iterasi-2`) | `KU-01b`, `KU-02b`, `KP-06`, `KP-07`, `SR-02b`, `LP-03`, `FND-07`, `T0-01`, `T0-02` |
| 3 | 2–3 Nov | RBAC, notifikasi, KK-first, iuran 2 tingkat, TTD | `FND-08`, `FND-09`, `KP-08`, `KU-05`, `SR-06`, `EV-04` |

Status papan 3 Nov: **61 Done · 0 In Progress · 4 Todo · 3 Won't** (68 item).

**Pemicu kartu revisi** (umpan balik Kanban; wajib muncul di 4.1.3):
- Revisi mitra RW 06: alur iuran 2 tingkat, KK-first, TTD RT.
- Evaluasi tim: modul Kas — implementasi awal **belum berfungsi dan tidak sesuai** alur kas yang dibutuhkan.

**Bukti rombakan Kas** (contoh terkuat perbaikan bertahap lewat kartu baru, bukan membuka kartu lama):

| Versi | Commit / PR | Rancangan |
|---|---|---|
| A | `6162e8f` (#62, 28 Okt) | Kas RT mandiri + rekap iuran RT + Midtrans |
| B | `300c14d`, `6aaabcd` (#64), `62da849` / `40d3f9c` (#65 / #85) | Setoran porsi RW dari RT ke Kas RW + rekonsiliasi |
| C | `2a1a30c` (2 Nov) | Satu payment gateway ke RW; UI Kas RT disembunyikan, pembagian ke RT manual |

Alasan: ruang lingkup kas ambigu (RT saja / RW saja), dan payment gateway terpisah per RT tidak layak.

**Framing adopsi:** *"Papan Kanban diadopsi pada minggu ketiga (commit `17da42b`, 12 Oktober 2026);
21 kartu berstatus Done pada Rilis 1 merupakan rekonstruksi as-is."*

## K-05 · Keterlibatan mitra ✅

Pengurus RW 06 **dapat dilibatkan secara intensif** (wawancara, observasi, pembahasan hasil tiap
rilis). Framing lama "mitra tidak dapat diwawancarai" adalah kondisi awal dan **tidak dipakai
lagi**. Batasan yang jujur: kebutuhan belum bisa dirumuskan lengkap di awal, sehingga scope awal
disusun dari regulasi (UU 6/2014, Permendagri 18/2018, Perwali Bekasi 58/2020) + plausibility, lalu
divalidasi dan direvisi bersama mitra.

## K-06 · WIP limit ✅

- Aturan: **1–2 kartu `In Progress` per orang**, **≤ 10 per papan** (`kanban/workflow.md` §4).
- Bukti: audit `kanban/board.md` §3 — kondisi awal Josua memegang 3 kartu (pelanggaran) → direkonsiliasi.
- Tulis sebagai **aturan + temuan audit**, bukan klaim "selalu patuh".

## K-07 · Pengujian ✅

**CI + Black Box saja.** CI (`.github/workflows/ci.yml`): `check` → 100 unit test → `build` → 8 e2e
Playwright. Black Box per modul. **Tidak** ada klaim peer code review manual; PR diverifikasi lewat
CI. Bukti run CI (screenshot/log) dilampirkan saat menulis 4.1.4a.

## K-08 · UAT ✅

Dengan pengurus RW 06, **23–24 Nov 2026**, penghubung Zidan. Berita acara + rekap temuan; SUS
sebagai pelengkap. Jangan menulis hasil UAT sebelum UAT terjadi.

## K-09 · Lokasi artefak Bab IV ✅

Semua pemodelan (UML, ERD, BPMN, arsitektur) di **4.1.2** sebagai sub-butir a–j (TOC maks 3
tingkat). FR & NFR seluruhnya di **4.1.1d–e**; §3.3.4 cukup paragraf rujukan. 4.2 = screenshot
saja. 4.3 = verifikasi per modul.

## K-10 · Pembagian kerja ✅

Per **artefak**, bukan per fitur (detail: `laporan/pembagian-tugas.md`, `bab4-plan.md` §7).
Pemilik domain ≠ penulis kode: *"Kepemilikan domain mencakup definisi kebutuhan, validasi, dan
pengujian modul; implementasi kode terpusat pada lead teknis karena batasan waktu."*
(Bukti per orang: `strategi-dokumentasi.md` §3.2.)

## K-11 · Tenggat ✅

Bab IV: **26 Nov 2026** (buffer submit 27 Nov). Jadwal rinci: `bab4-plan.md` §8.

## K-12 · Figma ✅

Tidak mengklaim Figma. Sementara pakai `docs/design-preview/`; reverse engineer ke Figma menyusul.

## K-13 · Batas Bab III vs Bab IV ⏳

**Usulan (5 Nov 2026), acuan Panduan Rev 1.3 hlm. 49–53 + contoh laporan:**

- Bab III **tetap** memuat *Spesifikasi Rancangan* (panduan mewajibkan), tetapi sebagai spesifikasi
  **terukur** (Tabel 3.2–3.4: fungsional per modul, non-fungsional `SP-01..15` dengan target, teknis).
- Yang keluar dari Bab III → Bab IV: alur/flow (Gambar 3.1–3.4 lama → 4.1.2e Activity), spesifikasi
  UI/UX (→ 4.1.2i), tabel `NFRS`/`NFRA` (→ 4.1.1e), matriks RBAC (→ 4.1.2j), nama berkas kode
  (`permissions.ts`, `guard.ts`, `hooks.server.ts`) dari Bab II–III.
- §3.5 dilengkapi subbab wajib panduan: 3.5.1 sistematika (flowchart + loop), 3.5.2 pengumpulan data,
  3.5.3 V&V, 3.5.4 timeline M5–M15, 3.5.5 komponen sistem terintegrasi.
- Detail Kanban (kolom, WIP) pindah dari §2.2.4.2 (teori) ke §3.5.1 (mekanisme).
- Surat-menyurat = Core (§3.1 lama keliru menyebutnya di luar scope).
- **Menunggu** persetujuan tim (Shaffira: UI/UX, Alizha: keamanan/RBAC, Josua: data) karena bagian
  mereka bergeser ke Bab IV.

## K-14 · Aktor sistem ✅

**Diputuskan 6 Nov 2026.** Aktor di semua artefak Bab IV (diagram, FR, use case, black box) =
peran yang ada di aplikasi (`src/lib/akses.ts`), karena screenshot, black box, dan UAT dilakukan di
aplikasi itu:

- **Publik** (tanpa login), **Warga** (`warga`), **Pengurus RT** (`pengurus_rt`), **Pengurus RW**
  (`pengurus_rw`); **Midtrans** sebagai aktor sekunder (*payment gateway*).
- **Bendahara** bukan aktor terpisah: tugas keuangan dijalankan dengan akun Pengurus RW (atau peran
  kustom lewat *Peran & Izin*). Di narasi boleh disebut "bendahara RW".
- **`admin_rw`** (istilah lama Bab III, matriks RBAC 4.1.2j) = Pengurus RW.
- **Superadmin** tidak digambar (peran ada, akun belum dibuat).

Daftar UC-ID dan aktor per UC: `laporan/bab4-plan.md` §7.1. Tindak lanjut: matriks RBAC 4.1.2j
disesuaikan ke empat peran ini (Afif).

---

## Sisa tindakan (bukan keputusan)

1. Konfirmasi judul (K-01) ke pembimbing.
2. Konfirmasi nama PIC di `bab4-plan.md` §7 (terutama Josua & Safira).
3. Lampirkan bukti run CI (K-07).
4. Jadwalkan UAT (K-08) lewat Zidan.
5. **Draf repo yang belum ada di Word** (per tarikan 5 Nov 2026; teks lengkap:
   `git show ac01721:docs/laporan/laporan.md`). Putuskan mana yang masuk docx:
   - Judul baru (K-01) — docx masih `(Judul)`
   - §1.2.1–1.2.3 (Fishbone, solusi, solusi dipilih) · §1.3 Perumusan Masalah
   - §2.2.1 SI-RW · §2.2.2 PWA · §2.2.4 Kanban / MoSCoW (K-03) · §2.2.6 UML & ERD · §2.2.7 tech stack & pengujian
   - §3.2.1 regulasi lembaga kemasyarakatan · §3.3.4 Spesifikasi Fungsional
   - §3.5.1–3.5.5 (docx masih punya versi lama §3.5 tanpa subbab) · §3.1 butir 2 (K-05)
   - Daftar Pustaka (+ Larman & Basili 2003)
   - Sebaliknya, docx punya §2.2.3 "Teori Software Engineering dan Arsitektur Perangkat Lunak" yang tidak ada di draf repo.
6. Docx berisi **daftar isi berulang** (±3 blok TOC di awal) — rapikan di Word.
