# PLAN.MD — Rencana Implementasi SI-RW (Berdasarkan draftrevised.md)

Dokumen ini adalah cetak biru implementasi teknis Sistem Informasi RW (SI-RW) berdasarkan spesifikasi final pada laporan capstone (`draftrevised.md`) dari kondisi terkini basis kode (`rwdigital`).

---

## 1. Keputusan Arsitektur & Lingkup (Latest Decisions)

1. **5 Modul Core MVP (Confirmed)**:
   - **Kependudukan** (SF-KP-01 s/d SF-KP-08)
   - **Surat-Menyurat** (SF-SR-01 s/d SF-SR-07)
   - **Kas RW** (SF-KS-01 s/d SF-KS-06)
   - **Iuran Warga** (SF-IU-01 s/d SF-IU-06)
   - **Pengumuman & Informasi** (SF-PG-01 s/d SF-PG-04)
2. **Manajemen Akun Terpusat**:
   - Pendaftaran akun warga dilakukan **eksklusif oleh Admin RW** (tidak ada registrasi publik) untuk mencegah warga mendaftar menggunakan NIK milik orang lain.
   - Entitas akun (`user` Better Auth) dihubungkan langsung dengan entitas `warga`.
3. **Penyimpanan Berkas Lokal**:
   - Bukti kas (kuitansi/nota) dan berkas persyaratan surat disimpan di direktori lokal server (`static/uploads/` atau storage lokal terisolasi).
4. **Keamanan & Privasi (UU PDP & ISO 27001)**:
   - Data masking NIK dan No. KK pada tabel daftar (`3275••••••••0001`).
   - Audit trail pada seluruh transaksi keuangan dan perubahan data kependudukan.
   - Koreksi transaksi kas dilakukan melalui pembatalan (void) dengan pencatatan alasan, bukan penghapusan fisik.

---

## 2. Matriks Gap Analysis & Rencana Aksi per Modul

### A. Modul Kependudukan
| Kode | Spesifikasi di Laporan | Status Saat Ini | Rencana Aksi Implementasi |
|---|---|---|---|
| **SF-KP-01** | Tambah Warga (16 digit NIK & No KK, cegah duplikat) | Form `/warga/tambah` ada | Tangani duplikasi NIK/No KK dengan pesan Zod ramah bahasa Indonesia |
| **SF-KP-02** | Ubah Warga (alasan perubahan & jejak audit) | Form edit langsung update DB | Tambah tabel `riwayat_warga` (audit log: tanggal, diubahOleh, alasan, field yg diubah) |
| **SF-KP-03** | Nonaktifkan Warga (tanggal & alasan: pindah/meninggal) | Hanya toggle `aktif = false` | Tambah modal input tanggal & alasan nonaktif, simpan di tabel/riwayat |
| **SF-KP-04** | Cari & Saring Warga (nama, NIK, No KK, RT) | Pencarian teks lokal | Tambah filter dropdown RT dan filter status aktif/nonaktif |
| **SF-KP-05** | Lihat Profil Warga (masking di daftar, detail utuh per izin) | NIK & No KK tampil utuh | Terapkan helper `maskNik` & `maskNoKk` di DataTable; detail tetap utuh bagi admin/pengurus |
| **SF-KP-06** | Impor Data Warga via CSV/XLSX | Belum ada | Endpoint & modal impor CSV/XLSX, parser baris, validasi skema, batch insert KK & Warga |
| **SF-KP-07** | Rekap Demografis & Ekspor CSV | Hanya counter di dasbor | Halaman/tab rekapitulasi (distribusi usia, jenis kelamin, RT, status huni) + ekspor CSV |
| **SF-KP-08** | Pengajuan Pembaruan Data oleh Warga | Belum ada | Form pengajuan update profil di Portal Warga + approval list bagi pengurus RT/RW |

---

