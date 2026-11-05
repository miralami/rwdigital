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
| K-01 | Judul laporan | *Rancang Bangun RW Digital … Iterative and Incremental Development (Studi Kasus RW 06)* | ⏳ pembimbing | `laporan.md` judul |
| K-02 | Istilah | **SI-RW** = konsep · **RW Digital** = produk · "rancang bangun" | ✅ | §2.2.1 |
| K-03 | Metodologi | **I&I** (model proses) + **Kanban** (manajemen kerja) + **MoSCoW** | ✅ | §2.2.3, §3.5.1 |
| K-04 | Iterasi | 3 iterasi nyata; pemicu = umpan balik mitra + evaluasi tim | ✅ | §3.5.1, 4.1.3 |
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

**Usulan (5 Nov 2026):**

> RANCANG BANGUN RW DIGITAL: SISTEM INFORMASI ADMINISTRASI RUKUN WARGA BERBASIS WEB MENGGUNAKAN
> METODE ITERATIVE AND INCREMENTAL DEVELOPMENT (STUDI KASUS: RW 06 KELURAHAN KOTA BARU, KOTA BEKASI)

- Menggantikan: *SISTEM INFORMASI RW MENGGUNAKAN METODOLOGI KANBAN* (Kanban = manajemen alur kerja,
  bukan model proses).
- **Menunggu persetujuan pembimbing.** Kalau ditolak → kembali ke judul lama, tambahkan klausa di
  abstrak: *"dengan Kanban sebagai metode pengelolaan alur kerja dalam siklus iteratif-incremental"*.
- "Rancang bangun", bukan "pengembangan" (sistem dibuat dari nol) dan bukan "perancangan" (ada
  kode). Tambah "dan Implementasi" **hanya** kalau sistem benar-benar dipakai mitra sebelum sidang.

## K-02 · Istilah ✅

| Istilah | Dipakai untuk | Letak |
|---|---|---|
| **SI-RW** | Konsep sistem informasi tingkat RW secara umum | Teori Bab II, analisis alternatif Bab I |
| **RW Digital** | Produk kita (sama dengan `short_name` di manifest PWA) | Judul, Bab III–IV, screenshot, studi kasus |
| Rancang bangun | Analisis → desain → implementasi → pengujian dari nol | Judul |

## K-03 · Metodologi ✅

- **Model proses:** Iterative and Incremental Development (Larman & Basili, 2003; Pressman & Maxim, 2020).
  *Incremental* = modul dibangun dan diintegrasikan bertahap. *Iterative* = implementasi yang sudah
  ada dievaluasi dan dirombak bila perlu (bukan sekadar bug fixing).
- **Manajemen kerja:** Kanban di GitHub Projects (issue = kartu, PIC, feature branch + PR, CI).
- **Prioritisasi:** MoSCoW.

**Kalimat kunci** (sudah ada di `laporan.md` §3.5.1, pakai versi ini di Bab IV):

> Perancangan RW Digital dilaksanakan dalam siklus *iterative and incremental*. Setiap iterasi
> menghasilkan penambahan atau penyempurnaan fitur yang tetap berfungsi. Arah setiap iterasi
> ditentukan oleh umpan balik pengurus RW 06 dan evaluasi internal tim terhadap hasil iterasi
> sebelumnya. Di dalam setiap iterasi, alur kerja dikendalikan melalui papan Kanban. Kanban
> diadopsi pada minggu ketiga dan menjadi alat kendali utama sejak Iterasi 2.

**Kenapa bukan yang lain:**

| Opsi | Bukti yang kita punya | Risiko klaim |
|---|---|---|
| **I&I + Kanban** (dipakai) | Papan GitHub Projects, MoSCoW, WIP, 3 iterasi nyata, revisi arsitektur Kas | Rendah |
| Kanban saja | Sama, tapi iterasi 2/3 dan rombakan Kas tidak punya tempat | Rendah, tapi lemah |
| Scrum | Tidak ada sprint planning/review/retro, PO/SM | **Tinggi** — harus mengarang artefak |
| Waterfall | Terbantah: 12.229 baris kode 28 Sep, dokumen desain menyusul | **Sangat tinggi** |
| Staged delivery ("1 iterasi, banyak inkremen") | Terbantah: Kas yang sudah jadi dirombak 2× | Tinggi |

