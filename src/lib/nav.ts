import { House, Users, Wallet, Receipt, Ellipsis, Megaphone, User } from '@lucide/svelte';
import type { Component } from 'svelte';

export interface NavItem {
  href: string;
  label: string;
  /** Label pendek untuk bottom nav supaya tidak pernah terpotong. */
  shortLabel?: string;
  icon: Component<any>;
}

/**
 * Path portal warga.
 *
 * PENTING: nilai ini harus sama dengan `WARGA_PORTAL` di `$lib/server/guard.ts`.
 * Constant itu server-only (SvelteKit melarang impor `$lib/server/**` dari kode
 * browser), jadi literal-nya diduplikasi di sini. Kalau guard berubah, ubah
 * juga di sini.
 */
export const PORTAL_PATH = '/portal';

/** Empat menu yang muat di bottom nav mobile (5 kolom termasuk "Lainnya"). */
export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Beranda', shortLabel: 'Beranda', icon: House },
  { href: '/warga', label: 'Warga', shortLabel: 'Warga', icon: Users },
  { href: '/kas', label: 'Kas RW', shortLabel: 'Kas', icon: Wallet },
  { href: '/iuran', label: 'Iuran', shortLabel: 'Iuran', icon: Receipt }
];

/** Destinasi yang tidak muat di bottom nav, dibuka lewat "Lainnya". */
export const MORE_NAV_ITEMS: NavItem[] = [
  { href: '/pengumuman', label: 'Pengumuman', shortLabel: 'Pengumuman', icon: Megaphone }
];

export const MORE_NAV_ITEM: NavItem = {
  href: '',
  label: 'Lainnya',
  shortLabel: 'Lainnya',
  icon: Ellipsis
};

/** Sidebar desktop menampilkan semuanya. */
export const SIDEBAR_NAV_ITEMS: NavItem[] = [...PRIMARY_NAV_ITEMS, ...MORE_NAV_ITEMS];

/** Bottom nav: 4 menu + Lainnya. */
export const BOTTOM_NAV_ITEMS: NavItem[] = [...PRIMARY_NAV_ITEMS, MORE_NAV_ITEM];

export function isNavActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

// ─── Portal warga ────────────────────────────────────────────────────────────

/**
 * Empat tujuan portal. Tidak ada halaman baru: `Iuran` dan `Info` menuju
 * section di beranda lewat anchor, `Profil` membuka panel (href kosong).
 */
export const PORTAL_NAV_ITEMS: NavItem[] = [
  { href: PORTAL_PATH, label: 'Beranda', shortLabel: 'Beranda', icon: House },
  { href: `${PORTAL_PATH}#iuran`, label: 'Iuran', shortLabel: 'Iuran', icon: Receipt },
  { href: `${PORTAL_PATH}#info`, label: 'Info', shortLabel: 'Info', icon: Megaphone },
  { href: '', label: 'Profil', shortLabel: 'Profil', icon: User }
];

/** Section beranda yang jadi tujuan anchor, urut dari atas. */
export const PORTAL_SECTIONS = ['iuran', 'info'] as const;
export type PortalSection = 'beranda' | (typeof PORTAL_SECTIONS)[number];

/** Section id -> href nav, supaya status aktif nav dan section sinkron. */
export const PORTAL_SECTION_HREF: Record<PortalSection, string> = {
  beranda: PORTAL_PATH,
  iuran: `${PORTAL_PATH}#iuran`,
  info: `${PORTAL_PATH}#info`
};
