import { db } from '$lib/server/db';
import { tagihan, pembayaran, kk, jenisIuran, transaksiKas, kategoriKas } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';

const pembayaranSchema = z.object({
  jumlah: z.coerce.number().positive('Jumlah harus lebih dari 0'),
  metodeBayar: z.enum(['qris', 'tunai', 'transfer']),
  referensi: z.string().optional(),
  catatan: z.string().optional(),
  dibayarPada: z.string().min(1, 'Tanggal pembayaran wajib diisi')
});

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);

  const [detail] = await db
    .select({
      id: tagihan.id,
      kkId: kk.id,
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

  const riwayatPembayaran = await db
    .select()
    .from(pembayaran)
    .where(eq(pembayaran.tagihanId, id));

  const totalDibayar = riwayatPembayaran.reduce((sum, p) => sum + p.jumlah, 0);
  const sisaTagihan = detail.nominal - totalDibayar;

  return { detail, riwayatPembayaran, totalDibayar, sisaTagihan };
};

export const actions: Actions = {
  default: async ({ params, request, locals }) => {
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

    const [tagihanData] = await db.select().from(tagihan).where(eq(tagihan.id, id));
    if (!tagihanData) redirect(302, '/iuran');

    const existingPayments = await db.select().from(pembayaran).where(eq(pembayaran.tagihanId, id));
    const totalDibayar = existingPayments.reduce((sum, p) => sum + p.jumlah, 0);
    const newTotal = totalDibayar + result.data.jumlah;

    const operator = locals.user?.name ?? locals.user?.id ?? 'Bendahara';

    // 1. Insert pembayaran
    await db.insert(pembayaran).values({
      tagihanId: id,
      jumlah: result.data.jumlah,
      metodeBayar: result.data.metodeBayar,
      referensi: result.data.referensi || null,
      catatan: result.data.catatan || null,
      dibayarPada: result.data.dibayarPada,
      dicatatOleh: operator
    });

    // 2. Update tagihan status
    const newStatus = newTotal >= tagihanData.nominal ? 'lunas' : 'sebagian';
    await db.update(tagihan).set({ status: newStatus }).where(eq(tagihan.id, id));

    // 3. Otomatis rekam ke Transaksi Kas RW (SF-IU-03 & Spesifikasi 3.3.1)
    const [tagihanLengkap] = await db
      .select({
        jenisNama: jenisIuran.nama,
        noKk: kk.noKk,
        rwId: jenisIuran.rwId
      })
      .from(tagihan)
      .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
      .innerJoin(kk, eq(tagihan.kkId, kk.id))
      .where(eq(tagihan.id, id));

    const [katIuran] = await db
      .select()
      .from(kategoriKas)
      .where(eq(kategoriKas.nama, 'Iuran'))
      .limit(1);

    await db.insert(transaksiKas).values({
      jenis: 'pemasukan',
      nominal: result.data.jumlah,
      keterangan: `Pembayaran ${tagihanLengkap?.jenisNama ?? 'Iuran'} (${tagihanData.periode}) - No. KK ${tagihanLengkap?.noKk ?? ''}`,
      kategoriId: katIuran?.id ?? null,
      tanggal: result.data.dibayarPada.slice(0, 10),
      dicatatOleh: operator,
      rwId: tagihanLengkap?.rwId ?? 1
    });

    redirect(303, '/iuran');
  }
};
