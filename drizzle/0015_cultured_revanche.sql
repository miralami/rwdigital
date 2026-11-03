CREATE TABLE `pembayaran_online` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tagihan_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`order_id` text NOT NULL,
	`jumlah` real NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`snap_token` text,
	`snap_redirect_url` text,
	`payment_type` text,
	`pembayaran_id` integer,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`tagihan_id`) REFERENCES `tagihan`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pembayaran_id`) REFERENCES `pembayaran`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pembayaran_online_order_id_unique` ON `pembayaran_online` (`order_id`);--> statement-breakpoint
CREATE INDEX `pembayaran_online_tagihan_idx` ON `pembayaran_online` (`tagihan_id`);--> statement-breakpoint
CREATE INDEX `pembayaran_online_status_idx` ON `pembayaran_online` (`status`);--> statement-breakpoint
CREATE TABLE `peran` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text NOT NULL,
	`label` text NOT NULL,
	`deskripsi` text,
	`tipe` text DEFAULT 'staff' NOT NULL,
	`scope` text DEFAULT 'none' NOT NULL,
	`permissions` text DEFAULT '{}' NOT NULL,
	`sistem` integer DEFAULT false NOT NULL,
	`superadmin` integer DEFAULT false NOT NULL,
	`urutan` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `peran_nama_unique` ON `peran` (`nama`);