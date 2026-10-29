import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─── Timestamps helper ───────────────────────────────────────────────────────
const timestamps = {
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
  updatedAt: text('updated_at').notNull().default(sql`(current_timestamp)`)
};

// ─── RW ──────────────────────────────────────────────────────────────────────
export const rw = sqliteTable('rw', {
  id:       integer('id').primaryKey({ autoIncrement: true }),
  nama:     text('nama').notNull(),
  alamat:   text('alamat').notNull(),
  kelurahan:text('kelurahan').notNull(),
  kecamatan:text('kecamatan').notNull(),
  kota:     text('kota').notNull(),
  ...timestamps
});

// ─── RT ──────────────────────────────────────────────────────────────────────
export const rt = sqliteTable('rt', {
  id:       integer('id').primaryKey({ autoIncrement: true }),
  nomor:    integer('nomor').notNull(),           // e.g. 01, 02
  rwId:     integer('rw_id').notNull().references(() => rw.id),
  ...timestamps
});

// ── Penugasan pengurus RT ────────────────────────────────────────────────────
// Satu akun `pengurus_rt` bertugas di satu RT. Tabel terpisah dipakai supaya
// tabel `user` milik Better Auth tidak perlu diubah. Akun tanpa baris di sini
// tidak mendapat akses data RT mana pun (fail-closed).
export const petugasRt = sqliteTable('petugas_rt', {
  id:     integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().unique(),     // Better Auth user.id
  rtId:   integer('rt_id').notNull().references(() => rt.id),
  ...timestamps
}, (table) => [
  index('petugas_rt_rt_id_idx').on(table.rtId)
]);

// ─── KK (Kartu Keluarga) ─────────────────────────────────────────────────────
export const kk = sqliteTable('kk', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  noKk:      text('no_kk').notNull().unique(),   // 16-digit KK number
  alamat:    text('alamat').notNull(),
  rtId:      integer('rt_id').notNull().references(() => rt.id),
  statusHuni:text('status_huni', { enum: ['tetap', 'kontrak', 'kos'] }).notNull().default('tetap'),
  ...timestamps
});

// ─── Warga ───────────────────────────────────────────────────────────────────
export const warga = sqliteTable('warga', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  nik:          text('nik').notNull().unique(),   // 16-digit NIK
  nama:         text('nama').notNull(),
  tempatLahir:  text('tempat_lahir').notNull(),
  tanggalLahir: text('tanggal_lahir').notNull(), // ISO date string
  jenisKelamin: text('jenis_kelamin', { enum: ['L', 'P'] }).notNull(),
  agama:        text('agama').notNull(),
  pendidikan:   text('pendidikan'),
  pekerjaan:    text('pekerjaan'),
  statusPerkawinan: text('status_perkawinan', {
    enum: ['belum_kawin', 'kawin', 'cerai_hidup', 'cerai_mati']
  }).notNull().default('belum_kawin'),
  statusHubunganKk: text('status_hubungan_kk', {
    enum: ['kepala_keluarga', 'istri', 'anak', 'lainnya']
  }).notNull(),
  kkId:         integer('kk_id').notNull().references(() => kk.id),
  aktif:        integer('aktif', { mode: 'boolean' }).notNull().default(true),
  userId:       text('user_id'),                  // Better Auth user.id
  alasanNonaktif:  text('alasan_nonaktif'),       // Pindah / Meninggal / dll.
  tanggalNonaktif: text('tanggal_nonaktif'),      // Tanggal dinonaktifkan
  ...timestamps
});

export const riwayatWarga = sqliteTable('riwayat_warga', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  wargaId:    integer('warga_id').notNull().references(() => warga.id),
  diubahOleh: text('diubah_oleh').notNull(),      // user id yang mengubah
  alasan:     text('alasan').notNull(),           // Alasan perubahan
  ringkasan:  text('ringkasan'),                  // Detail data yang diubah
  tanggal:    text('tanggal').notNull().default(sql`(current_timestamp)`)
});

