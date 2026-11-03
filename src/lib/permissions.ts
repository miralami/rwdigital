import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

// ─── Statement (resource × action) ───────────────────────────────────────────
// `defaultStatements` bawaan Better Auth (user, session, ac, impersonateUser).
// Daftar di bawah mengikuti modul domain Sistem Informasi RW.
const statement = {
  ...defaultStatements,
  warga: ['create', 'read', 'update', 'delete'],
  kk: ['create', 'read', 'update', 'delete'],
  rt: ['read', 'update'],
  rw: ['read', 'update'],
  pengumuman: ['create', 'read', 'update', 'delete'],
  iuran: ['create', 'read', 'update', 'delete'],
  kas: ['create', 'read', 'update', 'delete'],
  pengurus: ['create', 'read', 'update', 'delete'],
  surat: ['create', 'read', 'update', 'delete'],
  landing: ['create', 'read', 'update', 'delete']
} as const;

export const ac = createAccessControl(statement);

const AKSES_PENUH = {
  ...adminAc.statements,
  warga: ['create', 'read', 'update', 'delete'],
  kk: ['create', 'read', 'update', 'delete'],
  rt: ['read', 'update'],
  rw: ['read', 'update'],
  pengumuman: ['create', 'read', 'update', 'delete'],
  iuran: ['create', 'read', 'update', 'delete'],
  kas: ['create', 'read', 'update', 'delete'],
  pengurus: ['create', 'read', 'update', 'delete'],
  surat: ['create', 'read', 'update', 'delete'],
  landing: ['create', 'read', 'update', 'delete']
} as const;

// Superadmin — akses penuh permanen. Akunnya belum dibuat sampai dibahas.
export const superadmin = ac.newRole(AKSES_PENUH);

// Pengurus RW — akses penuh ke seluruh modul, termasuk Pengaturan & Kas RW.
export const pengurusRw = ac.newRole(AKSES_PENUH);

// Pengurus RT — mirip pengurus RW, tetapi tanpa menu Pengaturan dan data
// dibatasi ke RT tugasnya. Kas RW hanya boleh dibaca; Kas RT dikelola sendiri.
export const pengurusRt = ac.newRole({
  warga: ['create', 'read', 'update', 'delete'],
  kk: ['create', 'read', 'update', 'delete'],
  rt: ['read'],
  rw: ['read'],
  pengumuman: ['create', 'read', 'update', 'delete'],
  iuran: ['create', 'read', 'update', 'delete'],
  kas: ['create', 'read', 'update', 'delete'],
  pengurus: ['read'],
  surat: ['create', 'read', 'update'],
  landing: ['read'],
  // Hanya untuk membuat akun portal warga dari halaman detail KK.
  user: ['create']
});

// Warga — akses terbatas: baca info RW & pengumuman, ajukan surat.
export const warga = ac.newRole({
  pengumuman: ['read'],
  iuran: ['read'],
  surat: ['create', 'read'],
  landing: ['read']
});

export const roles = {
  superadmin,
  pengurus_rw: pengurusRw,
  pengurus_rt: pengurusRt,
  warga
} as const;

export type Role = keyof typeof roles;
