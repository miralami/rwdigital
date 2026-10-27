CREATE TABLE `paket_iuran` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text NOT NULL,
	`keterangan` text,
	`aktif` integer DEFAULT true NOT NULL,
	`rw_id` integer NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`rw_id`) REFERENCES `rw`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `paket_iuran_item` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`paket_id` integer NOT NULL,
	`jenis_iuran_id` integer NOT NULL,
	`urutan` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`paket_id`) REFERENCES `paket_iuran`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`jenis_iuran_id`) REFERENCES `jenis_iuran`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `paket_iuran_item_unik` ON `paket_iuran_item` (`paket_id`,`jenis_iuran_id`);--> statement-breakpoint
ALTER TABLE `jenis_iuran` ADD `porsi_rw` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `jenis_iuran` ADD `scope` text DEFAULT 'rt' NOT NULL;--> statement-breakpoint
ALTER TABLE `jenis_iuran` ADD `rt_id` integer REFERENCES rt(id);--> statement-breakpoint
ALTER TABLE `jenis_iuran` ADD `urutan` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `tagihan` ADD `porsi_rw` real DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `tagihan_kk_jenis_periode_unik` ON `tagihan` (`kk_id`,`jenis_iuran_id`,`periode`);