# Peta Dokumen SI-RW

> **Satu pintu masuk untuk semua `.md`.** Bingung mulai dari mana? Cari barismu di tabel 1.
> **Aturan emas:** isi laporan → `laporan/laporan.md` menang atas file lain.

## 1. Saya mau… (mulai dari sini)

| Saya mau… | Buka |
|---|---|
| Menjalankan aplikasi | `../README.md` |
| Paham produk, scope, prioritas MVP | `../PROJECT.md` |
| Tahu fitur apa sudah jadi / belum | `kanban/backlog.md` |
| Tahu siapa mengerjakan apa | `tim/pembagian-tugas.md` |
| Menulis / menyalin bab laporan ke Word | `laporan/README.md` (peta salin per bab) |
| Membaca isi laporan resmi | `laporan/laporan.md` |
| Membuat diagram laporan | `laporan/diagram-prompts.md` |
| Menyiapkan rapat dengan mitra | `stakeholder/checklist.md` + `stakeholder/konfirmasi-stakeholder.md` |
| Memakai AI assistant di repo ini | `../CLAUDE.md` (= `../AGENTS.md`) |
| Akun demo untuk login | `../credentials.md` (tidak di-commit) |

## 2. Hierarki otoritas

```
laporan/laporan.md          ← 1. isi & scope (menang atas semuanya)
   ├─ ../PROJECT.md         ← 2. ringkasan produk, diselaraskan ke laporan
   ├─ kanban/backlog.md     ← 3. status fitur aktual (bukti kode)
   └─ lainnya               ← 4. pendukung / draft / catatan kerja
```

Bertentangan? Naik satu tingkat. Temuan pertentangan dicatat di `kanban/temuan-inkonsistensi.md`.

## 3. Semua dokumen, per kelompok

Status: 🟢 aktif · 🟡 draft / kerangka · ⚪ referensi · 🔴 usang (jangan jadi acuan)

**A. Produk & kode** (root)

| File | Isi | |
|---|---|---|
| `README.md` | cara menjalankan, role, stack | 🟢 |
| `PROJECT.md` | ringkasan produk, aktor, MVP | 🟢 |
| `CLAUDE.md` · `AGENTS.md` | konvensi AI assistant (isi sama, jaga tetap sinkron) | 🟢 |
| `credentials.md` | akun demo (di-gitignore) | 🟢 |

**B. Laporan akademik** (`laporan/`)

| File | Isi | |
|---|---|---|
| `laporan.md` ⭐ | laporan lengkap Bab I–VII, **otoritas** | 🟢 (besar: ~92 KB, cari lewat heading) |
| `bab4-proses-perancangan.md` | Bab IV §4.1 siap salin + kerangka §4.2/§4.3 | 🟡 |
| `bab3-5-mekanisme.md` | sisa pekerjaan §3.5 (gambar flowchart) | 🟡 |
| `diagram-prompts.md` | prompt AI untuk semua diagram | 🟢 |
| `README.md` | peta salin tiap bab ke Word + alur kerja | 🟢 |
| `referensi/daftar-pustaka.md` | daftar pustaka final (APA 7) | 🟢 |
| `referensi/analisis-panduan.md` | kepatuhan ke panduan dosen | ⚪ |
| `referensi/contohlaporan.md` | contoh laporan lain (~136 KB, jangan dibaca utuh) | ⚪ |

Dokumen Word resmi: `C:\Users\Afif\OneDrive\Kuliah\Semester 7\Capstone\Capstone_Kelompok_30.docx` (di luar repo).

**C. Manajemen proyek / Kanban** (`kanban/`)

| File | Isi | |
|---|---|---|
| `backlog.md` ⭐ | 68 item (61 Done · 4 Todo · 3 Won't) + bukti kode | 🟢 |
| `workflow.md` | aturan: kolom, WIP, DoR/DoD, MoSCoW | 🟢 |
| `board.md` | snapshot papan GitHub + metrik | ⚪ riwayat |
| `temuan-inkonsistensi.md` | temuan F1–F7 | ⚪ |
| `README.md` | peta Epic ↔ PIC ↔ GitHub | 🟢 |

**D. Mitra / stakeholder** (`stakeholder/`)

| File | Isi | |
|---|---|---|
| `checklist.md` | katalog kebutuhan untuk dipilih bersama mitra | 🟢 |
| `permintaan-stakeholder.md` | ledger permintaan mitra & dosen | 🟢 |
| `konfirmasi-stakeholder.md` | asumsi yang harus dikonfirmasi mitra | 🟢 |

**D2. Tim** (`tim/`)

| File | Isi | |
|---|---|---|
| `pembagian-tugas.md` | pembagian tugas semua anggota | 🟢 |
| `afifscope.md` | scope kerja Afif | 🟢 |

**E. Lain-lain**

| Lokasi | Isi | |
|---|---|---|
| `design-preview/` | pratinjau desain landing page (Opsi A/B/C) | ⚪ |
| `arsip/` | `plan`, `laporanRevisi`, `planAfif`, `pembagian`, `List feature fix.*` | 🔴 |

## 4. Aturan rumah

- Tulis draft bab di `laporan/bab*.md`; edit `laporan.md` hanya setelah disetujui tim.
- Status fitur hanya dicatat di `kanban/backlog.md` (jangan salin ke file lain).
- Dokumen baru: daftarkan di tabel 3 dan beri status. Dokumen usang: pindah ke `arsip/`.
