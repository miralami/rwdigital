import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const trustedOrigins = (env.BETTER_AUTH_TRUSTED_ORIGINS ?? '')
		.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean);
	const forwardedHosts = trustedOrigins.map((origin) => new URL(origin).hostname);

	return {
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
		server: {
			allowedHosts: [
				'2fdf-2001-448a-2002-1493-45ac-99c0-191b-7566.ngrok-free.app',
				...forwardedHosts
			]
		}
	};
});