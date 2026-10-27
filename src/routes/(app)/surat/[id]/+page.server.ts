import { db } from '$lib/server/db';
import { surat, warga, kk, rt, rw } from '$lib/server/db/schema';
import { and, count, eq, like } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { permissionsOf, requirePermission } from '$lib/server/rbac';
import { requireRtAccess, requireScope, scopeFromRole } from '$lib/server/scope';
import type { PageServerLoad, Actions } from './$types';

const BULAN_INDO = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/** Pesan error SQLite saat nomor surat bentrok dengan baris lain. */
function bentrokNomor(err: unknown): boolean {
  const pesan = err instanceof Error ? err.message : String(err);
  return /UNIQUE constraint failed: surat\.nomor_surat/i.test(pesan);
}

/**
 * Ambil surat + RT pemiliknya. Dipakai semua aksi supaya setiap perubahan
 * status tetap melewati pengecekan wilayah (`requireRtAccess`).
 */
async function suratDenganWilayah(id: number) {
  const [row] = await db
    .select({
      id: surat.id,
      status: surat.status,
      nomorSurat: surat.nomorSurat,
      tanggalTerbit: surat.tanggalTerbit,
      rtId: kk.rtId,
      rtNomor: rt.nomor,
      rwNama: rw.nama
    })
    .from(surat)
    .innerJoin(warga, eq(surat.wargaId, warga.id))
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .innerJoin(rw, eq(rt.rwId, rw.id))
    .where(eq(surat.id, id));

  return row ?? null;
}

export const load: PageServerLoad = async ({ params, locals }) => {
  const id = Number(params.id);
  const scope = requireScope(scopeFromRole(locals));
  const izin = permissionsOf(locals);

  const [detail] = await db
    .select({
      id: surat.id,
      nomorSurat: surat.nomorSurat,
      jenis: surat.jenis,
      keperluan: surat.keperluan,
      keterangan: surat.keterangan,
      dokumenSyarat: surat.dokumenSyarat,
      status: surat.status,
      catatanPengurus: surat.catatanPengurus,
      diverifikasiOleh: surat.diverifikasiOleh,
      disetujuiOleh: surat.disetujuiOleh,
      tanggalTerbit: surat.tanggalTerbit,
      diverifikasiPada: surat.diverifikasiPada,
      disetujuiPada: surat.disetujuiPada,
      ditolakPada: surat.ditolakPada,
      createdAt: surat.createdAt,
      wargaId: warga.id,
      namaWarga: warga.nama,
      nikWarga: warga.nik,
      tempatLahir: warga.tempatLahir,
      tanggalLahir: warga.tanggalLahir,
      jenisKelamin: warga.jenisKelamin,
      agama: warga.agama,
      pekerjaan: warga.pekerjaan,
      statusPerkawinan: warga.statusPerkawinan,
      noKk: kk.noKk,
      rtId: kk.rtId,
      alamatKk: kk.alamat,
      nomorRt: rt.nomor,
      namaRw: rw.nama
    })
    .from(surat)
    .innerJoin(warga, eq(surat.wargaId, warga.id))
    .innerJoin(kk, eq(warga.kkId, kk.id))
    .innerJoin(rt, eq(kk.rtId, rt.id))
    .innerJoin(rw, eq(rt.rwId, rw.id))
    .where(eq(surat.id, id));

  if (!detail) {
    redirect(302, '/surat');
  }

  requireRtAccess(scope, detail.rtId);

  return {
    detail,
    bisaProses: izin.can('surat', 'update')
  };
};