// ─── Pengurus (bagan organisasi RW & RT) ────────────────────────────────────
// `rtId` NULL = pengurus tingkat RW. `fotoUrl` menunjuk ke /uploads/pengurus/...
// supaya bagan pengurus di landing page bisa menampilkan foto asli.
export const pengurus = sqliteTable('pengurus', {
  id:       integer('id').primaryKey({ autoIncrement: true }),
  rtId:     integer('rt_id').references(() => rt.id),   // null = pengurus RW
  jabatan:  text('jabatan').notNull(),                  // Ketua, Sekretaris, Bendahara, ...
  nama:     text('nama').notNull(),
  fotoUrl:  text('foto_url'),
  urutan:   integer('urutan').notNull().default(0),
  aktif:    integer('aktif', { mode: 'boolean' }).notNull().default(true),
  ...timestamps
}, (table) => [
  index('pengurus_rt_id_idx').on(table.rtId)
]);

// ─── Pengaturan Landing & Galeri (LP-01) ────────────────────────────────────
// Satu baris konfigurasi (id = 1). Nilai kosong berarti landing memakai
// default yang tertanam di kode, sehingga instalasi baru tetap tampil utuh.
export const pengaturanLanding = sqliteTable('pengaturan_landing', {
  id:               integer('id').primaryKey(),
  heroJudul:        text('hero_judul'),
  heroSubjudul:     text('hero_subjudul'),
  // Berupa warna hex (#0f172a) atau path gambar (/uploads/landing/...).
  heroBackground:   text('hero_background'),
  sambutan:         text('sambutan'),
  namaKetua:        text('nama_ketua'),
  fotoKetua:        text('foto_ketua'),
  visi:             text('visi'),
  misi:             text('misi'),          // satu poin per baris
  sejarah:          text('sejarah'),
  alamat:           text('alamat'),
  telepon:          text('telepon'),
  email:            text('email'),
  ...timestamps
});

export const galeri = sqliteTable('galeri', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  judul:      text('judul').notNull(),
  keterangan: text('keterangan'),
  fotoUrl:    text('foto_url').notNull(),
  urutan:     integer('urutan').notNull().default(0),
  aktif:      integer('aktif', { mode: 'boolean' }).notNull().default(true),
  ...timestamps
});

// ─── Pengumuman ───────────────────────────────────────────────────────────────
export const pengumuman = sqliteTable('pengumuman', {
  id:            integer('id').primaryKey({ autoIncrement: true }),
  judul:         text('judul').notNull(),
  isi:           text('isi').notNull(),
  kategori:      text('kategori', {
    enum: ['umum', 'kegiatan', 'keuangan', 'darurat']
  }).notNull().default('umum'),
  tanggalMulai:        text('tanggal_mulai'),
  tanggalSelesai:      text('tanggal_selesai'),
  tanggalMulaiEvent:   text('tanggal_mulai_event'),
  tanggalSelesaiEvent: text('tanggal_selesai_event'),
  lokasi:              text('lokasi'),
  ditampilkan:         integer('ditampilkan', { mode: 'boolean' }).notNull().default(true),
  rwId:                integer('rw_id').notNull().references(() => rw.id),
  dibuatOleh:          text('dibuat_oleh').notNull(), // user id from better-auth
  ...timestamps
});

// ─── Iuran (jenis/tagihan periodik) ──────────────────────────────────────────
export const jenisIuran = sqliteTable('jenis_iuran', {
  id:       integer('id').primaryKey({ autoIncrement: true }),
  nama:     text('nama').notNull(),             // e.g. "Iuran Keamanan", "Kebersihan"
  nominal:  real('nominal').notNull(),
  // Bagian RW dari tiap tagihan (nominal tetap per KK). Nilai ini adalah
  // konfigurasi data, bukan konstanta kode, sehingga porsi bisa diubah
  // kapan saja tanpa menyentuh tagihan lama (lihat snapshot di `tagihan`).
  porsiRw:  real('porsi_rw').notNull().default(0),
  periode:  text('periode', { enum: ['bulanan', 'tahunan', 'insidental'] }).notNull().default('bulanan'),
  // Siapa yang menagih: 'rw' = langsung RW ke warga, 'rt' = lewat RT.
  // Hanya jenis ber-scope 'rt' yang boleh digenerate per RT. Default 'rt'
  // supaya data lama (yang selama ini ditagih lewat RT) tetap bisa digenerate.
  scope:    text('scope', { enum: ['rw', 'rt'] }).notNull().default('rt'),
  rtId:     integer('rt_id').references(() => rt.id), // pemilik bila scope 'rt'; null = semua RT
  urutan:   integer('urutan').notNull().default(0),
  aktif:    integer('aktif', { mode: 'boolean' }).notNull().default(true),
  rwId:     integer('rw_id').notNull().references(() => rw.id),
  ...timestamps
});

