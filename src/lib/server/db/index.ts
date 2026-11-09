import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';
import * as schema from './schema';

// Pool dipakai bersama oleh Drizzle dan Better Auth (lihat auth.ts).
// - decimalNumbers: SUM()/AVG() mengembalikan DECIMAL; tanpa opsi ini mysql2
//   memberi string sehingga angka di dashboard/kas jadi "1500" bukan 1500.
// - timezone 'Z': semua datetime disimpan sebagai UTC.
export const pool = createPool({
  uri: DATABASE_URL,
  decimalNumbers: true,
  timezone: 'Z',
  connectionLimit: 10
});

export const db = drizzle(pool, { schema, mode: 'default' });
