# Catatan Permintaan Stakeholder & Riwayat Iterasi

> **Fungsi dokumen ini:** ledger (buku catatan) semua permintaan yang datang dari **customer /
> stakeholder mitra** dan **dosen pembimbing**, supaya setiap kartu di GitHub Projects bisa
> ditelusuri asal-usulnya. Dokumen ini **bukan** backlog teknis — daftar kartu tetap di
> `backlog.md`, sedangkan status papan ada di `board.md`.
>
> **Sumber data:** riwayat sesi OpenCode 27 Sep – 27 Okt 2026 (basis data sesi lokal),
> `docs/arsip/List feature fix.md`, dan catatan mitra yang di-*dump* pada 27 Okt 2026.
>
> **Konvensi penanda di GitHub:**
> - Label `req-stakeholder` — kartu lahir langsung dari permintaan customer/mitra.
> - Label `iterasi-2` — kartu yang masuk gelombang pengerjaan mulai 27 Okt 2026.
> - Setiap issue terkait memuat komentar **“Sumber permintaan”** yang mengutip catatan aslinya
>   dan menautkan ke bagian dokumen ini.

Terakhir diperbarui: 28 Okt 2026

---

## 1. Ringkasan Iterasi

| Iterasi | Periode | Fokus | Status |
|---|---|---|---|
| **Iterasi 0** | 27–28 Sep 2026 | Fondasi web: design system, modul inti (warga, kas, iuran, pengumuman), UI portal admin | Selesai |
| **Iterasi 1** | 3–19 Okt 2026 | Pendalaman modul, laporan capstone, Kanban/GitHub Projects, landing page, disiplin PR | Selesai |
| **Iterasi 2** | 27 Okt 2026 – sekarang | Revisi stakeholder: role & RT, keuangan RT/RW, iuran, surat, landing/galeri | Berjalan |

---

## 2. Iterasi 0 — Fondasi (27–28 Sep 2026)

Permintaan pada fase ini berasal dari **tim sendiri** (bukan mitra), sehingga tidak diberi label
`req-stakeholder`. Dicatat di sini agar riwayat lengkap.

| Tanggal | Permintaan | Bukti |
|---|---|---|
| 27 Sep | Bangun fondasi web: design system, struktur SvelteKit, PWA, siap mobile + web | PR awal, `src/app.css` |
| 27 Sep | Modul inti: warga, kas, iuran, pengumuman, seed admin | Route `(app)/*` |
| 27 Sep | Perbaiki role `admin_rw` yang tidak terdaftar di Better Auth | Commit fix role |
| 28 Sep | Rombak UI portal admin: flat, kontras tinggi, ramah pengguna lama | Redesign shell + dashboard |
| 28 Sep | Role gating & routing per peran | `src/lib/server/guard.ts` |
| 28 Sep | Perbaiki `db:setup` agar onboarding satu langkah | `scripts/db-setup.ts` |

---

## 3. Iterasi 1 — Fitur Inti & Laporan (3–19 Okt 2026)

### 3.1 Daftar fitur dari stakeholder — 9 Okt 2026

Sumber: `docs/arsip/List feature fix.md` + sesi “New session - 2026-10-09”.

Kutipan inti:

> Butuh landing page & company profile — grafik distribusi, grafik lainnya, jumlah produktif,
> jumlah pensiun, angka kelahiran, informasi/event harus tercatat, statistik event, SOTK,
> visi misi, prestasi (minta bukti).
>
> Modul Informasi & Event RW (Humas) — CRUD pengumuman, sistem event based on time, event penting
> ada attachment (notulen).
>
> Modul Kependudukan — rekap demografis, CRUD warga, impor CSV, portal warga (individu).
>
> Modul Keuangan (mainly bendahara) — RT customer (mis. uang sosial kematian), tiap RT kas-nya
> beda; saat ini hanya iuran wajib RT; ekspor CSV; kelola kategori; lebih ke rekap, bukan tagihan.
>
> Dashboard — grafik, saldo kas, total warga.
>
> Modul Surat Menyurat (mainly sekretaris) — template A–G, signature, approval.

Klarifikasi pada hari yang sama:

- CMS landing page **tidak** dikerjakan dulu.
- Kas per RT **dipisah**; kas yang ada sekarang dianggap kas internal.
- Event **tanpa** absensi (belum ada urgensi).
- Grafik bebas, yang penting ringan, informatif, mudah.

**Pemetaan ke kartu:**

