import { describe, expect, it } from 'vitest';
import { hitungPersentase, hitungRekapIuran, hitungSaldo } from './kas';

describe('hitungSaldo()', () => {
	it('menjumlahkan pemasukan dan pengeluaran', () => {
		expect(
			hitungSaldo([
				{ jenis: 'pemasukan', nominal: 36_000 },
				{ jenis: 'pemasukan', nominal: 24_000 },
				{ jenis: 'pengeluaran', nominal: 10_000 }
			])
		).toEqual({ pemasukan: 60_000, pengeluaran: 10_000, saldo: 50_000 });
	});

	it('mengabaikan transaksi yang dibatalkan', () => {
		expect(
			hitungSaldo([
				{ jenis: 'pemasukan', nominal: 50_000 },
				{ jenis: 'pemasukan', nominal: 99_000, dibatalkan: true },
				{ jenis: 'pengeluaran', nominal: 5_000, dibatalkan: true }
			])
		).toEqual({ pemasukan: 50_000, pengeluaran: 0, saldo: 50_000 });
	});

	it('daftar kosong menghasilkan saldo nol', () => {
		expect(hitungSaldo([])).toEqual({ pemasukan: 0, pengeluaran: 0, saldo: 0 });
	});

	it('nominal tidak valid dianggap nol, bukan NaN', () => {
		expect(
			hitungSaldo([
				{ jenis: 'pemasukan', nominal: Number.NaN },
				{ jenis: 'pengeluaran', nominal: 2_500 }
			])
		).toEqual({ pemasukan: 0, pengeluaran: 2_500, saldo: -2_500 });
	});
});

describe('hitungRekapIuran()', () => {
	it('menghitung status dan nominal terkumpul', () => {
		expect(
			hitungRekapIuran([
				{ status: 'lunas', nominal: 36_000 },
				{ status: 'lunas', nominal: 36_000 },
				{ status: 'belum_bayar', nominal: 36_000 },
				{ status: 'sebagian', nominal: 36_000 }
			])
		).toEqual({
			lunas: 2,
			belumBayar: 1,
			sebagian: 1,
			nominalTerkumpul: 72_000,
			targetNominal: 144_000,
			persentase: 50
		});
	});

	it('target nol menghasilkan persentase 0', () => {
		expect(hitungRekapIuran([])).toEqual({
			lunas: 0,
			belumBayar: 0,
			sebagian: 0,
			nominalTerkumpul: 0,
			targetNominal: 0,
			persentase: 0
		});
	});
});

describe('hitungPersentase()', () => {
	it('membulatkan ke bilangan bulat', () => {
		expect(hitungPersentase(1, 3)).toBe(33);
		expect(hitungPersentase(2, 3)).toBe(67);
	});

	it('aman untuk target nol/negatif', () => {
		expect(hitungPersentase(10, 0)).toBe(0);
		expect(hitungPersentase(10, -1)).toBe(0);
	});
});
