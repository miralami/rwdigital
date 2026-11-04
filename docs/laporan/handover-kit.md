# Handover Kit — Bahan Bab IV dari Repo

> **Tujuan:** supaya PIC artefak bisa menulis tanpa menebak dan tanpa menunggu Afif.
> Semua isi di sini **diturunkan dari repo** (`src/routes`, `src/lib/server/db/schema.ts`, file uji,
> `git log main`, `docs/kanban/backlog.md`), bukan karangan.
>
> Status data: 3 Nov 2026 · commit `8990720` · 92 commit di `main` (64 non-merge).
> Kolom **aktor** disimpulkan dari guard/RBAC dan perlu dikonfirmasi PIC modul.

---

## 0. Cara Pakai per PIC

| PIC | Ambil dari dokumen ini | Bagian |
|---|---|---|
| **Josua** — BPMN as-is/to-be, Activity | §2 peta halaman (alur per aktor), §3 peta entitas (data yang mengalir) | §2, §3 |
| **Zidan** — FR, Use Case + description | §4 peta FR → route, §2 aktor per halaman | §2, §4 |
| **Alizha** — NFR, Black Box | §5 inventaris uji, §2 daftar halaman untuk skenario | §2, §5 |
| **Safira** — Sequence, State, UI/UX | §2 halaman + §3 status (kolom `status` di tabel), §5 | §2, §3 |
| **Afif** — ERD, class, ArchiMate, Kanban | §3 peta entitas, §6 bukti proses per Epic | §3, §6 |

---

## 1. Angka Dasar (untuk konsistensi seluruh Bab IV)

| Metrik | Nilai | Sumber |
|---|---|---|
| Commit `main` | 92 (28 merge, 64 non-merge) | `git rev-list` / `git log --merges` |
| Rentang | 25 Sep – 3 Nov 2026 | `git log` |
| Pull request merged | 28 | GitHub |
| Issue | 99 | GitHub |
| Halaman (route `+page.svelte`) | 41 | `src/routes` |
| Tabel basis data | 26 | `schema.ts` |
| Baris `src/` | ±29.875 | `Get-Content` |
| Unit test | 100 (9 file) | `src/lib/server/*.test.ts` |
| E2E test | 8 (1 file) | `e2e/smoke.spec.ts` |
| CI | 1 workflow, 2 job (check+unit+build, e2e) | `.github/workflows/ci.yml` |
| Kartu papan | 68 item: 61 Done · 0 In Progress · 4 Todo · 3 Won't | `docs/kanban/backlog.md` |

---

## 2. Peta Halaman (41 route)

Kolom **FR** = kode `SF-*` yang diwujudkan halaman itu. Kode `FND-*`/`LP-*`/`W-*` = kartu non-FR.

### 2.1 Publik & Portal Warga (8)

| Route | Fungsi | Aktor | FR |
|---|---|---|---|
| `/` | Landing: hero, profil RW, pengurus, pengumuman, galeri | Publik | `SF-PG-03`, `LP-01/02` |
| `/login` | Masuk, klaim akun, lupa kata sandi | Publik | `FND-06`, `SF-NT-03` |
| `/portal` | Beranda warga: profil KK, tagihan, status surat, notifikasi | Warga | `SF-NT-01`, `SF-IU-05` |
| `/portal/iuran` | Rincian tagihan + tombol bayar QRIS | Warga | `SF-IU-04` |
| `/portal/perbaruan` | Ajukan pembaruan data kependudukan | Warga | `SF-KP-08` |
| `/portal/surat/ajukan` | Formulir pengajuan surat + unggah syarat | Warga | `SF-SR-01`, `SF-SR-02` |
| `/portal/surat/[id]` | Detail + riwayat status pengajuan | Warga | `SF-SR-03` |
| `/portal/surat/[id]/cetak` | Unduh/cetak surat ber-TTD | Warga | `SF-SR-06` |

> Catatan: `/portal` punya guard `+layout.server.ts`; 6 sub-route di bawahnya mewarisi guard itu.
> Total route publik + portal = **8 halaman**.

### 2.2 Aplikasi Internal (33)

