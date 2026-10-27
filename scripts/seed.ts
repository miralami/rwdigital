import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { eq, isNull } from 'drizzle-orm';
import { ac, roles } from '../src/lib/permissions';
import {
	rw,
	rt,
	kk,
	warga,
	kategoriKas,
	transaksiKas,
	transaksiKasRt,
	jenisIuran,
	paketIuran,
	paketIuranItem,
	tagihan,
	pengurus,
	petugasRt
} from '../src/lib/server/db/schema';

// ─── Load .env ────────────────────────────────────────────────────────────────
const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
	const envContent = readFileSync(envPath, 'utf8');
	for (const line of envContent.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const eqIndex = trimmed.indexOf('=');
		if (eqIndex === -1) continue;
		const key = trimmed.slice(0, eqIndex).trim();
		const value = trimmed
			.slice(eqIndex + 1)
			.trim()
			.replace(/^["']|["']$/g, '');
		if (!(key in process.env)) {
			process.env[key] = value;
		}
	}
}

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL ?? 'file:local.db';
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN ?? '';

// ─── Auth instance ────────────────────────────────────────────────────────────
const auth = betterAuth({
	database: {
		dialect: new LibsqlDialect({
			url: TURSO_DATABASE_URL,
			authToken: TURSO_AUTH_TOKEN
		}),
		type: 'sqlite'
	},
	emailAndPassword: { enabled: true },
	plugins: [
		admin({
			ac,
			roles,
			defaultRole: 'warga',
			adminRoles: ['admin_rw']
		})
	]
});

// ─── DB client ────────────────────────────────────────────────────────────────
const client = createClient({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN
});
const db = drizzle(client, {
	schema: {
		rw,
		rt,
		kk,
		warga,
		kategoriKas,
		transaksiKas,
		transaksiKasRt,
		jenisIuran,
		paketIuran,
		paketIuranItem,
		tagihan,
		pengurus
	}
});

// ─── Seed config ─────────────────────────────────────────────────────────────
const ADMIN_EMAIL = 'admin@rw.id';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Admin RW';

// ─── Main ────────────────────────────────────────────────────────────────────
async function seed() {
	console.log('=== Seed Sistem Informasi RW ===\n');

	// 1. Create admin user
	console.log('1. Membuat user admin...');

	let userId: string;

	try {
		const userResult = await client.execute({
			sql: 'SELECT id FROM user WHERE email = ?',
			args: [ADMIN_EMAIL]
		});
		const existingUser = userResult.rows[0] as { id: string } | undefined;

		if (existingUser) {
			console.log(`   User dengan email ${ADMIN_EMAIL} sudah ada, skip.`);
			userId = existingUser.id;
		} else {
			const result = await auth.api.signUpEmail({
				body: {
					email: ADMIN_EMAIL,
					password: ADMIN_PASSWORD,
					name: ADMIN_NAME
				}
			});
			userId = result.user.id;
			console.log(`   User admin dibuat: ${ADMIN_EMAIL} (id: ${userId})`);
		}
	} catch (e) {
		console.error(`   Gagal membuat user admin: ${e}`);
		throw e;
	}

	// 2. Set admin role
	console.log('2. Mengatur role admin_rw...');
	try {
		await auth.api.setRole({
			body: {
				userId,
				role: 'admin_rw'
			},
			headers: new Headers()
		});
		console.log('   Role admin_rw berhasil diatur.');
	} catch (e) {
		try {
			await client.execute({
				sql: 'UPDATE user SET role = ? WHERE id = ?',
				args: ['admin_rw', userId]
			});
			console.log('   Role admin_rw berhasil diatur via database.');
		} catch (dbErr) {
			console.error(`   Gagal mengatur role via database: ${dbErr}`);
		}
	}

	// 3. Create default RW record
	console.log('3. Membuat data RW default...');
	let rwId: number;

	try {
		const existingRw = await db.select().from(rw).limit(1);

		if (existingRw.length > 0) {
			console.log(`   RW sudah ada: ${existingRw[0].nama}, skip.`);
			rwId = existingRw[0].id;
		} else {
			const [insertedRw] = await db
				.insert(rw)
				.values({
					nama: 'RW 06 Kota Baru',
					alamat: 'Jl. Merpati Putih No. 12',
					kelurahan: 'Kelurahan Kota Baru',
					kecamatan: 'Kecamatan Bekasi Barat',
					kota: 'Kota Bekasi'
				})
				.returning();
			rwId = insertedRw.id;
			console.log(`   RW default dibuat: RW 06 Kota Baru (id: ${rwId})`);
		}
	} catch (e) {
		console.error(`   Gagal membuat RW: ${e}`);
		throw e;
	}

	// 4. Create RT records (RT 01 s/d RT 04)
	console.log('4. Melengkapi data RT (RT 01 - RT 04)...');
	const rtMap = new Map<number, number>(); // nomor RT -> id RT
	const existingRts = await db.select().from(rt).where(eq(rt.rwId, rwId));

	let rtBaru = 0;
	for (const nomor of [1, 2, 3, 4]) {
		const sudahAda = existingRts.find((r) => r.nomor === nomor);
		if (sudahAda) {
			rtMap.set(nomor, sudahAda.id);
			continue;
		}
		const [insertedRt] = await db.insert(rt).values({ nomor, rwId }).returning();
		rtMap.set(nomor, insertedRt.id);
		rtBaru += 1;
	}

	console.log(
		rtBaru > 0
			? `   ${rtBaru} RT baru dibuat, total ${rtMap.size} RT siap dipakai.`
			: `   Semua RT (${rtMap.size}) sudah ada.`
	);

	// 5. Create default kategori kas (pos pengeluaran & pos penerimaan)
	console.log('5. Membuat kategori kas & pos anggaran...');
	const existingKategori = await db.select().from(kategoriKas).where(eq(kategoriKas.rwId, rwId));

	const kategoriSeed = [
		{ nama: 'Iuran Wajib RT', jenis: 'pemasukan' as const, scope: 'rt' as const },
		{ nama: 'Kas Sosial Kematian', jenis: 'pemasukan' as const, scope: 'rt' as const },
		{ nama: 'Donasi & Sumbangan', jenis: 'pemasukan' as const, scope: 'semua' as const },
		{ nama: 'Iuran Kebersihan & Sampah', jenis: 'pemasukan' as const, scope: 'rt' as const },
		{ nama: 'Iuran Keamanan (K3)', jenis: 'pemasukan' as const, scope: 'rt' as const },
		{ nama: 'Iuran Sosial Kematian (Soskem)', jenis: 'pemasukan' as const, scope: 'rt' as const },
		{ nama: 'Iuran Air Bersih', jenis: 'pemasukan' as const, scope: 'rt' as const },
		{ nama: 'Sumbangan Kematian Warga', jenis: 'pemasukan' as const, scope: 'rt' as const },
		{ nama: 'Setoran RT ke RW', jenis: 'pemasukan' as const, scope: 'rw' as const },
		{ nama: 'Operasional RW', jenis: 'pengeluaran' as const, scope: 'rw' as const },
		{ nama: 'Santunan Kematian RT', jenis: 'pengeluaran' as const, scope: 'rt' as const },
		{ nama: 'Operasional RT', jenis: 'pengeluaran' as const, scope: 'rt' as const },
		{ nama: 'Pemeliharaan Sarana / Tenda', jenis: 'pengeluaran' as const, scope: 'semua' as const },
		{ nama: 'Kegiatan Warga / PHBI', jenis: 'pengeluaran' as const, scope: 'semua' as const }
	];

	// Backfill per nama: DB lama hanya punya sebagian pos, dan menambah pos
	// baru tidak boleh menyentuh kategori yang sudah dipakai transaksi.
	const namaKategoriAda = new Set(existingKategori.map((k) => k.nama));
	const kategoriBaru = kategoriSeed.filter((k) => !namaKategoriAda.has(k.nama));

	if (kategoriBaru.length > 0) {
		await db.insert(kategoriKas).values(kategoriBaru.map((k) => ({ ...k, rwId })));
		console.log(`   ${kategoriBaru.length} kategori kas baru dibuat (total ${kategoriSeed.length} pos).`);
	} else {
		console.log(`   Semua ${kategoriSeed.length} kategori kas sudah ada.`);
	}

	// 6. Create sample KK & Warga
	console.log('6. Mengecek data KK & Warga...');
	const existingKk = await db.select().from(kk).limit(1);

	if (existingKk.length === 0 && rtMap.size > 0) {
		const sampleKkData = [
			{ noKk: '3276010101000001', alamat: 'Jl. Merpati No. 1', rtNomor: 1, nama: 'Bambang Supriyanto', nik: '3276010101800001' },
			{ noKk: '3276010101000002', alamat: 'Jl. Merpati No. 3', rtNomor: 1, nama: 'Agus Setiawan', nik: '3276010101850002' },
			{ noKk: '3276010101000003', alamat: 'Jl. Merpati No. 5', rtNomor: 1, nama: 'Hendra Gunawan', nik: '3276010101880003' },
			{ noKk: '3276010101000004', alamat: 'Jl. Kutilang No. 2', rtNomor: 2, nama: 'Siti Rahmawati', nik: '3276010101900004' },
			{ noKk: '3276010101000005', alamat: 'Jl. Kutilang No. 4', rtNomor: 2, nama: 'Eko Prasetyo', nik: '3276010101820005' },
			{ noKk: '3276010101000006', alamat: 'Jl. Kenari No. 7', rtNomor: 3, nama: 'Dedi Kurniawan', nik: '3276010101790006' },
			{ noKk: '3276010101000007', alamat: 'Jl. Kenari No. 9', rtNomor: 3, nama: 'Wahyudi Santoso', nik: '3276010101860007' },
			{ noKk: '3276010101000008', alamat: 'Jl. Cendrawasih No. 12', rtNomor: 4, nama: 'Ahmad Fauzi', nik: '3276010101910008' }
		];

		const kkIds: number[] = [];
		for (const item of sampleKkData) {
			const rtIdVal = rtMap.get(item.rtNomor)!;
			const [insertedKk] = await db
				.insert(kk)
				.values({
					noKk: item.noKk,
					alamat: item.alamat,
					rtId: rtIdVal,
					statusHuni: 'tetap'
				})
				.returning();

			kkIds.push(insertedKk.id);

			await db.insert(warga).values({
				nik: item.nik,
				nama: item.nama,
				tempatLahir: 'Depok',
				tanggalLahir: '1985-05-15',
				jenisKelamin: 'L',
				agama: 'Islam',
				pendidikan: 'S1',
				pekerjaan: 'Karyawan Swasta',
				statusPerkawinan: 'kawin',
				statusHubunganKk: 'kepala_keluarga',
				kkId: insertedKk.id,
				aktif: true
			});
		}
		console.log(`   ${sampleKkData.length} KK & Warga sampel berhasil dibuat.`);

		// 7. Create sample Jenis Iuran & Tagihan untuk rekapitulasi iuran RT
		console.log('7. Membuat jenis iuran & tagihan sampel...');
		const [iuranWajib] = await db
			.insert(jenisIuran)
			.values({
				nama: 'Iuran Wajib Warga RT',
				nominal: 50000,
				periode: 'bulanan',
				aktif: true,
				rwId
			})
			.returning();

		// Buat tagihan periode 2026-10
		for (let i = 0; i < kkIds.length; i++) {
			const status = i % 2 === 0 ? 'lunas' : 'belum_bayar';
			await db.insert(tagihan).values({
				kkId: kkIds[i],
				jenisIuranId: iuranWajib.id,
				periode: '2026-10',
				nominal: 50000,
				status
			});
		}
		console.log('   Tagihan sampel iuran RT dibuat.');
	} else {
		console.log('   Data KK sudah ada.');
	}

	// 7b. Akun demo untuk setiap role + tautkan akun warga ke data kependudukan
	console.log('7b. Menyiapkan akun demo per role...');

	async function pastikanAkun(
		email: string,
		password: string,
		name: string,
		role: string
	): Promise<string> {
		const found = await client.execute({
			sql: 'SELECT id FROM user WHERE email = ?',
			args: [email]
		});
		let id = (found.rows[0] as { id: string } | undefined)?.id;

		if (!id) {
			const res = await auth.api.signUpEmail({ body: { email, password, name } });
			id = res.user.id;
			console.log(`   Akun dibuat: ${email} (${role})`);
		} else {
			console.log(`   Akun sudah ada: ${email}`);
		}

		// Role di-set langsung di DB: `setRole` butuh sesi admin, sedangkan seed
		// berjalan tanpa sesi.
		await client.execute({ sql: 'UPDATE user SET role = ? WHERE id = ?', args: [role, id] });
		return id;
	}

	const akunWargaId = await pastikanAkun('warga@rw.id', 'warga123', 'Warga Contoh', 'warga');
	const akunPengurusId = await pastikanAkun('pengurus@rw.id', 'pengurus123', 'Pengurus RT 01', 'pengurus_rt');
	await pastikanAkun('bendahara@rw.id', 'bendahara123', 'Bendahara RW', 'bendahara');

	// Tugaskan akun pengurus ke RT 01. Tanpa baris ini, scoping fail-closed
	// membuat akun pengurus tidak bisa melihat data RT mana pun.
	const rt01Id = rtMap.get(1);
	if (rt01Id) {
		const [tugasLama] = await db
			.select()
			.from(petugasRt)
			.where(eq(petugasRt.userId, akunPengurusId))
			.limit(1);

		if (!tugasLama) {
			await db.insert(petugasRt).values({ userId: akunPengurusId, rtId: rt01Id });
			console.log('   Akun pengurus@rw.id ditugaskan ke RT 01.');
		} else if (tugasLama.rtId !== rt01Id) {
			await db.update(petugasRt).set({ rtId: rt01Id }).where(eq(petugasRt.id, tugasLama.id));
			console.log('   Penugasan pengurus@rw.id diperbarui ke RT 01.');
		}
	}

	// Tautkan akun warga ke warga pertama yang belum punya akun — tapi hanya
	// kalau akun itu belum tertaut ke siapa pun. Tanpa cek ini, seed yang
	// dijalankan berulang akan menautkan satu akun ke banyak baris warga.
	const [sudahTertaut] = await db
		.select({ id: warga.id, nama: warga.nama })
		.from(warga)
		.where(eq(warga.userId, akunWargaId))
		.limit(1);

	if (sudahTertaut) {
		console.log(`   Akun warga@rw.id sudah tertaut ke ${sudahTertaut.nama}.`);
	} else {
		const [wargaBelumTertaut] = await db
			.select({ id: warga.id, nama: warga.nama })
			.from(warga)
			.where(isNull(warga.userId))
			.limit(1);

		if (wargaBelumTertaut) {
			await db
				.update(warga)
				.set({ userId: akunWargaId })
				.where(eq(warga.id, wargaBelumTertaut.id));
			console.log(`   Akun warga@rw.id ditautkan ke ${wargaBelumTertaut.nama}.`);
		} else {
			console.log('   Tidak ada warga tanpa akun untuk ditautkan.');
		}
	}

	// 7c. Preset jenis iuran & paket — nominal dan porsi adalah DATA, bukan
	// konstanta kode, supaya bendahara bisa mengubahnya tanpa deploy. Nilai
	// awal mengikuti catatan stakeholder (K3 36k, Soskem 5k, Santunan 10k);
	// porsi RW dibiarkan 0 karena keputusan D3 belum dikunci.
	console.log('7c. Menyiapkan preset jenis iuran & paket...');
	const presetJenis = [
		{ nama: 'Iuran Keamanan (K3)', nominal: 36000, porsiRw: 0, periode: 'bulanan' as const, urutan: 1 },
		{ nama: 'Iuran Sosial Kematian (Soskem)', nominal: 5000, porsiRw: 0, periode: 'bulanan' as const, urutan: 2 },
		{ nama: 'Santunan Kematian Warga', nominal: 10000, porsiRw: 0, periode: 'insidental' as const, urutan: 3 }
	];
	const jenisTersedia = await db.select().from(jenisIuran);
	const idJenis = new Map(jenisTersedia.map((j) => [j.nama, j.id]));

	for (const preset of presetJenis) {
		if (idJenis.has(preset.nama)) continue;
		const [baru] = await db
			.insert(jenisIuran)
			.values({ ...preset, scope: 'rt', rtId: null, aktif: true, rwId })
			.returning();
		idJenis.set(preset.nama, baru.id);
	}

	const presetPaket = [
		{
			nama: 'Iuran Wajib RT',
			keterangan: 'K3 + Soskem, ditagih setiap bulan.',
			isi: ['Iuran Keamanan (K3)', 'Iuran Sosial Kematian (Soskem)']
		},
		{
			nama: 'Santunan Kematian',
			keterangan: 'Ditagih insidental saat ada warga meninggal.',
			isi: ['Santunan Kematian Warga']
		}
	];
	const paketTersedia = await db.select().from(paketIuran);

	for (const preset of presetPaket) {
		if (paketTersedia.some((p) => p.nama === preset.nama)) continue;
		const [paket] = await db
			.insert(paketIuran)
			.values({ nama: preset.nama, keterangan: preset.keterangan, aktif: true, rwId })
			.returning();

		const item = preset.isi.flatMap((nama, index) => {
			const jenisIuranId = idJenis.get(nama);
			return jenisIuranId ? [{ paketId: paket.id, jenisIuranId, urutan: index }] : [];
		});
		if (item.length > 0) await db.insert(paketIuranItem).values(item);
	}
	console.log(`   ${presetJenis.length} jenis & ${presetPaket.length} paket preset siap.`);

	// 8. Sample Transaksi Kas RW
	console.log('8. Mengecek transaksi Kas RW...');
	const existingKasRw = await db.select().from(transaksiKas).limit(1);
	if (existingKasRw.length === 0) {
		await db.insert(transaksiKas).values([
			{
				jenis: 'pemasukan',
				nominal: 3500000,
				keterangan: 'Bantuan Dana Operasional RW dari Kelurahan',
				tanggal: '2026-10-01',
				dicatatOleh: 'Bendahara RW',
				rwId
			},
			{
				jenis: 'pengeluaran',
				nominal: 750000,
				keterangan: 'Pengadaan ATK & Surat-Menyurat Sekretariat RW',
				tanggal: '2026-10-05',
				dicatatOleh: 'Bendahara RW',
				rwId
			},
			{
				jenis: 'pengeluaran',
				nominal: 500000,
				keterangan: 'Konsumsi Rapat Pleno Koordinasi Pengurus RT/RW',
				tanggal: '2026-10-12',
				dicatatOleh: 'Bendahara RW',
				rwId
			}
		]);
		console.log('   Transaksi Kas RW sampel berhasil dibuat.');
	} else {
		console.log('   Transaksi Kas RW sudah ada.');
	}

	// 9. Sample Transaksi Kas RT (KU-01: Kas Mandiri per RT)
	console.log('9. Mengecek transaksi Kas RT mandiri...');
	const existingKasRt = await db.select().from(transaksiKasRt).limit(1);
	if (existingKasRt.length === 0 && rtMap.size > 0) {
		const rt1 = rtMap.get(1)!;
		const rt2 = rtMap.get(2)!;
		const rt3 = rtMap.get(3)!;

		await db.insert(transaksiKasRt).values([
			{
				rtId: rt1,
				namaKas: 'Kas Sosial Kematian',
				jenis: 'pemasukan',
				nominal: 1200000,
				keterangan: 'Iuran Kas Sosial Kematian RT 01 (Bulan Oktober 2026)',
				tanggal: '2026-10-02',
				dicatatOleh: 'Bendahara RT 01'
			},
			{
				rtId: rt1,
				namaKas: 'Kas Sosial Kematian',
				jenis: 'pengeluaran',
				nominal: 500000,
				keterangan: 'Santunan duka cita & bunga pemakaman Alm. Bpk. Supardi RT 01',
				tanggal: '2026-10-10',
				dicatatOleh: 'Bendahara RT 01'
			},
			{
				rtId: rt1,
				namaKas: 'Kas Operasional RT',
				jenis: 'pemasukan',
				nominal: 800000,
				keterangan: 'Penerimaan dana kas operasional lingkungan RT 01',
				tanggal: '2026-10-04',
				dicatatOleh: 'Bendahara RT 01'
			},
			{
				rtId: rt2,
				namaKas: 'Kas Rukun Kematian',
				jenis: 'pemasukan',
				nominal: 950000,
				keterangan: 'Iuran Rukun Kematian RT 02 Periode Oktober',
				tanggal: '2026-10-03',
				dicatatOleh: 'Pengurus RT 02'
			},
			{
				rtId: rt2,
				namaKas: 'Kas Operasional RT',
				jenis: 'pengeluaran',
				nominal: 250000,
				keterangan: 'Perbaikan lampu penerangan gang RT 02',
				tanggal: '2026-10-08',
				dicatatOleh: 'Pengurus RT 02'
			},
			{
				rtId: rt3,
				namaKas: 'Kas Sosial Kematian',
				jenis: 'pemasukan',
				nominal: 1100000,
				keterangan: 'Saldo awal kas sosial kematian RT 03',
				tanggal: '2026-10-01',
				dicatatOleh: 'Bendahara RT 03'
			}
		]);
		console.log('   Transaksi Kas RT sampel berhasil dibuat.');
	} else {
		console.log('   Transaksi Kas RT sudah ada.');
	}

	// 10. Data pengurus (bagan RW & tiap RT)
	console.log('10. Mengecek data pengurus...');
	const existingPengurus = await db.select().from(pengurus).limit(1);

	if (existingPengurus.length === 0) {
		const barisPengurus: {
			rtId: number | null;
			jabatan: string;
			nama: string;
			urutan: number;
		}[] = [
			{ rtId: null, jabatan: 'Ketua RW', nama: 'H. Sutrisno', urutan: 1 },
			{ rtId: null, jabatan: 'Sekretaris RW', nama: 'Dian Puspita', urutan: 2 },
			{ rtId: null, jabatan: 'Bendahara RW', nama: 'Rina Marlina', urutan: 3 }
		];

		const ketuaPerRt: [number, string][] = [
			[1, 'Bambang Supriyanto'],
			[2, 'Siti Rahmawati'],
			[3, 'Dedi Kurniawan'],
			[4, 'Ahmad Fauzi']
		];

		for (const [nomor, nama] of ketuaPerRt) {
			const rtId = rtMap.get(nomor);
			if (rtId) {
				barisPengurus.push({
					rtId,
					jabatan: `Ketua RT ${String(nomor).padStart(2, '0')}`,
					nama,
					urutan: 1
				});
			}
		}

		await db.insert(pengurus).values(barisPengurus);
		console.log(`   ${barisPengurus.length} data pengurus dibuat.`);
	} else {
		console.log('   Data pengurus sudah ada.');
	}

	console.log('\n=== Seed selesai ===');
	console.log('\nCredentials:');
	console.log(`  ${'Email'.padEnd(20)} ${'Password'.padEnd(14)} Role`);
	console.log(`  ${'admin@rw.id'.padEnd(20)} ${'admin123'.padEnd(14)} admin_rw`);
	console.log(`  ${'bendahara@rw.id'.padEnd(20)} ${'bendahara123'.padEnd(14)} bendahara`);
	console.log(`  ${'pengurus@rw.id'.padEnd(20)} ${'pengurus123'.padEnd(14)} pengurus_rt`);
	console.log(`  ${'warga@rw.id'.padEnd(20)} ${'warga123'.padEnd(14)} warga (tertaut ke 1 KK)`);
}

seed().catch((error) => {
	console.error('\nError saat seed:', error);
	process.exit(1);
});
