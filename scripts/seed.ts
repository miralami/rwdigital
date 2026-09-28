import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { ac, roles } from '../src/lib/permissions';
import { rw, kategoriKas } from '../src/lib/server/db/schema';

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

// ─── Auth instance (same config as src/lib/server/auth.ts) ────────────────────
// Note: sveltekitCookies plugin omitted — requires SvelteKit request context.
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

// ─── DB client (same config as src/lib/server/db/index.ts) ────────────────────
const client = createClient({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN
});
const db = drizzle(client, { schema: { rw, kategoriKas } });

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
		console.error(`   Gagal mengatur role via API: ${e}`);
		console.log('   Mencoba update langsung ke database...');
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
					nama: 'RW 01',
					alamat: 'Jl. Contoh No. 1',
					kelurahan: 'Kelurahan Contoh',
					kecamatan: 'Kecamatan Contoh',
					kota: 'Kota Contoh'
				})
				.returning();
			rwId = insertedRw.id;
			console.log(`   RW default dibuat: RW 01 (id: ${rwId})`);
		}
	} catch (e) {
		console.error(`   Gagal membuat RW: ${e}`);
		console.error('   Pastikan tabel domain sudah dibuat dengan: npx drizzle-kit push');
		throw e;
	}

	// 4. Create default kategori kas
	console.log('4. Membuat kategori kas default...');

	try {
		const existingKategori = await db.select().from(kategoriKas).limit(1);

		if (existingKategori.length > 0) {
			console.log('   Kategori kas sudah ada, skip.');
		} else {
			await db.insert(kategoriKas).values([
				{ nama: 'Iuran', jenis: 'pemasukan', rwId },
				{ nama: 'Donasi', jenis: 'pemasukan', rwId },
				{ nama: 'Lainnya', jenis: 'pemasukan', rwId },
				{ nama: 'Operasional', jenis: 'pengeluaran', rwId },
				{ nama: 'Kegiatan', jenis: 'pengeluaran', rwId },
				{ nama: 'Lainnya', jenis: 'pengeluaran', rwId }
			]);
			console.log('   Kategori kas default dibuat (6 kategori).');
		}
	} catch (e) {
		console.error(`   Gagal membuat kategori kas: ${e}`);
		throw e;
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
