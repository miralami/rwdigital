CREATE TABLE IF NOT EXISTS `riwayat_warga` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`warga_id` integer NOT NULL,
	`diubah_oleh` text NOT NULL,
	`alasan` text NOT NULL,
	`ringkasan` text,
	`tanggal` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`warga_id`) REFERENCES `warga`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE IF EXISTS `surat`;
--> statement-breakpoint
CREATE TABLE `surat` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nomor_surat` text,
	`jenis` text NOT NULL,
	`keperluan` text NOT NULL,
	`keterangan` text,
	`dokumen_syarat` text,
	`status` text DEFAULT 'diajukan' NOT NULL,
	`catatan_pengurus` text,
	`diverifikasi_oleh` text,
	`disetujui_oleh` text,
	`tanggal_terbit` text,
	`warga_id` integer NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`warga_id`) REFERENCES `warga`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `pengumuman` ADD `tanggal_mulai` text;
--> statement-breakpoint
ALTER TABLE `pengumuman` ADD `tanggal_selesai` text;
--> statement-breakpoint
ALTER TABLE `transaksi_kas` ADD `dibatalkan` integer DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE `transaksi_kas` ADD `alasan_batal` text;
--> statement-breakpoint
ALTER TABLE `transaksi_kas` ADD `dibatalkan_oleh` text;
--> statement-breakpoint
ALTER TABLE `warga` ADD `user_id` text;
--> statement-breakpoint
ALTER TABLE `warga` ADD `alasan_nonaktif` text;
--> statement-breakpoint
ALTER TABLE `warga` ADD `tanggal_nonaktif` text;
