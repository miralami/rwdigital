import { describe, expect, it } from 'vitest';
import {
	bolehDitagihKeRt,
	jatuhTempoPeriode,
	kkAktifDari,
	menunggak,
	ringkasGenerate
} from './iuran';

describe('kkAktifDari()', () => {
	it('hanya menghitung KK yang punya anggota aktif', () => {
		expect(
			kkAktifDari([
				{ kkId: 1, rtId: 1, aktif: true },
				{ kkId: 1, rtId: 1, aktif: false },
				{ kkId: 2, rtId: 2, aktif: false },
				{ kkId: 3, rtId: 2, aktif: null }
			])
		).toEqual(new Map([[1, 1]]));
	});

	it('daftar kosong menghasilkan peta kosong', () => {
		expect(kkAktifDari([])).toEqual(new Map());
	});
});

describe('bolehDitagihKeRt()', () => {
	const dasar = { nominal: 36_000, porsiRw: 5_000 };

	it('jenis RT yang aktif boleh ditagihkan per RT', () => {
		expect(bolehDitagihKeRt({ ...dasar, scope: 'rt', aktif: true })).toBe(true);
	});

	it('jenis milik RW tidak ditagihkan lewat RT', () => {
		expect(bolehDitagihKeRt({ ...dasar, scope: 'rw', aktif: true })).toBe(false);
	});

	it('jenis nonaktif tidak ditagihkan', () => {
		expect(bolehDitagihKeRt({ ...dasar, scope: 'rt', aktif: false })).toBe(false);
	});
});

describe('jatuhTempoPeriode()', () => {
	it('mengambil tanggal 10 pada bulan periode', () => {
		expect(jatuhTempoPeriode('2026-10')).toBe('2026-10-10');
	});

	it('periode tidak valid tidak punya jatuh tempo', () => {
		expect(jatuhTempoPeriode('2026-13')).toBeNull();
		expect(jatuhTempoPeriode('oktober')).toBeNull();
	});
});

describe('menunggak()', () => {
	it('belum lunas dan lewat tanggal 10 dihitung menunggak', () => {
		expect(menunggak('belum_bayar', '2026-10-10', '2026-10-11')).toBe(true);
	});

	it('tepat pada tanggal jatuh tempo belum menunggak', () => {
		expect(menunggak('belum_bayar', '2026-10-10', '2026-10-10')).toBe(false);
	});

	it('lunas tidak pernah menunggak', () => {
		expect(menunggak('lunas', '2026-10-10', '2026-12-31')).toBe(false);
	});

	it('tanpa jatuh tempo tidak dianggap menunggak', () => {
		expect(menunggak('sebagian', null, '2026-12-31')).toBe(false);
	});
});

describe('ringkasGenerate()', () => {
	it('total = jumlah KK aktif × nominal per jenis', () => {
		expect(
			ringkasGenerate(8, [
				{ nominal: 36_000, porsiRw: 5_000 },
				{ nominal: 5_000, porsiRw: 0 }
			])
		).toEqual({
			jumlahTagihan: 16,
			totalNominal: 328_000,
			totalPorsiRw: 40_000
		});
	});

	it('tanpa KK atau tanpa jenis tidak membuat tagihan', () => {
		expect(ringkasGenerate(0, [{ nominal: 36_000, porsiRw: 0 }])).toEqual({
			jumlahTagihan: 0,
			totalNominal: 0,
			totalPorsiRw: 0
		});
		expect(ringkasGenerate(5, [])).toEqual({
			jumlahTagihan: 0,
			totalNominal: 0,
			totalPorsiRw: 0
		});
	});
});
