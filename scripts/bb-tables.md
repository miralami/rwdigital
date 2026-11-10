
### Autentikasi (SC-01)

| Scenario ID | Case ID | Test | Type | Test Case | Pre Condition | Steps | Steps Description | Expected Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| SC-01 | A-01 | Login | Positif | Pengurus RW login dengan kredensial benar | Akun seed admin@rw.id aktif | 1-4 | 1) Buka /login 2) Isi email admin@rw.id 3) Isi password admin123 4) Klik Masuk | Login berhasil, sesi dibuat, diarahkan ke /dashboard | Pass |
| SC-01 | A-02 | Login | Positif | Pengurus RT login dengan kredensial benar | Akun seed pengurus@rw.id aktif | 1-4 | 1) Buka /login 2) Isi email pengurus@rw.id 3) Isi password pengurus123 4) Klik Masuk | Login berhasil dan diarahkan ke /dashboard | Pass |
| SC-01 | A-03 | Login | Positif | Warga login dengan kredensial benar | Akun seed warga@rw.id aktif | 1-4 | 1) Buka /login 2) Isi email warga@rw.id 3) Isi password warga123 4) Klik Masuk | Login berhasil dan diarahkan ke /portal | Pass |
| SC-01 | A-04 | Login | Negatif | Login dengan password salah | Akun admin@rw.id ada | 1-4 | 1) Buka /login 2) Isi email admin@rw.id 3) Isi password salah123 4) Klik Masuk | Login ditolak, pesan kredensial tidak valid, tidak ada sesi | Pass |
| SC-01 | A-05 | Login | Negatif | Login dengan email tidak terdaftar | Email tidak ada di database | 1-4 | 1) Buka /login 2) Isi email tidakada@rw.id 3) Isi password acak123 4) Klik Masuk | Login ditolak (401), tidak ada sesi | Pass |
| SC-01 | A-06 | Login | Negatif | Login dengan email kosong | Halaman login terbuka | 1-4 | 1) Buka /login 2) Kosongkan email 3) Isi password admin123 4) Klik Masuk | Validasi menolak, login gagal | Pass |
| SC-01 | A-07 | Login | Negatif | Login dengan format email tidak valid | Halaman login terbuka | 1-4 | 1) Buka /login 2) Isi email "bukan-email" 3) Isi password admin123 4) Klik Masuk | Validasi format email menolak (400) | Pass |
| SC-01 | A-08 | Kontrol Akses | Negatif | Buka /dashboard tanpa login | Belum punya sesi | 1 | 1) Buka URL /dashboard langsung | Dialihkan ke /login | Pass |
| SC-01 | A-09 | Kontrol Akses | Negatif | Buka /kk tanpa login | Belum punya sesi | 1 | 1) Buka URL /kk langsung | Dialihkan ke /login | Pass |
| SC-01 | A-10 | Kontrol Akses | Negatif | Buka /portal tanpa login | Belum punya sesi | 1 | 1) Buka URL /portal langsung | Dialihkan ke /login | Pass |
| SC-01 | A-11 | Login | Negatif | Halaman login dibuka saat sudah login | Sesi admin aktif | 1-2 | 1) Login sebagai admin 2) Buka /login | Halaman login tetap tampil tanpa error (200) | Pass |
| SC-01 | A-12 | Logout | Positif | Logout menghapus sesi | Sesi admin aktif | 1-3 | 1) Login sebagai admin 2) Panggil sign-out 3) Buka /dashboard | Sesi berakhir dan /dashboard dialihkan ke /login | Pass |

### Klaim Akun (SC-02)

| Scenario ID | Case ID | Test | Type | Test Case | Pre Condition | Steps | Steps Description | Expected Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| SC-02 | K-01 | Klaim | Negatif | Klaim tanpa mengisi kolom lengkap | Halaman klaim tersedia | 1-3 | 1) Buka /login mode klaim 2) Kosongkan NIK/No KK/tanggal lahir 3) Kirim | Server menolak dengan 400 dan pesan kolom wajib | **Fail** |
| SC-02 | K-02 | Klaim | Negatif | Klaim dengan password kurang dari 6 karakter | Data warga valid tersedia | 1-4 | 1) Buka mode klaim 2) Isi data valid 3) Isi password 123 4) Kirim | Server menolak dengan 400, pesan minimal 6 karakter | **Fail** |
| SC-02 | K-03 | Klaim | Negatif | Klaim dengan NIK tidak cocok dengan No KK | Data kependudukan seed ada | 1-4 | 1) Buka mode klaim 2) Isi NIK warga lain 3) Isi No KK yang tidak berpasangan 4) Kirim | Server menolak, data kependudukan tidak cocok | **Fail** |
| SC-02 | K-04 | Klaim | Negatif | Klaim akun yang sudah pernah diklaim | Warga Bambang sudah punya user | 1-4 | 1) Buka mode klaim 2) Isi NIK/No KK/tanggal lahir Bambang 3) Isi email & password 4) Kirim | Server menolak karena akun sudah diklaim | **Fail** |
| SC-02 | K-05 | Klaim | Positif | Klaim akun warga yang belum terhubung dengan data benar | Warga Agus Setiawan belum punya akun | 1-6 | 1) Buka mode klaim 2) Isi NIK 3276010101850002 3) Isi No KK 3276010101000002 4) Isi tanggal lahir 1985-05-15 5) Isi email & password valid 6) Kirim | Klaim berhasil, akun warga dibuat dan tertaut | **Fail** |

### Dashboard (SC-03)