| Route | Fungsi | Aktor | FR |
|---|---|---|---|
| `/(app)/dashboard` | KPI saldo kas, total KK/warga, grafik demografi | admin_rw, bendahara, pengurus_rt | `SF-KS-04`, `SF-KP-07` |
| `/(app)/warga` | *Legacy* — dialihkan ke `/kk` | admin_rw, pengurus_rt | `KP-08` |
| `/(app)/kk` | Daftar KK terkelompok + pencarian | admin_rw, pengurus_rt | `SF-KP-04`, `SF-KP-05` |
| `/(app)/kk/tambah` | Tambah KK + anggota pertama (atomik) | admin_rw, pengurus_rt | `SF-KP-01` |
| `/(app)/kk/[id]` | Detail KK + daftar anggota + riwayat | admin_rw, pengurus_rt | `SF-KP-05` |
| `/(app)/kk/[id]/edit` | Ubah data + alasan perubahan | admin_rw, pengurus_rt | `SF-KP-02`, `SF-KP-03` |
| `/(app)/kk/impor` | Impor CSV massal + laporan baris gagal | admin_rw | `SF-KP-06` |
| `/(app)/kk/rekap` | Rekap demografis + ekspor CSV | admin_rw, pengurus_rt | `SF-KP-07` |
| `/(app)/kk/pembaruan` | Verifikasi pengajuan pembaruan warga | admin_rw, pengurus_rt | `SF-KP-08` |
| `/(app)/surat` | Riwayat surat sesuai lingkup (RT/RW) | admin_rw, pengurus_rt | `SF-SR-07` |
| `/(app)/surat/[id]` | Verifikasi, setujui, tolak, TTD RT | pengurus_rt (RW: pantau) | `SF-SR-04`, `SF-SR-05` |
| `/(app)/surat/[id]/cetak` | PDF resmi + nomor otomatis + TTD tersemat | pengurus_rt | `SF-SR-05`, `SF-SR-06` |
| `/(app)/kas` | Daftar transaksi, saldo, laporan periode | admin_rw, bendahara, pengurus_rt | `SF-KS-04`, `SF-KS-05`, `SF-KS-06` |
| `/(app)/kas/tambah` | Catat pemasukan/pengeluaran + unggah bukti | admin_rw, bendahara, pengurus_rt | `SF-KS-01`, `SF-KS-02`, `SF-KS-03` |
| `/(app)/kas/kategori` | Kelola kategori transaksi | admin_rw, bendahara | `SF-KS-01`, `SF-KS-02` |
| `/(app)/iuran` | Daftar tagihan + status bayar (2 tingkat) | admin_rw, bendahara, pengurus_rt | `SF-IU-03`, `SF-IU-05` |
| `/(app)/iuran/jenis` | Kelola jenis iuran + porsi RW/RT | admin_rw, bendahara | `SF-IU-01` |
| `/(app)/iuran/jenis/[id]` | Ubah jenis iuran | admin_rw, bendahara | `SF-IU-01` |
| `/(app)/iuran/generate` | Terbitkan tagihan otomatis periode berjalan | admin_rw, bendahara | `SF-IU-02` |
| `/(app)/iuran/konfirmasi` | Panel konfirmasi bukti bayar (tab status) | admin_rw, bendahara, pengurus_rt | `SF-IU-03` |
| `/(app)/iuran/rekap` | Rekap penerimaan per RT + status setoran | admin_rw, bendahara | `SF-IU-05` |
| `/(app)/iuran/setoran` | Catat setoran RT → RW + unggah bukti | pengurus_rt, bendahara | `SF-IU-06` |
| `/(app)/iuran/[id]/bayar` | Catat pembayaran manual | admin_rw, bendahara, pengurus_rt | `SF-IU-03` |
| `/(app)/pengumuman` | Daftar pengumuman + status otomatis + galeri | admin_rw, pengurus_rt, bendahara, warga | `SF-PG-03` |
| `/(app)/pengumuman/tambah` | Buat pengumuman (jadwal berkala, thumbnail, lampiran) | admin_rw | `SF-PG-01`, `SF-PG-04` |
| `/(app)/pengumuman/[id]/edit` | Ubah / arsipkan pengumuman | admin_rw | `SF-PG-02` |
| `/(app)/pengaturan` | Ringkasan pengaturan (tab) | admin_rw | `FND-08` |
| `/(app)/pengaturan/pengguna` | Kelola akun + peran | admin_rw | `FND-09`, `SF-NT-02` |
| `/(app)/pengaturan/peran` | RBAC dinamis: peran, izin, scope | admin_rw | `FND-08` |
| `/(app)/pengaturan/pengurus` | Kelola pengurus & jabatan | admin_rw | `W-06` |
| `/(app)/pengaturan/rt` | Kelola RT & petugas RT | admin_rw | `W-06` |
| `/(app)/pengaturan/ttd` | Unggah TTD pejabat (Ketua RT/RW) | admin_rw | `SF-SR-05`, `SR-03b` |
| `/(app)/pengaturan/landing` | Konten landing page + galeri | admin_rw | `W-02` |

