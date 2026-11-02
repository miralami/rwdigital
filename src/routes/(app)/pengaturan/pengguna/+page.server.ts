import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { kk, rt, warga, petugasRt, peran } from '$lib/server/db/schema';
import { asc, eq, sql } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { permissionsOf, requirePermission } from '$lib/server/rbac';
import { normalizeRole } from '$lib/server/guard';
import { PERAN_DEFAULT } from '$lib/akses';
import type { PageServerLoad, Actions } from './$types';

const POLA_SLUG = /^[a-z0-9][a-z0-9_-]*$/;

const buatAkunSchema = z.object({
  email: z.string().trim().email('Email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
  name: z.string().trim().min(1, 'Nama wajib diisi').max(100, 'Nama terlalu panjang'),
  role: z.string().regex(POLA_SLUG, 'Format role tidak valid'),
  wargaId: z.union([z.coerce.number().int().positive(), z.literal('')]).optional()
});

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
  const bisaKelola = izin.can('user', 'list');

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

  const rolesDb = await db.select({
    nama: peran.nama,
    label: peran.label,
    superadmin: peran.superadmin
  }).from(peran).orderBy(asc(peran.urutan), asc(peran.nama));

  const daftarRole = rolesDb.length > 0
    ? rolesDb.map((r) => r.nama)
    : PERAN_DEFAULT.map((p) => p.nama);

  const labelRole: Record<string, string> = rolesDb.length > 0
    ? Object.fromEntries(rolesDb.map((r) => [r.nama, r.label]))
    : Object.fromEntries(PERAN_DEFAULT.map((p) => [p.nama, p.label]));

  if (bisaKelola) {
    try {
      const hasil = await auth.api.listUsers({
        query: { limit: 200, sortBy: 'createdAt', sortDirection: 'desc' },
        headers: request.headers
      });
      daftarUser = hasil.users;
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
    bisaKelola,
    bisaTambah: izin.can('user', 'create'),
    bisaAturRole: izin.can('user', 'set-role'),
    bisaHapus: izin.can('user', 'delete'),
    daftarRole,
    labelRole
  };
};

export const actions: Actions = {
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

    // Pastikan role valid di DB atau PERAN_DEFAULT
    const [roleFound] = await db.select({ nama: peran.nama, label: peran.label })
      .from(peran)
      .where(eq(peran.nama, role))
      .limit(1);

    if (!roleFound && !PERAN_DEFAULT.some((p) => p.nama === role)) {
      return fail(400, { error: 'Role tidak dikenal di sistem.' });
    }

    const labelDisplay = roleFound?.label ?? PERAN_DEFAULT.find((p) => p.nama === role)?.label ?? role;

    let targetWarga: { id: number; nama: string; userId: string | null } | null = null;
    if (wargaId) {
      const [row] = await db
        .select({ id: warga.id, nama: warga.nama, userId: warga.userId })
        .from(warga)
        .where(eq(warga.id, wargaId))
        .limit(1);

      if (!row) {
        return fail(400, { error: 'Data warga yang dipilih tidak ditemukan.' });
      }
      if (row.userId) {
        return fail(400, { error: `${row.nama} sudah punya akun tertaut.` });
      }
      targetWarga = row;
    }

    let userId: string;
    try {
      const dibuat = await (auth.api as any).createUser({
        body: {
          email: hasil.data.email,
          password: hasil.data.password,
          name: hasil.data.name,
          role
        },
        headers: request.headers
      });
      userId = dibuat.user.id;
    } catch (err) {
      return fail(400, { error: pesanError(err, 'Gagal membuat akun pengguna.') });
    }

    if (targetWarga) {
      await db.update(warga).set({ userId }).where(eq(warga.id, targetWarga.id));
    }

    return {
      sukses: targetWarga
        ? `Akun ${hasil.data.email} dibuat dan ditautkan ke ${targetWarga.nama}.`
        : `Akun ${hasil.data.email} dibuat dengan role ${labelDisplay}.`
    };
  },

  ubahRole: async ({ request, locals }) => {
    requirePermission(locals, 'user', 'set-role');

    const formData = await request.formData();
    const userId = String(formData.get('userId') || '').trim();
    const role = String(formData.get('role') || '').trim().toLowerCase();

    if (!userId) {
      return fail(400, { error: 'User ID tidak valid.' });
    }
    if (!POLA_SLUG.test(role)) {
      return fail(400, { error: 'Format role tidak valid.' });
    }

    // Cek target akun
    const [targetUser] = await db.all<{ role: string | null }>(
      sql`SELECT role FROM user WHERE id = ${userId}`
    );
    if (!targetUser) {
      return fail(404, { error: 'Akun tidak ditemukan.' });
    }

    const currentRoles = normalizeRole(targetUser.role);
    if (currentRoles.includes('admin_rw')) {
      return fail(400, { error: 'Akun admin_rw (superadmin) dilindungi dan tidak dapat diubah rolenya.' });
    }

    if (locals.user?.id === userId) {
      return fail(400, { error: 'Tidak bisa mengubah role akun sendiri.' });
    }

    const [roleFound] = await db.select({ nama: peran.nama, label: peran.label })
      .from(peran)
      .where(eq(peran.nama, role))
      .limit(1);

    if (!roleFound && !PERAN_DEFAULT.some((p) => p.nama === role)) {
      return fail(400, { error: 'Role tidak dikenal di sistem.' });
    }

    const labelDisplay = roleFound?.label ?? PERAN_DEFAULT.find((p) => p.nama === role)?.label ?? role;

    try {
      await (auth.api as any).setRole({
        body: { userId, role },
        headers: request.headers
      });
    } catch (err) {
      return fail(400, { error: pesanError(err, 'Gagal mengubah role.') });
    }

    // Role yang bukan pengurus RT tidak boleh menyisakan penugasan RT lama.
    if (role !== 'pengurus_rt') {
      await db.delete(petugasRt).where(eq(petugasRt.userId, userId));
    }

    return {
      sukses: `Role diperbarui menjadi ${labelDisplay}.`
    };
  },

  aturRt: async ({ request, locals }) => {
    requirePermission(locals, 'user', 'update');

    const formData = await request.formData();
    const userId = String(formData.get('userId') || '').trim();
    const rtId = Number(formData.get('rtId'));

    if (!userId || !Number.isInteger(rtId) || rtId <= 0) {
      return fail(400, { error: 'Pilih RT tugas yang valid.' });
    }

    // Hanya akun pengurus_rt yang boleh punya wilayah tugas.
    const [target] = await db.all<{ role: string | null }>(
      sql`SELECT role FROM user WHERE id = ${userId}`
    );
    if (!target) {
      return fail(404, { error: 'Akun tidak ditemukan.' });
    }
    if (!normalizeRole(target.role).includes('pengurus_rt')) {
      return fail(400, { error: 'RT tugas hanya bisa diberikan ke akun pengurus RT.' });
    }

    const [rtTujuan] = await db
      .select({ id: rt.id, nomor: rt.nomor })
      .from(rt)
      .where(eq(rt.id, rtId))
      .limit(1);
    if (!rtTujuan) {
      return fail(400, { error: 'RT tidak ditemukan.' });
    }

    await db
      .insert(petugasRt)
      .values({ userId, rtId })
      .onConflictDoUpdate({
        target: petugasRt.userId,
        set: { rtId, updatedAt: new Date().toISOString() }
      });

    return { sukses: `RT tugas diperbarui ke RT ${String(rtTujuan.nomor).padStart(2, '0')}.` };
  },

  lepasRt: async ({ request, locals }) => {
    requirePermission(locals, 'user', 'update');

    const formData = await request.formData();
    const userId = String(formData.get('userId') || '').trim();

    if (!userId) {
      return fail(400, { error: 'User ID tidak valid.' });
    }

    await db.delete(petugasRt).where(eq(petugasRt.userId, userId));

    return {
      sukses: 'Penugasan RT dilepas. Akun tidak bisa melihat data RT sampai ditugaskan kembali.'
    };
  },

  tautkan: async ({ request, locals }) => {
    requirePermission(locals, 'user', 'update');

    const formData = await request.formData();
    const userId = String(formData.get('userId') || '').trim();
    const wargaId = Number(formData.get('wargaId'));

    if (!userId || !Number.isInteger(wargaId) || wargaId <= 0) {
      return fail(400, { error: 'Pilih warga yang akan ditautkan.' });
    }

    const [target] = await db
      .select({ id: warga.id, nama: warga.nama, userId: warga.userId })
      .from(warga)
      .where(eq(warga.id, wargaId))
      .limit(1);

    if (!target) {
      return fail(400, { error: 'Data warga tidak ditemukan.' });
    }
    if (target.userId && target.userId !== userId) {
      return fail(400, { error: `${target.nama} sudah tertaut ke akun lain.` });
    }

    const [sudahDipakai] = await db
      .select({ id: warga.id })
      .from(warga)
      .where(eq(warga.userId, userId))
      .limit(1);
    if (sudahDipakai && sudahDipakai.id !== wargaId) {
      return fail(400, { error: 'Akun ini sudah tertaut ke warga lain.' });
    }

    await db.update(warga).set({ userId }).where(eq(warga.id, wargaId));

    return { sukses: `Akun ditautkan ke ${target.nama}.` };
  },

  lepas: async ({ request, locals }) => {
    requirePermission(locals, 'user', 'update');

    const formData = await request.formData();
    const wargaId = Number(formData.get('wargaId'));

    if (!Number.isInteger(wargaId) || wargaId <= 0) {
      return fail(400, { error: 'Data warga tidak valid.' });
    }

    await db.update(warga).set({ userId: null }).where(eq(warga.id, wargaId));

    return { sukses: 'Tautan akun dilepas.' };
  },

  hapus: async ({ request, locals }) => {
    requirePermission(locals, 'user', 'delete');

    const formData = await request.formData();
    const userId = String(formData.get('userId') || '').trim();

    if (!userId) {
      return fail(400, { error: 'User ID tidak valid.' });
    }
    if (locals.user?.id === userId) {
      return fail(400, { error: 'Tidak bisa menghapus akun sendiri.' });
    }

    const [targetUser] = await db.all<{ role: string | null }>(
      sql`SELECT role FROM user WHERE id = ${userId}`
    );
    if (!targetUser) {
      return fail(404, { error: 'Akun tidak ditemukan.' });
    }

    const targetRoles = normalizeRole(targetUser.role);
    if (targetRoles.includes('admin_rw')) {
      return fail(400, { error: 'Akun admin_rw (superadmin) dilindungi dan tidak dapat dihapus.' });
    }

    // Lepas tautan dulu supaya data warga tidak menunjuk user yang sudah hilang.
    await db.update(warga).set({ userId: null }).where(eq(warga.userId, userId));
    await db.delete(petugasRt).where(eq(petugasRt.userId, userId));

    try {
      await auth.api.removeUser({ body: { userId }, headers: request.headers });
    } catch (err) {
      return fail(400, { error: pesanError(err, 'Gagal menghapus akun.') });
    }

    return { sukses: 'Akun pengguna dihapus.' };
  }
};
