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

// ─── Pengumuman ───────────────────────────────────────────────────────────────
export const pengumuman = sqliteTable('pengumuman', {
  id:            integer('id').primaryKey({ autoIncrement: true }),
  judul:         text('judul').notNull(),
  isi:           text('isi').notNull(),
  kategori:      text('kategori', {
    enum: ['umum', 'kegiatan', 'keuangan', 'darurat']
  }).notNull().default('umum'),
  tanggalMulai:  text('tanggal_mulai'),
  tanggalSelesai:text('tanggal_selesai'),
  ditampilkan:   integer('ditampilkan', { mode: 'boolean' }).notNull().default(true),
  rwId:          integer('rw_id').notNull().references(() => rw.id),
  dibuatOleh:    text('dibuat_oleh').notNull(), // user id from better-auth
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

// ─── Surat-Menyurat (SF-SR-01 s/d SF-SR-07) ─────────────────────────────────
export const surat = sqliteTable('surat', {
  id:               integer('id').primaryKey({ autoIncrement: true }),
  nomorSurat:       text('nomor_surat'),
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
  wargaId:          integer('warga_id').notNull().references(() => warga.id),
  ...timestamps
});
