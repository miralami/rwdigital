# Kanban SI-RW

Titik masuk penerapan Kanban untuk proyek SI-RW.

**Otoritas tertinggi: `docs/laporan/laporan.md`.**

| Dokumen | Isi |
|---|---|
| `workflow.md` | Aturan operasional: kolom, kriteria transisi, WIP limit, DoR/DoD, MoSCoW, konvensi Git, grey-out, prosedur back-fill |
| `backlog.md` | Status kartu aktual: 68 item (61 Done · 4 Todo · 3 Won't) + Epic + PIC + bukti kode |
| `board.md` | Snapshot papan, audit WIP, metrik awal, kondisi papan terpasang + peta kartu ↔ issue |
| `../stakeholder/permintaan-stakeholder.md` | Ledger permintaan customer/mitra & dosen per iterasi + peta ke issue (label `req-stakeholder`, `iterasi-2`) |
| `temuan-inkonsistensi.md` | Temuan F1–F7 & arah penyelesaian |

Revisi laporan yang sudah tidak dipakai: `docs/arsip/laporanRevisi.md`.

## Epic ↔ PIC

| Epic | Lintas Kerja | PIC | GitHub |
|---|---|---|---|
| `EPIC-0` | Fondasi & Infrastruktur | Afif | `miralami` |
| `EPIC-1` | Publik, Landing Page & Profil RW | Afif | `miralami` |
| `EPIC-2` | Informasi, Event & Humas | Alizha | `alizha13` |
| `EPIC-3` | Keluarga (KK) & Dashboard Internal | Josua | `josuasahat` |
| `EPIC-4` | Keuangan, Kas RT & Iuran | Safira | `shaffiraindanazulfa` |
| `EPIC-5` | Surat-Menyurat | Zidan | `elfarizidan` |

> **Aturan assignee:** PIC = pemilik Epic untuk pekerjaan **upcoming** (`Todo`/`In Progress`/`Backlog`).
> Seluruh kartu **`Done` (as-is)** di-assign ke **Afif (`miralami`)** karena kode eksisting
> dikerjakan Afif; ini murni *back-fill* histori. Grey-out `W-01..W-06` dibiarkan tanpa assignee.

## Status papan (terpasang, per 3 Nov 2026)

`Done` 61 · `In Progress` 0 · `Todo` 4 · `Won't` 3 (**total 68 item**)

> Snapshot saat papan dipasang (12 Okt): `Done` 21 · `In Progress` 8 · `Todo` 15 · `Won't` 6 (**50 item**).
> Riwayat perpindahan ada di `board.md` §5.1. Angka di laporan harus memakai baris pertama.

## Kebijakan Issue

Repositori ini **tidak memakai fitur GitHub Issue untuk diskusi/tugas lepas**. Setiap Issue = **satu
kartu Kanban** (terhubung ke Project *Capstone - Gr30*). Issue yang bukan kartu papan tidak dibuat; bila
ada yang tertinggal, ditutup/dibuang. Konvensi judul kartu: `[T<layer>][moscow] <KODE> - <ringkas>`.

## Urutan langkah

1. ~~Bangun GitHub Project + Issues.~~ ✅ Papan **Capstone - Gr30** sudah terisi (lihat `board.md` §5).
2. Jalankan irama mingguan; isi metrik aliran di Bab IV.
3. Status kartu diperbarui di `backlog.md` + `board.md` setiap ada perubahan nyata.

> Catatan: seluruh artefak ini **dokumentasi saja** — tidak ada perubahan kode (`src/`).
