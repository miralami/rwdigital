ALTER TABLE `surat` ADD `diverifikasi_pada` text;--> statement-breakpoint
ALTER TABLE `surat` ADD `disetujui_pada` text;--> statement-breakpoint
ALTER TABLE `surat` ADD `ditolak_pada` text;--> statement-breakpoint
CREATE UNIQUE INDEX `surat_nomor_surat_unique` ON `surat` (`nomor_surat`);