### B. Modul Surat-Menyurat (Core MVP)
| Kode | Spesifikasi di Laporan | Status Saat Ini | Rencana Aksi Implementasi |
|---|---|---|---|
| **SF-SR-01** | Pengajuan Surat oleh Warga (SKCK, SKTM, domisili, usaha, dll.) | Placeholder tabel `surat` | Form pengajuan di Portal Warga: pilih jenis surat, data pemohon auto-fill dari profil warga |
| **SF-SR-02** | Unggah Dokumen Persyaratan | Belum ada | Input berkas upload multipart ke storage lokal server (`static/uploads/surat/`) |
| **SF-SR-03** | Pantau Status Pengajuan | Belum ada | List & timeline status surat di Portal Warga (Diajukan → Diverifikasi → Disetujui/Ditolak) |
| **SF-SR-04** | Verifikasi Pengajuan oleh Pengurus RT/RW | Belum ada | Halaman `/surat` untuk pengurus: periksa berkas, tombol verifikasi atau tolak + catatan alasan |
| **SF-SR-05** | Setujui & Terbitkan Surat oleh Admin RW | Belum ada | Aksi generate nomor surat otomatis + tanggal terbit + arsip permanen |
| **SF-SR-06** | Unduh Surat (Format PDF / Slip Cetak) | Belum ada | Endpoint cetak/generate PDF surat keterangan resmi berbasis template HTML |
| **SF-SR-07** | Riwayat Surat | Belum ada | Halaman arsip surat untuk pengurus; warga hanya dapat melihat riwayat miliknya |

---

### C. Modul Keuangan Kas RW
| Kode | Spesifikasi di Laporan | Status Saat Ini | Rencana Aksi Implementasi |
|---|---|---|---|
| **SF-KS-01** | Catat Pemasukan | Sudah ada di `/kas/tambah` | Sudah berfungsi, pastikan audit `dicatatOleh` terikat session |
| **SF-KS-02** | Catat Pengeluaran | Sudah ada di `/kas/tambah` | Sudah berfungsi |
| **SF-KS-03** | Unggah Bukti Transaksi (kuitansi/nota) | Field `bukti` teks link | Input upload file gambar lokal (`static/uploads/kas/`) |
| **SF-KS-04** | Lihat Saldo Kas & Ringkasan | Ada di `/kas` & dasbor | Sudah terpenuhi |
| **SF-KS-05** | Laporan Keuangan Per Periode (CSV & PDF) | Hanya list total | Filter periode (bulan/tahun) + tombol ekspor CSV dan format cetak PDF |
| **SF-KS-06** | Audit Trail & Koreksi via Pembatalan (tanpa hapus fisik) | Belum ada batal/koreksi | Tambah kolom `dibatalkan: boolean`, `alasanBatal`, `dibatalkanOleh` + modal batalkan transaksi |

---

### D. Modul Iuran Warga
| Kode | Spesifikasi di Laporan | Status Saat Ini | Rencana Aksi Implementasi |
|---|---|---|---|
| **SF-IU-01** | Kelola Jenis Iuran | Ada di `/iuran/jenis` | Sudah terpenuhi |
| **SF-IU-02** | Buat Tagihan Iuran Massal | Ada di `/iuran/generate` | Sudah terpenuhi |
| **SF-IU-03** | Catat Pembayaran Manual (otomatis masuk Kas RW) | Ada di `/iuran/[id]/bayar` | Saat pembayaran dicatat, lakukan transaksi atomik: update status tagihan + insert ke `transaksi_kas` |
| **SF-IU-04** | Pembayaran via QRIS (Mock/Plausibility) | Banner modal di `/portal` | Sudah sesuai batasan realistis & biaya proyek |
| **SF-IU-05** | Pantau Tagihan & Riwayat Pribadi di Portal | Masih data contoh/mock | Hubungkan `/portal` ke tagihan riil milik KK akun warga login |
| **SF-IU-06** | Rekap Pembayaran Iuran Per Periode (Ekspor CSV) | Hanya tabel daftar | Tambah filter periode + tombol ekspor rekapitulasi status lunas per KK ke CSV |

---

### E. Modul Pengumuman & Informasi
| Kode | Spesifikasi di Laporan | Status Saat Ini | Rencana Aksi Implementasi |
|---|---|---|---|
| **SF-PG-01** | Buat Pengumuman (kategori, tanggal mulai & selesai) | Judul, isi, kategori | Tambah kolom `tanggalMulai` & `tanggalSelesai` di schema |
| **SF-PG-02** | Ubah & Arsipkan Pengumuman (tanpa hapus) | Form edit & `ditampilkan` | Sudah terpenuhi |
| **SF-PG-03** | Lihat Pengumuman Terurut Terbaru | Tersedia | Sudah terpenuhi |
| **SF-PG-04** | Cari & Saring Pengumuman (kategori & tanggal) | Tabel sederhana | Tambah filter kategori dan rentang tanggal |

