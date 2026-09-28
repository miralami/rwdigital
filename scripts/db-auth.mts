import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

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

// Applies scripts/auth-schema.sql to the local SQLite database.
// Resolves the DB path from TURSO_DATABASE_URL (file: URLs only).
const url = process.env.TURSO_DATABASE_URL ?? 'file:local.db';

if (!url.startsWith('file:')) {
  console.error(`db:auth hanya untuk database lokal (file:). Dapat: ${url}`);
  process.exit(1);
}

const path = resolve(process.cwd(), url.slice('file:'.length));
const db = new DatabaseSync(path);

db.exec(readFileSync(resolve(process.cwd(), 'scripts/auth-schema.sql'), 'utf8'));

const tables = db
  .prepare("select name from sqlite_master where type='table' order by name")
  .all()
  .map((r) => r.name);

console.log(`auth schema diterapkan ke ${path}`);
console.log(tables.join('\n'));
