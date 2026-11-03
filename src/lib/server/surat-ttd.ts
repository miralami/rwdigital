import type { DataScope } from './scope';

/**
 * Aturan tanda tangan surat.
 *
 * Satu surat hanya boleh ditandatangani (atau ditolak) oleh pihak yang
 * benar-benar dicentang warga saat mengajukan. Pengurus RW tetap boleh
 * membaca semua surat, termasuk yang tidak meminta TTD RW, tetapi tombol
 * tanda tangan/tolak tidak boleh muncul dan aksi server harus menolaknya.
 */
export type PihakTtd = 'rt' | 'rw';

export interface StatusTtdSurat {
  status: string;
  butuhTtdRt: boolean;
  butuhTtdRw: boolean;
  ttdRtPada: string | null;
  ttdRwPada: string | null;
}

/** Pihak yang diwakili akun staf: scope RT → RT, scope all → RW. */
export function pihakTtdDariScope(scope: DataScope): PihakTtd | null {
  if (scope.kind === 'rt') return 'rt';
  if (scope.kind === 'all') return 'rw';
  return null;
}

/** Apakah surat ini meminta tanda tangan pihak tersebut. */
export function dimintaTtd(pihak: PihakTtd | null, surat: StatusTtdSurat): boolean {
  if (pihak === 'rt') return surat.butuhTtdRt;
  if (pihak === 'rw') return surat.butuhTtdRw;
  return false;
}

/** Apakah pihak tersebut sudah menandatangani surat ini. */
export function sudahTtd(pihak: PihakTtd | null, surat: StatusTtdSurat): boolean {
  if (pihak === 'rt') return Boolean(surat.ttdRtPada);
  if (pihak === 'rw') return Boolean(surat.ttdRwPada);
  return false;
}

/** Surat yang sudah terbit/ditolak tidak boleh diubah lagi. */
function masihBerjalan(surat: StatusTtdSurat): boolean {
  return surat.status !== 'terbit' && surat.status !== 'ditolak';
}

/** Boleh menekan "Verifikasi & Tanda Tangani" hanya jika diminta dan belum TTD. */
export function bolehMenandatangani(
  pihak: PihakTtd | null,
  surat: StatusTtdSurat
): boolean {
  if (!pihak || !masihBerjalan(surat)) return false;
  return dimintaTtd(pihak, surat) && !sudahTtd(pihak, surat);
}

/** Boleh menolak hanya jika pihak tersebut memang diminta menandatangani. */
export function bolehMenolak(pihak: PihakTtd | null, surat: StatusTtdSurat): boolean {
  if (!pihak || !masihBerjalan(surat)) return false;
  return dimintaTtd(pihak, surat);
}
