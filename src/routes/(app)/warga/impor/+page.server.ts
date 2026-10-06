import { db } from '$lib/server/db';
import { warga, kk, rt, rw } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || file.size === 0) {
      return fail(400, { error: 'Pilih berkas CSV untuk diimpor.' });
    }

    const text = await file.text();
    const rawLines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

    if (rawLines.length <= 1) {
      return fail(400, { error: 'Berkas CSV kosong atau hanya berisi baris judul header.' });
    }

    // Ambil default RW
    const [defaultRw] = await db.select().from(rw).limit(1);
    if (!defaultRw) {
      return fail(400, { error: 'Data RW belum dikonfigurasi dalam sistem.' });
    }

    // Cache RT
    const existingRts = await db.select().from(rt);
    const rtMap = new Map<number, number>(); // nomorRt -> rtId
    for (const r of existingRts) {
      rtMap.set(r.nomor, r.id);
    }

    const header = rawLines[0].toLowerCase().split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const rows = rawLines.slice(1);

    let berhasilCount = 0;
    const errorList: { baris: number; pesan: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const lineNum = i + 2;
      const cols = rows[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length < 4 || cols.every((c) => !c)) continue;

      const rowObj: Record<string, string> = {};
      header.forEach((h, idx) => {
        rowObj[h] = cols[idx] ?? '';
      });

      const nik = rowObj['nik'] || cols[0] || '';
      const nama = rowObj['nama'] || cols[1] || '';
      const noKk = rowObj['no_kk'] || cols[2] || '';
      const nomorRt = Number(rowObj['rt'] || rowObj['nomor_rt'] || cols[3] || 1);
      const tempatLahir = rowObj['tempat_lahir'] || cols[4] || 'Bekasi';
      const tanggalLahir = rowObj['tanggal_lahir'] || cols[5] || '1990-01-01';
      const jenisKelamin = (rowObj['jenis_kelamin'] || cols[6] || 'L').toUpperCase() === 'P' ? 'P' : 'L';
      const agama = rowObj['agama'] || cols[7] || 'Islam';
      const statusPerkawinan = (rowObj['status_kawin'] || cols[8] || 'belum_kawin') as any;
      const statusHubunganKk = (rowObj['hubungan_kk'] || cols[9] || 'lainnya') as any;
      const alamat = rowObj['alamat'] || cols[10] || 'Lingkungan RW 01';
      const statusHuni = (rowObj['status_huni'] || cols[11] || 'tetap') as any;

      if (!/^\d{16}$/.test(nik)) {
        errorList.push({ baris: lineNum, pesan: `NIK "${nik}" tidak valid (harus tepat 16 digit angka)` });
        continue;
      }

      if (!/^\d{16}$/.test(noKk)) {
        errorList.push({ baris: lineNum, pesan: `No. KK "${noKk}" tidak valid (harus tepat 16 digit angka)` });
        continue;
      }

      try {
        // Cek duplikat NIK
        const [existingWarga] = await db.select().from(warga).where(eq(warga.nik, nik));
        if (existingWarga) {
          errorList.push({ baris: lineNum, pesan: `NIK "${nik}" (${nama}) sudah terdaftar dalam sistem` });
          continue;
        }

        // Resolusi RT
        let rtId = rtMap.get(nomorRt);
        if (!rtId) {
          const [newRt] = await db.insert(rt).values({ nomor: nomorRt, rwId: defaultRw.id }).returning();
          rtId = newRt.id;
          rtMap.set(nomorRt, rtId);
        }

        // Resolusi KK
        let kkId: number;
        const [existingKk] = await db.select().from(kk).where(eq(kk.noKk, noKk));
        if (existingKk) {
          kkId = existingKk.id;
        } else {
          const [newKk] = await db
            .insert(kk)
            .values({
              noKk,
              alamat,
              rtId,
              statusHuni: ['tetap', 'kontrak', 'kos'].includes(statusHuni) ? statusHuni : 'tetap'
            })
            .returning();
          kkId = newKk.id;
        }

        // Insert Warga
        await db.insert(warga).values({
          nik,
          nama,
          tempatLahir,
          tanggalLahir,
          jenisKelamin,
          agama,
          statusPerkawinan: ['belum_kawin', 'kawin', 'cerai_hidup', 'cerai_mati'].includes(statusPerkawinan)
            ? statusPerkawinan
            : 'belum_kawin',
          statusHubunganKk: ['kepala_keluarga', 'istri', 'anak', 'lainnya'].includes(statusHubunganKk)
            ? statusHubunganKk
            : 'lainnya',
          kkId,
          aktif: true
        });

        berhasilCount++;
      } catch (err: any) {
        errorList.push({ baris: lineNum, pesan: `Gagal menyimpan baris: ${err.message}` });
      }
    }

    return {
      sukses: true,
      totalBaris: rows.length,
      berhasilCount,
      gagalCount: errorList.length,
      errors: errorList
    };
  }
};