---

### F. Keamanan, Akun, & Non-Fungsional
| Kode | Spesifikasi di Laporan | Status Saat Ini | Rencana Aksi Implementasi |
|---|---|---|---|
| **NFRA-01..05** | RBAC 4 peran, route guards terpusat, fail-closed | Sudah terpasang | Pertahankan arsitektur `guard.ts` & `permissions.ts` |
| **NFRA-07** | Warga hanya melihat data miliknya | Belum ada relasi akun | Tambah `userId` di tabel `warga` & filter query berdasarkan `locals.user.id` |
| **NFRA-08** | Akun dikelola Admin RW secara terpusat | Belum ada antarmuka akun | Buat halaman kelola akun di `/warga` atau `/pengaturan/akun` untuk generate akun warga (NIK + default password) |
| **NFRA-09** | Durasi sesi 60 menit | Default Better Auth | Set konfigurasi session timeout 60 menit |
| **NFRA-10** | Masking NIK & No KK di tabel daftar | Belum tersamar | Tambahkan fungsi masking `3275••••••••0001` |
| **NFRS-03..04** | Validasi Zod 16 digit & pesan Bahasa Indonesia | Sebagian | Tuntaskan seluruh pesan galat Zod ke Bahasa Indonesia |
| **NFRS-10** | Jejak audit user pencatat transaksi & iuran | Kolom ada di DB | Pastikan semua mutasi data mengisi `dicatatOleh: locals.user.id` |

---

## 3. Rencana Kerja Bertahap (Sprint Roadmap)

### Fase 1: Fondasi Relasi Akun, Privasi PII, & Manajemen Akun Warga
- [ ] **1.1 Skema Basis Data**:
  - Tambah kolom `userId` pada tabel `warga` (`references(() => user.id)`).
  - Jalankan `npx drizzle-kit generate` dan `npm run db:setup`.
- [ ] **1.2 Data Masking Helper (`src/lib/format.ts`)**:
  - Implementasi fungsi `maskNik(nik)` dan `maskNoKk(noKk)` (format: 4 digit awal + 8 bullet + 4 digit akhir).
  - Terapkan masking pada kolom NIK dan No. KK di `/warga/+page.svelte`.
- [ ] **1.3 Pembuatan Akun Warga Terpusat (`/warga/[id]/akun` atau di form tambah warga)**:
  - Admin RW dapat membuatkan akun login warga (email berbasis NIK: `nik@warga.rw` atau email warga, password awal terstandar).
  - Hubungkan `warga.userId` langsung ke `user.id` Better Auth.
- [ ] **1.4 Portal Warga Terhubung Data Nyata (`src/routes/portal/+page.server.ts`)**:
  - Ganti data statis contoh dengan query riil: tagihan aktif KK warga, riwayat pembayaran KK warga, dan pengumuman aktif.

### Fase 2: Modul Surat-Menyurat (Alur Lengkap)
- [ ] **2.1 Skema & Penyimpanan Dokumen**:
  - Lengkapi skema `surat` di `schema.ts`: `nomorSurat`, `jenisSurat`, `keperluan`, `dokumenSyarat` (path lokal), `status` (`diajukan`, `diverifikasi`, `disetujui`, `ditolak`), `catatanPengurus`, `disetujuiOleh`, `tanggalTerbit`.
  - Siapkan folder direktori `static/uploads/surat/`.
- [ ] **2.2 Formulir Pengajuan Surat di Portal Warga (`/portal/surat/ajukan`)**:
  - Form permohonan surat: jenis surat (SKCK, SKTM, Domisili, Usaha, Umum), keperluan, unggah file syarat (KTP/KK scan/foto).
  - Status pemantauan surat di portal warga.
