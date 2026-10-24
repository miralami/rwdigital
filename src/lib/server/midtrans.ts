import { createHash } from 'node:crypto';
import { env } from '$env/dynamic/private';

export interface MidtransConfig {
  serverKey: string;
  clientKey: string;
  isProduction: boolean;
  snapUrl: string;
  snapApiUrl: string;
  appUrl: string;
}

export function isDummyMidtransKey(key?: string): boolean {
  if (!key) return true;
  return key.includes('DEMO') || key.includes('YOUR_SERVER_KEY') || key.startsWith('SB-Mid-server-DEMO');
}

export function getMidtransConfig(): MidtransConfig {
  const serverKey = env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-DEMO-KAS-RT-KEY';
  const clientKey = env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-DEMO-KAS-RT-KEY';
  const isProduction = env.MIDTRANS_IS_PRODUCTION === 'true';
  const appUrl = env.BETTER_AUTH_URL || 'http://localhost:5173';

  const snapUrl = isProduction
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';

  const snapApiUrl = isProduction
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

  return { serverKey, clientKey, isProduction, snapUrl, snapApiUrl, appUrl };
}

export interface CreateSnapParams {
  orderId: string;
  grossAmount: number;
  customerDetails?: {
    firstName?: string;
    email?: string;
    phone?: string;
  };
  itemDetails?: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export interface SnapResponse {
  token: string;
  redirectUrl: string;
  orderId: string;
  isSimulated: boolean;
}

export async function createMidtransSnapTransaction(params: CreateSnapParams): Promise<SnapResponse> {
  const config = getMidtransConfig();
  const isDummyKey = isDummyMidtransKey(config.serverKey);

  if (!isDummyKey) {
    try {
      const authHeader = 'Basic ' + Buffer.from(config.serverKey + ':').toString('base64');
      const payload = {
        transaction_details: {
          order_id: params.orderId,
          gross_amount: Math.round(params.grossAmount)
        },
        credit_card: {
          secure: true
        },
        callbacks: {
          finish: `${config.appUrl || 'http://localhost:5173'}/kas`
        },
        customer_details: {
          first_name: params.customerDetails?.firstName || 'Warga RT',
          email: params.customerDetails?.email || 'warga@rw.id',
          phone: params.customerDetails?.phone || '08123456789'
        },
        item_details:
          params.itemDetails && params.itemDetails.length > 0
            ? params.itemDetails
            : [
                {
                  id: 'KAS-RT',
                  price: Math.round(params.grossAmount),
                  quantity: 1,
                  name: (params.itemDetails?.[0]?.name || 'Pemasukan Kas Mandiri RT').slice(0, 50)
                }
              ]
      };

      const res = await fetch(config.snapApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: authHeader
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          return {
            token: data.token,
            redirectUrl: data.redirect_url,
            orderId: params.orderId,
            isSimulated: false
          };
        }
      }

      const errText = await res.text();
      console.warn('[Midtrans] Snap API returned non-ok status:', res.status, errText);
    } catch (err) {
      console.error('[Midtrans] Error calling Snap API:', err);
    }
  }

  // Graceful fallback simulation token (allows instant testing in sandbox/dev)
  return {
    token: `SIM-SNAP-${params.orderId}`,
    redirectUrl: '#',
    orderId: params.orderId,
    isSimulated: true
  };
}

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string | number,
  signatureKey: string
): boolean {
  const config = getMidtransConfig();
  const raw = `${orderId}${statusCode}${grossAmount}${config.serverKey}`;
  const computedHash = createHash('sha512').update(raw).digest('hex');
  return computedHash === signatureKey;
}

export interface MidtransStatusResult {
  verified: boolean;
  transactionStatus?: string;
  paymentType?: string;
  fraudStatus?: string;
  grossAmount?: number;
  isSimulated?: boolean;
  error?: string;
}

export async function checkMidtransTransactionStatus(orderId: string): Promise<MidtransStatusResult> {
  const config = getMidtransConfig();
  const isDummy = isDummyMidtransKey(config.serverKey);

  // Jika simulasi (khusus demo/dev tanpa kredensial Midtrans riil)
  if (isDummy && (orderId.startsWith('SIM-') || orderId.startsWith('KAS-RT-'))) {
    return {
      verified: true,
      transactionStatus: 'settlement',
      paymentType: 'qris',
      isSimulated: true
    };
  }

  try {
    const baseUrl = config.isProduction
      ? 'https://api.midtrans.com'
      : 'https://api.sandbox.midtrans.com';
    const authHeader = 'Basic ' + Buffer.from(config.serverKey + ':').toString('base64');

    const res = await fetch(`${baseUrl}/v2/${encodeURIComponent(orderId)}/status`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: authHeader
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        verified: false,
        error: `Midtrans API HTTP ${res.status}: ${errText}`
      };
    }

    const data = await res.json();
    return {
      verified: true,
      transactionStatus: data.transaction_status,
      paymentType: data.payment_type,
      fraudStatus: data.fraud_status,
      grossAmount: Number(data.gross_amount) || 0,
      isSimulated: false
    };
  } catch (err: any) {
    return {
      verified: false,
      error: err?.message || 'Gagal menghubungi server Midtrans'
    };
  }
}

