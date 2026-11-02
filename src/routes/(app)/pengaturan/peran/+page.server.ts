import { db } from '$lib/server/db';
import { peran } from '$lib/server/db/schema';
import { asc, eq, sql } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { LABEL_AKSI, MODUL, normalisasiIzin, type Izin } from '$lib/akses';
import { permissionsOf, requirePermission } from '$lib/server/rbac';
import { normalizeRole } from '$lib/server/guard';
import type { PageServerLoad, Actions } from './$types';

/**
 * Pengaturan peran & izin.
 *
 * Peran disimpan di tabel `peran`, bukan di kode. Halaman ini satu-satunya
 * tempat yang boleh menulis tabel tersebut, sehingga superadmin bisa membuat
 * peran baru dan mengubah matriks izin tanpa deploy ulang.
 *
 * Aturan yang dijaga di sini:
 * - slug hanya boleh huruf kecil/angka/underscore/strip dan tidak bisa diubah
 *   setelah dibuat, karena slug itu yang disimpan di `user.role`;
 * - peran `superadmin` tidak bisa diubah/dihapus (izinnya selalu penuh);
 * - peran `sistem` boleh diubah izinnya tapi tidak boleh dihapus;
 * - peran yang masih dipakai akun tidak boleh dihapus, supaya tidak ada akun
 *   yang tiba-tiba kehilangan seluruh akses.
 */

const POLA_SLUG = /^[a-z0-9][a-z0-9_-]*$/;

const TIPE_VALID = ['staff', 'warga'] as const;
const SCOPE_VALID = ['all', 'rt', 'none'] as const;

type Tipe = (typeof TIPE_VALID)[number];
type Scope = (typeof SCOPE_VALID)[number];

/** Ambil centang matriks izin dari form: `izin_<modul>` = daftar aksi. */
function izinDariForm(formData: FormData): Izin {
	const hasil: Izin = {};

	for (const modul of MODUL) {
		const aksi = formData
			.getAll(`izin_${modul.key}`)
			.map((item) => String(item))
			.filter((item) => (modul.aksi as readonly string[]).includes(item));

		if (aksi.length > 0) hasil[modul.key] = [...new Set(aksi)];
	}

	// `normalisasiIzin` membuang modul/aksi tak dikenal, jadi data lama yang
	// menyimpan nama modul usang tidak bisa menyelundup lewat form.
	return normalisasiIzin(hasil);
}

type MetaPeran = { label: string; deskripsi: string | null; tipe: Tipe; scope: Scope };

function metaDariForm(formData: FormData): { data?: MetaPeran; error?: string } {
	const label = String(formData.get('label') ?? '').trim();
	const deskripsi = String(formData.get('deskripsi') ?? '').trim();
	const tipe = String(formData.get('tipe') ?? '');
	const scope = String(formData.get('scope') ?? '');

	if (!label) return { error: 'Nama tampilan peran wajib diisi.' };
	if (label.length > 60) return { error: 'Nama tampilan maksimal 60 karakter.' };
	if (deskripsi.length > 300) return { error: 'Deskripsi maksimal 300 karakter.' };
	if (!(TIPE_VALID as readonly string[]).includes(tipe)) {
		return { error: 'Tipe peran tidak dikenal.' };
	}
	if (!(SCOPE_VALID as readonly string[]).includes(scope)) {
		return { error: 'Batas data peran tidak dikenal.' };
	}

	return {
		data: {
			label,
			deskripsi: deskripsi || null,
			tipe: tipe as Tipe,
			scope: scope as Scope
		}
	};
}

/** Hitung berapa akun yang memakai tiap slug peran. */
async function jumlahPenggunaPerPeran(): Promise<Record<string, number>> {
	const baris = await db.all<{ role: string | null }>(sql`SELECT role FROM user`);
	const hitung: Record<string, number> = {};

	for (const row of baris) {
		for (const slug of normalizeRole(row.role)) {
			hitung[slug] = (hitung[slug] ?? 0) + 1;
		}
	}

	return hitung;
}

