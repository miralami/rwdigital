import { db } from '$lib/server/db';
import { surat, warga, kk, rt, rw } from '$lib/server/db/schema';
import { and, count, eq, like } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { requirePermission } from '$lib/server/rbac';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);

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

  return { detail };
};

export const actions: Actions = {
  verifikasi: async ({ params, locals }) => {
    requirePermission(locals, 'surat', 'update');
    const id = Number(params.id);
    const userId = locals.user?.id ?? 'system';

    await db
      .update(surat)
      .set({
        status: 'diverifikasi',
        diverifikasiOleh: userId
      })
      .where(eq(surat.id, id));

    return { success: true };
  },

  setujui: async ({ params, locals }) => {
    requirePermission(locals, 'surat', 'update');
    const id = Number(params.id);
    const userId = locals.user?.id ?? 'system';

    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID surat tidak valid.' });
    }

    // Dapatkan detail RT/RW dari relasi warga→kk→rt→rw
    const [detail] = await db
      .select({
        rtNomor: rt.nomor,
        rwNama: rw.nama,
        statusSurat: surat.status,
        nomorSuratLama: surat.nomorSurat
      })
      .from(surat)
      .innerJoin(warga, eq(surat.wargaId, warga.id))
      .innerJoin(kk, eq(warga.kkId, kk.id))
      .innerJoin(rt, eq(kk.rtId, rt.id))
      .innerJoin(rw, eq(rt.rwId, rw.id))
      .where(eq(surat.id, id));

    if (!detail) {
      return fail(404, { error: 'Surat tidak ditemukan.' });
    }

    // Idempoten: surat yang sudah disetujui tidak diberi nomor baru.
    if (detail.statusSurat === 'disetujui' && detail.nomorSuratLama) {
      return { success: true, nomorSurat: detail.nomorSuratLama };
    }

    const sekarang = new Date();
    const bulanIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const bln = bulanIndo[sekarang.getMonth()];
    const thn = sekarang.getFullYear();
    const tanggalTerbit = sekarang.toISOString().slice(0, 10);

    // Nomor urut dihitung dari surat yang sudah terbit pada bulan & tahun yang sama,
    // supaya tidak semua surat mendapat nomor urut 00001.
    const prefixPeriode = `${thn}-${String(sekarang.getMonth() + 1).padStart(2, '0')}`;
    const [hitungan] = await db
      .select({ jumlah: count() })
      .from(surat)
      .where(and(eq(surat.status, 'disetujui'), like(surat.tanggalTerbit, `${prefixPeriode}%`)));
    const urut = Number(hitungan?.jumlah ?? 0) + 1;

    // Nomor RW diambil dari nama (mis. "RW 01"), fallback ke id RW.
    const rwNumber = /(\d+)/.exec(detail.rwNama ?? '')?.[1] ?? '1';
    const nomorRw = rwNumber.padStart(2, '0');

    const nomorSurat = `${String(detail.rtNomor).padStart(2, '0')}/${nomorRw}/${bln}/${thn}/${String(urut).padStart(5, '0')}`;

    await db
      .update(surat)
      .set({
        status: 'disetujui',
        nomorSurat: nomorSurat,
        disetujuiOleh: userId,
        tanggalTerbit
      })
      .where(eq(surat.id, id));

    return { success: true };
  },

  tolak: async ({ params, request, locals }) => {
    requirePermission(locals, 'surat', 'update');
    const id = Number(params.id);
    const formData = await request.formData();
    const alasan = String(formData.get('catatan') || 'Dokumen persyaratan tidak lengkap').trim();

    await db
      .update(surat)
      .set({
        status: 'ditolak',
        catatanPengurus: alasan
      })
      .where(eq(surat.id, id));

    return { success: true };
  }
};