| Scenario ID | Case ID | Test | Type | Test Case | Pre Condition | Steps | Steps Description | Expected Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| SC-03 | D-01 | Akses | Positif | Pengurus RW membuka dashboard | Login admin | 1-2 | 1) Login admin@rw.id 2) Buka /dashboard | Halaman dashboard tampil (200) | Pass |
| SC-03 | D-02 | Akses | Positif | Pengurus RT membuka dashboard | Login pengurus RT | 1-2 | 1) Login pengurus@rw.id 2) Buka /dashboard | Dashboard tampil dengan data scope RT 01 | Pass |
| SC-03 | D-03 | Akses | Negatif | Warga membuka dashboard staf | Login warga | 1-2 | 1) Login warga@rw.id 2) Buka /dashboard | Dialihkan ke /portal | Pass |

### Kependudukan (SC-04)

| Scenario ID | Case ID | Test | Type | Test Case | Pre Condition | Steps | Steps Description | Expected Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| SC-04 | W-01 | Akses | Positif | Pengurus RW membuka daftar KK | Login admin | 1-2 | 1) Login admin 2) Buka /kk | Daftar KK tampil (200) | Pass |
| SC-04 | W-02 | Akses | Positif | Pengurus RT membuka daftar KK | Login pengurus RT | 1-2 | 1) Login pengurus RT 2) Buka /kk | Daftar KK scoped RT 01 tampil (200) | Pass |
| SC-04 | W-03 | Akses | Negatif | Warga membuka modul KK | Login warga | 1-2 | 1) Login warga 2) Buka /kk | Dialihkan ke /portal | Pass |
| SC-04 | W-04 | Detail | Positif | Pengurus RW membuka detail KK | KK id 1 ada | 1-2 | 1) Login admin 2) Buka /kk/1 | Detail KK tampil (200) | Pass |
| SC-04 | W-05 | Detail | Negatif | Membuka detail KK dengan ID tidak ada | ID 99999 tidak ada | 1-2 | 1) Login admin 2) Buka /kk/99999 | Tidak crash: 404 atau dialihkan ke /kk | Pass |
| SC-04 | W-06 | Otorisasi | Negatif | Pengurus RT 01 membuka KK milik RT 02 | KK id 4 milik RT 02 | 1-2 | 1) Login pengurus RT 01 2) Buka /kk/4 | Akses ditolak (403) | Pass |
| SC-04 | W-07 | Tambah KK | Negatif | Tambah KK dengan semua field kosong | Form tambah KK terbuka | 1-3 | 1) Buka /kk/tambah 2) Kosongkan semua field 3) Simpan | Validasi menolak, pesan No. KK 16 digit | Pass |
| SC-04 | W-08 | Tambah KK | Negatif | Tambah KK dengan No. KK 15 digit | Form tambah KK terbuka | 1-3 | 1) Isi No KK 15 digit 2) Isi alamat & RT 3) Simpan | Validasi menolak panjang No. KK | Pass |
| SC-04 | W-09 | Tambah KK | Negatif | Tambah KK dengan No. KK duplikat | No KK 3276010101000001 sudah ada | 1-3 | 1) Isi No KK yang sudah terdaftar 2) Isi alamat & RT 3) Simpan | Server menolak duplikasi | Pass |
| SC-04 | W-10 | Tambah KK | Negatif | Tambah KK tanpa memilih RT | Form tambah KK terbuka | 1-4 | 1) Isi No KK valid 2) Isi alamat 3) Kosongkan RT 4) Simpan | Validasi menolak RT wajib dipilih | Pass |
| SC-04 | W-11 | Tambah KK | Positif | Tambah KK baru dengan satu anggota valid | No KK & NIK baru belum terdaftar | 1-5 | 1) Buka /kk/tambah 2) Isi No KK 16 digit 3) Isi alamat & RT 4) Isi 1 anggota valid 5) Simpan | KK tersimpan dan diarahkan ke /kk | Pass |
| SC-04 | W-12 | Tambah KK | Negatif | Tambah KK dengan NIK anggota 15 digit | Form tambah KK terbuka | 1-3 | 1) Isi No KK valid 2) Isi anggota dengan NIK 15 digit 3) Simpan | Validasi menolak NIK 16 digit | Pass |
| SC-04 | W-13 | Tambah KK | Negatif | Tambah KK dengan NIK anggota duplikat | NIK 3276010101800001 sudah ada | 1-3 | 1) Isi No KK baru 2) Isi anggota dengan NIK terdaftar 3) Simpan | Server menolak duplikasi NIK | Pass |
| SC-04 | W-14 | Edit Warga | Negatif | Edit warga dengan alasan kurang dari 5 karakter | Warga id 2 ada | 1-3 | 1) Buka /kk/2/edit 2) Isi alasan "abc" 3) Simpan | Validasi menolak alasan minimal 5 karakter | Pass |
| SC-04 | W-15 | Edit Warga | Positif | Edit data warga dengan data valid | Warga id 2 ada | 1-3 | 1) Buka /kk/2/edit 2) Ubah nama & alasan valid 3) Simpan | Data tersimpan dan diarahkan ke detail | Pass |
| SC-04 | W-16 | Impor CSV | Negatif | Impor CSV tanpa memilih berkas | Form impor terbuka | 1-2 | 1) Buka /kk/impor 2) Kirim tanpa file | Ditolak, pesan pilih berkas CSV | Pass |
| SC-04 | W-17 | Impor CSV | Negatif | Impor CSV hanya berisi header | File CSV tanpa baris data | 1-3 | 1) Buka /kk/impor 2) Unggah CSV header saja 3) Kirim | Ditolak, tidak ada data untuk diimpor | Pass |
| SC-04 | W-18 | Impor CSV | Positif | Impor CSV berisi satu warga valid | NIK & No KK baru | 1-3 | 1) Buka /kk/impor 2) Unggah CSV valid 3) Kirim | Data berhasil diimpor, ada ringkasan berhasil | Pass |
| SC-04 | W-19 | Pembaruan Data | Negatif | Tinjau permintaan pembaruan dengan aksi tidak valid | Login pengurus | 1-3 | 1) POST /kk/pembaruan?/tinjau 2) aksi=hapus 3) id=1 | Ditolak parameter tidak valid | Pass |
| SC-04 | W-20 | Pembaruan Data | Negatif | Tinjau permintaan pembaruan yang tidak ada | ID 99999 tidak ada | 1-3 | 1) POST /kk/pembaruan?/tinjau 2) aksi=setujui 3) id=99999 | Ditolak, permintaan tidak ditemukan | Pass |
| SC-04 | W-21 | Redirect | Positif | /warga dialihkan ke /kk | Login admin | 1 | 1) Buka /warga | Redirect 301 ke /kk | Pass |

