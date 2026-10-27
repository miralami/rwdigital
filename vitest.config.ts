import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

// Unit test memakai plugin SvelteKit supaya alias `$lib` dan `$app/*` tetap
// tersedia. Test yang ada difokuskan pada modul murni (izin, guard, hitungan
// kas) sehingga tidak perlu database maupun browser.
export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'node',
		clearMocks: true
	}
});
