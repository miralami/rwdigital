import { db } from '$lib/server/db';
import { warga, surat } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { saveUploadedFile } from '$lib/server/storage';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';

const ajukanSuratSchema = z.object({
  jenis: z.enum(['skck', 'sktm', 'domisili', 'usaha', 'umum'], {
    message: 'Pilih jenis surat yang valid'
  }),
  keperluan: z.string().min(5, 'Keperluan harus diisi minimal 5 karakter'),
  keterangan: z.string().optional()
});

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    redirect(302, '/login');
  }

  const [w] = await db
    .select({
      id: warga.id,
      nama: warga.nama,
      nik: warga.nik
    })
    .from(warga)
    .where(eq(warga.userId, locals.user.id));

  if (!w) {
    redirect(302, '/portal');
  }

  return { warga: w };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      redirect(302, '/login');
    }

    const [w] = await db
      .select({ id: warga.id })
      .from(warga)
      .where(eq(warga.userId, locals.user.id));

    if (!w) {
      return fail(400, { error: 'Akun Anda belum terhubung dengan data warga.' });
    }

    const formData = await request.formData();
    const jenis = formData.get('jenis');
    const keperluan = formData.get('keperluan');
    const keterangan = formData.get('keterangan');
    const berkasSyarat = formData.get('berkasSyarat') as File | null;

    const parsed = ajukanSuratSchema.safeParse({
      jenis,
      keperluan,
      keterangan: keterangan ? String(keterangan) : undefined
    });

    if (!parsed.success) {
      return fail(400, {
        errors: parsed.error.flatten().fieldErrors
      });
    }

    let dokumenPath: string | null = null;
    if (berkasSyarat && berkasSyarat.size > 0) {
      dokumenPath = await saveUploadedFile(berkasSyarat, 'surat');
    }

    await db.insert(surat).values({
      jenis: parsed.data.jenis,
      keperluan: parsed.data.keperluan,
      keterangan: parsed.data.keterangan ?? null,
      dokumenSyarat: dokumenPath,
      status: 'diajukan',
      wargaId: w.id
    });

    redirect(303, '/portal#surat');
  }
};
