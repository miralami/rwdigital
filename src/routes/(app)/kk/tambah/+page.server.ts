import { db } from '$lib/server/db';
import { kk, rt, warga } from '$lib/server/db/schema';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { requirePermission } from '$lib/server/rbac';
import { requireRtAccess, requireScope, scopeFromRole, visibleRt } from '$lib/server/scope';
import type { PageServerLoad, Actions } from './$types';

const kkSchema = z.object({
  noKk: z.string().min(16, 'No. KK harus 16 digit').max(16, 'No. KK harus 16 digit'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  rtId: z.coerce.number().int().positive('RT wajib dipilih'),
  statusHuni: z.enum(['tetap', 'kontrak', 'kos']).default('tetap')
});

const anggotaSchema = z.object({
  nik: z.string().min(16, 'NIK harus 16 digit').max(16, 'NIK harus 16 digit'),
  nama: z.string().min(1, 'Nama wajib diisi'),
  tempatLahir: z.string().min(1, 'Tempat lahir wajib diisi'),
  tanggalLahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  jenisKelamin: z.enum(['L', 'P']),
  agama: z.string().min(1, 'Agama wajib diisi'),
  pendidikan: z.string().optional(),
  pekerjaan: z.string().optional(),
  statusPerkawinan: z.enum(['belum_kawin', 'kawin', 'cerai_hidup', 'cerai_mati']).default('belum_kawin'),
  statusHubunganKk: z.enum(['kepala_keluarga', 'istri', 'anak', 'lainnya']).default('kepala_keluarga')
});

export const load: PageServerLoad = async ({ locals }) => {
  const scope = requireScope(scopeFromRole(locals));
  const semuaRt = visibleRt(scope, await db.select().from(rt).orderBy(rt.nomor));
  return { semuaRt };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    requirePermission(locals, 'warga', 'create');
    const scope = requireScope(scopeFromRole(locals));
    const formData = await request.formData();

    // Parse KK
    const kkResult = kkSchema.safeParse({
      noKk: formData.get('noKk'),
      alamat: formData.get('alamat'),
      rtId: formData.get('rtId'),
      statusHuni: formData.get('statusHuni')
    });

    if (!kkResult.success) {
      return fail(400, { error: 'Data KK tidak valid: ' + Object.values(kkResult.error.flatten().fieldErrors).flat().join(', ') });
    }

    requireRtAccess(scope, kkResult.data.rtId);

    // Parse array of anggota from JSON or form fields
    const anggotaJson = formData.get('anggotaJson');
    let rawAnggota: any[] = [];
    if (anggotaJson && typeof anggotaJson === 'string') {
      try {
        rawAnggota = JSON.parse(anggotaJson);
      } catch {
        return fail(400, { error: 'Format data anggota tidak valid.' });
      }
    } else {
      // Fallback single warga (backward compat)
      rawAnggota = [{
        nik: formData.get('nik'),
        nama: formData.get('nama'),
        tempatLahir: formData.get('tempatLahir'),
        tanggalLahir: formData.get('tanggalLahir'),
        jenisKelamin: formData.get('jenisKelamin'),
        agama: formData.get('agama'),
        pendidikan: formData.get('pendidikan') || undefined,
        pekerjaan: formData.get('pekerjaan') || undefined,
        statusPerkawinan: formData.get('statusPerkawinan') || 'belum_kawin',
        statusHubunganKk: formData.get('statusHubunganKk') || 'kepala_keluarga'
      }];
    }

    if (rawAnggota.length === 0) {
      return fail(400, { error: 'Minimal harus ada 1 anggota keluarga (kepala keluarga).' });
    }

    const validatedAnggota: z.infer<typeof anggotaSchema>[] = [];
    for (let i = 0; i < rawAnggota.length; i++) {
      const res = anggotaSchema.safeParse(rawAnggota[i]);
      if (!res.success) {
        return fail(400, { error: `Anggota #${i + 1} tidak valid: ${Object.values(res.error.flatten().fieldErrors).flat().join(', ')}` });
      }
      validatedAnggota.push(res.data);
    }

    // Insert atomic
    try {
      const [{ insertId: newKkId }] = await db.insert(kk).values(kkResult.data);

      for (const a of validatedAnggota) {
        await db.insert(warga).values({
          ...a,
          kkId: newKkId
        });
      }
    } catch (err: any) {
      return fail(400, { error: 'Gagal menyimpan: ' + (err.message || 'Duplikasi NIK atau No. KK.') });
    }

    redirect(303, '/kk');
  }
};
