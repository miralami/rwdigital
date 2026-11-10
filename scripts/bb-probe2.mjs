import { request } from '@playwright/test';
const base = 'http://localhost:5173';

async function login(email, password) {
  const ctx = await request.newContext({ baseURL: base, maxRedirects: 0, extraHTTPHeaders: { origin: base } });
  const r = await ctx.post('/api/auth/sign-in/email', { data: { email, password } });
  console.log('login', email, r.status());
  return ctx;
}

const admin = await login('admin@rw.id', 'admin123');
const rt = await login('pengurus@rw.id', 'pengurus123');
const warga = await login('warga@rw.id', 'warga123');

let r = await admin.post('/kk/tambah', { form: { noKk: '', alamat: '' } });
console.log('kk empty', r.status(), (await r.text()).includes('No. KK harus 16 digit'));

r = await admin.get('/dashboard');
console.log('admin dashboard', r.status());

r = await rt.get('/pengaturan/pengguna');
console.log('rt pengaturan', r.status());

r = await warga.get('/dashboard');
console.log('warga dashboard', r.status(), r.headers()['location']);

r = await warga.get('/portal');
console.log('warga portal', r.status());

r = await admin.get('/portal');
console.log('admin portal', r.status());

r = await admin.post('/pengumuman/tambah', { form: { judul: '', isi: '' } });
console.log('pengumuman empty', r.status(), (await r.text()).includes('Judul wajib diisi'));

r = await admin.post('/iuran/jenis?/tambah', { form: { nama: '', nominal: '0' } });
console.log('jenis empty', r.status(), (await r.text()).includes('Nama wajib diisi'));

r = await admin.post('/iuran/generate', { form: { periode: '2026-1' } });
console.log('generate bad period', r.status(), (await r.text()).includes('YYYY-MM'));

r = await admin.post('/pengaturan/rt?/tambah', { form: { nomor: '100' } });
console.log('rt 100', r.status(), (await r.text()).includes('maksimal 99'));

r = await admin.get('/kas');
console.log('admin kas', r.status());
r = await rt.get('/kas');
console.log('rt kas', r.status());
r = await warga.get('/kas');
console.log('warga kas', r.status(), r.headers()['location']);

for (const c of [admin, rt, warga]) await c.dispose();
