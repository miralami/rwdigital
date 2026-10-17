import { db } from '$lib/server/db';
import { warga, permintaanPembaruan } from '$lib/server/db/schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

/**
 * Skema validasi Zod untuk field yang bisa diperbarui warga (#2).
 *
 * Nilai dikirim dari form sebagai string, validasi dilakukan sebelum disimpan
 * ke DB dan sebelum diterapkan ke tabel warga saat disetujui pengurus.
 */
const skemaDataBaru = z.object({
  nama:             z.string().min(2).max(100).optional(),
  tempatLahir:      z.string().min(2).max(100).optional(),
  tanggalLahir:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal: YYYY-MM-DD').optional(),
  jenisKelamin:     z.enum(['L', 'P']).optional(),
  agama:            z.enum(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya']).optional(),
  pendidikan:       z.string().max(50).optional(),
  pekerjaan:        z.string().max(100).optional(),
  statusPerkawinan: z.enum(['belum_kawin', 'kawin', 'cerai_hidup', 'cerai_mati']).optional()
}).strict();

/** Status permintaan yang dianggap "aktif" (belum final). */
const STATUS_AKTIF = ['diajukan', 'diverifikasi'] as const;

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
    return { terhubung: false, warga: null, riwayatPermintaan: [], adaPermintaanAktif: false };
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

  // Cek apakah masih ada permintaan aktif (#5)
  const adaPermintaanAktif = riwayatPermintaan.some((r) =>
    (STATUS_AKTIF as readonly string[]).includes(r.status)
  );

  return { terhubung: true, warga: linkedWarga, riwayatPermintaan, adaPermintaanAktif };
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

    // ── Tolak jika masih ada permintaan aktif (#5) ───────────────────────────
    // Mencegah approval-collision: jika dua permintaan disetujui selisih detik,
    // keduanya menulis ke tabel warga dan hasilnya tidak deterministik.
    const [permintaanAktif] = await db
      .select({ id: permintaanPembaruan.id })
      .from(permintaanPembaruan)
      .where(
        and(
          eq(permintaanPembaruan.wargaId, linkedWarga.id),
          inArray(permintaanPembaruan.status, [...STATUS_AKTIF])
        )
      )
      .limit(1);

    if (permintaanAktif) {
      return fail(409, {
        error: 'Masih ada permintaan pembaruan yang sedang diproses. Tunggu hingga selesai sebelum mengajukan yang baru.'
      });
    }

    // ── Ambil & validasi field yang boleh diubah warga (#2) ──────────────────
    const raw: Record<string, string> = {};
    const fieldsDiizinkan = [
      'nama', 'tempatLahir', 'tanggalLahir', 'jenisKelamin',
      'agama', 'pendidikan', 'pekerjaan', 'statusPerkawinan'
    ] as const;

    for (const field of fieldsDiizinkan) {
      const val = formData.get(field);
      if (typeof val === 'string' && val.trim()) {
        raw[field] = val.trim();
      }
    }

    if (Object.keys(raw).length === 0) {
      return fail(400, { error: 'Tidak ada data yang diubah.' });
    }

    // Validasi Zod — enum & format tanggal
    const parsed = skemaDataBaru.safeParse(raw);
    if (!parsed.success) {
      const pesanError = parsed.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ');
      return fail(422, { error: `Data tidak valid: ${pesanError}` });
    }

    const dataBaru = parsed.data as Record<string, string>;
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
