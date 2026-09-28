import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { env } from '$env/dynamic/private';
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';
import { ac, roles } from '$lib/permissions';

const trustedOrigins = [
  'https://2fdf-2001-448a-2002-1493-45ac-99c0-191b-7566.ngrok-free.app',
  ...(env.BETTER_AUTH_TRUSTED_ORIGINS ?? '').split(',').map((origin) => origin.trim())
].filter((origin, index, origins) => origin && origins.indexOf(origin) === index);
const forwardedHosts = trustedOrigins.map((origin) => new URL(origin).host);

export const auth = betterAuth({
  baseURL: {
    allowedHosts: ['localhost:5173', '127.0.0.1:5173', ...forwardedHosts],
    protocol: 'auto',
    fallback: 'http://localhost:5173'
  },
  trustedOrigins: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...trustedOrigins
  ],
  advanced: { trustedProxyHeaders: true },
  database: {
    dialect: new LibsqlDialect({
      url: TURSO_DATABASE_URL,
      authToken: TURSO_AUTH_TOKEN
    }),
    type: 'sqlite'
  },
  emailAndPassword: { enabled: true },
  plugins: [
    admin({
      // Role mapping for RW system
      // Roles: admin_rw | pengurus_rt | bendahara | warga
      ac,
      roles,
      defaultRole: 'warga',
      adminRoles: ['admin_rw']
    }),
    sveltekitCookies(getRequestEvent) // must be last
  ]
});

export type Auth = typeof auth;
