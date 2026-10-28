CREATE TABLE `setoran_rt` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rt_id` integer NOT NULL,
	`periode` text NOT NULL,
	`total_terkumpul` real DEFAULT 0 NOT NULL,
	`porsi_rw` real DEFAULT 0 NOT NULL,
	`catatan` text,
	`bukti` text,
	`disetor_pada` text NOT NULL,
	`dicatat_oleh` text NOT NULL,
	`transaksi_rw_id` integer,
	`transaksi_rt_id` integer,
	`dibatalkan` integer DEFAULT false NOT NULL,
	`alasan_batal` text,
	`dibatalkan_oleh` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`rt_id`) REFERENCES `rt`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`transaksi_rw_id`) REFERENCES `transaksi_kas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`transaksi_rt_id`) REFERENCES `transaksi_kas_rt`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `setoran_rt_rt_periode_unik` ON `setoran_rt` (`rt_id`,`periode`) WHERE "setoran_rt"."dibatalkan" = 0;