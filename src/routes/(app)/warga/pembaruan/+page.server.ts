import { db } from '$lib/server/db';
import { warga, permintaanPembaruan } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { requireRole, STAFF_ROLES } from '$lib/server/guard';
import { requirePermission } from '$lib/server/rbac';
import type { Actions, PageServerLoad } from './$types';

/**
 * Transisi yang diizinkan — state machine untuk permintaan pembaruan data.
 *
 * Hanya permintaan berstatus diajukan/diverifikasi yang boleh ditinjau.
 * Permintaan yang sudah disetujui atau ditolak tidak boleh diubah lagi
 * untuk mencegah overwrite data warga yang sudah final.
 */
const TRANSISI_VALID: Record<string, readonly string[]> = {
  verifikasi: ['diajukan'],
  setujui:    ['diajukan', 'diverifikasi'],
  tolak:      ['diajukan', 'diverifikasi']
};

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
    requirePermission(locals, 'warga', 'update');
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

    // ── State machine guard (#1) ─────────────────────────────────────────────
    // Hanya izinkan transisi dari status yang valid agar permintaan yang sudah
    // final (disetujui/ditolak) tidak bisa ditinjau ulang dan menulis ulang data warga.
    const statusDiizinkan = TRANSISI_VALID[aksi] ?? [];
    if (!statusDiizinkan.includes(req.status)) {
      return fail(409, {
        error: `Permintaan berstatus "${req.status}" tidak dapat di-${aksi}. Hanya status ${statusDiizinkan.join(' atau ')} yang dapat ditindaklanjuti.`
      });
    }

    const statusBaru =
      aksi === 'verifikasi' ? 'diverifikasi' :
      aksi === 'setujui' ? 'disetujui' : 'ditolak';

    // Jika disetujui → terapkan perubahan ke tabel warga
    if (statusBaru === 'disetujui') {
      // ── try/catch untuk JSON malformed (#6) ─────────────────────────────
      let dataBaru: Record<string, string>;
      try {
        dataBaru = JSON.parse(req.dataBaru);
      } catch {
        return fail(400, { error: 'Data permintaan korup (JSON tidak valid). Hubungi admin.' });
      }

      // Map field dari permintaan ke kolom warga (whitelist eksplisit)
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