> **Catatan untuk 4.2:** urutan screenshot usulan ada di `bab4-plan.md` §4. Halaman yang belum
> selesai (EPIC-2 `Todo`: EV-02, EV-03, EV-BUG-01) harus ditandai, jangan diklaim jadi.

---

## 3. Peta Entitas (26 tabel)

Untuk ERD, kamus data, dan class diagram. Tipe kolom & constraint diambil dari `schema.ts`.

### 3.1 Wilayah & Organisasi (5)

| Tabel | Kolom kunci | Modul |
|---|---|---|
| `rw` | `id`, `nama`, `alamat`, `kelurahan`, `kecamatan`, `kota` | Fondasi |
| `rt` | `id`, `nomor`, `rwId` | Fondasi |
| `petugas_rt` | `id`, `userId`, `rtId` | Fondasi / RBAC |
| `ttd_pejabat` | `id`, `userId`, `url` | Surat |
| `pengurus` | `id`, `rtId`, `jabatan`, `nama`, `fotoUrl`, `urutan`, `aktif` | Publik |

### 3.2 Kependudukan (4)

| Tabel | Kolom (16 pada `warga`) | Modul |
|---|---|---|
| `kk` | `id`, `noKk`, `alamat`, `rtId`, `statusHuni` | Kependudukan |
| `warga` | `id`, `nik`, `nama`, `tempatLahir`, `tanggalLahir`, `jenisKelamin`, `agama`, `pendidikan`, `pekerjaan`, `statusPerkawinan`, `statusHubunganKk`, `kkId`, `aktif`, `userId`, `alasanNonaktif`, `tanggalNonaktif` | Kependudukan |
| `riwayat_warga` | `id`, `wargaId`, `diubahOleh`, `alasan`, `ringkasan`, `tanggal` | Kependudukan (audit) |
| `permintaan_pembaruan` | `id`, `wargaId`, `dataLama`, `dataBaru`, `catatan`, `status`, `catatanPengurus`, `ditinjauOleh`, `tanggalTinjau`, `diajukanOleh` | Kependudukan (alur status) |

### 3.3 Informasi & Publik (5)

| Tabel | Kolom kunci | Modul |
|---|---|---|
| `pengaturan_landing` | 13 kolom: `heroJudul`, `heroSubjudul`, `heroBackground`, `sambutan`, `namaKetua`, `fotoKetua`, `visi`, `misi`, `sejarah`, `alamat`, `telepon`, `email` | Publik |
| `galeri` | `id`, `judul`, `keterangan`, `fotoUrl`, `urutan`, `aktif` | Publik |
| `pengumuman` | 17 kolom: `judul`, `isi`, `kategori`, `tanggalMulai/Selesai`, `tanggalMulaiEvent/SelesaiEvent`, `lokasi`, `periodeUlang`, `intervalHari`, `thumbnailUrl`, `lampiranUrls`, `ditampilkan`, `rwId`, `rtId`, `dibuatOleh` | Informasi |
| `notifikasi` | `id`, `userId`, `judul`, `pesan`, `tipe`, `tautan`, `dibaca`, `channel` | Notifikasi |
| `peran` | `id`, `nama`, `label`, `deskripsi`, `tipe`, `scope`, `permissions`, `sistem`, `superadmin`, `urutan` | RBAC |

### 3.4 Keuangan & Iuran (9)

