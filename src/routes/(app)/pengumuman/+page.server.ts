import { db } from '$lib/server/db';
import { pengumuman, rt } from '$lib/server/db/schema';
import { desc, eq, isNull, or } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { requirePermission } from '$lib/server/rbac';
import { requireScope, scopeFromRole } from '$lib/server/scope';
import type { PageServerLoad, Actions } from './$types';

/** Pemetaan pengumuman yang boleh disentuh akun ini. */
async function pengumumanMilik(id: number) {
  const [row] = await db.select().from(pengumuman).where(eq(pengumuman.id, id)).limit(1);
  return row ?? null;
}

function bolehUbah(
  scope: ReturnType<typeof scopeFromRole>,
  row: { rtId: number | null }
): boolean {
  if (scope.kind === 'all') return true;
  if (scope.kind === 'rt') return row.rtId === scope.rtId;
  return false;
}

export const load: PageServerLoad = async ({ locals }) => {
  const scope = requireScope(scopeFromRole(locals));

  const semuaPengumuman = await db
    .select()
    .from(pengumuman)
    .where(
      scope.kind === 'rt'
        ? or(isNull(pengumuman.rtId), eq(pengumuman.rtId, scope.rtId))
        : undefined
    )
    .orderBy(desc(pengumuman.createdAt));

  const daftarRt = await db.select({ id: rt.id, nomor: rt.nomor }).from(rt);
  const nomorRt = new Map(daftarRt.map((r) => [r.id, r.nomor]));

  return {
    semuaPengumuman: semuaPengumuman.map((p) => ({
      ...p,
      nomorRt: p.rtId ? (nomorRt.get(p.rtId) ?? null) : null
    }))
  };
};

export const actions: Actions = {
  hapus: async ({ request, locals }) => {
    requirePermission(locals, 'pengumuman', 'delete');
    const scope = requireScope(scopeFromRole(locals));
    const formData = await request.formData();
    const id = Number(formData.get('id'));

    if (!id) return fail(400, { error: 'ID pengumuman tidak valid.' });

    const row = await pengumumanMilik(id);
    if (!row) return fail(404, { error: 'Pengumuman tidak ditemukan.' });
    if (!bolehUbah(scope, row)) {
      return fail(403, { error: 'Anda hanya boleh mengubah pengumuman RT sendiri.' });
    }

    await db.delete(pengumuman).where(eq(pengumuman.id, id));
    redirect(303, '/pengumuman');
  },

  toggle: async ({ request, locals }) => {
    requirePermission(locals, 'pengumuman', 'update');
    const scope = requireScope(scopeFromRole(locals));
    const formData = await request.formData();
    const id = Number(formData.get('id'));

    if (!id) return fail(400, { error: 'ID pengumuman tidak valid.' });

    const current = await pengumumanMilik(id);
    if (!current) return fail(404, { error: 'Pengumuman tidak ditemukan.' });
    if (!bolehUbah(scope, current)) {
      return fail(403, { error: 'Anda hanya boleh mengubah pengumuman RT sendiri.' });
    }

    await db
      .update(pengumuman)
      .set({ ditampilkan: !current.ditampilkan })
      .where(eq(pengumuman.id, id));

    redirect(303, '/pengumuman');
  }
};
