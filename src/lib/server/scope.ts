import { error } from '@sveltejs/kit';
import { rolesOf } from './guard';

/**
 * Batas data (row-level scope) untuk pengurus RT.
 *
 * Izin per-aksi (`$lib/server/rbac.ts`) hanya menjawab "boleh melakukan apa".
 * Modul ini menjawab "boleh menyentuh baris milik siapa":
 *
 * - `admin_rw` & `bendahara` → semua RT.
 * - `pengurus_rt` → hanya RT yang ditugaskan di tabel `petugas_rt`.
 * - akun pengurus_rt tanpa penugasan → tidak ada akses (fail-closed), supaya
 *   data RT lain tidak bocor hanya karena penugasan belum diisi.
 */
export type DataScope =
	| { kind: 'all' }
	| { kind: 'rt'; rtId: number }
	| { kind: 'none' };

export function scopeFromRole(locals: App.Locals): DataScope {
	const roleList = rolesOf(locals);

	// Role dengan pandangan RW penuh. Kalau akun punya beberapa role, yang
	// paling luas menang supaya admin yang juga pengurus RT tidak terkunci.
	if (roleList.includes('admin_rw') || roleList.includes('bendahara')) {
		return { kind: 'all' };
	}

	if (roleList.includes('pengurus_rt')) {
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
