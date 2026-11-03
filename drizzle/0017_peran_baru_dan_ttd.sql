CREATE TABLE `ttd_pejabat` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`url` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX `ttd_pejabat_user_id_unique` ON `ttd_pejabat` (`user_id`);--> statement-breakpoint
ALTER TABLE `pengumuman` ADD COLUMN `rt_id` integer REFERENCES rt(id);--> statement-breakpoint
CREATE INDEX `pengumuman_rt_id_idx` ON `pengumuman` (`rt_id`);--> statement-breakpoint
ALTER TABLE `surat` ADD COLUMN `butuh_ttd_rt` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `surat` ADD COLUMN `butuh_ttd_rw` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `surat` ADD COLUMN `ttd_rt_url` text;--> statement-breakpoint
ALTER TABLE `surat` ADD COLUMN `ttd_rt_oleh` text;--> statement-breakpoint
ALTER TABLE `surat` ADD COLUMN `ttd_rt_pada` text;--> statement-breakpoint
ALTER TABLE `surat` ADD COLUMN `ttd_rt_nama` text;--> statement-breakpoint
ALTER TABLE `surat` ADD COLUMN `ttd_rt_jabatan` text;--> statement-breakpoint
ALTER TABLE `surat` ADD COLUMN `ttd_rw_url` text;--> statement-breakpoint
ALTER TABLE `surat` ADD COLUMN `ttd_rw_oleh` text;--> statement-breakpoint
ALTER TABLE `surat` ADD COLUMN `ttd_rw_pada` text;--> statement-breakpoint
ALTER TABLE `surat` ADD COLUMN `ttd_rw_nama` text;--> statement-breakpoint
ALTER TABLE `surat` ADD COLUMN `ttd_rw_jabatan` text;--> statement-breakpoint
ALTER TABLE `surat` ADD COLUMN `ditolak_oleh` text;
