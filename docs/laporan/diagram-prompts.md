# Prompt Diagram — Visual Paradigm AI

> Semua gambar laporan di-*generate* lewat **Visual Paradigm AI**, jadi file ini berisi **prompt siap
> tempel** (bukan gambar). Setelah jadi: ekspor PNG, sisipkan ke Word, beri caption `Gambar X.Y`,
> lalu daftar di **DAFTAR GAMBAR** (auto-generate).
>
> Dasar: `src/lib/server/db/schema.ts` (13 tabel) + kode `SF-*` di `laporan.md` §3.3.
> PIC: **ERD global + template = Afif**; diagram per modul = **PIC modul** (lihat `pembagian-tugas.md`).
>
> **Aturan label:** tulis nama elemen dalam **Bahasa Indonesia** (sesuai istilah mitra & kode).
> `Gambar 3.x` = nomor bab + urut; jangan diketik manual, pakai *Insert Caption* di Word.

---

## 0. Cara Pakai (Visual Paradigm)

1. Buka **Visual Paradigm Online → AI Diagram** (atau *Tools → AI Diagram Generator*).
2. Pilih **tipe diagram** sesuai kolom *Jenis* di bawah.
3. Tempel blok **PROMPT** (bahasa Inggris memberi hasil paling stabil; label tetap Indonesia).
4. Rapikan tata letak, lalu **Export → PNG (300 dpi)**.
5. Sisipkan ke Word → klik kanan → *Insert Caption* → pilih label **Gambar** → otomatis jadi `Gambar 3.1`, dst.

> **Tips:** kalau hasil AI berantakan, jalankan lagi prompt yang sama (generasi berbeda), atau minta
> "simplify: only show entities A, B, C". Untuk ERD yang butuh presisi, prompt di bawah sudah menyebut
> kardinalitas eksplisit supaya tidak salah relasi.

---

## 1. Gambar 3.1 — Flowchart Sistematika Perancangan Kanban (§3.5.1)

**Jenis:** Activity Diagram / Flowchart · **PIC:** Afif · **Caption:** `Gambar 3.1`

```
Create a vertical flowchart (activity diagram) titled "Sistematika Perancangan Kanban".
Language of labels: Indonesian.

Nodes in order:
1. Start: "Pembentukan Product Backlog (Analisis)" - description "GitHub Issues + label MoSCoW + Epic"
2. Decision diamond: "Memenuhi Definition of Ready?"
   - branch "Belum" loops back to node 1
   - branch "Ya" goes to node 3
3. Process: "Todo / Ready"
4. Process: "In Progress" - annotation "WIP limit 1-2 kartu/orang, feature branch"
5. Process: "Pull Request dibuka"
6. Process: "Review / Verification" - annotation "code review + Black Box testing"
7. Decision diamond: "Lolos review & uji?"
   - branch "Tidak" loops back to "In Progress"
   - branch "Ya" goes to node 8
8. Process: "Merge ke main -> Done (DoD terpenuhi)"
9. Process: "Validasi Akhir UAT bersama mitra (kuesioner SUS)"
10. Process: "Evaluasi & perbaikan berkesinambungan"
11. End (connects back to node 1 as a feedback loop)

Use clear swimlane-free flow, top to bottom, with distinct colors for process vs decision nodes.
```

---

## 2. Gambar 4.1 — ERD Sistem Informasi RW

