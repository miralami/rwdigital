import { db } from '$lib/server/db';
import { tagihan, kk, jenisIuran } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const semuaTagihan = await db
    .select({
      id: tagihan.id,
      kkId: kk.id,
      noKk: kk.noKk,
      alamatKk: kk.alamat,
      jenisIuranId: jenisIuran.id,
      namaJenisIuran: jenisIuran.nama,
      periode: tagihan.periode,
      nominal: tagihan.nominal,
      status: tagihan.status
    })
    .from(tagihan)
    .innerJoin(kk, eq(tagihan.kkId, kk.id))
    .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
    .orderBy(tagihan.periode);

  const semuaJenisIuran = await db.select().from(jenisIuran);

  return { semuaTagihan, semuaJenisIuran };
};
