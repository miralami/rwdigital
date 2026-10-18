# Kanban SI-RW

Titik masuk penerapan Kanban untuk proyek SI-RW.

**Otoritas tertinggi: `docs/laporan/laporan.md`.**

| Dokumen | Isi |
|---|---|
| `workflow.md` | Aturan operasional: kolom, kriteria transisi, WIP limit, DoR/DoD, MoSCoW, konvensi Git, grey-out, prosedur back-fill |
| `backlog.md` | 38 kartu + 6 grey-out + Epic + PIC + bukti kode (as-is + back-fill) |
| `board.md` | Snapshot papan, audit WIP, metrik awal, kondisi papan terpasang + peta kartu ↔ issue |
| `temuan-inkonsistensi.md` | Temuan F1–F7 & arah penyelesaian |

Revisi laporan (untuk dipindahkan ke `laporan.md`): `docs/laporan/laporanRevisi.md`.

## Epic ↔ PIC

| Epic | Lintas Kerja | PIC | GitHub |
|---|---|---|---|
| `EPIC-0` | Fondasi & Infrastruktur | Afif | `miralami` |
| `EPIC-1` | Publik, Landing Page & Profil RW | Afif | `miralami` |
| `EPIC-2` | Informasi, Event & Humas | Alizha | `alizha13` |
| `EPIC-3` | Kependudukan & Dashboard Internal | Josua | `josuasahat` |
| `EPIC-4` | Keuangan & Kas RT | Safira | `shaffiraindanazulfa` |
| `EPIC-5` | Surat-Menyurat | Zidan | `elfarizidan` |

> **Aturan assignee:** PIC = pemilik Epic untuk pekerjaan **upcoming** (`Todo`/`In Progress`/`Backlog`).
> Seluruh kartu **`Done` (as-is)** di-assign ke **Afif (`miralami`)** karena kode eksisting
> dikerjakan Afif; ini murni *back-fill* histori. Grey-out `W-01..W-06` dibiarkan tanpa assignee.

## Status papan (terpasang, per 19 Okt 2026)

`Done` 32 · `In Progress` 3 · `Todo` 9 · `Won't` 6 (**total 50 item**)

> Snapshot awal saat papan dipasang (12 Okt): `Done` 21 · `In Progress` 8 · `Todo` 15 · `Won't` 6.
> Riwayat perpindahan ada di `board.md` §5.1.

## Urutan langkah

1. ~~Review + setujui `laporanRevisi.md`.~~ (menunggu persetujuan)
2. Pindahkan potongan `[GANTI]`/`[SISIP]`/`[BARU]` ke `docs/laporan/laporan.md`.
3. ~~Bangun GitHub Project + Issues.~~ ✅ Papan **Capstone - Gr30** sudah terisi (lihat `board.md` §5).
4. Jalankan irama mingguan; isi metrik aliran di Bab IV.

> Catatan: seluruh artefak ini **dokumentasi saja** — tidak ada perubahan kode (`src/`).
