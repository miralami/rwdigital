import { error, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { bolehBukaModul, peranDefault, type TipePeran } from '$lib/akses';

/**
 * Guard akses berbasis peran dinamis.
 *
 * Single source of truth untuk klasifikasi rute + modul yang boleh diakses.
 * Dipakai oleh `hooks.server.ts`, `(app)/+layout.server.ts`, dan halaman login
 * supaya ketiganya tidak bisa berbeda pendapat soal siapa boleh buka apa.
 *
 * Peran TIDAK lagi didaftar statis di sini. Slug peran berasal dari tabel
 * `peran` (lihat `$lib/server/hooks`), sehingga superadmin bisa membuat peran
 * baru tanpa mengubah kode. Yang tetap statis hanyalah daftar modul di
 * `$lib/akses.ts`, karena kode memang hanya mengenal modul tersebut.
 */

// ─── Konstanta rute ──────────────────────────────────────────────────────────
export const LOGIN = '/login';
export const DASHBOARD = '/dashboard';
/** Portal warga — dipakai juga oleh lane desain, jangan diubah sepihak. */
export const WARGA_PORTAL = '/portal';
/** Area administratif; hanya pemegang `user:list` yang boleh membukanya. */
export const PENGATURAN_PREFIX = '/pengaturan';

// ─── Klasifikasi rute ────────────────────────────────────────────────────────
export type RouteGroupId = 'staff' | 'warga';

export type RouteGroup = {
  id: RouteGroupId;
  /** Prefix rute, termasuk seluruh subpath-nya. */
  prefixes: readonly string[];
};

/** Surface manajemen: dashboard, data warga, kas, iuran, pengumuman, surat, pengaturan. */
export const ADMIN_ROUTES = [
  '/dashboard',
  '/kk',
  '/kas',
  '/iuran',
  '/pengumuman',
  '/surat',
  '/pengaturan'
] as const;

/** Portal warga. Staff boleh masuk juga supaya bisa preview. */
export const WARGA_ROUTES = [WARGA_PORTAL] as const;

export const ROUTE_GROUPS: readonly RouteGroup[] = [
  { id: 'staff', prefixes: ADMIN_ROUTES },
  { id: 'warga', prefixes: WARGA_ROUTES }
];

/**
 * Fallback auth-only: rute yang masuk daftar ini tapi belum diklasifikasikan di
 * `ROUTE_GROUPS` tetap wajib login (perilaku lama), tanpa cek peran.
 * `/login` dan `/api/auth/**` sengaja tidak ada di sini — keduanya publik.
 */
export const PROTECTED: readonly string[] = ROUTE_GROUPS.flatMap((g) => [...g.prefixes]);

/**
 * Modul yang harus dimiliki sebuah rute.
 *
 * Prefix dicocokkan per segmen dan yang paling panjang menang, jadi
 * `/pengaturan/pengguna` tidak tertangkap aturan `/pengaturan`. `modul` berupa
 * array berarti "cukup salah satu modul ini boleh dibaca".
 */
const MODUL_RUTE: readonly {
  prefix: string;
  modul: string | readonly string[];
}[] = [
  { prefix: '/pengaturan/rt', modul: 'rt' },
  { prefix: '/pengaturan/pengurus', modul: 'pengurus' },
  { prefix: '/pengaturan/landing', modul: 'landing' },
  { prefix: '/pengaturan/pengguna', modul: 'user' },
  { prefix: '/pengaturan/peran', modul: 'peran' },
  {
    prefix: '/pengaturan',
    modul: ['rt', 'pengurus', 'landing', 'user', 'peran']
  },
  { prefix: '/kk', modul: 'warga' },
  { prefix: '/kas', modul: 'kas' },
  { prefix: '/iuran', modul: 'iuran' },
  { prefix: '/pengumuman', modul: 'pengumuman' },
  { prefix: '/surat', modul: 'surat' }
];

/** Modul yang dibutuhkan sebuah pathname, atau null kalau halaman bebas modul. */
export function modulForPath(pathname: string): readonly string[] | null {
  const cocok = MODUL_RUTE.find(
    (aturan) => pathname === aturan.prefix || pathname.startsWith(`${aturan.prefix}/`)
  );
  if (!cocok) return null;
  return typeof cocok.modul === 'string' ? [cocok.modul] : cocok.modul;
}

// ─── Pencocokan rute ─────────────────────────────────────────────────────────
/**
 * Cocokkan path terhadap prefix secara batas-segment, bukan `startsWith` polos.
 * Tanpa ini `/pengaturan` ikut ketangkap prefix `/pengumuman`.
 */
function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function matchRouteGroup(pathname: string): RouteGroup | null {
  return ROUTE_GROUPS.find((group) => matchesPrefix(pathname, group.prefixes)) ?? null;
}

// ─── Normalisasi peran ───────────────────────────────────────────────────────
/**
 * Bentuk slug yang diterima. Peran dibuat dinamis lewat UI, jadi validasi di
 * sini hanya soal bentuk — bukan daftar nama. Peran yang belum/tidak ada di
 * tabel `peran` otomatis tidak punya izin (fail-closed) di lapisan rbac.
 */
const SLUG_PERAN = /^[a-z0-9][a-z0-9_-]*$/;

/**
 * Ambil daftar peran milik user dari `locals.user.role`.
 *
 * Plugin `admin` Better Auth menyimpan peran sebagai satu kolom `text`.
 * Peran ganda disimpan sebagai satu string BERKOMA — itu yang dipecah oleh
 * `hasPermission` internal plugin (`role.split(",")`). Tipe TS-nya tetap
 * `string`, tapi data lama/seed bisa mengirim array, jadi keduanya ditangani.
 */
export function normalizeRole(value: unknown): string[] {
  const parts = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  const found = new Set<string>();

  for (const part of parts) {
    const slug = typeof part === 'string' ? part.trim().toLowerCase() : '';
    if (slug && SLUG_PERAN.test(slug)) found.add(slug);
  }

  return [...found];
}

/**
 * Peran efektif user. `hooks.server.ts` sudah memuat daftar ini dari database
 * ke `locals.peranAktif`; fallback ke `user.role` dipakai di unit test dan di
 * kode yang membangun locals tiruan.
 */
export function rolesOf(locals: App.Locals): string[] {
  const aktif = locals.peranAktif;
  if (Array.isArray(aktif)) return aktif;
  return normalizeRole((locals.user as { role?: unknown } | null)?.role);
}

/** Tipe permukaan aplikasi: staf masuk dashboard, warga masuk portal. */
export function tipeOf(locals: App.Locals): TipePeran {
  const tipe = locals.tipePeran;
  if (tipe === 'staff' || tipe === 'warga') return tipe;

  // Fallback untuk locals tiruan/unit test: peran default yang bersifat staf
  // menentukan permukaan. Peran dinamis tanpa baris DB dianggap warga.
  return rolesOf(locals).some((nama) => peranDefault(nama)?.tipe === 'staff')
    ? 'staff'
    : 'warga';
}

/** Apakah akun memakai surface staf (bukan portal warga). */
export function isStaff(locals: App.Locals): boolean {
  return tipeOf(locals) === 'staff';
}

// ─── Landing page ────────────────────────────────────────────────────────────
/** Halaman awal menurut tipe peran: warga → portal, staf → dashboard. */
export function landingPathFor(locals: App.Locals): string {
  return isStaff(locals) ? DASHBOARD : WARGA_PORTAL;
}

// ─── Assertion ───────────────────────────────────────────────────────────────
type GuardContext = Pick<RequestEvent, 'locals' | 'url'>;

/** Wajib ada session. Selain itu lempar ke halaman login. */
export function requireUser(ctx: GuardContext) {
  if (!ctx.locals.user) throw redirect(302, LOGIN);
  return ctx.locals.user;
}

/** Wajib ada session DAN surface-nya staf. Tanpa session → login, warga → portal. */
export function requireStaff(ctx: GuardContext) {
  const user = requireUser(ctx);
  if (!isStaff(ctx.locals)) throw redirect(302, WARGA_PORTAL);
  return user;
}

/**
 * Gerbang utama. Dipanggil dari `hooks.server.ts` (seluruh request) dan dari
 * `(app)/+layout.server.ts` (defence in depth per route group).
 *
 * Dipanggil setelah session + izin hydration di `hooks.server.ts`, jadi
 * `locals.user`, `locals.izin`, dan `locals.peranAktif` sudah terisi.
 */
export function enforceAccess(ctx: GuardContext): void {
  const { pathname } = ctx.url;
  const group = matchRouteGroup(pathname);

  // Pengaturan adalah area administratif: hanya akun yang boleh mengelola
  // pengguna (memegang `user:list`) yang boleh masuk. Pengecekan ini sengaja
  // lebih ketat daripada izin modul per halaman supaya Pengurus RT — yang
  // punya `rt:read`/`pengurus:read` untuk kebutuhan tampilan — tidak bisa
  // membuka area Pengaturan sama sekali.
  if (matchesPrefix(pathname, [PENGATURAN_PREFIX]) && !bolehBukaModul(ctx.locals.izin, 'user')) {
    throw error(403, 'Anda tidak punya akses ke area Pengaturan.');
  }

  if (!group) {
    // Di luar daftar route group: auth-only, seperti sebelumnya.
    if (matchesPrefix(pathname, PROTECTED)) requireUser(ctx);
    return;
  }

  requireUser(ctx);

  if (group.id === 'staff' && !isStaff(ctx.locals)) {
    // Warga yang mengetik surface staf diarahkan ke portalnya sendiri, bukan
    // diberi 403 — mereka memang punya "rumah" lain.
    throw redirect(302, WARGA_PORTAL);
  }

  // Izin modul: staf yang boleh membuka group tetap bisa ditolak per modul,
  // mis. pengurus RT yang tidak punya izin `kas` sama sekali.
  const modul = modulForPath(pathname);
  if (modul) {
    const izin = ctx.locals.izin ?? {};
    const boleh = modul.some((key) => bolehBukaModul(izin, key));
    if (!boleh) {
      throw error(403, 'Anda tidak punya akses ke modul ini.');
    }
  }
}
