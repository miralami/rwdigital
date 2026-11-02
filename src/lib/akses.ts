/**
 * Katalog modul, aksi, dan izin default aplikasi.
 *
 * File ini sengaja TIDAK menyentuh database maupun `$lib/server/**` supaya bisa
 * dipakai di browser (menu, tombol, halaman pengaturan peran) dan di server
 * (guard, seed, API). Database hanya menyimpan hasil pilihan pengguna; daftar
 * modul/aksi yang valid tetap berasal dari sini agar UI tidak pernah menawarkan
 * izin yang tidak dikenal kode.
 */

// ─── Aksi ────────────────────────────────────────────────────────────────────
// Empat aksi dasar dipakai hampir semua modul. `user` memakai nama aksi milik
// plugin admin Better Auth (`list`, `set-role`, ...) supaya pemanggilan
// `requirePermission(locals, 'user', 'set-role')` yang sudah ada tetap cocok.
export const AKSI = ['read', 'create', 'update', 'delete', 'list', 'set-role'] as const;

export type Aksi = (typeof AKSI)[number];

export const LABEL_AKSI: Record<Aksi, string> = {
  read: 'Lihat',
  create: 'Tambah',
  update: 'Ubah',
  delete: 'Hapus',
  list: 'Daftar',
  'set-role': 'Atur peran'
};

// ─── Modul ───────────────────────────────────────────────────────────────────
export interface ModulDef {
  key: string;
  label: string;
  grup: string;
  deskripsi: string;
  aksi: readonly Aksi[];
}

const CRUD: readonly Aksi[] = ['read', 'create', 'update', 'delete'];

export const MODUL: readonly ModulDef[] = [
  {
    key: 'warga',
    label: 'Data Warga',
    grup: 'Kependudukan',
    deskripsi: 'Data pribadi warga, akun portal, dan permintaan pembaruan.',
    aksi: CRUD
  },
  {
    key: 'kk',
    label: 'Kartu Keluarga',
    grup: 'Kependudukan',
    deskripsi: 'Data KK, alamat, dan status huni.',
    aksi: CRUD
  },
  {
    key: 'rt',
    label: 'Data RT',
    grup: 'Wilayah',
    deskripsi: 'Daftar RT dan penugasan pengurus RT.',
    aksi: ['read', 'update']
  },
  {
    key: 'rw',
    label: 'Profil RW',
    grup: 'Wilayah',
    deskripsi: 'Identitas dan alamat RW.',
    aksi: ['read', 'update']
  },
  {
    key: 'pengumuman',
    label: 'Pengumuman',
    grup: 'Informasi',
    deskripsi: 'Pengumuman dan agenda kegiatan untuk warga.',
    aksi: CRUD
  },
  {
    key: 'surat',
    label: 'Surat Menyurat',
    grup: 'Layanan',
    deskripsi: 'Pengajuan, verifikasi, dan penerbitan surat.',
    aksi: CRUD
  },
  {
    key: 'iuran',
    label: 'Iuran',
    grup: 'Keuangan',
    deskripsi: 'Jenis iuran, tagihan, pembayaran, dan konfirmasi.',
    aksi: CRUD
  },
  {
    key: 'kas',
    label: 'Kas RW',
    grup: 'Keuangan',
    deskripsi: 'Buku kas RW, kategori, dan setoran dari RT.',
    aksi: CRUD
  },
  {
    key: 'pengurus',
    label: 'Pengurus',
    grup: 'Organisasi',
    deskripsi: 'Bagan pengurus RW dan RT.',
    aksi: CRUD
  },
  {
    key: 'landing',
    label: 'Landing Page',
    grup: 'Informasi',
    deskripsi: 'Konten halaman publik dan galeri.',
    aksi: CRUD
  },
  {
    key: 'user',
    label: 'Akun Pengguna',
    grup: 'Sistem',
    deskripsi: 'Membuat akun, mengatur peran, dan menonaktifkan akun.',
    aksi: ['list', 'create', 'update', 'delete', 'set-role']
  },
  {
    key: 'peran',
    label: 'Peran & Izin',
    grup: 'Sistem',
    deskripsi: 'Membuat peran baru dan mengatur izin per modul.',
    aksi: CRUD
  }
];

