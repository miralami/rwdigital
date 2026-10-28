import { describe, expect, it } from 'vitest';
import { porsiTerkumpul, ringkasSetoran, sisaPorsi } from './setoran';

describe('porsiTerkumpul()', () => {
	it('belum dibayar berarti belum ada porsi', () => {
		expect(porsiTerkumpul(36_000, 5_000, 0)).toBe(0);
	});

	it('dibayar penuh mengambil porsi penuh', () => {
		expect(porsiTerkumpul(36_000, 5_000, 36_000)).toBe(5_000);
	});

	it('dibayar sebagian mengambil porsi proporsional', () => {
		expect(porsiTerkumpul(36_000, 5_000, 18_000)).toBe(2_500);
	});

	it('tidak pernah melebihi porsi walau dibayar berlebih', () => {
		expect(porsiTerkumpul(36_000, 5_000, 50_000)).toBe(5_000);
	});

	it('porsi nol tetap nol', () => {
		expect(porsiTerkumpul(36_000, 0, 36_000)).toBe(0);
	});
});

describe('ringkasSetoran()', () => {
	it('menjumlahkan uang terkumpul dan porsi RW', () => {
		expect(
			ringkasSetoran([
				{ nominal: 36_000, porsiRw: 5_000, totalDibayar: 36_000, status: 'lunas' },
				{ nominal: 5_000, porsiRw: 0, totalDibayar: 2_000, status: 'sebagian' },
				{ nominal: 10_000, porsiRw: 1_000, totalDibayar: 0, status: 'belum_bayar' }
			])
		).toEqual({ totalTerkumpul: 38_000, porsiRw: 5_000, jumlahTagihan: 3, jumlahLunas: 1 });
	});

	it('daftar kosong menghasilkan nol', () => {
		expect(ringkasSetoran([])).toEqual({
			totalTerkumpul: 0,
			porsiRw: 0,
			jumlahTagihan: 0,
			jumlahLunas: 0
		});
	});
});

describe('sisaPorsi()', () => {
	it('mengurangi porsi dengan yang sudah disetor', () => {
		expect(sisaPorsi(5_000, 2_000)).toBe(3_000);
	});

	it('tidak pernah negatif', () => {
		expect(sisaPorsi(5_000, 7_000)).toBe(0);
	});
});
