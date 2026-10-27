import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { enforceAccess, rolesOf } from '$lib/server/guard';
import { db } from '$lib/server/db';
import { petugasRt } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Populate session on every request
  const session = await auth.api.getSession({
    headers: event.request.headers
  });

  event.locals.user    = session?.user    ?? null;
  event.locals.session = session?.session ?? null;

  // Penugasan RT hanya relevan untuk pengurus_rt. Query dijalankan sekali per
  // request (bukan di setiap load) supaya semua route memakai scope yang sama.
  event.locals.petugasRtId = null;
  if (session?.user && rolesOf(event.locals).includes('pengurus_rt')) {
    const [tugas] = await db
      .select({ rtId: petugasRt.rtId })
      .from(petugasRt)
      .where(eq(petugasRt.userId, session.user.id))
      .limit(1);
    event.locals.petugasRtId = tugas?.rtId ?? null;
  }

  // Guard global. Klasifikasi rute + role yang boleh akses ada di
  // `$lib/server/guard` — dipanggil di sini, bukan di tiap route, supaya
  // `+page.svelte` atau `+page.server.ts` baru ikut terlindungi otomatis.
  // Rute publik (`/login`, `/api/auth/**`) tidak ada di daftar guard.
  //
  // `locals.user` sudah terisi di atas, jadi enforceAccess tidak memanggil
  // getSession lagi.
  enforceAccess(event);

  return svelteKitHandler({ event, resolve, auth, building });
};
