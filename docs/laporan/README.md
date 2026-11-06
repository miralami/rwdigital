# Indeks `docs/laporan/` — Navigasi

↑ Peta utama: [`../README.md`](../README.md)

> **Otoritas isi laporan: `laporan.md`.** File lain di sini adalah draft, bahan, atau catatan kerja.

## 🚦 Mulai dari sini

| Kamu mau apa? | Buka |
|---|---|
| **Tahu tugas/tanggung jawabku** | `../tim/afifscope.md` (Afif) · `../tim/pembagian-tugas.md` (semua orang) |
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
| Daftar Pustaka | `referensi/daftar-pustaka.md` | tim | 🟢 siap |
| Semua gambar (1–7) | `diagram-prompts.md` → *generate* di Visual Paradigm | PIC | 🟡 prompt siap |
| Daftar Tabel & Daftar Gambar | otomatis (field Word) | — | klik *Update Field* / F9 |

---

## Daftar file

Status & isi semua file: lihat [`../README.md`](../README.md) (tabel 3).

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