- [ ] **2.3 Antarmuka Manajemen & Verifikasi Surat Pengurus (`/surat`)**:
  - Daftar permohonan surat masuk (filter per RT, status).
  - Halaman detail verifikasi permohonan surat: preview dokumen syarat, tombol verifikasi/tolak dengan catatan alasan.
- [ ] **2.4 Penerbitan & Cetak Surat (PDF)**:
  - Admin RW menyetujui surat → nomor surat digenerate otomatis.
  - Template surat resmi siap cetak / PDF download untuk warga dan pengurus.

### Fase 3: Modul Kependudukan (Audit, Filter, Ekspor/Impor)
- [ ] **3.1 Audit Perubahan & Nonaktifkan Warga**:
  - Tambah tabel `riwayat_warga` atau kolom alasan edit & nonaktifkan.
  - Form edit mewajibkan input alasan perubahan data.
  - Modal nonaktifkan warga mewajibkan tanggal dan alasan (pindah/meninggal).
- [ ] **3.2 Filter Lanjutan**:
  - Filter RT dan status aktif/nonaktif di `/warga`.
- [ ] **3.3 Impor Data CSV**:
  - Halaman/modal upload CSV warga, validasi baris, dan batch insert ke tabel `kk` dan `warga`.
- [ ] **3.4 Rekap Demografis & Ekspor CSV**:
  - Tampilan statistik kependudukan (grafik/tabel rentang usia, gender, per RT) + tombol ekspor CSV.

### Fase 4: Modul Kas RW & Iuran (Otomatisasi, Upload Bukti, Ekspor)
- [ ] **4.1 Sinkronisasi Pembayaran Iuran ke Kas**:
  - Pada server action `/iuran/[id]/bayar`, gunakan Drizzle transaction untuk membuat entri `transaksi_kas` (jenis: `pemasukan`, kategori kas iuran) secara otomatis saat tagihan berstatus lunas.
- [ ] **4.2 Upload Bukti Kas & Koreksi/Pembatalan**:
  - Upload file nota/kuitansi kas ke `static/uploads/kas/`.
  - Fitur pembatalan transaksi kas dengan mencatat alasan koreksi.
- [ ] **4.3 Filter Periode & Ekspor Kas / Iuran ke CSV**:
  - Filter bulan & tahun pada laporan kas dan tagihan iuran.
  - Endpoint ekspor laporan kas ke format CSV.
  - Endpoint ekspor rekapitulasi iuran warga ke format CSV.

### Fase 5: Modul Pengumuman & Polish
- [ ] **5.1 Jadwal Tayang Pengumuman**:
  - Tambah field `tanggalMulai` dan `tanggalSelesai` pada skema `pengumuman`.
  - Filter otomatis pengumuman yang aktif di portal dan dashboard.
- [ ] **5.2 Saring & Cari Pengumuman**:
  - Filter kategori pengumuman dan pencarian terintegrasi.
- [ ] **5.3 Uji Coba Komprehensif (Black Box Testing)**:
  - Pengujian fungsional seluruh modul berdasarkan skenario skripsi/laporan.
  - Validasi RBAC fail-closed untuk ke-4 peran pengguna.

---

## 4. Struktur Direktori Baru yang Akan Hadir

```
src/
  lib/
    server/
      storage.ts             ← Helper simpan berkas lokal (kuitansi, dokumen surat)
      db/
        schema.ts            ← Update: userId di warga, field surat lengkap, riwayat audit
    format.ts                ← Update: maskNik, maskNoKk
  routes/
    (app)/
      surat/                 ← Manajemen surat pengurus (daftar, verifikasi, terbit)
        +page.svelte
        +page.server.ts
        [id]/
          +page.svelte
          +page.server.ts
          cetak/
            +page.svelte
      warga/
        rekap/               ← Rekapitulasi demografis & ekspor CSV
          +page.svelte
          +page.server.ts
        impor/               ← Impor data warga via CSV
          +page.svelte
          +page.server.ts
    portal/
      surat/                 ← Pengajuan surat warga
        +page.svelte
        +page.server.ts
        ajukan/
          +page.svelte
          +page.server.ts
static/
  uploads/
    kas/                     ← Berkas kuitansi/nota transaksi kas
    surat/                   ← Berkas dokumen persyaratan surat
```
