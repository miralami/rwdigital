import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { tagihan, jenisIuran, kk, warga, pembayaran, pembayaranOnline } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { createMidtransSnapTransaction, getMidtransConfig } from '$lib/server/midtrans';
import { hitungSisa } from '$lib/server/pembayaran';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ success: false, error: 'Unauthorized: Sesi login diperlukan.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const tagihanId = Number(body.tagihanId);
    const jumlahInput = body.jumlah !== undefined ? Number(body.jumlah) : undefined;

    if (!Number.isInteger(tagihanId) || tagihanId <= 0) {
      return json({ success: false, error: 'Tagihan tidak valid.' }, { status: 400 });
    }

    // Pastikan tagihan ini milik KK user yang sedang login
    const [tagihanItem] = await db
      .select({
        id: tagihan.id,
        kkId: tagihan.kkId,
        nominal: tagihan.nominal,
        status: tagihan.status,
        periode: tagihan.periode,
        namaJenis: jenisIuran.nama
      })
      .from(tagihan)
      .innerJoin(jenisIuran, eq(tagihan.jenisIuranId, jenisIuran.id))
      .where(eq(tagihan.id, tagihanId))
      .limit(1);

    if (!tagihanItem) {
      return json({ success: false, error: 'Tagihan tidak ditemukan.' }, { status: 404 });
    }

    if (tagihanItem.status === 'lunas') {
      return json({ success: false, error: 'Tagihan ini sudah lunas.' }, { status: 400 });
    }

    // Verifikasi kepemilikan tagihan oleh user
    const [pemilik] = await db
      .select({ id: warga.id, nama: warga.nama, kkId: warga.kkId })
      .from(warga)
      .where(eq(warga.userId, locals.user.id))
      .limit(1);

    if (!pemilik || pemilik.kkId !== tagihanItem.kkId) {
      return json(
        { success: false, error: 'Forbidden: Anda hanya bisa membayar tagihan keluarga Anda sendiri.' },
        { status: 403 }
      );
    }

    // Hitung sisa tagihan
    const semuaBayar = await db
      .select({ jumlah: pembayaran.jumlah })
      .from(pembayaran)
      .where(eq(pembayaran.tagihanId, tagihanId));
    const totalBayar = semuaBayar.reduce((acc, b) => acc + b.jumlah, 0);
    const sisa = hitungSisa(tagihanItem.nominal, totalBayar);

    if (sisa <= 0) {
      return json({ success: false, error: 'Tagihan ini sudah tidak memiliki sisa.' }, { status: 400 });
    }

    const bayarNominal = jumlahInput && jumlahInput > 0 ? Math.min(jumlahInput, sisa) : sisa;
    if (bayarNominal < 1000) {
      return json({ success: false, error: 'Nominal pembayaran minimal Rp1.000.' }, { status: 400 });
    }

    const orderId = `IURAN-${tagihanId}-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

    const config = getMidtransConfig();
    const snapRes = await createMidtransSnapTransaction({
      orderId,
      grossAmount: bayarNominal,
      finishUrl: `${config.appUrl}/portal/iuran`,
      customerDetails: {
        firstName: pemilik.nama.slice(0, 50),
        email: locals.user.email ?? 'warga@rw.id'
      },
      itemDetails: [
        {
          id: `TGH-${tagihanId}`,
          price: Math.round(bayarNominal),
          quantity: 1,
          name: `${tagihanItem.namaJenis} (${tagihanItem.periode})`.slice(0, 50)
        }
      ]
    });

    // Simpan ke tabel pembayaran_online
    await db.insert(pembayaranOnline).values({
      tagihanId,
      userId: locals.user.id,
      orderId,
      jumlah: bayarNominal,
      status: 'pending',
      snapToken: snapRes.token,
      snapRedirectUrl: snapRes.redirectUrl
    });

    return json({
      success: true,
      token: snapRes.token,
      redirectUrl: snapRes.redirectUrl,
      orderId,
      isSimulated: snapRes.isSimulated,
      clientKey: config.clientKey,
      snapUrl: config.snapUrl
    });
  } catch (err: any) {
    console.error('Error in charge-iuran:', err);
    return json({ success: false, error: err.message || 'Gagal membuat transaksi pembayaran.' }, { status: 500 });
  }
};