export const actions: Actions = {
  verifikasi: async ({ params, locals }) => {
    requirePermission(locals, 'surat', 'update');
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID surat tidak valid.' });
    }

    const data = await suratDenganWilayah(id);
    if (!data) return fail(404, { error: 'Surat tidak ditemukan.' });

    requireRtAccess(scopeFromRole(locals), data.rtId);

    // Idempoten: klik dua kali tidak mengubah apa pun.
    if (data.status === 'diverifikasi' || data.status === 'disetujui') {
      return { success: true };
    }
    if (data.status !== 'diajukan') {
      return fail(400, { error: 'Surat yang sudah ditolak tidak bisa diverifikasi ulang.' });
    }

    await db
      .update(surat)
      .set({
        status: 'diverifikasi',
        diverifikasiOleh: locals.user?.id ?? 'system',
        diverifikasiPada: new Date().toISOString()
      })
      .where(and(eq(surat.id, id), eq(surat.status, 'diajukan')));

    return { success: true };
  },

  setujui: async ({ params, locals }) => {
    requirePermission(locals, 'surat', 'update');
    const id = Number(params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID surat tidak valid.' });
    }

    const data = await suratDenganWilayah(id);
    if (!data) return fail(404, { error: 'Surat tidak ditemukan.' });

    requireRtAccess(scopeFromRole(locals), data.rtId);

    // Idempoten: surat yang sudah terbit tidak diberi nomor baru.
    if (data.status === 'disetujui' && data.nomorSurat) {
      return { success: true, nomorSurat: data.nomorSurat };
    }
    if (data.status !== 'diverifikasi') {
      return fail(400, {
        error:
          data.status === 'diajukan'
            ? 'Verifikasi berkas terlebih dahulu sebelum menerbitkan surat.'
            : 'Surat yang sudah ditolak tidak bisa disetujui.'
      });
    }

    const sekarang = new Date();
    const bln = BULAN_INDO[sekarang.getMonth()];
    const thn = sekarang.getFullYear();
    const tanggalTerbit = sekarang.toISOString().slice(0, 10);
    const prefixPeriode = `${thn}-${String(sekarang.getMonth() + 1).padStart(2, '0')}`;

    // Nomor urut dihitung dari surat terbit pada bulan & tahun yang sama.
    const [hitungan] = await db
      .select({ jumlah: count() })
      .from(surat)
      .where(and(eq(surat.status, 'disetujui'), like(surat.tanggalTerbit, `${prefixPeriode}%`)));
    const urutAwal = Number(hitungan?.jumlah ?? 0);

    // Nomor RW diambil dari nama (mis. "RW 01"), fallback ke id RW.
    const rwNumber = /(\d+)/.exec(data.rwNama ?? '')?.[1] ?? '1';
    const nomorRw = rwNumber.padStart(2, '0');
    const nomorRt = String(data.rtNomor).padStart(2, '0');

    // Indeks UNIQUE pada `nomor_surat` adalah pengaman terakhir. Kalau ada
    // pengajuan lain yang menyetujui di detik yang sama, urutan digeser satu
    // sampai nomor benar-benar bebas.
    for (let percobaan = 0; percobaan < 25; percobaan += 1) {
      const urut = urutAwal + 1 + percobaan;
      const nomorSurat = `${nomorRt}/${nomorRw}/${bln}/${thn}/${String(urut).padStart(5, '0')}`;

      try {
        await db
          .update(surat)
          .set({
            status: 'disetujui',
            nomorSurat,
            disetujuiOleh: locals.user?.id ?? 'system',
            disetujuiPada: sekarang.toISOString(),
            tanggalTerbit
          })
          .where(and(eq(surat.id, id), eq(surat.status, 'diverifikasi')));

        return { success: true, nomorSurat };
      } catch (err) {
        if (!bentrokNomor(err)) throw err;
      }
    }

    return fail(409, {
      error: 'Gagal menentukan nomor surat yang unik. Coba terbitkan ulang.'
    });
  },

  tolak: async ({ params, request, locals }) => {
    requirePermission(locals, 'surat', 'update');
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID surat tidak valid.' });
    }

    const data = await suratDenganWilayah(id);
    if (!data) return fail(404, { error: 'Surat tidak ditemukan.' });

    requireRtAccess(scopeFromRole(locals), data.rtId);

    if (data.status === 'disetujui' || data.status === 'ditolak') {
      return fail(400, {
        error: 'Surat yang sudah disetujui atau ditolak tidak bisa diubah lagi.'
      });
    }

    const formData = await request.formData();
    const alasan = String(formData.get('catatan') || 'Dokumen persyaratan tidak lengkap').trim();

    await db
      .update(surat)
      .set({
        status: 'ditolak',
        catatanPengurus: alasan,
        ditolakPada: new Date().toISOString(),
        // Surat yang ditolak tidak boleh membawa nomor.
        nomorSurat: null
      })
      .where(and(eq(surat.id, id), eq(surat.status, data.status)));

    return { success: true };
  }
};
