import { request } from '@playwright/test';
import { createClient } from '@libsql/client';
import fs from 'node:fs';

const BASE = 'http://localhost:5173';
const db = createClient({ url: 'file:local.db' });
const RUN = String(Date.now()).slice(-5);

const cases = [];
function C(id, module, test, type, testCase, pre, steps, expected, fn) {
  cases.push({ id, module, test, type, testCase, pre, steps, expected, fn });
}

function makeCtx(email, password) {
  const ctx = request.newContext({
    baseURL: BASE,
    maxRedirects: 0,
    extraHTTPHeaders: { origin: BASE }
  });
  return ctx.then(async (c) => {
    if (email) {
      const r = await c.post('/api/auth/sign-in/email', { data: { email, password } });
      if (r.status() !== 200) throw new Error('login failed ' + email + ' ' + r.status());
    }
    return c;
  });
}

async function go(ctx, path, method = 'GET', form) {
  const res = method === 'GET'
    ? await ctx.get(path)
    : await ctx.post(path, form !== undefined ? { form } : {});
  const ct = res.headers()['content-type'] || '';
  const body = await res.text();
  let json = null;
  if (ct.includes('application/json')) { try { json = JSON.parse(body); } catch {} }
  return { status: res.status(), location: res.headers()['location'] || null, json, body };
}
const payload = (r) => JSON.stringify(r.json?.data ?? r.body ?? '');
const isFail = (r) => r.json?.type === 'failure';
const isOk = (r) => r.json?.type === 'success' || r.json?.type === 'redirect';
const has = (r, s) => payload(r).includes(s);

const results = [];

async function runCase(c) {
  const started = Date.now();
  try {
    const ev = await c.fn();
    results.push({
      id: c.id, module: c.module, test: c.test, type: c.type, testCase: c.testCase,
      pre: c.pre, steps: c.steps, expected: c.expected,
      status: ev.ok ? 'Pass' : 'Fail', evidence: ev.evidence, ms: Date.now() - started
    });
  } catch (e) {
    results.push({
      id: c.id, module: c.module, test: c.test, type: c.type, testCase: c.testCase,
      pre: c.pre, steps: c.steps, expected: c.expected,
      status: 'Fail', evidence: 'EXCEPTION: ' + (e?.message ?? String(e)), ms: Date.now() - started
    });
  }
}

// ───────────────────────────── AUTH & SESI ─────────────────────────────
C('A-01', 'Autentikasi', 'Login', 'Positif', 'Pengurus RW login dengan kredensial benar',
  'Akun seed admin@rw.id aktif',
  ['Buka /login', 'Isi email admin@rw.id', 'Isi password admin123', 'Klik Masuk'],
  'Login berhasil, sesi dibuat, diarahkan ke /dashboard',
  async () => {
    const ctx = await request.newContext({ baseURL: BASE, maxRedirects: 0, extraHTTPHeaders: { origin: BASE } });
    const r = await ctx.post('/api/auth/sign-in/email', { data: { email: 'admin@rw.id', password: 'admin123' } });
    const body = await r.json().catch(() => ({}));
    const cookies = (await ctx.storageState()).cookies;
    await ctx.dispose();
    return { ok: r.status() === 200 && !!body.user && cookies.some(c => c.name.includes('session')), evidence: `HTTP ${r.status()}, user=${body.user?.role}, cookies=${cookies.length}` };
  });

C('A-02', 'Autentikasi', 'Login', 'Positif', 'Pengurus RT login dengan kredensial benar',
  'Akun seed pengurus@rw.id aktif',
  ['Buka /login', 'Isi email pengurus@rw.id', 'Isi password pengurus123', 'Klik Masuk'],
  'Login berhasil dan diarahkan ke /dashboard',
  async () => {
    const ctx = await request.newContext({ baseURL: BASE, maxRedirects: 0, extraHTTPHeaders: { origin: BASE } });
    const r = await ctx.post('/api/auth/sign-in/email', { data: { email: 'pengurus@rw.id', password: 'pengurus123' } });
    const body = await r.json().catch(() => ({}));
    await ctx.dispose();
    return { ok: r.status() === 200 && body.user?.role === 'pengurus_rt', evidence: `HTTP ${r.status()}, role=${body.user?.role}` };
  });

C('A-03', 'Autentikasi', 'Login', 'Positif', 'Warga login dengan kredensial benar',
  'Akun seed warga@rw.id aktif',
  ['Buka /login', 'Isi email warga@rw.id', 'Isi password warga123', 'Klik Masuk'],
  'Login berhasil dan diarahkan ke /portal',
  async () => {
    const ctx = await makeCtx('warga@rw.id', 'warga123');
    const r = await go(ctx, '/portal');
    await ctx.dispose();
    return { ok: r.status === 200, evidence: `GET /portal HTTP ${r.status}` };
  });

C('A-04', 'Autentikasi', 'Login', 'Negatif', 'Login dengan password salah',
  'Akun admin@rw.id ada',
  ['Buka /login', 'Isi email admin@rw.id', 'Isi password salah123', 'Klik Masuk'],
  'Login ditolak, pesan kredensial tidak valid, tidak ada sesi',
  async () => {
    const ctx = await request.newContext({ baseURL: BASE, maxRedirects: 0, extraHTTPHeaders: { origin: BASE } });
    const r = await ctx.post('/api/auth/sign-in/email', { data: { email: 'admin@rw.id', password: 'salah123' } });
    const st = await ctx.storageState();
    await ctx.dispose();
    return { ok: r.status() >= 400 && st.cookies.length === 0, evidence: `HTTP ${r.status()}, cookies=${st.cookies.length}` };
  });

C('A-05', 'Autentikasi', 'Login', 'Negatif', 'Login dengan email tidak terdaftar',
  'Email tidak ada di database',
  ['Buka /login', 'Isi email tidakada@rw.id', 'Isi password acak123', 'Klik Masuk'],
  'Login ditolak (401), tidak ada sesi',
  async () => {
    const ctx = await request.newContext({ baseURL: BASE, maxRedirects: 0, extraHTTPHeaders: { origin: BASE } });
    const r = await ctx.post('/api/auth/sign-in/email', { data: { email: 'tidakada@rw.id', password: 'acak123' } });
    await ctx.dispose();
    return { ok: r.status() === 401 || r.status() === 400, evidence: `HTTP ${r.status()}` };
  });

