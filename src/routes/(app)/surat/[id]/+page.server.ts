import { db } from '$lib/server/db';
import {
  surat,
  warga,
  kk,
  rt,
  rw,
  pengurus,
  ttdPejabat,
  notifikasi
} from '$lib/server/db/schema';
import { and, count, eq, isNull, like } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { permissionsOf, requirePermission } from '$lib/server/rbac';
import { requireRtAccess, requireScope, scopeFromRole } from '$lib/server/scope';
import {
  bolehMenandatangani,
  bolehMenolak,
  dimintaTtd,
  pihakTtdDariScope,
  sudahTtd,
  type PihakTtd
} from '$lib/server/surat-ttd';
import type { PageServerLoad, Actions } from './$types';

const BULAN_INDO = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

type Pihak = PihakTtd;

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
      butuhTtdRt: surat.butuhTtdRt,
      butuhTtdRw: surat.butuhTtdRw,
      ttdRtPada: surat.ttdRtPada,
      ttdRwPada: surat.ttdRwPada,
      diverifikasiOleh: surat.diverifikasiOleh,
      wargaUserId: warga.userId,
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

/**
 * Identitas penanda tangan diambil dari data `pengurus`, bukan dari nama akun
 * login. Gambar TTD berasal dari akun yang menekan tombol; URL-nya disalin ke
 * surat sebagai snapshot supaya dokumen lama tidak berubah saat TTD diganti.
 */
async function identitasPenandaTangan(pihak: Pihak, rtId: number, locals: App.Locals) {
  const userId = locals.user?.id ?? 'system';
  const [ttd] = await db
    .select({ url: ttdPejabat.url })
    .from(ttdPejabat)
    .where(eq(ttdPejabat.userId, userId))
    .limit(1);

  if (pihak === 'rt') {
    const [ketua] = await db
      .select({ nama: pengurus.nama, jabatan: pengurus.jabatan })
      .from(pengurus)
      .where(
        and(
          eq(pengurus.rtId, rtId),
          eq(pengurus.aktif, true),
          like(pengurus.jabatan, 'Ketua RT%')
        )
      )
      .orderBy(pengurus.urutan)
      .limit(1);

    const [fallback] =
      ketua?.nama
        ? [ketua]
        : await db
            .select({ nama: pengurus.nama, jabatan: pengurus.jabatan })
            .from(pengurus)
            .where(and(eq(pengurus.rtId, rtId), eq(pengurus.aktif, true)))
            .orderBy(pengurus.urutan)
            .limit(1);

    return {
      nama: fallback?.nama ?? locals.user?.name ?? 'Ketua RT',
      jabatan: fallback?.jabatan ?? `Ketua RT ${String(rtId).padStart(2, '0')}`,
      url: ttd?.url ?? null
    };
  }

  const [ketuaRw] = await db
    .select({ nama: pengurus.nama, jabatan: pengurus.jabatan })
    .from(pengurus)
    .where(
      and(
        isNull(pengurus.rtId),
        eq(pengurus.aktif, true),
        like(pengurus.jabatan, 'Ketua RW%')
      )
    )
    .orderBy(pengurus.urutan)
    .limit(1);

  return {
    nama: ketuaRw?.nama ?? locals.user?.name ?? 'Ketua RW',
    jabatan: ketuaRw?.jabatan ?? 'Ketua RW',
    url: ttd?.url ?? null
  };
}

