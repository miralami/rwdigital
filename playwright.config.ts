import { defineConfig, devices } from '@playwright/test';

/**
 * Konfigurasi E2E.
 *
 * Server dev dipakai apa adanya supaya asersi mencerminkan perilaku nyata
 * (guard, sesi Better Auth, dan data lokal). Port 5173 dipilih karena
 * `baseURL` Better Auth hanya mengizinkan localhost:5173.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  // Satu worker: semua tes berbagi satu database lokal, jadi hindari balapan.
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- --port 5173',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
