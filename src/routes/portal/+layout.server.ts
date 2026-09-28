import type { LayoutServerLoad } from './$types';

/**
 * Data untuk shell portal warga.
 *
 * Sengaja TIDAK ada guard di sini: kontrol akses `/portal` sudah dietinggu
 * `hooks.server.ts` → `enforceAccess` (lihat `$lib/server/guard.ts`, group
 * `warga`). File ini hanya meneruskan user ke layout supaya header bisa
 * menyapa dan panel profil bisa menampilkan nama/role.
 */
export const load: LayoutServerLoad = async ({ locals }) => {
  return { user: locals.user };
};
