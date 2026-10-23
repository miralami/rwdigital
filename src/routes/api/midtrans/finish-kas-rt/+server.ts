import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { transaksiKasRt } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { checkMidtransTransactionStatus } from '$lib/server/midtrans';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ success: false, error: 'Unauthorized: Sesi login diperlukan.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, paymentType } = body;

    if (!orderId) {
      return json({ success: false, error: 'Order ID wajib diisi.' }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(transaksiKasRt)
      .where(eq(transaksiKasRt.midtransOrderId, orderId))
      .limit(1);

    if (!existing) {
      return json({ success: false, error: 'Transaksi tidak ditemukan.' }, { status: 404 });
    }

    // Verifikasi status riil ke server Midtrans
    const checkRes = await checkMidtransTransactionStatus(orderId);
    if (!checkRes.verified) {
      return json({
        success: false,
        error: `Verifikasi Midtrans gagal: ${checkRes.error || 'Status tidak dapat diverifikasi.'}`
      }, { status: 400 });
    }

    let statusFinal = checkRes.transactionStatus || 'pending';
    if (statusFinal === 'capture') {
      statusFinal = checkRes.fraudStatus === 'challenge' ? 'challenge' : 'settlement';
    }

    const typeStr = checkRes.paymentType || paymentType || existing.midtransPaymentType || 'midtrans';
    const isLunas = statusFinal === 'settlement';
    const isBatal = statusFinal === 'cancel' || statusFinal === 'expire' || statusFinal === 'deny';

    await db
      .update(transaksiKasRt)
      .set({
        midtransStatus: statusFinal,
        midtransPaymentType: typeStr,
        bukti: isLunas
          ? `Midtrans ${typeStr.toUpperCase()} (Lunas - ${orderId})`
          : `Midtrans ${typeStr.toUpperCase()} (${statusFinal} - ${orderId})`,
        dibatalkan: isBatal
      })
      .where(eq(transaksiKasRt.midtransOrderId, orderId));

    return json({ success: true, status: statusFinal, isLunas });
  } catch (err: any) {
    console.error('[Midtrans Finish Kas RT Error]:', err);
    return json({ success: false, error: err?.message || 'Gagal menyelesaikan transaksi Midtrans' }, { status: 500 });
  }
};

