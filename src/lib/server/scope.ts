import { error } from '@sveltejs/kit';
import { peranDefault, type ScopePeran } from '$lib/akses';
import { rolesOf } from './guard';

/**
 * Batas data (row-level scope).
 *
 * Izin per-aksi (`$lib/server/rbac.ts`) hanya menjawab "boleh melakukan apa".
 * Modul ini menjawab "boleh menyentuh baris milik siapa":
 *
 * - `all`  → seluruh RW.
 * - `rt`   → hanya RT yang ditugaskan di tabel `petugas_rt`.
 * - `none` → tidak ada data staf (portal warga).
 *
 * Scope berasal dari kolom `scope` pada tabel `peran`, sehingga peran baru
 * buatan superadmin otomatis punya batas data yang benar. Akun tanpa penugasan
 * RT tetap fail-closed, supaya data RT lain tidak bocor.
 */
export type DataScope =
	| { kind: 'all' }
	| { kind: 'rt'; rtId: number }
	| { kind: 'none' };

const URUTAN_SCOPE: Record<ScopePeran, number> = { none: 0, rt: 1, all: 2 };

function scopeTerluas(a: ScopePeran, b: ScopePeran): ScopePeran {
	return URUTAN_SCOPE[b] > URUTAN_SCOPE[a] ? b : a;
}

/** Scope peran efektif: `locals.scopePeran` dari hooks, fallback peran default. */
export function scopePeranOf(locals: App.Locals): ScopePeran {
	if (locals.scopePeran === 'all' || locals.scopePeran === 'rt' || locals.scopePeran === 'none') {
		return locals.scopePeran;
	}

	// Fallback untuk locals tiruan/unit test.
	return rolesOf(locals).reduce<ScopePeran>(
		(terluas, nama) => scopeTerluas(terluas, peranDefault(nama)?.scope ?? 'none'),
		'none'
	);
}

export function scopeFromRole(locals: App.Locals): DataScope {
	const scope = scopePeranOf(locals);

	if (scope === 'all') return { kind: 'all' };

	if (scope === 'rt') {
		const rtId = locals.petugasRtId;
		if (typeof rtId === 'number' && Number.isInteger(rtId) && rtId > 0) {
			return { kind: 'rt', rtId };
		}
		return { kind: 'none' };
	}

	return { kind: 'none' };
}

/** True kalau scope boleh menyentuh baris milik RT tertentu. */
export function canAccessRt(scope: DataScope, rtId: number | null | undefined): boolean {
	if (scope.kind === 'all') return true;
	if (scope.kind === 'none') return false;
	return typeof rtId === 'number' && rtId === scope.rtId;
}

/** Lempar 403 kalau baris berada di luar RT tugas pengurus. */
export function requireRtAccess(scope: DataScope, rtId: number | null | undefined): void {
	if (!canAccessRt(scope, rtId)) {
		throw error(403, 'Anda tidak punya akses ke data RT lain.');
	}
}

/**
 * Pastikan akun punya wilayah kerja. Dipakai di halaman/aksi yang isinya
 * selalu per-RT, supaya pengurus tanpa penugasan mendapat pesan yang jelas
 * alih-alih melihat daftar kosong.
 */
export function requireScope(scope: DataScope): { kind: 'all' } | { kind: 'rt'; rtId: number } {
	if (scope.kind === 'none') {
		throw error(403, 'Akun ini belum ditugaskan ke RT. Hubungi admin RW.');
	}
	return scope;
}

/** Daftar RT yang boleh dilihat: semua untuk RW, satu untuk pengurus RT. */
export function visibleRt<T extends { id: number }>(scope: DataScope, daftarRt: readonly T[]): T[] {
	if (scope.kind === 'all') return [...daftarRt];
	if (scope.kind === 'rt') return daftarRt.filter((item) => item.id === scope.rtId);
	return [];
}
