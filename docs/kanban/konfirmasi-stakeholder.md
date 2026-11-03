# Daftar Asumsi & Hal yang Perlu Dikonfirmasi Stakeholder

> Dokumen ini mencatat **semua keputusan yang masih berupa asumsi** di aplikasi RW Digital,
> supaya tidak ada yang diam-diam dianggap final. Setiap baris menjawab: asumsi apa yang
> dipakai sekarang, siapa yang perlu mengonfirmasi, dan apa dampaknya kalau asumsi salah.
>
> Terkait: `permintaan-stakeholder.md` §5 (D1–D5) · issue **#71** · `board.md` §5.

Terakhir diperbarui: 28 Okt 2026

## Cara pakai

1. Bawa tabel A ke rapat dengan mitra (Pak RW / bendahara / pengurus RT).
2. Setiap baris yang disetujui: ubah **Status** menjadi `Disetujui <tanggal> <inisial>`.
3. Kalau keputusan berubah, cukup ubah **data** di aplikasi (menu *Kelola jenis iuran* atau
   *Pengaturan*), tidak perlu ubah kode — kecuali baris yang ditandai **butuh kode**.
4. Baris yang masih `Asumsi` berarti angka/fitur di aplikasi **belum boleh dianggap resmi**.

---

## A. Keputusan bisnis D1–D5 (issue #71)

| Kode | Asumsi yang dipakai sekarang | Dasar | Perlu dikonfirmasi ke | Dampak kalau salah | Status |
|---|---|---|---|---|---|
| **D1** | Uang warga mengalir **warga → RT → RW**: iuran ditagih & ditahan RT, porsi RW disetor kemudian | Jawaban Anda 28 Okt 2026 ("ngalirnya warga RT RW, karena ada payment-nya") | Mitra + bendahara | Kalau ternyata warga bayar langsung ke RW, seluruh alur setoran RT → RW tidak dipakai; iuran `scope` harus diubah ke `rw` | **Sementara (dari Anda)**, perlu penetapan mitra |
| **D2** | Nominal per KK: **K3 Rp36.000 + Soskem Rp5.000** (bulanan) + **Santunan Rp10.000** (insidental) | Catatan rapat/Zidan; Anda minta "ikutin catatan, notes belum fix" | Mitra + bendahara | Semua tagihan & laporan keuangan salah nominal; harus generate ulang per periode | **Belum fix** (preset saja) |
| **D3** | Porsi RW dari K3 = **Rp5.000/KK (nominal tetap, ±14%)**; Soskem & Santunan 0% ke RW | Usulan saya, mengacu praktik iuran lingkungan (tidak ada angka baku nasional — besaran ditetapkan musyawarah warga) | Mitra + bendahara | Saldo RW salah tiap bulan; koreksi harus lewat pembatalan setoran, bukan hitung ulang otomatis | **Asumsi**, perlu angka resmi |
| **D4** | Tagihan terbit **awal bulan**, **jatuh tempo tanggal 10**, **closing akhir bulan**; status "Menunggak" hanya label | Kebiasaan iuran lingkungan/IPL (jatuh tempo tgl 10); Anda: "per bulan kali ya?" | Mitra + bendahara | Tanggal di portal & laporan bergeser; fitur pengingat/denda (kalau nanti ada) ikut salah | **Asumsi**, sudah diterapkan sebagai data per tagihan |
| **D5** | Data lama diimpor sebagai **CSV** berkolom `tanggal, keterangan, jenis (masuk/keluar), nominal, kas (RW/RT), kategori`; saldo awal lewat **transaksi pembuka** per tanggal cut-off | Praktik buku kas RT (Tanggal/Keterangan/Debet/Kredit/Saldo) | Bendahara + mitra | Data historis bisa dobel atau hilang; saldo awal tidak balance | **Asumsi**, memblokir #72 |

---

## B. Asumsi aturan iuran & tagihan

