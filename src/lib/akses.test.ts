import { describe, expect, it } from 'vitest';
import {
	MODUL,
	PERAN_DEFAULT,
	bisaAkses,
	gabungIzin,
	izinPenuh,
	normalisasiIzin,
	peranDefault
} from './akses';

describe('akses — katalog modul & izin default', () => {
	it('setiap izin default hanya berisi modul/aksi yang dikenal', () => {
		for (const peran of PERAN_DEFAULT) {
			expect(normalisasiIzin(peran.permissions)).toEqual(peran.permissions);
		}
	});

	it('admin_rw adalah satu-satunya superadmin dengan izin penuh', () => {
		const superadmin = PERAN_DEFAULT.filter((p) => p.superadmin);

		expect(superadmin.map((p) => p.nama)).toEqual(['admin_rw']);
		expect(superadmin[0].permissions).toEqual(izinPenuh());
		expect(superadmin[0].scope).toBe('all');
	});

	it('pengurus_rt dibatasi ke RT dan tidak melihat kas RW', () => {
		const peran = peranDefault('pengurus_rt');

		expect(peran?.scope).toBe('rt');
		expect(bisaAkses(peran?.permissions, 'kas', 'read')).toBe(false);
		expect(bisaAkses(peran?.permissions, 'warga', 'update')).toBe(true);
	});

	it('warga hanya mendapat izin portal', () => {
		const peran = peranDefault('warga');

		expect(peran?.tipe).toBe('warga');
		expect(peran?.scope).toBe('none');
		expect(normalisasiIzin(peran?.permissions)).toEqual({
			pengumuman: ['read'],
			surat: ['read', 'create'],
			iuran: ['read'],
			landing: ['read']
		});
	});

	it('normalisasiIzin membuang modul/aksi tak dikenal dan duplikat', () => {
		const hasil = normalisasiIzin({
			warga: ['read', 'read', 'terbang'],
			modulAsing: ['read'],
			kas: 'bukan-array'
		});

		expect(hasil).toEqual({ warga: ['read'] });
	});

	it('bisaAkses fail-closed untuk izin kosong', () => {
		expect(bisaAkses(null, 'warga', 'read')).toBe(false);
		expect(bisaAkses({}, 'warga', 'read')).toBe(false);
		expect(bisaAkses({ warga: ['read'] }, 'warga', 'delete')).toBe(false);
	});

	it('gabungIzin menggabungkan aksi dari beberapa role', () => {
		expect(gabungIzin({ warga: ['read'] }, { warga: ['update'], kas: ['read'] })).toEqual({
			warga: ['read', 'update'],
			kas: ['read']
		});
	});

	it('setiap modul punya label dan minimal satu aksi', () => {
		for (const modul of MODUL) {
			expect(modul.label.length).toBeGreaterThan(0);
			expect(modul.aksi.length).toBeGreaterThan(0);
		}
	});
});
