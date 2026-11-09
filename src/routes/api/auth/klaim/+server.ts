import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { warga, kk, notifikasi } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'Data tidak lengkap' }, { status: 400 });

  const { nik, noKk, tanggalLahir, email, password } = body;

  if (!nik || !noKk || !tanggalLahir || !email || !password) {
    return json({ error: 'Semua kolom wajib diisi' }, { status: 400 });
  }

  if (password.length < 6) {
    return json({ error: 'Kata sandi minimal 6 karakter' }, { status: 400 });
  }

  // 1. Verifikasi data kependudukan
  const [dataWarga] = await db
    .select({
      id: warga.id,
      nama: warga.nama,
      userId: warga.userId,
      tanggalLahir: warga.tanggalLahir,
      noKk: kk.noKk
    })
    .from(warga)
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .where(and(eq(warga.nik, nik.trim()), eq(kk.noKk, noKk.trim())));

  if (!dataWarga) {
    return json(
      { error: 'Kombinasi NIK dan No. KK tidak ditemukan di sistem kependudukan RW.' },
      { status: 400 }
    );
  }

  if (dataWarga.tanggalLahir !== tanggalLahir) {
    return json(
      { error: 'Tanggal lahir tidak sesuai dengan data kependudukan tercatat.' },
      { status: 400 }
    );
  }

  if (dataWarga.userId) {
    return json(
      { error: 'Akun kependudukan ini sudah aktif diklaim sebelumnya. Silakan masuk atau gunakan opsi Lupa Kata Sandi.' },
      { status: 400 }
    );
  }

  // 2. Buat akun Better Auth
  try {
    const res = await auth.api.signUpEmail({
      body: {
        name: dataWarga.nama,
        email: email.trim().toLowerCase(),
        password
      }
    });

    if (res?.user?.id) {
      await db.execute(sql`UPDATE user SET role = ${'warga'} WHERE id = ${res.user.id}`);
      await db.update(warga).set({ userId: res.user.id }).where(eq(warga.id, dataWarga.id));

      // Kirim notifikasi selamat datang
      await db.insert(notifikasi).values([
        {
          userId: res.user.id,
          judul: 'Selamat Datang di RW Digital!',
          pesan: `Halo ${dataWarga.nama}, akun warga Anda telah berhasil diaktifkan. Email ${email} terdaftar resmi untuk verifikasi dan pemulihan kata sandi.`,
          tipe: 'sukses',
          channel: 'in_app'
        },
        {
          userId: res.user.id,
          judul: 'Konfirmasi Pendaftaran Email Warga',
          pesan: `Pendaftaran akun warga berhasil. Simpan kredensial Anda dan gunakan fitur reset kata sandi email jika lupa password.`,
          tipe: 'info',
          channel: 'email'
        }
      ]);
    }

    return json({
      success: true,
      message: 'Akun warga berhasil diaktifkan! Silakan masuk dengan email dan kata sandi Anda.'
    });
  } catch (err: any) {
    return json(
      { error: err.message || 'Gagal mendaftarkan akun. Kemungkinan email sudah digunakan.' },
      { status: 400 }
    );
  }
};
