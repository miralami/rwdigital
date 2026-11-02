import House from '@lucide/svelte/icons/house';
import Users from '@lucide/svelte/icons/users';
import Wallet from '@lucide/svelte/icons/wallet';
import Receipt from '@lucide/svelte/icons/receipt';
import Ellipsis from '@lucide/svelte/icons/ellipsis';
import Megaphone from '@lucide/svelte/icons/megaphone';
import User from '@lucide/svelte/icons/user';
import FileText from '@lucide/svelte/icons/file-text';
import Settings from '@lucide/svelte/icons/settings';
import type { Component } from 'svelte';
import { bolehBukaModul, type Izin } from '$lib/akses';

export interface NavItem {
  href: string;
  label: string;
  /** Label pendek untuk bottom nav supaya tidak pernah terpotong. */
  shortLabel?: string;
  icon: Component<any>;
  /** Modul yang harus punya izin `read` agar menu tampil. */
  modul?: string;
  /** Beberapa modul alternatif: cukup salah satu punya izin `read`. */
  modulAny?: readonly string[];
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
  { href: '/warga', label: 'Warga', shortLabel: 'Warga', icon: Users, modul: 'warga' },
  { href: '/kas', label: 'Kas RW', shortLabel: 'Kas', icon: Wallet, modul: 'kas' },
  { href: '/iuran', label: 'Iuran', shortLabel: 'Iuran', icon: Receipt, modul: 'iuran' }
];

/** Destinasi yang tidak muat di bottom nav, dibuka lewat "Lainnya". */
export const MORE_NAV_ITEMS: NavItem[] = [
  { href: '/surat', label: 'Surat', shortLabel: 'Surat', icon: FileText, modul: 'surat' },
  {
    href: '/pengumuman',
    label: 'Pengumuman',
    shortLabel: 'Pengumuman',
    icon: Megaphone,
    modul: 'pengumuman'
  },
  {
    href: '/pengaturan',
    label: 'Pengaturan',
    shortLabel: 'Atur',
    icon: Settings,
    modulAny: ['rt', 'pengurus', 'landing', 'user', 'peran']
  }
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

/** True kalau `izin` mengizinkan membaca modul yang diminta item. */
export function bolehLihatNav(item: NavItem, izin: Izin | null | undefined): boolean {
  if (item.modulAny) return item.modulAny.some((modul) => bolehBukaModul(izin, modul));
  if (item.modul) return bolehBukaModul(izin, item.modul);
  return true;
}

/** Saring daftar menu berdasarkan izin yang dihidrasi server. */
export function filterNav(items: readonly NavItem[], izin: Izin | null | undefined): NavItem[] {
  return items.filter((item) => bolehLihatNav(item, izin));
}

/** Susunan menu siap pakai untuk satu request/user. */
export function navUntuk(izin: Izin | null | undefined): {
  primary: NavItem[];
  more: NavItem[];
  sidebar: NavItem[];
  bottom: NavItem[];
} {
  const primary = filterNav(PRIMARY_NAV_ITEMS, izin);
  const more = filterNav(MORE_NAV_ITEMS, izin);
  return {
    primary,
    more,
    sidebar: [...primary, ...more],
    bottom: more.length > 0 ? [...primary, MORE_NAV_ITEM] : primary
  };
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

// ─── Portal warga ────────────────────────────────────────────────────────────

/**
 * Tujuan portal warga.
 */
export const PORTAL_NAV_ITEMS: NavItem[] = [
  { href: PORTAL_PATH, label: 'Beranda', shortLabel: 'Beranda', icon: House },
  { href: `${PORTAL_PATH}/iuran`, label: 'Iuran', shortLabel: 'Iuran', icon: Receipt },
  { href: `${PORTAL_PATH}#surat`, label: 'Surat', shortLabel: 'Surat', icon: FileText },
  { href: `${PORTAL_PATH}#info`, label: 'Info', shortLabel: 'Info', icon: Megaphone },
  { href: '', label: 'Profil', shortLabel: 'Profil', icon: User }
];

/** Section beranda yang jadi tujuan anchor, urut dari atas. */
export const PORTAL_SECTIONS = ['iuran', 'surat', 'info'] as const;
export type PortalSection = 'beranda' | (typeof PORTAL_SECTIONS)[number];

/** Section id -> href nav, supaya status aktif nav dan section sinkron. */
export const PORTAL_SECTION_HREF: Record<PortalSection, string> = {
  beranda: PORTAL_PATH,
  iuran: `${PORTAL_PATH}/iuran`,
  surat: `${PORTAL_PATH}#surat`,
  info: `${PORTAL_PATH}#info`
};