**Jangan:** menyebut Scrum/Agile formal, "sprint", atau "Kanban sejak hari pertama"; menyebut
Waterfall hanya karena urutan Bab I–VII linear.

## K-04 · Iterasi ✅

| Iterasi | Periode | Fokus | Kartu utama |
|---|---|---|---|
| 1 | 25 Sep – 20 Okt | MVP: kependudukan, kas, iuran, surat, pengumuman, landing, portal. Papan Kanban diadopsi 12 Okt; 21 kartu direkonstruksi | `KP-A..E`, `KU-A..`, `SR-A..`, `EV-A`, `LP-01/02`, `FND-06` |
| 2 | 27–28 Okt | Penyempurnaan keuangan & portal | `KU-01b`, `KU-02b`, `KP-06`, `KP-07`, `SR-02b`, `LP-03`, `FND-07`, `T0-01`, `T0-02` |
| 3 | 2–3 Nov | RBAC, notifikasi, KK-first, iuran 2 tingkat, TTD | `FND-08`, `FND-09`, `KP-08`, `KU-05`, `SR-06`, `EV-04` |

Status papan 3 Nov: **61 Done · 0 In Progress · 4 Todo · 3 Won't** (68 item).

**Pemicu iterasi** (wajib muncul di 4.1.3a–c supaya klaim I&I punya sebab):
- Revisi mitra RW 06: alur iuran 2 tingkat, KK-first, TTD RT.
- Evaluasi tim: modul Kas — implementasi awal **belum berfungsi dan tidak sesuai** alur kas yang dibutuhkan.

**Bukti rombakan Kas** (contoh terkuat bahwa iterasi menyentuh arsitektur, bukan bug fixing):

| Versi | Commit / PR | Rancangan |
|---|---|---|
| A | `6162e8f` (#62, 28 Okt) | Kas RT mandiri + rekap iuran RT + Midtrans |
| B | `300c14d`, `6aaabcd` (#64), `62da849` / `40d3f9c` (#65 / #85) | Setoran porsi RW dari RT ke Kas RW + rekonsiliasi |
| C | `2a1a30c` (2 Nov) | Satu payment gateway ke RW; UI Kas RT disembunyikan, pembagian ke RT manual |

Alasan: ruang lingkup kas ambigu (RT saja / RW saja), dan payment gateway terpisah per RT tidak layak.

**Framing Kanban (4.1.3d):** *"Kanban diadopsi pada minggu ketiga (commit `17da42b`) dan menjadi
alat kendali utama sejak Iterasi 2; 21 kartu berstatus Done pada Iterasi 1 merupakan rekonstruksi as-is."*

## K-05 · Keterlibatan mitra ✅

Pengurus RW 06 **dapat dilibatkan secara intensif** (wawancara, observasi, pembahasan hasil tiap
iterasi). Framing lama "mitra tidak dapat diwawancarai" adalah kondisi awal dan **tidak dipakai
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
   - §2.2.1 SI-RW · §2.2.2 PWA · §2.2.3 I&I / Kanban / MoSCoW (K-03) · §2.2.6 UML & ERD · §2.2.7 tech stack & pengujian
   - §3.2.1 regulasi lembaga kemasyarakatan · §3.3.4 Spesifikasi Fungsional
   - §3.5.1–3.5.5 (docx masih punya versi lama §3.5 tanpa subbab) · §3.1 butir 2 (K-05)
   - Daftar Pustaka (+ Larman & Basili 2003)
   - Sebaliknya, docx punya §2.2.3 "Teori Software Engineering dan Arsitektur Perangkat Lunak" yang tidak ada di draf repo.
6. Docx berisi **daftar isi berulang** (±3 blok TOC di awal) — rapikan di Word.