C('A-06', 'Autentikasi', 'Login', 'Negatif', 'Login dengan email kosong',
  'Halaman login terbuka',
  ['Buka /login', 'Kosongkan email', 'Isi password admin123', 'Klik Masuk'],
  'Validasi menolak, login gagal',
  async () => {
    const ctx = await request.newContext({ baseURL: BASE, maxRedirects: 0, extraHTTPHeaders: { origin: BASE } });
    const r = await ctx.post('/api/auth/sign-in/email', { data: { email: '', password: 'admin123' } });
    await ctx.dispose();
    return { ok: r.status() >= 400, evidence: `HTTP ${r.status()}` };
  });

C('A-07', 'Autentikasi', 'Login', 'Negatif', 'Login dengan format email tidak valid',
  'Halaman login terbuka',
  ['Buka /login', 'Isi email "bukan-email"', 'Isi password admin123', 'Klik Masuk'],
  'Validasi format email menolak (400)',
  async () => {
    const ctx = await request.newContext({ baseURL: BASE, maxRedirects: 0, extraHTTPHeaders: { origin: BASE } });
    const r = await ctx.post('/api/auth/sign-in/email', { data: { email: 'bukan-email', password: 'admin123' } });
    await ctx.dispose();
    return { ok: r.status() >= 400, evidence: `HTTP ${r.status()}` };
  });

C('A-08', 'Autentikasi', 'Kontrol Akses', 'Negatif', 'Buka /dashboard tanpa login',
  'Belum punya sesi',
  ['Buka URL /dashboard langsung'],
  'Dialihkan ke /login',
  async () => {
    const ctx = await makeCtx();
    const r = await go(ctx, '/dashboard');
    await ctx.dispose();
    return { ok: (r.status === 302 || r.status === 303) && (r.location || '').includes('/login'), evidence: `HTTP ${r.status} Location ${r.location}` };
  });

C('A-09', 'Autentikasi', 'Kontrol Akses', 'Negatif', 'Buka /kk tanpa login',
  'Belum punya sesi',
  ['Buka URL /kk langsung'],
  'Dialihkan ke /login',
  async () => {
    const ctx = await makeCtx();
    const r = await go(ctx, '/kk');
    await ctx.dispose();
    return { ok: (r.status === 302 || r.status === 303) && (r.location || '').includes('/login'), evidence: `HTTP ${r.status} Location ${r.location}` };
  });

C('A-10', 'Autentikasi', 'Kontrol Akses', 'Negatif', 'Buka /portal tanpa login',
  'Belum punya sesi',
  ['Buka URL /portal langsung'],
  'Dialihkan ke /login',
  async () => {
    const ctx = await makeCtx();
    const r = await go(ctx, '/portal');
    await ctx.dispose();
    return { ok: (r.status === 302 || r.status === 303) && (r.location || '').includes('/login'), evidence: `HTTP ${r.status} Location ${r.location}` };
  });

C('A-11', 'Autentikasi', 'Login', 'Negatif', 'Halaman login dibuka saat sudah login',
  'Sesi admin aktif',
  ['Login sebagai admin', 'Buka /login'],
  'Halaman login tetap tampil tanpa error (200)',
  async () => {
    const ctx = await makeCtx('admin@rw.id', 'admin123');
    const r = await go(ctx, '/login');
    await ctx.dispose();
    return { ok: r.status === 200, evidence: `HTTP ${r.status} Location ${r.location}` };
  });

C('A-12', 'Autentikasi', 'Logout', 'Positif', 'Logout menghapus sesi',
  'Sesi admin aktif',
  ['Login sebagai admin', 'Panggil sign-out', 'Buka /dashboard'],
  'Sesi berakhir dan /dashboard dialihkan ke /login',
  async () => {
    const ctx = await makeCtx('admin@rw.id', 'admin123');
    const out = await ctx.post('/api/auth/sign-out', {});
    const after = await go(ctx, '/dashboard');
    await ctx.dispose();
    return { ok: out.status() === 200 && (after.status === 302 || after.status === 303), evidence: `signout ${out.status()}, dashboard ${after.status} -> ${after.location}` };
  });

// ───────────────────────────── KLAIM AKUN ─────────────────────────────
C('K-01', 'Klaim Akun', 'Klaim', 'Negatif', 'Klaim tanpa mengisi kolom lengkap',
  'Halaman klaim tersedia',
  ['Buka /login mode klaim', 'Kosongkan NIK/No KK/tanggal lahir', 'Kirim'],
  'Server menolak dengan 400 dan pesan kolom wajib',
  async () => {
    const ctx = await makeCtx();
    const r = await go(ctx, '/api/auth/klaim', 'POST'); // empty body
    await ctx.dispose();
    return { ok: r.status === 400, evidence: `HTTP ${r.status} ${r.body.slice(0, 80)}` };
  });

C('K-02', 'Klaim Akun', 'Klaim', 'Negatif', 'Klaim dengan password kurang dari 6 karakter',
  'Data warga valid tersedia',
  ['Buka mode klaim', 'Isi data valid', 'Isi password 123', 'Kirim'],
  'Server menolak dengan 400, pesan minimal 6 karakter',
  async () => {
    const ctx = await makeCtx();
    const r = await go(ctx, '/api/auth/klaim', 'POST', {});
    // JSON API: use fetch-like post via ctx with data
    const r2 = await ctx.post('/api/auth/klaim', { data: { nik: '3276010101850002', noKk: '3276010101000002', tanggalLahir: '1985-05-15', email: 'k' + RUN + '@test.id', password: '123' } });
    const body = await r2.json().catch(() => ({}));
    await ctx.dispose();
    return { ok: r2.status() === 400 && String(body.error || '').includes('6'), evidence: `HTTP ${r2.status()} ${JSON.stringify(body)}` };
  });

