import { request } from '@playwright/test';
const base = 'http://localhost:5173';
const ctx = await request.newContext({ baseURL: base, maxRedirects: 0, extraHTTPHeaders: { origin: base } });
let r = await ctx.post('/api/auth/sign-in/email', { data: { email: 'admin@rw.id', password: 'admin123' } });
console.log('login', r.status());

r = await ctx.post('/pengaturan/rt?/tambah', { form: { nomor: '77' } });
console.log('rt add ok', r.status(), r.headers()['content-type']);
const t = await r.text();
console.log('body len', t.length);
console.log(t.slice(0, 1200));

r = await ctx.post('/kk/tambah', { form: { noKk: '123', alamat: 'x', rtId: '1' } });
const t2 = await r.text();
console.log('kk fail status', r.status(), 'len', t2.length);
const i = t2.indexOf('No. KK');
console.log(t2.slice(Math.max(0, i - 300), i + 300));

r = await ctx.post('/pengumuman/tambah', { form: { judul: 'Probe ' + Date.now(), isi: 'isi probe', kategori: 'umum', ditampilkan: 'on' } });
console.log('pengumuman ok', r.status(), r.headers()['location'], r.headers()['content-type']);
await ctx.dispose();