| Tabel | Kolom kunci | Modul |
|---|---|---|
| `jenis_iuran` | `id`, `nama`, `nominal`, `porsiRw`, `periode`, `scope`, `rtId`, `urutan`, `aktif`, `rwId` | Iuran |
| `paket_iuran` | `id`, `nama`, `keterangan`, `aktif`, `rwId` | Iuran (dipertahankan di skema) |
| `paket_iuran_item` | `id`, `paketId`, `jenisIuranId`, `urutan` | Iuran |
| `tagihan` | `id`, `kkId`, `jenisIuranId`, `periode`, `nominal`, `porsiRw`, `status`, `jatuhTempo` | Iuran |
| `pembayaran` | `id`, `tagihanId`, `jumlah`, `metodeBayar`, `referensi`, `catatan`, `dibayarPada`, `dicatatOleh` | Iuran |
| `pembayaran_online` | `id`, `tagihanId`, `userId`, `orderId`, `jumlah`, `status`, `snapToken`, `snapRedirectUrl`, `paymentType`, `pembayaranId` | Iuran (Midtrans) |
| `konfirmasi_bayar` | `id`, `tagihanId`, `jumlah`, `metodeBayar`, `catatan`, `status`, `diajukanOleh`, `diprosesOleh`, `diprosesPada`, `alasanTolak` | Iuran |
| `kategori_kas` | `id`, `nama`, `jenis`, `scope`, `rwId` | Kas |
| `transaksi_kas` | `id`, `jenis`, `nominal`, `keterangan`, `kategoriId`, `tanggal`, `bukti`, `dicatatOleh`, `dibatalkan`, `alasanBatal`, `dibatalkanOleh`, `rwId` | Kas RW |
| `transaksi_kas_rt` | 18 kolom, termasuk `midtransOrderId`, `midtransPaymentType`, `midtransStatus`, `snapToken` | Kas RT |
| `setoran_rt` | `id`, `rtId`, `periode`, `totalTerkumpul`, `porsiRw`, `catatan`, `bukti`, `disetorPada`, `dicatatOleh`, `transaksiRwId`, `transaksiRtId`, `dibatalkan`, `alasanBatal`, `dibatalkanOleh` | Iuran / Kas |

### 3.5 Surat (1)

| Tabel | Kolom kunci | Modul |
|---|---|---|
| `surat` | 28 kolom: `nomorSurat`, `jenis`, `keperluan`, `dokumenSyarat`, `status`, `catatanPengurus`, `butuhTtdRt`, `butuhTtdRw`, `ttdRt*` (5), `ttdRw*` (5), `diverifikasiOleh`, `disetujuiOleh`, `tanggalTerbit`, `diverifikasiPada`, `disetujuiPada`, `ditolakPada`, `ditolakOleh`, `wargaId` | Surat |

**Relasi inti untuk ERD:**

```
rw 1─n rt 1─n kk 1─n warga
rt 1─n petugas_rt
kk 1─n tagihan 1─n pembayaran
tagihan 1─n pembayaran_online
tagihan 1─n konfirmasi_bayar
jenis_iuran 1─n tagihan
kategori_kas 1─n transaksi_kas
rt 1─n setoran_rt 1─1 transaksi_kas / transaksi_kas_rt
warga 1─n surat
warga 1─n permintaan_pembaruan 1─n riwayat_warga
peran 1─n (permissions JSON, tanpa tabel pivot)
```

**Status untuk state machine (Safira):**

| Entitas | Nilai status |
|---|---|
| `surat.status` | diajukan → diverifikasi → disetujui → terbit / ditolak |
| `tagihan.status` | belum_bayar → sebagian → lunas |
| `permintaan_pembaruan.status` | diajukan → diverifikasi → disetujui / ditolak |
| `konfirmasi_bayar.status` | menunggu → diterima / ditolak |
| `pembayaran_online.status` | pending → settlement / expire / cancel |

---

## 4. Peta FR → Route (34 FR)

