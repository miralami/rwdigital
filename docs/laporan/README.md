# Indeks `docs/laporan/` — Navigasi

> **Otoritas isi laporan: `laporan.md`.** File lain di folder ini adalah bahan, draft, atau catatan kerja.

## 🚦 Mulai dari sini

| Kamu mau apa? | Buka |
|---|---|
| **Tahu tugas/tanggung jawabku** | `afifscope.md` (Afif) · `pembagian-tugas.md` (semua orang) |
| **Nulis / port bab ke docx** | `bab4-proses-perancangan.md` (Bab IV §4.1 siap port) · `draft-3.5-mekanisme.md` (§3.5) |
| **Bikin gambar/diagram** | `diagram-prompts.md` (prompt Visual Paradigm AI) |
| **Lihat isi laporan resmi** | `laporan.md` |
| **Cek kepatuhan ke panduan dosen** | `analisis-panduan.md` |

---

## Peta File

### A. Otoritas & isi laporan

| File | Isi | Status |
|---|---|---|
| **`laporan.md`** | **Dokumen laporan lengkap (otoritas tertinggi).** Bab I–VII, §3.5 sudah lengkap versi Kanban | 🟢 sumber kebenaran |
| `contohlaporan.md` | Salinan contoh laporan akhir capstone (kasus surat-menyurat) | 📖 referensi bentuk |

### B. Draft & bahan siap port

| File | Isi | Status |
|---|---|---|
| `bab4-proses-perancangan.md` | **Bab IV §4.1 penuh** (6 tahap Kanban, data 19 Okt) + kerangka §4.2/§4.3 | 🟡 siap port |
| `draft-3.5-mekanisme.md` | Status porting §3.5 ke docx + flowchart | 🟡 siap port |
| `diagram-prompts.md` | Prompt AI untuk semua diagram (flowchart, ERD, use case, activity) | 🟢 siap pakai |
| `laporanRevisi.md` | *Holding area* revisi `[GANTI]`/`[SISIP]`/`[BARU]` (sebagian sudah usang) | 🟠 sebagian usang |
| `planAfif.md` | Rencana kerja lama Afif (sudah digantikan `afifscope.md`) | 🟠 usang |

### C. Perencanaan & pembagian kerja

| File | Isi |
|---|---|
| `afifscope.md` | Scope kerja Afif (peran, kartu, sub-bab, keputusan) |
| `pembagian-tugas.md` | Pembagian tugas **semua orang** (3 lapis: kartu Kanban, sub-bab, artefak) |
| `pembagian.md` | Pembagian sub-bab laporan (versi awal) |

### D. Analisis & referensi

| File | Isi |
|---|---|
| `analisis-panduan.md` | Gap panduan Rev 1.3 + contoh laporan vs proposal kita |
| `bibliography.md` | Daftar pustaka final (APA 7) — **versi pakai ini** |
| `daftar-pustaka.md` | Versi lengkap + catatan koreksi sitasi (Bagian C & D) |

---

## Alur Kerja Dokumen

```
ide / temuan
   │
   ├─ ditulis di  bab4-*.md / draft-3.5-*.md   (draft siap port)
   │
   ▼
laporan.md        (otoritas: setelah disetujui tim)
   │
   ▼
Capstone_Kelompok_30.docx   (Word — lewat skill capstone-word)
```

**Aturan:** jangan edit `laporan.md` kalau belum disetujui tim. Draft baru ditulis di file `bab4-*` /
`draft-*`, lalu dipindah setelah review. `laporanRevisi.md` & `planAfif.md` dipertahankan sebagai riwayat.

## Catatan

- Gambar tidak disimpan sebagai file di sini — di-*generate* dari prompt di `diagram-prompts.md`.
- Nomor tabel/gambar final mengikuti urutan di Word (`Insert Caption`), bukan angka di dokumen draft.
- Status pengerjaan fitur aktual: `../kanban/backlog.md`.
