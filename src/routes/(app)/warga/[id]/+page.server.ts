import { db } from '$lib/server/db';
import { warga, kk, rt, riwayatWarga } from '$lib/server/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);

  const [detail] = await db
    .select({
      id: warga.id,
      nik: warga.nik,
      nama: warga.nama,
      tempatLahir: warga.tempatLahir,
      tanggalLahir: warga.tanggalLahir,
      jenisKelamin: warga.jenisKelamin,
      agama: warga.agama,
      pendidikan: warga.pendidikan,
      pekerjaan: warga.pekerjaan,
      statusPerkawinan: warga.statusPerkawinan,
      statusHubunganKk: warga.statusHubunganKk,
      aktif: warga.aktif,
      userId: warga.userId,
      alasanNonaktif: warga.alasanNonaktif,
      tanggalNonaktif: warga.tanggalNonaktif,
      kkId: kk.id,
      noKk: kk.noKk,
      alamatKk: kk.alamat,
      statusHuni: kk.statusHuni,
      rtId: rt.id,
      nomorRt: rt.nomor
    })
    .from(warga)
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .where(eq(warga.id, id));

  if (!detail) {
    redirect(302, '/warga');
  }

  const anggotaKk = await db
    .select()
    .from(warga)
    .where(eq(warga.kkId, detail.kkId))
    .orderBy(warga.nama);

  const riwayat = await db
    .select()
    .from(riwayatWarga)
    .where(eq(riwayatWarga.wargaId, id))
    .orderBy(desc(riwayatWarga.tanggal));

  let userAccount: { id: string; email: string; role: string | null } | null = null;
  if (detail.userId) {
    try {
      const userRows = await db.all<{ id: string; email: string; role: string | null }>(
        sql`SELECT id, email, role FROM user WHERE id = ${detail.userId}`
      );
      userAccount = userRows[0] ?? null;
    } catch {
      userAccount = null;
    }
  }

  return { detail, anggotaKk, userAccount, riwayat };
};

export const actions: Actions = {
  nonaktifkan: async ({ params, request }) => {
    const id = Number(params.id);
    const formData = await request.formData();
    const alasan = String(formData.get('alasan') || 'Tidak disebutkan').trim();
    const tanggal = String(formData.get('tanggal') || new Date().toISOString().slice(0, 10)).trim();

    await db
      .update(warga)
      .set({
        aktif: false,
        alasanNonaktif: alasan,
        tanggalNonaktif: tanggal
      })
      .where(eq(warga.id, id));

    return { success: true };
  },

  aktifkan: async ({ params }) => {
    const id = Number(params.id);
    await db
      .update(warga)
      .set({
        aktif: true,
        alasanNonaktif: null,
        tanggalNonaktif: null
      })
      .where(eq(warga.id, id));

    return { success: true };
  },

  buatAkun: async ({ params, request }) => {
    const id = Number(params.id);
    const formData = await request.formData();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || 'warga123').trim();

    const [w] = await db.select().from(warga).where(eq(warga.id, id));
    if (!w) return fail(404, { error: 'Data warga tidak ditemukan' });

    const userEmail = email || `${w.nik}@warga.rw`;

    try {
      const res = await auth.api.signUpEmail({
        body: {
          name: w.nama,
          email: userEmail,
          password
        }
      });

      if (res?.user?.id) {
        await db.update(warga).set({ userId: res.user.id }).where(eq(warga.id, id));
      }

      return { success: true, userEmail };
    } catch (err: any) {
      return fail(400, { error: err.message || 'Gagal membuat akun warga' });
    }
  }
};

