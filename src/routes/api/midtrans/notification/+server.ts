import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { transaksiKasRt, pembayaranOnline, pembayaran } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyMidtransSignature } from '$lib/server/midtrans';
import { catatPembayaran } from '$lib/server/pembayaran';

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

    let finalStatus = 'pending';
    if (transaction_status === 'capture') {
      finalStatus = fraud_status === 'challenge' ? 'challenge' : 'settlement';
    } else if (transaction_status === 'settlement') {
      finalStatus = 'settlement';
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      finalStatus = transaction_status;
    } else if (transaction_status === 'pending') {
      finalStatus = 'pending';
    }

    const nominalNotifikasi = Number(gross_amount);
    if (!Number.isFinite(nominalNotifikasi)) {
      return json({ message: 'Invalid gross_amount' }, { status: 400 });
    }

    // ─── 1. Cek Order Iuran Warga (IURAN-*) ──────────────────────────────────
    if (order_id.startsWith('IURAN-')) {
      const [onlineOrder] = await db
        .select()
        .from(pembayaranOnline)
        .where(eq(pembayaranOnline.orderId, order_id))
        .limit(1);

      if (!onlineOrder) {
        console.warn('[Midtrans Webhook] Order Iuran tidak ditemukan:', order_id);
        return json({ status: 'OK', order_id, ignored: true });
      }

      if (Math.abs(nominalNotifikasi - Number(onlineOrder.jumlah)) > 0.01) {
        console.warn(
          `[Midtrans Webhook] Nominal mismatch untuk ${order_id}: Midtrans ${nominalNotifikasi} vs tercatat ${onlineOrder.jumlah}`
        );
        return json({ message: 'Amount mismatch' }, { status: 403 });
      }

      const isLunas = finalStatus === 'settlement';
      if (isLunas && !onlineOrder.pembayaranId) {
        await catatPembayaran({
          tagihanId: onlineOrder.tagihanId,
          jumlah: onlineOrder.jumlah,
          metodeBayar: 'qris',
          referensi: `MIDTRANS-${order_id}`,
          catatan: `Pembayaran online Midtrans webhook (${payment_type || 'Snap'})`,
          dibayarPada: new Date().toISOString(),
          operator: onlineOrder.userId
        });

        const [lastPembayaran] = await db
          .select({ id: pembayaran.id })
          .from(pembayaran)
          .where(eq(pembayaran.referensi, `MIDTRANS-${order_id}`))
          .limit(1);

        await db
          .update(pembayaranOnline)
          .set({
            status: 'settlement',
            paymentType: payment_type || 'midtrans',
            pembayaranId: lastPembayaran?.id ?? null,
            updatedAt: new Date().toISOString()
          })
          .where(eq(pembayaranOnline.id, onlineOrder.id));
      } else {
        await db
          .update(pembayaranOnline)
          .set({
            status: finalStatus as any,
            paymentType: payment_type || onlineOrder.paymentType,
            updatedAt: new Date().toISOString()
          })
          .where(eq(pembayaranOnline.id, onlineOrder.id));
      }

      return json({ status: 'OK', order_id, midtransStatus: finalStatus });
    }

    // ─── 2. Cek Order Kas RT (KAS-RT-*) ──────────────────────────────────────
    const [existing] = await db
      .select({ id: transaksiKasRt.id, nominal: transaksiKasRt.nominal })
      .from(transaksiKasRt)
      .where(eq(transaksiKasRt.midtransOrderId, order_id))
      .limit(1);

    if (!existing) {
      console.warn('[Midtrans Webhook] Order tidak ditemukan, diabaikan:', order_id);
      return json({ status: 'OK', order_id, ignored: true });
    }

    if (Math.abs(nominalNotifikasi - Number(existing.nominal)) > 0.01) {
      console.warn(
        `[Midtrans Webhook] Nominal tidak cocok untuk ${order_id}: Midtrans ${nominalNotifikasi} vs tercatat ${existing.nominal}`
      );
      return json({ message: 'Amount mismatch' }, { status: 403 });
    }

    await db
      .update(transaksiKasRt)
      .set({
        midtransStatus: finalStatus,
        midtransPaymentType: payment_type || 'midtrans',
        bukti: `Midtrans Webhook (${(payment_type || '').toUpperCase()} - ${order_id})`,
        dibatalkan: finalStatus === 'cancel' || finalStatus === 'expire' || finalStatus === 'deny'
      })
      .where(eq(transaksiKasRt.id, existing.id));

    return json({ status: 'OK', order_id, midtransStatus: finalStatus });
  } catch (err: any) {
    console.error('[Midtrans Webhook Error]:', err);
    return json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
