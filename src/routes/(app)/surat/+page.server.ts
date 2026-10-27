import { db } from '$lib/server/db';
import { surat, warga, rt, kk } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireScope, scopeFromRole } from '$lib/server/scope';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const scope = requireScope(scopeFromRole(locals));

  const semuaSurat = await db
    .select({
      id: surat.id,
      nomorSurat: surat.nomorSurat,
      jenis: surat.jenis,
      keperluan: surat.keperluan,
      status: surat.status,
      tanggalTerbit: surat.tanggalTerbit,
      createdAt: surat.createdAt,
      namaWarga: warga.nama,
      nikWarga: warga.nik,
      nomorRt: rt.nomor
    })
    .from(surat)
    .innerJoin(warga, eq(surat.wargaId, warga.id))
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .where(scope.kind === 'rt' ? eq(kk.rtId, scope.rtId) : undefined)
    .orderBy(desc(surat.createdAt));

  return { semuaSurat };
};
