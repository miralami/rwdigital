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
  surat: ['create', 'read', 'update', 'delete']
} as const;

export const ac = createAccessControl(statement);

// ─── Role ────────────────────────────────────────────────────────────────────
// Admin RW — akses penuh ke seluruh modul.
export const adminRw = ac.newRole({
  ...adminAc.statements,
  warga: ['create', 'read', 'update', 'delete'],
  kk: ['create', 'read', 'update', 'delete'],
  rt: ['read', 'update'],
  rw: ['read', 'update'],
  pengumuman: ['create', 'read', 'update', 'delete'],
  iuran: ['create', 'read', 'update', 'delete'],
  kas: ['create', 'read', 'update', 'delete'],
  pengurus: ['create', 'read', 'update', 'delete'],
  surat: ['create', 'read', 'update', 'delete']
});

// Pengurus RT — kelola data warga & KK wilayahnya, ajukan surat.
export const pengurusRt = ac.newRole({
  warga: ['create', 'read', 'update'],
  kk: ['create', 'read', 'update'],
  rt: ['read'],
  rw: ['read'],
  pengumuman: ['read'],
  iuran: ['read'],
  kas: ['read'],
  pengurus: ['read'],
  surat: ['create', 'read']
});

// Bendahara — akses penuh modul keuangan & iuran, data warga hanya dibaca.
export const bendahara = ac.newRole({
  warga: ['read'],
  kk: ['read'],
  rt: ['read'],
  rw: ['read'],
  pengumuman: ['read'],
  iuran: ['create', 'read', 'update', 'delete'],
  kas: ['create', 'read', 'update', 'delete'],
  pengurus: ['read'],
  surat: ['read']
});

// Warga — akses terbatas: baca info RW & pengumuman, ajukan surat.
export const warga = ac.newRole({
  pengumuman: ['read'],
  iuran: ['read'],
  surat: ['create', 'read']
});

export const roles = {
  admin_rw: adminRw,
  pengurus_rt: pengurusRt,
  bendahara,
  warga
} as const;

export type Role = keyof typeof roles;
