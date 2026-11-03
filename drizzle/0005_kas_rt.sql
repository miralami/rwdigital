CREATE TABLE `transaksi_kas_rt` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rt_id` integer NOT NULL,
	`nama_kas` text DEFAULT 'Kas Sosial Kematian' NOT NULL,
	`jenis` text NOT NULL,
	`nominal` real NOT NULL,
	`keterangan` text NOT NULL,
	`kategori_id` integer,
	`tanggal` text NOT NULL,
	`bukti` text,
	`dicatat_oleh` text NOT NULL,
	`dibatalkan` integer DEFAULT false NOT NULL,
	`alasan_batal` text,
	`dibatalkan_oleh` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`rt_id`) REFERENCES `rt`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`kategori_id`) REFERENCES `kategori_kas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `kategori_kas` ADD `scope` text DEFAULT 'semua' NOT NULL;