**Jenis:** Entity Relationship Diagram (crow's foot) · **PIC:** Afif · **Caption:** `Gambar 4.1`

```
Create a crow's-foot Entity Relationship Diagram titled "ERD Sistem Informasi RW (SI-RW)".
Keep attribute display minimal: show primary key, foreign key, and the 2-3 most important columns.

Entities and key attributes (Indonesian names):
- rw (id PK, nama, alamat, kelurahan, kecamatan, kota)
- rt (id PK, nomor, rw_id FK)
- kk (id PK, no_kk UNIQUE, alamat, rt_id FK, status_huni)
- warga (id PK, nik UNIQUE, nama, tanggal_lahir, jenis_kelamin, kk_id FK, user_id, aktif)
- riwayat_warga (id PK, warga_id FK, diubah_oleh, alasan, tanggal)
- permintaan_pembaruan (id PK, warga_id FK, data_lama, data_baru, status, ditinjau_oleh)
- pengumuman (id PK, judul, kategori, tanggal_mulai, tanggal_selesai, lokasi, rw_id FK)
- jenis_iuran (id PK, nama, nominal, periode, rw_id FK)
- tagihan (id PK, kk_id FK, jenis_iuran_id FK, periode, nominal, status)
- pembayaran (id PK, tagihan_id FK, jumlah, metode_bayar, dibayar_pada, dicatat_oleh)
- kategori_kas (id PK, nama, jenis, rw_id FK)
- transaksi_kas (id PK, jenis, nominal, kategori_id FK, tanggal, dibatalkan, rw_id FK)
- surat (id PK, nomor_surat, jenis, keperluan, status, warga_id FK, diverifikasi_oleh, disetujui_oleh)

Relationships with cardinality:
- rw 1 --- * rt
- rt 1 --- * kk
- kk 1 --- * warga
- warga 1 --- * riwayat_warga
- warga 1 --- * permintaan_pembaruan
- rw 1 --- * pengumuman
- rw 1 --- * jenis_iuran
- rw 1 --- * kategori_kas
- rw 1 --- * transaksi_kas
- jenis_iuran 1 --- * tagihan
- kk 1 --- * tagihan
- tagihan 1 --- * pembayaran
- warga 1 --- * surat
- kategori_kas 1 --- * transaksi_kas (optional/nullable)
```

---

## 3. Use Case Diagram — per modul

**Jenis:** Use Case Diagram · **PIC:** masing-masing PIC modul · **Caption:** `Gambar 3.2` dst.

Aktor: **Publik**, **Warga**, **Pengurus RT** (`pengurus_rt`), **Bendahara**, **Admin RW** (`admin_rw`).

### 3.1 Kependudukan (PIC: Josua)

```
Create a UML Use Case Diagram titled "Use Case Modul Kependudukan".
Actors on the left: Admin RW, Pengurus RT, Warga.
Use cases (ellipses) and which actors connect to them:
- "Tambah Data Warga" -> Admin RW, Pengurus RT
- "Ubah Data Warga" -> Admin RW, Pengurus RT
- "Nonaktifkan Data Warga" -> Admin RW, Pengurus RT
- "Cari & Saring Data Warga" -> Admin RW, Pengurus RT, Bendahara
- "Lihat Profil & Riwayat Warga" -> Admin RW, Pengurus RT
- "Impor Data Warga (CSV/XLSX)" -> Admin RW
- "Rekap Demografis" -> Admin RW
- "Ajukan Pembaruan Data" -> Warga
- "Verifikasi Pembaruan Data" -> Admin RW, Pengurus RT (include: "Ajukan Pembaruan Data")
Add <<include>> from "Verifikasi Pembaruan Data" to "Ubah Data Warga".
Labels in Indonesian.
```

### 3.2 Surat-Menyurat (PIC: Zidan)

```
Create a UML Use Case Diagram titled "Use Case Modul Surat-Menyurat".
Actors: Warga, Pengurus RT, Admin RW.
- "Ajukan Surat" -> Warga, Pengurus RT
- "Unggah Persyaratan" -> Warga, Pengurus RT (<<include>> to "Ajukan Surat")
- "Pantau Status Pengajuan" -> Warga
- "Verifikasi Pengajuan" -> Pengurus RT, Admin RW
- "Setujui & Terbitkan Surat" -> Admin RW
- "Unduh Surat (PDF)" -> Warga
- "Lihat Riwayat Surat" -> Warga, Pengurus RT, Admin RW
Add <<include>> from "Verifikasi Pengajuan" to "Pantau Status Pengajuan".
Labels in Indonesian.
```

### 3.3 Keuangan & Kas RT (PIC: Safira)

```
Create a UML Use Case Diagram titled "Use Case Modul Keuangan & Kas".
Actors: Bendahara, Pengurus RT, Admin RW.
- "Catat Pemasukan Kas" -> Bendahara, Admin RW
- "Catat Pengeluaran Kas" -> Bendahara, Admin RW
- "Unggah Bukti Transaksi" -> Bendahara, Admin RW (<<extend>> "Catat Pengeluaran Kas")
- "Lihat Saldo Kas" -> Bendahara, Admin RW
- "Laporan Keuangan per Periode" -> Bendahara, Admin RW
- "Koreksi / Void Transaksi" -> Admin RW (<<extend>> to "Catat Pengeluaran Kas")
- "Kelola Kategori Transaksi" -> Admin RW
- "Kelola Kas RT (terpisah per RT)" -> Pengurus RT, Bendahara
- "Rekapitulasi Kas per RT" -> Pengurus RT, Admin RW
Labels in Indonesian.
```

### 3.4 Iuran Warga (PIC: Safira)

```
Create a UML Use Case Diagram titled "Use Case Modul Iuran Warga".
Actors: Warga, Bendahara, Admin RW.
- "Kelola Jenis Iuran" -> Admin RW, Bendahara
- "Buat Tagihan Iuran (massal)" -> Admin RW, Bendahara
- "Catat Pembayaran Manual" -> Bendahara, Admin RW
- "Bayar via QRIS" -> Warga
- "Lihat Status & Riwayat Iuran" -> Warga
- "Rekap Pembayaran Iuran" -> Admin RW, Bendahara
Add <<include>> from "Bayar via QRIS" to "Lihat Status & Riwayat Iuran".
Labels in Indonesian.
```

### 3.5 Informasi & Event (PIC: Alizha)

```
Create a UML Use Case Diagram titled "Use Case Modul Informasi & Event".
Actors: Warga, Pengurus RT, Bendahara, Admin RW.
- "Buat Pengumuman" -> Admin RW
- "Ubah & Arsipkan Pengumuman" -> Admin RW
- "Lihat Pengumuman" -> Warga, Pengurus RT, Bendahara, Admin RW
- "Cari & Saring Pengumuman" -> Warga, Pengurus RT, Bendahara, Admin RW
- "Lampirkan Dokumen/Notulen" -> Admin RW (<<extend>> "Buat Pengumuman")
Labels in Indonesian.
```

### 3.6 Publik / Landing Page (PIC: Afif)

```
Create a UML Use Case Diagram titled "Use Case Modul Publik".
Actor: Publik (tanpa login), Warga.
- "Lihat Profil & Struktur RW" -> Publik
- "Lihat Statistik Penduduk" -> Publik
- "Masuk (Login)" -> Warga, Pengurus RT, Bendahara, Admin RW
Add <<extend>> from "Masuk (Login)" to "Lihat Statistik Penduduk" (optional, only for detail views).
Labels in Indonesian.
```

---

## 4. Activity / Flowchart — Alur Kritis

**Jenis:** Activity Diagram · **PIC:** PIC modul terkait · **Caption:** `Gambar 3.x` (Bab III) atau `4.x`.

### 4.1 Pengajuan & Persetujuan Surat (PIC: Zidan)

```
Create a UML Activity Diagram titled "Alur Pengajuan dan Persetujuan Surat".
Swimlanes: Warga | Pengurus RT | Admin RW.
Flow:
1. Warga: mulai, isi formulir pengajuan (data terisi otomatis dari kependudukan)
2. Warga: unggah dokumen persyaratan -> validasi format & ukuran berkas
   - if invalid: tampilkan error, kembali ke unggah
3. Warga: kirim pengajuan -> status "diajukan"
4. Pengurus RT: periksa kelengkapan
   - decision: lengkap?
     - Tidak -> set status "ditolak" + catatan alasan -> kirim notifikasi ke Warga (end)
     - Ya -> set status "diverifikasi"
5. Admin RW: review -> decision: setujui?
   - Tidak -> status "ditolak" + catatan (end)
   - Ya -> terbitkan surat (nomor surat, tanggal terbit) -> status "disetujui"
6. Warga: unduh surat PDF (end)
Labels in Indonesian; show decision diamonds clearly.
```

### 4.2 Pengajuan Pembaruan Data Warga (PIC: Josua)

```
Create a UML Activity Diagram titled "Alur Pengajuan Pembaruan Data Warga".
Swimlanes: Warga | Pengurus.
Flow:
1. Warga: buka profil -> ajukan perubahan data (snapshot data lama vs data baru)
2. Warga: isi catatan alasan -> kirim -> status "diajukan"
3. Pengurus: tinjau pengajuan
   - decision: disetujui?
     - Tidak -> status "ditolak" + catatan pengurus (end)
     - Ya -> status "disetujui" -> terapkan perubahan ke tabel warga
4. Sistem: catat riwayat_warga (audit trail) -> end
Labels in Indonesian.
```

### 4.3 Pembayaran Iuran (tunai/transfer/QRIS) (PIC: Safira)

```
Create a UML Activity Diagram titled "Alur Pembayaran Iuran".
Swimlanes: Warga | Bendahara | Sistem.
Flow:
1. Sistem: buat tagihan iuran (massal) untuk KK aktif
2. decision: metode pembayaran?
   - Tunai/Transfer: Bendahara catat pembayaran manual -> status tagihan "lunas"
   - QRIS: Warga scan QR -> payment gateway konfirmasi -> Sistem update status otomatis
3. Sistem: perbarui status tagihan (belum_bayar / sebagian / lunas)
4. Bendahara: rekap pembayaran per periode -> ekspor CSV (end)
Labels in Indonesian.
```

### 4.4 Pencatatan & Koreksi Transaksi Kas (PIC: Safira)

```
Create a UML Activity Diagram titled "Alur Pencatatan dan Koreksi Transaksi Kas".
Swimlanes: Bendahara | Admin RW.
Flow:
1. Bendahara: catat transaksi (pemasukan/pengeluaran) + kategori + bukti
2. Sistem: hitung ulang saldo kas otomatis
3. decision: ada kesalahan?
   - Tidak -> selesai (end)
   - Ya -> decision: siapa yang boleh koreksi?
     - Bendahara -> tidak diizinkan (batas peran)
     - Admin RW: lakukan void/koreksi + wajib isi alasan
4. Sistem: simpan transaksi koreksi (record asli tidak dihapus) -> end
Labels in Indonesian.
```

### 4.5 Impor Massal Data Warga (CSV/XLSX) (PIC: Josua)

```
Create a UML Activity Diagram titled "Alur Impor Massal Data Warga".
Flow (single lane + system):
1. Admin RW: unggah berkas CSV/XLSX
2. Sistem: validasi header & format kolom
3. Sistem: validasi per baris (NIK 16 digit, duplikasi, field wajib)
   - decision: ada baris tidak valid?
     - Ya -> catat baris gagal + alasan, lanjutkan baris lain (jangan hentikan proses)
     - Tidak -> lanjut
4. Sistem: simpan baris valid -> tampilkan ringkasan hasil (berhasil / gagal) (end)
Labels in Indonesian.
```

### 4.6 Pengumuman Time-Based (PIC: Alizha)

```
Create a UML Activity Diagram titled "Alur Status Pengumuman Otomatis".
Flow:
1. Admin RW: buat pengumuman (judul, isi, kategori, tanggal_mulai, tanggal_selesai, lokasi)
2. decision: punya tanggal event?
   - Tidak -> tampilkan sebagai pengumuman umum (selalu tampil)
   - Ya -> hitung status dari waktu server:
     - sebelum tanggal_mulai -> "Akan Datang"
     - di antara tanggal_mulai & tanggal_selesai -> "Berlangsung"
     - setelah tanggal_selesai -> "Selesai"
3. Sistem: tampilkan ke semua peran (end)
Labels in Indonesian.
```

### 4.7 Autentikasi & Kontrol Akses (fail-closed) (PIC: Afif)

```
Create a UML Activity Diagram titled "Alur Kontrol Akses (Fail-Closed)".
Flow:
1. Pengguna membuka halaman terproteksi
2. decision: ada sesi aktif?
   - Tidak -> redirect ke halaman masuk (end)
   - Ya -> ambil peran pengguna
3. decision: peran diizinkan untuk rute & aksi ini?
   - Tidak -> tampilkan 403 / redirect (end)
   - Ya -> lanjutkan aksi (end)
Labels in Indonesian. Emphasize deny-by-default.
```

---

## 5. Sequence Diagram (opsional, PIC modul)

```
Create a UML Sequence Diagram titled "Sekuens Verifikasi & Persetujuan Surat".
Lifelines: Warga, Antarmuka Web (SvelteKit), Server Action, Basis Data (SQLite/Drizzle), Admin RW.
Messages in order:
1. Warga -> Antarmuka Web: buka halaman detail pengajuan
2. Antarmuka Web -> Server Action: muat data pengajuan
3. Server Action -> Basis Data: SELECT surat + warga
4. Basis Data --> Server Action: data pengajuan
5. Admin RW -> Antarmuka Web: klik "Setujui & Terbitkan"
6. Antarmuka Web -> Server Action: submit form (CSRF terverifikasi)
7. Server Action -> Server Action: cek peran (RBAC)
8. Server Action -> Basis Data: UPDATE surat (status, nomor_surat, tanggal_terbit)
9. Basis Data --> Server Action: sukses
10. Server Action --> Antarmuka Web: redirect + pesan sukses
Labels in Indonesian.
```

---

## 6. Arsitektur Sistem (§4.1.2, opsional)

```
Create a UML Deployment Diagram titled "Arsitektur Sistem Informasi RW".
Nodes:
- Client: "Peramban Web (ponsel/laptop) - Warga, Pengurus, Bendahara, Admin RW"
- Server: "SvelteKit (Node.js) - SSR + form actions"
- Data: "SQLite / Turso (libSQL) - single file"
- Auth: "Better Auth (sesi + RBAC)"
- Storage: "Berkas unggahan lokal (bukti, dokumen syarat)"
Connections: Client --HTTPS--> Server; Server --> Data; Server --> Auth; Server --> Storage; Auth --> Data.
Labels in Indonesian.
```

---

## 7. Ringkasan Gambar yang Dibutuhkan

| No | Gambar | Jenis | PIC | Bab |
|---|---|---|---|---|
| 3.1 | Sistematika Perancangan Kanban | Flowchart | Afif | §3.5.1 |
| 3.2–3.7 | Use Case per modul (6) | Use Case | PIC modul | §3.3 |
| 3.8–3.14 | Activity alur kritis (7) | Activity | PIC modul | §3.3 |
| 4.1 | ERD SI-RW | ERD | Afif | §4.1.2 / §4.2 |
| 4.2 | Arsitektur Sistem | Deployment | Afif | §4.1.2 |
| 4.x | Sequence (opsional) | Sequence | PIC modul | §4.2 |

> Nomor final disesuaikan urutan kemunculan di Word (pakai *Insert Caption* otomatis).
