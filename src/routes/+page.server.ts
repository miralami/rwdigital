import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { landingPathFor, LOGIN } from '$lib/server/guard';

// Redirect harus butuh role, jadi dilakukan di server. Load ini selalu melempar
// redirect: anonim → login, warga → portal, staff → dashboard.
export const load: PageServerLoad = async ({ locals }) => {
  throw redirect(302, locals.user ? landingPathFor(locals) : LOGIN);
};
