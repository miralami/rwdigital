import { db } from '$lib/server/db';
import { galeri, pengaturanLanding } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { permissionsOf, requirePermission } from '$lib/server/rbac';
import { saveUploadedFile, UploadError, UPLOAD_MAX_BYTES } from '$lib/server/storage';
import type { PageServerLoad, Actions } from './$types';

/**
 * Latar hero hanya boleh warna hex atau berkas yang kita simpan sendiri.
 * Ini mencegah nilai arbitrer masuk ke `style="background-image:url(...)"`
 * (CSS injection) lewat form.
 */
const heroBackgroundSchema = z
  .string()
  .trim()
  .max(300, 'Nilai latar terlalu panjang')
  .refine(
    (v) => v === '' || /^#[0-9a-fA-F]{3,8}$/.test(v) || /^\/uploads\/landing\/[\w.-]+$/.test(v),
    'Gunakan warna hex (#0f172a) atau unggah gambar.'
  );

const pengaturanSchema = z.object({
  heroJudul: z.string().trim().max(120, 'Judul terlalu panjang').optional().default(''),
  heroSubjudul: z.string().trim().max(400, 'Subjudul terlalu panjang').optional().default(''),
  heroBackground: heroBackgroundSchema.optional().default(''),
  sambutan: z.string().trim().max(1200, 'Sambutan terlalu panjang').optional().default(''),
  namaKetua: z.string().trim().max(100, 'Nama terlalu panjang').optional().default(''),
  visi: z.string().trim().max(1200, 'Visi terlalu panjang').optional().default(''),
  misi: z.string().trim().max(2000, 'Misi terlalu panjang').optional().default(''),
  sejarah: z.string().trim().max(3000, 'Sejarah terlalu panjang').optional().default(''),
  alamat: z.string().trim().max(300, 'Alamat terlalu panjang').optional().default(''),
  telepon: z.string().trim().max(40, 'Telepon terlalu panjang').optional().default(''),
  email: z.union([z.literal(''), z.email('Format email tidak valid')]).optional().default('')
});

const galeriSchema = z.object({
  judul: z.string().trim().min(1, 'Judul foto wajib diisi').max(120, 'Judul terlalu panjang'),
  keterangan: z.string().trim().max(300, 'Keterangan terlalu panjang').optional().default(''),
  urutan: z.coerce.number().int().min(0).max(999).default(0)
});

export const load: PageServerLoad = async ({ locals }) => {
  const [pengaturan] = await db
    .select()
    .from(pengaturanLanding)
    .where(eq(pengaturanLanding.id, 1))
    .limit(1);

  const daftarGaleri = await db
    .select()
    .from(galeri)
    .orderBy(asc(galeri.urutan), asc(galeri.id));

  const izin = permissionsOf(locals);

  return {
    pengaturan: pengaturan ?? null,
    daftarGaleri,
    bisaUbah: izin.canUpdate('landing'),
    bisaTambah: izin.canCreate('landing'),
    bisaHapus: izin.canDelete('landing'),
    batasFotoMb: Math.round(UPLOAD_MAX_BYTES.landing / (1024 * 1024))
  };
};