// Paket = preset beberapa jenis iuran yang biasa ditagih bersamaan
// (mis. K3 + Soskem + Santunan). Isinya data, bukan kode.
export const paketIuran = sqliteTable('paket_iuran', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  nama:       text('nama').notNull(),
  keterangan: text('keterangan'),
  aktif:      integer('aktif', { mode: 'boolean' }).notNull().default(true),
  rwId:       integer('rw_id').notNull().references(() => rw.id),
  ...timestamps
});

export const paketIuranItem = sqliteTable('paket_iuran_item', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  paketId:      integer('paket_id').notNull().references(() => paketIuran.id, { onDelete: 'cascade' }),
  jenisIuranId: integer('jenis_iuran_id').notNull().references(() => jenisIuran.id),
  urutan:       integer('urutan').notNull().default(0)
}, (table) => [
  uniqueIndex('paket_iuran_item_unik').on(table.paketId, table.jenisIuranId)
]);

export const tagihan = sqliteTable('tagihan', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  kkId:         integer('kk_id').notNull().references(() => kk.id),
  jenisIuranId: integer('jenis_iuran_id').notNull().references(() => jenisIuran.id),
  periode:      text('periode').notNull(),      // e.g. "2025-01"
  // Snapshot saat tagihan dibuat: perubahan nominal/porsi di jenis_iuran
  // tidak boleh mengubah tagihan yang sudah terbit.
  nominal:      real('nominal').notNull(),
  porsiRw:      real('porsi_rw').notNull().default(0),
  status:       text('status', { enum: ['belum_bayar', 'lunas', 'sebagian'] }).notNull().default('belum_bayar'),
  // Tanggal jatuh tempo (D4). Disimpan per tagihan supaya perubahan kebijakan
  // tidak menggeser tagihan yang sudah terbit. Null = belum ditetapkan.
  jatuhTempo:   text('jatuh_tempo'),
  ...timestamps
}, (table) => [
  // Satu KK hanya punya satu tagihan per jenis per periode. Ini yang membuat
  // generate ulang idempoten, termasuk saat dua permintaan berjalan bersamaan.
  uniqueIndex('tagihan_kk_jenis_periode_unik').on(table.kkId, table.jenisIuranId, table.periode)
]);

export const pembayaran = sqliteTable('pembayaran', {
  id:          integer('id').primaryKey({ autoIncrement: true }),
  tagihanId:   integer('tagihan_id').notNull().references(() => tagihan.id),
  jumlah:      real('jumlah').notNull(),
  metodeBayar: text('metode_bayar', { enum: ['qris', 'tunai', 'transfer'] }).notNull(),
  referensi:   text('referensi'),               // QRIS/payment gateway ref
  catatan:     text('catatan'),
  dibayarPada: text('dibayar_pada').notNull(),  // ISO datetime
  dicatatOleh: text('dicatat_oleh').notNull(),  // user id
  ...timestamps
});

// Pengajuan konfirmasi bayar dari portal warga (biasanya tunai ke bendahara).
// Baru menjadi `pembayaran` resmi setelah diterima bendahara, supaya status
// tagihan di portal dan di halaman staf selalu berasal dari sumber yang sama.
export const konfirmasiBayar = sqliteTable('konfirmasi_bayar', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  tagihanId:    integer('tagihan_id').notNull().references(() => tagihan.id),
  jumlah:       real('jumlah').notNull(),
  metodeBayar:  text('metode_bayar', { enum: ['tunai', 'transfer'] }).notNull().default('tunai'),
  catatan:      text('catatan'),
  status:       text('status', { enum: ['menunggu', 'diterima', 'ditolak'] }).notNull().default('menunggu'),
  diajukanOleh: text('diajukan_oleh').notNull(),  // user id warga
  diprosesOleh: text('diproses_oleh'),
  diprosesPada: text('diproses_pada'),
  alasanTolak:  text('alasan_tolak'),
  ...timestamps
}, (table) => [
  index('konfirmasi_bayar_tagihan_idx').on(table.tagihanId),
  index('konfirmasi_bayar_status_idx').on(table.status)
]);