| Permintaan stakeholder | Kartu / Issue | Status |
|---|---|---|
| Landing page, SOTK, visi-misi, prestasi, statistik publik | `LP-01`, `LP-02` | Selesai (landing), statistik menyusul |
| Attachment notulen event | #23 (`EV-02`) | Backlog |
| Saring & cari pengumuman | #24 (`EV-03`) | Backlog |
| Kas RT terpisah | #43 (`KU-01`) | **Selesai** — kas RT terpisah + setoran porsi RW ke RW (#65) |
| Rekap iuran wajib RT | #42 (`KU-02`) | Sebagian (lanjut #66) |
| Ekspor laporan keuangan RW & RT | #40 (`KU-03`) | Sebagian |
| Portal warga (individu) | #69 | **Selesai** — tagihan, konfirmasi bayar, riwayat (online/Midtrans menyusul) |
| Template surat A–G | #49 (`SR-01`) | Backlog |
| Tanda tangan digital pengurus | #48 (`SR-03b`) | Backlog |
| Approval / verifikasi surat | #50, #70 | Sebagian (#50), lanjut #70 |

### 3.2 Revisi dosen pembimbing — 4 Okt 2026

Revisi ini menyangkut **laporan**, bukan aplikasi. Tidak diberi label issue.

| Revisi | Permintaan | Tindak lanjut |
|---|---|---|
| 1 | Alur pengajuan surat dibuat diagram + deskripsi | Diagram alur ditambahkan |
| 2 | Tambah subbab Root Cause Analysis (fishbone) sebelum alternatif solusi | Fishbone ditambahkan |
| 3 | Kalimat “area utama fokus kajian” diperpanjang | Diperbaiki |
| 4 | Margin & nomor halaman | Diperbaiki |
| 5 | Spesifikasi fungsional tiap modul | Tabel SF dilengkapi |
| 6 | Bab 3.5: sistematika, mekanisme verifikasi, timeline, komponen terintegrasi | Subbab ditambahkan |
| 7 | Metodologi memakai Kanban + GitHub Projects | Bab II & IV disesuaikan |

### 3.3 Landing page — 14 Okt 2026

Permintaan (internal, PIC Afif):

> Perbaiki UI landing page dengan mengacu pada website pemerintah/RT/RW/Kementerian. Struktur dan
> tipografi boleh diadopsi, lalu beri beberapa opsi desain.

Keputusan: opsi A, dengan blok sambutan diperbesar seperti opsi B; elemen opsi C dibuang.
Status: selesai dan di-*push*.

### 3.4 Disiplin PR & papan — 17–18 Okt 2026

- Hanya owner yang boleh merge; kolaborator hanya boleh membuka Pull Request.
- Review PR Josua & Alizha sebelum merge.
- Papan Kanban diperbarui setelah merge.

Ini permintaan **proses**, bukan fitur.

---

## 4. Iterasi 2 — Revisi Stakeholder (27 Okt 2026)

Sumber: sesi 27 Okt 2026, berupa *dump* catatan mitra (gambar tangkapan layar + catatan Zidan dan
Safira) serta temuan review PR Safira.

### 4.1 Catatan Zidan

Kutipan:

> 1. RT bayar iuran K3 36k sama soskem 5k per KK (klo ada yg meninggal per KK tambah 10k buat santunan)
> 2. Nanti dikoordinasiin sama bendahara buat nomor 10
> 3. Iuran fokus ke RW aja (warga fokus ke pendapatan RW aja)
> 4. Uang kas RW sisa dari K3
> 5. Surat menyurat RW nyatet doang, buat record dan validasi
> 6. Minta tambahin galeri
> 7. Bagan pengurus tambahin foto
> 8. Background landing page bisa ganti warna atau gambar

### 4.2 Catatan Safira (bimbingan capstone)

Kutipan:

> Keuangan: sampah, keamanan, air, sosial kematian. Keuangannya mau sampai sejauh ini atau kas-nya
> doang atau keseluruhan? Ada yang input juga apa yang dibayar RT dan RW.
>
> RT-nya juga harus terbuka, dan setiap tanggal berapa harus input pendapatan dan pengeluaran RT
> dan RW.
>
> Use case dll. Setiap modul yang dikerjakan: alur akuntansi, surat-menyurat, penggunaan RT/RW —
> RT seperti apa, RW seperti apa, pendapatan dan pengeluaran harus jelas.

### 4.3 Sepuluh pertanyaan terbuka

