import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { notifikasi } from '$lib/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await db
    .select()
    .from(notifikasi)
    .where(eq(notifikasi.userId, locals.user.id))
    .orderBy(desc(notifikasi.createdAt))
    .limit(20);

  const unreadCount = items.filter((n) => !n.dibaca).length;

  return json({ items, unreadCount });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json().catch(() => ({ id: null }));

  if (id) {
    await db
      .update(notifikasi)
      .set({ dibaca: true })
      .where(and(eq(notifikasi.id, Number(id)), eq(notifikasi.userId, locals.user.id)));
  } else {
    // Tandai semua dibaca
    await db
      .update(notifikasi)
      .set({ dibaca: true })
      .where(eq(notifikasi.userId, locals.user.id));
  }

  return json({ success: true });
};
