import { describe, expect, it } from 'vitest';
import { can, izinEfektif } from './rbac';
import { gabungIzin, izinPenuh, peranDefault } from '$lib/akses';

const izin = (...roles: string[]) =>
	gabungIzin(...roles.map((nama) => peranDefault(nama)?.permissions));

describe('can() — matriks izin per aksi', () => {
	it('admin_rw punya akses penuh ke modul inti', () => {
		const admin = izinPenuh();

		expect(can(admin, 'warga', 'create')).toBe(true);
		expect(can(admin, 'warga', 'delete')).toBe(true);
		expect(can(admin, 'kas', 'delete')).toBe(true);
		expect(can(admin, 'iuran', 'create')).toBe(true);
		expect(can(admin, 'pengurus', 'update')).toBe(true);
		expect(can(admin, 'user', 'list')).toBe(true);
		expect(can(admin, 'peran', 'delete')).toBe(true);
	});

	it('pengurus_rt mengelola warga RT-nya dan tidak menyentuh kas', () => {
		const akses = izin('pengurus_rt');

		expect(can(akses, 'warga', 'create')).toBe(true);
		expect(can(akses, 'warga', 'delete')).toBe(false);
		expect(can(akses, 'kas', 'read')).toBe(false);
		expect(can(akses, 'kas', 'create')).toBe(false);
		expect(can(akses, 'iuran', 'read')).toBe(true);
		expect(can(akses, 'iuran', 'create')).toBe(false);
		expect(can(akses, 'user', 'list')).toBe(false);
	});

	it('bendahara mengelola keuangan, tapi data warga hanya dibaca', () => {
		const akses = izin('bendahara');

		expect(can(akses, 'iuran', 'create')).toBe(true);
		expect(can(akses, 'kas', 'update')).toBe(true);
		expect(can(akses, 'warga', 'read')).toBe(true);
		expect(can(akses, 'warga', 'update')).toBe(false);
		expect(can(akses, 'warga', 'delete')).toBe(false);
	});

	it('ketua_rw membaca semua modul dan boleh menyetujui surat', () => {
		const akses = izin('ketua_rw');

		expect(can(akses, 'warga', 'read')).toBe(true);
		expect(can(akses, 'kas', 'read')).toBe(true);
		expect(can(akses, 'surat', 'update')).toBe(true);
		expect(can(akses, 'surat', 'delete')).toBe(false);
		expect(can(akses, 'warga', 'create')).toBe(false);
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
		const akses = izin('warga', 'bendahara');

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
