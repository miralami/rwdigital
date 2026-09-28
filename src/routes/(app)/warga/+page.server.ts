import { db } from '$lib/server/db';
import { warga, kk, rt } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
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
    .orderBy(warga.nama);

  const semuaRt = await db.select().from(rt).orderBy(rt.nomor);

  return { semuaWarga, semuaRt };
};