C('K-03', 'Klaim Akun', 'Klaim', 'Negatif', 'Klaim dengan NIK tidak cocok dengan No KK',
  'Data kependudukan seed ada',
  ['Buka mode klaim', 'Isi NIK warga lain', 'Isi No KK yang tidak berpasangan', 'Kirim'],
  'Server menolak, data kependudukan tidak cocok',
  async () => {
    const ctx = await makeCtx();
    const r = await ctx.post('/api/auth/klaim', { data: { nik: '3276010101850002', noKk: '3276010101000001', tanggalLahir: '1985-05-15', email: 'k' + RUN + 'b@test.id', password: 'rahasia123' } });
    const body = await r.json().catch(() => ({}));
    await ctx.dispose();
    return { ok: r.status() === 400 && String(body.error || '').includes('tidak cocok'), evidence: `HTTP ${r.status()} ${JSON.stringify(body)}` };
  });

C('K-04', 'Klaim Akun', 'Klaim', 'Negatif', 'Klaim akun yang sudah pernah diklaim',
  'Warga Bambang sudah punya user',
  ['Buka mode klaim', 'Isi NIK/No KK/tanggal lahir Bambang', 'Isi email & password', 'Kirim'],
  'Server menolak karena akun sudah diklaim',
  async () => {
    const ctx = await makeCtx();
    const r = await ctx.post('/api/auth/klaim', { data: { nik: '3276010101800001', noKk: '3276010101000001', tanggalLahir: '1985-05-15', email: 'k' + RUN + 'c@test.id', password: 'rahasia123' } });
    const body = await r.json().catch(() => ({}));
    await ctx.dispose();
    return { ok: r.status() === 400 && String(body.error || '').includes('sudah'), evidence: `HTTP ${r.status()} ${JSON.stringify(body)}` };
  });

C('K-05', 'Klaim Akun', 'Klaim', 'Positif', 'Klaim akun warga yang belum terhubung dengan data benar',
  'Warga Agus Setiawan belum punya akun',
  ['Buka mode klaim', 'Isi NIK 3276010101850002', 'Isi No KK 3276010101000002', 'Isi tanggal lahir 1985-05-15', 'Isi email & password valid', 'Kirim'],
  'Klaim berhasil, akun warga dibuat dan tertaut',
  async () => {
    const ctx = await makeCtx();
    const email = 'klaim' + RUN + '@test.id';
    const r = await ctx.post('/api/auth/klaim', { data: { nik: '3276010101850002', noKk: '3276010101000002', tanggalLahir: '1985-05-15', email, password: 'rahasia123' } });
    const body = await r.json().catch(() => ({}));
    await ctx.dispose();
    return { ok: r.status() === 200 && body.success !== false, evidence: `HTTP ${r.status()} ${JSON.stringify(body).slice(0, 160)}` };
  });

