import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { transaksiKasRt, rt, kategoriKas } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { createMidtransSnapTransaction } from '$lib/server/midtrans';
import { rolesOf, STAFF_ROLES } from '$lib/server/guard';

const NOMINAL_MAKS = 1_000_000_000; // Rp1 M — batas wajar untuk kas lingkungan

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ success: false, error: 'Unauthorized: Sesi login diperlukan untuk mencatat transaksi Kas RT.' }, { status: 401 });
  }

  // Hanya pengurus yang boleh mencatat transaksi kas, bukan akun warga.
  const roles = rolesOf(locals);
  const isStaff = roles.some((role) => (STAFF_ROLES as readonly string[]).includes(role));
  if (!isStaff) {
    return json({ success: false, error: 'Forbidden: hanya pengurus/pengurus RT/bendahara yang boleh mencatat kas RT.' }, { status: 403 });
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

    const rtIdNum = Number(rtId);
    const nominalNum = Number(nominal);

    if (
      !Number.isInteger(rtIdNum) ||
      !Number.isFinite(nominalNum) ||
      nominalNum < 1 ||
      nominalNum > NOMINAL_MAKS ||
      !keterangan
    ) {
      return json({ success: false, error: 'Data transaksi RT tidak lengkap atau nominal tidak valid.' }, { status: 400 });
    }

    // Pastikan RT yang dituju benar-benar ada (mencegah ID asal-asalan / IDOR).
    const [rtRow] = await db.select({ id: rt.id }).from(rt).where(eq(rt.id, rtIdNum)).limit(1);
    if (!rtRow) {
      return json({ success: false, error: 'RT tidak ditemukan.' }, { status: 404 });
    }

    // Validasi kategori (opsional) supaya tidak gagal FK di tengah proses.
    let kategoriIdNum: number | null = null;
    if (kategoriId !== null && kategoriId !== undefined && kategoriId !== '') {
      kategoriIdNum = Number(kategoriId);
      if (!Number.isInteger(kategoriIdNum)) {
        return json({ success: false, error: 'Kategori kas tidak valid.' }, { status: 400 });
      }
      const [kategoriRow] = await db
        .select({ id: kategoriKas.id })
        .from(kategoriKas)
        .where(eq(kategoriKas.id, kategoriIdNum))
        .limit(1);
      if (!kategoriRow) {
        return json({ success: false, error: 'Kategori kas tidak ditemukan.' }, { status: 404 });
      }
    }

    const orderId = `KAS-RT-${rtIdNum}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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
          id: `RT-${rtIdNum}`,
          price: nominalNum,
          quantity: 1,
          name: `${namaKas || 'Kas RT'}: ${keterangan}`.slice(0, 50)
        }
      ]
    });

    const operator = locals.user?.name ?? locals.user?.id ?? 'Bendahara RT';
    const tgl = tanggal || new Date().toISOString().slice(0, 10);

    const [inserted] = await db
      .insert(transaksiKasRt)
      .values({
        rtId: rtIdNum,
        namaKas: String(namaKas || 'Kas Mandiri RT'),
        jenis: 'pemasukan',
        nominal: nominalNum,
        keterangan: String(keterangan),
        kategoriId: kategoriIdNum,
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
