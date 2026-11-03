import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { kk, rt, warga, petugasRt, peran } from '$lib/server/db/schema';
import { asc, eq, sql } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { permissionsOf, requirePermission } from '$lib/server/rbac';
import { normalizeRole } from '$lib/server/guard';
import { LABEL_AKSI, MODUL, normalisasiIzin, PERAN_DEFAULT, type Izin } from '$lib/akses';
import type { PageServerLoad, Actions } from './$types';

const POLA_SLUG = /^[a-z0-9][a-z0-9_-]*$/;

const buatAkunSchema = z.object({
  email: z.string().trim().email('Email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
  name: z.string().trim().min(1, 'Nama wajib diisi').max(100, 'Nama terlalu panjang'),
  role: z.string().regex(POLA_SLUG, 'Format role tidak valid'),
  wargaId: z.union([z.coerce.number().int().positive(), z.literal('')]).optional()
});

const TIPE_VALID = ['staff', 'warga'] as const;
const SCOPE_VALID = ['all', 'rt', 'none'] as const;

type Tipe = (typeof TIPE_VALID)[number];
type Scope = (typeof SCOPE_VALID)[number];

function izinDariForm(formData: FormData): Izin {
  const hasil: Izin = {};
  for (const modul of MODUL) {
    const aksi = formData
      .getAll(`izin_${modul.key}`)
      .map((item) => String(item))
      .filter((item) => (modul.aksi as readonly string[]).includes(item));
    if (aksi.length > 0) hasil[modul.key] = [...new Set(aksi)];
  }
  return normalisasiIzin(hasil);
}

function metaDariForm(formData: FormData): { data?: { label: string; deskripsi: string | null; tipe: Tipe; scope: Scope }; error?: string } {
  const label = String(formData.get('label') ?? '').trim();
  const deskripsi = String(formData.get('deskripsi') ?? '').trim();
  const tipe = String(formData.get('tipe') ?? '');
  const scope = String(formData.get('scope') ?? '');

  if (!label) return { error: 'Nama tampilan peran wajib diisi.' };
  if (label.length > 60) return { error: 'Nama tampilan maksimal 60 karakter.' };
  if (deskripsi.length > 300) return { error: 'Deskripsi maksimal 300 karakter.' };
  if (!(TIPE_VALID as readonly string[]).includes(tipe as any)) {
    return { error: 'Tipe peran tidak dikenal.' };
  }
  if (!(SCOPE_VALID as readonly string[]).includes(scope as any)) {
    return { error: 'Batas data peran tidak dikenal.' };
  }

  return {
    data: {
      label,
      deskripsi: deskripsi || null,
      tipe: tipe as Tipe,
      scope: scope as Scope
    }
  };
}

function pesanError(err: unknown, fallback: string): string {
  if (err && typeof err === 'object') {
    const body = (err as { body?: { message?: string } }).body;
    if (body?.message) return body.message;
    const message = (err as { message?: string }).message;
    if (message) return message;
  }
  return fallback;
}

export const load: PageServerLoad = async ({ locals, request }) => {
  const izin = permissionsOf(locals);
  const bisaKelolaUser = izin.can('user', 'list');
  const bisaKelolaPeran = izin.can('peran', 'read');

  let daftarUser: Array<{
    id: string;
    name: string;
    email: string;
    role?: string | null;
    createdAt?: Date | string;
  }> = [];
  let errorUser: string | null = null;
  let daftarRt: Array<{ id: number; nomor: number }> = [];
  let daftarTugas: Array<{ userId: string; rtId: number; nomorRt: number }> = [];
  let daftarWarga: Array<{
    id: number;
    nama: string;
    nik: string;
    userId: string | null;
    nomorRt: number;
    noKk: string;
  }> = [];

  const rolesDb = await db.select().from(peran).orderBy(asc(peran.urutan), asc(peran.nama));

  const daftarRole = rolesDb.length > 0
    ? rolesDb.map((r) => r.nama)
    : PERAN_DEFAULT.map((p) => p.nama);

  const labelRole: Record<string, string> = rolesDb.length > 0
    ? Object.fromEntries(rolesDb.map((r) => [r.nama, r.label]))
    : Object.fromEntries(PERAN_DEFAULT.map((p) => [p.nama, p.label]));

  const hitungPenggunaPeran: Record<string, number> = {};

  if (bisaKelolaUser) {
    try {
      const hasil = await auth.api.listUsers({
        query: { limit: 200, sortBy: 'createdAt', sortDirection: 'desc' },
        headers: request.headers
      });
      daftarUser = hasil.users;
      for (const u of daftarUser) {
        const slugs = normalizeRole(u.role);
        for (const slug of slugs) {
          hitungPenggunaPeran[slug] = (hitungPenggunaPeran[slug] ?? 0) + 1;
        }
      }
    } catch (err) {
      errorUser = pesanError(err, 'Gagal memuat daftar pengguna.');
    }

    daftarRt = await db.select({ id: rt.id, nomor: rt.nomor }).from(rt).orderBy(rt.nomor);
    daftarTugas = await db
      .select({ userId: petugasRt.userId, rtId: petugasRt.rtId, nomorRt: rt.nomor })
      .from(petugasRt)
      .innerJoin(rt, eq(petugasRt.rtId, rt.id))
      .orderBy(rt.nomor);

    daftarWarga = await db
      .select({
        id: warga.id,
        nama: warga.nama,
        nik: warga.nik,
        userId: warga.userId,
        nomorRt: rt.nomor,
        noKk: kk.noKk
      })
      .from(warga)
      .innerJoin(kk, eq(warga.kkId, kk.id))
      .innerJoin(rt, eq(kk.rtId, rt.id))
      .where(eq(warga.aktif, true))
      .orderBy(warga.nama);
  }

  return {
    daftarUser,
    daftarWarga,
    daftarRt,
    daftarTugas,
    errorUser,
    bisaKelola: bisaKelolaUser,
    bisaTambah: izin.can('user', 'create'),
    bisaAturRole: izin.can('user', 'set-role'),
    bisaHapus: izin.can('user', 'delete'),
    daftarRole,
    labelRole,
    // Peran data
    bisaKelolaPeran,
    daftarPeran: rolesDb.map((item) => ({
      id: item.id,
      nama: item.nama,
      label: item.label,
      deskripsi: item.deskripsi,
      tipe: item.tipe,
      scope: item.scope,
      permissions: normalisasiIzin(item.permissions),
      sistem: item.sistem,
      superadmin: item.superadmin,
      urutan: item.urutan,
      jumlahPengguna: hitungPenggunaPeran[item.nama] ?? 0
    })),
    modulAkses: MODUL,
    labelAksi: LABEL_AKSI,
    aksesPeran: {
      create: izin.can('peran', 'create'),
      update: izin.can('peran', 'update'),
      delete: izin.can('peran', 'delete')
    }
  };
};

export const actions: Actions = {
  // ─── USER ACTIONS ───
  tambah: async ({ request, locals }) => {
    requirePermission(locals, 'user', 'create');
    const formData = await request.formData();
    const hasil = buatAkunSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name'),
      role: formData.get('role'),
      wargaId: formData.get('wargaId') ?? ''
    });

    if (!hasil.success) {
      return fail(400, { error: hasil.error.issues[0]?.message ?? 'Data akun tidak valid.' });
    }

    const wargaId = hasil.data.wargaId ? Number(hasil.data.wargaId) : null;
    const role = wargaId ? 'warga' : hasil.data.role;

    try {
      const userBaru = await auth.api.createUser({
        body: {
          email: hasil.data.email,
          password: hasil.data.password,
          name: hasil.data.name,
          role: role as any
        },
        headers: request.headers
      });

      if (wargaId && userBaru?.user?.id) {
        await db.update(warga).set({ userId: userBaru.user.id }).where(eq(warga.id, wargaId));
      }

      return { sukses: `Akun ${hasil.data.email} berhasil dibuat.` };
    } catch (err) {
      return fail(400, { error: pesanError(err, 'Gagal membuat akun.') });
    }
  },

  ubahRole: async ({ request, locals }) => {
    requirePermission(locals, 'user', 'set-role');
    const formData = await request.formData();
    const userId = String(formData.get('userId') ?? '');
    const role = String(formData.get('role') ?? '').trim();

    if (!userId || !role) {
      return fail(400, { error: 'ID pengguna dan role wajib diisi.' });
    }

    try {
      await auth.api.setRole({
        body: { userId, role: role as any },
        headers: request.headers
      });
      return { sukses: 'Role pengguna diperbarui.' };
    } catch (err) {
      return fail(400, { error: pesanError(err, 'Gagal mengubah role.') });
    }
  },

  aturRt: async ({ request, locals }) => {
    requirePermission(locals, 'user', 'set-role');
    const formData = await request.formData();
    const userId = String(formData.get('userId') ?? '');
    const rtId = Number(formData.get('rtId'));

    if (!userId || !Number.isInteger(rtId) || rtId <= 0) {
      return fail(400, { error: 'Pengguna dan RT wajib dipilih.' });
    }

    const [ada] = await db.select({ id: petugasRt.id }).from(petugasRt).where(eq(petugasRt.userId, userId));
    if (ada) {
      await db.update(petugasRt).set({ rtId }).where(eq(petugasRt.userId, userId));
    } else {
      await db.insert(petugasRt).values({ userId, rtId });
    }

    return { sukses: 'Penugasan RT disimpan.' };
  },

  lepasRt: async ({ request, locals }) => {
    requirePermission(locals, 'user', 'set-role');
    const formData = await request.formData();
    const userId = String(formData.get('userId') ?? '');

    if (!userId) {
      return fail(400, { error: 'Pengguna wajib dipilih.' });
    }

    await db.delete(petugasRt).where(eq(petugasRt.userId, userId));
    return { sukses: 'Penugasan RT dilepas.' };
  },

  tautkan: async ({ request, locals }) => {
    requirePermission(locals, 'user', 'set-role');
    const formData = await request.formData();
    const userId = String(formData.get('userId') ?? '');
    const wargaId = Number(formData.get('wargaId'));

    if (!userId || !Number.isInteger(wargaId) || wargaId <= 0) {
      return fail(400, { error: 'Pengguna dan warga wajib dipilih.' });
    }

    await db.update(warga).set({ userId: null }).where(eq(warga.userId, userId));
    await db.update(warga).set({ userId }).where(eq(warga.id, wargaId));

    try {
      await auth.api.setRole({ body: { userId, role: 'warga' }, headers: request.headers });
    } catch {}

    return { sukses: 'Akun berhasil ditautkan ke data warga.' };
  },

  lepas: async ({ request, locals }) => {
    requirePermission(locals, 'user', 'set-role');
    const formData = await request.formData();
    const wargaId = Number(formData.get('wargaId'));

    if (!Number.isInteger(wargaId) || wargaId <= 0) {
      return fail(400, { error: 'ID warga tidak valid.' });
    }

    await db.update(warga).set({ userId: null }).where(eq(warga.id, wargaId));
    return { sukses: 'Tautan akun dilepas.' };
  },

  hapus: async ({ request, locals }) => {
    requirePermission(locals, 'user', 'delete');
    const formData = await request.formData();
    const userId = String(formData.get('userId') ?? '');

    if (!userId) {
      return fail(400, { error: 'ID pengguna tidak valid.' });
    }

    try {
      await db.update(warga).set({ userId: null }).where(eq(warga.userId, userId));
      await db.delete(petugasRt).where(eq(petugasRt.userId, userId));
      await auth.api.removeUser({ body: { userId }, headers: request.headers });
      return { sukses: 'Pengguna dihapus.' };
    } catch (err) {
      return fail(400, { error: pesanError(err, 'Gagal menghapus pengguna.') });
    }
  },

  // ─── PERAN ACTIONS ───
  tambahPeran: async ({ request, locals }) => {
    requirePermission(locals, 'peran', 'create');
    const formData = await request.formData();
    const nama = String(formData.get('nama') ?? '').trim().toLowerCase();

    if (!nama || !POLA_SLUG.test(nama)) {
      return fail(400, { error: 'Slug peran tidak valid.' });
    }

    const meta = metaDariForm(formData);
    if (!meta.data) return fail(400, { error: meta.error });

    const [ada] = await db.select({ id: peran.id }).from(peran).where(eq(peran.nama, nama)).limit(1);
    if (ada) return fail(400, { error: `Peran "${nama}" sudah ada.` });

    await db.insert(peran).values({
      nama,
      label: meta.data.label,
      deskripsi: meta.data.deskripsi,
      tipe: meta.data.tipe,
      scope: meta.data.scope,
      permissions: izinDariForm(formData),
      sistem: false,
      superadmin: false
    });

    return { sukses: `Peran "${meta.data.label}" dibuat.` };
  },

  ubahPeran: async ({ request, locals }) => {
    requirePermission(locals, 'peran', 'update');
    const formData = await request.formData();
    const id = Number(formData.get('id'));

    if (!Number.isInteger(id) || id <= 0) return fail(400, { error: 'ID peran tidak valid.' });

    const [baris] = await db.select().from(peran).where(eq(peran.id, id)).limit(1);
    if (!baris) return fail(404, { error: 'Peran tidak ditemukan.' });
    if (baris.superadmin) return fail(403, { error: 'Peran superadmin tidak bisa diubah.' });

    const meta = metaDariForm(formData);
    if (!meta.data) return fail(400, { error: meta.error });

    await db.update(peran).set({
      label: meta.data.label,
      deskripsi: meta.data.deskripsi,
      tipe: meta.data.tipe,
      scope: meta.data.scope,
      permissions: izinDariForm(formData)
    }).where(eq(peran.id, id));

    return { sukses: `Peran "${meta.data.label}" diperbarui.` };
  },

  hapusPeran: async ({ request, locals }) => {
    requirePermission(locals, 'peran', 'delete');
    const formData = await request.formData();
    const id = Number(formData.get('id'));

    if (!Number.isInteger(id) || id <= 0) return fail(400, { error: 'ID peran tidak valid.' });

    const [baris] = await db.select().from(peran).where(eq(peran.id, id)).limit(1);
    if (!baris) return fail(404, { error: 'Peran tidak ditemukan.' });
    if (baris.superadmin || baris.sistem) return fail(403, { error: 'Peran bawaan sistem tidak bisa dihapus.' });

    await db.delete(peran).where(eq(peran.id, id));
    return { sukses: `Peran "${baris.label}" dihapus.` };
  }
};
