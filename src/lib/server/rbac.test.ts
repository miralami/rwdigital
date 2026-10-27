import { describe, expect, it } from 'vitest';
import { can } from './rbac';
import type { Role } from '$lib/permissions';

describe('can() — matriks izin per aksi', () => {
	it('admin_rw punya akses penuh ke modul inti', () => {
		const roles: Role[] = ['admin_rw'];

		expect(can(roles, 'warga', 'create')).toBe(true);
		expect(can(roles, 'warga', 'delete')).toBe(true);
		expect(can(roles, 'kas', 'delete')).toBe(true);
		expect(can(roles, 'iuran', 'create')).toBe(true);
		expect(can(roles, 'pengurus', 'update')).toBe(true);
		expect(can(roles, 'user', 'list')).toBe(true);
	});

	it('pengurus_rt boleh membaca kas, tapi tidak boleh mencatat', () => {
		const roles: Role[] = ['pengurus_rt'];

		expect(can(roles, 'warga', 'create')).toBe(true);
		expect(can(roles, 'kas', 'read')).toBe(true);
		expect(can(roles, 'kas', 'create')).toBe(false);
		expect(can(roles, 'kas', 'update')).toBe(false);
		expect(can(roles, 'iuran', 'create')).toBe(false);
		expect(can(roles, 'user', 'list')).toBe(false);
	});

	it('bendahara mengelola keuangan, tapi data warga hanya dibaca', () => {
		const roles: Role[] = ['bendahara'];

		expect(can(roles, 'iuran', 'create')).toBe(true);
		expect(can(roles, 'kas', 'update')).toBe(true);
		expect(can(roles, 'warga', 'read')).toBe(true);
		expect(can(roles, 'warga', 'update')).toBe(false);
		expect(can(roles, 'warga', 'delete')).toBe(false);
	});

	it('warga hanya boleh membaca pengumuman/iuran dan mengajukan surat', () => {
		const roles: Role[] = ['warga'];

		expect(can(roles, 'pengumuman', 'read')).toBe(true);
		expect(can(roles, 'surat', 'create')).toBe(true);
		expect(can(roles, 'surat', 'read')).toBe(true);
		expect(can(roles, 'warga', 'read')).toBe(false);
		expect(can(roles, 'kas', 'read')).toBe(false);
	});

	it('role kosong atau tidak dikenal selalu ditolak (fail-closed)', () => {
		expect(can([], 'warga', 'read')).toBe(false);
		expect(can(['tamu' as Role], 'warga', 'read')).toBe(false);
	});

	it('gabungan role memakai OR: cukup satu role yang mengizinkan', () => {
		const roles: Role[] = ['warga', 'bendahara'];

		expect(can(roles, 'kas', 'create')).toBe(true);
		expect(can(roles, 'surat', 'create')).toBe(true);
	});
});
