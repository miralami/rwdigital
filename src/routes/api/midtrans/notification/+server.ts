import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { transaksiKasRt } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyMidtransSignature } from '$lib/server/midtrans';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const notification = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type
    } = notification;

    if (!order_id) {
      return json({ message: 'Order ID missing' }, { status: 400 });
    }

    // Verify signature
    const isValid = verifyMidtransSignature(order_id, status_code, gross_amount, signature_key);
    if (!isValid) {
      console.warn('[Midtrans Webhook] Invalid signature key for order:', order_id);
      return json({ message: 'Invalid signature' }, { status: 403 });
    }

    const [existing] = await db
      .select({ id: transaksiKasRt.id, nominal: transaksiKasRt.nominal })
      .from(transaksiKasRt)
      .where(eq(transaksiKasRt.midtransOrderId, order_id))
      .limit(1);

    // Order tidak dikenal: balas 200 supaya Midtrans berhenti mengirim ulang,
    // tapi jangan menyentuh database.
    if (!existing) {
      console.warn('[Midtrans Webhook] Order tidak ditemukan, diabaikan:', order_id);
      return json({ status: 'OK', order_id, ignored: true });
    }

    // Nominal notifikasi wajib sama dengan nominal yang tercatat.
    const nominalNotifikasi = Number(gross_amount);
    if (!Number.isFinite(nominalNotifikasi)) {
      return json({ message: 'Invalid gross_amount' }, { status: 400 });
    }
    if (Math.abs(nominalNotifikasi - Number(existing.nominal)) > 0.01) {
      console.warn(
        `[Midtrans Webhook] Nominal tidak cocok untuk ${order_id}: Midtrans ${nominalNotifikasi} vs tercatat ${existing.nominal}`
      );
      return json({ message: 'Amount mismatch' }, { status: 403 });
    }

    let midtransStatus = 'pending';
    if (transaction_status === 'capture') {
      midtransStatus = fraud_status === 'challenge' ? 'challenge' : 'settlement';
    } else if (transaction_status === 'settlement') {
      midtransStatus = 'settlement';
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      midtransStatus = transaction_status;
    } else if (transaction_status === 'pending') {
      midtransStatus = 'pending';
    }

    await db
      .update(transaksiKasRt)
      .set({
        midtransStatus,
        midtransPaymentType: payment_type || 'midtrans',
        bukti: `Midtrans Webhook (${(payment_type || '').toUpperCase()} - ${order_id})`,
        dibatalkan: midtransStatus === 'cancel' || midtransStatus === 'expire' || midtransStatus === 'deny'
      })
      .where(eq(transaksiKasRt.id, existing.id));

    return json({ status: 'OK', order_id, midtransStatus });
  } catch (err: any) {
    console.error('[Midtrans Webhook Error]:', err);
    return json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
