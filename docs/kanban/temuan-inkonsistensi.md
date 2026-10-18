# Temuan Inkonsistensi & Penyelarasan

> Aturan main: **`docs/laporan/laporan.md` = otoritas tertinggi.** Semua dokumen lain diselaraskan ke sana.
> Kalau `laporan.md` bertentangan **dengan dirinya sendiri**, temuan dicatat di sini dan
> diselesaikan mengikuti *bagian yang lebih spesifik* (`§3.3.4 Spesifikasi Fungsional`) + pekerjaan
> nyata di repo — bukan dengan mengubah `laporan.md` diam-diam.

Disusun: 12 Okt 2026 · Dasar: pembacaan `laporan.md` + verifikasi kode di `src/`

---

## Ringkasan Temuan

| # | Temuan | Tingkat | Arah penyelesaian |
|---|---|---|---|
| F1 | Surat-menyurat: di-*include* di §3.3.4 tapi di-*exclude* di §3.1 | 🔴 Tinggi | Masuk scope (kode & track sudah ada) |
| F2 | Kas RT tidak punya kode SF padahal jadi MVP & Track 4 | 🔴 Tinggi | Tambah kode SF baru |
| F3 | Landing Page & statistik publik tidak punya kode SF padahal Track 1 | 🟠 Sedang | Tambah kode SF baru |
| F4 | Model iuran: tagihan murni (§3.3.4) vs rekapitulasi (Track 4/KU-02) | 🟠 Sedang | Selaraskan definisi SF-IU |
| F5 | Kanban diklaim jalan di §2.2.3.1, realitanya belum (Review kosong) | 🔴 Tinggi | Jalankan + catat rekonstruksi di Bab IV |
| F6 | Defect kode: hard-delete pengumuman; aksi surat tanpa cek peran | 🟡 Rendah | Jadikan kartu `type:bug` |
| F7 | Dokumen sekitar usang (plan.md, checklist.md, docs/arsip/planAfif.md) | 🟠 Sedang | Diselaraskan ke laporan.md |

---

## F1 — Surat-menyurat: include vs exclude

**Bukti:**
- `laporan.md` §3.3.4 memuat `SF-SR-01` s.d. `SF-SR-07` secara lengkap.
- `laporan.md` §3.1 (batas realistis) menyatakan *"Fitur-fitur di luar scope — **termasuk surat-menyurat**
  … tidak termasuk dalam cakupan pengerjaan."*
- **Kode sudah terbangun:** `(app)/surat/`, `(app)/surat/[id]/`, `(app)/surat/[id]/cetak/`,
  `portal/surat/ajukan/`, `portal/surat/[id]/cetak/`, tabel `surat`.
- **Track 5** memang ada dengan PIC Zidan.
- `docs/checklist.md` (ringkasan prioritas) juga menaruh Surat-Menyurat = *Out of Scope*; `plan.md`
  justru menaruhnya sebagai Core MVP.

**Resolusi:** surat-menyurat **masuk scope** (`must`). §3.1 baris 326 perlu dikoreksi (hapus
"termasuk surat-menyurat" dari daftar di luar scope). Ini konsisten dengan pekerjaan nyata dan
dengan daftar SF paling spesifik.

---

## F2 — Kas RT tanpa kode SF

**Bukti:** `§3.3.4` hanya punya `SF-KS-*` (Kas RW). Tidak ada baris untuk Kas RT. Namun
`PROJECT.md` MVP #4 = "Kas RT — Baru", dan **Track 4 / KU-01** = pemisahan kas RT. Grep `kas_rt`
tidak menemukan apa pun → belum dibangun.

**Resolusi:** tambahkan kode SF baru di §3.3.4, mis. **`SF-KS-07` Pemisahan Kas RT** dan
**`SF-KS-08` Rekap Kas per RT**, lalu petakan ke kartu `KU-01`/`KU-03`.

---

## F3 — Landing Page & statistik publik tanpa kode SF

**Bukti:** `PROJECT.md` MVP #7 = "Landing Page & Dashboard Statistik — Baru". **Track 1** =
Modul Publik/Landing Page. Tapi `§3.3.4` tidak memuat `SF-LP-*`; hanya tersirat di `SF-KP-07`
(rekap demografis). Grep `visi/misi/sotk/prestasi` → kosong → belum dibangun.

