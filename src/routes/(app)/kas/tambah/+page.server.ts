import { db } from '$lib/server/db';
import { transaksiKas, kategoriKas, rw } from '$lib/server/db/schema';
import { superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

const transaksiSchema = z.object({
  jenis: z.enum(['pemasukan', 'pengeluaran']),
  nominal: z.coerce.number().positive('Nominal harus lebih dari 0'),
  keterangan: z.string().min(1, 'Keterangan wajib diisi'),
  kategoriId: z.coerce.number().int().positive().optional(),
  tanggal: z.string().min(1, 'Tanggal wajib diisi')
});

export const load: PageServerLoad = async () => {
  const semuaKategori = await db.select().from(kategoriKas);
  const [rwData] = await db.select().from(rw).limit(1);
  const form = await superForm(zod(transaksiSchema as any));
  return { semuaKategori, rwData, form };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();

    const result = transaksiSchema.safeParse({
      jenis: formData.get('jenis'),
      nominal: formData.get('nominal'),
      keterangan: formData.get('keterangan'),
      kategoriId: formData.get('kategoriId') || undefined,
      tanggal: formData.get('tanggal')
    });

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    const [rwData] = await db.select().from(rw).limit(1);

    await db.insert(transaksiKas).values({
      ...result.data,
      kategoriId: result.data.kategoriId || null,
      dicatatOleh: locals.user?.id ?? 'system',
      rwId: rwData.id
    });

    redirect(303, '/kas');
  }
};
