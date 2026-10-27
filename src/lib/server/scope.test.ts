import { describe, expect, it } from 'vitest';
import {
	canAccessRt,
	requireRtAccess,
	requireScope,
	scopeFromRole,
	visibleRt
} from './scope';

const locals = (role: string, petugasRtId: number | null = null) =>
	({ user: { role }, petugasRtId }) as unknown as App.Locals;

describe('scopeFromRole()', () => {
	it('admin_rw dan bendahara melihat semua RT', () => {
		expect(scopeFromRole(locals('admin_rw'))).toEqual({ kind: 'all' });
		expect(scopeFromRole(locals('bendahara'))).toEqual({ kind: 'all' });
	});

	it('pengurus_rt dibatasi ke RT tugasnya', () => {
		expect(scopeFromRole(locals('pengurus_rt', 2))).toEqual({ kind: 'rt', rtId: 2 });
	});

	it('pengurus_rt tanpa penugasan tidak mendapat akses (fail-closed)', () => {
		expect(scopeFromRole(locals('pengurus_rt', null))).toEqual({ kind: 'none' });
		expect(scopeFromRole(locals('pengurus_rt', 0))).toEqual({ kind: 'none' });
	});

	it('warga tidak punya scope data staf', () => {
		expect(scopeFromRole(locals('warga'))).toEqual({ kind: 'none' });
	});

	it('role gabungan memakai pandangan terluas', () => {
		expect(scopeFromRole(locals('pengurus_rt,admin_rw', 3))).toEqual({ kind: 'all' });
	});
});

describe('canAccessRt()', () => {
	it('scope all boleh menyentuh RT mana pun', () => {
		const scope = { kind: 'all' } as const;
		expect(canAccessRt(scope, 1)).toBe(true);
		expect(canAccessRt(scope, 99)).toBe(true);
		expect(canAccessRt(scope, null)).toBe(true);
	});

	it('scope rt hanya boleh RT yang sama', () => {
		const scope = { kind: 'rt', rtId: 1 } as const;
		expect(canAccessRt(scope, 1)).toBe(true);
		expect(canAccessRt(scope, 2)).toBe(false);
		expect(canAccessRt(scope, null)).toBe(false);
	});

	it('scope none selalu ditolak', () => {
		const scope = { kind: 'none' } as const;
		expect(canAccessRt(scope, 1)).toBe(false);
		expect(canAccessRt(scope, null)).toBe(false);
	});
});

describe('requireRtAccess()', () => {
	it('melempar 403 untuk RT lain', () => {
		try {
			requireRtAccess({ kind: 'rt', rtId: 1 }, 2);
			throw new Error('seharusnya melempar');
		} catch (err) {
			expect((err as { status?: number }).status).toBe(403);
		}
	});

	it('lolos untuk RT sendiri', () => {
		expect(() => requireRtAccess({ kind: 'rt', rtId: 1 }, 1)).not.toThrow();
	});
});

describe('requireScope()', () => {
	it('melempar 403 kalau akun belum ditugaskan', () => {
		try {
			requireScope({ kind: 'none' });
			throw new Error('seharusnya melempar');
		} catch (err) {
			expect((err as { status?: number }).status).toBe(403);
		}
	});

	it('mengembalikan scope yang valid', () => {
		expect(requireScope({ kind: 'rt', rtId: 4 })).toEqual({ kind: 'rt', rtId: 4 });
	});
});

describe('visibleRt()', () => {
	const semua = [{ id: 1 }, { id: 2 }, { id: 3 }];

	it('menampilkan semua RT untuk scope all', () => {
		expect(visibleRt({ kind: 'all' }, semua)).toEqual(semua);
	});

	it('menyaring satu RT untuk pengurus', () => {
		expect(visibleRt({ kind: 'rt', rtId: 2 }, semua)).toEqual([{ id: 2 }]);
	});

	it('tidak menampilkan apa pun untuk scope none', () => {
		expect(visibleRt({ kind: 'none' }, semua)).toEqual([]);
	});
});