**Resolusi:** tambahkan kode SF baru, mis. **`SF-LP-01` Landing Page Publik** dan
**`SF-LP-02` Visualisasi Statistik Publik**, petakan ke `LP-01`/`LP-02`.

---

## F4 — Model iuran: tagihan vs rekapitulasi

**Bukti:**
- `§3.3.4` `SF-IU-02` = "Buat Tagihan Iuran" (massal per KK); `SF-IU-06` = "Rekap Pembayaran Iuran".
- **Track 4 / KU-02** = "Penyesuaian fokus modul iuran dari sistem tagihan murni menjadi model
  **rekapitulasi penerimaan** iuran wajib RT."
- `docs/arsip/List feature fix.md`: *"Lebih ke rekap, bukan tagihan based."*

**Resolusi:** tetap pada kerangka `SF-IU`, tapi definisikan ulang fokusnya: `SF-IU-02` menjadi
*rekapitulasi penerimaan iuran wajib*, bukan penagihan. Kartu `KU-02` menautkan `SF-IU-06`.
Tidak ada perubahan kode pada tahap ini (murni penyelarasan spesifikasi).

---

## F5 — Kanban diklaim jalan, realitanya belum

**Bukti:**
- `§2.2.3.1` mengklaim kolom 5 + otomasi PR→kolom; `§3.5.4` Tabel 12 menargetkan setup board di Minggu 5.
- Realita: **belum ada Project/board**; Issues repo hanya 2 (`#3` terbuka, `#2` tertutup); PR (#1, #4–#7)
  mayoritas sinkronisasi branch, bukan alur fitur; kolom `Review / Verification` kosong.

**Resolusi:** bangun papan (lihat `board.md`) dengan **rekonstruksi as-is + back-fill**, lalu
**jujur menuliskannya** di Bab IV §4.1: papan dibangun retroaktif, tanggal back-fill tidak dikarang.
Ini sekaligus memberi isi nyata untuk Bab IV yang saat ini masih kosong.

---

## F6 — Defect kode (bahan kartu Bug)

| Defect | Bukti | Dampak | Kartu |
|---|---|---|---|
| Pengumuman dihapus permanen | `(app)/pengumuman/+page.server.ts` aksi `hapus` → `db.delete` | Melanggar `SF-PG-02` (arsip, bukan hapus) | `EV-BUG-01` |
| Aksi surat tanpa cek peran + fallback `'system'` | `(app)/surat/[id]/+page.server.ts` baris 55 & 70 | Potensi celah otorisasi/jejak audit palsu | `SR-BUG-01` |

> Tidak diperbaiki sekarang (perintah: jangan sentuh kode). Dicatat sebagai kartu `type:bug` untuk papan.

---

## F7 — Dokumen sekitar usang (diselaraskan ke laporan.md)

| Dokumen | Masalah | Tindakan |
|---|---|---|
| `plan.md` | Mengklaim impor warga, rekap, surat, kategori, void **belum ada** — padahal **sudah ada** | Beri catatan "usang" + tunjuk ke `backlog.md` sebagai status aktual |
| `docs/checklist.md` | Ringkasan prioritas menaruh **Surat-Menyurat = Out of Scope** | Selaraskan → masuk scope (F1) |
| `docs/arsip/planAfif.md` | Catatan lama "surat-menyurat out of scope di PROJECT.md" (sudah tak relevan) | Tandai usang |
| `PROJECT.md` | Status proyek masih "Implementasi: belum" | Perbarui status + tegaskan `laporan.md` = otoritas |
| `docs/arsip/List feature fix.md` | Model iuran (rekap) belum tertaut ke SF | Tautkan ke F4 |

---

## Catatan Metode

Semua temuan di atas berasal dari pembacaan langsung file, bukan asumsi. Di mana status tidak bisa
dipastikan tanpa menjalankan aplikasi, ditandai **"perlu verifikasi"** (lihat `backlog.md`) alih-alih
diklaim `Done`.
