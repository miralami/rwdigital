import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { enforceAccess, normalizeRole } from '$lib/server/guard';
import { db } from '$lib/server/db';
import { peran, petugasRt } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
import {
	gabungIzin,
	izinPenuh,
	normalisasiIzin,
	peranDefault,
	type Izin,
	type ScopePeran,
	type TipePeran
} from '$lib/akses';
import type { Handle } from '@sveltejs/kit';

const URUTAN_SCOPE: Record<ScopePeran, number> = { none: 0, rt: 1, all: 2 };

function scopeTerluas(a: ScopePeran, b: ScopePeran): ScopePeran {
	return URUTAN_SCOPE[b] > URUTAN_SCOPE[a] ? b : a;
}

/**
 * Hydrate session + izin dinamis dari tabel `peran` sekali per request.
 *
 * Semua route memakai hasil yang sama (`locals.izin`, `locals.scopePeran`,
 * `locals.tipePeran`), jadi halaman, API, dan tombol tidak bisa berbeda
 * pendapat. Peran yang tidak punya baris DB dan bukan peran default otomatis
 * tidak mendapat izin apa pun (fail-closed).
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Populate session on every request
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	event.locals.user = session?.user ?? null;
	event.locals.session = session?.session ?? null;

	// Default aman: tanpa session / tanpa peran = tanpa izin.
	event.locals.peranAktif = [];
	event.locals.izin = {};
	event.locals.scopePeran = 'none';
	event.locals.tipePeran = 'warga';
	event.locals.petugasRtId = null;

	if (session?.user) {
		const slugs = normalizeRole(session.user.role);
		event.locals.peranAktif = slugs;

		const baris =
			slugs.length > 0
				? await db
						.select({
							nama: peran.nama,
							tipe: peran.tipe,
							scope: peran.scope,
							permissions: peran.permissions,
							superadmin: peran.superadmin
						})
						.from(peran)
						.where(inArray(peran.nama, slugs))
				: [];

		const perBaris = new Map(baris.map((item) => [item.nama, item]));

		let izin: Izin = {};
		let scope: ScopePeran = 'none';
		let tipe: TipePeran = 'warga';
		let superadmin = false;

		for (const slug of slugs) {
			const dariDb = perBaris.get(slug);
			const bawaan = dariDb ? undefined : peranDefault(slug);
			const definisi = dariDb ?? bawaan;
			if (!definisi) continue;

			if (definisi.superadmin) superadmin = true;
			izin = gabungIzin(izin, normalisasiIzin(definisi.permissions));
			scope = scopeTerluas(scope, definisi.scope);
			if (definisi.tipe === 'staff') tipe = 'staff';
		}

		// Superadmin selalu penuh, walau barisnya sempat disunting manual.
		if (superadmin) {
			izin = izinPenuh();
			scope = 'all';
			tipe = 'staff';
		}

		event.locals.izin = izin;
		event.locals.scopePeran = scope;
		event.locals.tipePeran = tipe;

		// Penugasan RT hanya relevan untuk peran ber-scope `rt`. Query dijalankan
		// sekali per request supaya semua route memakai scope yang sama.
		if (scope === 'rt') {
			const [tugas] = await db
				.select({ rtId: petugasRt.rtId })
				.from(petugasRt)
				.where(eq(petugasRt.userId, session.user.id))
				.limit(1);
			event.locals.petugasRtId = tugas?.rtId ?? null;
		}
	}

	// Guard global. Klasifikasi rute + modul yang boleh diakses ada di
	// `$lib/server/guard` — dipanggil di sini, bukan di tiap route, supaya
	// `+page.svelte` atau `+page.server.ts` baru ikut terlindungi otomatis.
	// Rute publik (`/login`, `/api/auth/**`) tidak ada di daftar guard.
	//
	// `locals.user` dan izin sudah terisi di atas, jadi guard tidak memanggil
	// getSession lagi.
	enforceAccess(event);

	return svelteKitHandler({ event, resolve, auth, building });
};
