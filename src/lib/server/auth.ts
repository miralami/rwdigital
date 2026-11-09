import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { pool } from '$lib/server/db';
import { ac, roles } from '$lib/permissions';

const trustedOrigins = [
  'https://2fdf-2001-448a-2002-1493-45ac-99c0-191b-7566.ngrok-free.app',
  ...(env.BETTER_AUTH_TRUSTED_ORIGINS ?? '').split(',').map((origin) => origin.trim())
].filter((origin, index, origins) => origin && origins.indexOf(origin) === index);
const forwardedHosts = trustedOrigins.map((origin) => new URL(origin).host);

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET || 'rahasia-capstone-rwdigital-super-secret-key-12345',
  baseURL: {
    allowedHosts: ['localhost:5173', '127.0.0.1:5173', ...forwardedHosts],
    protocol: 'auto',
    fallback: env.BETTER_AUTH_URL || 'http://localhost:5173'
  },
  trustedOrigins: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...trustedOrigins
  ],
  advanced: { trustedProxyHeaders: true },
  database: pool,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.log(`[Email Service] Password reset email sent to ${user.email}: ${url}`);
    }
  },
  session: {
    expiresIn: 60 * 60, // 60 menit (target NFRA-09)
    updateAge: 15 * 60
  },
  rateLimit: {
    // Batas produksi tetap 10 request / 60 detik. Di dev dilebihkan karena
    // HMR + DevTools menembak endpoint auth berulang kali dan sering kena
    // 429 padahal bukan percobaan brute-force.
    enabled: !dev,
    window: 60,
    max: dev ? 1000 : 10
  },
  plugins: [
    admin({
      // Admin plugin retained for superadmin user management endpoints.
      // App permissions are dynamically managed via DB `peran` table.
      ac,
      roles,
      defaultRole: 'warga',
      // Pengurus RW memegang seluruh modul termasuk pengelolaan akun, jadi ia
      // perlu diakui sebagai admin oleh plugin Better Auth. Superadmin tetap
      // disiapkan sebagai peran tertinggi saat akunnya dibuat nanti.
      adminRoles: ['superadmin', 'pengurus_rw']
    }),
    sveltekitCookies(getRequestEvent) // must be last
  ]
});

export type Auth = typeof auth;
