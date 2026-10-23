import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { transaksiKasRt } from '$lib/server/db/schema';
import { createMidtransSnapTransaction } from '$lib/server/midtrans';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ success: false, error: 'Unauthorized: Sesi login diperlukan untuk mencatat transaksi Kas RT.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      rtId,
      namaKas,
      nominal,
      keterangan,
      kategoriId,
      tanggal,
      donaturNama,
      donaturEmail,
      donaturPhone
    } = body;

    const nominalNum = Number(nominal);
    if (!rtId || !nominalNum || nominalNum <= 0 || !keterangan) {
      return json({ success: false, error: 'Data transaksi RT tidak lengkap atau nominal tidak valid.' }, { status: 400 });
    }

    const orderId = `KAS-RT-${rtId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const snapRes = await createMidtransSnapTransaction({
      orderId,
      grossAmount: nominalNum,
      customerDetails: {
        firstName: donaturNama || 'Warga RT',
        email: donaturEmail || 'warga@rw.id',
        phone: donaturPhone || '08123456789'
      },
      itemDetails: [
        {
          id: `RT-${rtId}`,
          price: nominalNum,
          quantity: 1,
          name: `${namaKas || 'Kas RT'}: ${keterangan}`.slice(0, 50)
        }
      ]
    });

    const operator = locals.user?.name ?? locals.user?.id ?? 'Bendahara RT / Warga';
    const tgl = tanggal || new Date().toISOString().slice(0, 10);

    const [inserted] = await db
      .insert(transaksiKasRt)
      .values({
        rtId: Number(rtId),
        namaKas: String(namaKas || 'Kas Mandiri RT'),
        jenis: 'pemasukan',
        nominal: nominalNum,
        keterangan: String(keterangan),
        kategoriId: kategoriId ? Number(kategoriId) : null,
        tanggal: tgl,
        bukti: `Midtrans Menunggu Pembayaran (${orderId})`,
        dicatatOleh: operator,
        metodePembayaran: 'midtrans',
        midtransOrderId: orderId,
        midtransStatus: 'pending',
        snapToken: snapRes.token
      })
      .returning();

    return json({
      success: true,
      orderId,
      snapToken: snapRes.token,
      redirectUrl: snapRes.redirectUrl,
      isSimulated: snapRes.isSimulated,
      transaksiId: inserted?.id
    });
  } catch (err: any) {
    console.error('[Midtrans Charge Kas RT Error]:', err);
    return json({ success: false, error: err?.message || 'Gagal memproses transaksi Midtrans' }, { status: 500 });
  }
};
