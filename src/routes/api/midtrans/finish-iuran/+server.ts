import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { pembayaranOnline, tagihan, pembayaran } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { checkMidtransTransactionStatus } from '$lib/server/midtrans';
import { catatPembayaran } from '$lib/server/pembayaran';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ success: false, error: 'Unauthorized: Sesi login diperlukan.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return json({ success: false, error: 'Order ID wajib diisi.' }, { status: 400 });
    }

    const [onlineOrder] = await db
      .select()
      .from(pembayaranOnline)
      .where(eq(pembayaranOnline.orderId, orderId))
      .limit(1);

    if (!onlineOrder) {
      return json({ success: false, error: 'Transaksi tidak ditemukan.' }, { status: 404 });
    }

    // Hanya pemilik order atau staf yang boleh sinkronisasi
    if (onlineOrder.userId !== locals.user.id && locals.tipePeran !== 'staff') {
      return json({ success: false, error: 'Forbidden.' }, { status: 403 });
    }

    const midtransData = await checkMidtransTransactionStatus(orderId);
    const transactionStatus = midtransData?.transactionStatus || 'pending';
    const fraudStatus = midtransData?.fraudStatus;
    const paymentType = midtransData?.paymentType;

    let finalStatus = 'pending';
    if (transactionStatus === 'capture') {
      finalStatus = fraudStatus === 'challenge' ? 'challenge' : 'settlement';
    } else if (transactionStatus === 'settlement') {
      finalStatus = 'settlement';
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      finalStatus = transactionStatus;
    } else if (transactionStatus === 'pending') {
      finalStatus = 'pending';
    }

    const isLunas = finalStatus === 'settlement';

    // Jika settlement dan belum pernah dicatat ke pembayaran resmi
    if (isLunas && !onlineOrder.pembayaranId) {
      await catatPembayaran({
        tagihanId: onlineOrder.tagihanId,
        jumlah: onlineOrder.jumlah,
        metodeBayar: 'qris',
        referensi: `MIDTRANS-${orderId}`,
        catatan: `Pembayaran online Midtrans (${paymentType || 'Snap'})`,
        dibayarPada: new Date().toISOString(),
        operator: onlineOrder.userId
      });

      // Ambil ID pembayaran yang baru saja dibuat
      const [lastPembayaran] = await db
        .select({ id: pembayaran.id })
        .from(pembayaran)
        .where(eq(pembayaran.referensi, `MIDTRANS-${orderId}`))
        .limit(1);

      await db
        .update(pembayaranOnline)
        .set({
          status: 'settlement',
          paymentType: paymentType || 'midtrans',
          pembayaranId: lastPembayaran?.id ?? null,
          updatedAt: new Date().toISOString()
        })
        .where(eq(pembayaranOnline.id, onlineOrder.id));
    } else {
      await db
        .update(pembayaranOnline)
        .set({
          status: finalStatus as any,
          paymentType: paymentType || onlineOrder.paymentType,
          updatedAt: new Date().toISOString()
        })
        .where(eq(pembayaranOnline.id, onlineOrder.id));
    }

    return json({
      success: true,
      orderId,
      status: finalStatus,
      isLunas,
      paymentType
    });
  } catch (err: any) {
    console.error('Error in finish-iuran:', err);
    return json({ success: false, error: err.message || 'Gagal sinkronisasi pembayaran.' }, { status: 500 });
  }
};
