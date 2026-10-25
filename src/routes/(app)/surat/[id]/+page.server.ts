import { db } from '$lib/server/db';
import { surat, warga, kk, rt, rw } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
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
    const id = Number(params.id);
    const userId = locals.user?.id ?? 'system';

    const sekarang = new Date();
    const bulanIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const bln = bulanIndo[sekarang.getMonth()];
    const thn = sekarang.getFullYear();

    // Dapatkan detail RT/RW dari relasi warga→kk→rt→rw
    const [detail] = await db
      .select({
        rtNomor: rt.nomor,
        rwId: rw.id,
      })
      .from(surat)
      .innerJoin(warga, eq(surat.wargaId, warga.id))
      .innerJoin(kk, eq(warga.kkId, kk.id))
      .innerJoin(rt, eq(kk.rtId, rt.id))
      .innerJoin(rw, eq(rt.rwId, rw.id))
      .where(eq(surat.id, id));

    // Nomor urut mulai dari 1 (MVP: setiap disetujui di bulan/thn berbeda akan punya nomor unik
    // karena combined dengan bulan/thn; untuk menghindari duplicate bisa dicek di admin panel)
    const urut = 1;

    const bln = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][sekarang.getMonth()];
    const thn = sekarang.getFullYear();

    const nomorSurat = `${detail.rtNomor}/${String(detail.rwId).padStart(2, '0')}/${bln}/${thn}/${String(urut).padStart(5, '0')}`;

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

  tolak: async ({ params, request }) => {
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