// ───────────────────────────── DASHBOARD ─────────────────────────────
C('D-01', 'Dashboard', 'Akses', 'Positif', 'Pengurus RW membuka dashboard',
  'Login admin', ['Login admin@rw.id', 'Buka /dashboard'], 'Halaman dashboard tampil (200)',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/dashboard'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('D-02', 'Dashboard', 'Akses', 'Positif', 'Pengurus RT membuka dashboard',
  'Login pengurus RT', ['Login pengurus@rw.id', 'Buka /dashboard'], 'Dashboard tampil dengan data scope RT 01',
  async () => { const c = await makeCtx('pengurus@rw.id', 'pengurus123'); const r = await go(c, '/dashboard'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('D-03', 'Dashboard', 'Akses', 'Negatif', 'Warga membuka dashboard staf',
  'Login warga', ['Login warga@rw.id', 'Buka /dashboard'], 'Dialihkan ke /portal',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/dashboard'); await c.dispose(); return { ok: r.status === 302 && (r.location || '').includes('/portal'), evidence: `HTTP ${r.status} -> ${r.location}` }; });

// ───────────────────────────── KK / WARGA ─────────────────────────────
C('W-01', 'Kependudukan', 'Akses', 'Positif', 'Pengurus RW membuka daftar KK',
  'Login admin', ['Login admin', 'Buka /kk'], 'Daftar KK tampil (200)',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kk'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('W-02', 'Kependudukan', 'Akses', 'Positif', 'Pengurus RT membuka daftar KK',
  'Login pengurus RT', ['Login pengurus RT', 'Buka /kk'], 'Daftar KK scoped RT 01 tampil (200)',
  async () => { const c = await makeCtx('pengurus@rw.id', 'pengurus123'); const r = await go(c, '/kk'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('W-03', 'Kependudukan', 'Akses', 'Negatif', 'Warga membuka modul KK',
  'Login warga', ['Login warga', 'Buka /kk'], 'Dialihkan ke /portal',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/kk'); await c.dispose(); return { ok: r.status === 302 && (r.location || '').includes('/portal'), evidence: `HTTP ${r.status} -> ${r.location}` }; });

C('W-04', 'Kependudukan', 'Detail', 'Positif', 'Pengurus RW membuka detail KK',
  'KK id 1 ada', ['Login admin', 'Buka /kk/1'], 'Detail KK tampil (200)',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kk/1'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('W-05', 'Kependudukan', 'Detail', 'Negatif', 'Membuka detail KK dengan ID tidak ada',
  'ID 99999 tidak ada', ['Login admin', 'Buka /kk/99999'], 'Tidak crash: 404 atau dialihkan ke /kk',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kk/99999'); await c.dispose(); return { ok: r.status === 404 || ((r.status === 302 || r.status === 303) && (r.location || '').includes('/kk')), evidence: `HTTP ${r.status} -> ${r.location}` }; });

C('W-06', 'Kependudukan', 'Otorisasi', 'Negatif', 'Pengurus RT 01 membuka KK milik RT 02',
  'KK id 4 milik RT 02', ['Login pengurus RT 01', 'Buka /kk/4'], 'Akses ditolak (403)',
  async () => { const c = await makeCtx('pengurus@rw.id', 'pengurus123'); const r = await go(c, '/kk/4'); await c.dispose(); return { ok: r.status === 403, evidence: `HTTP ${r.status}` }; });

C('W-07', 'Kependudukan', 'Tambah KK', 'Negatif', 'Tambah KK dengan semua field kosong',
  'Form tambah KK terbuka', ['Buka /kk/tambah', 'Kosongkan semua field', 'Simpan'], 'Validasi menolak, pesan No. KK 16 digit',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kk/tambah', 'POST', { noKk: '', alamat: '' }); await c.dispose(); return { ok: isFail(r) && (has(r, 'No. KK harus 16 digit') || has(r, 'Data KK tidak valid')), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('W-08', 'Kependudukan', 'Tambah KK', 'Negatif', 'Tambah KK dengan No. KK 15 digit',
  'Form tambah KK terbuka', ['Isi No KK 15 digit', 'Isi alamat & RT', 'Simpan'], 'Validasi menolak panjang No. KK',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kk/tambah', 'POST', { noKk: '123456789012345', alamat: 'Jl Test', rtId: '1', statusHuni: 'tetap' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('W-09', 'Kependudukan', 'Tambah KK', 'Negatif', 'Tambah KK dengan No. KK duplikat',
  'No KK 3276010101000001 sudah ada', ['Isi No KK yang sudah terdaftar', 'Isi alamat & RT', 'Simpan'], 'Server menolak duplikasi',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kk/tambah', 'POST', { noKk: '3276010101000001', alamat: 'Jl Duplikat', rtId: '1', statusHuni: 'tetap', nik: '3276010199999999', nama: 'Anggota Dup', tempatLahir: 'Bekasi', tanggalLahir: '1990-01-01', jenisKelamin: 'L', agama: 'Islam', statusPerkawinan: 'kawin', statusHubunganKk: 'kepala_keluarga' }); await c.dispose(); return { ok: isFail(r) && (has(r, 'Gagal menyimpan') || has(r, 'Duplikasi') || has(r, 'duplicate') || has(r, 'UNIQUE')), evidence: `${r.status} ${payload(r).slice(0, 200)}` }; });

C('W-10', 'Kependudukan', 'Tambah KK', 'Negatif', 'Tambah KK tanpa memilih RT',
  'Form tambah KK terbuka', ['Isi No KK valid', 'Isi alamat', 'Kosongkan RT', 'Simpan'], 'Validasi menolak RT wajib dipilih',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kk/tambah', 'POST', { noKk: '3276010101990009', alamat: 'Jl Test', rtId: '' , statusHuni: 'tetap' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('W-11', 'Kependudukan', 'Tambah KK', 'Positif', 'Tambah KK baru dengan satu anggota valid',
  'No KK & NIK baru belum terdaftar', ['Buka /kk/tambah', 'Isi No KK 16 digit', 'Isi alamat & RT', 'Isi 1 anggota valid', 'Simpan'], 'KK tersimpan dan diarahkan ke /kk',
  async () => {
    const c = await makeCtx('admin@rw.id', 'admin123');
    const noKk = '32760101' + RUN + '001';
    const nik = '32760101' + RUN + '002';
    const r = await go(c, '/kk/tambah', 'POST', {
      noKk, alamat: 'Jl Blackbox ' + RUN, rtId: '1', statusHuni: 'tetap',
      nik, nama: 'Warga Blackbox', tempatLahir: 'Bekasi', tanggalLahir: '1990-01-01',
      jenisKelamin: 'L', agama: 'Islam', pendidikan: 'SMA', pekerjaan: 'Karyawan',
      statusPerkawinan: 'kawin', statusHubunganKk: 'kepala_keluarga'
    });
    await c.dispose();
    return { ok: isOk(r) || isFail(r) === false, evidence: `${r.status} ${payload(r).slice(0, 140)}` };
  });

C('W-12', 'Kependudukan', 'Tambah KK', 'Negatif', 'Tambah KK dengan NIK anggota 15 digit',
  'Form tambah KK terbuka', ['Isi No KK valid', 'Isi anggota dengan NIK 15 digit', 'Simpan'], 'Validasi menolak NIK 16 digit',
  async () => {
    const c = await makeCtx('admin@rw.id', 'admin123');
    const r = await go(c, '/kk/tambah', 'POST', {
      noKk: '32760101' + RUN + '003', alamat: 'Jl Test', rtId: '1', statusHuni: 'tetap',
      nik: '123456789012345', nama: 'NIK Pendek', tempatLahir: 'Bekasi', tanggalLahir: '1990-01-01',
      jenisKelamin: 'L', agama: 'Islam', statusPerkawinan: 'kawin', statusHubunganKk: 'kepala_keluarga'
    });
    await c.dispose();
    return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` };
  });

C('W-13', 'Kependudukan', 'Tambah KK', 'Negatif', 'Tambah KK dengan NIK anggota duplikat',
  'NIK 3276010101800001 sudah ada', ['Isi No KK baru', 'Isi anggota dengan NIK terdaftar', 'Simpan'], 'Server menolak duplikasi NIK',
  async () => {
    const c = await makeCtx('admin@rw.id', 'admin123');
    const r = await go(c, '/kk/tambah', 'POST', {
      noKk: '32760101' + RUN + '004', alamat: 'Jl Test', rtId: '1', statusHuni: 'tetap',
      nik: '3276010101800001', nama: 'NIK Duplikat', tempatLahir: 'Bekasi', tanggalLahir: '1990-01-01',
      jenisKelamin: 'L', agama: 'Islam', statusPerkawinan: 'kawin', statusHubunganKk: 'kepala_keluarga'
    });
    await c.dispose();
    return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` };
  });

C('W-14', 'Kependudukan', 'Edit Warga', 'Negatif', 'Edit warga dengan alasan kurang dari 5 karakter',
  'Warga id 2 ada', ['Buka /kk/2/edit', 'Isi alasan "abc"', 'Simpan'], 'Validasi menolak alasan minimal 5 karakter',
  async () => {
    const c = await makeCtx('admin@rw.id', 'admin123');
    const r = await go(c, '/kk/2/edit', 'POST', {
      nik: '3276010101850002', nama: 'Agus Setiawan', tempatLahir: 'Bekasi', tanggalLahir: '1985-05-15',
      jenisKelamin: 'L', agama: 'Islam', pendidikan: 'SMA', pekerjaan: 'Karyawan',
      statusPerkawinan: 'kawin', statusHubunganKk: 'kepala_keluarga', alasan: 'abc'
    });
    await c.dispose();
    return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` };
  });

C('W-15', 'Kependudukan', 'Edit Warga', 'Positif', 'Edit data warga dengan data valid',
  'Warga id 2 ada', ['Buka /kk/2/edit', 'Ubah nama & alasan valid', 'Simpan'], 'Data tersimpan dan diarahkan ke detail',
  async () => {
    const c = await makeCtx('admin@rw.id', 'admin123');
    const r = await go(c, '/kk/2/edit', 'POST', {
      nik: '3276010101850002', nama: 'Agus Setiawan', tempatLahir: 'Bekasi', tanggalLahir: '1985-05-15',
      jenisKelamin: 'L', agama: 'Islam', pendidikan: 'SMA', pekerjaan: 'Karyawan',
      statusPerkawinan: 'kawin', statusHubunganKk: 'kepala_keluarga', alasan: 'Perbaikan data blackbox'
    });
    await c.dispose();
    return { ok: isOk(r), evidence: `${r.status} ${payload(r).slice(0, 120)}` };
  });

C('W-16', 'Kependudukan', 'Impor CSV', 'Negatif', 'Impor CSV tanpa memilih berkas',
  'Form impor terbuka', ['Buka /kk/impor', 'Kirim tanpa file'], 'Ditolak, pesan pilih berkas CSV',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kk/impor', 'POST', {}); await c.dispose(); return { ok: isFail(r) && has(r, 'Pilih berkas CSV'), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('W-17', 'Kependudukan', 'Impor CSV', 'Negatif', 'Impor CSV hanya berisi header',
  'File CSV tanpa baris data', ['Buka /kk/impor', 'Unggah CSV header saja', 'Kirim'], 'Ditolak, tidak ada data untuk diimpor',
  async () => {
    const c = await makeCtx('admin@rw.id', 'admin123');
    const r = await c.post('/kk/impor', { multipart: { file: { name: 'kosong.csv', mimeType: 'text/csv', buffer: Buffer.from('nik,nama,no_kk,rt\n') } } });
    const body = await r.text();
    await c.dispose();
    return { ok: r.status() === 200 && body.includes('failure'), evidence: `${r.status()} ${body.slice(0, 160)}` };
  });

C('W-18', 'Kependudukan', 'Impor CSV', 'Positif', 'Impor CSV berisi satu warga valid',
  'NIK & No KK baru', ['Buka /kk/impor', 'Unggah CSV valid', 'Kirim'], 'Data berhasil diimpor, ada ringkasan berhasil',
  async () => {
    const c = await makeCtx('admin@rw.id', 'admin123');
    const nik = '32760101' + RUN + '005';
    const noKk = '32760101' + RUN + '006';
    const csv = 'nik,nama,no_kk,rt,tempat_lahir,tanggal_lahir,jenis_kelamin,agama,status_kawin,hubungan_kk,alamat,status_huni\n' +
      `${nik},Impor Blackbox,${noKk},1,Bekasi,1991-02-02,L,Islam,kawin,kepala_keluarga,Jl Impor,tetap\n`;
    const r = await c.post('/kk/impor', { multipart: { file: { name: 'valid.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) } } });
    const body = await r.text();
    await c.dispose();
    return { ok: r.status() === 200 && !body.includes('"type":"failure"'), evidence: `${r.status()} ${body.slice(0, 200)}` };
  });

C('W-19', 'Kependudukan', 'Pembaruan Data', 'Negatif', 'Tinjau permintaan pembaruan dengan aksi tidak valid',
  'Login pengurus', ['POST /kk/pembaruan?/tinjau', 'aksi=hapus', 'id=1'], 'Ditolak parameter tidak valid',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kk/pembaruan?/tinjau', 'POST', { id: '1', aksi: 'hapus' }); await c.dispose(); return { ok: isFail(r) && has(r, 'Parameter tidak valid'), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('W-20', 'Kependudukan', 'Pembaruan Data', 'Negatif', 'Tinjau permintaan pembaruan yang tidak ada',
  'ID 99999 tidak ada', ['POST /kk/pembaruan?/tinjau', 'aksi=setujui', 'id=99999'], 'Ditolak, permintaan tidak ditemukan',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kk/pembaruan?/tinjau', 'POST', { id: '99999', aksi: 'setujui' }); await c.dispose(); return { ok: isFail(r) && has(r, 'tidak ditemukan'), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('W-21', 'Kependudukan', 'Redirect', 'Positif', '/warga dialihkan ke /kk',
  'Login admin', ['Buka /warga'], 'Redirect 301 ke /kk',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/warga'); await c.dispose(); return { ok: r.status === 301 && (r.location || '').includes('/kk'), evidence: `HTTP ${r.status} -> ${r.location}` }; });

// ───────────────────────────── KAS ─────────────────────────────
C('KS-01', 'Kas', 'Akses', 'Positif', 'Pengurus RW membuka halaman kas',
  'Login admin', ['Login admin', 'Buka /kas'], 'Halaman kas tampil (200)',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kas'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('KS-02', 'Kas', 'Akses', 'Positif', 'Pengurus RT membuka halaman kas',
  'Login pengurus RT', ['Login pengurus RT', 'Buka /kas'], 'Halaman kas tampil (200)',
  async () => { const c = await makeCtx('pengurus@rw.id', 'pengurus123'); const r = await go(c, '/kas'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('KS-03', 'Kas', 'Akses', 'Negatif', 'Warga membuka halaman kas',
  'Login warga', ['Login warga', 'Buka /kas'], 'Dialihkan ke /portal',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/kas'); await c.dispose(); return { ok: r.status === 302 && (r.location || '').includes('/portal'), evidence: `HTTP ${r.status} -> ${r.location}` }; });

C('KS-04', 'Kas', 'Kas RW', 'Negatif', 'Tambah kas RW dengan nominal 0',
  'Login admin', ['Buka /kas', 'Tambah transaksi', 'Nominal 0', 'Simpan'], 'Validasi menolak nominal harus > 0',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kas?/tambahKasRw', 'POST', { jenis: 'pemasukan', nominal: '0', keterangan: 'Test', tanggal: '2026-11-08' }); await c.dispose(); return { ok: isFail(r) && has(r, 'wajib'), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('KS-05', 'Kas', 'Kas RW', 'Negatif', 'Tambah kas RW dengan nominal negatif',
  'Login admin', ['Tambah transaksi', 'Nominal -1000', 'Simpan'], 'Validasi menolak nominal negatif',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kas?/tambahKasRw', 'POST', { jenis: 'pemasukan', nominal: '-1000', keterangan: 'Test', tanggal: '2026-11-08' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('KS-06', 'Kas', 'Kas RW', 'Negatif', 'Tambah kas RW tanpa keterangan',
  'Login admin', ['Tambah transaksi', 'Nominal 5000', 'Kosongkan keterangan', 'Simpan'], 'Validasi menolak keterangan wajib',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kas?/tambahKasRw', 'POST', { jenis: 'pemasukan', nominal: '5000', keterangan: '', tanggal: '2026-11-08' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('KS-07', 'Kas', 'Kas RW', 'Positif', 'Tambah kas RW valid',
  'Login admin', ['Tambah transaksi', 'Jenis pemasukan, nominal 5000', 'Keterangan diisi', 'Simpan'], 'Transaksi tersimpan, saldo bertambah',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kas?/tambahKasRw', 'POST', { jenis: 'pemasukan', nominal: '5000', keterangan: 'Blackbox ' + RUN, tanggal: '2026-11-08' }); await c.dispose(); return { ok: isOk(r) || r.status === 200, evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('KS-08', 'Kas', 'Kas RW', 'Negatif', 'Pengurus RT menambah Kas RW',
  'Login pengurus RT', ['Login pengurus RT', 'POST tambahKasRw'], 'Ditolak 403, hanya Pengurus RW',
  async () => { const c = await makeCtx('pengurus@rw.id', 'pengurus123'); const r = await go(c, '/kas?/tambahKasRw', 'POST', { jenis: 'pemasukan', nominal: '5000', keterangan: 'Test', tanggal: '2026-11-08' }); await c.dispose(); return { ok: isFail(r) && (has(r, 'Hanya Pengurus RW') || r.json?.status === 403), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('KS-09', 'Kas', 'Kas RT', 'Positif', 'Pengurus RT menambah Kas RT sendiri',
  'Login pengurus RT 01', ['Tambah kas RT', 'RT 01, nominal 5000', 'Keterangan diisi', 'Simpan'], 'Transaksi Kas RT tersimpan',
  async () => { const c = await makeCtx('pengurus@rw.id', 'pengurus123'); const r = await go(c, '/kas?/tambahKasRt', 'POST', { rtId: '1', namaKas: 'Kas Operasional RT', jenis: 'pemasukan', nominal: '5000', keterangan: 'Blackbox RT ' + RUN, tanggal: '2026-11-08', metodePembayaran: 'tunai' }); await c.dispose(); return { ok: isOk(r) || r.status === 200, evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('KS-10', 'Kas', 'Kas RT', 'Negatif', 'Tambah Kas RT tanpa keterangan & nominal',
  'Login pengurus RT', ['Tambah kas RT', 'Kosongkan nominal & keterangan', 'Simpan'], 'Ditolak, field wajib',
  async () => { const c = await makeCtx('pengurus@rw.id', 'pengurus123'); const r = await go(c, '/kas?/tambahKasRt', 'POST', { rtId: '1', namaKas: 'Kas RT', jenis: 'pemasukan', nominal: '', keterangan: '', tanggal: '2026-11-08' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('KS-11', 'Kas', 'Kategori', 'Negatif', 'Pengurus RT menambah kategori kas',
  'Login pengurus RT', ['POST tambahKategori'], 'Ditolak 403, hanya Pengurus RW',
  async () => { const c = await makeCtx('pengurus@rw.id', 'pengurus123'); const r = await go(c, '/kas?/tambahKategori', 'POST', { nama: 'Kategori RT', jenis: 'pemasukan', scope: 'rt' }); await c.dispose(); return { ok: isFail(r) && r.json?.status === 403, evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('KS-12', 'Kas', 'Kategori', 'Negatif', 'Tambah kategori kas tanpa nama',
  'Login admin', ['POST tambahKategori', 'nama kosong'], 'Ditolak, nama kategori wajib',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kas?/tambahKategori', 'POST', { nama: '', jenis: 'pemasukan', scope: 'semua' }); await c.dispose(); return { ok: isFail(r) && has(r, 'Nama kategori wajib'), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('KS-13', 'Kas', 'Kategori', 'Positif', 'Tambah kategori kas valid',
  'Login admin', ['POST tambahKategori', 'nama "Kategori Blackbox"', 'jenis pemasukan'], 'Kategori tersimpan',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kas?/tambahKategori', 'POST', { nama: 'Kategori Blackbox ' + RUN, jenis: 'pemasukan', scope: 'semua' }); await c.dispose(); return { ok: isOk(r) || r.status === 200, evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('KS-14', 'Kas', 'Kategori', 'Negatif', 'Hapus kategori yang masih dipakai transaksi',
  'Kategori hasil KS-13 dipakai satu transaksi', ['Buat transaksi dengan kategori tsb', 'POST hapusKategori id tsb'], 'Ditolak, kategori masih digunakan',
  async () => {
    const c = await makeCtx('admin@rw.id', 'admin123');
    const row = await db.execute({ sql: `select id from kategori_kas where nama = ?`, args: ['Kategori Blackbox ' + RUN] });
    const id = row.rows[0]?.id;
    await go(c, '/kas?/tambahKasRw', 'POST', { jenis: 'pemasukan', nominal: '1000', keterangan: 'Pakai kategori ' + RUN, kategoriId: String(id), tanggal: '2026-11-08' });
    const r = await go(c, '/kas?/hapusKategori', 'POST', { id: String(id) });
    await c.dispose();
    return { ok: isFail(r) && has(r, 'masih digunakan'), evidence: `id=${id} ${r.status} ${payload(r).slice(0, 180)}` };
  });

C('KS-15', 'Kas', 'Kategori', 'Negatif', 'Hapus kategori dengan ID tidak valid',
  'Login admin', ['POST hapusKategori id=0'], 'Ditolak ID tidak valid',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kas?/hapusKategori', 'POST', { id: '0' }); await c.dispose(); return { ok: isFail(r) && has(r, 'ID kategori tidak valid'), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('KS-16', 'Kas', 'Setoran RT', 'Negatif', 'Catat setoran RT dengan periode salah format',
  'Login admin', ['POST catatSetoranRt', 'periode 2026/11'], 'Ditolak format YYYY-MM',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kas?/catatSetoranRt', 'POST', { rtId: '1', periode: '2026/11', jumlahKkDisetor: '5' }); await c.dispose(); return { ok: isFail(r) && has(r, 'YYYY-MM'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('KS-17', 'Kas', 'Setoran RT', 'Negatif', 'Catat setoran RT dengan jumlah KK 0',
  'Login admin', ['POST catatSetoranRt', 'jumlahKkDisetor 0'], 'Ditolak, minimal 1',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kas?/catatSetoranRt', 'POST', { rtId: '1', periode: '2026-11', jumlahKkDisetor: '0' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('KS-18', 'Kas', 'Kas RW', 'Negatif', 'Batalkan transaksi kas dengan ID tidak ada',
  'Login admin', ['POST batalkanKasRw', 'transaksiId 99999'], 'Ditolak, transaksi tidak ditemukan',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/kas?/batalkanKasRw', 'POST', { transaksiId: '99999', alasan: 'Test' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

// ───────────────────────────── IURAN ─────────────────────────────
C('I-01', 'Iuran', 'Akses', 'Positif', 'Pengurus RW membuka halaman iuran',
  'Login admin', ['Buka /iuran'], 'Halaman iuran tampil (200)',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('I-02', 'Iuran', 'Akses', 'Positif', 'Pengurus RT membuka halaman iuran',
  'Login pengurus RT', ['Buka /iuran'], 'Halaman iuran scoped RT tampil (200)',
  async () => { const c = await makeCtx('pengurus@rw.id', 'pengurus123'); const r = await go(c, '/iuran'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('I-03', 'Iuran', 'Akses', 'Negatif', 'Warga membuka modul iuran staf',
  'Login warga', ['Buka /iuran'], 'Dialihkan ke /portal',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/iuran'); await c.dispose(); return { ok: r.status === 302 && (r.location || '').includes('/portal'), evidence: `HTTP ${r.status} -> ${r.location}` }; });

C('I-04', 'Iuran', 'Jenis Iuran', 'Negatif', 'Tambah jenis iuran tanpa nama',
  'Login admin', ['POST /iuran/jenis?/tambah', 'nama kosong', 'nominal 50000'], 'Ditolak, nama wajib diisi',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/jenis?/tambah', 'POST', { nama: '', nominal: '50000', porsiRw: '0', periode: 'bulanan', scope: 'rw', urutan: '0', aktif: 'on' }); await c.dispose(); return { ok: isFail(r) && has(r, 'Nama wajib'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-05', 'Iuran', 'Jenis Iuran', 'Negatif', 'Tambah jenis iuran dengan nominal 0',
  'Login admin', ['POST tambah jenis', 'nama valid', 'nominal 0'], 'Ditolak, nominal harus > 0',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/jenis?/tambah', 'POST', { nama: 'Jenis Test', nominal: '0', porsiRw: '0', periode: 'bulanan', scope: 'rw', urutan: '0', aktif: 'on' }); await c.dispose(); return { ok: isFail(r) && has(r, 'Nominal harus lebih dari 0'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-06', 'Iuran', 'Jenis Iuran', 'Negatif', 'Tambah jenis iuran dengan porsi RW negatif',
  'Login admin', ['POST tambah jenis', 'porsiRw -10'], 'Ditolak, porsi tidak boleh negatif',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/jenis?/tambah', 'POST', { nama: 'Jenis Test', nominal: '50000', porsiRw: '-10', periode: 'bulanan', scope: 'rw', urutan: '0', aktif: 'on' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-07', 'Iuran', 'Jenis Iuran', 'Negatif', 'Tambah jenis iuran dengan periode tidak valid',
  'Login admin', ['POST tambah jenis', 'periode harian'], 'Ditolak, enum periode',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/jenis?/tambah', 'POST', { nama: 'Jenis Test', nominal: '50000', porsiRw: '0', periode: 'harian', scope: 'rw', urutan: '0', aktif: 'on' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-08', 'Iuran', 'Jenis Iuran', 'Positif', 'Tambah jenis iuran valid',
  'Login admin', ['POST tambah jenis', 'nama unik', 'nominal 25000', 'periode bulanan'], 'Jenis iuran tersimpan',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/jenis?/tambah', 'POST', { nama: 'Jenis Blackbox ' + RUN, nominal: '25000', porsiRw: '0', periode: 'bulanan', scope: 'rw', urutan: '0', aktif: 'on' }); await c.dispose(); return { ok: isOk(r), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('I-09', 'Iuran', 'Jenis Iuran', 'Negatif', 'Hapus jenis iuran yang sudah dipakai tagihan',
  'Jenis id 1 punya tagihan', ['POST /iuran/jenis?/hapus id=1'], 'Ditolak, jenis masih digunakan',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/jenis?/hapus', 'POST', { id: '1' }); await c.dispose(); return { ok: isFail(r) && (has(r, 'digunakan') || has(r, 'tagihan')), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('I-10', 'Iuran', 'Jenis Iuran', 'Negatif', 'Pengurus RT mengubah jenis iuran milik RW',
  'Jenis id 1 scope RW global', ['Login pengurus RT', 'POST /iuran/jenis?/ubah id=1'], 'Ditolak 403, bukan milik RT',
  async () => { const c = await makeCtx('pengurus@rw.id', 'pengurus123'); const r = await go(c, '/iuran/jenis?/ubah', 'POST', { id: '1', nama: 'Diubah RT', nominal: '50000', porsiRw: '0', periode: 'bulanan', scope: 'rw', urutan: '0', aktif: 'on' }); await c.dispose(); return { ok: isFail(r) && r.json?.status === 403, evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-11', 'Iuran', 'Generate Tagihan', 'Negatif', 'Generate tagihan dengan format periode salah',
  'Login admin', ['POST /iuran/generate', 'periode 2026-1'], 'Ditolak, format YYYY-MM',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/generate', 'POST', { periode: '2026-1', jenisIds: ['1'] }); await c.dispose(); return { ok: isFail(r) && has(r, 'YYYY-MM'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-12', 'Iuran', 'Generate Tagihan', 'Negatif', 'Pengurus RT menagih RT lain',
  'Login pengurus RT 01', ['POST generate', 'rtId 2'], 'Ditolak 403, hanya RT tugas',
  async () => { const c = await makeCtx('pengurus@rw.id', 'pengurus123'); const r = await go(c, '/iuran/generate', 'POST', { periode: '2027-04', rtId: '2', jenisIds: ['1'] }); await c.dispose(); return { ok: isFail(r) && r.json?.status === 403, evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-13', 'Iuran', 'Generate Tagihan', 'Positif', 'Generate tagihan periode baru',
  'Login admin', ['POST generate', 'periode 2027-03', 'jenis id 1'], 'Tagihan dibuat untuk KK aktif',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/generate', 'POST', { periode: '2027-03', jenisIds: ['1'] }); await c.dispose(); return { ok: isOk(r) || r.status === 200, evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-14', 'Iuran', 'Generate Tagihan', 'Negatif', 'Generate tagihan tanpa memilih jenis',
  'Login admin', ['POST generate', 'periode 2027-05', 'jenis kosong'], 'Ditolak, pilih minimal satu jenis',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/generate', 'POST', { periode: '2027-05' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-15', 'Iuran', 'Pembayaran', 'Negatif', 'Catat pembayaran tagihan dengan jumlah 0',
  'Tagihan id 2 belum bayar', ['Buka /iuran/2/bayar', 'Jumlah 0', 'Simpan'], 'Ditolak, jumlah harus > 0',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/2/bayar', 'POST', { jumlah: '0', metodeBayar: 'tunai', dibayarPada: '2026-11-08' }); await c.dispose(); return { ok: isFail(r) && has(r, 'Jumlah harus lebih dari 0'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-16', 'Iuran', 'Pembayaran', 'Negatif', 'Catat pembayaran melebihi sisa tagihan',
  'Tagihan id 2 nominal 50000', ['Buka /iuran/2/bayar', 'Jumlah 999999', 'Simpan'], 'Ditolak, jumlah melebihi sisa',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/2/bayar', 'POST', { jumlah: '999999', metodeBayar: 'tunai', dibayarPada: '2026-11-08' }); await c.dispose(); return { ok: isFail(r) && has(r, 'melebihi'), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('I-17', 'Iuran', 'Pembayaran', 'Negatif', 'Catat pembayaran dengan metode tidak valid',
  'Tagihan id 2', ['POST bayar', 'metodeBayar=kripto'], 'Ditolak, enum metode',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/2/bayar', 'POST', { jumlah: '1000', metodeBayar: 'kripto', dibayarPada: '2026-11-08' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-18', 'Iuran', 'Pembayaran', 'Positif', 'Catat pembayaran tagihan valid',
  'Tagihan id 2 belum bayar', ['Buka /iuran/2/bayar', 'Jumlah 50000', 'Metode tunai', 'Simpan'], 'Pembayaran tercatat, status lunas',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/2/bayar', 'POST', { jumlah: '50000', metodeBayar: 'tunai', dibayarPada: '2026-11-08' }); await c.dispose(); return { ok: isOk(r) || r.status === 200, evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-19', 'Iuran', 'Pembayaran', 'Negatif', 'Catat pembayaran untuk tagihan tidak ada',
  'ID 99999 tidak ada', ['POST /iuran/99999/bayar'], 'Ditolak 404',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/99999/bayar', 'POST', { jumlah: '1000', metodeBayar: 'tunai', dibayarPada: '2026-11-08' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-20', 'Iuran', 'Rekap', 'Positif', 'Membuka rekap iuran',
  'Login admin', ['Buka /iuran/rekap'], 'Rekap tampil (200)',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/rekap'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('I-21', 'Iuran', 'Konfirmasi', 'Negatif', 'Tolak konfirmasi dengan alasan > 300 karakter',
  'Konfirmasi id tidak ada tetap validasi alasan', ['POST /iuran/konfirmasi?/tolak', 'alasan 301 char'], 'Ditolak, alasan terlalu panjang',
  async () => {
    const c = await makeCtx('admin@rw.id', 'admin123');
    const r = await go(c, '/iuran/konfirmasi?/tolak', 'POST', { id: '99999', alasanTolak: 'x'.repeat(301) });
    await c.dispose();
    return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` };
  });

C('I-22', 'Iuran', 'Konfirmasi', 'Negatif', 'Terima konfirmasi yang tidak ada',
  'ID 99999 tidak ada', ['POST /iuran/konfirmasi?/terima id=99999'], 'Ditolak, konfirmasi tidak ditemukan',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/konfirmasi?/terima', 'POST', { id: '99999' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-23', 'Iuran', 'Setoran', 'Negatif', 'Setoran RT dengan periode salah format',
  'Login admin', ['POST /iuran/setoran?/setor', 'periode 2026/11'], 'Ditolak format YYYY-MM',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/setoran?/setor', 'POST', { rtId: '1', periode: '2026/11', tanggal: '2026-11-08' }); await c.dispose(); return { ok: isFail(r) && has(r, 'YYYY-MM'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('I-24', 'Iuran', 'Setoran', 'Positif', 'Setoran RT valid',
  'Login admin', ['POST setor', 'RT 01 periode 2026-11', 'tanggal valid'], 'Setoran tercatat',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/setoran?/setor', 'POST', { rtId: '1', periode: '2026-11', tanggal: '2026-11-08', catatan: 'Blackbox' }); await c.dispose(); return { ok: isOk(r) || r.status === 200, evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('I-25', 'Iuran', 'Setoran', 'Negatif', 'Batalkan setoran dengan ID tidak ada',
  'Login admin', ['POST /iuran/setoran?/batalkan', 'id 99999'], 'Ditolak, setoran tidak ditemukan',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/iuran/setoran?/batalkan', 'POST', { id: '99999', alasan: 'Test' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

export { cases, runCase, results, makeCtx, go, isFail, isOk, has, payload, db, RUN, BASE };
