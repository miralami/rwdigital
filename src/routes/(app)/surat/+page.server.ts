import { db } from '$lib/server/db';
import { surat, warga, rt, kk } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
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
    .orderBy(desc(surat.createdAt));

  return { semuaSurat };
};
