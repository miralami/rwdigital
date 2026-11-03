CREATE TABLE `galeri` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`judul` text NOT NULL,
	`keterangan` text,
	`foto_url` text NOT NULL,
	`urutan` integer DEFAULT 0 NOT NULL,
	`aktif` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pengaturan_landing` (
	`id` integer PRIMARY KEY NOT NULL,
	`hero_judul` text,
	`hero_subjudul` text,
	`hero_background` text,
	`sambutan` text,
	`nama_ketua` text,
	`foto_ketua` text,
	`visi` text,
	`misi` text,
	`sejarah` text,
	`alamat` text,
	`telepon` text,
	`email` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
