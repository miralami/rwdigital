import { db } from '$lib/server/db';
import { rt, rw, setoranRt } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { requirePermission, permissionsOf } from '$lib/server/rbac';
import { requireRtAccess, requireScope, scopeFromRole, visibleRt } from '$lib/server/scope';
import { saveUploadedFile, UploadError } from '$lib/server/storage';
import { batalkanSetoran, catatSetoran, hitungSetoranRt, sisaPorsi } from '$lib/server/setoran';
import type { PageServerLoad, Actions } from './$types';

const setorSchema = z.object({
  rtId: z.coerce.number().int().positive('RT tidak valid'),
  periode: z.string().regex(/^\d{4}-\d{2}$/, 'Periode harus format YYYY-MM'),
  tanggal: z.string().min(1, 'Tanggal setor wajib diisi'),
  catatan: z.string().trim().max(300, 'Catatan terlalu panjang').optional()
});

const batalSchema = z.object({
  id: z.coerce.number().int().positive(),
  alasan: z.string().trim().max(300, 'Alasan terlalu panjang').optional()
});

function bulanIni(): string {
  return new Date().toISOString().slice(0, 7);
}

export const load: PageServerLoad = async ({ url, locals }) => {
  requirePermission(locals, 'kas', 'read');
  const scope = requireScope(scopeFromRole(locals));

  const periode = url.searchParams.get('periode') || bulanIni();
  const [rwData] = await db.select().from(rw).limit(1);
  const rwId = rwData?.id ?? 1;

  const daftarRt = visibleRt(
    scope,
    await db.select().from(rt).where(eq(rt.rwId, rwId)).orderBy(rt.nomor)
  );

  const setoranPeriode = await db
    .select()
    .from(setoranRt)
    .where(eq(setoranRt.periode, periode))
    .orderBy(desc(setoranRt.createdAt));

  const nominalPerRt = await Promise.all(
    daftarRt.map(async (item) => {
      const ringkasan = await hitungSetoranRt(item.id, periode);
      const sudahDisetor = setoranPeriode
        .filter((s) => s.rtId === item.id && !s.dibatalkan)
        .reduce((total, s) => total + s.porsiRw, 0);
      const aktif = setoranPeriode.find((s) => s.rtId === item.id && !s.dibatalkan);

      return {
        ...item,
        ...ringkasan,
        sudahDisetor,
        sisa: sisaPorsi(ringkasan.porsiRw, sudahDisetor),
        setoranAktifId: aktif?.id ?? null
      };
    })
  );

  const nomorRt = new Map(daftarRt.map((item) => [item.id, item.nomor]));
  const riwayat = setoranPeriode.map((s) => ({
    ...s,
    nomorRt: nomorRt.get(s.rtId) ?? s.rtId
  }));

  return {
    periode,
    ringkasan: nominalPerRt,
    riwayat,
    bolehUbah: permissionsOf(locals).canUpdate('kas')
  };
};

export const actions: Actions = {
  setor: async ({ request, locals }) => {
    requirePermission(locals, 'kas', 'update');
    const scope = requireScope(scopeFromRole(locals));

    const formData = await request.formData();
    const parsed = setorSchema.safeParse({
      rtId: formData.get('rtId'),
      periode: formData.get('periode'),
      tanggal: formData.get('tanggal'),
      catatan: formData.get('catatan') || undefined
    });

    if (!parsed.success) {
      return fail(400, { error: parsed.error.issues[0]?.message ?? 'Data setoran tidak valid.' });
    }

    requireRtAccess(scope, parsed.data.rtId);

    const buktiFile = formData.get('buktiFile') as File | null;
    let buktiPath: string | null = null;
    if (buktiFile && buktiFile.size > 0) {
      try {
        buktiPath = await saveUploadedFile(buktiFile, 'kas');
      } catch (err) {
        return fail(400, {
          error: err instanceof UploadError ? err.message : 'Gagal mengunggah bukti setoran.'
        });
      }
    }

    try {
      await catatSetoran({
        rtId: parsed.data.rtId,
        periode: parsed.data.periode,
        tanggal: parsed.data.tanggal,
        catatan: parsed.data.catatan ?? null,
        bukti: buktiPath,
        operator: locals.user?.name ?? locals.user?.id ?? 'Bendahara'
      });
    } catch (err) {
      return fail(400, {
        error: err instanceof Error ? err.message : 'Setoran gagal dicatat.'
      });
    }

    redirect(303, `/iuran/setoran?periode=${parsed.data.periode}`);
  },

  batalkan: async ({ request, locals }) => {
    requirePermission(locals, 'kas', 'update');
    const scope = requireScope(scopeFromRole(locals));

    const formData = await request.formData();
    const parsed = batalSchema.safeParse({
      id: formData.get('id'),
      alasan: formData.get('alasan') || undefined
    });

    if (!parsed.success) {
      return fail(400, { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' });
    }

    const [setoran] = await db
      .select({ id: setoranRt.id, rtId: setoranRt.rtId, periode: setoranRt.periode })
      .from(setoranRt)
      .where(eq(setoranRt.id, parsed.data.id))
      .limit(1);

    if (!setoran) return fail(404, { error: 'Setoran tidak ditemukan.' });
    requireRtAccess(scope, setoran.rtId);

    try {
      await batalkanSetoran(
        parsed.data.id,
        parsed.data.alasan ?? null,
        locals.user?.name ?? locals.user?.id ?? 'Bendahara'
      );
    } catch (err) {
      return fail(400, {
        error: err instanceof Error ? err.message : 'Setoran gagal dibatalkan.'
      });
    }

    redirect(303, `/iuran/setoran?periode=${setoran.periode}`);
  }
};
