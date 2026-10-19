# Indeks `docs/laporan/` — Navigasi

> **Otoritas isi laporan: `laporan.md`.** File lain di sini adalah draft, bahan, atau catatan kerja.

## 🚦 Mulai dari sini

| Kamu mau apa? | Buka |
|---|---|
| **Tahu tugas/tanggung jawabku** | `afifscope.md` (Afif) · `pembagian-tugas.md` (semua orang) |
| **Nulis / port bab ke docx** | `bab4-proses-perancangan.md` (Bab IV §4.1) · `bab3-5-mekanisme.md` (§3.5) |
| **Bikin gambar/diagram** | `diagram-prompts.md` (prompt Visual Paradigm AI) |
| **Lihat isi laporan resmi** | `laporan.md` |
| **Cek kepatuhan ke panduan dosen** | `referensi/analisis-panduan.md` |

---

## 🖨️ Peta Copas ke Word

Tiap bab di `Capstone_Kelompok_30.docx` diambil **dari satu sumber** berikut — jangan campur beberapa file.

| Bagian di Word | Sumber copas | PIC | Status |
|---|---|---|---|
| BAB I PENDAHULUAN (§1.1–§1.7) | `laporan.md` | Afif + tim | 🟢 siap |
| BAB II TINJAUAN PUSTAKA (§2.1–§2.3) | `laporan.md` | tim | 🟢 siap |
| BAB III SPESIFIKASI & MEKANISME (§3.1–§3.5) | `laporan.md` (catatan sisa: `bab3-5-mekanisme.md`) | tim | 🟢 siap |
| BAB IV §4.1 Proses Perancangan | `bab4-proses-perancangan.md` | Afif | 🟢 siap |
| BAB IV §4.2 Hasil Perancangan | `bab4-proses-perancangan.md` (kerangka) | PIC modul | 🟡 kerangka |
| BAB IV §4.3 Verifikasi Hasil Rancangan | `bab4-proses-perancangan.md` (kerangka) | Afif | 🟡 kerangka |
| BAB V Analisis Biaya & Kelayakan | *belum ada file* | Safira | ⛔ belum |
| BAB VI Evaluasi & Validasi | *belum ada file* | Zidan | ⛔ belum |
| BAB VII Kesimpulan & Saran | *belum ada file* | Zidan | ⛔ belum |
| Daftar Pustaka | `referensi/bibliography.md` | tim | 🟢 siap |
| Semua gambar (1–7) | `diagram-prompts.md` → *generate* di Visual Paradigm | PIC | 🟡 prompt siap |
| Daftar Tabel & Daftar Gambar | otomatis (field Word) | — | klik *Update Field* / F9 |

---

## File Aktif

| File | Isi | Status |
|---|---|---|
| **`laporan.md`** | **Dokumen laporan lengkap (otoritas tertinggi).** Bab I–VII; §3.5 sudah lengkap versi Kanban | 🟢 sumber kebenaran |
| `bab3-5-mekanisme.md` | Catatan §3.5: isi sudah ada di `.md` & docx, **sisa = gambar flowchart** | 🟡 1 gambar lagi |
| `bab4-proses-perancangan.md` | **Bab IV §4.1 penuh** (6 tahap Kanban, data 19 Okt) + kerangka §4.2/§4.3 | 🟡 siap port |
| `diagram-prompts.md` | Prompt AI untuk semua diagram (flowchart, ERD, use case, activity) | 🟢 siap pakai |
| `afifscope.md` | Scope kerja Afif (peran, kartu, sub-bab, keputusan) | 🟢 aktif |
| `pembagian-tugas.md` | Pembagian tugas **semua orang** (3 lapis: kartu Kanban, sub-bab, artefak) | 🟢 aktif |
| `README.md` | Indeks ini | — |

## `referensi/`

| File | Isi |
|---|---|
| `analisis-panduan.md` | Gap panduan Rev 1.3 + contoh laporan vs proposal kita |
| `bibliography.md` | Daftar pustaka final (APA 7) — **versi pakai ini** |
| `daftar-pustaka.md` | Versi lengkap + catatan koreksi sitasi (Bagian C & D) |
| `contohlaporan.md` | Salinan contoh laporan akhir capstone (kasus surat-menyurat) |

## `../arsip/` (di luar folder ini)

Dokumen usang: `laporanRevisi.md`, `planAfif.md`, `pembagian.md`, `List feature fix.*`.
Lihat `../arsip/README.md`.

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
- Status pengerjaan fitur aktual: `../kanban/backlog.md`.
