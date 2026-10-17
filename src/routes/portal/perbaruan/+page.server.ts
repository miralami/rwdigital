import { db } from '$lib/server/db';
import { warga, permintaanPembaruan } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user?.id;
  if (!userId) throw redirect(302, '/login');

  const [linkedWarga] = await db
    .select({
      id: warga.id,
      nama: warga.nama,
      nik: warga.nik,
      tempatLahir: warga.tempatLahir,
      tanggalLahir: warga.tanggalLahir,
      jenisKelamin: warga.jenisKelamin,
      agama: warga.agama,
      pendidikan: warga.pendidikan,
      pekerjaan: warga.pekerjaan,
      statusPerkawinan: warga.statusPerkawinan,
      statusHubunganKk: warga.statusHubunganKk
    })
    .from(warga)
    .where(eq(warga.userId, userId));

  if (!linkedWarga) {
    return { terhubung: false, warga: null, riwayatPermintaan: [] };
  }

  // Riwayat permintaan pembaruan milik warga ini
  const riwayatPermintaan = await db
    .select({
      id: permintaanPembaruan.id,
      status: permintaanPembaruan.status,
      catatan: permintaanPembaruan.catatan,
      catatanPengurus: permintaanPembaruan.catatanPengurus,
      createdAt: permintaanPembaruan.createdAt
    })
    .from(permintaanPembaruan)
    .where(eq(permintaanPembaruan.wargaId, linkedWarga.id))
    .orderBy(desc(permintaanPembaruan.createdAt));

  return { terhubung: true, warga: linkedWarga, riwayatPermintaan };
};

export const actions: Actions = {
  ajukan: async ({ request, locals }) => {
    const userId = locals.user?.id;
    if (!userId) throw redirect(302, '/login');

    const formData = await request.formData();

    const [linkedWarga] = await db
      .select()
      .from(warga)
      .where(eq(warga.userId, userId));

    if (!linkedWarga) {
      return fail(400, { error: 'Akun belum terhubung ke data warga.' });
    }

    // Ambil field yang bisa diubah warga
    const dataBaru: Record<string, string> = {};
    const fieldsDiizinkan = [
      'nama', 'tempatLahir', 'tanggalLahir', 'jenisKelamin',
      'agama', 'pendidikan', 'pekerjaan', 'statusPerkawinan'
    ] as const;

    for (const field of fieldsDiizinkan) {
      const val = formData.get(field);
      if (typeof val === 'string' && val.trim()) {
        dataBaru[field] = val.trim();
      }
    }

    if (Object.keys(dataBaru).length === 0) {
      return fail(400, { error: 'Tidak ada data yang diubah.' });
    }

    const catatan = formData.get('catatan');

    // Snapshot data lama
    const dataLama: Record<string, string | null> = {
      nama: linkedWarga.nama,
      tempatLahir: linkedWarga.tempatLahir,
      tanggalLahir: linkedWarga.tanggalLahir,
      jenisKelamin: linkedWarga.jenisKelamin,
      agama: linkedWarga.agama,
      pendidikan: linkedWarga.pendidikan ?? null,
      pekerjaan: linkedWarga.pekerjaan ?? null,
      statusPerkawinan: linkedWarga.statusPerkawinan
    };

    await db.insert(permintaanPembaruan).values({
      wargaId: linkedWarga.id,
      dataLama: JSON.stringify(dataLama),
      dataBaru: JSON.stringify(dataBaru),
      catatan: typeof catatan === 'string' && catatan.trim() ? catatan.trim() : null,
      status: 'diajukan',
      diajukanOleh: userId
    });

    return { success: true };
  }
};
