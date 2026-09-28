CREATE TABLE `jenis_iuran` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text NOT NULL,
	`nominal` real NOT NULL,
	`periode` text DEFAULT 'bulanan' NOT NULL,
	`aktif` integer DEFAULT true NOT NULL,
	`rw_id` integer NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`rw_id`) REFERENCES `rw`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `kategori_kas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text NOT NULL,
	`jenis` text NOT NULL,
	`rw_id` integer NOT NULL,
	FOREIGN KEY (`rw_id`) REFERENCES `rw`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `kk` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`no_kk` text NOT NULL,
	`alamat` text NOT NULL,
	`rt_id` integer NOT NULL,
	`status_huni` text DEFAULT 'tetap' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`rt_id`) REFERENCES `rt`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `kk_no_kk_unique` ON `kk` (`no_kk`);--> statement-breakpoint
CREATE TABLE `pembayaran` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tagihan_id` integer NOT NULL,
	`jumlah` real NOT NULL,
	`metode_bayar` text NOT NULL,
	`referensi` text,
	`catatan` text,
	`dibayar_pada` text NOT NULL,
	`dicatat_oleh` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`tagihan_id`) REFERENCES `tagihan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pengumuman` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`judul` text NOT NULL,
	`isi` text NOT NULL,
	`kategori` text DEFAULT 'umum' NOT NULL,
	`ditampilkan` integer DEFAULT true NOT NULL,
	`rw_id` integer NOT NULL,
	`dibuat_oleh` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`rw_id`) REFERENCES `rw`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rt` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nomor` integer NOT NULL,
	`rw_id` integer NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`rw_id`) REFERENCES `rw`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rw` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text NOT NULL,
	`alamat` text NOT NULL,
	`kelurahan` text NOT NULL,
	`kecamatan` text NOT NULL,
	`kota` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `surat` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jenis` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`warga_id` integer NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`warga_id`) REFERENCES `warga`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tagihan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kk_id` integer NOT NULL,
	`jenis_iuran_id` integer NOT NULL,
	`periode` text NOT NULL,
	`nominal` real NOT NULL,
	`status` text DEFAULT 'belum_bayar' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`kk_id`) REFERENCES `kk`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`jenis_iuran_id`) REFERENCES `jenis_iuran`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transaksi_kas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jenis` text NOT NULL,
	`nominal` real NOT NULL,
	`keterangan` text NOT NULL,
	`kategori_id` integer,
	`tanggal` text NOT NULL,
	`bukti` text,
	`dicatat_oleh` text NOT NULL,
	`rw_id` integer NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`kategori_id`) REFERENCES `kategori_kas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rw_id`) REFERENCES `rw`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `warga` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nik` text NOT NULL,
	`nama` text NOT NULL,
	`tempat_lahir` text NOT NULL,
	`tanggal_lahir` text NOT NULL,
	`jenis_kelamin` text NOT NULL,
	`agama` text NOT NULL,
	`pendidikan` text,
	`pekerjaan` text,
	`status_perkawinan` text DEFAULT 'belum_kawin' NOT NULL,
	`status_hubungan_kk` text NOT NULL,
	`kk_id` integer NOT NULL,
	`aktif` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`kk_id`) REFERENCES `kk`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `warga_nik_unique` ON `warga` (`nik`);