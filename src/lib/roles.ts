/**
 * Label role yang dipakai di UI. Daftar role-nya sendiri tetap berasal dari
 * `$lib/permissions.ts`; file ini hanya memetakan nama teknis -> teks manusia.
 */
export const ROLE_VALUES = ['admin_rw', 'pengurus_rt', 'bendahara', 'warga'] as const;

export type RoleName = (typeof ROLE_VALUES)[number];

export const LABEL_ROLE: Record<RoleName, string> = {
  admin_rw: 'Admin RW',
  pengurus_rt: 'Pengurus RT',
  bendahara: 'Bendahara',
  warga: 'Warga'
};

export const DESKRIPSI_ROLE: Record<RoleName, string> = {
  admin_rw: 'Akses penuh: kependudukan, keuangan, surat, dan pengaturan.',
  pengurus_rt: 'Kelola data warga & KK, ajukan surat. Keuangan hanya baca.',
  bendahara: 'Akses penuh keuangan & iuran. Kependudukan hanya baca.',
  warga: 'Portal warga: lihat tagihan, ajukan surat, baca pengumuman.'
};
