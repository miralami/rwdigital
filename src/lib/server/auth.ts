import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, BETTER_AUTH_SECRET, BETTER_AUTH_URL } from '$env/static/private';
import { ac, roles } from '$lib/permissions';

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET || 'rahasia-capstone-rwdigital-super-secret-key-12345',
  baseURL: BETTER_AUTH_URL || 'http://localhost:5173',
  database: {
    dialect: new LibsqlDialect({
      url: TURSO_DATABASE_URL,
      authToken: TURSO_AUTH_TOKEN
    }),
    type: 'sqlite'
  },
  emailAndPassword: { enabled: true },
  session: {
    expiresIn: 60 * 60, // 60 menit (target NFRA-09)
    updateAge: 15 * 60
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10
  },
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
