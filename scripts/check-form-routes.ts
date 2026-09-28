// Self-check daftar rute form shell — tanpa framework, tanpa dependency baru.
//
//   node --experimental-strip-types scripts/check-form-routes.ts
//
// Yang dijaga di sini adalah KONSTANTA `FORM_ROUTES` di
// `src/routes/(app)/+layout.svelte`: daftar itu yang menyembunyikan "Catat kas"
// dari header, dan `svelte-check`/`build` tidak bisa melihat kalau ada rute
// form baru yang primary submit-nya jadi dobel. Dua arah dicek:
//
//   1. setiap halaman yang punya `btn btn-primary` sendiri WAJIB ada di daftar
//   2. setiap entri daftar WAJIB punya file +page.svelte yang masih ada
//
// Regex di bawah sengaja terikat ke bentuk literal array di layout. Kalau
// bentuknya berubah, skrip ini gagal — itu memang sinyal untuk diperbarui.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROUTES_DIR = 'src/routes/(app)';
const LAYOUT = 'src/routes/(app)/+layout.svelte';

// ─── Ambil konstanta apa adanya dari layout ───────────────────────────────────
// Penutup `]` array selalu di barisnya sendiri, jadi regex ini tidak bisa
// kepotong oleh `[id]` di dalam string.
const source = readFileSync(LAYOUT, 'utf8');
const blok = source.match(/const FORM_ROUTES[^=]*=\s*\[([\s\S]*?)\n\s*\]/)?.[1];
assert.ok(blok, 'FORM_ROUTES tidak ditemukan di ' + LAYOUT);
const formRoutes = [...blok.matchAll(/'([^']+)'/g)].map((m) => m[1]);
assert.ok(formRoutes.length > 0, 'FORM_ROUTES kosong di ' + LAYOUT);

// ─── Halaman yang punya primary submit sendiri ───────────────────────────────
/** Semua +page.svelte di bawah route group (app). */
function halaman(): string[] {
  const found: string[] = [];
  const walk = (dir: string, prefix: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path, `${prefix}/${entry.name}`);
      else if (entry.name === '+page.svelte') found.push(prefix);
    }
  };
  walk(ROUTES_DIR, '');
  return found.sort();
}

const semuaHalaman = halaman();
const punyaPrimarySendiri = semuaHalaman.filter((path) =>
  readFileSync(join(ROUTES_DIR, path, '+page.svelte'), 'utf8').includes('btn btn-primary')
);

// 1. Tiap primary submit halaman harus tersembunyi dari header.
const belumTercakup = punyaPrimarySendiri.filter((path) => !formRoutes.includes(path));
assert.deepEqual(
  belumTercakup,
  [],
  'rute ini punya btn btn-primary tapi tidak ada di FORM_ROUTES:\n  ' + belumTercakup.join('\n  ')
);

// 2. Entri yang menunjuk rute sudah tidak ada = sisa refactor.
const sudahHilang = formRoutes.filter((path) => !semuaHalaman.includes(path));
assert.deepEqual(
  sudahHilang,
  [],
  'entri FORM_ROUTES tidak punya +page.svelte:\n  ' + sudahHilang.join('\n  ')
);

// 3. Rute list harus tetap menaruh primary-nya di header.
for (const list of ['/dashboard', '/warga', '/kas', '/iuran', '/pengumuman']) {
  assert.equal(formRoutes.includes(list), false, list + ' adalah rute list');
  assert.equal(
    punyaPrimarySendiri.includes(list),
    false,
    list + ' ikut punya primary sendiri, cek nav-nya'
  );
}

console.log('form-routes self-check: ok (' + formRoutes.length + ' rute form)');