### Kas (SC-05)

| Scenario ID | Case ID | Test | Type | Test Case | Pre Condition | Steps | Steps Description | Expected Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| SC-05 | KS-01 | Akses | Positif | Pengurus RW membuka halaman kas | Login admin | 1-2 | 1) Login admin 2) Buka /kas | Halaman kas tampil (200) | Pass |
| SC-05 | KS-02 | Akses | Positif | Pengurus RT membuka halaman kas | Login pengurus RT | 1-2 | 1) Login pengurus RT 2) Buka /kas | Halaman kas tampil (200) | Pass |
| SC-05 | KS-03 | Akses | Negatif | Warga membuka halaman kas | Login warga | 1-2 | 1) Login warga 2) Buka /kas | Dialihkan ke /portal | Pass |
| SC-05 | KS-04 | Kas RW | Negatif | Tambah kas RW dengan nominal 0 | Login admin | 1-4 | 1) Buka /kas 2) Tambah transaksi 3) Nominal 0 4) Simpan | Validasi menolak nominal harus > 0 | Pass |
| SC-05 | KS-05 | Kas RW | Negatif | Tambah kas RW dengan nominal negatif | Login admin | 1-3 | 1) Tambah transaksi 2) Nominal -1000 3) Simpan | Validasi menolak nominal negatif | Pass |
| SC-05 | KS-06 | Kas RW | Negatif | Tambah kas RW tanpa keterangan | Login admin | 1-4 | 1) Tambah transaksi 2) Nominal 5000 3) Kosongkan keterangan 4) Simpan | Validasi menolak keterangan wajib | Pass |
| SC-05 | KS-07 | Kas RW | Positif | Tambah kas RW valid | Login admin | 1-4 | 1) Tambah transaksi 2) Jenis pemasukan, nominal 5000 3) Keterangan diisi 4) Simpan | Transaksi tersimpan, saldo bertambah | Pass |
| SC-05 | KS-08 | Kas RW | Negatif | Pengurus RT menambah Kas RW | Login pengurus RT | 1-2 | 1) Login pengurus RT 2) POST tambahKasRw | Ditolak 403, hanya Pengurus RW | Pass |
| SC-05 | KS-09 | Kas RT | Positif | Pengurus RT menambah Kas RT sendiri | Login pengurus RT 01 | 1-4 | 1) Tambah kas RT 2) RT 01, nominal 5000 3) Keterangan diisi 4) Simpan | Transaksi Kas RT tersimpan | Pass |
| SC-05 | KS-10 | Kas RT | Negatif | Tambah Kas RT tanpa keterangan & nominal | Login pengurus RT | 1-3 | 1) Tambah kas RT 2) Kosongkan nominal & keterangan 3) Simpan | Ditolak, field wajib | Pass |
| SC-05 | KS-11 | Kategori | Negatif | Pengurus RT menambah kategori kas | Login pengurus RT | 1 | 1) POST tambahKategori | Ditolak 403, hanya Pengurus RW | Pass |
| SC-05 | KS-12 | Kategori | Negatif | Tambah kategori kas tanpa nama | Login admin | 1-2 | 1) POST tambahKategori 2) nama kosong | Ditolak, nama kategori wajib | Pass |
| SC-05 | KS-13 | Kategori | Positif | Tambah kategori kas valid | Login admin | 1-3 | 1) POST tambahKategori 2) nama "Kategori Blackbox" 3) jenis pemasukan | Kategori tersimpan | Pass |
| SC-05 | KS-14 | Kategori | Negatif | Hapus kategori yang masih dipakai transaksi | Kategori hasil KS-13 dipakai satu transaksi | 1-2 | 1) Buat transaksi dengan kategori tsb 2) POST hapusKategori id tsb | Ditolak, kategori masih digunakan | Pass |
| SC-05 | KS-15 | Kategori | Negatif | Hapus kategori dengan ID tidak valid | Login admin | 1 | 1) POST hapusKategori id=0 | Ditolak ID tidak valid | Pass |
| SC-05 | KS-16 | Setoran RT | Negatif | Catat setoran RT dengan periode salah format | Login admin | 1-2 | 1) POST catatSetoranRt 2) periode 2026/11 | Ditolak format YYYY-MM | Pass |
| SC-05 | KS-17 | Setoran RT | Negatif | Catat setoran RT dengan jumlah KK 0 | Login admin | 1-2 | 1) POST catatSetoranRt 2) jumlahKkDisetor 0 | Ditolak, minimal 1 | Pass |
| SC-05 | KS-18 | Kas RW | Negatif | Batalkan transaksi kas dengan ID tidak ada | Login admin | 1-2 | 1) POST batalkanKasRw 2) transaksiId 99999 | Ditolak, transaksi tidak ditemukan | **Fail** |

### Iuran (SC-06)