// ─── Kas RW & Kas RT (KU-01 s/d KU-04) ──────────────────────────────────────
export const kategoriKas = sqliteTable('kategori_kas', {
  id:    integer('id').primaryKey({ autoIncrement: true }),
  nama:  text('nama').notNull(),
  jenis: text('jenis', { enum: ['pemasukan', 'pengeluaran'] }).notNull(),
  scope: text('scope', { enum: ['semua', 'rw', 'rt'] }).notNull().default('semua'),
  rwId:  integer('rw_id').notNull().references(() => rw.id)
});

export const transaksiKas = sqliteTable('transaksi_kas', {
  id:             integer('id').primaryKey({ autoIncrement: true }),
  jenis:          text('jenis', { enum: ['pemasukan', 'pengeluaran'] }).notNull(),
  nominal:        real('nominal').notNull(),
  keterangan:     text('keterangan').notNull(),
  kategoriId:     integer('kategori_id').references(() => kategoriKas.id),
  tanggal:        text('tanggal').notNull(),        // ISO date
  bukti:          text('bukti'),                    // file path/URL lokal
  dicatatOleh:    text('dicatat_oleh').notNull(),   // user id
  dibatalkan:     integer('dibatalkan', { mode: 'boolean' }).notNull().default(false),
  alasanBatal:    text('alasan_batal'),
  dibatalkanOleh: text('dibatalkan_oleh'),
  rwId:           integer('rw_id').notNull().references(() => rw.id),
  ...timestamps
});

export const transaksiKasRt = sqliteTable('transaksi_kas_rt', {
  id:             integer('id').primaryKey({ autoIncrement: true }),
  rtId:           integer('rt_id').notNull().references(() => rt.id),
  namaKas:        text('nama_kas').notNull().default('Kas Sosial Kematian'), // e.g. "Kas Sosial Kematian", "Kas Rukun Kematian", "Kas Operasional RT"
  jenis:          text('jenis', { enum: ['pemasukan', 'pengeluaran'] }).notNull(),
  nominal:        real('nominal').notNull(),
  keterangan:     text('keterangan').notNull(),
  kategoriId:     integer('kategori_id').references(() => kategoriKas.id),
  tanggal:        text('tanggal').notNull(),        // ISO date
  bukti:          text('bukti'),                    // file path/URL lokal
  dicatatOleh:    text('dicatat_oleh').notNull(),   // user id
  dibatalkan:     integer('dibatalkan', { mode: 'boolean' }).notNull().default(false),
  alasanBatal:    text('alasan_batal'),
  dibatalkanOleh: text('dibatalkan_oleh'),
  metodePembayaran: text('metode_pembayaran').notNull().default('tunai'),
  midtransOrderId:  text('midtrans_order_id'),
  midtransPaymentType: text('midtrans_payment_type'),
  midtransStatus:   text('midtrans_status'),
  snapToken:        text('snap_token'),
  ...timestamps
});

// ─── Setoran porsi RW dari kas RT (KU-04) ───────────────────────────────────
// Uang iuran RT ditahan di kas RT sampai disetorkan. Satu baris setoran
// mencatat dua sisi sekaligus (kas RT keluar, kas RW masuk) supaya angka
// selalu bisa ditelusuri dan pembatalan tidak pernah menghitung dua kali.
export const setoranRt = sqliteTable('setoran_rt', {
  id:             integer('id').primaryKey({ autoIncrement: true }),
  rtId:           integer('rt_id').notNull().references(() => rt.id),
  periode:        text('periode').notNull(),          // e.g. "2026-10"
  // Snapshot saat setoran dibuat; perubahan pembayaran sesudahnya tidak
  // mengubah setoran yang sudah tercatat.
  totalTerkumpul: real('total_terkumpul').notNull().default(0),
  porsiRw:        real('porsi_rw').notNull().default(0),
  catatan:        text('catatan'),
  bukti:          text('bukti'),
  disetorPada:    text('disetor_pada').notNull(),     // ISO date
  dicatatOleh:    text('dicatat_oleh').notNull(),
  transaksiRwId:  integer('transaksi_rw_id').references(() => transaksiKas.id),
  transaksiRtId:  integer('transaksi_rt_id').references(() => transaksiKasRt.id),
  dibatalkan:     integer('dibatalkan', { mode: 'boolean' }).notNull().default(false),
  alasanBatal:    text('alasan_batal'),
  dibatalkanOleh: text('dibatalkan_oleh'),
  ...timestamps
}, (table) => [
  // Satu RT hanya boleh punya satu setoran aktif per periode. Setoran yang
  // dibatalkan tidak dihitung, jadi periode itu bisa disetor ulang.
  uniqueIndex('setoran_rt_rt_periode_unik')
    .on(table.rtId, table.periode)
    .where(sql`${table.dibatalkan} = 0`)
]);