| FR | Nama | Route utama |
|---|---|---|
| `SF-KP-01` | Tambah Data Warga | `/kk/tambah` |
| `SF-KP-02` | Ubah Data Warga | `/kk/[id]/edit` |
| `SF-KP-03` | Nonaktifkan Data Warga | `/kk/[id]/edit` |
| `SF-KP-04` | Cari & Saring Data Warga | `/kk` |
| `SF-KP-05` | Lihat Profil Warga | `/kk/[id]` |
| `SF-KP-06` | Impor Data Warga | `/kk/impor` |
| `SF-KP-07` | Rekap Demografis | `/kk/rekap`, `/dashboard` |
| `SF-KP-08` | Pengajuan Pembaruan Data | `/portal/perbaruan`, `/kk/pembaruan` |
| `SF-SR-01` | Ajukan Surat | `/portal/surat/ajukan` |
| `SF-SR-02` | Unggah Persyaratan | `/portal/surat/ajukan` |
| `SF-SR-03` | Pantau Status Pengajuan | `/portal/surat/[id]` |
| `SF-SR-04` | Verifikasi Pengajuan | `/surat/[id]` |
| `SF-SR-05` | Setujui & Terbitkan Surat | `/surat/[id]`, `/surat/[id]/cetak` |
| `SF-SR-06` | Unduh Surat | `/portal/surat/[id]/cetak`, `/surat/[id]/cetak` |
| `SF-SR-07` | Lihat Riwayat Surat | `/surat`, `/portal` |
| `SF-KS-01` | Catat Pemasukan | `/kas/tambah` |
| `SF-KS-02` | Catat Pengeluaran | `/kas/tambah` |
| `SF-KS-03` | Unggah Bukti Transaksi | `/kas/tambah` |
| `SF-KS-04` | Lihat Saldo Kas | `/dashboard`, `/kas` |
| `SF-KS-05` | Laporan Keuangan per Periode | `/kas` |
| `SF-KS-06` | Audit Trail Transaksi | `/kas` (void) |
| `SF-IU-01` | Kelola Jenis Iuran & Porsi | `/iuran/jenis`, `/iuran/jenis/[id]` |
| `SF-IU-02` | Penerbitan Tagihan Otomatis | `/iuran/generate` |
| `SF-IU-03` | Catat Pembayaran & Konfirmasi | `/iuran/konfirmasi`, `/iuran/[id]/bayar` |
| `SF-IU-04` | Pembayaran QRIS & Online | `/portal/iuran`, `api/midtrans/*` |
| `SF-IU-05` | Hierarki 2 Tingkat & Rekap | `/iuran`, `/iuran/rekap`, `/portal` |
| `SF-IU-06` | Alur Setoran RT → RW | `/iuran/setoran` |
| `SF-PG-01` | Buat Pengumuman & Jadwal Berkala | `/pengumuman/tambah` |
| `SF-PG-02` | Ubah & Arsipkan Pengumuman | `/pengumuman/[id]/edit` |
| `SF-PG-03` | Lihat Pengumuman & Galeri | `/pengumuman`, `/` |
| `SF-PG-04` | Notifikasi Pengumuman | `/pengumuman/tambah` → `notifikasi` |
| `SF-NT-01` | Pusat Notifikasi Warga | `/portal` (drawer) |
| `SF-NT-02` | Klaim Akun Kependudukan | `/login`, `/pengaturan/pengguna` |
| `SF-NT-03` | Pemulihan Kata Sandi via Email | `/login` |

> FR tanpa halaman khusus (dipenuhi lewat service/API): `SF-IU-02` (auto-billing saat modul dibuka)
> dan `SF-PG-04` (siaran notifikasi saat pengumuman terbit). Sebutkan ini di 4.3 saat menyusun
> skenario — pengujiannya lewat side effect, bukan layar.

---

## 5. Inventaris Uji (untuk 4.3 Black Box)

### 5.1 Unit test — 100 test, 9 file

| File | Jumlah | Cakupan |
|---|---|---|
| `src/lib/server/guard.test.ts` | 21 | Guard akses, fail-closed, redirect |
| `src/lib/server/scope.test.ts` | 17 | Row-level scoping pengurus_rt |
| `src/lib/server/iuran.test.ts` | 13 | Tagihan, porsi RW/RT, auto-billing |
| `src/lib/server/setoran.test.ts` | 9 | Setoran RT → RW, rekonsiliasi |
| `src/lib/server/akses.test.ts` | 9 | Matriks izin per peran |
| `src/lib/server/kas.test.ts` | 8 | Saldo, void, laporan |
| `src/lib/server/pembayaran.test.ts` | 8 | Konfirmasi bayar, status |
| `src/lib/server/surat-ttd.test.ts` | 8 | TTD, nomor surat, status |
| `src/lib/server/rbac.test.ts` | 7 | Peran dinamis, permission JSON |

### 5.2 E2E — 8 skenario

`e2e/smoke.spec.ts`: alur kritis lintas halaman (login → dashboard → modul).

### 5.3 Pemetaan modul → file uji (untuk tabel 4.3)

