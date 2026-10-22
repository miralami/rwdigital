ALTER TABLE `transaksi_kas_rt` ADD `metode_pembayaran` text DEFAULT 'tunai' NOT NULL;
--> statement-breakpoint
ALTER TABLE `transaksi_kas_rt` ADD `midtrans_order_id` text;
--> statement-breakpoint
ALTER TABLE `transaksi_kas_rt` ADD `midtrans_payment_type` text;
--> statement-breakpoint
ALTER TABLE `transaksi_kas_rt` ADD `midtrans_status` text;
--> statement-breakpoint
ALTER TABLE `transaksi_kas_rt` ADD `snap_token` text;
