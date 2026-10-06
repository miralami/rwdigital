/**
 * Format helpers bersama untuk seluruh halaman.
 * Bahasa Indonesia, tanpa dependensi luar. Semua fungsi murni (tidak menyentuh DOM).
 */

const LOCALE = 'id-ID';

const rupiahFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const shortFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1
});

/** 1250000 -> "Rp 1.250.000" */
export function formatRupiah(nilai: number): string {
  return rupiahFormatter.format(nilai ?? 0);
}

/** 50000 -> "50rb", 1200000 -> "1,2jt", 3000000 -> "3jt", 2e9 -> "2M" */
export function formatRupiahPendek(nilai: number): string {
  const n = Math.abs(nilai ?? 0);
  if (n < 1000) return shortFormatter.format(n);

  if (n < 1_000_000) {
    return `${shortFormatter.format(n / 1000)}rb`;
  }
  if (n < 1_000_000_000) {
    return `${shortFormatter.format(n / 1_000_000)}jt`;
  }
  return `${shortFormatter.format(n / 1_000_000_000)}M`;
}

/** "pemasukan" | "pengeluaran" -> "+Rp 1.250.000" | "-Rp 500.000" */
export function formatRupiahTanda(nilai: number, jenis: string): string {
  return `${jenis === 'pemasukan' ? '+' : '-'}${formatRupiah(nilai)}`;
}

/** "pemasukan" | "pengeluaran" -> "+1,2jt" | "-50rb" */
export function formatRupiahPendekTanda(nilai: number, jenis: string): string {
  return `${jenis === 'pemasukan' ? '+' : '-'}${formatRupiahPendek(nilai)}`;
}

function toDate(nilai: string | number | Date | null | undefined): Date | null {
  if (nilai === null || nilai === undefined || nilai === '') return null;
  const d = nilai instanceof Date ? nilai : new Date(nilai);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "12 Agu 2025" */
export function formatTanggal(nilai: string | number | Date | null | undefined): string {
  const d = toDate(nilai);
  if (!d) return '—';
  return new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}

/** "Senin, 28 September 2026" */
export function formatTanggalPanjang(nilai: string | number | Date | null | undefined): string {
  const d = toDate(nilai);
  if (!d) return '—';
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(d);
}

const DAY_MS = 86_400_000;

function midnight(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * "hari ini" | "kemarin" | "3 hari lalu" | "2 minggu lalu" | "12 Agu 2025"
 * `now` sengaja dioper masuk supaya pemanggil bisa menjaga SSR/hidrasi tetap
 * sama: sebelum `now` tersedia, panggil `formatTanggal` sebagai gantinya.
 */
export function formatRelatif(
  nilai: string | number | Date | null | undefined,
  now: Date | null
): string {
  const d = toDate(nilai);
  if (!d) return '—';
  if (!now) return formatTanggal(d);

  const selisih = Math.round((midnight(now) - midnight(d)) / DAY_MS);

  if (selisih === 0) return 'hari ini';
  if (selisih === 1) return 'kemarin';
  if (selisih < 0) return formatTanggal(d);
  if (selisih < 7) return `${selisih} hari lalu`;
  if (selisih < 14) return 'seminggu lalu';
  if (selisih < 31) return `${Math.floor(selisih / 7)} minggu lalu`;
  return formatTanggal(d);
}

const ROLE_LABELS: Record<string, string> = {
  admin_rw: 'Admin RW',
  pengurus_rt: 'Pengurus RT',
  bendahara: 'Bendahara',
  warga: 'Warga'
};

export function formatRole(role?: string | null): string {
  if (!role) return 'Warga';
  return ROLE_LABELS[role] ?? role;
}

export function inisial(nama?: string | null): string {
  return (nama ?? '').trim().charAt(0).toUpperCase() || '?';
}

/**
 * Penyamaran data identitas sensitif (PII) sesuai standar NFRA-10 & UU PDP.
 * Contoh 16 digit: "3275012345670001" -> "3275••••••••0001"
 */
export function maskNik(nik?: string | null): string {
  if (!nik) return '—';
  const clean = nik.trim();
  if (clean.length < 8) return '••••••••';
  return `${clean.slice(0, 4)}••••••••${clean.slice(-4)}`;
}

export function maskNoKk(noKk?: string | null): string {
  return maskNik(noKk);
}

