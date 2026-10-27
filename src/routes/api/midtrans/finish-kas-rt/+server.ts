import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { transaksiKasRt } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { checkMidtransTransactionStatus } from '$lib/server/midtrans';
import { rolesOf, STAFF_ROLES } from '$lib/server/guard';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ success: false, error: 'Unauthorized: Sesi login diperlukan.' }, { status: 401 });
  }

  const roles = rolesOf(locals);
  const isStaff = roles.some((role) => (STAFF_ROLES as readonly string[]).includes(role));
  if (!isStaff) {
    return json({ success: false, error: 'Forbidden: hanya pengurus/bendahara yang boleh menyinkronkan status pembayaran.' }, { status: 403 });
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

    // Jangan percaya angka dari Midtrans tanpa dicocokkan ke nominal yang tercatat.
    if (typeof checkRes.grossAmount === 'number' && checkRes.grossAmount > 0) {
      const selisih = Math.abs(checkRes.grossAmount - Number(existing.nominal));
      if (selisih > 0.01) {
        console.warn(
          `[Midtrans] Nominal tidak cocok untuk ${orderId}: Midtrans ${checkRes.grossAmount} vs tercatat ${existing.nominal}`
        );
        return json({
          success: false,
          error: 'Nominal pembayaran Midtrans tidak sesuai dengan transaksi yang tercatat.'
        }, { status: 400 });
      }
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
      .where(eq(transaksiKasRt.id, existing.id));

    return json({ success: true, status: statusFinal, isLunas });
  } catch (err: any) {
    console.error('[Midtrans Finish Kas RT Error]:', err);
    return json({ success: false, error: err?.message || 'Gagal menyelesaikan transaksi Midtrans' }, { status: 500 });
  }
};