| Scenario ID | Case ID | Test | Type | Test Case | Pre Condition | Steps | Steps Description | Expected Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| SC-06 | I-01 | Akses | Positif | Pengurus RW membuka halaman iuran | Login admin | 1 | 1) Buka /iuran | Halaman iuran tampil (200) | Pass |
| SC-06 | I-02 | Akses | Positif | Pengurus RT membuka halaman iuran | Login pengurus RT | 1 | 1) Buka /iuran | Halaman iuran scoped RT tampil (200) | Pass |
| SC-06 | I-03 | Akses | Negatif | Warga membuka modul iuran staf | Login warga | 1 | 1) Buka /iuran | Dialihkan ke /portal | Pass |
| SC-06 | I-04 | Jenis Iuran | Negatif | Tambah jenis iuran tanpa nama | Login admin | 1-3 | 1) POST /iuran/jenis?/tambah 2) nama kosong 3) nominal 50000 | Ditolak, nama wajib diisi | Pass |
| SC-06 | I-05 | Jenis Iuran | Negatif | Tambah jenis iuran dengan nominal 0 | Login admin | 1-3 | 1) POST tambah jenis 2) nama valid 3) nominal 0 | Ditolak, nominal harus > 0 | Pass |
| SC-06 | I-06 | Jenis Iuran | Negatif | Tambah jenis iuran dengan porsi RW negatif | Login admin | 1-2 | 1) POST tambah jenis 2) porsiRw -10 | Ditolak, porsi tidak boleh negatif | Pass |
| SC-06 | I-07 | Jenis Iuran | Negatif | Tambah jenis iuran dengan periode tidak valid | Login admin | 1-2 | 1) POST tambah jenis 2) periode harian | Ditolak, enum periode | Pass |
| SC-06 | I-08 | Jenis Iuran | Positif | Tambah jenis iuran valid | Login admin | 1-4 | 1) POST tambah jenis 2) nama unik 3) nominal 25000 4) periode bulanan | Jenis iuran tersimpan | Pass |
| SC-06 | I-09 | Jenis Iuran | Negatif | Hapus jenis iuran yang sudah dipakai tagihan | Jenis id 1 punya tagihan | 1 | 1) POST /iuran/jenis?/hapus id=1 | Ditolak, jenis masih digunakan | Pass |
| SC-06 | I-10 | Jenis Iuran | Negatif | Pengurus RT mengubah jenis iuran milik RW | Jenis id 1 scope RW global | 1-2 | 1) Login pengurus RT 2) POST /iuran/jenis?/ubah id=1 | Ditolak 403, bukan milik RT | Pass |
| SC-06 | I-11 | Generate Tagihan | Negatif | Generate tagihan dengan format periode salah | Login admin | 1-2 | 1) POST /iuran/generate 2) periode 2026-1 | Ditolak, format YYYY-MM | Pass |
| SC-06 | I-12 | Generate Tagihan | Negatif | Pengurus RT menagih RT lain | Login pengurus RT 01 | 1-2 | 1) POST generate 2) rtId 2 | Ditolak 403, hanya RT tugas | Pass |
| SC-06 | I-13 | Generate Tagihan | Positif | Generate tagihan periode baru | Login admin | 1-3 | 1) POST generate 2) periode 2027-03 3) jenis id 1 | Tagihan dibuat untuk KK aktif | Pass |
| SC-06 | I-14 | Generate Tagihan | Negatif | Generate tagihan tanpa memilih jenis | Login admin | 1-3 | 1) POST generate 2) periode 2027-05 3) jenis kosong | Ditolak, pilih minimal satu jenis | Pass |
| SC-06 | I-15 | Pembayaran | Negatif | Catat pembayaran tagihan dengan jumlah 0 | Tagihan id 2 belum bayar | 1-3 | 1) Buka /iuran/2/bayar 2) Jumlah 0 3) Simpan | Ditolak, jumlah harus > 0 | Pass |
| SC-06 | I-16 | Pembayaran | Negatif | Catat pembayaran melebihi sisa tagihan | Tagihan id 2 nominal 50000 | 1-3 | 1) Buka /iuran/2/bayar 2) Jumlah 999999 3) Simpan | Ditolak, jumlah melebihi sisa | Pass |
| SC-06 | I-17 | Pembayaran | Negatif | Catat pembayaran dengan metode tidak valid | Tagihan id 2 | 1-2 | 1) POST bayar 2) metodeBayar=kripto | Ditolak, enum metode | Pass |
| SC-06 | I-18 | Pembayaran | Positif | Catat pembayaran tagihan valid | Tagihan id 2 belum bayar | 1-4 | 1) Buka /iuran/2/bayar 2) Jumlah 50000 3) Metode tunai 4) Simpan | Pembayaran tercatat, status lunas | Pass |
| SC-06 | I-19 | Pembayaran | Negatif | Catat pembayaran untuk tagihan tidak ada | ID 99999 tidak ada | 1 | 1) POST /iuran/99999/bayar | Ditolak 404 | **Fail** |
| SC-06 | I-20 | Rekap | Positif | Membuka rekap iuran | Login admin | 1 | 1) Buka /iuran/rekap | Rekap tampil (200) | Pass |
| SC-06 | I-21 | Konfirmasi | Negatif | Tolak konfirmasi dengan alasan > 300 karakter | Konfirmasi id tidak ada tetap validasi alasan | 1-2 | 1) POST /iuran/konfirmasi?/tolak 2) alasan 301 char | Ditolak, alasan terlalu panjang | Pass |
| SC-06 | I-22 | Konfirmasi | Negatif | Terima konfirmasi yang tidak ada | ID 99999 tidak ada | 1 | 1) POST /iuran/konfirmasi?/terima id=99999 | Ditolak, konfirmasi tidak ditemukan | Pass |
| SC-06 | I-23 | Setoran | Negatif | Setoran RT dengan periode salah format | Login admin | 1-2 | 1) POST /iuran/setoran?/setor 2) periode 2026/11 | Ditolak format YYYY-MM | Pass |
| SC-06 | I-24 | Setoran | Positif | Setoran RT valid | Login admin | 1-3 | 1) POST setor 2) RT 01 periode 2026-11 3) tanggal valid | Setoran tercatat | Pass |
| SC-06 | I-25 | Setoran | Negatif | Batalkan setoran dengan ID tidak ada | Login admin | 1-2 | 1) POST /iuran/setoran?/batalkan 2) id 99999 | Ditolak, setoran tidak ditemukan | Pass |
| SC-06 | M-11 | Konfirmasi | Positif | Terima konfirmasi pembayaran warga | Konfirmasi PT-17 menunggu | 1-3 | 1) Login admin 2) Buka konfirmasi 3) Terima | Pembayaran tercatat, konfirmasi diterima | Pass |
| SC-06 | M-12 | Konfirmasi | Positif | Tolak konfirmasi pembayaran warga dengan alasan | Buat konfirmasi baru pada tagihan 10 | 1-4 | 1) Login warga 2) Ajukan konfirmasi tagihan 10 3) Login admin 4) Tolak dengan alasan | Konfirmasi berstatus ditolak | Pass |

