# Indeks `docs/` — Peta Dokumen Proyek SI-RW

> **Mulai dari sini.** Navigasi cepat seluruh dokumentasi.
> Status pengerjaan fitur: [`kanban/backlog.md`](kanban/backlog.md) · Isi laporan (otoritas): [`laporan/laporan.md`](laporan/laporan.md).

## Struktur

```
docs/
├── README.md                     ← kamu di sini (peta utama)
├── checklist.md                  katalog kebutuhan (dokumen pemilihan fitur bersama mitra)
├── kanban/
│   ├── README.md                 indeks
│   ├── workflow.md               aturan: kolom, WIP, DoR/DoD, MoSCoW
│   ├── backlog.md                ✅ status fitur aktual (38 kartu + 6 grey-out)
│   ├── board.md                  snapshot papan + audit WIP + metrik
│   └── temuan-inkonsistensi.md   temuan F1–F7
├── laporan/
│   ├── README.md                 indeks
│   ├── laporan.md                ⭐ OTORITAS isi laporan
│   ├── bab3-5-mekanisme.md       status porting §3.5 + flowchart
│   ├── bab4-proses-perancangan.md  Bab IV §4.1 (siap port)
│   ├── diagram-prompts.md        prompt Visual Paradigm AI
│   ├── afifscope.md              scope kerja Afif
│   ├── pembagian-tugas.md        pembagian tugas semua orang
│   └── referensi/                analisis-panduan · bibliography · daftar-pustaka · contohlaporan
├── arsip/                        dokumen usang (laporanRevisi, planAfif, pembagian, List feature fix)
└── design-preview/               pratinjau desain landing page (Opsi A/B/C)
```

## Di mana aku mencari…?

| Pertanyaan | Jawaban ada di |
|---|---|
| Fitur apa saja & statusnya? | [`kanban/backlog.md`](kanban/backlog.md) |
| Siapa mengerjakan apa? | [`laporan/pembagian-tugas.md`](laporan/pembagian-tugas.md) |
| Aturan Kanban (kolom, WIP, DoR/DoD)? | [`kanban/workflow.md`](kanban/workflow.md) |
| Isi bab laporan? | [`laporan/laporan.md`](laporan/laporan.md) |
| Bab IV sudah ditulis? | [`laporan/bab4-proses-perancangan.md`](laporan/bab4-proses-perancangan.md) |
| Prompt bikin diagram? | [`laporan/diagram-prompts.md`](laporan/diagram-prompts.md) |
| Inkonsistensi yang ditemukan? | [`kanban/temuan-inkonsistensi.md`](kanban/temuan-inkonsistensi.md) |
| Daftar pustaka? | [`laporan/referensi/bibliography.md`](laporan/referensi/bibliography.md) |
| Dokumen lama yang sudah tidak dipakai? | [`arsip/`](arsip/README.md) |

## Dokumen di root repo (di luar `docs/`)

| File | Peran |
|---|---|
| `README.md` | Readme utama proyek (cara jalankan aplikasi) |
| `PROJECT.md` | Ringkasan proyek (prinsip, aktor, MVP) |
| `plan.md` | Cetak biru implementasi teknis (`⚠️ sebagian usang`) |
| `CLAUDE.md` | Panduan konvensi untuk AI assistant |
| `credentials.md` | Akun demo / kredensial lingkungan |
