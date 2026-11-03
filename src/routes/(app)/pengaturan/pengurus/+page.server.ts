import { db } from '$lib/server/db';
import { pengurus, rt } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { permissionsOf, requirePermission } from '$lib/server/rbac';
import { saveUploadedFile, UploadError, UPLOAD_MAX_BYTES } from '$lib/server/storage';
import type { PageServerLoad, Actions } from './$types';

const pengurusSchema = z.object({
  rtId: z.union([z.coerce.number().int().positive(), z.literal('')]).optional(),
  jabatan: z.string().trim().min(1, 'Jabatan wajib diisi').max(60, 'Jabatan terlalu panjang'),
  nama: z.string().trim().min(1, 'Nama wajib diisi').max(100, 'Nama terlalu panjang'),
  urutan: z.coerce.number().int().min(0).max(999).default(0)
});

/** `rtId` kosong berarti pengurus tingkat RW. */
function normalisasiRtId(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isInteger(num) && num > 0 ? num : null;
}

export const load: PageServerLoad = async ({ locals }) => {
  const daftarPengurus = await db
    .select({
      id: pengurus.id,
      rtId: pengurus.rtId,
      jabatan: pengurus.jabatan,
      nama: pengurus.nama,
      fotoUrl: pengurus.fotoUrl,
      urutan: pengurus.urutan,
      aktif: pengurus.aktif,
      nomorRt: rt.nomor
    })
    .from(pengurus)
    .leftJoin(rt, eq(pengurus.rtId, rt.id))
    .orderBy(asc(pengurus.rtId), asc(pengurus.urutan), asc(pengurus.id));

  const daftarRt = await db.select({ id: rt.id, nomor: rt.nomor }).from(rt).orderBy(rt.nomor);
  const izin = permissionsOf(locals);

  return {
    daftarPengurus,
    daftarRt,
    bisaUbah: izin.canUpdate('pengurus'),
    bisaTambah: izin.canCreate('pengurus'),
    bisaHapus: izin.canDelete('pengurus'),
    batasFotoMb: Math.round(UPLOAD_MAX_BYTES.pengurus / (1024 * 1024))
  };
};

export const actions: Actions = {
  tambah: async ({ request, locals }) => {
    requirePermission(locals, 'pengurus', 'create');

    const formData = await request.formData();
    const hasil = pengurusSchema.safeParse({
      rtId: formData.get('rtId') ?? '',
      jabatan: formData.get('jabatan'),
      nama: formData.get('nama'),
      urutan: formData.get('urutan') ?? 0
    });

    if (!hasil.success) {
      return fail(400, { error: hasil.error.issues[0]?.message ?? 'Data pengurus tidak valid.' });
    }

    const rtId = normalisasiRtId(hasil.data.rtId);
    if (rtId !== null) {
      const [rtRow] = await db.select({ id: rt.id }).from(rt).where(eq(rt.id, rtId)).limit(1);
      if (!rtRow) {
        return fail(400, { error: 'RT yang dipilih tidak ditemukan.' });
      }
    }

    let fotoUrl: string | null = null;
    const foto = formData.get('foto');
    if (foto instanceof File && foto.size > 0) {
      try {
        fotoUrl = await saveUploadedFile(foto, 'pengurus');
      } catch (err) {
        return fail(400, {
          error: err instanceof UploadError ? err.message : 'Gagal mengunggah foto.'
        });
      }
    }

    await db.insert(pengurus).values({
      rtId,
      jabatan: hasil.data.jabatan,
      nama: hasil.data.nama,
      urutan: hasil.data.urutan,
      fotoUrl
    });

    return { sukses: `Pengurus ${hasil.data.nama} ditambahkan.` };
  },

  ubah: async ({ request, locals }) => {
    requirePermission(locals, 'pengurus', 'update');

    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID pengurus tidak valid.' });
    }

    const hasil = pengurusSchema.safeParse({
      rtId: formData.get('rtId') ?? '',
      jabatan: formData.get('jabatan'),
      nama: formData.get('nama'),
      urutan: formData.get('urutan') ?? 0
    });

    if (!hasil.success) {
      return fail(400, { error: hasil.error.issues[0]?.message ?? 'Data pengurus tidak valid.' });
    }

    const rtId = normalisasiRtId(hasil.data.rtId);
    if (rtId !== null) {
      const [rtRow] = await db.select({ id: rt.id }).from(rt).where(eq(rt.id, rtId)).limit(1);
      if (!rtRow) {
        return fail(400, { error: 'RT yang dipilih tidak ditemukan.' });
      }
    }

    const perubahan: {
      rtId: number | null;
      jabatan: string;
      nama: string;
      urutan: number;
      fotoUrl?: string;
    } = {
      rtId,
      jabatan: hasil.data.jabatan,
      nama: hasil.data.nama,
      urutan: hasil.data.urutan
    };

    const foto = formData.get('foto');
    if (foto instanceof File && foto.size > 0) {
      try {
        const uploaded = await saveUploadedFile(foto, 'pengurus');
        if (uploaded) perubahan.fotoUrl = uploaded;
      } catch (err) {
        return fail(400, {
          error: err instanceof UploadError ? err.message : 'Gagal mengunggah foto.'
        });
      }
    }

    await db.update(pengurus).set(perubahan).where(eq(pengurus.id, id));

    return { sukses: 'Data pengurus diperbarui.' };
  },

  hapus: async ({ request, locals }) => {
    requirePermission(locals, 'pengurus', 'delete');

    const formData = await request.formData();
    const id = Number(formData.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID pengurus tidak valid.' });
    }

    await db.delete(pengurus).where(eq(pengurus.id, id));

    return { sukses: 'Pengurus dihapus.' };
  }
};
