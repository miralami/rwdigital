import { db } from '$lib/server/db';
import { pengumuman, rw, notifikasi, warga, kk } from '$lib/server/db/schema';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { requirePermission } from '$lib/server/rbac';
import { requireScope, scopeFromRole } from '$lib/server/scope';
import { saveUploadedFile, UploadError } from '$lib/server/storage';
import { and, eq, isNotNull } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

const pengumumanSchema = z
  .object({
    judul: z.string().min(1, 'Judul wajib diisi'),
    isi: z.string().min(1, 'Isi wajib diisi'),
    kategori: z.enum(['umum', 'kegiatan', 'keuangan', 'darurat']),
    tanggalMulai: z.string().optional(),
    tanggalSelesai: z.string().optional(),
    tanggalMulaiEvent: z.string().optional(),
    tanggalSelesaiEvent: z.string().optional(),
    lokasi: z.string().optional(),
    periodeUlang: z.enum(['sekali', 'mingguan', 'bulanan', 'kustom']).default('sekali'),
    intervalHari: z.coerce.number().int().positive().optional(),
    ditampilkan: z.boolean()
  })
  .refine(
    (data) => {
      if (data.tanggalSelesaiEvent && !data.tanggalMulaiEvent) {
        return false;
      }
      return true;
    },
    {
      message: 'Tanggal mulai event wajib diisi jika tanggal selesai event diisi',
      path: ['tanggalMulaiEvent']
    }
  )
  .refine(
    (data) => {
      if (data.tanggalMulaiEvent && data.tanggalSelesaiEvent) {
        return data.tanggalSelesaiEvent >= data.tanggalMulaiEvent;
      }
      return true;
    },
    {
      message: 'Tanggal selesai event tidak boleh sebelum tanggal mulai event',
      path: ['tanggalSelesaiEvent']
    }
  );

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    requirePermission(locals, 'pengumuman', 'create');
    // Pengumuman RW berlaku global (rtId null); pengumuman Pengurus RT selalu
    // terkunci ke RT tugasnya, tidak bisa memilih RT lain.
    const scope = requireScope(scopeFromRole(locals));
    const rtId = scope.kind === 'rt' ? scope.rtId : null;
    const formData = await request.formData();

    const rawValues = {
      judul: (formData.get('judul')?.toString() ?? '').trim(),
      isi: (formData.get('isi')?.toString() ?? '').trim(),
      kategori: (formData.get('kategori')?.toString() ?? 'umum') as any,
      tanggalMulai: formData.get('tanggalMulai') ? String(formData.get('tanggalMulai')).trim() : undefined,
      tanggalSelesai: formData.get('tanggalSelesai') ? String(formData.get('tanggalSelesai')).trim() : undefined,
      tanggalMulaiEvent: formData.get('tanggalMulaiEvent') ? String(formData.get('tanggalMulaiEvent')).trim() : undefined,
      tanggalSelesaiEvent: formData.get('tanggalSelesaiEvent') ? String(formData.get('tanggalSelesaiEvent')).trim() : undefined,
      lokasi: formData.get('lokasi') ? String(formData.get('lokasi')).trim() : undefined,
      periodeUlang: (formData.get('periodeUlang')?.toString() ?? 'sekali') as any,
      intervalHari: formData.get('intervalHari') ? Number(formData.get('intervalHari')) : undefined,
      ditampilkan: formData.get('ditampilkan') === 'on'
    };

    const result = pengumumanSchema.safeParse(rawValues);

    if (!result.success) {
      return fail(400, {
        errors: result.error.flatten().fieldErrors,
        values: rawValues
      });
    }

    // Handle Uploads
    let thumbnailUrl: string | null = null;
    const thumbnailFile = formData.get('thumbnail') as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) {
      try {
        thumbnailUrl = await saveUploadedFile(thumbnailFile, 'pengumuman');
      } catch (err) {
        if (err instanceof UploadError) {
          return fail(400, { errors: { thumbnail: [err.message] }, values: rawValues });
        }
        throw err;
      }
    }

    const lampiranUrls: string[] = [];
    const lampiranFiles = formData.getAll('lampiran') as File[];
    for (const f of lampiranFiles) {
      if (f && f.size > 0) {
        try {
          const url = await saveUploadedFile(f, 'pengumuman');
          if (url) lampiranUrls.push(url);
        } catch (err) {
          if (err instanceof UploadError) {
            return fail(400, { errors: { lampiran: [err.message] }, values: rawValues });
          }
          throw err;
        }
      }
    }

    const [rwData] = await db.select().from(rw).limit(1);

    await db.insert(pengumuman).values({
      judul: result.data.judul,
      isi: result.data.isi,
      kategori: result.data.kategori,
      tanggalMulai: result.data.tanggalMulai ?? null,
      tanggalSelesai: result.data.tanggalSelesai ?? null,
      tanggalMulaiEvent: result.data.tanggalMulaiEvent ?? null,
      tanggalSelesaiEvent: result.data.tanggalSelesaiEvent ?? null,
      lokasi: result.data.lokasi ?? null,
      periodeUlang: result.data.periodeUlang,
      intervalHari: result.data.intervalHari ?? null,
      thumbnailUrl,
      lampiranUrls: lampiranUrls.length > 0 ? JSON.stringify(lampiranUrls) : null,
      ditampilkan: result.data.ditampilkan,
      rwId: rwData?.id ?? 1,
      rtId,
      dibuatOleh: locals.user?.name ?? locals.user?.id ?? 'Pengurus'
    });

    // Broadcast in-app & push notification to linked warga — hanya warga di RT
    // yang bersangkutan kalau pengumuman ini milik satu RT.
    if (result.data.ditampilkan) {
      const usersWarga = rtId
        ? await db
            .select({ userId: warga.userId })
            .from(warga)
            .innerJoin(kk, eq(warga.kkId, kk.id))
            .where(and(eq(kk.rtId, rtId), isNotNull(warga.userId)))
        : await db
            .select({ userId: warga.userId })
            .from(warga)
            .where(isNotNull(warga.userId));

      const notifRows = usersWarga
        .filter((w) => w.userId)
        .map((w) => ({
          userId: w.userId!,
          judul: `Pengumuman: ${result.data.judul}`,
          pesan: result.data.isi.slice(0, 140),
          tipe: result.data.kategori === 'darurat' ? ('bahaya' as const) : ('info' as const),
          tautan: '/portal#pengumuman',
          channel: 'in_app' as const
        }));

      if (notifRows.length > 0) {
        await db.insert(notifikasi).values(notifRows);
      }
    }

    redirect(303, '/pengumuman');
  }
};
