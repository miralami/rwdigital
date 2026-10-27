import { test, expect, type Page } from '@playwright/test';

/**
 * Smoke test lintas role.
 *
 * Fokusnya bukan detail tampilan, melainkan aturan yang mudah rusak tanpa
 * disadari: siapa boleh masuk ke surface mana, dan apakah scope RT benar-benar
 * membatasi angka di dashboard.
 */

const AKUN = {
  admin: { email: 'admin@rw.id', password: 'admin123' },
  bendahara: { email: 'bendahara@rw.id', password: 'bendahara123' },
  pengurus: { email: 'pengurus@rw.id', password: 'pengurus123' },
  warga: { email: 'warga@rw.id', password: 'warga123' }
} as const;

async function login(page: Page, akun: { email: string; password: string }) {
  await page.goto('/login');
  await page.getByLabel('Alamat Email').fill(akun.email);
  await page.getByLabel('Kata Sandi').fill(akun.password);
  await page.getByRole('button', { name: /Masuk ke Sistem/ }).click();
  await page.waitForURL(/\/(dashboard|portal)/);
}

test('landing publik bisa dibuka tanpa login', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('RW 06');
  await expect(page.getByRole('link', { name: /masuk/i }).first()).toBeVisible();
});

test('tamu diarahkan ke login saat membuka halaman internal', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/);

  await page.goto('/pengaturan');
  await expect(page).toHaveURL(/\/login/);
});

test.describe('login per role', () => {
  test('admin RW mendarat di dashboard dengan kas RW', async ({ page }) => {
    await login(page, AKUN.admin);

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Saldo kas RW')).toBeVisible();
    await expect(page.getByText(/Menampilkan data/)).toHaveCount(0);
  });

  test('bendahara melihat kas RW dan tidak dibatasi RT', async ({ page }) => {
    await login(page, AKUN.bendahara);

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Saldo kas RW')).toBeVisible();
  });

  test('pengurus RT melihat data RT tugasnya saja', async ({ page }) => {
    await login(page, AKUN.pengurus);

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/Menampilkan data/)).toContainText('RT 01');
    await expect(page.getByText('Saldo kas RT')).toBeVisible();
  });

  test('warga mendarat di portal dan tidak bisa membuka dashboard', async ({ page }) => {
    await login(page, AKUN.warga);

    await expect(page).toHaveURL(/\/portal/);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/portal/);

    await page.goto('/pengaturan');
    await expect(page).toHaveURL(/\/portal/);
  });

  test('warga bisa membuka rincian tagihan & pembayaran', async ({ page }) => {
    await login(page, AKUN.warga);

    await page.goto('/portal/iuran');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Tagihan');
    await expect(page.getByRole('heading', { name: 'Rincian tagihan' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Riwayat pembayaran' })).toBeVisible();
  });
});

test('menu pengguna terkunci untuk role tanpa izin', async ({ page }) => {
  await login(page, AKUN.pengurus);
  await page.goto('/pengaturan/pengguna');

  await expect(page).toHaveURL(/\/pengaturan\/pengguna/);
  await expect(page.getByText('Hanya admin RW yang bisa mengelola akun pengguna.')).toBeVisible();
});
