# Indeks `docs/laporan/` — Navigasi

> **Otoritas isi laporan: [`laporan.md`](laporan.md).** File lain di sini adalah draft, bahan, atau catatan kerja.

## 🚦 Mulai dari sini

| Kamu mau apa? | Buka |
|---|---|
| **Tahu tugas / tanggung jawabku** | [`afifscope.md`](afifscope.md) (Afif) · [`pembagian-tugas.md`](pembagian-tugas.md) (semua orang) |
| **Nulis / port bab ke docx** | [`bab4-proses-perancangan.md`](bab4-proses-perancangan.md) (Bab IV §4.1) · [`bab3-5-mekanisme.md`](bab3-5-mekanisme.md) (§3.5) |
| **Bikin gambar / diagram** | [`diagram-prompts.md`](diagram-prompts.md) (prompt Visual Paradigm AI) |
| **Lihat isi laporan resmi** | [`laporan.md`](laporan.md) |
| **Cek kepatuhan ke panduan dosen** | [`referensi/analisis-panduan.md`](referensi/analisis-panduan.md) |

---

## File Aktif

| File | Isi | Status |
|---|---|---|
| **[`laporan.md`](laporan.md)** | **Dokumen laporan lengkap (otoritas tertinggi).** Bab I–VII; §3.5 sudah lengkap versi Kanban | 🟢 sumber kebenaran |
| [`bab3-5-mekanisme.md`](bab3-5-mekanisme.md) | Status porting §3.5 ke docx + prompt flowchart | 🟡 siap port |
| [`bab4-proses-perancangan.md`](bab4-proses-perancangan.md) | **Bab IV §4.1 penuh** (6 tahap Kanban, data 19 Okt) + kerangka §4.2/§4.3 | 🟡 siap port |
| [`diagram-prompts.md`](diagram-prompts.md) | Prompt AI untuk semua diagram (flowchart, ERD, use case, activity) | 🟢 siap pakai |
| [`afifscope.md`](afifscope.md) | Scope kerja Afif (peran, kartu, sub-bab, keputusan) | 🟢 aktif |
| [`pembagian-tugas.md`](pembagian-tugas.md) | Pembagian tugas **semua orang** (3 lapis: kartu Kanban, sub-bab, artefak) | 🟢 aktif |

## `referensi/` — bahan pendukung

| File | Isi |
|---|---|
| [`referensi/analisis-panduan.md`](referensi/analisis-panduan.md) | Gap panduan Rev 1.3 + contoh laporan vs proposal kita |
| [`referensi/bibliography.md`](referensi/bibliography.md) | Daftar pustaka final (APA 7) — **versi pakai ini** |
| [`referensi/daftar-pustaka.md`](referensi/daftar-pustaka.md) | Versi lengkap + catatan koreksi sitasi (Bagian C & D) |
| [`referensi/contohlaporan.md`](referensi/contohlaporan.md) | Salinan contoh laporan akhir capstone (kasus surat-menyurat) |

## `../arsip/` — dokumen usang

`laporanRevisi.md` · `planAfif.md` · `pembagian.md` · `List feature fix.*`.
Lihat [`../arsip/README.md`](../arsip/README.md).

---

## Alur Kerja Dokumen

```
ide / temuan
   │
   ├─ ditulis di  bab4-*.md / bab3-5-*.md      (draft siap port)
   ▼
laporan.md                                     (otoritas: setelah disetujui tim)
   │
   ▼
Capstone_Kelompok_30.docx                      (Word — lewat skill capstone-word)
```

**Aturan:**
- Jangan edit `laporan.md` kalau belum disetujui tim — tulis di file `bab*` dulu.
- Gambar tidak disimpan sebagai file di sini; di-*generate* dari prompt di `diagram-prompts.md`.
- Nomor tabel/gambar final mengikuti urutan di Word (*Insert Caption*), bukan angka di draft.
- Status pengerjaan fitur aktual: [`../kanban/backlog.md`](../kanban/backlog.md).
