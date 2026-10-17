PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_permintaan_pembaruan` (
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
	FOREIGN KEY (`warga_id`) REFERENCES `warga`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_permintaan_pembaruan`("id", "warga_id", "data_lama", "data_baru", "catatan", "status", "catatan_pengurus", "ditinjau_oleh", "tanggal_tinjau", "diajukan_oleh", "created_at", "updated_at") SELECT "id", "warga_id", "data_lama", "data_baru", "catatan", "status", "catatan_pengurus", "ditinjau_oleh", "tanggal_tinjau", "diajukan_oleh", "created_at", "updated_at" FROM `permintaan_pembaruan`;--> statement-breakpoint
DROP TABLE `permintaan_pembaruan`;--> statement-breakpoint
ALTER TABLE `__new_permintaan_pembaruan` RENAME TO `permintaan_pembaruan`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `permintaan_pembaruan_warga_id_idx` ON `permintaan_pembaruan` (`warga_id`);