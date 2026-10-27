import { describe, expect, it } from 'vitest';
import { landingPathFor, matchRouteGroup, normalizeRole } from './guard';

describe('normalizeRole()', () => {
	it('memecah role berkoma seperti yang disimpan plugin admin Better Auth', () => {
		expect(normalizeRole('admin_rw,pengurus_rt')).toEqual(['admin_rw', 'pengurus_rt']);
	});

	it('menerima array dan membuang spasi', () => {
		expect(normalizeRole([' warga ', 'bendahara'])).toEqual(['warga', 'bendahara']);
	});

	it('membuang role tak dikenal dan duplikat', () => {
		expect(normalizeRole(['admin_rw', 'admin_rw', 'tamu', ''])).toEqual(['admin_rw']);
	});

	it('null/undefined menjadi daftar kosong', () => {
		expect(normalizeRole(null)).toEqual([]);
		expect(normalizeRole(undefined)).toEqual([]);
		expect(normalizeRole(42)).toEqual([]);
	});
});

describe('matchRouteGroup()', () => {
	it('mengenali surface staf beserta sub-path-nya', () => {
		expect(matchRouteGroup('/warga')?.id).toBe('staff');
		expect(matchRouteGroup('/warga/12/edit')?.id).toBe('staff');
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

describe('landingPathFor()', () => {
	const locals = (role: string) => ({ user: { role } }) as unknown as App.Locals;

	it('warga mendarat di portal', () => {
		expect(landingPathFor(locals('warga'))).toBe('/portal');
	});

	it('staf mendarat di dashboard', () => {
		expect(landingPathFor(locals('admin_rw'))).toBe('/dashboard');
		expect(landingPathFor(locals('pengurus_rt'))).toBe('/dashboard');
	});

	it('tanpa user dianggap staf (guard lain yang menolak)', () => {
		expect(landingPathFor({ user: null } as unknown as App.Locals)).toBe('/dashboard');
	});
});
