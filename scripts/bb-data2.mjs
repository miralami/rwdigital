import { createClient } from '@libsql/client';
const c = createClient({ url: 'file:local.db' });
const q = async (s) => (await c.execute(s)).rows;
console.log('KATEGORI', JSON.stringify(await q('select id,nama from kategori_kas order by id')));
console.log('TRANSAKSI_KAS', JSON.stringify(await q('select id,kategori_id,nominal,keterangan from transaksi_kas')));
console.log('PEMBAYARAN tagihan1', JSON.stringify(await q('select * from pembayaran where tagihan_id=1')));
console.log('TAGIHAN1', JSON.stringify(await q('select id,status,nominal from tagihan where id=1')));
console.log('TAGIHAN kk2', JSON.stringify(await q('select id,status,nominal from tagihan where kk_id=2')));
await c.close();
