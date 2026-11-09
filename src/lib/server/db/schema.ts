import {
  boolean,
  customType,
  double,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  uniqueIndex,
  varchar
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

// Kolom JSON yang aman di MySQL maupun MariaDB. MySQL mengembalikan objek dari
// kolom JSON, sedangkan MariaDB (JSON = alias LONGTEXT) mengembalikan string;
// tipe bawaan Drizzle hanya siap untuk kasus pertama.
const jsonKolom = <T>(nama: string) =>
  customType<{ data: T; driverData: string | T }>({
    dataType: () => 'json',
    toDriver: (nilai) => JSON.stringify(nilai),
    fromDriver: (nilai) => (typeof nilai === 'string' ? (JSON.parse(nilai) as T) : nilai)
  })(nama);

// ─── Timestamps helper ───────────────────────────────────────────────────────
const timestamps = {
  createdAt: varchar('created_at', { length: 255 }).notNull().default(sql`(current_timestamp)`),
  updatedAt: varchar('updated_at', { length: 255 }).notNull().default(sql`(current_timestamp)`)
};

// ─── RW ──────────────────────────────────────────────────────────────────────
export const rw = mysqlTable('rw', {
  id:       int('id').primaryKey().autoincrement(),
  nama:     varchar('nama', { length: 255 }).notNull(),
  alamat:   varchar('alamat', { length: 255 }).notNull(),
  kelurahan:varchar('kelurahan', { length: 255 }).notNull(),
  kecamatan:varchar('kecamatan', { length: 255 }).notNull(),
  kota:     varchar('kota', { length: 255 }).notNull(),
  ...timestamps
});

// ─── RT ──────────────────────────────────────────────────────────────────────
export const rt = mysqlTable('rt', {
  id:       int('id').primaryKey().autoincrement(),
  nomor:    int('nomor').notNull(),           // e.g. 01, 02
  rwId:     int('rw_id').notNull().references(() => rw.id),
  ...timestamps
});

// ── Penugasan pengurus RT ────────────────────────────────────────────────────
// Satu akun `pengurus_rt` bertugas di satu RT. Tabel terpisah dipakai supaya
// tabel `user` milik Better Auth tidak perlu diubah. Akun tanpa baris di sini
// tidak mendapat akses data RT mana pun (fail-closed).
export const petugasRt = mysqlTable('petugas_rt', {
  id:     int('id').primaryKey().autoincrement(),
  userId: varchar('user_id', { length: 255 }).notNull().unique(),     // Better Auth user.id
  rtId:   int('rt_id').notNull().references(() => rt.id),
  ...timestamps
}, (table) => [
  index('petugas_rt_rt_id_idx').on(table.rtId)
]);

// ── Tanda tangan elektronik per akun pengurus ───────────────────────────────
// Disimpan terpisah dari tabel `user` Better Auth. Satu akun pengurus punya
// satu gambar TTD; snapshot URL-nya disalin ke surat saat menandatangani agar
// dokumen lama tidak berubah ketika gambar diganti.
export const ttdPejabat = mysqlTable('ttd_pejabat', {
  id:        int('id').primaryKey().autoincrement(),
  userId:    varchar('user_id', { length: 255 }).notNull().unique(),  // Better Auth user.id
  url:       varchar('url', { length: 255 }).notNull(),               // /uploads/ttd/...
  ...timestamps
});

// ─── Peran & Izin (RBAC dinamis) ─────────────────────────────────────────────
// Sumber kebenaran izin aplikasi. Better Auth hanya menyimpan slug role di
// `user.role`; modul ini yang menentukan modul/aksi apa yang boleh dilakukan
// pemilik role tersebut, sehingga superadmin bisa membuat role baru tanpa
// mengubah kode.
//
// - `nama`      : slug yang juga disimpan di `user.role` (mis. "pengurus_rw").
// - `tipe`      : "staff" (masuk aplikasi admin) atau "warga" (portal).
// - `scope`     : "all" (seluruh RW), "rt" (hanya RT yang ditugaskan), "none".
// - `permissions`: map modul → daftar aksi, mis. { "warga": ["read"] }.
// - `sistem`    : role bawaan yang boleh diubah izinnya tapi tidak dihapus.
// - `superadmin` : role dengan akses penuh permanen, tidak bisa diedit/dihapus.
export const peran = mysqlTable('peran', {
  id:          int('id').primaryKey().autoincrement(),
  nama:        varchar('nama', { length: 255 }).notNull().unique(),
  label:       varchar('label', { length: 255 }).notNull(),
  deskripsi:   text('deskripsi'),
  tipe:        mysqlEnum('tipe', ['staff', 'warga']).notNull().default('staff'),
  scope:       mysqlEnum('scope', ['all', 'rt', 'none']).notNull().default('none'),
  permissions: jsonKolom<Record<string, string[]>>('permissions')
    .notNull()
    .default(sql`(JSON_OBJECT())`),
  sistem:      boolean('sistem').notNull().default(false),
  superadmin:  boolean('superadmin').notNull().default(false),
  urutan:      int('urutan').notNull().default(0),
  ...timestamps
});

// ─── KK (Kartu Keluarga) ─────────────────────────────────────────────────────
export const kk = mysqlTable('kk', {
  id:        int('id').primaryKey().autoincrement(),
  noKk:      varchar('no_kk', { length: 255 }).notNull().unique(),   // 16-digit KK number
  alamat:    varchar('alamat', { length: 255 }).notNull(),
  rtId:      int('rt_id').notNull().references(() => rt.id),
  statusHuni:mysqlEnum('status_huni', ['tetap', 'kontrak', 'kos']).notNull().default('tetap'),
  ...timestamps
});

// ─── Warga ───────────────────────────────────────────────────────────────────
export const warga = mysqlTable('warga', {
  id:           int('id').primaryKey().autoincrement(),
  nik:          varchar('nik', { length: 255 }).notNull().unique(),   // 16-digit NIK
  nama:         varchar('nama', { length: 255 }).notNull(),
  tempatLahir:  varchar('tempat_lahir', { length: 255 }).notNull(),
  tanggalLahir: varchar('tanggal_lahir', { length: 255 }).notNull(), // ISO date string
  jenisKelamin: mysqlEnum('jenis_kelamin', ['L', 'P']).notNull(),
  agama:        varchar('agama', { length: 255 }).notNull(),
  pendidikan:   varchar('pendidikan', { length: 255 }),
  pekerjaan:    varchar('pekerjaan', { length: 255 }),
  statusPerkawinan: mysqlEnum('status_perkawinan', ['belum_kawin', 'kawin', 'cerai_hidup', 'cerai_mati']).notNull().default('belum_kawin'),
  statusHubunganKk: mysqlEnum('status_hubungan_kk', ['kepala_keluarga', 'istri', 'anak', 'lainnya']).notNull(),
  kkId:         int('kk_id').notNull().references(() => kk.id),
  aktif:        boolean('aktif').notNull().default(true),
  userId:       varchar('user_id', { length: 255 }),                  // Better Auth user.id
  alasanNonaktif:  text('alasan_nonaktif'),       // Pindah / Meninggal / dll.
  tanggalNonaktif: varchar('tanggal_nonaktif', { length: 255 }),      // Tanggal dinonaktifkan
  ...timestamps
});

export const riwayatWarga = mysqlTable('riwayat_warga', {
  id:         int('id').primaryKey().autoincrement(),
  wargaId:    int('warga_id').notNull().references(() => warga.id),
  diubahOleh: varchar('diubah_oleh', { length: 255 }).notNull(),      // user id yang mengubah
  alasan:     text('alasan').notNull(),           // Alasan perubahan
  ringkasan:  text('ringkasan'),                  // Detail data yang diubah
  tanggal:    varchar('tanggal', { length: 255 }).notNull().default(sql`(current_timestamp)`)
});

// ─── Pengurus (bagan organisasi RW & RT) ────────────────────────────────────
// `rtId` NULL = pengurus tingkat RW. `fotoUrl` menunjuk ke /uploads/pengurus/...
// supaya bagan pengurus di landing page bisa menampilkan foto asli.
export const pengurus = mysqlTable('pengurus', {
  id:       int('id').primaryKey().autoincrement(),
  rtId:     int('rt_id').references(() => rt.id),   // null = pengurus RW
  jabatan:  varchar('jabatan', { length: 255 }).notNull(),                  // Ketua, Sekretaris, Bendahara, ...
  nama:     varchar('nama', { length: 255 }).notNull(),
  fotoUrl:  varchar('foto_url', { length: 255 }),
  urutan:   int('urutan').notNull().default(0),
  aktif:    boolean('aktif').notNull().default(true),
  ...timestamps
}, (table) => [
  index('pengurus_rt_id_idx').on(table.rtId)
]);

// ─── Pengaturan Landing & Galeri (LP-01) ────────────────────────────────────
// Satu baris konfigurasi (id = 1). Nilai kosong berarti landing memakai
// default yang tertanam di kode, sehingga instalasi baru tetap tampil utuh.
export const pengaturanLanding = mysqlTable('pengaturan_landing', {
  id:               int('id').primaryKey(),
  heroJudul:        varchar('hero_judul', { length: 255 }),
  heroSubjudul:     varchar('hero_subjudul', { length: 255 }),
  // Berupa warna hex (#0f172a) atau path gambar (/uploads/landing/...).
  heroBackground:   varchar('hero_background', { length: 255 }),
  sambutan:         text('sambutan'),
  namaKetua:        varchar('nama_ketua', { length: 255 }),
  fotoKetua:        varchar('foto_ketua', { length: 255 }),
  visi:             text('visi'),
  misi:             text('misi'),          // satu poin per baris
  sejarah:          text('sejarah'),
  alamat:           varchar('alamat', { length: 255 }),
  telepon:          varchar('telepon', { length: 255 }),
  email:            varchar('email', { length: 255 }),
  ...timestamps
});

export const galeri = mysqlTable('galeri', {
  id:         int('id').primaryKey().autoincrement(),
  judul:      varchar('judul', { length: 255 }).notNull(),
  keterangan: text('keterangan'),
  fotoUrl:    varchar('foto_url', { length: 255 }).notNull(),
  urutan:     int('urutan').notNull().default(0),
  aktif:      boolean('aktif').notNull().default(true),
  ...timestamps
});

// ─── Pengumuman ───────────────────────────────────────────────────────────────
export const pengumuman = mysqlTable('pengumuman', {
  id:            int('id').primaryKey().autoincrement(),
  judul:         varchar('judul', { length: 255 }).notNull(),
  isi:           text('isi').notNull(),
  kategori:      mysqlEnum('kategori', ['umum', 'kegiatan', 'keuangan', 'darurat']).notNull().default('umum'),
  tanggalMulai:        varchar('tanggal_mulai', { length: 255 }),
  tanggalSelesai:      varchar('tanggal_selesai', { length: 255 }),
  tanggalMulaiEvent:   varchar('tanggal_mulai_event', { length: 255 }),
  tanggalSelesaiEvent: varchar('tanggal_selesai_event', { length: 255 }),
  lokasi:              varchar('lokasi', { length: 255 }),
  periodeUlang:        mysqlEnum('periode_ulang', ['sekali', 'mingguan', 'bulanan', 'kustom']).notNull().default('sekali'),
  intervalHari:        int('interval_hari'),
  thumbnailUrl:        varchar('thumbnail_url', { length: 255 }),
  lampiranUrls:        text('lampiran_urls'), // JSON array of string URLs
  ditampilkan:         boolean('ditampilkan').notNull().default(true),
  rwId:                int('rw_id').notNull().references(() => rw.id),
  // null = pengumuman tingkat RW (berlaku semua RT); terisi = khusus RT itu.
  rtId:                int('rt_id').references(() => rt.id),
  dibuatOleh:          varchar('dibuat_oleh', { length: 255 }).notNull(), // user id from better-auth
  ...timestamps
}, (table) => [
  index('pengumuman_rt_id_idx').on(table.rtId)
]);

// ─── Notifikasi Sistem (In-app, Email, Push) ──────────────────────────────────
export const notifikasi = mysqlTable('notifikasi', {
  id:        int('id').primaryKey().autoincrement(),
  userId:    varchar('user_id', { length: 255 }).notNull(),
  judul:     varchar('judul', { length: 255 }).notNull(),
  pesan:     varchar('pesan', { length: 255 }).notNull(),
  tipe:      mysqlEnum('tipe', ['info', 'sukses', 'peringatan', 'bahaya']).notNull().default('info'),
  tautan:    varchar('tautan', { length: 255 }),
  dibaca:    boolean('dibaca').notNull().default(false),
  channel:   mysqlEnum('channel', ['in_app', 'email', 'push']).notNull().default('in_app'),
  ...timestamps
}, (table) => [
  index('notifikasi_user_idx').on(table.userId)
]);

// ─── Iuran (jenis/tagihan periodik) ──────────────────────────────────────────
export const jenisIuran = mysqlTable('jenis_iuran', {
  id:       int('id').primaryKey().autoincrement(),
  nama:     varchar('nama', { length: 255 }).notNull(),             // e.g. "Iuran Keamanan", "Kebersihan"
  nominal:  double('nominal').notNull(),
  // Bagian RW dari tiap tagihan (nominal tetap per KK). Nilai ini adalah
  // konfigurasi data, bukan konstanta kode, sehingga porsi bisa diubah
  // kapan saja tanpa menyentuh tagihan lama (lihat snapshot di `tagihan`).
  porsiRw:  double('porsi_rw').notNull().default(0),
  periode:  mysqlEnum('periode', ['bulanan', 'tahunan', 'insidental']).notNull().default('bulanan'),
  // Siapa yang menagih: 'rw' = langsung RW ke warga, 'rt' = lewat RT.
  // Hanya jenis ber-scope 'rt' yang boleh digenerate per RT. Default 'rt'
  // supaya data lama (yang selama ini ditagih lewat RT) tetap bisa digenerate.
  scope:    mysqlEnum('scope', ['rw', 'rt']).notNull().default('rt'),
  rtId:     int('rt_id').references(() => rt.id), // pemilik bila scope 'rt'; null = semua RT
  urutan:   int('urutan').notNull().default(0),
  aktif:    boolean('aktif').notNull().default(true),
  rwId:     int('rw_id').notNull().references(() => rw.id),
  ...timestamps
});

// Paket = preset beberapa jenis iuran yang biasa ditagih bersamaan
// (mis. K3 + Soskem + Santunan). Isinya data, bukan kode.
export const paketIuran = mysqlTable('paket_iuran', {
  id:         int('id').primaryKey().autoincrement(),
  nama:       varchar('nama', { length: 255 }).notNull(),
  keterangan: text('keterangan'),
  aktif:      boolean('aktif').notNull().default(true),
  rwId:       int('rw_id').notNull().references(() => rw.id),
  ...timestamps
});

export const paketIuranItem = mysqlTable('paket_iuran_item', {
  id:           int('id').primaryKey().autoincrement(),
  paketId:      int('paket_id').notNull().references(() => paketIuran.id, { onDelete: 'cascade' }),
  jenisIuranId: int('jenis_iuran_id').notNull().references(() => jenisIuran.id),
  urutan:       int('urutan').notNull().default(0)
}, (table) => [
  uniqueIndex('paket_iuran_item_unik').on(table.paketId, table.jenisIuranId)
]);

export const tagihan = mysqlTable('tagihan', {
  id:           int('id').primaryKey().autoincrement(),
  kkId:         int('kk_id').notNull().references(() => kk.id),
  jenisIuranId: int('jenis_iuran_id').notNull().references(() => jenisIuran.id),
  periode:      varchar('periode', { length: 255 }).notNull(),      // e.g. "2025-01"
  // Snapshot saat tagihan dibuat: perubahan nominal/porsi di jenis_iuran
  // tidak boleh mengubah tagihan yang sudah terbit.
  nominal:      double('nominal').notNull(),
  porsiRw:      double('porsi_rw').notNull().default(0),
  status:       mysqlEnum('status', ['belum_bayar', 'lunas', 'sebagian']).notNull().default('belum_bayar'),
  // Tanggal jatuh tempo (D4). Disimpan per tagihan supaya perubahan kebijakan
  // tidak menggeser tagihan yang sudah terbit. Null = belum ditetapkan.
  jatuhTempo:   varchar('jatuh_tempo', { length: 255 }),
  ...timestamps
}, (table) => [
  // Satu KK hanya punya satu tagihan per jenis per periode. Ini yang membuat
  // generate ulang idempoten, termasuk saat dua permintaan berjalan bersamaan.
  uniqueIndex('tagihan_kk_jenis_periode_unik').on(table.kkId, table.jenisIuranId, table.periode)
]);

export const pembayaran = mysqlTable('pembayaran', {
  id:          int('id').primaryKey().autoincrement(),
  tagihanId:   int('tagihan_id').notNull().references(() => tagihan.id),
  jumlah:      double('jumlah').notNull(),
  metodeBayar: mysqlEnum('metode_bayar', ['qris', 'tunai', 'transfer']).notNull(),
  referensi:   varchar('referensi', { length: 255 }),               // QRIS/payment gateway ref
  catatan:     text('catatan'),
  dibayarPada: varchar('dibayar_pada', { length: 255 }).notNull(),  // ISO datetime
  dicatatOleh: varchar('dicatat_oleh', { length: 255 }).notNull(),  // user id
  ...timestamps
});

// Pesanan pembayaran iuran lewat Midtrans Snap. Dipisahkan dari `pembayaran`
// karena order bisa dibuat, kedaluwarsa, atau gagal tanpa pernah menjadi
// pembayaran resmi. Baru setelah settlement/`capture` sukses baris
// `pembayaran` dibuat (lewat `catatPembayaran`) dan `pembayaranId` diisi.
export const pembayaranOnline = mysqlTable('pembayaran_online', {
  id:              int('id').primaryKey().autoincrement(),
  tagihanId:       int('tagihan_id').notNull().references(() => tagihan.id),
  userId:          varchar('user_id', { length: 255 }).notNull(),          // Better Auth user.id
  orderId:         varchar('order_id', { length: 255 }).notNull().unique(), // order_id Midtrans
  jumlah:          double('jumlah').notNull(),
  status:          mysqlEnum('status', ['pending', 'capture', 'settlement', 'deny', 'cancel', 'expire', 'failure', 'refund']).notNull().default('pending'),
  snapToken:       text('snap_token'),
  snapRedirectUrl: text('snap_redirect_url'),
  paymentType:     varchar('payment_type', { length: 255 }),
  pembayaranId:    int('pembayaran_id').references(() => pembayaran.id),
  ...timestamps
}, (table) => [
  index('pembayaran_online_tagihan_idx').on(table.tagihanId),
  index('pembayaran_online_status_idx').on(table.status)
]);

// Pengajuan konfirmasi bayar dari portal warga (biasanya tunai ke bendahara).
// Baru menjadi `pembayaran` resmi setelah diterima bendahara, supaya status
// tagihan di portal dan di halaman staf selalu berasal dari sumber yang sama.
export const konfirmasiBayar = mysqlTable('konfirmasi_bayar', {
  id:           int('id').primaryKey().autoincrement(),
  tagihanId:    int('tagihan_id').notNull().references(() => tagihan.id),
  jumlah:       double('jumlah').notNull(),
  metodeBayar:  mysqlEnum('metode_bayar', ['tunai', 'transfer']).notNull().default('tunai'),
  catatan:      text('catatan'),
  status:       mysqlEnum('status', ['menunggu', 'diterima', 'ditolak']).notNull().default('menunggu'),
  diajukanOleh: varchar('diajukan_oleh', { length: 255 }).notNull(),  // user id warga
  diprosesOleh: varchar('diproses_oleh', { length: 255 }),
  diprosesPada: varchar('diproses_pada', { length: 255 }),
  alasanTolak:  text('alasan_tolak'),
  ...timestamps
}, (table) => [
  index('konfirmasi_bayar_tagihan_idx').on(table.tagihanId),
  index('konfirmasi_bayar_status_idx').on(table.status)
]);

// ─── Kas RW & Kas RT (KU-01 s/d KU-04) ──────────────────────────────────────
export const kategoriKas = mysqlTable('kategori_kas', {
  id:    int('id').primaryKey().autoincrement(),
  nama:  varchar('nama', { length: 255 }).notNull(),
  jenis: mysqlEnum('jenis', ['pemasukan', 'pengeluaran']).notNull(),
  scope: mysqlEnum('scope', ['semua', 'rw', 'rt']).notNull().default('semua'),
  rwId:  int('rw_id').notNull().references(() => rw.id)
});

export const transaksiKas = mysqlTable('transaksi_kas', {
  id:             int('id').primaryKey().autoincrement(),
  jenis:          mysqlEnum('jenis', ['pemasukan', 'pengeluaran']).notNull(),
  nominal:        double('nominal').notNull(),
  keterangan:     text('keterangan').notNull(),
  kategoriId:     int('kategori_id').references(() => kategoriKas.id),
  tanggal:        varchar('tanggal', { length: 255 }).notNull(),        // ISO date
  bukti:          varchar('bukti', { length: 255 }),                    // file path/URL lokal
  dicatatOleh:    varchar('dicatat_oleh', { length: 255 }).notNull(),   // user id
  dibatalkan:     boolean('dibatalkan').notNull().default(false),
  alasanBatal:    text('alasan_batal'),
  dibatalkanOleh: varchar('dibatalkan_oleh', { length: 255 }),
  rwId:           int('rw_id').notNull().references(() => rw.id),
  ...timestamps
});

export const transaksiKasRt = mysqlTable('transaksi_kas_rt', {
  id:             int('id').primaryKey().autoincrement(),
  rtId:           int('rt_id').notNull().references(() => rt.id),
  namaKas:        varchar('nama_kas', { length: 255 }).notNull().default('Kas Sosial Kematian'), // e.g. "Kas Sosial Kematian", "Kas Rukun Kematian", "Kas Operasional RT"
  jenis:          mysqlEnum('jenis', ['pemasukan', 'pengeluaran']).notNull(),
  nominal:        double('nominal').notNull(),
  keterangan:     text('keterangan').notNull(),
  kategoriId:     int('kategori_id').references(() => kategoriKas.id),
  tanggal:        varchar('tanggal', { length: 255 }).notNull(),        // ISO date
  bukti:          varchar('bukti', { length: 255 }),                    // file path/URL lokal
  dicatatOleh:    varchar('dicatat_oleh', { length: 255 }).notNull(),   // user id
  dibatalkan:     boolean('dibatalkan').notNull().default(false),
  alasanBatal:    text('alasan_batal'),
  dibatalkanOleh: varchar('dibatalkan_oleh', { length: 255 }),
  metodePembayaran: varchar('metode_pembayaran', { length: 255 }).notNull().default('tunai'),
  midtransOrderId:  varchar('midtrans_order_id', { length: 255 }),
  midtransPaymentType: varchar('midtrans_payment_type', { length: 255 }),
  midtransStatus:   varchar('midtrans_status', { length: 255 }),
  snapToken:        text('snap_token'),
  ...timestamps
});

// ─── Setoran porsi RW dari kas RT (KU-04) ───────────────────────────────────
// Uang iuran RT ditahan di kas RT sampai disetorkan. Satu baris setoran
// mencatat dua sisi sekaligus (kas RT keluar, kas RW masuk) supaya angka
// selalu bisa ditelusuri dan pembatalan tidak pernah menghitung dua kali.
export const setoranRt = mysqlTable('setoran_rt', {
  id:             int('id').primaryKey().autoincrement(),
  rtId:           int('rt_id').notNull().references(() => rt.id),
  periode:        varchar('periode', { length: 255 }).notNull(),          // e.g. "2026-10"
  // Snapshot saat setoran dibuat; perubahan pembayaran sesudahnya tidak
  // mengubah setoran yang sudah tercatat.
  totalTerkumpul: double('total_terkumpul').notNull().default(0),
  porsiRw:        double('porsi_rw').notNull().default(0),
  catatan:        text('catatan'),
  bukti:          varchar('bukti', { length: 255 }),
  disetorPada:    varchar('disetor_pada', { length: 255 }).notNull(),     // ISO date
  dicatatOleh:    varchar('dicatat_oleh', { length: 255 }).notNull(),
  transaksiRwId:  int('transaksi_rw_id').references(() => transaksiKas.id),
  transaksiRtId:  int('transaksi_rt_id').references(() => transaksiKasRt.id),
  dibatalkan:     boolean('dibatalkan').notNull().default(false),
  alasanBatal:    text('alasan_batal'),
  dibatalkanOleh: varchar('dibatalkan_oleh', { length: 255 }),
  // Kolom turunan: 1 saat setoran aktif, NULL saat dibatalkan. MySQL tidak punya
  // partial unique index, jadi keunikan "satu setoran aktif" dibangun lewat
  // unique index yang menyertakan kolom ini (NULL tidak dianggap duplikat).
  aktifKey:       int('aktif_key').generatedAlwaysAs(sql`IF(dibatalkan = 0, 1, NULL)`, { mode: 'virtual' }),
  ...timestamps
}, (table) => [
  // Satu RT hanya boleh punya satu setoran aktif per periode. Setoran yang
  // dibatalkan tidak dihitung, jadi periode itu bisa disetor ulang.
  uniqueIndex('setoran_rt_rt_periode_unik').on(table.rtId, table.periode, table.aktifKey)
]);

// ─── Surat-Menyurat (SF-SR-01 s/d SF-SR-07) ─────────────────────────────────
export const surat = mysqlTable('surat', {
  id:               int('id').primaryKey().autoincrement(),
  // Nomor hanya diisi saat seluruh TTD yang diminta selesai (status terbit).
  // UNIQUE menjaga agar dua surat tidak pernah mendapat nomor yang sama.
  nomorSurat:       varchar('nomor_surat', { length: 255 }).unique(),
  jenis:            varchar('jenis', { length: 255 }).notNull(),         // e.g. "skck", "sktm", "domisili", "usaha", "kematian", "umum"
  keperluan:        varchar('keperluan', { length: 255 }).notNull(),
  keterangan:       text('keterangan'),
  dokumenSyarat:    varchar('dokumen_syarat', { length: 255 }),          // path lokal file berkas persyaratan
  status:           mysqlEnum('status', ['diajukan', 'menunggu_ttd', 'terbit', 'ditolak']).notNull().default('diajukan'),
  catatanPengurus:  text('catatan_pengurus'),        // alasan tolak atau catatan verifikasi
  // Permintaan tanda tangan dari warga saat mengajukan surat.
  butuhTtdRt:       boolean('butuh_ttd_rt').notNull().default(false),
  butuhTtdRw:       boolean('butuh_ttd_rw').notNull().default(false),
  // Snapshot tanda tangan: URL gambar + identitas pejabat saat menandatangani.
  ttdRtUrl:         varchar('ttd_rt_url', { length: 255 }),
  ttdRtOleh:        varchar('ttd_rt_oleh', { length: 255 }),             // user id penanda tangan RT
  ttdRtPada:        varchar('ttd_rt_pada', { length: 255 }),             // ISO datetime
  ttdRtNama:        varchar('ttd_rt_nama', { length: 255 }),
  ttdRtJabatan:     varchar('ttd_rt_jabatan', { length: 255 }),
  ttdRwUrl:         varchar('ttd_rw_url', { length: 255 }),
  ttdRwOleh:        varchar('ttd_rw_oleh', { length: 255 }),             // user id penanda tangan RW
  ttdRwPada:        varchar('ttd_rw_pada', { length: 255 }),             // ISO datetime
  ttdRwNama:        varchar('ttd_rw_nama', { length: 255 }),
  ttdRwJabatan:     varchar('ttd_rw_jabatan', { length: 255 }),
  // Jejak proses: verifikasi diisi saat pihak pertama menandatangani, lalu
  // disetujui/terbit saat semua TTD yang diminta lengkap.
  diverifikasiOleh: varchar('diverifikasi_oleh', { length: 255 }),       // user id pengurus RT/RW
  disetujuiOleh:    varchar('disetujui_oleh', { length: 255 }),          // user id pihak terakhir
  tanggalTerbit:    varchar('tanggal_terbit', { length: 255 }),          // ISO date
  diverifikasiPada: varchar('diverifikasi_pada', { length: 255 }),       // ISO datetime
  disetujuiPada:    varchar('disetujui_pada', { length: 255 }),          // ISO datetime
  ditolakPada:      varchar('ditolak_pada', { length: 255 }),            // ISO datetime
  ditolakOleh:      varchar('ditolak_oleh', { length: 255 }),            // user id penolak
  wargaId:          int('warga_id').notNull().references(() => warga.id),
  ...timestamps
});

// ─── Permintaan Pembaruan Data Warga (SF-KP-08) ──────────────────────────────
// Warga mengajukan perubahan data diri; pengurus menyetujui/menolak sebelum
// perubahan diterapkan ke tabel warga. Status flow:
//   diajukan → diverifikasi → disetujui | ditolak
export const permintaanPembaruan = mysqlTable('permintaan_pembaruan', {
  id:             int('id').primaryKey().autoincrement(),
  wargaId:        int('warga_id').notNull().references(() => warga.id, { onDelete: 'cascade' }),
  // Snapshot perubahan yang diajukan (JSON stringified)
  dataLama:       text('data_lama').notNull(),    // JSON snapshot data sebelum
  dataBaru:       text('data_baru').notNull(),    // JSON data yang diusulkan warga
  catatan:        text('catatan'),                // Penjelasan alasan perubahan
  status:         mysqlEnum('status', ['diajukan', 'diverifikasi', 'disetujui', 'ditolak']).notNull().default('diajukan'),
  catatanPengurus:text('catatan_pengurus'),       // Alasan tolak / catatan verifikasi
  ditinjauOleh:   varchar('ditinjau_oleh', { length: 255 }),          // user id pengurus yang meninjau
  tanggalTinjau:  varchar('tanggal_tinjau', { length: 255 }),         // ISO datetime saat ditinjau
  diajukanOleh:   varchar('diajukan_oleh', { length: 255 }).notNull(), // user id warga pengaju
  ...timestamps
}, (table) => [
  index('permintaan_pembaruan_warga_id_idx').on(table.wargaId)
]);
