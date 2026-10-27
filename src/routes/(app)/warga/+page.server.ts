import { db } from '$lib/server/db';
import { warga, kk, rt } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireScope, scopeFromRole, visibleRt } from '$lib/server/scope';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Pengurus RT hanya melihat warganya sendiri; admin & bendahara melihat semua.
  const scope = requireScope(scopeFromRole(locals));

  const semuaWarga = await db
    .select({
      id: warga.id,
      nik: warga.nik,
      nama: warga.nama,
      kkId: kk.id,
      noKk: kk.noKk,
      rtId: rt.id,
      nomorRt: rt.nomor,
      aktif: warga.aktif
    })
    .from(warga)
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .where(scope.kind === 'rt' ? eq(kk.rtId, scope.rtId) : undefined)
    .orderBy(warga.nama);

  const semuaRt = visibleRt(scope, await db.select().from(rt).orderBy(rt.nomor));

  return { semuaWarga, semuaRt };
};
