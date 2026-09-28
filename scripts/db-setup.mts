import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

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

// ─── Config ───────────────────────────────────────────────────────────────────
// Bootstrap database lokal dalam satu pass: tabel Better Auth (auth-schema.sql)
// + seluruh migrasi domain (drizzle/*.sql).
//
// Sengaja TIDAK memakai @libsql/client, drizzle-orm, atau drizzle-kit: tabel
// auth tidak ada di src/lib/server/db/schema.ts, jadi drizzle-kit push akan
// menganggapnya tabel asing dan meminta jawaban interaktif.
const url = process.env.TURSO_DATABASE_URL ?? 'file:local.db';

if (!url.startsWith('file:')) {
  console.error(`db:setup hanya untuk database lokal (file:). Dapat: ${url}`);
  console.error('Skrip ini tidak mendukung database Turso remote/production.');
  console.error('Untuk Turso remote gunakan: npx drizzle-kit migrate');
  process.exit(1);
}

const path = resolve(process.cwd(), url.slice('file:'.length));
const db = new DatabaseSync(path);

// ─── Helper ───────────────────────────────────────────────────────────────────
const BREAKPOINT = '--> statement-breakpoint';

// SQL hasil drizzle-kit generate memakai CREATE TABLE / CREATE UNIQUE INDEX
// polos (tanpa IF NOT EXISTS), jadi tidak bisa dijalankan dua kali.
const CREATE_RE =
	/^CREATE\s+(UNIQUE\s+)?(TABLE|INDEX)\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?([A-Za-z0-9_]+)[`"]?/i;

function sudahAda(type, name) {
	return (
		db.prepare('select name from sqlite_master where type = ? and name = ?').get(type, name) !==
		undefined
	);
}

function jalankan(sql, dari) {
	const match = CREATE_RE.exec(sql);
	if (match) {
		const type = match[2].toLowerCase();
		const name = match[3];
		if (sudahAda(type, name)) {
			console.log(`   lewati (sudah ada): ${type} ${name}`);
			return;
		}
	}
	try {
		db.exec(sql);
	} catch (e) {
		console.error(`Gagal menjalankan statement dari ${dari}:`);
		console.error(sql);
		console.error(e instanceof Error ? e.message : String(e));
		process.exit(1);
	}
}

// ─── 1. Tabel Better Auth ─────────────────────────────────────────────────────
const authSchemaPath = resolve(process.cwd(), 'scripts/auth-schema.sql');
console.log('Terapkan: scripts/auth-schema.sql');
db.exec(readFileSync(authSchemaPath, 'utf8'));

// ─── 2. Migrasi domain ────────────────────────────────────────────────────────
const drizzleDir = resolve(process.cwd(), 'drizzle');
const migrations = readdirSync(drizzleDir)
	.filter((f) => f.endsWith('.sql'))
	.sort();

for (const file of migrations) {
	const full = join(drizzleDir, file);
	const label = relative(process.cwd(), full).split('\\').join('/');
	console.log(`Terapkan: ${label}`);
	for (const chunk of readFileSync(full, 'utf8').split(BREAKPOINT)) {
		const sql = chunk.trim();
		if (sql) jalankan(sql, label);
	}
}

// ─── Hasil ────────────────────────────────────────────────────────────────────
const tables = db
	.prepare("select name from sqlite_master where type='table' order by name")
	.all()
	.map((r) => r.name);

db.close();

console.log(`\n=== Setup selesai ===`);
console.log(`Database lokal: ${path}`);
console.log(tables.join('\n'));

console.log('\n=== Peringatan ===');
console.log('Jangan jalankan "npx drizzle-kit push" terhadap file lokal ini.');
console.log('Tabel Better Auth (user, session, account, verification) bukan bagian');
console.log('dari schema Drizzle, sehingga drizzle-kit akan meminta jawaban interaktif');
console.log('(dan bisa crash di terminal Windows) lalu menghapus tabel auth.');
console.log('');
console.log('Alur yang benar untuk perubahan schema:');
console.log('  npx drizzle-kit generate   →   node scripts/db-setup.mts');
console.log('Database Turso remote/production: npx drizzle-kit migrate');
