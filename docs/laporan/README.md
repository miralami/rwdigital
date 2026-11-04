# Indeks `docs/laporan/` — Navigasi

> **Otoritas isi laporan: `laporan.md`.** File lain di sini adalah draft, bahan, atau catatan kerja.

## 🚦 Mulai dari sini

| Kamu mau apa? | Buka |
|---|---|
| **Tahu tugas/tanggung jawabku** | `afifscope.md` (Afif) · `pembagian-tugas.md` (semua orang) |
| **Ikut menulis Bab IV** | `bab4-plan.md` (rencana final v3: struktur, PIC, jadwal) |
| **Butuh bahan mentah dari repo** | `handover-kit.md` (41 route, 26 tabel, 34 FR, inventaris uji) |
| **Paham kenapa framing-nya begini** | `strategi-dokumentasi.md` (bukti git, klaim vs realita) |
| **Nulis / port bab ke docx** | `bab3-5-mekanisme.md` (§3.5) · `bab4-plan.md` (Bab IV) |
| **Bikin gambar/diagram** | `diagram-prompts.md` (prompt Visual Paradigm AI) |
| **Lihat isi laporan resmi** | `laporan.md` |
| **Cek kepatuhan ke panduan dosen** | `referensi/analisis-panduan.md` |

---

## 🖨️ Peta Copas ke Word

Tiap bab di `Capstone_Kelompok_30.docx` diambil **dari satu sumber** berikut — jangan campur beberapa file.

| Bagian di Word | Sumber copas | PIC | Status |
|---|---|---|---|
| BAB I PENDAHULUAN (§1.1–§1.7) | `laporan.md` | Afif + tim | 🟢 siap |
| BAB II TINJAUAN PUSTAKA (§2.1–§2.3) | `laporan.md` + teori baru (BPMN/ArchiMate/IxD/Kanban/UML/Black Box) | tim | 🟡 perlu tambah |
| BAB III SPESIFIKASI & MEKANISME (§3.1–§3.5) | `laporan.md` (catatan sisa: `bab3-5-mekanisme.md`) | tim | 🟡 §3.5 versi Kanban + loop iterasi |
| BAB IV §4.1 Proses Perancangan | `bab4-plan.md` (struktur) + `handover-kit.md` (bahan) | Afif + PIC artefak | 🟡 rencana final |
| BAB IV §4.2 Hasil Perancangan | `handover-kit.md` §2 (daftar halaman) | PIC modul | 🟡 belum |
| BAB IV §4.3 Verifikasi Hasil Rancangan | `handover-kit.md` §5 (inventaris uji) | Alizha + PIC modul | 🟡 belum |
| BAB V Analisis Biaya & Kelayakan | *belum ada file* | Safira | ⛔ belum |
| BAB VI Evaluasi & Validasi | *belum ada file* (UAT 23–24 Nov) | Zidan | ⛔ belum |
| BAB VII Kesimpulan & Saran | *belum ada file* | Zidan | ⛔ belum |
| Daftar Pustaka | `referensi/bibliography.md` | tim | 🟢 siap |
| Semua gambar | `diagram-prompts.md` → *generate* di Visual Paradigm | PIC | 🟡 prompt siap |
| Daftar Tabel & Daftar Gambar | otomatis (field Word) | — | klik *Update Field* / F9 |

---

## File Aktif

| File | Isi | Status |
|---|---|---|
| **`laporan.md`** | **Dokumen laporan lengkap (otoritas tertinggi).** Bab I–VII; §3.5 sudah lengkap versi Kanban | 🟢 sumber kebenaran |
| **`bab4-plan.md`** | **Rencana final Bab IV v3**: framing I&I + Kanban, struktur 4.1.1–4.1.6, PIC per artefak, jadwal 6–26 Nov | 🟢 acuan kerja |
| **`handover-kit.md`** | Bahan mentah dari repo: peta halaman, entitas, FR→route, inventaris uji, bukti proses | 🟢 siap pakai |
| **`strategi-dokumentasi.md`** | Analisis commit/PR, klaim vs bukti, framing, dampak ke bab lain | 🟢 acuan |
| `bab3-5-mekanisme.md` | Catatan §3.5: isi sudah ada di `.md` & docx, **sisa = gambar flowchart** | 🟡 1 gambar lagi |
| `bab4-proses-perancangan.md` | Draft §4.1 lama (angka 19 Okt: 29 Done) — **usang**, jangan dipakai mentah | 🔴 arsip kerja |
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

## `arsip/` (di dalam folder laporan)

Dokumen laporan usang: `laporanRevisi.md`, `planAfif.md`, `pembagian.md`.
Arsip teknis non-laporan tetap di `../arsip/` (`List feature fix.*`).

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
