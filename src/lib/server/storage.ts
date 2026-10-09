import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const UPLOAD_ROOT = join(process.cwd(), 'static', 'uploads');

/**
 * Menyimpan berkas unggahan ke direktori lokal server: `static/uploads/${folder}`.
 * Mengembalikan path URL web `/uploads/${folder}/${filename}`.
 */
export async function saveUploadedFile(file: File | null | undefined, folder: 'kas' | 'surat'): Promise<string | null> {
  if (!file || !(file instanceof File) || file.size === 0) {
    return null;
  }

  const targetDir = join(UPLOAD_ROOT, folder);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const cleanExt = ext.replace(/[^a-z0-9]/g, '');
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).slice(2, 8);
  const filename = `${timestamp}-${randomStr}.${cleanExt}`;
  const filePath = join(targetDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(filePath, buffer);

  return `/uploads/${folder}/${filename}`;
}
