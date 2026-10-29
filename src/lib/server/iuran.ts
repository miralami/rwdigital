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

/**
 * Tanggal jatuh tempo tagihan untuk sebuah periode (D4).
 *
 * Kesepakatan sementara: tagihan terbit di awal bulan dan jatuh tempo tanggal
 * 10, mengikuti kebiasaan iuran lingkungan di Indonesia. Karena tanggalnya
 * adalah kebijakan, nilainya disimpan per tagihan (bukan dihitung ulang saat
 * dibaca), sehingga perubahan kebijakan tidak menggeser tagihan lama.
 */
export function jatuhTempoPeriode(periode: string): string | null {
	if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(periode)) return null;
	return `${periode}-10`;
}

/**
 * Tagihan dianggap menunggak bila belum lunas dan sudah melewati jatuh tempo.
 * Tanggal dibandingkan sebagai string ISO (`YYYY-MM-DD`) supaya bebas zona waktu.
 */
export function menunggak(
	status: string,
	jatuhTempo: string | null | undefined,
	hariIni: string
): boolean {
	if (status === 'lunas') return false;
	if (!jatuhTempo) return false;
	return jatuhTempo < hariIni.slice(0, 10);
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