export const actions: Actions = {
  simpan: async ({ request, locals }) => {
    requirePermission(locals, 'landing', 'update');

    const formData = await request.formData();
    const hasil = pengaturanSchema.safeParse({
      heroJudul: formData.get('heroJudul'),
      heroSubjudul: formData.get('heroSubjudul'),
      heroBackground: formData.get('heroBackground'),
      sambutan: formData.get('sambutan'),
      namaKetua: formData.get('namaKetua'),
      visi: formData.get('visi'),
      misi: formData.get('misi'),
      sejarah: formData.get('sejarah'),
      alamat: formData.get('alamat'),
      telepon: formData.get('telepon'),
      email: formData.get('email')
    });

    if (!hasil.success) {
      return fail(400, { error: hasil.error.issues[0]?.message ?? 'Data landing tidak valid.' });
    }

    const nilai: Record<string, string | null> = {
      heroJudul: hasil.data.heroJudul || null,
      heroSubjudul: hasil.data.heroSubjudul || null,
      heroBackground: hasil.data.heroBackground || null,
      sambutan: hasil.data.sambutan || null,
      namaKetua: hasil.data.namaKetua || null,
      visi: hasil.data.visi || null,
      misi: hasil.data.misi || null,
      sejarah: hasil.data.sejarah || null,
      alamat: hasil.data.alamat || null,
      telepon: hasil.data.telepon || null,
      email: hasil.data.email || null
    };

    // Gambar latar (opsional) menimpa nilai warna/URL manual.
    const heroFile = formData.get('heroFile');
    if (heroFile instanceof File && heroFile.size > 0) {
      try {
        const uploaded = await saveUploadedFile(heroFile, 'landing');
        if (uploaded) nilai.heroBackground = uploaded;
      } catch (err) {
        return fail(400, {
          error: err instanceof UploadError ? err.message : 'Gagal mengunggah gambar latar.'
        });
      }
    }

    const fotoKetua = formData.get('fotoKetua');
    if (fotoKetua instanceof File && fotoKetua.size > 0) {
      try {
        const uploaded = await saveUploadedFile(fotoKetua, 'landing');
        if (uploaded) nilai.fotoKetua = uploaded;
      } catch (err) {
        return fail(400, {
          error: err instanceof UploadError ? err.message : 'Gagal mengunggah foto ketua.'
        });
      }
    }

    await db
      .insert(pengaturanLanding)
      .values({ id: 1, ...nilai })
      .onConflictDoUpdate({
        target: pengaturanLanding.id,
        set: { ...nilai, updatedAt: new Date().toISOString() }
      });

    return { sukses: 'Pengaturan landing disimpan.' };
  },

  hapusLatar: async ({ locals }) => {
    requirePermission(locals, 'landing', 'update');

    await db
      .update(pengaturanLanding)
      .set({ heroBackground: null, updatedAt: new Date().toISOString() })
      .where(eq(pengaturanLanding.id, 1));

    return { sukses: 'Gambar latar dihapus; hero kembali memakai warna bawaan.' };
  },

  tambahGaleri: async ({ request, locals }) => {
    requirePermission(locals, 'landing', 'create');

    const formData = await request.formData();
    const hasil = galeriSchema.safeParse({
      judul: formData.get('judul'),
      keterangan: formData.get('keterangan') ?? '',
      urutan: formData.get('urutan') ?? 0
    });

    if (!hasil.success) {
      return fail(400, { error: hasil.error.issues[0]?.message ?? 'Data galeri tidak valid.' });
    }

    let fotoUrl: string | null = null;
    const berkasFoto = formData.get('foto');
    try {
      fotoUrl = berkasFoto instanceof File ? await saveUploadedFile(berkasFoto, 'landing') : null;
    } catch (err) {
      return fail(400, {
        error: err instanceof UploadError ? err.message : 'Gagal mengunggah foto.'
      });
    }

    if (!fotoUrl) {
      return fail(400, { error: 'Foto galeri wajib diunggah.' });
    }

    await db.insert(galeri).values({
      judul: hasil.data.judul,
      keterangan: hasil.data.keterangan || null,
      urutan: hasil.data.urutan,
      fotoUrl
    });

    return { sukses: `Foto "${hasil.data.judul}" ditambahkan ke galeri.` };
  },

  ubahGaleri: async ({ request, locals }) => {
    requirePermission(locals, 'landing', 'update');

    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID foto tidak valid.' });
    }

    const hasil = galeriSchema.safeParse({
      judul: formData.get('judul'),
      keterangan: formData.get('keterangan') ?? '',
      urutan: formData.get('urutan') ?? 0
    });

    if (!hasil.success) {
      return fail(400, { error: hasil.error.issues[0]?.message ?? 'Data galeri tidak valid.' });
    }

    const perubahan: {
      judul: string;
      keterangan: string | null;
      urutan: number;
      fotoUrl?: string;
      updatedAt: string;
    } = {
      judul: hasil.data.judul,
      keterangan: hasil.data.keterangan || null,
      urutan: hasil.data.urutan,
      updatedAt: new Date().toISOString()
    };

    const foto = formData.get('foto');
    if (foto instanceof File && foto.size > 0) {
      try {
        const uploaded = await saveUploadedFile(foto, 'landing');
        if (uploaded) perubahan.fotoUrl = uploaded;
      } catch (err) {
        return fail(400, {
          error: err instanceof UploadError ? err.message : 'Gagal mengunggah foto.'
        });
      }
    }

    await db.update(galeri).set(perubahan).where(eq(galeri.id, id));

    return { sukses: 'Foto galeri diperbarui.' };
  },

  toggleGaleri: async ({ request, locals }) => {
    requirePermission(locals, 'landing', 'update');

    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID foto tidak valid.' });
    }

    const [row] = await db.select({ aktif: galeri.aktif }).from(galeri).where(eq(galeri.id, id)).limit(1);
    if (!row) {
      return fail(404, { error: 'Foto tidak ditemukan.' });
    }

    await db
      .update(galeri)
      .set({ aktif: !row.aktif, updatedAt: new Date().toISOString() })
      .where(eq(galeri.id, id));

    return { sukses: row.aktif ? 'Foto disembunyikan dari landing.' : 'Foto ditampilkan di landing.' };
  },

  hapusGaleri: async ({ request, locals }) => {
    requirePermission(locals, 'landing', 'delete');

    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID foto tidak valid.' });
    }

    await db.delete(galeri).where(eq(galeri.id, id));

    return { sukses: 'Foto dihapus dari galeri.' };
  }
};
