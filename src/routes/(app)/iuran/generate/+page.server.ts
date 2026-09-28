import { db } from '$lib/server/db';
import { tagihan, kk, jenisIuran } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';

const generateSchema = z.object({
  jenisIuranId: z.coerce.number().int().positive('Jenis iuran wajib dipilih'),
  periode: z.string().regex(/^\d{4}-\d{2}$/, 'Periode harus format YYYY-MM')
});

export const load: PageServerLoad = async () => {
  const semuaJenis = await db.select().from(jenisIuran);
  return { semuaJenis };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    const result = generateSchema.safeParse({
      jenisIuranId: formData.get('jenisIuranId'),
      periode: formData.get('periode')
    });

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    const { jenisIuranId, periode } = result.data;

    // Get jenis iuran for nominal
    const [jenis] = await db.select().from(jenisIuran).where(eq(jenisIuran.id, jenisIuranId));
    if (!jenis) redirect(302, '/iuran');

    // Get all active KK
    const semuaKk = await db.select().from(kk);

    // Check for existing tagihan (avoid duplicates)
    const existing = await db
      .select()
      .from(tagihan)
      .where(eq(tagihan.jenisIuranId, jenisIuranId));

    const existingKeys = new Set(existing.map(t => `${t.kkId}-${t.periode}`));

    // Create tagihan for each KK that doesn't have one yet
    const newTagihan = semuaKk
      .filter(k => !existingKeys.has(`${k.id}-${periode}`))
      .map(k => ({
        kkId: k.id,
        jenisIuranId,
        periode,
        nominal: jenis.nominal,
        status: 'belum_bayar' as const
      }));

    if (newTagihan.length > 0) {
      await db.insert(tagihan).values(newTagihan);
    }

    redirect(303, '/iuran');
  }
};