| Modul 4.3 | File uji relevan |
|---|---|
| 4.3.1 Autentikasi & RBAC | `guard`, `rbac`, `akses` |
| 4.3.2 Publik & Landing | `e2e/smoke` |
| 4.3.3 Kependudukan | `scope` + `e2e` |
| 4.3.4 Surat-Menyurat | `surat-ttd`, `guard` |
| 4.3.5 Keuangan & Kas | `kas`, `scope` |
| 4.3.6 Iuran & Pembayaran | `iuran`, `pembayaran`, `setoran` |
| 4.3.7 Informasi & Pengumuman | `e2e` (belum ada unit khusus) |
| 4.3.8 Pengaturan & TTD | `rbac`, `akses`, `surat-ttd` |

> **Penting:** 4.3 tetap butuh **tabel skenario Black Box manual** (input, hasil diharapkan, hasil
> aktual, status). Unit/e2e hanya menjadi *tautan bukti*, bukan pengganti tabel.
>
> **Strategi final: CI + Black Box.** Pipeline CI ada di `.github/workflows/ci.yml` dengan dua job:
> `check` (Svelte check → `npm test` 100 unit → `npm run build`) dan `e2e` (setup DB + seed →
> Playwright 8 tes). Yang perlu dilampirkan ke laporan adalah **bukti run** (screenshot/log), bukan
> pipeline-nya. Jangan klaim peer review manual.

---

## 6. Bukti Proses per Epic (untuk 4.1.3–4.1.5)

| Epic | PIC | Kartu Done | Bukti utama |
|---|---|---|---|
| `EPIC-0` Fondasi | Afif | 8 | PR #1 (scaffold), `FND-07` CI (#67), `FND-08` RBAC (#91), `FND-09` notifikasi (#92) |
| `EPIC-1` Publik & Landing | Afif | 2 | `LP-03` (#68), `W-02` PR #77 (`678ccca`) |
| `EPIC-2` Informasi | Alizha | 3 | `EV-01` PR #60 (`c1487b5`), `EV-04` (#99, `d5731c8`) |
| `EPIC-3` Kependudukan | Josua | 9 | `KP-01`/`KP-03` PR #61 (`8009f72`), `KP-08` (#93, `d18065c`) |
| `EPIC-4` Keuangan & Iuran | Safira | 9 | PR #62 (±4.700 baris), `KU-01b` (#65), `KU-05` (#94, `2a1a30c`) |
| `EPIC-5` Surat | Zidan | 9 | `SR-02b` (#70), `SR-03b` PR #90 (`c3fb151`), `SR-06` (#98) |
| Iterasi 2 | — | 9 | #65–#73 |
| Iterasi 3 | — | 4 | #91–#94 |
| Grey-out naik scope | — | 3 | `W-02` #77, `W-03` `2a1a30c`, `W-06` `d4d0b42`/`b085473` |

**Tiga fase (untuk narasi §3.1 `strategi-dokumentasi.md`):**

| Fase | Tanggal | Penanda |
|---|---|---|
| Big-bang | 25 Sep – 11 Okt | `5dbdfe9` (28 Sep): 69 file, 12.229 baris, tanpa papan |
| Retrofit Kanban | 12 – 20 Okt | `17da42b` "terapkan papan Kanban"; `CODEOWNERS` 17 Okt |
| Aliran disiplin | 27 Okt – 3 Nov | PR per kartu #74–#90, CI Vitest + Playwright |

> **Jangan klaim** "branch per fitur sejak awal" atau "selalu ada peer review". PR #83 dibuat
> 21:34:19 dan merge 21:35:59; PR #90 12:04:33 → 12:05:42. Tulis apa adanya: **CI + self-review**,
> tanpa klaim peer review. Kolom Review di papan kosong (temuan F5) — sebutkan sebagai keterbatasan.

---

## 7. Yang Tidak Ada di Kit Ini

| Kebutuhan | Cara mendapatkannya |
|---|---|
| Screenshot halaman | Jalankan `npm run dev`, ambil per route §2 (PIC modul) |
| Narasi fungsi tiap halaman | PIC modul, 1 paragraf per halaman |
| Diagram (BPMN/UML/ArchiMate/ERD) | Generate dari `diagram-prompts.md` + §3 kit ini |
| Tabel skenario Black Box | Alizha + PIC modul, format di `bab4-plan.md` §4 |
| Bukti run CI | Ambil screenshot/log dari tab Actions (Afif) — pipeline sudah ada |
| Data UAT | Dijadwalkan **23–24 Nov 2026** bersama pengurus RW 06 (koordinasi Zidan) |
| Wireframe/hi-fi | `docs/design-preview/` (3 opsi HTML + `design-tokens.css`) |
