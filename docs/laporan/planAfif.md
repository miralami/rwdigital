# Plan Pengerjaan Afif — Laporan Capstone SI-RW

## 1.1 Latar Belakang ✅ (sudah ada draft)

**Status:** Draft ada, masih banyak placeholder `[...]`.

**TODO:**
- [ ] Isi data mitra: nama/nomor RW, kelurahan, kecamatan, kota, jumlah RT, jumlah warga/KK
- [ ] Isi profil pengurus: ketua RW, sekretaris, bendahara, ketua RT
- [ ] Isi media/proses aktual administrasi (fisik, Excel, WhatsApp, dll.)
- [ ] Isi kendala per aspek:
  - Kependudukan: kondisi aktual + kendala + dampak
  - Keuangan: cara pencatatan saat ini + kendala + dampak
  - Iuran: metode bayar + proses rekonsiliasi + kendala
  - Informasi: media distribusi + kendala
- [ ] Isi ringkasan masalah di paragraf penutup
- [ ] Isi daftar fitur confirmed di paragraf closing
- [ ] Hapus paragraf catatan internal ("PLACEHOLDER DOANG...") di baris 86
- [ ] Review konsistensi: surat-menyurat disebut di draft tapi out of scope di PROJECT.md — selaraskan narasi supaya tidak kontradiksi

**Sumber data:** Wawancara mitra (jika memungkinkan), observasi lapangan, atau gunakan plausibility analysis + regulasi sebagai pengganti (lihat PROJECT.md § Metodologi).

---

## 1.2 Alternatif Solusi (kosong)

**Tujuan:** Bandingkan 2–3 alternatif solusi untuk masalah yang dirumuskan di 1.1, lalu argumentasikan kenapa solusi berbasis web app (SI-RW) dipilih.

**Struktur yang disarankan:**

1. **Identifikasi alternatif** (minimal 3):
   - A: Tetap manual (status quo — dokumen fisik, Excel, WhatsApp)
   - B: Pakai platform SaaS existing (RT/RW Net, Digides, dsb.) — cari 1–2 contoh nyata
   - C: Bangun sistem custom (SI-RW — capstone ini)

2. **Tabel perbandingan** — kolom: Alternatif | Kelebihan | Kekurangan | Kesesuaian dengan Mitra

3. **Justifikasi pilihan** — kenapa opsi C:
   - Bisa disesuaikan dengan kebutuhan spesifik mitra
   - Scope divalidasi via regulasi (UU Desa 6/2014, Permendagri 18/2018)
   - Fitur pembayaran digital (QRIS) bisa diintegrasikan
   - Konteks capstone: learning outcome pengembangan sistem

**TODO:**
- [ ] Riset 2–3 platform SaaS existing untuk digitalisasi RT/RW — screenshot + fitur utama
- [ ] Buat tabel perbandingan alternatif
- [ ] Tulis justifikasi pemilihan solusi custom
- [ ] Pastikan narasi nyambung dari 1.1 (masalah → alternatif → pilihan)

---

## 1.3 Perumusan Masalah (kosong)

**Tujuan:** Turunkan 3–5 rumusan masalah dari kendala di 1.1. Format: pertanyaan riset.

**Struktur:**
- Setiap rumusan masalah = 1 pertanyaan, masing-masing menyentuh 1 aspek/modul
- Harus derivatif langsung dari kendala di 1.1, bukan masalah baru

**Draft rumusan (sesuaikan setelah 1.1 final):**
1. Bagaimana merancang sistem yang dapat mengelola data kependudukan warga secara terpusat dan terstruktur di tingkat RW?
2. Bagaimana merancang sistem pencatatan keuangan (kas) RW yang terintegrasi dan dapat diakses oleh pengurus yang berwenang?
3. Bagaimana merancang mekanisme pembayaran iuran warga yang mendukung metode digital (QRIS) dan pencatatan otomatis?
4. Bagaimana merancang media penyampaian pengumuman/informasi RW yang terstruktur dan mudah diakses oleh warga?
5. _(opsional)_ Bagaimana merancang sistem yang mengakomodasi pembagian akses berdasarkan peran (role-based access) sesuai struktur organisasi RW?