export const load: PageServerLoad = async ({ locals }) => {
	requirePermission(locals, 'peran', 'read');

	const izin = permissionsOf(locals);
	const daftar = await db.select().from(peran).orderBy(asc(peran.urutan), asc(peran.nama));
	const hitung = await jumlahPenggunaPerPeran();

	return {
		daftarPeran: daftar.map((item) => ({
			id: item.id,
			nama: item.nama,
			label: item.label,
			deskripsi: item.deskripsi,
			tipe: item.tipe,
			scope: item.scope,
			permissions: normalisasiIzin(item.permissions),
			sistem: item.sistem,
			superadmin: item.superadmin,
			urutan: item.urutan,
			jumlahPengguna: hitung[item.nama] ?? 0
		})),
		modul: MODUL,
		labelAksi: LABEL_AKSI,
		akses: {
			create: izin.can('peran', 'create'),
			update: izin.can('peran', 'update'),
			delete: izin.can('peran', 'delete')
		}
	};
};

export const actions: Actions = {
	tambah: async ({ request, locals }) => {
		requirePermission(locals, 'peran', 'create');

		const formData = await request.formData();
		const nama = String(formData.get('nama') ?? '').trim().toLowerCase();

		if (!nama) {
			return fail(400, { error: 'Slug peran wajib diisi.' });
		}
		if (nama.length > 40) {
			return fail(400, { error: 'Slug peran maksimal 40 karakter.' });
		}
		if (!POLA_SLUG.test(nama)) {
			return fail(400, {
				error:
					'Slug hanya boleh huruf kecil, angka, garis bawah, atau strip, dan diawali huruf/angka.'
			});
		}

		const meta = metaDariForm(formData);
		if (!meta.data) return fail(400, { error: meta.error ?? 'Data peran tidak valid.' });

		const [sudahAda] = await db
			.select({ id: peran.id })
			.from(peran)
			.where(eq(peran.nama, nama))
			.limit(1);
		if (sudahAda) {
			return fail(400, { error: `Slug "${nama}" sudah dipakai peran lain.` });
		}

		const [urutanRow] = await db
			.select({ urutan: sql<number>`COALESCE(MAX(${peran.urutan}), 0)` })
			.from(peran);

		await db.insert(peran).values({
			nama,
			label: meta.data.label,
			deskripsi: meta.data.deskripsi,
			tipe: meta.data.tipe,
			scope: meta.data.scope,
			permissions: izinDariForm(formData),
			sistem: false,
			superadmin: false,
			urutan: Number(urutanRow?.urutan ?? 0) + 1
		});

		return { sukses: `Peran "${meta.data.label}" dibuat.` };
	},

	ubah: async ({ request, locals }) => {
		requirePermission(locals, 'peran', 'update');

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!Number.isInteger(id) || id <= 0) {
			return fail(400, { error: 'ID peran tidak valid.' });
		}

		const [target] = await db.select().from(peran).where(eq(peran.id, id)).limit(1);
		if (!target) {
			return fail(404, { error: 'Peran tidak ditemukan.' });
		}
		if (target.superadmin) {
			return fail(400, {
				error: 'Peran superadmin selalu punya akses penuh dan tidak bisa diubah.'
			});
		}

		const meta = metaDariForm(formData);
		if (!meta.data) return fail(400, { error: meta.error ?? 'Data peran tidak valid.' });

		await db
			.update(peran)
			.set({
				label: meta.data.label,
				deskripsi: meta.data.deskripsi,
				tipe: meta.data.tipe,
				scope: meta.data.scope,
				permissions: izinDariForm(formData),
				updatedAt: new Date().toISOString()
			})
			.where(eq(peran.id, id));

		return { sukses: `Peran "${meta.data.label}" diperbarui.` };
	},

	hapus: async ({ request, locals }) => {
		requirePermission(locals, 'peran', 'delete');

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!Number.isInteger(id) || id <= 0) {
			return fail(400, { error: 'ID peran tidak valid.' });
		}

		const [target] = await db.select().from(peran).where(eq(peran.id, id)).limit(1);
		if (!target) {
			return fail(404, { error: 'Peran tidak ditemukan.' });
		}
		if (target.superadmin) {
			return fail(400, { error: 'Peran superadmin tidak bisa dihapus.' });
		}
		if (target.sistem) {
			return fail(400, {
				error: 'Peran bawaan sistem tidak bisa dihapus. Ubah izinnya bila perlu.'
			});
		}

		const hitung = await jumlahPenggunaPerPeran();
		const dipakai = hitung[target.nama] ?? 0;
		if (dipakai > 0) {
			return fail(400, {
				error: `Peran ini masih dipakai ${dipakai} akun. Pindahkan akunnya ke peran lain lebih dulu.`
			});
		}

		await db.delete(peran).where(eq(peran.id, id));

		return { sukses: `Peran "${target.label}" dihapus.` };
	}
};
