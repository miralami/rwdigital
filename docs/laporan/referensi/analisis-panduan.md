# Analisis Panduan Capstone & Contoh Laporan — Gap terhadap Proposal Kita

> Catatan hasil pembacaan dua dokumen sumber di
> `C:\Users\Sena\OneDrive\Kuliah\Semester 7\Capstone\`:
> - **Panduan Capstone Design — Rev 1.3 2026.pdf** (82 hlm)
> - **Contoh LAPORAN AKHIR CAPSTONE-1.pdf** (130 hlm, kasus sistem informasi surat-menyurat — sangat mirip SI-RW)
>
> Tujuan: memetakan apa yang **wajib** ada menurut panduan vs isi proposal kita
> (`Capstone_Kelompok_30.docx`) dan contoh laporan, supaya penulisan Bab III §3.5 dan Bab IV tidak salah bentuk.
>
> Disusun: 19 Okt 2026 · Sifat: catatan kerja (bukan otoritas). Otoritas isi laporan tetap `laporan.md`.

---

## 1. Ringkasan Panduan (Rev 1.3)

Proposal = **Bab I–III** (+ §3.5.4 Timeline & §3.5.5 Komponen Sistem Terintegrasi, yang ditandai *"hanya untuk proposal"*).
Laporan akhir = Bab I–VII (Bab IV–VII menyusul).

### 1.1 Kewajiban §3.5 Mekanisme Perancangan (proposal)

| Sub-bab | Isi wajib menurut panduan | Bentuk |
|---|---|---|
| 3.5.1 Sistematika Perancangan | Alur perancangan terstruktur, sesuai **teori/model/kerangka standar** yang dipilih di Bab II. Tiap tahap dijelaskan **spesifik untuk proyek ini** (bukan deskripsi umum) | **Diagram alir (flowchart)** + narasi rinci |
| 3.5.2 Mekanisme Pengumpulan Data | Jenis data, instrumen, responden/peran, alasan pemilihan responden, protokol, sampling | **Tabel** |
| 3.5.3 Mekanisme Verifikasi & Validasi | Hal yang diverifikasi; mekanisme memperoleh umpan balik stakeholder; instrumen + referensi instrumen; profil stakeholder | Narasi (+ instrumen) |
| 3.5.4 Timeline Perancangan | Jadwal aktivitas minggu ke-5 s/d ke-15 | **Tabel** |
| 3.5.5 Identifikasi Komponen Sistem Terintegrasi | Pemetaan objek permasalahan & rancangan solusi ke komponen (Manusia/Material/Mesin-Fasilitas-Peralatan/Informasi/Energi) | **Tabel** |

### 1.2 Kewajiban Bab IV–VII (laporan akhir)

- **4.1 Proses Perancangan** — tahapan yang dilakukan; **harus mengikuti tahapan di §3.5.1** (mis. contoh: sub-bab per tahap + tabel wawancara, UML).
- **4.2 Hasil Rancangan** — dokumentasi hasil. Untuk sistem informasi: **capture/screenshot tiap fitur + penjelasan fungsi/kegunaannya**.
- **4.3 Verifikasi Hasil Rancangan** — pemeriksaan error + kesesuaian terhadap spesifikasi; biasanya pengujian *Black Box* per modul + tautan *test case*.
- **5.1** biaya (dengan dasar/referensi, mis. UMK/UMR), **5.2** kelayakan (cost-benefit + NPV/IRR/BCR/BEP + sensitivitas), **5.3** rencana implementasi (SDM, pelatihan, buku panduan).
- **6.1 Validasi** (umpan balik stakeholder + berita acara / tabel), **6.2 Evaluasi** (+ penilaian rekan).
- **7.1/7.2** Kesimpulan & Saran.

> **Verifikasi ≠ Validasi.** Verifikasi (Bab IV §4.3) = benar secara internal & sesuai spesifikasi. Validasi (Bab VI §6.1) = umpan balik stakeholder.

### 1.3 Format penulisan (panduan)

- Font **Times New Roman**; judul bab 14 bold, isi 12; line spacing 1.5.
- Penomoran: `BAB I` → `I.1` → `I.1.1` (maksimal 3 tingkat di daftar isi).
- Abstrak proposal: **2 paragraf, ±300 kata**, + 3–5 kata kunci (bold-italic).
- DAFTAR ISI / DAFTAR GAMBAR / DAFTAR TABEL: **auto-generate**, bukan diketik.
- Nomor gambar/tabel: angka Romawi bab + angka Arab urut (mis. `Gambar 3.1`, `Tabel 3.2`).

---

## 2. Apa yang Dilakukan Contoh Laporan

Contoh = laporan akhir sistem informasi surat-menyurat (metode **Waterfall**). Pola yang bisa ditiru:

- **§3.5** persis 5 sub-bab: 3.5.1 sistematika (Waterfall, 4 tahap) · 3.5.2 tabel pengumpulan data · 3.5.3 verifikasi & validasi · 3.5.4 jadwal M5–M15 · 3.5.5 tabel komponen sistem terintegrasi.
- **§4.1** panjang (hlm 37–90) — tiap tahap sistematika jadi sub-bab, dengan tabel wawancara (kategori, pertanyaan, jawaban) & pemodelan UML.
- **§4.2** daftar "Halaman X" + **screenshot** + 1 paragraf fungsi tiap halaman.
- **§4.3** tabel per modul: kolom `Page` (tautan test case) + `Teknik Testing` + paragraf hasil.
- **§5** biaya bersandar acuan nyata (UMK), kelayakan pakai NPV/IRR/BCR/BEP.

---

## 3. Gap Analysis — `Capstone_Kelompok_30.docx`

### 3.1 Yang sudah terisi

Bab I (1.1–1.5), Bab II (2.1–2.3), Bab III (3.1–3.4). Isi §3.5 ada **satu narasi generik**.

### 3.2 Yang belum / bermasalah

| Item wajib (panduan) | Status di docx | Catatan |
|---|---|---|
| §3.5.1 flowchart sistematika | ❌ | §3.5 hanya narasi "Identifikasi Kebutuhan → Perancangan Data → Arsitektur → UI/UX → Keamanan → Modul → Integrasi → Pengujian"; **tidak ada flowchart** |
| §3.5.1 sesuai model terpilih | ❌ | **Kata "Kanban" 0 kemunculan di seluruh docx** — padahal metodologi kita Kanban + GitHub Projects |
| §3.5.2 tabel pengumpulan data | ❌ | tidak ada |
| §3.5.3 verifikasi & validasi | ⚠️ | hanya "Pengujian dan Verifikasi" 1 paragraf; tanpa instrumen/stakeholder |
| §3.5.4 tabel timeline M5–M15 | ❌ | tidak ada |
| §3.5.5 tabel komponen sistem terintegrasi | ❌ | tidak ada |
| Bab IV §4.1 Proses Perancangan | ❌ | heading ada, isi **kosong** |
| Bab IV §4.2 / §4.3 | ❌ | heading ada, isi **kosong** |
| Bab V / VI / VII | ❌ | heading ada, isi **kosong** |
| Format (TNR, penomoran) | 🔶 | perlu audit (sebagian judul heading semi-Inggris / gaya `Heading 2` nyelip) |

> **Koreksi (19 Okt 2026):** §3.5 versi Kanban **sudah lengkap di `docs/laporan/laporan.md`**
> (baris 509–585, lengkap Tabel 11–13 & mitra RW 06). Yang kosong adalah **docx**-nya.
> Jadi gap = memindahkan `laporan.md` §3.5 → docx + **membuat flowchart** yang belum ada.
> Lihat `docs/laporan/bab3-5-mekanisme.md`.

### 3.3 Implikasi

1. **§3.5 (proposal)** — isinya sudah ada di `laporan.md`, tapi **docx belum disinkronkan** dan
   **flowchart §3.5.1 belum dibuat**. Ini prioritas utama.
2. §3.5.1 harus menampilkan **alur Kanban** sebagai "sistematika", dan **Bab IV §4.1 wajib mengikuti tahapan §3.5.1** (kaitan panduan). Jadi keduanya harus konsisten.
3. Perlu **flowchart** + minimal **3 tabel** (pengumpulan data, timeline, komponen sistem terintegrasi) + tabel/kriteria verifikasi-validasi.
4. Bab IV §4.2 menuntut **screenshot tiap fitur** — artinya aplikasi harus bisa dijalankan & di-capture menjelang laporan akhir.

---

## 4. Referensi

- `docs/arsip/laporanRevisi.md` — draft §3.5.1 & Bab IV §4.1 versi Kanban
- `docs/kanban/workflow.md` — aturan Kanban aktual
- `docs/arsip/pembagian.md` — pembagian sub-bab per orang
- `docs/laporan/afifscope.md` — scope kerja Afif
