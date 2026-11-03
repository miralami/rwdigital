import { describe, expect, it } from 'vitest';
import { can, izinEfektif } from './rbac';
import { gabungIzin, izinPenuh, peranDefault } from '$lib/akses';

const izin = (...roles: string[]) =>
	gabungIzin(...roles.map((nama) => peranDefault(nama)?.permissions));

describe('can() — matriks izin per aksi', () => {
	it('pengurus_rw punya akses penuh ke modul inti', () => {
		const admin = izin('pengurus_rw');

		expect(can(admin, 'warga', 'create')).toBe(true);
		expect(can(admin, 'warga', 'delete')).toBe(true);
		expect(can(admin, 'kas', 'delete')).toBe(true);
		expect(can(admin, 'iuran', 'create')).toBe(true);
		expect(can(admin, 'pengurus', 'update')).toBe(true);
		expect(can(admin, 'user', 'list')).toBe(true);
		expect(can(admin, 'peran', 'delete')).toBe(true);
	});

	it('superadmin punya izin penuh yang sama', () => {
		const akses = izin('superadmin');
		expect(akses).toEqual(izinPenuh());
	});

	it('pengurus_rt mengelola modul RT-nya, termasuk Kas RT, tanpa Pengaturan', () => {
		const akses = izin('pengurus_rt');

		expect(can(akses, 'warga', 'create')).toBe(true);
		expect(can(akses, 'warga', 'delete')).toBe(true);
		expect(can(akses, 'kas', 'read')).toBe(true);
		expect(can(akses, 'kas', 'create')).toBe(true);
		expect(can(akses, 'iuran', 'create')).toBe(true);
		expect(can(akses, 'pengumuman', 'create')).toBe(true);
		expect(can(akses, 'surat', 'update')).toBe(true);
		// Pengaturan tetap milik RW; `user:create` hanya untuk membuat akun warga.
		expect(can(akses, 'user', 'create')).toBe(true);
		expect(can(akses, 'user', 'list')).toBe(false);
		expect(can(akses, 'peran', 'read')).toBe(false);
	});

	it('warga hanya boleh membaca pengumuman/iuran dan mengajukan surat', () => {
		const akses = izin('warga');

		expect(can(akses, 'pengumuman', 'read')).toBe(true);
		expect(can(akses, 'surat', 'create')).toBe(true);
		expect(can(akses, 'surat', 'read')).toBe(true);
		expect(can(akses, 'warga', 'read')).toBe(false);
		expect(can(akses, 'kas', 'read')).toBe(false);
	});

	it('role kosong atau tidak dikenal selalu ditolak (fail-closed)', () => {
		expect(can({}, 'warga', 'read')).toBe(false);
		expect(can(undefined, 'warga', 'read')).toBe(false);
		expect(can(izin('tamu'), 'warga', 'read')).toBe(false);
	});

	it('gabungan role memakai OR: cukup satu role yang mengizinkan', () => {
		const akses = izin('warga', 'pengurus_rt');

		expect(can(akses, 'kas', 'create')).toBe(true);
		expect(can(akses, 'surat', 'create')).toBe(true);
	});

	it('izinEfektif() memakai locals.izin bila sudah dihidrasi', () => {
		const locals = {
			user: { role: 'warga' },
			izin: { kas: ['read'] }
		} as unknown as App.Locals;

		expect(can(izinEfektif(locals), 'kas', 'read')).toBe(true);
		expect(can(izinEfektif(locals), 'warga', 'read')).toBe(false);
	});
});