export const MODUL_BY_KEY: Readonly<Record<string, ModulDef>> = Object.fromEntries(
  MODUL.map((modul) => [modul.key, modul])
);

/** Daftar aksi yang valid untuk sebuah modul. Modul tak dikenal → kosong. */
export function aksiModul(modul: string): readonly Aksi[] {
  return MODUL_BY_KEY[modul]?.aksi ?? [];
}

// ─── Izin ────────────────────────────────────────────────────────────────────
/** Map modul → aksi yang diizinkan, mis. `{ warga: ['read', 'update'] }`. */
export type Izin = Record<string, string[]>;

/** Semua izin pada semua modul — dipakai role superadmin. */
export function izinPenuh(): Izin {
  return Object.fromEntries(MODUL.map((modul) => [modul.key, [...modul.aksi]]));
}

/** Izin hanya-baca untuk seluruh modul yang punya aksi `read`. */
export function izinBacaSemua(): Izin {
  const izin: Izin = {};
  for (const modul of MODUL) {
    if (modul.aksi.includes('read')) izin[modul.key] = ['read'];
  }
  return izin;
}

/** Buang modul/aksi yang tidak dikenal dan duplikat. Aman untuk data lama. */
export function normalisasiIzin(value: unknown): Izin {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const hasil: Izin = {};
  for (const [modul, daftar] of Object.entries(value as Record<string, unknown>)) {
    const valid = aksiModul(modul);
    if (valid.length === 0 || !Array.isArray(daftar)) continue;

    const aksi = [...new Set(daftar.filter((item): item is string => typeof item === 'string'))].filter(
      (item) => (valid as readonly string[]).includes(item)
    );
    if (aksi.length > 0) hasil[modul] = aksi;
  }
  return hasil;
}

/** Apakah `izin` mengizinkan aksi tertentu pada sebuah modul. */
export function bisaAkses(izin: Izin | null | undefined, modul: string, aksi: string): boolean {
  return Boolean(izin?.[modul]?.includes(aksi));
}

/**
 * Aksi yang menandai sebuah modul boleh dibuka.
 *
 * Hampir semua modul memakai `read`, tapi modul `user` memakai aksi milik
 * plugin admin Better Auth dan tidak punya `read` — daftar akun dibuka dengan
 * `list`. Helper ini mencegah guard/menu meminta aksi yang tidak pernah ada.
 */
export function aksiBuka(modul: string): string | null {
  const definisi = MODUL_BY_KEY[modul];
  if (!definisi) return null;
  return definisi.aksi.includes('read') ? 'read' : (definisi.aksi[0] ?? null);
}

/** True kalau `izin` cukup untuk membuka halaman modul tersebut. */
export function bolehBukaModul(izin: Izin | null | undefined, modul: string): boolean {
  const aksi = aksiBuka(modul);
  return aksi ? bisaAkses(izin, modul, aksi) : false;
}

/** Gabungkan beberapa izin (union) — dipakai akun dengan lebih dari satu role. */
export function gabungIzin(...daftar: readonly (Izin | null | undefined)[]): Izin {
  const hasil: Izin = {};
  for (const izin of daftar) {
    if (!izin) continue;
    for (const [modul, aksi] of Object.entries(izin)) {
      hasil[modul] = [...new Set([...(hasil[modul] ?? []), ...aksi])];
    }
  }
  return normalisasiIzin(hasil);
}

// ─── Role default ────────────────────────────────────────────────────────────
export type TipePeran = 'staff' | 'warga';
export type ScopePeran = 'all' | 'rt' | 'none';