/** Notifikasi in-app untuk pemohon setiap kali status surat berubah. */
async function kirimNotifikasi(
  userId: string | null | undefined,
  judul: string,
  pesan: string,
  tipe: 'info' | 'sukses' | 'bahaya' = 'info'
) {
  if (!userId) return;
  await db.insert(notifikasi).values({
    userId,
    judul,
    pesan,
    tipe,
    tautan: '/portal#surat',
    channel: 'in_app'
  });
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
      butuhTtdRt: surat.butuhTtdRt,
      butuhTtdRw: surat.butuhTtdRw,
      ttdRtUrl: surat.ttdRtUrl,
      ttdRtPada: surat.ttdRtPada,
      ttdRtNama: surat.ttdRtNama,
      ttdRtJabatan: surat.ttdRtJabatan,
      ttdRwUrl: surat.ttdRwUrl,
      ttdRwPada: surat.ttdRwPada,
      ttdRwNama: surat.ttdRwNama,
      ttdRwJabatan: surat.ttdRwJabatan,
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

  const pihak = pihakTtdDariScope(scope);
  const bisa = izin.can('surat', 'update');
  // Aturan TTD dipusatkan di surat-ttd.ts: hanya pihak yang diminta yang
  // mendapat tombol. Pengurus RW tetap bisa membaca surat tanpa TTD RW.
  const bisaTtd = bisa && bolehMenandatangani(pihak, detail);
  const bisaTolak = bisa && bolehMenolak(pihak, detail);

  const [ttdAkun] = locals.user
    ? await db
        .select({ url: ttdPejabat.url })
        .from(ttdPejabat)
        .where(eq(ttdPejabat.userId, locals.user.id))
        .limit(1)
    : [];

  return {
    detail,
    pihak,
    bisaTtd,
    bisaTolak,
    bisaCetak: detail.status === 'terbit',
    punyaTtd: Boolean(ttdAkun?.url)
  };
};

