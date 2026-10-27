import { permissionsOf } from '$lib/server/rbac';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const izin = permissionsOf(locals);

  return {
    akses: {
      rt: izin.canUpdate('rt'),
      pengurus: izin.can('pengurus', 'create'),
      landing: izin.canUpdate('landing'),
      pengguna: izin.can('user', 'create')
    }
  };
};
