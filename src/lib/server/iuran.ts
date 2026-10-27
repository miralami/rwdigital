/**
 * Aturan murni seputar iuran & tagihan (tanpa akses DB).
 *
 * Dipisahkan dari route supaya aturan yang sama dipakai di load, generate,
 * dan test. Semua fungsi menerima baris apa adanya dan tidak melakukan query.
 */

export type BarisWargaKk = {
	kkId: number;
	rtId: number;
	aktif: boolean | null;
};

/** Jenis iuran yang relevan untuk perhitungan tagihan. */
export type JenisTagihan = {
	nominal: number;
	porsiRw: number;
	scope: 'rw' | 'rt' | string;
	aktif: boolean | null;
};

/**
 * KK dianggap aktif kalau masih punya minimal satu anggota berstatus aktif.
 *
 * KK yang seluruh anggotanya sudah nonaktif (pindah/meninggal) tidak perlu
 * ditagih lagi. Hasilnya `Map<kkId, rtId>` agar pemanggil bisa menyaring
 * sekaligus tahu wilayah tiap KK.
 */
export function kkAktifDari(rows: readonly BarisWargaKk[]): Map<number, number> {
	const hasil = new Map<number, number>();

	for (const row of rows) {
		if (row.aktif === true) hasil.set(row.kkId, row.rtId);
	}

	return hasil;
}

/**
 * Jenis iuran boleh digenerate per RT hanya bila aktif dan scope-nya 'rt'.
 * Jenis milik RW tidak ditagihkan lewat RT.
 */
export function bolehDitagihKeRt(jenis: JenisTagihan): boolean {
	return jenis.aktif !== false && jenis.scope === 'rt';
}

export type RingkasanGenerate = {
	jumlahTagihan: number;
	totalNominal: number;
	totalPorsiRw: number;
};

/**
 * Hitung berapa tagihan yang akan dibuat untuk sejumlah KK aktif × jenis.
 * Nominal & porsi diambil dari konfigurasi jenis saat ini (snapshot nanti
 * disimpan di tiap baris tagihan).
 */
export function ringkasGenerate(
	jumlahKkAktif: number,
	jenis: readonly Pick<JenisTagihan, 'nominal' | 'porsiRw'>[]
): RingkasanGenerate {
	const kk = Math.max(0, Math.trunc(jumlahKkAktif));
	let totalNominal = 0;
	let totalPorsiRw = 0;

	for (const item of jenis) {
		totalNominal += (Number(item.nominal) || 0) * kk;
		totalPorsiRw += (Number(item.porsiRw) || 0) * kk;
	}

	return {
		jumlahTagihan: kk * jenis.length,
		totalNominal,
		totalPorsiRw
	};
}
