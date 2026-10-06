import { db } from '$lib/server/db';
import { pengumuman, rw } from '$lib/server/db/schema';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

const pengumumanSchema = z.object({
  judul: z.string().min(1, 'Judul wajib diisi'),
  isi: z.string().min(1, 'Isi wajib diisi'),
  kategori: z.enum(['umum', 'kegiatan', 'keuangan', 'darurat']),
  tanggalMulai: z.string().optional(),
  tanggalSelesai: z.string().optional(),
  ditampilkan: z.boolean()
});

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();

    const result = pengumumanSchema.safeParse({
      judul: formData.get('judul'),
      isi: formData.get('isi'),
      kategori: formData.get('kategori') ?? 'umum',
      tanggalMulai: formData.get('tanggalMulai') || undefined,
      tanggalSelesai: formData.get('tanggalSelesai') || undefined,
      ditampilkan: formData.get('ditampilkan') === 'on'
    });

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    const [rwData] = await db.select().from(rw).limit(1);

    await db.insert(pengumuman).values({
      ...result.data,
      rwId: rwData.id,
      dibuatOleh: locals.user?.name ?? locals.user?.id ?? 'Pengurus'
    });

    redirect(303, '/pengumuman');
  }
};
