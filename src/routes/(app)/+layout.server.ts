import type { LayoutServerLoad } from './$types';
import { enforceAccess } from '$lib/server/guard';

// Defence in depth: `hooks.server.ts` sudah menegakkan guard yang sama untuk
// seluruh request. Layer ini memastikan group `(app)` tetap tertutup walau
// handler hook nanti berubah, dan memberi pesan error yang lebih dekat dengan
// route-nya. Path-based, jadi aman baik untuk `/portal` di dalam group ini
// maupun di luar.
export const load: LayoutServerLoad = async ({ locals, url }) => {
  enforceAccess({ locals, url });
  return { user: locals.user };
};