### Pengumuman (SC-07)

| Scenario ID | Case ID | Test | Type | Test Case | Pre Condition | Steps | Steps Description | Expected Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| SC-07 | P-01 | Akses | Positif | Pengurus RW membuka daftar pengumuman | Login admin | 1 | 1) Buka /pengumuman | Daftar pengumuman tampil (200) | Pass |
| SC-07 | P-02 | Akses | Negatif | Warga membuka modul pengumuman staf | Login warga | 1 | 1) Buka /pengumuman | Dialihkan ke /portal | Pass |
| SC-07 | P-03 | Tambah | Negatif | Buat pengumuman tanpa judul & isi | Login admin | 1-3 | 1) Buka /pengumuman/tambah 2) Kosongkan judul & isi 3) Simpan | Ditolak, judul & isi wajib | Pass |
| SC-07 | P-04 | Tambah | Negatif | Buat pengumuman dengan tanggal selesai event sebelum mulai | Login admin | 1-4 | 1) Isi judul & isi 2) Mulai event 2026-12-10 3) Selesai event 2026-12-01 4) Simpan | Ditolak, tanggal selesai tidak boleh sebelum mulai | Pass |
| SC-07 | P-05 | Tambah | Negatif | Buat pengumuman dengan kategori tidak valid | Login admin | 1-3 | 1) Isi judul & isi 2) kategori=gosip 3) Simpan | Ditolak, enum kategori | Pass |
| SC-07 | P-06 | Tambah | Negatif | Buat pengumuman dengan tanggal selesai event tanpa tanggal mulai | Login admin | 1-3 | 1) Isi judul & isi 2) Hanya isi tanggal selesai event 3) Simpan | Ditolak, tanggal mulai wajib | Pass |
| SC-07 | P-07 | Tambah | Positif | Buat pengumuman valid dan tampilkan | Login admin | 1-5 | 1) Isi judul unik 2) Isi isi pengumuman 3) kategori umum 4) Centang tampilkan 5) Simpan | Pengumuman tersimpan dan notifikasi disiarkan | Pass |
| SC-07 | P-08 | Edit | Negatif | Edit pengumuman dengan tanggal selesai event sebelum mulai | Pengumuman hasil P-07 ada | 1-3 | 1) Buka edit 2) Ubah tanggal event tidak valid 3) Simpan | Ditolak validasi tanggal | Pass |
| SC-07 | P-09 | Edit | Positif | Edit pengumuman dengan data valid | Pengumuman hasil P-07 ada | 1-3 | 1) Buka edit 2) Ubah judul 3) Simpan | Perubahan tersimpan | Pass |
| SC-07 | P-10 | Toggle | Positif | Sembunyikan/tampilkan pengumuman | Pengumuman ada | 1 | 1) Klik toggle visibilitas | Status tampil berubah | Pass |
| SC-07 | P-11 | Otorisasi | Negatif | Pengurus RT menghapus pengumuman milik RW | Pengumuman RW (rtId null) ada | 1-2 | 1) Login pengurus RT 2) POST hapus id pengumuman RW | Ditolak 403, hanya pengumuman RT sendiri | Pass |
| SC-07 | P-12 | Hapus | Positif | Hapus pengumuman milik sendiri | Pengumuman hasil P-07 ada | 1 | 1) Klik hapus | Pengumuman terhapus | Pass |
| SC-07 | P-13 | Hapus | Negatif | Hapus pengumuman dengan ID tidak valid | Login admin | 1 | 1) POST hapus id=0 | Ditolak ID tidak valid | Pass |

### Surat (SC-08)

