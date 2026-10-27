import { db } from '$lib/server/db';
import { pengumuman } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { requirePermission } from '$lib/server/rbac';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
  const semuaPengumuman = await db
    .select()
    .from(pengumuman)
    .orderBy(desc(pengumuman.createdAt));
  return { semuaPengumuman };
};

export const actions: Actions = {
  hapus: async ({ request, locals }) => {
    requirePermission(locals, 'pengumuman', 'delete');
    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (id) {
      await db.delete(pengumuman).where(eq(pengumuman.id, id));
    }
    redirect(303, '/pengumuman');
  },

  toggle: async ({ request, locals }) => {
    requirePermission(locals, 'pengumuman', 'update');
    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (id) {
      const [current] = await db.select().from(pengumuman).where(eq(pengumuman.id, id));
      if (current) {
        await db.update(pengumuman)
          .set({ ditampilkan: !current.ditampilkan })
          .where(eq(pengumuman.id, id));
      }
    }
    redirect(303, '/pengumuman');
  }
};
