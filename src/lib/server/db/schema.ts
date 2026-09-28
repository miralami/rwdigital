import {
  integer,
  real,
  sqliteTable,
  text
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
  ...timestamps
});

// ─── Pengumuman ───────────────────────────────────────────────────────────────
export const pengumuman = sqliteTable('pengumuman', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  judul:     text('judul').notNull(),
  isi:       text('isi').notNull(),
  kategori:  text('kategori', {
    enum: ['umum', 'kegiatan', 'keuangan', 'darurat']
  }).notNull().default('umum'),
  ditampilkan: integer('ditampilkan', { mode: 'boolean' }).notNull().default(true),
  rwId:      integer('rw_id').notNull().references(() => rw.id),
  dibuatOleh:text('dibuat_oleh').notNull(), // user id from better-auth
  ...timestamps
});

// ─── Iuran (jenis/tagihan periodik) ──────────────────────────────────────────
export const jenisIuran = sqliteTable('jenis_iuran', {
  id:       integer('id').primaryKey({ autoIncrement: true }),
  nama:     text('nama').notNull(),             // e.g. "Iuran Keamanan", "Kebersihan"
  nominal:  real('nominal').notNull(),
  periode:  text('periode', { enum: ['bulanan', 'tahunan', 'insidental'] }).notNull().default('bulanan'),
  aktif:    integer('aktif', { mode: 'boolean' }).notNull().default(true),
  rwId:     integer('rw_id').notNull().references(() => rw.id),
  ...timestamps
});

export const tagihan = sqliteTable('tagihan', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  kkId:         integer('kk_id').notNull().references(() => kk.id),
  jenisIuranId: integer('jenis_iuran_id').notNull().references(() => jenisIuran.id),
  periode:      text('periode').notNull(),      // e.g. "2025-01"
  nominal:      real('nominal').notNull(),
  status:       text('status', { enum: ['belum_bayar', 'lunas', 'sebagian'] }).notNull().default('belum_bayar'),
  ...timestamps
});

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

// ─── Kas RW ───────────────────────────────────────────────────────────────────
export const kategoriKas = sqliteTable('kategori_kas', {
  id:    integer('id').primaryKey({ autoIncrement: true }),
  nama:  text('nama').notNull(),
  jenis: text('jenis', { enum: ['pemasukan', 'pengeluaran'] }).notNull(),
  rwId:  integer('rw_id').notNull().references(() => rw.id)
});

export const transaksiKas = sqliteTable('transaksi_kas', {
  id:          integer('id').primaryKey({ autoIncrement: true }),
  jenis:       text('jenis', { enum: ['pemasukan', 'pengeluaran'] }).notNull(),
  nominal:     real('nominal').notNull(),
  keterangan:  text('keterangan').notNull(),
  kategoriId:  integer('kategori_id').references(() => kategoriKas.id),
  tanggal:     text('tanggal').notNull(),        // ISO date
  bukti:       text('bukti'),                    // file path/URL
  dicatatOleh: text('dicatat_oleh').notNull(),   // user id
  rwId:        integer('rw_id').notNull().references(() => rw.id),
  ...timestamps
});

// ─── Surat (pending — scaffold only) ────────────────────────────────────────
// ponytail: surat table placeholder; build out only after mitra interview confirms flow
export const surat = sqliteTable('surat', {
  id:       integer('id').primaryKey({ autoIncrement: true }),
  jenis:    text('jenis').notNull(),
  status:   text('status', { enum: ['draft', 'diajukan', 'disetujui', 'ditolak'] }).notNull().default('draft'),
  wargaId:  integer('warga_id').notNull().references(() => warga.id),
  ...timestamps
});