| Scenario ID | Case ID | Test | Type | Test Case | Pre Condition | Steps | Steps Description | Expected Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| SC-08 | S-01 | Akses | Positif | Pengurus RW membuka daftar surat | Login admin | 1 | 1) Buka /surat | Daftar surat tampil (200) | Pass |
| SC-08 | S-02 | Akses | Negatif | Warga membuka modul surat staf | Login warga | 1 | 1) Buka /surat | Dialihkan ke /portal | Pass |
| SC-08 | S-03 | Ajukan | Negatif | Ajukan surat dengan jenis tidak valid | Login warga | 1-4 | 1) Buka /portal/surat/ajukan 2) jenis=surat-sakti 3) keperluan valid 4) pilih TTD RT | Ditolak, jenis surat tidak valid | Pass |
| SC-08 | S-04 | Ajukan | Negatif | Ajukan surat dengan keperluan kurang dari 5 karakter | Login warga | 1-4 | 1) Buka ajukan surat 2) keperluan "abc" 3) jenis skck 4) pilih TTD RT | Ditolak, minimal 5 karakter | Pass |
| SC-08 | S-05 | Ajukan | Negatif | Ajukan surat tanpa memilih pihak penanda tangan | Login warga | 1-4 | 1) Buka ajukan surat 2) jenis skck 3) keperluan valid 4) tidak centang RT/RW | Ditolak, pilih minimal satu pihak | Pass |
| SC-08 | S-06 | Ajukan | Positif | Ajukan surat valid dengan TTD RT | Login warga | 1-5 | 1) Buka ajukan surat 2) jenis skck 3) keperluan valid 4) centang TTD RT 5) Kirim | Surat tersimpan status diajukan | Pass |
| SC-08 | S-07 | Tanda Tangan | Positif | Pengurus RT menandatangani surat RT-nya | Surat S-06 butuh TTD RT | 1-3 | 1) Login pengurus RT 2) Buka surat 3) Klik tandatangani | Surat terbit (jika TTD lengkap) | Pass |
| SC-08 | S-08 | Tanda Tangan | Negatif | Pengurus RW menandatangani surat yang tidak meminta TTD RW | Surat id 3 hanya butuh TTD RT | 1-2 | 1) Login admin 2) POST tandatangani surat id 3 | Ditolak 403, surat tidak meminta TTD RW | Pass |
| SC-08 | S-09 | Tolak | Negatif | Pengurus RW menolak surat yang tidak meminta TTD RW | Surat id 3 hanya butuh TTD RT | 1-2 | 1) Login admin 2) POST tolak surat id 3 | Ditolak 403 | Pass |
| SC-08 | S-10 | Tolak | Positif | Pengurus RT menolak surat RT-nya | Surat id 3 diajukan, butuh TTD RT | 1-3 | 1) Login pengurus RT 2) POST tolak surat id 3 3) isi alasan | Surat berstatus ditolak | Pass |
| SC-08 | S-11 | Tolak | Negatif | Menolak surat yang sudah terbit | Surat id 1 status terbit | 1-2 | 1) Login pengurus RT 2) POST tolak surat id 1 | Ditolak, surat terbit tidak bisa diubah | Pass |
| SC-08 | S-12 | Cetak | Positif | Cetak surat yang sudah terbit | Surat id 1 terbit | 1 | 1) Buka /surat/1/cetak | Dialihkan ke halaman cetak portal dan halaman cetak tampil | Pass |
| SC-08 | S-13 | Detail | Negatif | Warga membuka surat milik warga lain lewat portal | Surat id 3 milik warga 1; akun warga baru tertaut warga 3 | 1-3 | 1) Buat akun warga tertaut warga 3 2) Login akun itu 3) Buka /portal/surat/3 | 404, bukan pemilik surat | Pass |

### Pengaturan (SC-09)

