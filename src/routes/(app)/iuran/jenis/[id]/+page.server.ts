import { db } from '$lib/server/db';
import { jenisIuran, rt } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { requirePermission } from '$lib/server/rbac';
import { requireScope, scopeFromRole } from '$lib/server/scope';
import { bacaFormJenis, jenisSchema } from '$lib/server/iuran-schema';
import type { PageServerLoad, Actions } from './$types';

const ubahSchema = jenisSchema.extend({
  id: z.coerce.number().int().positive('ID jenis iuran tidak valid')
});

function milikRt(
  row: { scope: string; rtId: number | null },
  scope: ReturnType<typeof scopeFromRole>
): boolean {
  return (
    scope.kind === 'all' ||
    (scope.kind === 'rt' && row.scope === 'rt' && row.rtId === scope.rtId)
  );
}

export const load: PageServerLoad = async ({ params, locals }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) redirect(302, '/iuran/jenis');

  const scope = requireScope(scopeFromRole(locals));
  const [detail] = await db.select().from(jenisIuran).where(eq(jenisIuran.id, id));
  if (!detail) redirect(302, '/iuran/jenis');

  // Pengurus RT tidak boleh membuka halaman ubah milik RW / RT lain.
  if (!milikRt(detail, scope)) redirect(302, '/iuran/jenis');

  const daftarRt =
    scope.kind === 'rt'
      ? await db.select({ id: rt.id, nomor: rt.nomor }).from(rt).where(eq(rt.id, scope.rtId))
      : await db.select({ id: rt.id, nomor: rt.nomor }).from(rt).orderBy(asc(rt.nomor));

  return { detail, daftarRt, scopeKind: scope.kind };
};

export const actions: Actions = {
  default: async ({ params, request, locals }) => {
    requirePermission(locals, 'iuran', 'update');
    const scope = requireScope(scopeFromRole(locals));

    const result = ubahSchema.safeParse({
      ...bacaFormJenis(await request.formData()),
      id: params.id
    });

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    const { id, ...nilai } = result.data;

    const [lama] = await db.select().from(jenisIuran).where(eq(jenisIuran.id, id)).limit(1);
    if (!lama) return fail(404, { error: 'Jenis iuran tidak ditemukan.' });
    if (!milikRt(lama, scope)) {
      return fail(403, { error: 'Anda hanya boleh mengubah jenis iuran milik RT sendiri.' });
    }

    // Nominal & porsi baru hanya dipakai tagihan berikutnya. Tagihan yang
    // sudah terbit menyimpan snapshot sendiri (lihat komentar di schema).
    await db
      .update(jenisIuran)
      .set({
        ...nilai,
        scope: scope.kind === 'rt' ? 'rt' : nilai.scope,
        rtId:
          scope.kind === 'rt'
            ? scope.rtId
            : nilai.scope === 'rt'
              ? (nilai.rtId ?? null)
              : null,
        updatedAt: new Date().toISOString()
      })
      .where(eq(jenisIuran.id, id));

    redirect(303, '/iuran/jenis');
  }
};
