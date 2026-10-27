import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const UPLOAD_ROOT = join(process.cwd(), 'static', 'uploads');

export type UploadFolder = 'kas' | 'surat' | 'pengurus';

/** Batas ukuran per folder. Dipakai juga oleh form untuk menampilkan hint. */
export const UPLOAD_MAX_BYTES: Record<UploadFolder, number> = {
  kas: 5 * 1024 * 1024,
  surat: 10 * 1024 * 1024,
  pengurus: 2 * 1024 * 1024
};

/**
 * Allowlist MIME + ekstensi.
 *
 * Sebelumnya file disimpan apa adanya berdasarkan ekstensi, sehingga `.svg`
 * atau `.html` bisa diunggah lalu dieksekusi browser sebagai stored XSS.
 * Sekarang hanya tipe gambar raster dan PDF yang diterima, dan keduanya harus
 * cocok (MIME dari browser DAN ekstensi nama file) supaya tidak bisa diakali.
 */
const ALLOWED: Record<UploadFolder, { mimes: readonly string[]; exts: readonly string[] }> = {
  kas: {
    mimes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    exts: ['jpg', 'jpeg', 'png', 'webp', 'pdf']
  },
  surat: {
    mimes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    exts: ['jpg', 'jpeg', 'png', 'webp', 'pdf']
  },
  pengurus: {
    mimes: ['image/jpeg', 'image/png', 'image/webp'],
    exts: ['jpg', 'jpeg', 'png', 'webp']
  }
};

export class UploadError extends Error {
  readonly status = 400;
  constructor(message: string) {
    super(message);
    this.name = 'UploadError';
  }
}

/**
 * Menyimpan berkas unggahan ke direktori lokal server: `static/uploads/${folder}`.
 * Mengembalikan path URL web `/uploads/${folder}/${filename}`.
 *
 * Melempar `UploadError` (status 400) kalau tipe/ukuran berkas tidak valid,
 * supaya pemanggil bisa menampilkan pesan yang benar, bukan error 500.
 */
export async function saveUploadedFile(
  file: File | null | undefined,
  folder: UploadFolder
): Promise<string | null> {
  if (!file || !(file instanceof File) || file.size === 0) {
    return null;
  }

  const rule = ALLOWED[folder];
  const maxBytes = UPLOAD_MAX_BYTES[folder];

  if (file.size > maxBytes) {
    const mb = Math.round(maxBytes / (1024 * 1024));
    throw new UploadError(`Ukuran berkas melebihi ${mb}MB.`);
  }

  const rawExt = file.name.split('.').pop()?.toLowerCase() ?? '';
  const ext = rawExt.replace(/[^a-z0-9]/g, '');

  if (!ext || !rule.exts.includes(ext)) {
    throw new UploadError(
      `Jenis berkas ".${ext || '?'}" tidak diizinkan. Gunakan: ${rule.exts.join(', ')}.`
    );
  }

  // Sebagian browser mengirim MIME kosong; kalau ada, wajib cocok allowlist.
  if (file.type && !rule.mimes.includes(file.type)) {
    throw new UploadError(`Tipe berkas "${file.type}" tidak diizinkan.`);
  }

  const targetDir = join(UPLOAD_ROOT, folder);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).slice(2, 8);
  const filename = `${timestamp}-${randomStr}.${ext}`;
  const filePath = join(targetDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(filePath, buffer);

  return `/uploads/${folder}/${filename}`;
}
