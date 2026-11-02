import { db } from '$lib/server/db';
import { warga, kk, rt } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const userId = locals.user?.id;
  const [linked] = userId
    ? await db
        .select({
          nama: warga.nama,
          nik: warga.nik,
          noKk: kk.noKk,
          nomorRt: rt.nomor
        })
        .from(warga)
        .innerJoin(kk, eq(warga.kkId, kk.id))
        .innerJoin(rt, eq(kk.rtId, rt.id))
        .where(eq(warga.userId, userId))
        .limit(1)
    : [];

  return {
    user: locals.user,
    wargaInfo: linked ?? null
  };
};