| Scenario ID | Case ID | Test | Type | Test Case | Pre Condition | Steps | Steps Description | Expected Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| SC-09 | R-01 | Akses | Positif | Pengurus RW membuka /pengaturan/pengguna | Login admin | 1 | 1) Buka /pengaturan/pengguna | Halaman tampil (200) | Pass |
| SC-09 | R-02 | Akses | Positif | Pengurus RW membuka /pengaturan/rt | Login admin | 1 | 1) Buka /pengaturan/rt | Halaman tampil (200) | Pass |
| SC-09 | R-03 | Akses | Positif | Pengurus RW membuka /pengaturan/pengurus | Login admin | 1 | 1) Buka /pengaturan/pengurus | Halaman tampil (200) | Pass |
| SC-09 | R-04 | Akses | Positif | Pengurus RW membuka /pengaturan/landing | Login admin | 1 | 1) Buka /pengaturan/landing | Halaman tampil (200) | Pass |
| SC-09 | R-05 | Akses | Positif | Pengurus RW membuka /pengaturan/ttd | Login admin | 1 | 1) Buka /pengaturan/ttd | Halaman tampil (200) | Pass |
| SC-09 | R-06 | Otorisasi | Negatif | Pengurus RT membuka /pengaturan/pengguna | Login pengurus RT | 1 | 1) Buka /pengaturan/pengguna | Ditolak 403, area Pengaturan hanya admin | Pass |
| SC-09 | R-07 | Otorisasi | Negatif | Pengurus RT membuka /pengaturan/rt | Login pengurus RT | 1 | 1) Buka /pengaturan/rt | Ditolak 403, area Pengaturan hanya admin | Pass |
| SC-09 | R-08 | Otorisasi | Negatif | Pengurus RT membuka /pengaturan/pengurus | Login pengurus RT | 1 | 1) Buka /pengaturan/pengurus | Ditolak 403, area Pengaturan hanya admin | Pass |
| SC-09 | R-09 | Otorisasi | Negatif | Warga membuka area Pengaturan | Login warga | 1 | 1) Buka /pengaturan/rt | Akses ditolak (403) atau dialihkan ke /portal | Pass |
| SC-09 | R-10 | Otorisasi | Negatif | Tanpa login membuka area Pengaturan | Belum punya sesi | 1 | 1) Buka /pengaturan/pengguna | Akses ditolak (403) atau dialihkan ke /login | Pass |
| SC-09 | R-11 | Pengguna | Negatif | Buat akun dengan email tidak valid | Login admin | 1-5 | 1) POST tambah 2) email "abc" 3) password valid 4) name valid 5) role warga | Ditolak, email tidak valid | Pass |
| SC-09 | R-12 | Pengguna | Negatif | Buat akun dengan password kurang dari 8 karakter | Login admin | 1-2 | 1) POST tambah 2) password 123 | Ditolak, minimal 8 karakter | Pass |
| SC-09 | R-13 | Pengguna | Negatif | Buat akun dengan nama kosong | Login admin | 1-2 | 1) POST tambah 2) name kosong | Ditolak, nama wajib | Pass |
| SC-09 | R-14 | Pengguna | Negatif | Buat akun dengan slug role tidak valid | Login admin | 1-2 | 1) POST tambah 2) role "admin super" | Ditolak, format role tidak valid | Pass |
| SC-09 | R-15 | Pengguna | Positif | Buat akun pengurus baru valid | Login admin | 1-5 | 1) POST tambah 2) email unik 3) password valid 4) name valid 5) role pengurus_rw | Akun berhasil dibuat | Pass |
| SC-09 | R-16 | RT | Negatif | Tambah RT dengan nomor 0 | Login admin | 1-2 | 1) POST /pengaturan/rt?/tambah 2) nomor 0 | Ditolak, minimal 1 | Pass |
| SC-09 | R-17 | RT | Negatif | Tambah RT dengan nomor 100 | Login admin | 1-2 | 1) POST tambah RT 2) nomor 100 | Ditolak, maksimal 99 | Pass |
| SC-09 | R-18 | RT | Negatif | Tambah RT dengan nomor yang sudah ada | RT 01 sudah ada | 1-2 | 1) POST tambah RT 2) nomor 1 | Ditolak, RT sudah ada | Pass |
| SC-09 | R-19 | RT | Positif | Tambah RT baru valid | Login admin | 1-2 | 1) POST tambah RT 2) nomor 88 | RT baru dibuat | Pass |
| SC-09 | R-20 | RT | Negatif | Hapus RT yang masih punya KK | RT id 1 punya KK | 1 | 1) POST hapus RT id=1 | Ditolak, RT masih dipakai | Pass |
| SC-09 | R-21 | Pengurus | Negatif | Tambah pengurus tanpa nama | Login admin | 1-2 | 1) POST /pengaturan/pengurus?/tambah 2) nama kosong | Ditolak, nama wajib | Pass |
| SC-09 | R-22 | Pengurus | Positif | Tambah pengurus valid | Login admin | 1-4 | 1) POST tambah pengurus 2) jabatan Ketua 3) nama valid 4) RT 01 | Pengurus tersimpan | Pass |
| SC-09 | R-23 | Landing | Negatif | Simpan landing dengan background berbahaya | Login admin | 1-2 | 1) POST /pengaturan/landing?/simpan 2) heroBackground javascript:alert(1) | Ditolak, hanya hex/upload | Pass |
| SC-09 | R-24 | Landing | Positif | Simpan landing dengan warna hex valid | Login admin | 1-2 | 1) POST simpan 2) heroBackground #0f172a | Pengaturan landing tersimpan | Pass |
| SC-09 | R-25 | Peran | Positif | /pengaturan/peran dialihkan ke pengguna | Login admin | 1 | 1) Buka /pengaturan/peran | Redirect 301 ke /pengaturan/pengguna | Pass |
| SC-09 | R-26 | Peran | Negatif | Tambah peran dengan slug tidak valid | Login admin | 1-2 | 1) POST tambahPeran 2) nama "Peran Baru!" | Ditolak, slug tidak valid | Pass |

### Portal Warga (SC-10)

