import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

// Routes that require authentication
const PROTECTED = ['/dashboard', '/warga', '/kas', '/iuran', '/pengumuman'];

export const handle: Handle = async ({ event, resolve }) => {
  // Populate session on every request
  const session = await auth.api.getSession({
    headers: event.request.headers
  });

  event.locals.user    = session?.user    ?? null;
  event.locals.session = session?.session ?? null;

  // Global auth guard
  const isProtected = PROTECTED.some(p => event.url.pathname.startsWith(p));
  if (isProtected && !event.locals.user) {
    throw redirect(302, '/login');
  }

  return svelteKitHandler({ event, resolve, auth, building });
};
