import { PERAN_DEFAULT } from '$lib/akses';

/**
 * Fallback label dan role bawaan untuk UI dan backwards-compatibility.
 * Sumber utama di runtime adalah tabel DB `peran`.
 */
export const ROLE_VALUES = PERAN_DEFAULT.map((p) => p.nama);

export type RoleName = string;

export const LABEL_ROLE: Record<string, string> = Object.fromEntries(
  PERAN_DEFAULT.map((p) => [p.nama, p.label])
);

export const DESKRIPSI_ROLE: Record<string, string> = Object.fromEntries(
  PERAN_DEFAULT.map((p) => [p.nama, p.deskripsi])
);
