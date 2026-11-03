import { error, redirect } from '@sveltejs/kit';
import { bisaAkses, gabungIzin, normalisasiIzin, peranDefault, type Izin } from '$lib/akses';
import { rolesOf } from './guard';

/**
 * Pemeriksaan izin per-aksi (modul + aksi), bukan per route-group.
 *
 * `$lib/server/guard.ts` hanya memutuskan boleh/tidak membuka sebuah halaman.
 * Begitu halaman terbuka, semua staf masih bisa menekan tombol apa pun di
 * dalamnya. Modul ini memakai izin yang dimuat `hooks.server.ts` dari tabel
 * `peran`, jadi aturan hanya ada di database + UI pengaturan peran.
 *
 * Contoh: halaman `/iuran` boleh dibuka `pengurus_rt` (read-only), tapi aksi
 * "catat pembayaran" tetap butuh `iuran:update` yang tidak dimiliki peran itu.
 */

/**
 * Izin efektif milik user.
 *
 * Normalnya `locals.izin` sudah dihitung sekali per request oleh hooks. Kalau
 * belum ada (unit test, kode yang membangun locals tiruan), hitung dari peran
 * default sebagai fallback. Peran dinamis tanpa baris DB tidak punya izin.
 */
export function izinEfektif(locals: App.Locals): Izin {
	if (locals.izin) return normalisasiIzin(locals.izin);
	return gabungIzin(...rolesOf(locals).map((nama) => peranDefault(nama)?.permissions));
}

/**
 * Apakah sebuah izin mengizinkan aksi tertentu.
 *
 * `superadmin` selalu penuh: kalau akun membawa peran superadmin, `locals.izin`
 * sudah berisi seluruh izin. Fallback di sini menjaga perilaku itu walau
 * locals dibangun manual di test.
 */
export function can(izin: Izin | null | undefined, resource: string, action: string): boolean {
	return bisaAkses(normalisasiIzin(izin), resource, action);
}

/** Lempar 401/403 kalau user tidak punya izin. Dipanggil di awal setiap aksi mutasi. */
export function requirePermission(locals: App.Locals, resource: string, action: string): void {
	if (!locals.user) throw redirect(302, '/login');

	if (!can(izinEfektif(locals), resource, action)) {
		throw error(403, `Anda tidak punya izin "${action}" pada modul ${resource}.`);
	}
}

/** Versi non-throwing untuk dipakai di `load()` saat menyembunyikan tombol. */
export function permissionsOf(locals: App.Locals) {
	const izin = izinEfektif(locals);
	return {
		canCreate: (resource: string) => can(izin, resource, 'create'),
		canUpdate: (resource: string) => can(izin, resource, 'update'),
		canDelete: (resource: string) => can(izin, resource, 'delete'),
		can: (resource: string, action: string) => can(izin, resource, action)
	};
}
