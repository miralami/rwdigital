import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { eq } from 'drizzle-orm';
import { ac, roles } from '../src/lib/permissions';
import {
	rw,
	rt,
	kk,
	warga,
	kategoriKas,
	transaksiKas,
	transaksiKasRt,
	jenisIuran,
	tagihan
} from '../src/lib/server/db/schema';

// ─── Load .env ────────────────────────────────────────────────────────────────
const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
	const envContent = readFileSync(envPath, 'utf8');
	for (const line of envContent.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const eqIndex = trimmed.indexOf('=');
		if (eqIndex === -1) continue;
		const key = trimmed.slice(0, eqIndex).trim();
		const value = trimmed
			.slice(eqIndex + 1)
			.trim()
			.replace(/^["']|["']$/g, '');
		if (!(key in process.env)) {
			process.env[key] = value;
		}
	}
}

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL ?? 'file:local.db';
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN ?? '';

// ─── Auth instance ────────────────────────────────────────────────────────────
const auth = betterAuth({
	database: {
		dialect: new LibsqlDialect({
			url: TURSO_DATABASE_URL,
			authToken: TURSO_AUTH_TOKEN
		}),
		type: 'sqlite'
	},
	emailAndPassword: { enabled: true },
	plugins: [
		admin({
			ac,
			roles,
			defaultRole: 'warga',
			adminRoles: ['admin_rw']
		})
	]
});

// ─── DB client ────────────────────────────────────────────────────────────────
const client = createClient({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN
});
const db = drizzle(client, {
	schema: {
		rw,
		rt,
		kk,
		warga,
		kategoriKas,
		transaksiKas,
		transaksiKasRt,
		jenisIuran,
		tagihan
	}
});

// ─── Seed config ─────────────────────────────────────────────────────────────
const ADMIN_EMAIL = 'admin@rw.id';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Admin RW';

// ─── Main ────────────────────────────────────────────────────────────────────
async function seed() {
	console.log('=== Seed Sistem Informasi RW ===\n');

	// 1. Create admin user
	console.log('1. Membuat user admin...');

	let userId: string;

	try {
		const userResult = await client.execute({
			sql: 'SELECT id FROM user WHERE email = ?',
			args: [ADMIN_EMAIL]
		});
		const existingUser = userResult.rows[0] as { id: string } | undefined;

		if (existingUser) {
			console.log(`   User dengan email ${ADMIN_EMAIL} sudah ada, skip.`);
			userId = existingUser.id;
		} else {
			const result = await auth.api.signUpEmail({
				body: {
					email: ADMIN_EMAIL,
					password: ADMIN_PASSWORD,
					name: ADMIN_NAME
				}
			});
			userId = result.user.id;
			console.log(`   User admin dibuat: ${ADMIN_EMAIL} (id: ${userId})`);
		}
	} catch (e) {
		console.error(`   Gagal membuat user admin: ${e}`);
		throw e;
	}

	// 2. Set admin role
	console.log('2. Mengatur role admin_rw...');
	try {
		await auth.api.setRole({
			body: {
				userId,
				role: 'admin_rw'
			},
			headers: new Headers()
		});
		console.log('   Role admin_rw berhasil diatur.');
	} catch (e) {
		try {
			await client.execute({
				sql: 'UPDATE user SET role = ? WHERE id = ?',
				args: ['admin_rw', userId]
			});
			console.log('   Role admin_rw berhasil diatur via database.');
		} catch (dbErr) {
			console.error(`   Gagal mengatur role via database: ${dbErr}`);
		}
	}

	// 3. Create default RW record
	console.log('3. Membuat data RW default...');
	let rwId: number;

	try {
		const existingRw = await db.select().from(rw).limit(1);

		if (existingRw.length > 0) {
			console.log(`   RW sudah ada: ${existingRw[0].nama}, skip.`);
			rwId = existingRw[0].id;
		} else {
			const [insertedRw] = await db
				.insert(rw)
				.values({
					nama: 'RW 05 Sukamaju',
					alamat: 'Jl. Merpati Putih No. 12',
					kelurahan: 'Kelurahan Sukamaju',
					kecamatan: 'Kecamatan Cilodong',
					kota: 'Kota Depok'
				})
				.returning();
			rwId = insertedRw.id;
			console.log(`   RW default dibuat: RW 05 (id: ${rwId})`);
		}
	} catch (e) {
		console.error(`   Gagal membuat RW: ${e}`);
		throw e;
	}

	// 4. Create RT records (RT 01 s/d RT 04)
	console.log('4. Membuat data RT (RT 01 - RT 04)...');
	const rtMap = new Map<number, number>(); // nomor RT -> id RT
	const existingRts = await db.select().from(rt).where(eq(rt.rwId, rwId));

	if (existingRts.length === 0) {
		for (const nomor of [1, 2, 3, 4]) {
			const [insertedRt] = await db.insert(rt).values({ nomor, rwId }).returning();
			rtMap.set(nomor, insertedRt.id);
		}
		console.log('   4 RT berhasil dibuat.');
	} else {
		for (const r of existingRts) {
			rtMap.set(r.nomor, r.id);
		}
		console.log(`   ${existingRts.length} RT sudah ada.`);
	}

	// 5. Create default kategori kas (pos pengeluaran & pos penerimaan)
	console.log('5. Membuat kategori kas & pos anggaran...');
	const existingKategori = await db.select().from(kategoriKas).where(eq(kategoriKas.rwId, rwId));

	if (existingKategori.length === 0) {
		await db.insert(kategoriKas).values([
			{ nama: 'Iuran Wajib RT', jenis: 'pemasukan', scope: 'rt', rwId },
			{ nama: 'Kas Sosial Kematian', jenis: 'pemasukan', scope: 'rt', rwId },
			{ nama: 'Donasi & Sumbangan', jenis: 'pemasukan', scope: 'semua', rwId },
			{ nama: 'Iuran Kebersihan & Sampah', jenis: 'pemasukan', scope: 'rt', rwId },
			{ nama: 'Operasional RW', jenis: 'pengeluaran', scope: 'rw', rwId },
			{ nama: 'Santunan Kematian RT', jenis: 'pengeluaran', scope: 'rt', rwId },
			{ nama: 'Operasional RT', jenis: 'pengeluaran', scope: 'rt', rwId },
			{ nama: 'Pemeliharaan Sarana / Tenda', jenis: 'pengeluaran', scope: 'semua', rwId },
			{ nama: 'Kegiatan Warga / PHBI', jenis: 'pengeluaran', scope: 'semua', rwId }
		]);
		console.log('   Kategori kas lengkap berhasil dibuat.');
	} else {
		console.log(`   ${existingKategori.length} kategori kas sudah ada.`);
	}

	// 6. Create sample KK & Warga
	console.log('6. Mengecek data KK & Warga...');
	const existingKk = await db.select().from(kk).limit(1);

	if (existingKk.length === 0 && rtMap.size > 0) {
		const sampleKkData = [
			{ noKk: '3276010101000001', alamat: 'Jl. Merpati No. 1', rtNomor: 1, nama: 'Bambang Supriyanto', nik: '3276010101800001' },
			{ noKk: '3276010101000002', alamat: 'Jl. Merpati No. 3', rtNomor: 1, nama: 'Agus Setiawan', nik: '3276010101850002' },
			{ noKk: '3276010101000003', alamat: 'Jl. Merpati No. 5', rtNomor: 1, nama: 'Hendra Gunawan', nik: '3276010101880003' },
			{ noKk: '3276010101000004', alamat: 'Jl. Kutilang No. 2', rtNomor: 2, nama: 'Siti Rahmawati', nik: '3276010101900004' },
			{ noKk: '3276010101000005', alamat: 'Jl. Kutilang No. 4', rtNomor: 2, nama: 'Eko Prasetyo', nik: '3276010101820005' },
			{ noKk: '3276010101000006', alamat: 'Jl. Kenari No. 7', rtNomor: 3, nama: 'Dedi Kurniawan', nik: '3276010101790006' },
			{ noKk: '3276010101000007', alamat: 'Jl. Kenari No. 9', rtNomor: 3, nama: 'Wahyudi Santoso', nik: '3276010101860007' },
			{ noKk: '3276010101000008', alamat: 'Jl. Cendrawasih No. 12', rtNomor: 4, nama: 'Ahmad Fauzi', nik: '3276010101910008' }
		];

		const kkIds: number[] = [];
		for (const item of sampleKkData) {
			const rtIdVal = rtMap.get(item.rtNomor)!;
			const [insertedKk] = await db
				.insert(kk)
				.values({
					noKk: item.noKk,
					alamat: item.alamat,
					rtId: rtIdVal,
					statusHuni: 'tetap'
				})
				.returning();

			kkIds.push(insertedKk.id);

			await db.insert(warga).values({
				nik: item.nik,
				nama: item.nama,
				tempatLahir: 'Depok',
				tanggalLahir: '1985-05-15',
				jenisKelamin: 'L',
				agama: 'Islam',
				pendidikan: 'S1',
				pekerjaan: 'Karyawan Swasta',
				statusPerkawinan: 'kawin',
				statusHubunganKk: 'kepala_keluarga',
				kkId: insertedKk.id,
				aktif: true
			});
		}
		console.log(`   ${sampleKkData.length} KK & Warga sampel berhasil dibuat.`);

		// 7. Create sample Jenis Iuran & Tagihan untuk rekapitulasi iuran RT
		console.log('7. Membuat jenis iuran & tagihan sampel...');
		const [iuranWajib] = await db
			.insert(jenisIuran)
			.values({
				nama: 'Iuran Wajib Warga RT',
				nominal: 50000,
				periode: 'bulanan',
				aktif: true,
				rwId
			})
			.returning();

		// Buat tagihan periode 2026-10
		for (let i = 0; i < kkIds.length; i++) {
			const status = i % 2 === 0 ? 'lunas' : 'belum_bayar';
			await db.insert(tagihan).values({
				kkId: kkIds[i],
				jenisIuranId: iuranWajib.id,
				periode: '2026-10',
				nominal: 50000,
				status
			});
		}
		console.log('   Tagihan sampel iuran RT dibuat.');
	} else {
		console.log('   Data KK sudah ada.');
	}

	// 8. Sample Transaksi Kas RW
	console.log('8. Mengecek transaksi Kas RW...');
	const existingKasRw = await db.select().from(transaksiKas).limit(1);
	if (existingKasRw.length === 0) {
		await db.insert(transaksiKas).values([
			{
				jenis: 'pemasukan',
				nominal: 3500000,
				keterangan: 'Bantuan Dana Operasional RW dari Kelurahan',
				tanggal: '2026-10-01',
				dicatatOleh: 'Bendahara RW',
				rwId
			},
			{
				jenis: 'pengeluaran',
				nominal: 750000,
				keterangan: 'Pengadaan ATK & Surat-Menyurat Sekretariat RW',
				tanggal: '2026-10-05',
				dicatatOleh: 'Bendahara RW',
				rwId
			},
			{
				jenis: 'pengeluaran',
				nominal: 500000,
				keterangan: 'Konsumsi Rapat Pleno Koordinasi Pengurus RT/RW',
				tanggal: '2026-10-12',
				dicatatOleh: 'Bendahara RW',
				rwId
			}
		]);
		console.log('   Transaksi Kas RW sampel berhasil dibuat.');
	} else {
		console.log('   Transaksi Kas RW sudah ada.');
	}

	// 9. Sample Transaksi Kas RT (KU-01: Kas Mandiri per RT)
	console.log('9. Mengecek transaksi Kas RT mandiri...');
	const existingKasRt = await db.select().from(transaksiKasRt).limit(1);
	if (existingKasRt.length === 0 && rtMap.size > 0) {
		const rt1 = rtMap.get(1)!;
		const rt2 = rtMap.get(2)!;
		const rt3 = rtMap.get(3)!;

		await db.insert(transaksiKasRt).values([
			{
				rtId: rt1,
				namaKas: 'Kas Sosial Kematian',
				jenis: 'pemasukan',
				nominal: 1200000,
				keterangan: 'Iuran Kas Sosial Kematian RT 01 (Bulan Oktober 2026)',
				tanggal: '2026-10-02',
				dicatatOleh: 'Bendahara RT 01'
			},
			{
				rtId: rt1,
				namaKas: 'Kas Sosial Kematian',
				jenis: 'pengeluaran',
				nominal: 500000,
				keterangan: 'Santunan duka cita & bunga pemakaman Alm. Bpk. Supardi RT 01',
				tanggal: '2026-10-10',
				dicatatOleh: 'Bendahara RT 01'
			},
			{
				rtId: rt1,
				namaKas: 'Kas Operasional RT',
				jenis: 'pemasukan',
				nominal: 800000,
				keterangan: 'Penerimaan dana kas operasional lingkungan RT 01',
				tanggal: '2026-10-04',
				dicatatOleh: 'Bendahara RT 01'
			},
			{
				rtId: rt2,
				namaKas: 'Kas Rukun Kematian',
				jenis: 'pemasukan',
				nominal: 950000,
				keterangan: 'Iuran Rukun Kematian RT 02 Periode Oktober',
				tanggal: '2026-10-03',
				dicatatOleh: 'Pengurus RT 02'
			},
			{
				rtId: rt2,
				namaKas: 'Kas Operasional RT',
				jenis: 'pengeluaran',
				nominal: 250000,
				keterangan: 'Perbaikan lampu penerangan gang RT 02',
				tanggal: '2026-10-08',
				dicatatOleh: 'Pengurus RT 02'
			},
			{
				rtId: rt3,
				namaKas: 'Kas Sosial Kematian',
				jenis: 'pemasukan',
				nominal: 1100000,
				keterangan: 'Saldo awal kas sosial kematian RT 03',
				tanggal: '2026-10-01',
				dicatatOleh: 'Bendahara RT 03'
			}
		]);
		console.log('   Transaksi Kas RT sampel berhasil dibuat.');
	} else {
		console.log('   Transaksi Kas RT sudah ada.');
	}

	console.log('\n=== Seed selesai ===');
	console.log('\nCredentials:');
	console.log(`  Email:    ${ADMIN_EMAIL}`);
	console.log(`  Password: ${ADMIN_PASSWORD}`);
	console.log(`  Role:     admin_rw`);
}

seed().catch((error) => {
	console.error('\nError saat seed:', error);
	process.exit(1);
});
