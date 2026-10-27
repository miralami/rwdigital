import { z } from 'zod';

/**
 * Skema form jenis iuran — dipakai halaman tambah dan ubah.
 *
 * Nilai disimpan sebagai konfigurasi data (nominal, porsi RW, scope, urutan),
 * bukan konstanta kode, supaya bendahara bisa menyesuaikan tanpa deploy.
 */
export const idOpsional = z.preprocess(
  (nilai) => (nilai === '' || nilai === null || nilai === undefined ? undefined : nilai),
  z.coerce.number().int().positive().optional()
);

export const jenisSchema = z.object({
  nama: z.string().trim().min(1, 'Nama wajib diisi').max(100, 'Nama terlalu panjang'),
  nominal: z.coerce.number().positive('Nominal harus lebih dari 0'),
  porsiRw: z.coerce.number().min(0, 'Porsi RW tidak boleh negatif').default(0),
  periode: z.enum(['bulanan', 'tahunan', 'insidental']).default('bulanan'),
  // Scope menentukan siapa yang menagih: RW langsung atau lewat RT.
  scope: z.enum(['rw', 'rt']).default('rt'),
  rtId: idOpsional,
  urutan: z.coerce.number().int().min(0, 'Urutan tidak boleh negatif').default(0),
  aktif: z.boolean().default(true)
});

export function bacaFormJenis(formData: FormData) {
  return {
    nama: formData.get('nama'),
    nominal: formData.get('nominal'),
    porsiRw: formData.get('porsiRw'),
    periode: formData.get('periode'),
    scope: formData.get('scope'),
    rtId: formData.get('rtId'),
    urutan: formData.get('urutan'),
    aktif: formData.get('aktif') === 'on'
  };
}
