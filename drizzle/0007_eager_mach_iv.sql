CREATE TABLE `pengurus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rt_id` integer,
	`jabatan` text NOT NULL,
	`nama` text NOT NULL,
	`foto_url` text,
	`urutan` integer DEFAULT 0 NOT NULL,
	`aktif` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`rt_id`) REFERENCES `rt`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `pengurus_rt_id_idx` ON `pengurus` (`rt_id`);