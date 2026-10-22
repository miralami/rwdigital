import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { transaksiKasRt } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { orderId, paymentType, transactionStatus, fraudStatus } = body;

    if (!orderId) {
      return json({ success: false, error: 'Order ID wajib diisi.' }, { status: 400 });
    }

    const typeStr = paymentType || 'qris';
    let statusFinal = 'settlement';

    if (transactionStatus === 'pending') {
      statusFinal = 'pending';
    } else if (
      transactionStatus === 'deny' ||
      transactionStatus === 'cancel' ||
      transactionStatus === 'expire'
    ) {
      statusFinal = transactionStatus;
    }

    await db
      .update(transaksiKasRt)
      .set({
        midtransStatus: statusFinal,
        midtransPaymentType: typeStr,
        bukti:
          statusFinal === 'settlement'
            ? `Midtrans ${typeStr.toUpperCase()} (Lunas - ${orderId})`
            : `Midtrans ${typeStr.toUpperCase()} (${statusFinal} - ${orderId})`,
        dibatalkan: statusFinal === 'cancel' || statusFinal === 'expire'
      })
      .where(eq(transaksiKasRt.midtransOrderId, orderId));

    return json({ success: true, status: statusFinal });
  } catch (err: any) {
    console.error('[Midtrans Finish Kas RT Error]:', err);
    return json({ success: false, error: err?.message || 'Gagal menyelesaikan transaksi Midtrans' }, { status: 500 });
  }
};
