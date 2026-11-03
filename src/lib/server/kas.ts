/**
 * Hitungan kas & iuran yang murni (tanpa akses DB).
 *
 * Dipisahkan dari `routes/(app)/kas/+page.server.ts` supaya aturan angka yang
 * sama dipakai di load, rekap, dan test. Semua fungsi di sini menerima baris
 * apa adanya dan tidak melakukan query.
 */

export type BarisKas = {
	jenis: 'pemasukan' | 'pengeluaran' | string;
	nominal: number;
	dibatalkan?: boolean | null;
};

export type RingkasanSaldo = {
	pemasukan: number;
	pengeluaran: number;
	saldo: number;
};

/** Jumlahkan pemasukan/pengeluaran, abaikan baris yang dibatalkan. */
export function hitungSaldo(rows: readonly BarisKas[]): RingkasanSaldo {
	let pemasukan = 0;
	let pengeluaran = 0;

	for (const row of rows) {
		if (row.dibatalkan) continue;

		const nominal = Number(row.nominal) || 0;
		if (row.jenis === 'pemasukan') pemasukan += nominal;
		if (row.jenis === 'pengeluaran') pengeluaran += nominal;
	}

	return { pemasukan, pengeluaran, saldo: pemasukan - pengeluaran };
}

export type BarisTagihan = {
	status: 'belum_bayar' | 'lunas' | 'sebagian' | string;
	nominal: number;
};

export type RekapIuran = {
	lunas: number;
	belumBayar: number;
	sebagian: number;
	nominalTerkumpul: number;
	targetNominal: number;
	persentase: number;
};

/**
 * Rekap tagihan satu periode.
 *
 * `nominalTerkumpul` hanya menghitung tagihan yang sudah lunas supaya sama
 * dengan laporan kas: uang dianggap masuk setelah status tagihan final.
 */
export function hitungRekapIuran(rows: readonly BarisTagihan[]): RekapIuran {
	let lunas = 0;
	let belumBayar = 0;
	let sebagian = 0;
	let nominalTerkumpul = 0;
	let targetNominal = 0;

	for (const row of rows) {
		const nominal = Number(row.nominal) || 0;
		targetNominal += nominal;

		if (row.status === 'lunas') {
			lunas += 1;
			nominalTerkumpul += nominal;
		} else if (row.status === 'belum_bayar') {
			belumBayar += 1;
		} else if (row.status === 'sebagian') {
			sebagian += 1;
		}
	}

	return {
		lunas,
		belumBayar,
		sebagian,
		nominalTerkumpul,
		targetNominal,
		persentase: hitungPersentase(nominalTerkumpul, targetNominal)
	};
}

/** Persentase bulat 0-100; target 0 menghasilkan 0, bukan NaN. */
export function hitungPersentase(terkumpul: number, target: number): number {
	if (!target || target <= 0) return 0;
	return Math.round((terkumpul / target) * 100);
}
