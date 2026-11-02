import { permissionsOf } from '$lib/server/rbac';
import type { PageServerLoad } from './$types';

/**
 * Menu pengaturan.
 *
 * Setiap kartu hanya ditampilkan kalau akun boleh membuka modulnya, jadi tidak
 * ada tautan yang berujung 403. Aksi "ubah" tetap dicek di halaman masing-masing
 * (mis. pemegang `rt:read` melihat daftar RT tanpa tombol simpan).
 */
export const load: PageServerLoad = async ({ locals }) => {
  const izin = permissionsOf(locals);

  return {
    akses: {
      rt: izin.can('rt', 'read'),
      pengurus: izin.can('pengurus', 'read'),
      landing: izin.can('landing', 'read'),
      // Plugin admin Better Auth memakai `list` untuk daftar akun, bukan `read`.
      pengguna: izin.can('user', 'list'),
      peran: izin.can('peran', 'read')
    }
  };
};