1. Siapa yang akan mengelola web dan per fitur?
2. Laporan keuangan mau sejauh mana — kas saja, keseluruhan, atau cukup laporan?
3. Apa yang dibayar RT dan apa yang dibayar RW?
4. Pendapatan RT dan RW harus lebih jelas.
5. Keuangan masih banyak PR.
6. Proses surat-menyurat harus dijelaskan.
7. Buat dulu use case, ERD, dan diagram pendukung.
8. Role harus lebih detail.
9. Aliran dana ke RT dan RW harus detail.
10. Data keuangan lama (kas, laporan) dimasukkan ke sistem atau tidak?

### 4.4 Catatan role & konfigurasi RT

- “Baru sadar belum ada role warga, masih admin RW doang.”
- “Dropdown RT di input kependudukan masih kosong.”
- “Tambah menu baru config RT. Isinya bisa CRUD RT dan kepengurusan tiap RT.”

### 4.5 Temuan review PR Safira (kualitas, bukan permintaan fitur)

Delapan temuan yang harus diperbaiki sebelum merge:

1. Pembayaran bisa dipalsukan lewat query `?status=midtrans_success`.
2. Endpoint Midtrans publik bisa menyisipkan transaksi / auto-settlement.
3. Saldo salah karena transaksi *pending* dihitung sebagai pemasukan.
4. Migrasi `0005` & `0006` tidak terdaftar di `_journal.json`.
5. Stored XSS pada `DataTable` (`{@html}`).
6. Rekap iuran rapuh: pelunasan massal tanpa urutan periode; hapus kategori tanpa handling FK.
7. `db:setup` terlalu longgar menelan error “duplicate column”.
8. `loadFreshEnv()` menduplikasi mekanisme environment SvelteKit.

Status: diperbaiki pada PR #62/#63 sebelum merge.

### 4.6 Peta permintaan → issue

| # | Permintaan stakeholder | Issue | Status |
|---|---|---|---|
| 1 | Role warga belum ada | #64 | **Selesai** (`6aaabcd`) |
| 2 | Dropdown RT kosong | #64 | **Selesai** |
| 3 | Menu konfigurasi RT (CRUD RT + kepengurusan) | #64 | **Selesai** |
| 4 | Iuran K3 36k + soskem 5k + santunan 10k per KK | #66, #71 (D2) | **Selesai** (`4ee3b69`) — nominal jadi data, preset ter-seed; **nominal belum fix** (lihat `konfirmasi-stakeholder.md` D2) |
| 5 | Iuran fokus ke RW | #66, #71 (D1) | **Sementara** — alur warga → RT → RW diterapkan; scope `rw`/`rt` tersedia, penetapan mitra menyusul |
| 6 | Kas RW berasal dari sisa K3 | #65, #71 (D3) | **Selesai mekanismenya** (`40d3f9c`) — porsi RW Rp5.000/KK diterapkan sebagai asumsi sementara |
| 7 | Surat RW hanya mencatat + validasi | #70 | **Selesai** (`0da0215`) |
| 8 | Galeri di landing | #68 | **Selesai** (`678ccca`) |
| 9 | Foto pengurus di bagan | #68 | **Selesai** (`678ccca`) |
| 10 | Background landing bisa diganti | #68 | **Selesai** (`678ccca`) |
| 11 | Rincian tagihan & pembayaran warga | #69 | **Selesai** (`6867606`) — portal tagihan, konfirmasi bayar, verifikasi bendahara |
| 12 | Alur keuangan RT vs RW + tanggal pencatatan | #65, #66, #71 (D1–D4) | **Selesai mekanismenya** (`40d3f9c`, `4ee3b69`) — jatuh tempo tgl 10 disimpan per tagihan; angka & tanggal masih asumsi |
| 13 | Use case, ERD, alur akuntansi & surat | #71 (deliverable) | Sebagian — alur uang sudah terdokumentasi; diagram menunggu keputusan final |
| 14 | Role lebih detail | #64, #73 | **Selesai** (matriks role + scoping, `b0ea533`) |
| 15 | Data keuangan lama | #72, #71 (D5) | Menunggu konfirmasi format CSV & tanggal saldo awal |

### 4.7 Pekerjaan teknis pendamping (bukan permintaan stakeholder)

| Issue | Asal | Status |
|---|---|---|
| #67 | Temuan review: repo belum punya test/CI | **Selesai** (`3be1365`) — Vitest + CI + 7 tes Playwright |
| #73 | Temuan review: izin baru per aksi, belum per baris | **Selesai** (`b0ea533`) — scoping per RT di dashboard, kas, warga, iuran, surat |
| #74 | Pendukung #64 (CI di branch fitur) | **Selesai** (`27f2377`) |