| Scenario ID | Case ID | Test | Type | Test Case | Pre Condition | Steps | Steps Description | Expected Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| SC-10 | PT-01 | Akses | Positif | Warga membuka portal | Login warga | 1 | 1) Buka /portal | Portal tampil (200) | Pass |
| SC-10 | PT-02 | Akses | Positif | Staff membuka portal sebagai preview | Login admin | 1 | 1) Buka /portal | Portal tampil (200), tidak dialihkan | Pass |
| SC-10 | PT-03 | Notifikasi | Negatif | Ambil notifikasi tanpa login | Belum punya sesi | 1 | 1) GET /api/notifikasi | Ditolak 401 | Pass |
| SC-10 | PT-04 | Notifikasi | Positif | Ambil notifikasi sebagai warga | Login warga | 1 | 1) GET /api/notifikasi | Daftar notifikasi + unreadCount (200) | Pass |
| SC-10 | PT-05 | Notifikasi | Negatif | Tandai notifikasi milik user lain | Login warga, id 99999 | 1 | 1) POST /api/notifikasi id=99999 | Tidak mengubah notifikasi orang lain (200, aman) | Pass |
| SC-10 | PT-06 | Pembaruan Data | Negatif | Ajukan pembaruan dengan format tanggal salah | Login warga | 1-3 | 1) Buka /portal/perbaruan 2) tanggalLahir 2020/01/01 3) Kirim | Ditolak 422 format YYYY-MM-DD | Pass |
| SC-10 | PT-07 | Pembaruan Data | Negatif | Ajukan pembaruan tanpa mengubah data | Login warga | 1-3 | 1) Buka /portal/perbaruan 2) Kosongkan semua field 3) Kirim | Ditolak, tidak ada data diubah | Pass |
| SC-10 | PT-08 | Pembaruan Data | Positif | Ajukan pembaruan data warga valid | Login warga, tidak ada permintaan aktif | 1-3 | 1) Buka /portal/perbaruan 2) Ubah pekerjaan 3) Kirim | Permintaan dibuat status diajukan | Pass |
| SC-10 | PT-09 | Pembaruan Data | Negatif | Ajukan pembaruan kedua saat masih ada yang aktif | Sudah ada permintaan aktif dari PT-08 | 1 | 1) Kirim permintaan baru | Ditolak 409, tunggu permintaan selesai | Pass |
| SC-10 | PT-10 | Konfirmasi Bayar | Negatif | Konfirmasi tagihan milik KK lain | Tagihan id 2 milik KK 2 | 1-3 | 1) POST /portal/iuran?/ajukan 2) tagihanId 2 3) jumlah 1000 | Ditolak 403, bukan milik KK Anda | Pass |
| SC-10 | PT-11 | Konfirmasi Bayar | Negatif | Konfirmasi tagihan yang sudah lunas | Tagihan id 1 lunas | 1-3 | 1) POST ajukan 2) tagihanId 1 3) jumlah 1000 | Ditolak, tagihan sudah lunas | **Fail** |
| SC-10 | PT-12 | Konfirmasi Bayar | Negatif | Konfirmasi jumlah melebihi sisa tagihan | Tagihan id 9 nominal 50000 | 1-2 | 1) POST ajukan 2) jumlah 999999 | Ditolak, melebihi sisa | Pass |
| SC-10 | PT-13 | Konfirmasi Bayar | Negatif | Konfirmasi dengan jumlah 0 | Tagihan id 9 | 1-2 | 1) POST ajukan 2) jumlah 0 | Ditolak, jumlah harus > 0 | Pass |
| SC-10 | PT-14 | Konfirmasi Bayar | Positif | Ajukan konfirmasi pembayaran valid | Tagihan id 9 milik KK 1 | 1-3 | 1) POST ajukan 2) jumlah 1000 3) metode tunai | Konfirmasi tersimpan status menunggu | Pass |
| SC-10 | PT-15 | Konfirmasi Bayar | Negatif | Ajukan konfirmasi ganda saat masih menunggu | Konfirmasi PT-14 masih menunggu | 1 | 1) POST ajukan lagi tagihan 9 | Ditolak, sudah ada konfirmasi menunggu | Pass |
| SC-10 | PT-16 | Konfirmasi Bayar | Positif | Batalkan konfirmasi milik sendiri | Konfirmasi PT-14 menunggu | 1-2 | 1) POST /portal/iuran?/batalkan 2) id konfirmasi | Konfirmasi dibatalkan | Pass |
| SC-10 | PT-17 | Konfirmasi Bayar | Positif | Ajukan ulang konfirmasi setelah dibatalkan | Tagihan 9 belum lunas | 1 | 1) POST ajukan jumlah 1000 | Konfirmasi baru dibuat | Pass |

### Midtrans (SC-11)

| Scenario ID | Case ID | Test | Type | Test Case | Pre Condition | Steps | Steps Description | Expected Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| SC-11 | M-01 | Charge Iuran | Negatif | Charge iuran tanpa login | Belum punya sesi | 1 | 1) POST /api/midtrans/charge-iuran | Ditolak 401 | Pass |
| SC-11 | M-02 | Charge Iuran | Negatif | Charge iuran dengan tagihanId tidak valid | Login warga | 1 | 1) POST charge-iuran tagihanId 0 | Ditolak 400 tagihan tidak valid | Pass |
| SC-11 | M-03 | Charge Iuran | Negatif | Charge iuran tagihan milik KK lain | Tagihan id 13 milik KK 2 | 1-2 | 1) Login warga KK 1 2) POST charge-iuran tagihanId 13 | Ditolak 403 | Pass |
| SC-11 | M-04 | Charge Kas RT | Negatif | Warga mencatat Kas RT via API Midtrans | Login warga | 1 | 1) POST /api/midtrans/charge-kas-rt | Ditolak 403 hanya pengurus | Pass |
| SC-11 | M-05 | Charge Kas RT | Negatif | Charge Kas RT tanpa login | Belum punya sesi | 1 | 1) POST /api/midtrans/charge-kas-rt | Ditolak 401 | Pass |
| SC-11 | M-06 | Webhook | Negatif | Webhook tanpa order_id | Endpoint publik | 1-2 | 1) POST /api/midtrans/notification 2) body kosong | Ditolak 400 order id missing | Pass |
| SC-11 | M-07 | Webhook | Negatif | Webhook dengan signature tidak valid | Order id sembarang | 1-2 | 1) POST notification 2) signature_key palsu | Ditolak 401/403, tidak memproses pembayaran | Pass |
| SC-11 | M-08 | Finish Iuran | Negatif | Sinkronisasi transaksi tanpa login | Belum punya sesi | 1 | 1) POST /api/midtrans/finish-iuran | Ditolak 401 | Pass |
| SC-11 | M-09 | Finish Iuran | Negatif | Sinkronisasi tanpa orderId | Login warga | 1 | 1) POST finish-iuran body kosong | Ditolak 400 order id wajib | Pass |
| SC-11 | M-10 | Finish Iuran | Negatif | Sinkronisasi orderId tidak dikenal | Order id tidak ada | 1 | 1) POST finish-iuran orderId acak | Ditolak 404 transaksi tidak ditemukan | Pass |

## Summary

- Total: **165**
- Pass: **157**
- Fail: **8**

## Failed Cases

| Case ID | Module | Failure Evidence |
|---|---|---|
| K-01 | Klaim Akun | HTTP 404 |
| K-02 | Klaim Akun | HTTP 404 {} |
| K-03 | Klaim Akun | HTTP 404 {} |
| K-04 | Klaim Akun | HTTP 404 {} |
| K-05 | Klaim Akun | HTTP 404 {} |
| KS-18 | Kas | 200 "[{\"successBatalRw\":1},true]" |
| I-19 | Iuran | 500 "{\"type\":\"error\",\"error\":{\"message\":\"Internal Error\"}}" |
| PT-11 | Portal Warga | 200 "[{\"sukses\":1},\"Konfirmasi terkirim. Bendahara akan memverifikasi pembayaran Anda.\"]" |