// ─── Surat-Menyurat (SF-SR-01 s/d SF-SR-07) ─────────────────────────────────
export const surat = sqliteTable('surat', {
  id:               integer('id').primaryKey({ autoIncrement: true }),
  // Nomor hanya diisi saat surat disetujui. UNIQUE menjaga agar dua surat
  // tidak pernah mendapat nomor yang sama walau ada pengajuan bersamaan.
  nomorSurat:       text('nomor_surat').unique(),
  jenis:            text('jenis').notNull(),         // e.g. "skck", "sktm", "domisili", "usaha", "kematian", "umum"
  keperluan:        text('keperluan').notNull(),
  keterangan:       text('keterangan'),
  dokumenSyarat:    text('dokumen_syarat'),          // path lokal file berkas persyaratan
  status:           text('status', {
    enum: ['diajukan', 'diverifikasi', 'disetujui', 'ditolak']
  }).notNull().default('diajukan'),
  catatanPengurus:  text('catatan_pengurus'),        // alasan tolak atau catatan verifikasi
  diverifikasiOleh: text('diverifikasi_oleh'),       // user id pengurus RT/RW
  disetujuiOleh:    text('disetujui_oleh'),          // user id Admin RW
  tanggalTerbit:    text('tanggal_terbit'),          // ISO date
  // Jejak waktu tiap perpindahan status, dipakai timeline di halaman detail.
  diverifikasiPada: text('diverifikasi_pada'),       // ISO datetime
  disetujuiPada:    text('disetujui_pada'),          // ISO datetime
  ditolakPada:      text('ditolak_pada'),            // ISO datetime
  wargaId:          integer('warga_id').notNull().references(() => warga.id),
  ...timestamps
});

// ─── Permintaan Pembaruan Data Warga (SF-KP-08) ──────────────────────────────
// Warga mengajukan perubahan data diri; pengurus menyetujui/menolak sebelum
// perubahan diterapkan ke tabel warga. Status flow:
//   diajukan → diverifikasi → disetujui | ditolak
export const permintaanPembaruan = sqliteTable('permintaan_pembaruan', {
  id:             integer('id').primaryKey({ autoIncrement: true }),
  wargaId:        integer('warga_id').notNull().references(() => warga.id, { onDelete: 'cascade' }),
  // Snapshot perubahan yang diajukan (JSON stringified)
  dataLama:       text('data_lama').notNull(),    // JSON snapshot data sebelum
  dataBaru:       text('data_baru').notNull(),    // JSON data yang diusulkan warga
  catatan:        text('catatan'),                // Penjelasan alasan perubahan
  status:         text('status', {
    enum: ['diajukan', 'diverifikasi', 'disetujui', 'ditolak']
  }).notNull().default('diajukan'),
  catatanPengurus:text('catatan_pengurus'),       // Alasan tolak / catatan verifikasi
  ditinjauOleh:   text('ditinjau_oleh'),          // user id pengurus yang meninjau
  tanggalTinjau:  text('tanggal_tinjau'),         // ISO datetime saat ditinjau
  diajukanOleh:   text('diajukan_oleh').notNull(), // user id warga pengaju
  ...timestamps
}, (table) => [
  index('permintaan_pembaruan_warga_id_idx').on(table.wargaId)
]);
