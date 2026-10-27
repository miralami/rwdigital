import { db } from '$lib/server/db';
import {
  warga,
  kk,
  rt,
  tagihan,
  jenisIuran,
  pembayaran,
  konfirmasiBayar
} from '$lib/server/db/schema';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { hitungSisa, ringkasTagihan } from '$lib/server/pembayaran';
import type { PageServerLoad, Actions } from './$types';

const ajukanSchema = z.object({
  tagihanId: z.coerce.number().int().positive('Tagihan tidak valid'),
  jumlah: z.coerce.number().positive('Jumlah harus lebih dari 0'),
  metodeBayar: z.enum(['tunai', 'transfer']).default('tunai'),
  catatan: z.string().trim().max(300, 'Catatan terlalu panjang').optional()
});

/** Cari KK milik akun yang sedang login. */
async function kkDariUser(userId: string | undefined) {
  if (!userId) return null;

  const [baris] = await db
    .select({
      wargaId: warga.id,
      nama: warga.nama,
      kkId: kk.id,
      noKk: kk.noKk,
      alamat: kk.alamat,
      nomorRt: rt.nomor
    })
    .from(warga)
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .where(eq(warga.userId, userId))
    .limit(1);

  return baris ?? null;
}

export const load: PageServerLoad = async ({ locals }) => {
  const pemilik = await kkDariUser(locals.user?.id);

  if (!pemilik) {
    return { terhubung: false, pemilik: null, tagihan: [], ringkasan: null, riwayat: [], konfirmasi: [] };
  }

  const daftar = await db
    .select({
      id: tagihan.id,
      periode: tagihan.periode,
      nominal: tagihan.nominal,
      status: tagihan.status,
      namaJenis: jenisIuran.nama,
      scopeJenis: jenisIuran.scope
    })
    .from(tagihan)
    .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
    .where(eq(tagihan.kkId, pemilik.kkId))
    .orderBy(desc(tagihan.periode), jenisIuran.nama);

  const idTagihan = daftar.map((t) => t.id);

  const semuaBayar =
    idTagihan.length > 0
      ? await db
          .select({
            id: pembayaran.id,
            tagihanId: pembayaran.tagihanId,
            jumlah: pembayaran.jumlah,
            metodeBayar: pembayaran.metodeBayar,
            dibayarPada: pembayaran.dibayarPada,
            catatan: pembayaran.catatan
          })
          .from(pembayaran)
          .where(inArray(pembayaran.tagihanId, idTagihan))
          .orderBy(desc(pembayaran.dibayarPada))
      : [];

  const semuaKonfirmasi =
    idTagihan.length > 0
      ? await db
          .select()
          .from(konfirmasiBayar)
          .where(inArray(konfirmasiBayar.tagihanId, idTagihan))
          .orderBy(desc(konfirmasiBayar.createdAt))
      : [];

  const dibayarPerTagihan = new Map<number, number>();
  for (const bayar of semuaBayar) {
    dibayarPerTagihan.set(bayar.tagihanId, (dibayarPerTagihan.get(bayar.tagihanId) ?? 0) + bayar.jumlah);
  }

  const daftarTagihan = daftar.map((t) => {
    const totalDibayar = dibayarPerTagihan.get(t.id) ?? 0;
    const menunggu = semuaKonfirmasi.find((k) => k.tagihanId === t.id && k.status === 'menunggu');
    return {
      ...t,
      totalDibayar,
      sisa: hitungSisa(t.nominal, totalDibayar),
      konfirmasiMenunggu: menunggu
        ? { id: menunggu.id, jumlah: menunggu.jumlah, metodeBayar: menunggu.metodeBayar }
        : null
    };
  });

  const ringkasan = ringkasTagihan(
    daftarTagihan.map((t) => ({ nominal: t.nominal, totalDibayar: t.totalDibayar, status: t.status }))
  );

  const namaJenis = new Map(daftar.map((t) => [t.id, { nama: t.namaJenis, periode: t.periode }]));

  const riwayat = semuaBayar.map((b) => ({
    ...b,
    namaJenis: namaJenis.get(b.tagihanId)?.nama ?? 'Iuran',
    periode: namaJenis.get(b.tagihanId)?.periode ?? ''
  }));

  return {
    terhubung: true,
    pemilik,
    tagihan: daftarTagihan,
    ringkasan,
    riwayat,
    konfirmasi: semuaKonfirmasi
  };
};

export const actions: Actions = {
  ajukan: async ({ request, locals }) => {
    const userId = locals.user?.id;
    if (!userId) redirect(302, '/login');

    const pemilik = await kkDariUser(userId);
    if (!pemilik) {
      return fail(403, { error: 'Akun Anda belum terhubung ke data warga.' });
    }

    const formData = await request.formData();
    const hasil = ajukanSchema.safeParse({
      tagihanId: formData.get('tagihanId'),
      jumlah: formData.get('jumlah'),
      metodeBayar: formData.get('metodeBayar') || 'tunai',
      catatan: formData.get('catatan') || undefined
    });

    if (!hasil.success) {
      return fail(400, { error: hasil.error.issues[0]?.message ?? 'Data konfirmasi tidak valid.' });
    }

    const { tagihanId, jumlah, metodeBayar, catatan } = hasil.data;

    // Warga hanya boleh mengonfirmasi tagihan KK-nya sendiri.
    const [milik] = await db
      .select({ id: tagihan.id, nominal: tagihan.nominal, kkId: tagihan.kkId })
      .from(tagihan)
      .where(and(eq(tagihan.id, tagihanId), eq(tagihan.kkId, pemilik.kkId)))
      .limit(1);

    if (!milik) {
      return fail(403, { error: 'Tagihan bukan milik KK Anda.' });
    }

    const sudahBayar = await db
      .select({ jumlah: pembayaran.jumlah })
      .from(pembayaran)
      .where(eq(pembayaran.tagihanId, tagihanId));
    const sisa = hitungSisa(
      milik.nominal,
      sudahBayar.reduce((total, row) => total + row.jumlah, 0)
    );

    if (sisa <= 0) {
      return fail(400, { error: 'Tagihan ini sudah lunas.' });
    }

    if (jumlah > sisa) {
      return fail(400, { error: `Jumlah melebihi sisa tagihan (Rp${sisa.toLocaleString('id-ID')}).` });
    }

    const [menunggu] = await db
      .select({ id: konfirmasiBayar.id })
      .from(konfirmasiBayar)
      .where(and(eq(konfirmasiBayar.tagihanId, tagihanId), eq(konfirmasiBayar.status, 'menunggu')))
      .limit(1);

    if (menunggu) {
      return fail(400, { error: 'Sudah ada konfirmasi yang menunggu diproses bendahara.' });
    }

    await db.insert(konfirmasiBayar).values({
      tagihanId,
      jumlah,
      metodeBayar,
      catatan: catatan || null,
      status: 'menunggu',
      diajukanOleh: userId
    });

    return { sukses: 'Konfirmasi terkirim. Bendahara akan memverifikasi pembayaran Anda.' };
  },

  batalkan: async ({ request, locals }) => {
    const userId = locals.user?.id;
    if (!userId) redirect(302, '/login');

    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'Konfirmasi tidak valid.' });
    }

    // Hanya pemilik dan hanya yang masih menunggu yang boleh dibatalkan.
    await db
      .delete(konfirmasiBayar)
      .where(
        and(
          eq(konfirmasiBayar.id, id),
          eq(konfirmasiBayar.diajukanOleh, userId),
          eq(konfirmasiBayar.status, 'menunggu')
        )
      );

    return { sukses: 'Konfirmasi dibatalkan.' };
  }
};