export const actions: Actions = {
  tandatangani: async ({ params, locals }) => {
    requirePermission(locals, 'surat', 'update');
    const scope = requireScope(scopeFromRole(locals));
    const pihak = pihakTtdDariScope(scope);
    if (!pihak) return fail(403, { error: 'Akun ini tidak berhak menandatangani surat.' });

    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID surat tidak valid.' });
    }

    const data = await suratDenganWilayah(id);
    if (!data) return fail(404, { error: 'Surat tidak ditemukan.' });

    requireRtAccess(scope, data.rtId);

    // Idempoten: surat yang sudah terbit tidak diproses ulang.
    if (data.status === 'terbit') return { success: true, nomorSurat: data.nomorSurat };
    if (data.status === 'ditolak') {
      return fail(400, { error: 'Surat yang sudah ditolak tidak bisa ditandatangani.' });
    }

    // Hanya pihak yang dicentang warga yang boleh menandatangani. Pengurus
    // RW tetap dapat membaca surat yang tidak meminta TTD RW, tetapi aksi
    // ini harus ditolak di server, bukan hanya disembunyikan di UI.
    if (!dimintaTtd(pihak, data)) {
      return fail(403, {
        error:
          pihak === 'rt'
            ? 'Surat ini tidak meminta tanda tangan RT.'
            : 'Surat ini tidak meminta tanda tangan RW.'
      });
    }
    if (sudahTtd(pihak, data)) return { success: true };

    const identitas = await identitasPenandaTangan(pihak, data.rtId, locals);
    const sekarang = new Date();
<<<<<<< HEAD
    const bulanIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const bln = bulanIndo[sekarang.getMonth()];
    const thn = sekarang.getFullYear();

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
=======
    const waktu = sekarang.toISOString();
    const userId = locals.user?.id ?? 'system';

    const rtSelesai = data.butuhTtdRt ? (pihak === 'rt' ? true : Boolean(data.ttdRtPada)) : true;
    const rwSelesai = data.butuhTtdRw ? (pihak === 'rw' ? true : Boolean(data.ttdRwPada)) : true;
    const lengkap = rtSelesai && rwSelesai;
>>>>>>> newest

    const tandaTangan =
      pihak === 'rt'
        ? {
            ttdRtUrl: identitas.url,
            ttdRtOleh: userId,
            ttdRtPada: waktu,
            ttdRtNama: identitas.nama,
            ttdRtJabatan: identitas.jabatan
          }
        : {
            ttdRwUrl: identitas.url,
            ttdRwOleh: userId,
            ttdRwPada: waktu,
            ttdRwNama: identitas.nama,
            ttdRwJabatan: identitas.jabatan
          };

    const dasar = {
      ...tandaTangan,
      // Verifikasi pertama dicatat sebagai jejak; TTD tetap bisa berjalan
      // paralel, jadi pihak kedua tidak menimpa jejak ini.
      diverifikasiOleh: data.diverifikasiOleh ?? userId,
      diverifikasiPada: data.diverifikasiOleh ? undefined : waktu
    };

    if (!lengkap) {
      await db
        .update(surat)
        .set({ ...dasar, status: 'menunggu_ttd' })
        .where(eq(surat.id, id));

      await kirimNotifikasi(
        data.wargaUserId,
        'Surat sedang ditandatangani',
        `Surat Anda sudah ditandatangani oleh ${identitas.jabatan} dan menunggu pihak lain.`,
        'info'
      );

      return { success: true, status: 'menunggu_ttd' };
    }

    // Semua TTD yang diminta lengkap → nomor baru terbit di langkah ini.
    const bln = BULAN_INDO[sekarang.getMonth()];
    const thn = sekarang.getFullYear();
    const tanggalTerbit = waktu.slice(0, 10);
    const prefixPeriode = `${thn}-${String(sekarang.getMonth() + 1).padStart(2, '0')}`;

    const [hitungan] = await db
      .select({ jumlah: count() })
      .from(surat)
      .where(and(eq(surat.status, 'terbit'), like(surat.tanggalTerbit, `${prefixPeriode}%`)));
    const urutAwal = Number(hitungan?.jumlah ?? 0);

    const rwNumber = /(\d+)/.exec(data.rwNama ?? '')?.[1] ?? '1';
    const nomorRw = rwNumber.padStart(2, '0');
    const nomorRt = String(data.rtNomor).padStart(2, '0');

    for (let percobaan = 0; percobaan < 25; percobaan += 1) {
      const urut = urutAwal + 1 + percobaan;
      const nomorSurat = `${nomorRt}/${nomorRw}/${bln}/${thn}/${String(urut).padStart(5, '0')}`;

      try {
        await db
          .update(surat)
          .set({
            ...dasar,
            status: 'terbit',
            nomorSurat,
            disetujuiOleh: userId,
            disetujuiPada: waktu,
            tanggalTerbit
          })
          .where(eq(surat.id, id));

        await kirimNotifikasi(
          data.wargaUserId,
          'Surat telah terbit',
          `Surat Anda sudah lengkap ditandatangani. Nomor: ${nomorSurat}.`,
          'sukses'
        );

        return { success: true, nomorSurat, status: 'terbit' };
      } catch (err) {
        if (!bentrokNomor(err)) throw err;
      }
    }

    return fail(409, {
      error: 'Gagal menentukan nomor surat yang unik. Coba tandatangani ulang.'
    });
  },

  tolak: async ({ params, request, locals }) => {
    requirePermission(locals, 'surat', 'update');
    const scope = requireScope(scopeFromRole(locals));
    const pihak = pihakTtdDariScope(scope);
    if (!pihak) return fail(403, { error: 'Akun ini tidak berhak menolak surat.' });

    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return fail(400, { error: 'ID surat tidak valid.' });
    }

    const data = await suratDenganWilayah(id);
    if (!data) return fail(404, { error: 'Surat tidak ditemukan.' });

    requireRtAccess(scope, data.rtId);

    if (data.status === 'terbit' || data.status === 'ditolak') {
      return fail(400, {
        error: 'Surat yang sudah terbit atau ditolak tidak bisa diubah lagi.'
      });
    }

    // Hanya pihak yang diminta menandatangani yang berhak menolak. Pengurus
    // RW tetap bisa melihat surat yang tidak meminta TTD RW, tetapi tidak
    // bisa menolaknya.
    if (!dimintaTtd(pihak, data)) {
      return fail(403, {
        error:
          pihak === 'rt'
            ? 'Surat ini tidak meminta tanda tangan RT.'
            : 'Surat ini tidak meminta tanda tangan RW.'
      });
    }

    const formData = await request.formData();
    const alasan = String(formData.get('catatan') || 'Dokumen persyaratan tidak lengkap').trim();
    const userId = locals.user?.id ?? 'system';

    await db
      .update(surat)
      .set({
        status: 'ditolak',
        catatanPengurus: alasan,
        ditolakPada: new Date().toISOString(),
        ditolakOleh: userId,
        // Surat yang ditolak tidak boleh membawa nomor.
        nomorSurat: null
      })
      .where(eq(surat.id, id));

    await kirimNotifikasi(
      data.wargaUserId,
      'Pengajuan surat ditolak',
      `Surat Anda ditolak. Alasan: ${alasan}`,
      'bahaya'
    );

    return { success: true };
  }
};
