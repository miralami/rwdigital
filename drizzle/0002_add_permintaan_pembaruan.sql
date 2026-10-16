CREATE TABLE `permintaan_pembaruan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`warga_id` integer NOT NULL,
	`data_lama` text NOT NULL,
	`data_baru` text NOT NULL,
	`catatan` text,
	`status` text DEFAULT 'diajukan' NOT NULL,
	`catatan_pengurus` text,
	`ditinjau_oleh` text,
	`tanggal_tinjau` text,
	`diajukan_oleh` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`warga_id`) REFERENCES `warga`(`id`) ON UPDATE no action ON DELETE no action
);
