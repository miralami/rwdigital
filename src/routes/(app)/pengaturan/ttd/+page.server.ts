import { db } from '$lib/server/db';
import { ttdPejabat } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { requirePermission } from '$lib/server/rbac';
import { saveUploadedFile, UploadError } from '$lib/server/storage';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user?.id;

  const [ttd] = userId
    ? await db
        .select({ url: ttdPejabat.url })
        .from(ttdPejabat)
        .where(eq(ttdPejabat.userId, userId))
        .limit(1)
    : [];

  return { ttdUrl: ttd?.url ?? null };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    // Area Pengaturan memang hanya untuk admin, tetapi aksi unggah tetap
    // menegakkan izin surat agar tidak bergantung pada guard rute saja.
    requirePermission(locals, 'surat', 'update');

    const userId = locals.user?.id;
    if (!userId) return fail(401, { error: 'Sesi tidak valid.' });

    const formData = await request.formData();
    const file = formData.get('ttd') as File | null;
    if (!file || file.size === 0) {
      return fail(400, { error: 'Pilih berkas gambar tanda tangan (PNG/JPG/WEBP).' });
    }

    let url: string | null;
    try {
      url = await saveUploadedFile(file, 'ttd');
    } catch (err) {
      return fail(400, {
        error: err instanceof UploadError ? err.message : 'Gagal mengunggah tanda tangan.'
      });
    }
    if (!url) return fail(400, { error: 'Berkas tanda tangan kosong.' });

    const [existing] = await db
      .select({ id: ttdPejabat.id })
      .from(ttdPejabat)
      .where(eq(ttdPejabat.userId, userId))
      .limit(1);

    if (existing) {
      await db
        .update(ttdPejabat)
        .set({ url, updatedAt: new Date().toISOString() })
        .where(eq(ttdPejabat.id, existing.id));
    } else {
      await db.insert(ttdPejabat).values({ userId, url });
    }

    return { sukses: 'Tanda tangan elektronik Pengurus RW berhasil disimpan.' };
  }
};
