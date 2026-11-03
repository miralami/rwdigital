import { db } from '$lib/server/db';
import { surat, warga, rt, kk, ttdPejabat } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { permissionsOf, requirePermission } from '$lib/server/rbac';
import { requireScope, scopeFromRole } from '$lib/server/scope';
import { saveUploadedFile, UploadError } from '$lib/server/storage';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const scope = requireScope(scopeFromRole(locals));
  const izin = permissionsOf(locals);

  const semuaSurat = await db
    .select({
      id: surat.id,
      nomorSurat: surat.nomorSurat,
      jenis: surat.jenis,
      keperluan: surat.keperluan,
      status: surat.status,
      butuhTtdRt: surat.butuhTtdRt,
      butuhTtdRw: surat.butuhTtdRw,
      tanggalTerbit: surat.tanggalTerbit,
      createdAt: surat.createdAt,
      namaWarga: warga.nama,
      nikWarga: warga.nik,
      nomorRt: rt.nomor
    })
    .from(surat)
    .innerJoin(warga, eq(surat.wargaId, warga.id))
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .where(scope.kind === 'rt' ? eq(kk.rtId, scope.rtId) : undefined)
    .orderBy(desc(surat.createdAt));

  const [ttdAkun] = locals.user
    ? await db
        .select({ url: ttdPejabat.url })
        .from(ttdPejabat)
        .where(eq(ttdPejabat.userId, locals.user.id))
        .limit(1)
    : [];

  return {
    semuaSurat,
    // Kartu unggah TTD hanya untuk pengurus RT; pengurus RW mengunggahnya
    // lewat halaman Pengaturan.
    bisaUploadTtd: izin.can('surat', 'update') && scope.kind === 'rt',
    ttdUrl: ttdAkun?.url ?? null
  };
};

export const actions: Actions = {
  uploadTtd: async ({ request, locals }) => {
    requirePermission(locals, 'surat', 'update');
    const scope = requireScope(scopeFromRole(locals));
    if (scope.kind !== 'rt') {
      return fail(403, { error: 'Unggah TTD pengurus RT dilakukan dari halaman ini.' });
    }

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

    return { sukses: 'Tanda tangan elektronik berhasil disimpan.' };
  }
};
