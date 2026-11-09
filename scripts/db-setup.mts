import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createConnection } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';

// ─── Load .env ────────────────────────────────────────────────────────────────
const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
	for (const line of readFileSync(envPath, 'utf8').split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const eqIndex = trimmed.indexOf('=');
		if (eqIndex === -1) continue;
		const key = trimmed.slice(0, eqIndex).trim();
		const value = trimmed
			.slice(eqIndex + 1)
			.trim()
			.replace(/^["']|["']$/g, '');
		if (!(key in process.env)) process.env[key] = value;
	}
}

// Bootstrap database MySQL/MariaDB dalam satu pass, idempotent:
//   1. buat database bila belum ada,
//   2. tabel Better Auth (scripts/auth-schema.sql) — bukan bagian schema Drizzle,
//   3. migrasi domain (drizzle/*.sql) lewat migrator Drizzle (tercatat di
//      tabel __drizzle_migrations, jadi tidak dijalankan dua kali).
//
// Pakai `--auth-saja` untuk hanya menerapkan langkah 2 (npm run db:auth).
const authSaja = process.argv.includes('--auth-saja');
const url = new URL(process.env.DATABASE_URL ?? 'mysql://root@127.0.0.1:3306/rwdigital');
const namaDb = decodeURIComponent(url.pathname.replace(/^\//, ''));

if (!/^[A-Za-z0-9_]+$/.test(namaDb)) {
	console.error(`Nama database tidak valid di DATABASE_URL: "${namaDb}"`);
	process.exit(1);
}

// 1. Buat database (koneksi tanpa memilih database).
const root = new URL(url);
root.pathname = '/';
const awal = await createConnection({ uri: root.toString() });
await awal.query(
	`CREATE DATABASE IF NOT EXISTS \`${namaDb}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
);
await awal.end();

const conn = await createConnection({ uri: url.toString(), multipleStatements: true });

// 2. Tabel Better Auth.
console.log('Terapkan: scripts/auth-schema.sql');
await conn.query(readFileSync(resolve(process.cwd(), 'scripts/auth-schema.sql'), 'utf8'));

const INDEKS_AUTH: Array<[string, string, string]> = [
	['session', 'session_userId_idx', 'userId'],
	['account', 'account_userId_idx', 'userId'],
	['verification', 'verification_identifier_idx', 'identifier']
];
for (const [tabel, nama, kolom] of INDEKS_AUTH) {
	const [rows] = await conn.query(
		'select 1 from information_schema.statistics where table_schema = ? and table_name = ? and index_name = ? limit 1',
		[namaDb, tabel, nama]
	);
	if ((rows as unknown[]).length === 0) {
		await conn.query(`create index \`${nama}\` on \`${tabel}\` (\`${kolom}\`)`);
	}
}

// 3. Migrasi domain.
if (!authSaja) {
	console.log('Terapkan: drizzle/*.sql');
	await migrate(drizzle(conn), { migrationsFolder: resolve(process.cwd(), 'drizzle') });
}

const [tabel] = await conn.query('show tables');
await conn.end();

console.log(`\n=== Setup selesai ===`);
console.log(`Database: ${namaDb} @ ${url.host}`);
console.log((tabel as Array<Record<string, string>>).map((r) => Object.values(r)[0]).sort().join('\n'));

console.log('\n=== Catatan ===');
console.log('Jangan jalankan "npx drizzle-kit push": tabel Better Auth (user, session,');
console.log('account, verification) bukan bagian schema Drizzle sehingga akan dianggap');
console.log('tabel asing. Alur perubahan schema:');
console.log('  npx drizzle-kit generate   →   npm run db:setup');
