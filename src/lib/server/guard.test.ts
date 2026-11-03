import { describe, expect, it } from 'vitest';
import {
	enforceAccess,
	landingPathFor,
	matchRouteGroup,
	modulForPath,
	normalizeRole,
	rolesOf,
	tipeOf
} from './guard';
import type { RequestEvent } from '@sveltejs/kit';

const lokal = (role: unknown, izin: Record<string, string[]> = {}) =>
	({
		user: { role },
		izin,
		peranAktif: normalizeRole(role),
		scopePeran: 'all',
		tipePeran: normalizeRole(role).some((nama) => nama === 'warga') ? 'warga' : 'staff'
	}) as unknown as App.Locals;

describe('normalizeRole()', () => {
	it('memecah peran berkoma seperti yang disimpan plugin admin Better Auth', () => {
		expect(normalizeRole('pengurus_rw,pengurus_rt')).toEqual(['pengurus_rw', 'pengurus_rt']);
	});

	it('menerima array, membuang spasi, dan menormalkan huruf', () => {
		expect(normalizeRole([' Warga ', 'Pengurus_RW'])).toEqual(['warga', 'pengurus_rw']);
	});

	it('menerima slug peran dinamis dan membuang nilai yang bukan slug', () => {
		expect(normalizeRole(['pengurus_rw', 'pengurus_rw', 'ketua_lingkungan', ''])).toEqual([
			'pengurus_rw',
			'ketua_lingkungan'
		]);
		expect(normalizeRole(['tamu!', 'dua kata', null])).toEqual([]);
	});

	it('null/undefined menjadi daftar kosong', () => {
		expect(normalizeRole(null)).toEqual([]);
		expect(normalizeRole(undefined)).toEqual([]);
		expect(normalizeRole(42)).toEqual([]);
	});
});

describe('rolesOf() / tipeOf()', () => {
	it('memakai peranAktif yang sudah dihidrasi hooks', () => {
		const locals = lokal('warga');
		expect(rolesOf(locals)).toEqual(['warga']);
	});

	it('fallback ke user.role untuk locals tiruan', () => {
		const locals = { user: { role: 'pengurus_rw' } } as unknown as App.Locals;
		expect(rolesOf(locals)).toEqual(['pengurus_rw']);
		expect(tipeOf(locals)).toBe('staff');
	});

	it('peran dinamis tanpa definisi dianggap warga', () => {
		const locals = { user: { role: 'ketua_lingkungan' } } as unknown as App.Locals;
		expect(tipeOf(locals)).toBe('warga');
	});
});

describe('matchRouteGroup()', () => {
	it('mengenali surface staf beserta sub-path-nya', () => {
		expect(matchRouteGroup('/kk')?.id).toBe('staff');
		expect(matchRouteGroup('/kk/12/edit')?.id).toBe('staff');
		expect(matchRouteGroup('/kas')?.id).toBe('staff');
		expect(matchRouteGroup('/pengaturan/pengguna')?.id).toBe('staff');
	});

	it('mencocokkan per segmen: /pengaturan bukan bagian /pengumuman', () => {
		expect(matchRouteGroup('/pengumuman')?.id).toBe('staff');
		expect(matchRouteGroup('/pengaturan')?.id).toBe('staff');
		expect(matchRouteGroup('/pengumuman-lain')).toBeNull();
	});

	it('mengenali portal warga', () => {
		expect(matchRouteGroup('/portal')?.id).toBe('warga');
		expect(matchRouteGroup('/portal/tagihan')?.id).toBe('warga');
	});

	it('rute publik tidak punya group', () => {
		expect(matchRouteGroup('/login')).toBeNull();
		expect(matchRouteGroup('/api/auth/get-session')).toBeNull();
	});
});

describe('modulForPath()', () => {
	it('memetakan rute ke modul, prefix terpanjang menang', () => {
		expect(modulForPath('/kas/tambah')).toEqual(['kas']);
		expect(modulForPath('/pengaturan/pengguna')).toEqual(['user']);
		expect(modulForPath('/pengaturan/peran')).toEqual(['peran']);
		expect(modulForPath('/pengaturan')).toEqual([
			'rt',
			'pengurus',
			'landing',
			'user',
			'peran'
		]);
	});

	it('dashboard dan halaman publik tidak butuh modul', () => {
		expect(modulForPath('/dashboard')).toBeNull();
		expect(modulForPath('/')).toBeNull();
	});
});

describe('landingPathFor()', () => {
	const locals = (role: unknown) => ({ user: { role } }) as unknown as App.Locals;

	it('warga mendarat di portal', () => {
		expect(landingPathFor(locals('warga'))).toBe('/portal');
	});

	it('staf mendarat di dashboard', () => {
		expect(landingPathFor(locals('pengurus_rw'))).toBe('/dashboard');
		expect(landingPathFor(locals('pengurus_rt'))).toBe('/dashboard');
		expect(landingPathFor(locals('superadmin'))).toBe('/dashboard');
	});

	it('akun tanpa peran default dianggap warga', () => {
		expect(landingPathFor({ user: null } as unknown as App.Locals)).toBe('/portal');
	});
});

describe('enforceAccess() — izin modul', () => {
	const ctx = (pathname: string, locals: App.Locals) =>
		({ locals, url: new URL(`http://localhost${pathname}`) }) as unknown as RequestEvent;

	function tangkap(fn: () => void): { status?: number; location?: string } {
		try {
			fn();
		} catch (err) {
			return err as { status?: number; location?: string };
		}
		throw new Error('seharusnya melempar');
	}

	it('staf tanpa izin kas mendapat 403 saat membuka /kas', () => {
		const locals = lokal('pengurus_rt', { warga: ['read'], iuran: ['read'] });
		expect(tangkap(() => enforceAccess(ctx('/kas', locals))).status).toBe(403);
	});

	it('staf dengan izin baca modul boleh lewat', () => {
		const locals = lokal('pengurus_rw', { kas: ['read'] });
		expect(() => enforceAccess(ctx('/kas', locals))).not.toThrow();
	});

	it('Pengurus RT tidak boleh membuka area Pengaturan meski punya izin baca RT', () => {
		const locals = lokal('pengurus_rt', {
			rt: ['read'],
			pengurus: ['read'],
			user: ['create']
		});
		expect(tangkap(() => enforceAccess(ctx('/pengaturan', locals))).status).toBe(403);
		expect(tangkap(() => enforceAccess(ctx('/pengaturan/rt', locals))).status).toBe(403);
	});

	it('pemegang user:list boleh membuka area Pengaturan', () => {
		const locals = lokal('pengurus_rw', { user: ['list'], rt: ['read'] });
		expect(() => enforceAccess(ctx('/pengaturan', locals))).not.toThrow();
	});

	it('warga di surface staf diarahkan ke portal', () => {
		const locals = lokal('warga', {});
		const hasil = tangkap(() => enforceAccess(ctx('/kas', locals)));
		expect(hasil.status).toBe(302);
		expect(hasil.location).toBe('/portal');
	});
});
