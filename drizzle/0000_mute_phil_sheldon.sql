CREATE TABLE `galeri` (
	`id` int AUTO_INCREMENT NOT NULL,
	`judul` varchar(255) NOT NULL,
	`keterangan` text,
	`foto_url` varchar(255) NOT NULL,
	`urutan` int NOT NULL DEFAULT 0,
	`aktif` boolean NOT NULL DEFAULT true,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `galeri_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jenis_iuran` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`nominal` double NOT NULL,
	`porsi_rw` double NOT NULL DEFAULT 0,
	`periode` enum('bulanan','tahunan','insidental') NOT NULL DEFAULT 'bulanan',
	`scope` enum('rw','rt') NOT NULL DEFAULT 'rt',
	`rt_id` int,
	`urutan` int NOT NULL DEFAULT 0,
	`aktif` boolean NOT NULL DEFAULT true,
	`rw_id` int NOT NULL,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `jenis_iuran_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kategori_kas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`jenis` enum('pemasukan','pengeluaran') NOT NULL,
	`scope` enum('semua','rw','rt') NOT NULL DEFAULT 'semua',
	`rw_id` int NOT NULL,
	CONSTRAINT `kategori_kas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kk` (
	`id` int AUTO_INCREMENT NOT NULL,
	`no_kk` varchar(255) NOT NULL,
	`alamat` varchar(255) NOT NULL,
	`rt_id` int NOT NULL,
	`status_huni` enum('tetap','kontrak','kos') NOT NULL DEFAULT 'tetap',
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `kk_id` PRIMARY KEY(`id`),
	CONSTRAINT `kk_no_kk_unique` UNIQUE(`no_kk`)
);
--> statement-breakpoint
CREATE TABLE `konfirmasi_bayar` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tagihan_id` int NOT NULL,
	`jumlah` double NOT NULL,
	`metode_bayar` enum('tunai','transfer') NOT NULL DEFAULT 'tunai',
	`catatan` text,
	`status` enum('menunggu','diterima','ditolak') NOT NULL DEFAULT 'menunggu',
	`diajukan_oleh` varchar(255) NOT NULL,
	`diproses_oleh` varchar(255),
	`diproses_pada` varchar(255),
	`alasan_tolak` text,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `konfirmasi_bayar_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifikasi` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`judul` varchar(255) NOT NULL,
	`pesan` varchar(255) NOT NULL,
	`tipe` enum('info','sukses','peringatan','bahaya') NOT NULL DEFAULT 'info',
	`tautan` varchar(255),
	`dibaca` boolean NOT NULL DEFAULT false,
	`channel` enum('in_app','email','push') NOT NULL DEFAULT 'in_app',
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `notifikasi_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `paket_iuran` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`keterangan` text,
	`aktif` boolean NOT NULL DEFAULT true,
	`rw_id` int NOT NULL,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `paket_iuran_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `paket_iuran_item` (
	`id` int AUTO_INCREMENT NOT NULL,
	`paket_id` int NOT NULL,
	`jenis_iuran_id` int NOT NULL,
	`urutan` int NOT NULL DEFAULT 0,
	CONSTRAINT `paket_iuran_item_id` PRIMARY KEY(`id`),
	CONSTRAINT `paket_iuran_item_unik` UNIQUE(`paket_id`,`jenis_iuran_id`)
);
--> statement-breakpoint
CREATE TABLE `pembayaran` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tagihan_id` int NOT NULL,
	`jumlah` double NOT NULL,
	`metode_bayar` enum('qris','tunai','transfer') NOT NULL,
	`referensi` varchar(255),
	`catatan` text,
	`dibayar_pada` varchar(255) NOT NULL,
	`dicatat_oleh` varchar(255) NOT NULL,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `pembayaran_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pembayaran_online` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tagihan_id` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`order_id` varchar(255) NOT NULL,
	`jumlah` double NOT NULL,
	`status` enum('pending','capture','settlement','deny','cancel','expire','failure','refund') NOT NULL DEFAULT 'pending',
	`snap_token` text,
	`snap_redirect_url` text,
	`payment_type` varchar(255),
	`pembayaran_id` int,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `pembayaran_online_id` PRIMARY KEY(`id`),
	CONSTRAINT `pembayaran_online_order_id_unique` UNIQUE(`order_id`)
);
--> statement-breakpoint
CREATE TABLE `pengaturan_landing` (
	`id` int NOT NULL,
	`hero_judul` varchar(255),
	`hero_subjudul` varchar(255),
	`hero_background` varchar(255),
	`sambutan` text,
	`nama_ketua` varchar(255),
	`foto_ketua` varchar(255),
	`visi` text,
	`misi` text,
	`sejarah` text,
	`alamat` varchar(255),
	`telepon` varchar(255),
	`email` varchar(255),
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `pengaturan_landing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pengumuman` (
	`id` int AUTO_INCREMENT NOT NULL,
	`judul` varchar(255) NOT NULL,
	`isi` text NOT NULL,
	`kategori` enum('umum','kegiatan','keuangan','darurat') NOT NULL DEFAULT 'umum',
	`tanggal_mulai` varchar(255),
	`tanggal_selesai` varchar(255),
	`tanggal_mulai_event` varchar(255),
	`tanggal_selesai_event` varchar(255),
	`lokasi` varchar(255),
	`periode_ulang` enum('sekali','mingguan','bulanan','kustom') NOT NULL DEFAULT 'sekali',
	`interval_hari` int,
	`thumbnail_url` varchar(255),
	`lampiran_urls` text,
	`ditampilkan` boolean NOT NULL DEFAULT true,
	`rw_id` int NOT NULL,
	`rt_id` int,
	`dibuat_oleh` varchar(255) NOT NULL,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `pengumuman_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pengurus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rt_id` int,
	`jabatan` varchar(255) NOT NULL,
	`nama` varchar(255) NOT NULL,
	`foto_url` varchar(255),
	`urutan` int NOT NULL DEFAULT 0,
	`aktif` boolean NOT NULL DEFAULT true,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `pengurus_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `peran` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`label` varchar(255) NOT NULL,
	`deskripsi` text,
	`tipe` enum('staff','warga') NOT NULL DEFAULT 'staff',
	`scope` enum('all','rt','none') NOT NULL DEFAULT 'none',
	`permissions` json NOT NULL DEFAULT (JSON_OBJECT()),
	`sistem` boolean NOT NULL DEFAULT false,
	`superadmin` boolean NOT NULL DEFAULT false,
	`urutan` int NOT NULL DEFAULT 0,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `peran_id` PRIMARY KEY(`id`),
	CONSTRAINT `peran_nama_unique` UNIQUE(`nama`)
);
--> statement-breakpoint
CREATE TABLE `permintaan_pembaruan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`warga_id` int NOT NULL,
	`data_lama` text NOT NULL,
	`data_baru` text NOT NULL,
	`catatan` text,
	`status` enum('diajukan','diverifikasi','disetujui','ditolak') NOT NULL DEFAULT 'diajukan',
	`catatan_pengurus` text,
	`ditinjau_oleh` varchar(255),
	`tanggal_tinjau` varchar(255),
	`diajukan_oleh` varchar(255) NOT NULL,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `permintaan_pembaruan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `petugas_rt` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`rt_id` int NOT NULL,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `petugas_rt_id` PRIMARY KEY(`id`),
	CONSTRAINT `petugas_rt_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `riwayat_warga` (
	`id` int AUTO_INCREMENT NOT NULL,
	`warga_id` int NOT NULL,
	`diubah_oleh` varchar(255) NOT NULL,
	`alasan` text NOT NULL,
	`ringkasan` text,
	`tanggal` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `riwayat_warga_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rt` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nomor` int NOT NULL,
	`rw_id` int NOT NULL,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `rt_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rw` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(255) NOT NULL,
	`alamat` varchar(255) NOT NULL,
	`kelurahan` varchar(255) NOT NULL,
	`kecamatan` varchar(255) NOT NULL,
	`kota` varchar(255) NOT NULL,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `rw_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `setoran_rt` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rt_id` int NOT NULL,
	`periode` varchar(255) NOT NULL,
	`total_terkumpul` double NOT NULL DEFAULT 0,
	`porsi_rw` double NOT NULL DEFAULT 0,
	`catatan` text,
	`bukti` varchar(255),
	`disetor_pada` varchar(255) NOT NULL,
	`dicatat_oleh` varchar(255) NOT NULL,
	`transaksi_rw_id` int,
	`transaksi_rt_id` int,
	`dibatalkan` boolean NOT NULL DEFAULT false,
	`alasan_batal` text,
	`dibatalkan_oleh` varchar(255),
	`aktif_key` int GENERATED ALWAYS AS (IF(dibatalkan = 0, 1, NULL)) VIRTUAL,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `setoran_rt_id` PRIMARY KEY(`id`),
	CONSTRAINT `setoran_rt_rt_periode_unik` UNIQUE(`rt_id`,`periode`,`aktif_key`)
);
--> statement-breakpoint
CREATE TABLE `surat` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nomor_surat` varchar(255),
	`jenis` varchar(255) NOT NULL,
	`keperluan` varchar(255) NOT NULL,
	`keterangan` text,
	`dokumen_syarat` varchar(255),
	`status` enum('diajukan','menunggu_ttd','terbit','ditolak') NOT NULL DEFAULT 'diajukan',
	`catatan_pengurus` text,
	`butuh_ttd_rt` boolean NOT NULL DEFAULT false,
	`butuh_ttd_rw` boolean NOT NULL DEFAULT false,
	`ttd_rt_url` varchar(255),
	`ttd_rt_oleh` varchar(255),
	`ttd_rt_pada` varchar(255),
	`ttd_rt_nama` varchar(255),
	`ttd_rt_jabatan` varchar(255),
	`ttd_rw_url` varchar(255),
	`ttd_rw_oleh` varchar(255),
	`ttd_rw_pada` varchar(255),
	`ttd_rw_nama` varchar(255),
	`ttd_rw_jabatan` varchar(255),
	`diverifikasi_oleh` varchar(255),
	`disetujui_oleh` varchar(255),
	`tanggal_terbit` varchar(255),
	`diverifikasi_pada` varchar(255),
	`disetujui_pada` varchar(255),
	`ditolak_pada` varchar(255),
	`ditolak_oleh` varchar(255),
	`warga_id` int NOT NULL,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `surat_id` PRIMARY KEY(`id`),
	CONSTRAINT `surat_nomor_surat_unique` UNIQUE(`nomor_surat`)
);
--> statement-breakpoint
CREATE TABLE `tagihan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kk_id` int NOT NULL,
	`jenis_iuran_id` int NOT NULL,
	`periode` varchar(255) NOT NULL,
	`nominal` double NOT NULL,
	`porsi_rw` double NOT NULL DEFAULT 0,
	`status` enum('belum_bayar','lunas','sebagian') NOT NULL DEFAULT 'belum_bayar',
	`jatuh_tempo` varchar(255),
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `tagihan_id` PRIMARY KEY(`id`),
	CONSTRAINT `tagihan_kk_jenis_periode_unik` UNIQUE(`kk_id`,`jenis_iuran_id`,`periode`)
);
--> statement-breakpoint
CREATE TABLE `transaksi_kas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jenis` enum('pemasukan','pengeluaran') NOT NULL,
	`nominal` double NOT NULL,
	`keterangan` text NOT NULL,
	`kategori_id` int,
	`tanggal` varchar(255) NOT NULL,
	`bukti` varchar(255),
	`dicatat_oleh` varchar(255) NOT NULL,
	`dibatalkan` boolean NOT NULL DEFAULT false,
	`alasan_batal` text,
	`dibatalkan_oleh` varchar(255),
	`rw_id` int NOT NULL,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `transaksi_kas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transaksi_kas_rt` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rt_id` int NOT NULL,
	`nama_kas` varchar(255) NOT NULL DEFAULT 'Kas Sosial Kematian',
	`jenis` enum('pemasukan','pengeluaran') NOT NULL,
	`nominal` double NOT NULL,
	`keterangan` text NOT NULL,
	`kategori_id` int,
	`tanggal` varchar(255) NOT NULL,
	`bukti` varchar(255),
	`dicatat_oleh` varchar(255) NOT NULL,
	`dibatalkan` boolean NOT NULL DEFAULT false,
	`alasan_batal` text,
	`dibatalkan_oleh` varchar(255),
	`metode_pembayaran` varchar(255) NOT NULL DEFAULT 'tunai',
	`midtrans_order_id` varchar(255),
	`midtrans_payment_type` varchar(255),
	`midtrans_status` varchar(255),
	`snap_token` text,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `transaksi_kas_rt_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ttd_pejabat` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`url` varchar(255) NOT NULL,
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `ttd_pejabat_id` PRIMARY KEY(`id`),
	CONSTRAINT `ttd_pejabat_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `warga` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nik` varchar(255) NOT NULL,
	`nama` varchar(255) NOT NULL,
	`tempat_lahir` varchar(255) NOT NULL,
	`tanggal_lahir` varchar(255) NOT NULL,
	`jenis_kelamin` enum('L','P') NOT NULL,
	`agama` varchar(255) NOT NULL,
	`pendidikan` varchar(255),
	`pekerjaan` varchar(255),
	`status_perkawinan` enum('belum_kawin','kawin','cerai_hidup','cerai_mati') NOT NULL DEFAULT 'belum_kawin',
	`status_hubungan_kk` enum('kepala_keluarga','istri','anak','lainnya') NOT NULL,
	`kk_id` int NOT NULL,
	`aktif` boolean NOT NULL DEFAULT true,
	`user_id` varchar(255),
	`alasan_nonaktif` text,
	`tanggal_nonaktif` varchar(255),
	`created_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	`updated_at` varchar(255) NOT NULL DEFAULT (current_timestamp),
	CONSTRAINT `warga_id` PRIMARY KEY(`id`),
	CONSTRAINT `warga_nik_unique` UNIQUE(`nik`)
);
--> statement-breakpoint
ALTER TABLE `jenis_iuran` ADD CONSTRAINT `jenis_iuran_rt_id_rt_id_fk` FOREIGN KEY (`rt_id`) REFERENCES `rt`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jenis_iuran` ADD CONSTRAINT `jenis_iuran_rw_id_rw_id_fk` FOREIGN KEY (`rw_id`) REFERENCES `rw`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kategori_kas` ADD CONSTRAINT `kategori_kas_rw_id_rw_id_fk` FOREIGN KEY (`rw_id`) REFERENCES `rw`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kk` ADD CONSTRAINT `kk_rt_id_rt_id_fk` FOREIGN KEY (`rt_id`) REFERENCES `rt`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `konfirmasi_bayar` ADD CONSTRAINT `konfirmasi_bayar_tagihan_id_tagihan_id_fk` FOREIGN KEY (`tagihan_id`) REFERENCES `tagihan`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `paket_iuran` ADD CONSTRAINT `paket_iuran_rw_id_rw_id_fk` FOREIGN KEY (`rw_id`) REFERENCES `rw`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `paket_iuran_item` ADD CONSTRAINT `paket_iuran_item_paket_id_paket_iuran_id_fk` FOREIGN KEY (`paket_id`) REFERENCES `paket_iuran`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `paket_iuran_item` ADD CONSTRAINT `paket_iuran_item_jenis_iuran_id_jenis_iuran_id_fk` FOREIGN KEY (`jenis_iuran_id`) REFERENCES `jenis_iuran`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_tagihan_id_tagihan_id_fk` FOREIGN KEY (`tagihan_id`) REFERENCES `tagihan`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pembayaran_online` ADD CONSTRAINT `pembayaran_online_tagihan_id_tagihan_id_fk` FOREIGN KEY (`tagihan_id`) REFERENCES `tagihan`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pembayaran_online` ADD CONSTRAINT `pembayaran_online_pembayaran_id_pembayaran_id_fk` FOREIGN KEY (`pembayaran_id`) REFERENCES `pembayaran`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pengumuman` ADD CONSTRAINT `pengumuman_rw_id_rw_id_fk` FOREIGN KEY (`rw_id`) REFERENCES `rw`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pengumuman` ADD CONSTRAINT `pengumuman_rt_id_rt_id_fk` FOREIGN KEY (`rt_id`) REFERENCES `rt`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pengurus` ADD CONSTRAINT `pengurus_rt_id_rt_id_fk` FOREIGN KEY (`rt_id`) REFERENCES `rt`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `permintaan_pembaruan` ADD CONSTRAINT `permintaan_pembaruan_warga_id_warga_id_fk` FOREIGN KEY (`warga_id`) REFERENCES `warga`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petugas_rt` ADD CONSTRAINT `petugas_rt_rt_id_rt_id_fk` FOREIGN KEY (`rt_id`) REFERENCES `rt`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `riwayat_warga` ADD CONSTRAINT `riwayat_warga_warga_id_warga_id_fk` FOREIGN KEY (`warga_id`) REFERENCES `warga`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rt` ADD CONSTRAINT `rt_rw_id_rw_id_fk` FOREIGN KEY (`rw_id`) REFERENCES `rw`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `setoran_rt` ADD CONSTRAINT `setoran_rt_rt_id_rt_id_fk` FOREIGN KEY (`rt_id`) REFERENCES `rt`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `setoran_rt` ADD CONSTRAINT `setoran_rt_transaksi_rw_id_transaksi_kas_id_fk` FOREIGN KEY (`transaksi_rw_id`) REFERENCES `transaksi_kas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `setoran_rt` ADD CONSTRAINT `setoran_rt_transaksi_rt_id_transaksi_kas_rt_id_fk` FOREIGN KEY (`transaksi_rt_id`) REFERENCES `transaksi_kas_rt`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `surat` ADD CONSTRAINT `surat_warga_id_warga_id_fk` FOREIGN KEY (`warga_id`) REFERENCES `warga`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tagihan` ADD CONSTRAINT `tagihan_kk_id_kk_id_fk` FOREIGN KEY (`kk_id`) REFERENCES `kk`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tagihan` ADD CONSTRAINT `tagihan_jenis_iuran_id_jenis_iuran_id_fk` FOREIGN KEY (`jenis_iuran_id`) REFERENCES `jenis_iuran`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaksi_kas` ADD CONSTRAINT `transaksi_kas_kategori_id_kategori_kas_id_fk` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_kas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaksi_kas` ADD CONSTRAINT `transaksi_kas_rw_id_rw_id_fk` FOREIGN KEY (`rw_id`) REFERENCES `rw`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaksi_kas_rt` ADD CONSTRAINT `transaksi_kas_rt_rt_id_rt_id_fk` FOREIGN KEY (`rt_id`) REFERENCES `rt`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaksi_kas_rt` ADD CONSTRAINT `transaksi_kas_rt_kategori_id_kategori_kas_id_fk` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_kas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `warga` ADD CONSTRAINT `warga_kk_id_kk_id_fk` FOREIGN KEY (`kk_id`) REFERENCES `kk`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `konfirmasi_bayar_tagihan_idx` ON `konfirmasi_bayar` (`tagihan_id`);--> statement-breakpoint
CREATE INDEX `konfirmasi_bayar_status_idx` ON `konfirmasi_bayar` (`status`);--> statement-breakpoint
CREATE INDEX `notifikasi_user_idx` ON `notifikasi` (`user_id`);--> statement-breakpoint
CREATE INDEX `pembayaran_online_tagihan_idx` ON `pembayaran_online` (`tagihan_id`);--> statement-breakpoint
CREATE INDEX `pembayaran_online_status_idx` ON `pembayaran_online` (`status`);--> statement-breakpoint
CREATE INDEX `pengumuman_rt_id_idx` ON `pengumuman` (`rt_id`);--> statement-breakpoint
CREATE INDEX `pengurus_rt_id_idx` ON `pengurus` (`rt_id`);--> statement-breakpoint
CREATE INDEX `permintaan_pembaruan_warga_id_idx` ON `permintaan_pembaruan` (`warga_id`);--> statement-breakpoint
CREATE INDEX `petugas_rt_rt_id_idx` ON `petugas_rt` (`rt_id`);