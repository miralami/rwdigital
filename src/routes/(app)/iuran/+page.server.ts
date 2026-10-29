import { db } from '$lib/server/db';
import { tagihan, kk, jenisIuran } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireScope, scopeFromRole } from '$lib/server/scope';
import { menunggak } from '$lib/server/iuran';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const scope = requireScope(scopeFromRole(locals));
  const hariIni = new Date().toISOString().slice(0, 10);

  const semuaTagihan = await db
    .select({
      id: tagihan.id,
      kkId: kk.id,
      noKk: kk.noKk,
      alamatKk: kk.alamat,
      jenisIuranId: jenisIuran.id,
      namaJenisIuran: jenisIuran.nama,
      scopeJenis: jenisIuran.scope,
      periode: tagihan.periode,
      nominal: tagihan.nominal,
      porsiRw: tagihan.porsiRw,
      status: tagihan.status,
      jatuhTempo: tagihan.jatuhTempo
    })
    .from(tagihan)
    .innerJoin(kk, eq(tagihan.kkId, kk.id))
    .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
    .where(scope.kind === 'rt' ? eq(kk.rtId, scope.rtId) : undefined)
    .orderBy(tagihan.periode);

  const semuaJenisIuran = await db.select().from(jenisIuran);

  return {
    semuaTagihan: semuaTagihan.map((t) => ({
      ...t,
      menunggak: menunggak(t.status, t.jatuhTempo, hariIni)
    })),
    semuaJenisIuran
  };
};
