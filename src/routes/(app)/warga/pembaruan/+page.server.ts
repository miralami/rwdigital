import { db } from '$lib/server/db';
import { warga, permintaanPembaruan } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { requireRole, STAFF_ROLES } from '$lib/server/guard';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  requireRole({ locals, url }, STAFF_ROLES);

  // Daftar semua permintaan dengan data warga
  const semuaPermintaan = await db
    .select({
      id: permintaanPembaruan.id,
      wargaId: permintaanPembaruan.wargaId,
      namaWarga: warga.nama,
      nikWarga: warga.nik,
      dataLama: permintaanPembaruan.dataLama,
      dataBaru: permintaanPembaruan.dataBaru,
      catatan: permintaanPembaruan.catatan,
      status: permintaanPembaruan.status,
      catatanPengurus: permintaanPembaruan.catatanPengurus,
      tanggalTinjau: permintaanPembaruan.tanggalTinjau,
      createdAt: permintaanPembaruan.createdAt
    })
    .from(permintaanPembaruan)
    .innerJoin(warga, eq(permintaanPembaruan.wargaId, warga.id))
    .orderBy(desc(permintaanPembaruan.createdAt));

  const statusFilter = url.searchParams.get('status') ?? 'diajukan';

  return {
    permintaan: semuaPermintaan,
    statusFilter
  };
};

export const actions: Actions = {
  tinjau: async ({ request, locals, url }) => {
    requireRole({ locals, url }, STAFF_ROLES);
    const userId = locals.user!.id;

    const formData = await request.formData();
    const id = Number(formData.get('id'));
    const aksi = formData.get('aksi') as string;
    const catatanPengurus = formData.get('catatanPengurus') as string;

    if (!id || !['verifikasi', 'setujui', 'tolak'].includes(aksi)) {
      return fail(400, { error: 'Parameter tidak valid.' });
    }

    const [req] = await db
      .select()
      .from(permintaanPembaruan)
      .where(eq(permintaanPembaruan.id, id));

    if (!req) return fail(404, { error: 'Permintaan tidak ditemukan.' });

    const statusBaru =
      aksi === 'verifikasi' ? 'diverifikasi' :
      aksi === 'setujui' ? 'disetujui' : 'ditolak';

    // Jika disetujui → terapkan perubahan ke tabel warga
    if (statusBaru === 'disetujui') {
      const dataBaru: Record<string, string> = JSON.parse(req.dataBaru);

      // Map field dari permintaan ke kolom warga
      const fieldMap: Record<string, string> = {
        nama: 'nama',
        tempatLahir: 'tempatLahir',
        tanggalLahir: 'tanggalLahir',
        jenisKelamin: 'jenisKelamin',
        agama: 'agama',
        pendidikan: 'pendidikan',
        pekerjaan: 'pekerjaan',
        statusPerkawinan: 'statusPerkawinan'
      };

      // Buat object update hanya untuk field yang ada di dataBaru
      const updateData: Partial<typeof warga.$inferInsert> = {};
      for (const [key, col] of Object.entries(fieldMap)) {
        if (dataBaru[key] !== undefined) {
          (updateData as Record<string, string>)[col] = dataBaru[key];
        }
      }

      if (Object.keys(updateData).length > 0) {
        await db.update(warga).set(updateData).where(eq(warga.id, req.wargaId));
      }
    }

    await db
      .update(permintaanPembaruan)
      .set({
        status: statusBaru,
        catatanPengurus: catatanPengurus?.trim() || null,
        ditinjauOleh: userId,
        tanggalTinjau: new Date().toISOString()
      })
      .where(eq(permintaanPembaruan.id, id));

    return { success: true };
  }
};
