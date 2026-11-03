ALTER TABLE `pengumuman` ADD COLUMN `periode_ulang` text DEFAULT 'sekali' NOT NULL;--> statement-breakpoint
ALTER TABLE `pengumuman` ADD COLUMN `interval_hari` integer;--> statement-breakpoint
ALTER TABLE `pengumuman` ADD COLUMN `thumbnail_url` text;--> statement-breakpoint
ALTER TABLE `pengumuman` ADD COLUMN `lampiran_urls` text;--> statement-breakpoint
CREATE TABLE `notifikasi` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`judul` text NOT NULL,
	`pesan` text NOT NULL,
	`tipe` text DEFAULT 'info' NOT NULL,
	`tautan` text,
	`dibaca` integer DEFAULT 0 NOT NULL,
	`channel` text DEFAULT 'in_app' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);--> statement-breakpoint
CREATE INDEX `notifikasi_user_idx` ON `notifikasi` (`user_id`);
