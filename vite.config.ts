import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Ikon di-import per-file (`@lucide/svelte/icons/<nama>`) supaya Vite tidak
// membuat satu prebundle 2.6 MB berisi 1.854 ikon. Konsekuensinya, tanpa
// daftar di bawah ini Vite baru menemukan ikon saat halaman dibuka, lalu
// memicu "optimized dependencies changed. reloading" berulang — setiap
// reload membatalkan modul yang sedang dimuat (504 / ERR_ABORTED). Mendaftarkan
// semuanya di sini membuat Vite mengoptimasi sekali saja di awal.
const lucideIcons = [
	'alert-circle', 'arrow-down', 'arrow-down-right', 'arrow-left', 'arrow-right',
	'arrow-up', 'arrow-up-down', 'arrow-up-right', 'ban', 'bar-chart-3',
	'building-2', 'calendar', 'check-circle-2', 'chevron-right', 'circle-alert',
	'circle-check-big', 'clock', 'download', 'ellipsis', 'eye',
	'eye-off', 'file-plus-2', 'file-spreadsheet', 'file-text', 'home',
	'house', 'inbox', 'info', 'loader-2', 'lock',
	'log-out', 'mail', 'megaphone', 'minus', 'pencil',
	'plus', 'qr-code', 'receipt', 'search', 'send',
	'settings-2', 'tags', 'trash-2', 'trending-down', 'trending-up',
	'upload', 'user', 'user-check', 'user-plus', 'users',
	'wallet', 'x'
];

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter()
		})
	],
	optimizeDeps: {
		include: lucideIcons.map((name) => `@lucide/svelte/icons/${name}`)
	}
});
