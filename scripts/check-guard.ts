// Self-check logika guard — tanpa framework, tanpa dependency baru.
//   node --experimental-strip-types scripts/check-guard.ts
import assert from 'node:assert/strict';
import {
  matchRouteGroup,
  normalizeRole,
  landingPathFor,
  ADMIN_ROUTES,
  WARGA_ROUTES
} from '../src/lib/server/guard.ts';

// Klasifikasi rute.
assert.equal(matchRouteGroup('/kas')?.id, 'staff');
assert.equal(matchRouteGroup('/kas/tambah')?.id, 'staff');
assert.equal(matchRouteGroup('/portal')?.id, 'warga');
assert.equal(matchRouteGroup('/login'), null);
assert.equal(matchRouteGroup('/api/auth/sign-in/email'), null);
assert.deepEqual([...WARGA_ROUTES], ['/portal']);

// Batas segment: /pengaturan TIDAK boleh ikut tertangkap /pengumuman,
// dan /iurandesk tidak boleh ikut tertangkap /iuran.
assert.equal(matchRouteGroup('/pengaturan'), null);
assert.equal(matchRouteGroup('/iurandesk'), null);
assert.equal(matchRouteGroup('/pengumuman/tambah')?.id, 'staff');
for (const prefix of ADMIN_ROUTES) {
  assert.equal(matchRouteGroup(`${prefix}/x/y`)?.id, 'staff', prefix);
}

// Role: string tunggal, koma (format Better Auth), array, dan nilai sampah.
assert.deepEqual(normalizeRole('bendahara'), ['bendahara']);
assert.deepEqual(normalizeRole(' admin_rw , warga '), ['admin_rw', 'warga']);
assert.deepEqual(normalizeRole(['pengurus_rt']), ['pengurus_rt']);
assert.deepEqual(normalizeRole(undefined), []);
assert.deepEqual(normalizeRole(null), []);
assert.deepEqual(normalizeRole('hacker'), []);

// Landing: warga -> portal, staff -> dashboard.
const session = (role: unknown) => ({ user: { role } }) as App.Locals;
assert.equal(landingPathFor(session('warga')), '/portal');
assert.equal(landingPathFor(session('admin_rw')), '/dashboard');
assert.equal(landingPathFor(session(undefined)), '/dashboard');

console.log('guard self-check: ok');
