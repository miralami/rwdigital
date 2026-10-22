import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export interface MidtransConfig {
  serverKey: string;
  clientKey: string;
  isProduction: boolean;
  snapUrl: string;
  snapApiUrl: string;
  appUrl: string;
}

function loadFreshEnv(): Record<string, string> {
  const envObj: Record<string, string> = { ...(process.env as Record<string, string>) };
  try {
    const envPath = resolve(process.cwd(), '.env');
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        envObj[key] = val;
      }
    }
  } catch {}
  return envObj;
}

export function getMidtransConfig(): MidtransConfig {
  const env = loadFreshEnv();
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

  // If serverKey is not configured or dummy, fallback to sandbox simulation
  const isDummyKey =
    !config.serverKey ||
    config.serverKey.includes('DEMO') ||
    config.serverKey.includes('YOUR_SERVER_KEY');

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
          finish: `${config.appUrl || 'http://localhost:5173'}/kas?status=midtrans_success`
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
