import { db } from '$lib/server/db';
import { pengumuman } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';

const editSchema = z
  .object({
    judul: z.string().min(1, 'Judul wajib diisi'),
    isi: z.string().min(1, 'Isi wajib diisi'),
    kategori: z.enum(['umum', 'kegiatan', 'keuangan', 'darurat']),
    tanggalMulai: z.string().optional(),
    tanggalSelesai: z.string().optional(),
    tanggalMulaiEvent: z.string().optional(),
    tanggalSelesaiEvent: z.string().optional(),
    lokasi: z.string().optional(),
    ditampilkan: z.boolean()
  })
  .refine(
    (data) => {
      if (data.tanggalSelesaiEvent && !data.tanggalMulaiEvent) {
        return false;
      }
      return true;
    },
    {
      message: 'Tanggal mulai event wajib diisi jika tanggal selesai event diisi',
      path: ['tanggalMulaiEvent']
    }
  )
  .refine(
    (data) => {
      if (data.tanggalMulaiEvent && data.tanggalSelesaiEvent) {
        return data.tanggalSelesaiEvent >= data.tanggalMulaiEvent;
      }
      return true;
    },
    {
      message: 'Tanggal selesai event tidak boleh sebelum tanggal mulai event',
      path: ['tanggalSelesaiEvent']
    }
  );

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  const [data] = await db.select().from(pengumuman).where(eq(pengumuman.id, id));
  if (!data) redirect(302, '/pengumuman');
  return { data };
};

export const actions: Actions = {
  default: async ({ params, request }) => {
    const id = Number(params.id);
    const formData = await request.formData();

    const rawValues = {
      judul: (formData.get('judul')?.toString() ?? '').trim(),
      isi: (formData.get('isi')?.toString() ?? '').trim(),
      kategori: (formData.get('kategori')?.toString() ?? 'umum') as any,
      tanggalMulai: formData.get('tanggalMulai') ? String(formData.get('tanggalMulai')).trim() : undefined,
      tanggalSelesai: formData.get('tanggalSelesai') ? String(formData.get('tanggalSelesai')).trim() : undefined,
      tanggalMulaiEvent: formData.get('tanggalMulaiEvent') ? String(formData.get('tanggalMulaiEvent')).trim() : undefined,
      tanggalSelesaiEvent: formData.get('tanggalSelesaiEvent') ? String(formData.get('tanggalSelesaiEvent')).trim() : undefined,
      lokasi: formData.get('lokasi') ? String(formData.get('lokasi')).trim() : undefined,
      ditampilkan: formData.get('ditampilkan') === 'on'
    };

    const result = editSchema.safeParse(rawValues);

    if (!result.success) {
      return fail(400, {
        errors: result.error.flatten().fieldErrors,
        values: rawValues
      });
    }

    await db
      .update(pengumuman)
      .set({
        judul: result.data.judul,
        isi: result.data.isi,
        kategori: result.data.kategori,
        tanggalMulai: result.data.tanggalMulai ?? null,
        tanggalSelesai: result.data.tanggalSelesai ?? null,
        tanggalMulaiEvent: result.data.tanggalMulaiEvent ?? null,
        tanggalSelesaiEvent: result.data.tanggalSelesaiEvent ?? null,
        lokasi: result.data.lokasi ?? null,
        ditampilkan: result.data.ditampilkan
      })
      .where(eq(pengumuman.id, id));

    redirect(303, '/pengumuman');
  }
};
