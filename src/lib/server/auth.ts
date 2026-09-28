import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';
import { ac, roles } from '$lib/permissions';

export const auth = betterAuth({
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
