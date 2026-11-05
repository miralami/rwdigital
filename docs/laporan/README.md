# `docs/laporan/` — Bahan Laporan Capstone

> Peta seluruh dokumen: [`../README.md`](../README.md). Artefak asli: **`Capstone.docx`** (SharePoint). `laporan.md` = cerminnya.

## Working

| File | Isi |
|---|---|
| `../keputusan.md` | ⭐ Register keputusan (judul, metodologi, iterasi, dll.) — ubah di sini dulu |
| `laporan.md` | Cermin teks `Capstone.docx` — ditarik dengan `npm run laporan:pull`. Edit = usulan untuk Word; `git diff` = daftar review/copas |
| `bab4-plan.md` | Rencana Bab IV: struktur 4.1.1–4.1.6, isi subbab, PIC per artefak, jadwal 6–26 Nov 2026 |

## Reference

| File | Isi |
|---|---|
| `handover-kit.md` | Bahan mentah dari repo: 41 route, 26 tabel, 34 FR → route, 100 unit + 8 e2e, bukti per Epic |
| `strategi-dokumentasi.md` | Bukti commit/PR 3 fase, klaim vs realita, dampak ke Bab II–VII |
| `pembagian-tugas.md` | Siapa mengerjakan apa (kartu Kanban, sub-bab, artefak) |
| `diagram-prompts.md` | Prompt AI untuk flowchart, ERD, use case, activity, sequence |
| `referensi/` | `analisis-panduan.md` · `bibliography.md` (dipakai) · `daftar-pustaka.md` · `contohlaporan.md` |
| `arsip/` | Dokumen laporan usang (lihat `arsip/README.md`) |

## Peta copas ke Word

| Bagian Word | Sumber | Status |
|---|---|---|
| BAB I–III | `laporan.md` | 🟢 (Bab III §3.5 perlu gambar flowchart + panah loop iterasi) |
| BAB IV §4.1 | `bab4-plan.md` (struktur) + `handover-kit.md` (bahan) | 🟡 rencana final |
| BAB IV §4.2 | `handover-kit.md` §2 (daftar halaman) | 🟡 screenshot per modul |
| BAB IV §4.3 | `handover-kit.md` §5 (inventaris uji) | 🟡 tabel Black Box + bukti run CI |
| BAB V | *belum ada* | ⛔ PIC Safira |
| BAB VI | *belum ada* (UAT 23–24 Nov 2026) | ⛔ PIC Zidan |
| BAB VII | *belum ada* | ⛔ PIC Zidan |
| Daftar Pustaka | `referensi/bibliography.md` | 🟢 |

Daftar Tabel & Daftar Gambar di Word: klik *Update Field* / F9 sebelum submit.