| # | Asumsi yang dipakai sekarang | Di mana | Perlu dikonfirmasi ke | Dampak kalau salah | Status |
|---|---|---|---|---|---|
| B1 | Tagihan dihitung **per KK**, bukan per jiwa atau per rumah | `generate/+page.server.ts`, preset #66 | Mitra | Jumlah tagihan & target penerimaan berubah | Asumsi |
| B2 | **KK aktif** = masih punya ≥1 anggota berstatus `aktif`; KK tanpa anggota aktif tidak ditagih | `kkAktifDari()` | Pengurus data warga | Warga pindah/meninggal bisa tetap ditagih atau justru terlewat | Asumsi |
| B3 | Porsi RW dihitung **proporsional terhadap uang yang masuk** (bayar separuh → porsi separuh), bukan terhadap nominal tagihan | `porsiTerkumpul()` | Bendahara | Kalau maunya porsi penuh walau cicil, saldo RW beda | Asumsi |
| B4 | Iuran ber-`scope` **RT** masuk kas RT dulu; **RW** langsung kas RW | `catatPembayaran()` | Bendahara | Uang bisa tercatat di kas yang salah | Sudah sesuai D1 sementara |
| B5 | **Satu setoran aktif per RT per periode**; koreksi nominal = batalkan lalu setor ulang | unique index `setoran_rt_rt_periode_unik` | Bendahara | Kalau butuh setoran bertahap (cicilan setor), skema harus diubah | Asumsi (butuh kode kalau berubah) |
| B6 | Iuran **insidental** (santunan kematian) digenerate **manual** saat kejadian, bukan otomatis | `jenis_iuran.periode = 'insidental'` | Mitra | Kalau harus otomatis saat ada kematian, perlu alur baru | Asumsi |
| B7 | "**Santunan Kematian Warga** Rp10.000" adalah **iuran yang ditarik dari warga**, bukan santunan yang dibayarkan ke keluarga | preset `jenis_iuran` | Mitra | Bisa jadi justru pengeluaran; arah kas terbalik | **Perlu klarifikasi** (nama ambigu) |
| B8 | Belum ada **denda keterlambatan**; "Menunggak" hanya penanda visual | `menunggak()` | Mitra | Kalau ada denda, perlu kolom & perhitungan baru | Asumsi |

---

## C. Asumsi pembayaran & portal warga

| # | Asumsi yang dipakai sekarang | Perlu dikonfirmasi ke | Dampak kalau salah | Status |
|---|---|---|---|---|
| C1 | Metode resmi baru **tunai & transfer**; pembayaran diverifikasi bendahara | Bendahara | Alur verifikasi berubah | Sesuai implementasi |
| C2 | **Midtrans/online belum tersambung** ke tagihan iuran; callback lama tidak dipakai | Mitra | Kalau wajib online, perlu pekerjaan lanjutan (callback → `catatPembayaran`) | **Gap**, perlu keputusan |
| C3 | Bukti bayar = catatan konfirmasi + status; **belum ada unggah foto/PDF bukti** | Bendahara | Sengketa pembayaran sulit dibuktikan | **Gap** |
| C4 | **Satu akun portal = satu KK** (`warga.user_id` → KK); anggota lain tidak bisa lihat tagihan KK-nya | Mitra | Kalau tiap anggota butuh akses, perlu model akun berbeda | Asumsi |
| C5 | Warga boleh mengonfirmasi **sebagian** (≤ sisa), dan hanya satu konfirmasi menunggu per tagihan | Bendahara | Aturan pembayaran berubah | Asumsi |

---

## D. Asumsi teknis/operasional yang berdampak ke laporan

| # | Asumsi | Perlu dikonfirmasi ke | Dampak | Status |
|---|---|---|---|---|
| D6 | Aplikasi melayani **satu RW** (mengambil baris `rw` pertama); multi-RW belum didukung | Mitra | Kalau ada beberapa RW, perlu isolasi data | Asumsi |
| D7 | **Closing periode belum mengunci** transaksi; transaksi bulan lalu masih bisa dicatat/dibatalkan | Bendahara | Laporan bulan lalu bisa berubah setelah dicetak | **Gap** (butuh kode) |
| D8 | Ekspor laporan = **CSV/Excel** dari halaman; belum ada tanda tangan/cap digital pada laporan | Mitra | Kalau laporan harus resmi bertanda tangan, perlu fitur tambahan | Asumsi |
| D9 | Periode tagihan memakai format **YYYY-MM** dan selalu **bulanan** | Bendahara | Iuran triwulan/tahunan butuh perubahan | Asumsi |
| D10 | Hak akses: **admin RW & bendahara** lihat semua RT; **pengurus RT** hanya RT tugasnya | Pengurus | Kalau bendahara harus dibatasi per RT, aturan scope berubah | Sudah diputuskan di #73 |

---

## E. Ringkasan yang paling mendesak

Kalau waktunya terbatas, lima hal ini yang paling berdampak dan sebaiknya dikonfirmasi lebih dulu:

1. **D2** — nominal resmi per KK (36k + 5k + 10k atau 50k). *(paling mendesak: menyangkut semua tagihan)*
2. **D3** — porsi RW dari K3: Rp5.000/KK atau persentase lain.
3. **D4** — tanggal jatuh tempo resmi (sekarang 10) dan kapan buku bulan ditutup.
4. **B7** — "santunan Rp10.000" itu iuran masuk atau santunan keluar.
5. **D5** — bentuk data lama + tanggal saldo awal, supaya #72 bisa dikerjakan.

Setelah kelima ini dijawab, baris lain (C2, C3, D7) bisa menyusul sebagai pengembangan, bukan penghalang.
