CREATE TABLE `konfirmasi_bayar` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tagihan_id` integer NOT NULL,
	`jumlah` real NOT NULL,
	`metode_bayar` text DEFAULT 'tunai' NOT NULL,
	`catatan` text,
	`status` text DEFAULT 'menunggu' NOT NULL,
	`diajukan_oleh` text NOT NULL,
	`diproses_oleh` text,
	`diproses_pada` text,
	`alasan_tolak` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`tagihan_id`) REFERENCES `tagihan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `konfirmasi_bayar_tagihan_idx` ON `konfirmasi_bayar` (`tagihan_id`);--> statement-breakpoint
CREATE INDEX `konfirmasi_bayar_status_idx` ON `konfirmasi_bayar` (`status`);