**TODO:**
- [ ] Finalisasi rumusan setelah 1.1 selesai (kendala → rumusan masalah harus 1:1)
- [ ] Pastikan setiap rumusan bisa dijawab oleh fitur di PROJECT.md § Core MVP
- [ ] Jangan masukkan rumusan tentang surat-menyurat (out of scope)

---

## 3.1 Batasan Realistis (kosong) — bersama Zidan

**Tujuan:** Definisikan batasan non-teknis dan teknis yang membatasi scope proyek.

**Struktur yang disarankan:**

1. **Batasan waktu** — durasi pengerjaan capstone (1 semester / X bulan)
2. **Batasan mitra** — mitra tidak bisa diwawancarai secara intensif; validasi fitur via regulasi
3. **Batasan teknologi** — SQLite (single-file DB, bukan distributed), belum ada server produksi
4. **Batasan keuangan** — tidak ada budget untuk hosting berbayar / payment gateway production
5. **Batasan scope** — hanya Core MVP (4 modul), fitur out-of-scope tidak dikerjakan
6. **Batasan pengguna** — pengujian terbatas pada kelompok capstone + mitra (bukan deployment publik)

**TODO:**
- [ ] Koordinasi dengan Zidan — bagi poin mana Afif, mana Zidan
- [ ] Tulis batasan berdasarkan kondisi aktual proyek
- [ ] Cross-check dengan PROJECT.md § Fitur Dikesampingkan dari MVP

---

## 3.4 Batasan Asumsi (kosong) — bersama Zidan

**Tujuan:** Daftar asumsi yang mendasari perancangan (hal yang dianggap benar tanpa bukti eksplisit).

**Struktur yang disarankan:**

1. **Asumsi tentang mitra:**
   - Struktur RW = Ketua RW, Sekretaris, Bendahara, Ketua RT per unit (PROJECT.md § Aktor)
   - Mitra sudah familiar dengan WhatsApp → literasi digital dasar ada
   - Jumlah warga/KK cukup kecil untuk SQLite single-file DB

2. **Asumsi tentang pengguna:**
   - Warga punya smartphone dengan akses internet
   - Pengurus RW bersedia meng-input data awal

3. **Asumsi tentang regulasi:**
   - Tupoksi RW mengacu pada Permendagri 18/2018 (berlaku nasional)
   - Tidak ada Perdes/Perbup lokal yang mengubah tupoksi secara signifikan

4. **Asumsi tentang teknologi:**
   - SQLite cukup untuk skala RW (ratusan–ribuan record)
   - QRIS tersedia dan bisa diintegrasikan via payment gateway (belum dikonfirmasi provider)

**TODO:**
- [ ] Koordinasi dengan Zidan — bagi poin
- [ ] Tulis asumsi yang relevan, pastikan konsisten dengan 3.1
- [ ] Setiap asumsi idealnya punya justifikasi 1 kalimat

---

## Koordinasi: Closing Bab III

**Tanggung jawab:** Afif + Zidan memastikan 3.1 dan 3.4 konsisten, lalu hand off ke Zidan untuk 3.5 (Mekanisme Perancangan).

**TODO:**
- [ ] Setelah 3.1 dan 3.4 selesai, review bersama Zidan
- [ ] Pastikan tidak ada kontradiksi antara batasan/asumsi dengan spesifikasi di 3.3 (dikerjakan orang lain)
- [ ] Hand off ke Zidan untuk penulisan 3.5

---

## Urutan Pengerjaan (rekomendasi)

| Prioritas | Sub-bab | Blocker |
| --- | --- | --- |
| 1 | 1.1 — isi placeholder | Data mitra (wawancara/observasi/asumsi) |
| 2 | 1.3 — rumusan masalah | 1.1 harus selesai dulu |
| 3 | 1.2 — alternatif solusi | Riset platform existing |
| 4 | 3.1 — batasan realistis | Koordinasi Zidan |
| 5 | 3.4 — batasan asumsi | 3.1 harus selesai dulu |
| 6 | Closing Bab III | 3.1 + 3.4 + 3.3 selesai |
