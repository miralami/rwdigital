# Peta Dokumen `docs/`

Dua jenis dokumen:

- **Working (5 file)** — wajib dibaca & di-update. Kalau ada yang basi, itu bug.
- **Reference / Legacy** — dibaca saat butuh, tidak perlu di-update tiap commit.

## 1. Working docs (update tiap commit)

| File | Isi | Kapan di-update |
|---|---|---|
| [`../AGENTS.md`](../AGENTS.md) | Aturan sesi AI: baca STATE, update, `npm run state` | saat aturan berubah |
| [`dev/STATE.md`](dev/STATE.md) | Mini-Kanban lintas chat/device (ON PROGRESS · TODO · BLOCKED · ACTIVE FILES) | **sebelum setiap commit** |
| [`../PROJECT.md`](../PROJECT.md) | Scope fitur, aktor, status modul | saat fitur/scope berubah |
| [`laporan/laporan.md`](laporan/laporan.md) | ⭐ Otoritas isi laporan (Bab I–VII) | saat keputusan laporan berubah |
| [`laporan/bab4-plan.md`](laporan/bab4-plan.md) | Rencana Bab IV: struktur, PIC per artefak, jadwal, keputusan | saat rencana Bab IV bergerak |

Sisanya **tidak** perlu disentuh tiap commit.

## 2. Reference (dibaca sesuai kebutuhan)

| File | Isi |
|---|---|
| [`checklist.md`](checklist.md) | Katalog kebutuhan hasil pemilihan fitur bersama mitra |
| [`kanban/workflow.md`](kanban/workflow.md) | Aturan Kanban: kolom, WIP, DoR/DoD, MoSCoW, konvensi Git |
| [`kanban/backlog.md`](kanban/backlog.md) | Status kartu aktual (61 Done · 4 Todo · 3 Won't) |
| [`kanban/board.md`](kanban/board.md) | Snapshot papan, audit WIP, metrik, peta kartu ↔ issue |
| [`kanban/permintaan-stakeholder.md`](kanban/permintaan-stakeholder.md) | Ledger permintaan mitra/dosen per iterasi |
| [`kanban/konfirmasi-stakeholder.md`](kanban/konfirmasi-stakeholder.md) | Asumsi yang perlu dikonfirmasi ke mitra |
| [`kanban/temuan-inkonsistensi.md`](kanban/temuan-inkonsistensi.md) | Temuan F1–F7 & arah penyelesaian |
| [`laporan/handover-kit.md`](laporan/handover-kit.md) | Bahan Bab IV dari repo: 41 route, 26 tabel, peta FR, inventaris uji |
| [`laporan/strategi-dokumentasi.md`](laporan/strategi-dokumentasi.md) | Bukti commit/PR, klaim vs realita, framing I&I + Kanban |
| [`laporan/pembagian-tugas.md`](laporan/pembagian-tugas.md) | Siapa mengerjakan apa (kartu, sub-bab, artefak) |
| [`laporan/diagram-prompts.md`](laporan/diagram-prompts.md) | Prompt Visual Paradigm AI untuk semua diagram |
| [`laporan/referensi/`](laporan/referensi/) | `analisis-panduan` · `bibliography` (dipakai) · `daftar-pustaka` (lengkap) · `contohlaporan` |
| [`design-preview/`](design-preview/) | Pratinjau desain landing page (Opsi A/B/C) |

## 3. Legacy (jangan dipakai sebagai sumber)

| Folder | Isi |
|---|---|
| [`arsip/`](arsip/) | Teknis: `plan.md` (cetak biru implementasi, sudah selesai), `List feature fix.*` |
| [`laporan/arsip/`](laporan/arsip/) | Laporan: `laporanRevisi`, `planAfif`, `pembagian`, `afifscope`, `bab3-5-mekanisme`, `bab4-proses-perancangan` |

## 4. Dokumen di root repo

| File | Peran |
|---|---|
| `README.md` | Cara menjalankan aplikasi, role, tech stack |
| `PROJECT.md` | Scope & status fitur (working) |
| `AGENTS.md` | Aturan sesi AI (working) |
| `CLAUDE.md` | Konvensi teknis untuk AI assistant (reference) |
| `credentials.md` | Akun demo lokal (reference) |
