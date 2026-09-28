import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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
