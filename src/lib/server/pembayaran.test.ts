import { describe, expect, it } from 'vitest';
import { hitungSisa, ringkasTagihan, statusTagihan } from './pembayaran';

describe('statusTagihan()', () => {
	it('belum dibayar sama sekali', () => {
		expect(statusTagihan(36_000, 0)).toBe('belum_bayar');
	});

	it('dibayar sebagian', () => {
		expect(statusTagihan(36_000, 20_000)).toBe('sebagian');
	});

	it('lunas saat pas atau lebih', () => {
		expect(statusTagihan(36_000, 36_000)).toBe('lunas');
		expect(statusTagihan(36_000, 40_000)).toBe('lunas');
	});

	it('tahan selisih floating point', () => {
		expect(statusTagihan(36_000, 35_999.99999999)).toBe('lunas');
		expect(hitungSisa(36_000, 36_000.00000001)).toBe(0);
	});
});

describe('hitungSisa()', () => {
	it('mengurangi nominal dengan total dibayar', () => {
		expect(hitungSisa(36_000, 20_000)).toBe(16_000);
	});

	it('tidak pernah negatif', () => {
		expect(hitungSisa(36_000, 50_000)).toBe(0);
	});
});

describe('ringkasTagihan()', () => {
	it('menjumlahkan tagihan dan sisa hanya dari yang belum lunas', () => {
		expect(
			ringkasTagihan([
				{ nominal: 36_000, totalDibayar: 36_000, status: 'lunas' },
				{ nominal: 5_000, totalDibayar: 0, status: 'belum_bayar' },
				{ nominal: 10_000, totalDibayar: 4_000, status: 'sebagian' }
			])
		).toEqual({ totalTagihan: 51_000, totalDibayar: 40_000, sisa: 11_000, jumlahBelumLunas: 2 });
	});

	it('daftar kosong menghasilkan nol', () => {
		expect(ringkasTagihan([])).toEqual({
			totalTagihan: 0,
			totalDibayar: 0,
			sisa: 0,
			jumlahBelumLunas: 0
		});
	});
});
