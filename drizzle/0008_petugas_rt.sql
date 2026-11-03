CREATE TABLE `petugas_rt` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`rt_id` integer NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`rt_id`) REFERENCES `rt`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `petugas_rt_user_id_unique` ON `petugas_rt` (`user_id`);--> statement-breakpoint
CREATE INDEX `petugas_rt_rt_id_idx` ON `petugas_rt` (`rt_id`);