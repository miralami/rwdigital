import { createClient } from '@libsql/client';
const c = createClient({ url: 'file:local.db' });
const r = await c.execute('select id,nomor_surat,jenis,status,warga_id,butuh_ttd_rt,butuh_ttd_rw from surat');
console.log('SURAT', JSON.stringify(r.rows, null, 1));
const w = await c.execute('select id,nama,nik,kk_id,tanggal_lahir,user_id from warga where id<=3');
console.log('WARGA', JSON.stringify(w.rows, null, 1));
const u = await c.execute("select id,email,role from user");
console.log('USER', JSON.stringify(u.rows, null, 1));
