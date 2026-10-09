import { error, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { Role } from '$lib/permissions';

/**
 * Guard akses berbasis role.
 *
 * Single source of truth untuk klasifikasi rute + role yang boleh mengaksesnya.
 * Dipakai oleh `hooks.server.ts`, `(app)/+layout.server.ts`, dan halaman login
 * supaya ketiganya tidak bisa berbeda pendapat soal siapa boleh buka apa.
 *
 * Perhatikan: modul ini hidup di `$lib/server/`, jadi SvelteKit yang melarang
 * impor dari kode browser. `Role` diambil dari `$lib/permissions` (type-only)
 * agar nama role tetap berasal dari satu tempat.
 */

// ─── Role ────────────────────────────────────────────────────────────────────
// Nama role diambil dari `$lib/permissions` sebagai type, jadi daftar ini
// tidak mungkin menyimpang dari definisi role di sana.
export const STAFF_ROLES = ['admin_rw', 'pengurus_rt', 'bendahara'] as const satisfies readonly Role[];
export const WARGA_ROLES = ['warga'] as const satisfies readonly Role[];

const KNOWN_ROLES: readonly string[] = [...STAFF_ROLES, ...WARGA_ROLES];

const isWarga = (role: Role): boolean => (WARGA_ROLES as readonly string[]).includes(role);

// ─── Konstanta rute ──────────────────────────────────────────────────────────
export const LOGIN = '/login';
export const DASHBOARD = '/dashboard';
/** Portal warga — dipakai juga oleh lane desain, jangan diubah sepihak. */
export const WARGA_PORTAL = '/portal';

// ─── Klasifikasi rute ────────────────────────────────────────────────────────
export type RouteGroupId = 'staff' | 'warga';

export type RouteGroup = {
  id: RouteGroupId;
  /** Prefix rute, termasuk seluruh subpath-nya. */
  prefixes: readonly string[];
  allowed: readonly Role[];
};

/** Surface manajemen: dashboard, data warga, kas, iuran, pengumuman, surat. */
export const ADMIN_ROUTES = ['/dashboard', '/warga', '/kas', '/iuran', '/pengumuman', '/surat'] as const;

/** Portal warga. Staff boleh masuk juga supaya bisa preview. */
export const WARGA_ROUTES = [WARGA_PORTAL] as const;

export const ROUTE_GROUPS: readonly RouteGroup[] = [
  { id: 'staff', prefixes: ADMIN_ROUTES, allowed: STAFF_ROLES },
  { id: 'warga', prefixes: WARGA_ROUTES, allowed: [...WARGA_ROLES, ...STAFF_ROLES] }
];

/**
 * Fallback auth-only: rute yang masuk daftar ini tapi belum diklasifikasikan di
 * `ROUTE_GROUPS` tetap wajib login (perilaku lama), tanpa cek role.
 * `/login` dan `/api/auth/**` sengaja tidak ada di sini — keduanya publik.
 */
export const PROTECTED: readonly string[] = ROUTE_GROUPS.flatMap((g) => [...g.prefixes]);

/**
 * Role yang mendarat di group orang lain diarahkan ke landing miliknya sendiri,
 * bukan diberi 403.
 * Warga yang mengetik `/dashboard` di address bar harus mendarat di portal, bukan
 * melihat halaman error.
 */
const BOUNCE_LANDING: Partial<Record<RouteGroupId, string>> = {
  staff: WARGA_PORTAL
};

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

// ─── Normalisasi role ────────────────────────────────────────────────────────
/**
 * Ambil daftar role milik user dari `locals.user.role`.
 *
 * Temuan: plugin `admin` milik Better Auth menyimpan role sebagai satu kolom
 * `text` (lihat `UserWithRole` dan schema plugin-nya: `role: { type: "string" }`).
 * Role ganda disimpan sebagai satu string BERKOMA — itu yang dipecah oleh
 * `hasPermission` internal plugin (`role.split(",")`). Tipe TS-nya tetap `string`,
 * tapi data lama/seed bisa mengirim array, jadi keduanya ditangani di sini.
 * Nilai yang tidak dikenal dibuang (fail-closed).
 */
export function normalizeRole(value: unknown): Role[] {
  const parts = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  const found = new Set<Role>();

  for (const part of parts) {
    const role = typeof part === 'string' ? part.trim() : '';
    if (KNOWN_ROLES.includes(role)) found.add(role as Role);
  }

  return [...found];
}

/** Role milik user yang sedang login. Aman dipanggil tanpa session. */
export function rolesOf(locals: App.Locals): Role[] {
  return normalizeRole((locals.user as { role?: unknown } | null)?.role);
}

// ─── Landing page ────────────────────────────────────────────────────────────
/** Halaman awal menurut role: warga → portal, staff → dashboard. */
export function landingPathFor(locals: App.Locals): string {
  return rolesOf(locals).some(isWarga) ? WARGA_PORTAL : DASHBOARD;
}

// ─── Assertion ───────────────────────────────────────────────────────────────
type GuardContext = Pick<RequestEvent, 'locals' | 'url'>;

/** Wajib ada session. Selain itu lempar ke halaman login. */
export function requireUser(ctx: GuardContext) {
  if (!ctx.locals.user) throw redirect(302, LOGIN);
  return ctx.locals.user;
}

/** Wajib ada session DAN role-nya termasuk `allowed`. Tanpa session → login, role salah → 403. */
export function requireRole(ctx: GuardContext, allowed: readonly Role[]) {
  const user = requireUser(ctx);
  if (!rolesOf(ctx.locals).some((role) => allowed.includes(role))) {
    throw error(403, 'Anda tidak punya akses ke halaman ini.');
  }
  return user;
}

/**
 * Gerbang utama. Dipanggil dari `hooks.server.ts` (seluruh request) dan dari
 * `(app)/+layout.server.ts` (defence in depth per route group).
 *
 * Dipanggil setelah session hydration di `hooks.server.ts`, jadi `locals.user`
 * sudah terisi dan tidak ada fetch session kedua.
 */
export function enforceAccess(ctx: GuardContext): void {
  const { pathname } = ctx.url;
  const group = matchRouteGroup(pathname);

  if (!group) {
    // Di luar daftar route group: auth-only, seperti sebelumnya.
    if (matchesPrefix(pathname, PROTECTED)) requireUser(ctx);
    return;
  }

  const roles = rolesOf(ctx.locals);
  requireUser(ctx);

  if (roles.some((role) => group.allowed.includes(role))) return;

  // Role-own landing: warga yang mendarat di surface staf → portalnya sendiri.
  const bounce = BOUNCE_LANDING[group.id];
  if (bounce && bounce !== pathname && roles.some(isWarga)) throw redirect(302, bounce);

  throw error(403, 'Anda tidak punya akses ke halaman ini.');
}