---

## 5. Keputusan yang Masih Terbuka (#71)

Implementasi **iuran** sudah jalan dengan pendekatan *config-driven*: nominal, porsi RW, dan
scope (`rw`/`rt`) disimpan sebagai data di `jenis_iuran`, dan tiap tagihan menyimpan snapshot
nilainya. Jadi kelima keputusan di bawah tinggal mengisi angka/kebijakan, tanpa perlu ubah kode.
**Setoran RT → RW (#65)** juga sudah jalan: iuran RT ditahan di kas RT lalu porsi RW-nya
dipindahkan lewat satu transaksi yang tercatat di kedua sisi. **Migrasi data lama (#72)** tetap
ditahan sampai D5 dikunci.

Pembayaran warga (#69) sudah utuh untuk **tunai & transfer** lewat konfirmasi bendahara.
Pembayaran **online (Midtrans)** belum disambungkan ke tagihan iuran; callback-nya nanti
ditempelkan ke jalur `catatPembayaran` yang sama.

**Status per 28 Okt 2026:** kelima keputusan sudah diisi dengan **asumsi sementara** agar
aplikasi bisa dipakai, tetapi **belum final**. Semua asumsi, dampaknya, dan siapa yang perlu
mengonfirmasi dicatat di **`konfirmasi-stakeholder.md`**. Keputusan yang sudah diterapkan:

| Kode | Pertanyaan | Keputusan sementara | Dasar | Status | Dipakai oleh |
|---|---|---|---|---|---|
| **D1** | Alur uang: warga → RW langsung, atau warga → RT → RW? | **Warga → RT → RW** (iuran ditahan RT, porsi RW disetor) | Jawaban Anda 28 Okt 2026 | Sementara, perlu penetapan mitra | #65, #66 |
| **D2** | Nominal per KK: K3 36k + soskem 5k + santunan 10k, atau K3 total 50k? | **K3 36.000 + Soskem 5.000** bulanan, **Santunan 10.000** insidental | Catatan rapat/Zidan | **Belum fix** (preset saja) | #66 |
| **D3** | Porsi K3 yang tinggal di RT vs disetor ke RW | **Rp5.000/KK nominal tetap** (±14% dari K3); Soskem & Santunan 0 | Usulan, mengacu praktik iuran lingkungan (besaran ditetapkan musyawarah warga) | Asumsi | #65, #66 |
| **D4** | Tanggal tagihan, jatuh tempo, dan closing periode | Terbit awal bulan, **jatuh tempo tanggal 10**, closing akhir bulan; disimpan per tagihan di `tagihan.jatuh_tempo` | Kebiasaan iuran lingkungan/IPL | Asumsi, sudah diterapkan | #66 |
| **D5** | Format data keuangan lama & mekanisme saldo awal | **CSV** `tanggal, keterangan, jenis, nominal, kas, kategori` + **transaksi pembuka** per tanggal cut-off | Praktik buku kas RT (Tanggal/Keterangan/Debet/Kredit/Saldo) | Asumsi, memblokir #72 | #72 |

**Perlu dikonfirmasi (ringkas):** nominal D2, porsi D3, tanggal jatuh tempo D4, arti "santunan
Rp10.000" (iuran masuk atau santunan keluar), dan bentuk data lama D5. Daftar lengkap 20+ asumsi
lain (pembayaran online, bukti bayar, closing periode, multi-RW, dll.) ada di
`konfirmasi-stakeholder.md`.

---

## 6. Cara Menandai Permintaan Baru

Saat menerima permintaan baru dari mitra/dosen:

1. Catat di tabel bagian atas dokumen ini: tanggal, sumber, kutipan, dan pemetaan issue.
2. Buat issue (atau tautkan issue yang sudah ada), lalu tempel komentar:

   ```
   ### Sumber permintaan (stakeholder)
   - Tanggal: <tanggal>
   - Sumber: <nama / forum>
   - Kutipan: "<kalimat asli>"
   - Catatan lengkap: docs/kanban/permintaan-stakeholder.md#<bagian>
   ```

3. Tambahkan label `req-stakeholder` (dan `iterasi-2` bila masuk gelombang berjalan).
4. Masukkan kartu ke papan **Capstone - Gr30** pada kolom yang sesuai.

Dengan begitu, di papan mana pun kartu itu berada, asal permintaannya tetap terlihat.
