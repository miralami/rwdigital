import { error, redirect } from '@sveltejs/kit';
import { roles, type Role } from '$lib/permissions';
import { rolesOf } from './guard';

/**
 * Pemeriksaan izin per-aksi (resource + action), bukan per route-group.
 *
 * `$lib/server/guard.ts` hanya memutuskan boleh/tidak membuka sebuah halaman.
 * Begitu halaman terbuka, semua staf masih bisa menekan tombol apa pun di
 * dalamnya. Modul ini memakai matriks yang sama dengan `$lib/permissions.ts`
 * (didefinisikan lewat `ac.newRole`) sehingga aturan hanya ada di satu tempat.
 *
 * Contoh: halaman `/kas` boleh dibuka `pengurus_rt` (read-only), tapi aksi
 * "catat kas" tetap butuh `kas:create` yang tidak dimiliki role itu.
 */
export function can(roleList: readonly Role[], resource: string, action: string): boolean {
  return roleList.some((roleName) => {
    const role = roles[roleName];
    if (!role) return false;
    // `authorize` menerima objek { resource: [actions] }. Satu resource saja,
    // jadi connector OR/AND berperilaku sama.
    return role.authorize({ [resource]: [action] } as never, 'OR').success;
  });
}

/** Lempar 401/403 kalau user tidak punya izin. Dipanggil di awal setiap aksi mutasi. */
export function requirePermission(locals: App.Locals, resource: string, action: string): void {
  if (!locals.user) throw redirect(302, '/login');

  if (!can(rolesOf(locals), resource, action)) {
    throw error(403, `Anda tidak punya izin "${action}" pada modul ${resource}.`);
  }
}

/** Versi non-throwing untuk dipakai di `load()` saat menyembunyikan tombol. */
export function permissionsOf(locals: App.Locals) {
  const roleList = rolesOf(locals);
  return {
    canCreate: (resource: string) => can(roleList, resource, 'create'),
    canUpdate: (resource: string) => can(roleList, resource, 'update'),
    canDelete: (resource: string) => can(roleList, resource, 'delete'),
    can: (resource: string, action: string) => can(roleList, resource, action)
  };
}