export interface PeranDefault {
  nama: string;
  label: string;
  deskripsi: string;
  tipe: TipePeran;
  scope: ScopePeran;
  permissions: Izin;
  sistem: boolean;
  superadmin: boolean;
  urutan: number;
}

/**
 * Role bawaan yang di-seed ke tabel `peran`.
 *
 * `admin_rw` adalah superadmin: izinnya selalu penuh dan tidak bisa diubah
 * lewat UI. Role lain boleh disunting superadmin kapan saja.
 */
export const PERAN_DEFAULT: readonly PeranDefault[] = [
  {
    nama: 'admin_rw',
    label: 'Admin RW',
    deskripsi: 'Superadmin: akses penuh ke seluruh modul dan pengaturan sistem.',
    tipe: 'staff',
    scope: 'all',
    permissions: izinPenuh(),
    sistem: true,
    superadmin: true,
    urutan: 0
  },
  {
    nama: 'ketua_rw',
    label: 'Ketua RW',
    deskripsi: 'Memantau seluruh data dan menyetujui surat. Tidak mengelola keuangan.',
    tipe: 'staff',
    scope: 'all',
    permissions: {
      ...izinBacaSemua(),
      surat: ['read', 'update']
    },
    sistem: true,
    superadmin: false,
    urutan: 1
  },
  {
    nama: 'sekretaris',
    label: 'Sekretaris',
    deskripsi: 'Mengelola kependudukan, surat, dan pengumuman.',
    tipe: 'staff',
    scope: 'all',
    permissions: {
      warga: ['read', 'create', 'update', 'delete'],
      kk: ['read', 'create', 'update', 'delete'],
      rt: ['read'],
      rw: ['read'],
      pengumuman: ['read', 'create', 'update', 'delete'],
      surat: ['read', 'create', 'update'],
      pengurus: ['read'],
      landing: ['read']
    },
    sistem: true,
    superadmin: false,
    urutan: 2
  },
  {
    nama: 'bendahara',
    label: 'Bendahara',
    deskripsi: 'Mengelola kas RW, iuran, tagihan, dan konfirmasi pembayaran.',
    tipe: 'staff',
    scope: 'all',
    permissions: {
      warga: ['read'],
      kk: ['read'],
      rt: ['read'],
      rw: ['read'],
      pengumuman: ['read'],
      surat: ['read'],
      iuran: ['read', 'create', 'update', 'delete'],
      kas: ['read', 'create', 'update', 'delete'],
      pengurus: ['read'],
      landing: ['read']
    },
    sistem: true,
    superadmin: false,
    urutan: 3
  },
  {
    nama: 'pengurus_rt',
    label: 'Pengurus RT',
    deskripsi: 'Mengelola warga & KK di RT-nya, mengajukan surat. Kas RW tidak terlihat.',
    tipe: 'staff',
    scope: 'rt',
    permissions: {
      warga: ['read', 'create', 'update'],
      kk: ['read', 'create', 'update'],
      rt: ['read'],
      rw: ['read'],
      pengumuman: ['read'],
      surat: ['read', 'create'],
      iuran: ['read'],
      pengurus: ['read'],
      landing: ['read']
    },
    sistem: true,
    superadmin: false,
    urutan: 4
  },
  {
    nama: 'warga',
    label: 'Warga',
    deskripsi: 'Portal warga: lihat tagihan, ajukan surat, baca pengumuman.',
    tipe: 'warga',
    scope: 'none',
    permissions: {
      pengumuman: ['read'],
      surat: ['read', 'create'],
      iuran: ['read'],
      landing: ['read']
    },
    sistem: true,
    superadmin: false,
    urutan: 99
  }
];

/** Cari definisi role default berdasarkan slug. */
export function peranDefault(nama: string): PeranDefault | undefined {
  return PERAN_DEFAULT.find((peran) => peran.nama === nama);
}
