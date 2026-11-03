import { db } from '$lib/server/db';
import { tagihan, pembayaran, kk, jenisIuran } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { requirePermission } from '$lib/server/rbac';
import { requireRtAccess, requireScope, scopeFromRole } from '$lib/server/scope';
import { catatPembayaran, hitungSisa } from '$lib/server/pembayaran';
import type { PageServerLoad, Actions } from './$types';

const pembayaranSchema = z.object({
  jumlah: z.coerce.number().positive('Jumlah harus lebih dari 0'),
  metodeBayar: z.enum(['qris', 'tunai', 'transfer']),
  referensi: z.string().optional(),
  catatan: z.string().optional(),
  dibayarPada: z.string().min(1, 'Tanggal pembayaran wajib diisi')
});

export const load: PageServerLoad = async ({ params, locals }) => {
  const id = Number(params.id);
  const scope = requireScope(scopeFromRole(locals));

  const [detail] = await db
    .select({
      id: tagihan.id,
      kkId: kk.id,
      rtId: kk.rtId,
      noKk: kk.noKk,
      alamatKk: kk.alamat,
      jenisIuranId: jenisIuran.id,
      namaJenisIuran: jenisIuran.nama,
      periode: tagihan.periode,
      nominal: tagihan.nominal,
      status: tagihan.status
    })
    .from(tagihan)
    .innerJoin(kk, eq(tagihan.kkId, kk.id))
    .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
    .where(eq(tagihan.id, id));

  if (!detail) {
    redirect(302, '/iuran');
  }

  requireRtAccess(scope, detail.rtId);

  const riwayatPembayaran = await db
    .select()
    .from(pembayaran)
    .where(eq(pembayaran.tagihanId, id));

  const totalDibayar = riwayatPembayaran.reduce((sum, p) => sum + p.jumlah, 0);
  const sisaTagihan = hitungSisa(detail.nominal, totalDibayar);

  return { detail, riwayatPembayaran, totalDibayar, sisaTagihan };
};

export const actions: Actions = {
  default: async ({ params, request, locals }) => {
    requirePermission(locals, 'iuran', 'update');
    const id = Number(params.id);
    const formData = await request.formData();

    const result = pembayaranSchema.safeParse({
      jumlah: formData.get('jumlah'),
      metodeBayar: formData.get('metodeBayar'),
      referensi: formData.get('referensi') || undefined,
      catatan: formData.get('catatan') || undefined,
      dibayarPada: formData.get('dibayarPada')
    });

    if (!result.success) {
      return fail(400, { errors: result.error.flatten().fieldErrors });
    }

    const [pemilik] = await db
      .select({ rtId: kk.rtId })
      .from(tagihan)
      .innerJoin(kk, eq(tagihan.kkId, kk.id))
      .where(eq(tagihan.id, id))
      .limit(1);
    requireRtAccess(scopeFromRole(locals), pemilik?.rtId);

    const [tagihanData] = await db.select().from(tagihan).where(eq(tagihan.id, id));

    const sisa = hitungSisa(
      tagihanData.nominal,
      (
        await db
          .select({ jumlah: pembayaran.jumlah })
          .from(pembayaran)
          .where(eq(pembayaran.tagihanId, id))
      ).reduce((jumlah, row) => jumlah + row.jumlah, 0)
    );

    // Jangan biarkan satu tagihan dibayar melebihi nominalnya.
    if (result.data.jumlah > sisa) {
      return fail(400, { error: `Jumlah melebihi sisa tagihan (${sisa}).` });
    }

    await catatPembayaran({
      tagihanId: id,
      jumlah: result.data.jumlah,
      metodeBayar: result.data.metodeBayar,
      referensi: result.data.referensi ?? null,
      catatan: result.data.catatan ?? null,
      dibayarPada: result.data.dibayarPada,
      operator: locals.user?.name ?? locals.user?.id ?? 'Bendahara'
    });

    redirect(303, '/iuran');
  }
};
