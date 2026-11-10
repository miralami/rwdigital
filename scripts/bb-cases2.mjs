import {
  cases, makeCtx, go, isFail, isOk, has, payload, db, RUN
} from './bb-cases.mjs';

function C(id, module, test, type, testCase, pre, steps, expected, fn) {
  cases.push({ id, module, test, type, testCase, pre, steps, expected, fn });
}

// ───────────────────────────── PENGUMUMAN ─────────────────────────────
C('P-01', 'Pengumuman', 'Akses', 'Positif', 'Pengurus RW membuka daftar pengumuman',
  'Login admin', ['Buka /pengumuman'], 'Daftar pengumuman tampil (200)',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengumuman'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('P-02', 'Pengumuman', 'Akses', 'Negatif', 'Warga membuka modul pengumuman staf',
  'Login warga', ['Buka /pengumuman'], 'Dialihkan ke /portal',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/pengumuman'); await c.dispose(); return { ok: r.status === 302 && (r.location || '').includes('/portal'), evidence: `HTTP ${r.status} -> ${r.location}` }; });

C('P-03', 'Pengumuman', 'Tambah', 'Negatif', 'Buat pengumuman tanpa judul & isi',
  'Login admin', ['Buka /pengumuman/tambah', 'Kosongkan judul & isi', 'Simpan'], 'Ditolak, judul & isi wajib',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengumuman/tambah', 'POST', { judul: '', isi: '', kategori: 'umum', ditampilkan: 'on' }); await c.dispose(); return { ok: isFail(r) && has(r, 'Judul wajib diisi'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('P-04', 'Pengumuman', 'Tambah', 'Negatif', 'Buat pengumuman dengan tanggal selesai event sebelum mulai',
  'Login admin', ['Isi judul & isi', 'Mulai event 2026-12-10', 'Selesai event 2026-12-01', 'Simpan'], 'Ditolak, tanggal selesai tidak boleh sebelum mulai',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengumuman/tambah', 'POST', { judul: 'Event', isi: 'Isi', kategori: 'kegiatan', tanggalMulaiEvent: '2026-12-10', tanggalSelesaiEvent: '2026-12-01', ditampilkan: 'on' }); await c.dispose(); return { ok: isFail(r) && has(r, 'tidak boleh sebelum'), evidence: `${r.status} ${payload(r).slice(0, 200)}` }; });

C('P-05', 'Pengumuman', 'Tambah', 'Negatif', 'Buat pengumuman dengan kategori tidak valid',
  'Login admin', ['Isi judul & isi', 'kategori=gosip', 'Simpan'], 'Ditolak, enum kategori',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengumuman/tambah', 'POST', { judul: 'Test', isi: 'Isi', kategori: 'gosip', ditampilkan: 'on' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('P-06', 'Pengumuman', 'Tambah', 'Negatif', 'Buat pengumuman dengan tanggal selesai event tanpa tanggal mulai',
  'Login admin', ['Isi judul & isi', 'Hanya isi tanggal selesai event', 'Simpan'], 'Ditolak, tanggal mulai wajib',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengumuman/tambah', 'POST', { judul: 'Test', isi: 'Isi', kategori: 'kegiatan', tanggalSelesaiEvent: '2026-12-10', ditampilkan: 'on' }); await c.dispose(); return { ok: isFail(r) && has(r, 'Tanggal mulai event wajib'), evidence: `${r.status} ${payload(r).slice(0, 200)}` }; });

C('P-07', 'Pengumuman', 'Tambah', 'Positif', 'Buat pengumuman valid dan tampilkan',
  'Login admin', ['Isi judul unik', 'Isi isi pengumuman', 'kategori umum', 'Centang tampilkan', 'Simpan'], 'Pengumuman tersimpan dan notifikasi disiarkan',
  async () => {
    const c = await makeCtx('admin@rw.id', 'admin123');
    const judul = 'Blackbox ' + RUN;
    const r = await go(c, '/pengumuman/tambah', 'POST', { judul, isi: 'Isi pengumuman blackbox', kategori: 'umum', ditampilkan: 'on' });
    await c.dispose();
    const row = await db.execute({ sql: 'select id from pengumuman where judul = ?', args: [judul] });
    return { ok: isOk(r) && row.rows.length === 1, evidence: `${r.status} ${payload(r).slice(0, 120)}; row=${row.rows.length}` };
  });

C('P-08', 'Pengumuman', 'Edit', 'Negatif', 'Edit pengumuman dengan tanggal selesai event sebelum mulai',
  'Pengumuman hasil P-07 ada', ['Buka edit', 'Ubah tanggal event tidak valid', 'Simpan'], 'Ditolak validasi tanggal',
  async () => {
    const judul = 'Blackbox ' + RUN;
    const row = await db.execute({ sql: 'select id from pengumuman where judul = ?', args: [judul] });
    const id = row.rows[0]?.id;
    const c = await makeCtx('admin@rw.id', 'admin123');
    const r = await go(c, `/pengumuman/${id}/edit`, 'POST', { judul, isi: 'Isi', kategori: 'kegiatan', tanggalMulaiEvent: '2026-12-10', tanggalSelesaiEvent: '2026-12-01', ditampilkan: 'on' });
    await c.dispose();
    return { ok: isFail(r), evidence: `id=${id} ${r.status} ${payload(r).slice(0, 180)}` };
  });

C('P-09', 'Pengumuman', 'Edit', 'Positif', 'Edit pengumuman dengan data valid',
  'Pengumuman hasil P-07 ada', ['Buka edit', 'Ubah judul', 'Simpan'], 'Perubahan tersimpan',
  async () => {
    const judul = 'Blackbox ' + RUN;
    const row = await db.execute({ sql: 'select id from pengumuman where judul = ?', args: [judul] });
    const id = row.rows[0]?.id;
    const c = await makeCtx('admin@rw.id', 'admin123');
    const r = await go(c, `/pengumuman/${id}/edit`, 'POST', { judul: judul + ' Edit', isi: 'Isi baru', kategori: 'umum', ditampilkan: 'on' });
    await c.dispose();
    return { ok: isOk(r), evidence: `id=${id} ${r.status} ${payload(r).slice(0, 140)}` };
  });

C('P-10', 'Pengumuman', 'Toggle', 'Positif', 'Sembunyikan/tampilkan pengumuman',
  'Pengumuman ada', ['Klik toggle visibilitas'], 'Status tampil berubah',
  async () => {
    const row = await db.execute({ sql: `select id from pengumuman where judul like ? order by id desc limit 1`, args: ['Blackbox ' + RUN + '%'] });
    const id = row.rows[0]?.id;
    const c = await makeCtx('admin@rw.id', 'admin123');
    const r = await go(c, '/pengumuman?/toggle', 'POST', { id: String(id) });
    await c.dispose();
    return { ok: isOk(r), evidence: `id=${id} ${r.status} ${payload(r).slice(0, 120)}` };
  });

C('P-11', 'Pengumuman', 'Otorisasi', 'Negatif', 'Pengurus RT menghapus pengumuman milik RW',
  'Pengumuman RW (rtId null) ada', ['Login pengurus RT', 'POST hapus id pengumuman RW'], 'Ditolak 403, hanya pengumuman RT sendiri',
  async () => {
    const c0 = await makeCtx('admin@rw.id', 'admin123');
    await go(c0, '/pengumuman/tambah', 'POST', { judul: 'RW Only ' + RUN, isi: 'Isi', kategori: 'umum', ditampilkan: 'on' });
    await c0.dispose();
    const row = await db.execute({ sql: `select id from pengumuman where judul = ?`, args: ['RW Only ' + RUN] });
    const id = row.rows[0]?.id;
    const c = await makeCtx('pengurus@rw.id', 'pengurus123');
    const r = await go(c, '/pengumuman?/hapus', 'POST', { id: String(id) });
    await c.dispose();
    return { ok: isFail(r) && r.json?.status === 403, evidence: `id=${id} ${r.status} ${payload(r).slice(0, 160)}` };
  });

C('P-12', 'Pengumuman', 'Hapus', 'Positif', 'Hapus pengumuman milik sendiri',
  'Pengumuman hasil P-07 ada', ['Klik hapus'], 'Pengumuman terhapus',
  async () => {
    const row = await db.execute({ sql: `select id from pengumuman where judul like ? order by id desc limit 1`, args: ['Blackbox ' + RUN + '%'] });
    const id = row.rows[0]?.id;
    const c = await makeCtx('admin@rw.id', 'admin123');
    const r = await go(c, '/pengumuman?/hapus', 'POST', { id: String(id) });
    await c.dispose();
    const after = await db.execute({ sql: 'select id from pengumuman where id = ?', args: [id] });
    return { ok: isOk(r) && after.rows.length === 0, evidence: `id=${id} ${r.status}, remaining=${after.rows.length}` };
  });

C('P-13', 'Pengumuman', 'Hapus', 'Negatif', 'Hapus pengumuman dengan ID tidak valid',
  'Login admin', ['POST hapus id=0'], 'Ditolak ID tidak valid',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengumuman?/hapus', 'POST', { id: '0' }); await c.dispose(); return { ok: isFail(r) && has(r, 'ID pengumuman tidak valid'), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

// ───────────────────────────── SURAT ─────────────────────────────
C('S-01', 'Surat', 'Akses', 'Positif', 'Pengurus RW membuka daftar surat',
  'Login admin', ['Buka /surat'], 'Daftar surat tampil (200)',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/surat'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('S-02', 'Surat', 'Akses', 'Negatif', 'Warga membuka modul surat staf',
  'Login warga', ['Buka /surat'], 'Dialihkan ke /portal',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/surat'); await c.dispose(); return { ok: r.status === 302 && (r.location || '').includes('/portal'), evidence: `HTTP ${r.status} -> ${r.location}` }; });

C('S-03', 'Surat', 'Ajukan', 'Negatif', 'Ajukan surat dengan jenis tidak valid',
  'Login warga', ['Buka /portal/surat/ajukan', 'jenis=surat-sakti', 'keperluan valid', 'pilih TTD RT'], 'Ditolak, jenis surat tidak valid',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/portal/surat/ajukan', 'POST', { jenis: 'surat-sakti', keperluan: 'Keperluan test valid', butuhTtdRt: 'on' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('S-04', 'Surat', 'Ajukan', 'Negatif', 'Ajukan surat dengan keperluan kurang dari 5 karakter',
  'Login warga', ['Buka ajukan surat', 'keperluan "abc"', 'jenis skck', 'pilih TTD RT'], 'Ditolak, minimal 5 karakter',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/portal/surat/ajukan', 'POST', { jenis: 'skck', keperluan: 'abc', butuhTtdRt: 'on' }); await c.dispose(); return { ok: isFail(r) && has(r, 'minimal 5'), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('S-05', 'Surat', 'Ajukan', 'Negatif', 'Ajukan surat tanpa memilih pihak penanda tangan',
  'Login warga', ['Buka ajukan surat', 'jenis skck', 'keperluan valid', 'tidak centang RT/RW'], 'Ditolak, pilih minimal satu pihak',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/portal/surat/ajukan', 'POST', { jenis: 'skck', keperluan: 'Keperluan test valid' }); await c.dispose(); return { ok: isFail(r) && has(r, 'minimal satu pihak'), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('S-06', 'Surat', 'Ajukan', 'Positif', 'Ajukan surat valid dengan TTD RT',
  'Login warga', ['Buka ajukan surat', 'jenis skck', 'keperluan valid', 'centang TTD RT', 'Kirim'], 'Surat tersimpan status diajukan',
  async () => {
    const c = await makeCtx('warga@rw.id', 'warga123');
    const r = await go(c, '/portal/surat/ajukan', 'POST', { jenis: 'sktm', keperluan: 'Keperluan blackbox ' + RUN, butuhTtdRt: 'on' });
    await c.dispose();
    const row = await db.execute({ sql: `select id,status from surat where keperluan = ? order by id desc limit 1`, args: ['Keperluan blackbox ' + RUN] });
    return { ok: isOk(r) && row.rows[0]?.status === 'diajukan', evidence: `${r.status} ${payload(r).slice(0, 120)}; row=${JSON.stringify(row.rows[0])}` };
  });

C('S-07', 'Surat', 'Tanda Tangan', 'Positif', 'Pengurus RT menandatangani surat RT-nya',
  'Surat S-06 butuh TTD RT', ['Login pengurus RT', 'Buka surat', 'Klik tandatangani'], 'Surat terbit (jika TTD lengkap)',
  async () => {
    const row = await db.execute({ sql: `select id from surat where keperluan = ? order by id desc limit 1`, args: ['Keperluan blackbox ' + RUN] });
    const id = row.rows[0]?.id;
    const c = await makeCtx('pengurus@rw.id', 'pengurus123');
    const r = await go(c, `/surat/${id}?/tandatangani`, 'POST', {});
    await c.dispose();
    const after = await db.execute({ sql: 'select status from surat where id = ?', args: [id] });
    return { ok: isOk(r) && after.rows[0]?.status === 'terbit', evidence: `id=${id} ${r.status} ${payload(r).slice(0, 140)}; status=${after.rows[0]?.status}` };
  });

C('S-08', 'Surat', 'Tanda Tangan', 'Negatif', 'Pengurus RW menandatangani surat yang tidak meminta TTD RW',
  'Surat id 3 hanya butuh TTD RT', ['Login admin', 'POST tandatangani surat id 3'], 'Ditolak 403, surat tidak meminta TTD RW',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/surat/3?/tandatangani', 'POST', {}); await c.dispose(); return { ok: isFail(r) && r.json?.status === 403, evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('S-09', 'Surat', 'Tolak', 'Negatif', 'Pengurus RW menolak surat yang tidak meminta TTD RW',
  'Surat id 3 hanya butuh TTD RT', ['Login admin', 'POST tolak surat id 3'], 'Ditolak 403',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/surat/3?/tolak', 'POST', { catatan: 'Test' }); await c.dispose(); return { ok: isFail(r) && r.json?.status === 403, evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('S-10', 'Surat', 'Tolak', 'Positif', 'Pengurus RT menolak surat RT-nya',
  'Surat id 3 diajukan, butuh TTD RT', ['Login pengurus RT', 'POST tolak surat id 3', 'isi alasan'], 'Surat berstatus ditolak',
  async () => {
    const c = await makeCtx('pengurus@rw.id', 'pengurus123');
    const r = await go(c, '/surat/3?/tolak', 'POST', { catatan: 'Dokumen kurang lengkap' });
    await c.dispose();
    const after = await db.execute({ sql: 'select status from surat where id = 3' });
    return { ok: isOk(r) && after.rows[0]?.status === 'ditolak', evidence: `${r.status} ${payload(r).slice(0, 140)}; status=${after.rows[0]?.status}` };
  });

C('S-11', 'Surat', 'Tolak', 'Negatif', 'Menolak surat yang sudah terbit',
  'Surat id 1 status terbit', ['Login pengurus RT', 'POST tolak surat id 1'], 'Ditolak, surat terbit tidak bisa diubah',
  async () => { const c = await makeCtx('pengurus@rw.id', 'pengurus123'); const r = await go(c, '/surat/1?/tolak', 'POST', { catatan: 'Test' }); await c.dispose(); return { ok: isFail(r) && has(r, 'sudah terbit'), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('S-12', 'Surat', 'Cetak', 'Positif', 'Cetak surat yang sudah terbit',
  'Surat id 1 terbit', ['Buka /surat/1/cetak'], 'Dialihkan ke halaman cetak portal dan halaman cetak tampil',
  async () => {
    const c = await makeCtx('admin@rw.id', 'admin123');
    const r = await go(c, '/surat/1/cetak');
    const p = (r.location || '');
    const g = p ? await go(c, p) : null;
    await c.dispose();
    return { ok: (r.status === 302 || r.status === 303) && p.includes('/portal/surat/1/cetak') && g?.status === 200, evidence: `staff ${r.status} -> ${p}; portal ${g?.status}` };
  });

C('S-13', 'Surat', 'Detail', 'Negatif', 'Warga membuka surat milik warga lain lewat portal',
  'Surat id 3 milik warga 1; akun warga baru tertaut warga 3', ['Buat akun warga tertaut warga 3', 'Login akun itu', 'Buka /portal/surat/3'], '404, bukan pemilik surat',
  async () => {
    const a = await makeCtx('admin@rw.id', 'admin123');
    const email = 'w2' + RUN + '@test.id';
    await go(a, '/pengaturan/pengguna?/tambah', 'POST', { email, password: 'rahasia123', name: 'Warga Dua', role: 'warga', wargaId: '3' });
    await a.dispose();
    const c = await makeCtx(email, 'rahasia123');
    const g = await go(c, '/portal/surat/3');
    await c.dispose();
    return { ok: g.status === 404, evidence: `surat=${g.status}` };
  });

// ───────────────────────────── PENGATURAN / RBAC ─────────────────────────────
for (const [k, path] of [['01', '/pengaturan/pengguna'], ['02', '/pengaturan/rt'], ['03', '/pengaturan/pengurus'], ['04', '/pengaturan/landing'], ['05', '/pengaturan/ttd']]) {
  C('R-' + k, 'Pengaturan', 'Akses', 'Positif', `Pengurus RW membuka ${path}`,
    'Login admin', [`Buka ${path}`], 'Halaman tampil (200)',
    async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, path); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });
}

for (const [k, path] of [['06', '/pengaturan/pengguna'], ['07', '/pengaturan/rt'], ['08', '/pengaturan/pengurus']]) {
  C('R-' + k, 'Pengaturan', 'Otorisasi', 'Negatif', `Pengurus RT membuka ${path}`,
    'Login pengurus RT', [`Buka ${path}`], 'Ditolak 403, area Pengaturan hanya admin',
    async () => { const c = await makeCtx('pengurus@rw.id', 'pengurus123'); const r = await go(c, path); await c.dispose(); return { ok: r.status === 403, evidence: `HTTP ${r.status}` }; });
}

C('R-09', 'Pengaturan', 'Otorisasi', 'Negatif', 'Warga membuka area Pengaturan',
  'Login warga', ['Buka /pengaturan/rt'], 'Akses ditolak (403) atau dialihkan ke /portal',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/pengaturan/rt'); await c.dispose(); return { ok: r.status === 403 || ((r.status === 302 || r.status === 303) && (r.location || '').includes('/portal')), evidence: `HTTP ${r.status} -> ${r.location}` }; });

C('R-10', 'Pengaturan', 'Otorisasi', 'Negatif', 'Tanpa login membuka area Pengaturan',
  'Belum punya sesi', ['Buka /pengaturan/pengguna'], 'Akses ditolak (403) atau dialihkan ke /login',
  async () => { const c = await makeCtx(); const r = await go(c, '/pengaturan/pengguna'); await c.dispose(); return { ok: r.status === 403 || ((r.status === 302 || r.status === 303) && (r.location || '').includes('/login')), evidence: `HTTP ${r.status} -> ${r.location}` }; });

C('R-11', 'Pengaturan', 'Pengguna', 'Negatif', 'Buat akun dengan email tidak valid',
  'Login admin', ['POST tambah', 'email "abc"', 'password valid', 'name valid', 'role warga'], 'Ditolak, email tidak valid',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/pengguna?/tambah', 'POST', { email: 'abc', password: 'rahasia123', name: 'Test', role: 'warga', wargaId: '' }); await c.dispose(); return { ok: isFail(r) && has(r, 'Email tidak valid'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('R-12', 'Pengaturan', 'Pengguna', 'Negatif', 'Buat akun dengan password kurang dari 8 karakter',
  'Login admin', ['POST tambah', 'password 123'], 'Ditolak, minimal 8 karakter',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/pengguna?/tambah', 'POST', { email: 'x' + RUN + '@test.id', password: '123', name: 'Test', role: 'warga', wargaId: '' }); await c.dispose(); return { ok: isFail(r) && has(r, 'minimal 8'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('R-13', 'Pengaturan', 'Pengguna', 'Negatif', 'Buat akun dengan nama kosong',
  'Login admin', ['POST tambah', 'name kosong'], 'Ditolak, nama wajib',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/pengguna?/tambah', 'POST', { email: 'x' + RUN + '@test.id', password: 'rahasia123', name: '', role: 'warga', wargaId: '' }); await c.dispose(); return { ok: isFail(r) && has(r, 'Nama wajib'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('R-14', 'Pengaturan', 'Pengguna', 'Negatif', 'Buat akun dengan slug role tidak valid',
  'Login admin', ['POST tambah', 'role "admin super"'], 'Ditolak, format role tidak valid',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/pengguna?/tambah', 'POST', { email: 'x' + RUN + '@test.id', password: 'rahasia123', name: 'Test', role: 'admin super', wargaId: '' }); await c.dispose(); return { ok: isFail(r) && has(r, 'Format role tidak valid'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('R-15', 'Pengaturan', 'Pengguna', 'Positif', 'Buat akun pengurus baru valid',
  'Login admin', ['POST tambah', 'email unik', 'password valid', 'name valid', 'role pengurus_rw'], 'Akun berhasil dibuat',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/pengguna?/tambah', 'POST', { email: 'user' + RUN + '@test.id', password: 'rahasia123', name: 'User Blackbox', role: 'pengurus_rw', wargaId: '' }); await c.dispose(); return { ok: isOk(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('R-16', 'Pengaturan', 'RT', 'Negatif', 'Tambah RT dengan nomor 0',
  'Login admin', ['POST /pengaturan/rt?/tambah', 'nomor 0'], 'Ditolak, minimal 1',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/rt?/tambah', 'POST', { nomor: '0' }); await c.dispose(); return { ok: isFail(r) && has(r, 'minimal 1'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('R-17', 'Pengaturan', 'RT', 'Negatif', 'Tambah RT dengan nomor 100',
  'Login admin', ['POST tambah RT', 'nomor 100'], 'Ditolak, maksimal 99',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/rt?/tambah', 'POST', { nomor: '100' }); await c.dispose(); return { ok: isFail(r) && has(r, 'maksimal 99'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('R-18', 'Pengaturan', 'RT', 'Negatif', 'Tambah RT dengan nomor yang sudah ada',
  'RT 01 sudah ada', ['POST tambah RT', 'nomor 1'], 'Ditolak, RT sudah ada',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/rt?/tambah', 'POST', { nomor: '1' }); await c.dispose(); return { ok: isFail(r) && has(r, 'sudah ada'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('R-19', 'Pengaturan', 'RT', 'Positif', 'Tambah RT baru valid',
  'Login admin', ['POST tambah RT', 'nomor 88'], 'RT baru dibuat',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/rt?/tambah', 'POST', { nomor: '88' }); await c.dispose(); return { ok: isOk(r), evidence: `${r.status} ${payload(r).slice(0, 140)}` }; });

C('R-20', 'Pengaturan', 'RT', 'Negatif', 'Hapus RT yang masih punya KK',
  'RT id 1 punya KK', ['POST hapus RT id=1'], 'Ditolak, RT masih dipakai',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/rt?/hapus', 'POST', { id: '1' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('R-21', 'Pengaturan', 'Pengurus', 'Negatif', 'Tambah pengurus tanpa nama',
  'Login admin', ['POST /pengaturan/pengurus?/tambah', 'nama kosong'], 'Ditolak, nama wajib',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/pengurus?/tambah', 'POST', { rtId: '', jabatan: 'Ketua', nama: '', urutan: '0' }); await c.dispose(); return { ok: isFail(r) && has(r, 'Nama wajib'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('R-22', 'Pengaturan', 'Pengurus', 'Positif', 'Tambah pengurus valid',
  'Login admin', ['POST tambah pengurus', 'jabatan Ketua', 'nama valid', 'RT 01'], 'Pengurus tersimpan',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/pengurus?/tambah', 'POST', { rtId: '1', jabatan: 'Ketua Blackbox', nama: 'Pengurus ' + RUN, urutan: '90' }); await c.dispose(); return { ok: isOk(r) || r.status === 200, evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('R-23', 'Pengaturan', 'Landing', 'Negatif', 'Simpan landing dengan background berbahaya',
  'Login admin', ['POST /pengaturan/landing?/simpan', 'heroBackground javascript:alert(1)'], 'Ditolak, hanya hex/upload',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/landing?/simpan', 'POST', { heroJudul: 'Test', heroSubjudul: '', heroBackground: 'javascript:alert(1)', sambutan: '', namaKetua: '', visi: '', misi: '', sejarah: '', alamat: '', telepon: '', email: '' }); await c.dispose(); return { ok: isFail(r) && has(r, 'hex'), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('R-24', 'Pengaturan', 'Landing', 'Positif', 'Simpan landing dengan warna hex valid',
  'Login admin', ['POST simpan', 'heroBackground #0f172a'], 'Pengaturan landing tersimpan',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/landing?/simpan', 'POST', { heroJudul: 'RW 06 Kota Baru', heroSubjudul: '', heroBackground: '#0f172a', sambutan: '', namaKetua: '', visi: '', misi: '', sejarah: '', alamat: '', telepon: '', email: '' }); await c.dispose(); return { ok: isOk(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('R-25', 'Pengaturan', 'Peran', 'Positif', '/pengaturan/peran dialihkan ke pengguna',
  'Login admin', ['Buka /pengaturan/peran'], 'Redirect 301 ke /pengaturan/pengguna',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/peran'); await c.dispose(); return { ok: r.status === 301 && (r.location || '').includes('/pengaturan/pengguna'), evidence: `HTTP ${r.status} -> ${r.location}` }; });

C('R-26', 'Pengaturan', 'Peran', 'Negatif', 'Tambah peran dengan slug tidak valid',
  'Login admin', ['POST tambahPeran', 'nama "Peran Baru!"'], 'Ditolak, slug tidak valid',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/pengaturan/pengguna?/tambahPeran', 'POST', { nama: 'Peran Baru!', label: 'Peran', deskripsi: '', tipe: 'staff', scope: 'all' }); await c.dispose(); return { ok: isFail(r) && has(r, 'Slug peran tidak valid'), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

// ───────────────────────────── PORTAL WARGA ─────────────────────────────
C('PT-01', 'Portal Warga', 'Akses', 'Positif', 'Warga membuka portal',
  'Login warga', ['Buka /portal'], 'Portal tampil (200)',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/portal'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('PT-02', 'Portal Warga', 'Akses', 'Positif', 'Staff membuka portal sebagai preview',
  'Login admin', ['Buka /portal'], 'Portal tampil (200), tidak dialihkan',
  async () => { const c = await makeCtx('admin@rw.id', 'admin123'); const r = await go(c, '/portal'); await c.dispose(); return { ok: r.status === 200, evidence: `HTTP ${r.status}` }; });

C('PT-03', 'Portal Warga', 'Notifikasi', 'Negatif', 'Ambil notifikasi tanpa login',
  'Belum punya sesi', ['GET /api/notifikasi'], 'Ditolak 401',
  async () => { const c = await makeCtx(); const r = await go(c, '/api/notifikasi'); await c.dispose(); return { ok: r.status === 401, evidence: `HTTP ${r.status}` }; });

C('PT-04', 'Portal Warga', 'Notifikasi', 'Positif', 'Ambil notifikasi sebagai warga',
  'Login warga', ['GET /api/notifikasi'], 'Daftar notifikasi + unreadCount (200)',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/api/notifikasi'); await c.dispose(); return { ok: r.status === 200 && Array.isArray(r.json?.items), evidence: `HTTP ${r.status} items=${r.json?.items?.length}` }; });

C('PT-05', 'Portal Warga', 'Notifikasi', 'Negatif', 'Tandai notifikasi milik user lain',
  'Login warga, id 99999', ['POST /api/notifikasi id=99999'], 'Tidak mengubah notifikasi orang lain (200, aman)',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/api/notifikasi', 'POST', {}); const r2 = await c.post('/api/notifikasi', { data: { id: 99999 } }); await c.dispose(); return { ok: r2.status() === 200, evidence: `HTTP ${r2.status()}` }; });

C('PT-06', 'Portal Warga', 'Pembaruan Data', 'Negatif', 'Ajukan pembaruan dengan format tanggal salah',
  'Login warga', ['Buka /portal/perbaruan', 'tanggalLahir 2020/01/01', 'Kirim'], 'Ditolak 422 format YYYY-MM-DD',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/portal/perbaruan?/ajukan', 'POST', { nama: 'Bambang Supriyanto', tanggalLahir: '2020/01/01' }); await c.dispose(); return { ok: isFail(r) && has(r, 'YYYY-MM-DD'), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('PT-07', 'Portal Warga', 'Pembaruan Data', 'Negatif', 'Ajukan pembaruan tanpa mengubah data',
  'Login warga', ['Buka /portal/perbaruan', 'Kosongkan semua field', 'Kirim'], 'Ditolak, tidak ada data diubah',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/portal/perbaruan?/ajukan', 'POST', {}); await c.dispose(); return { ok: isFail(r) && has(r, 'Tidak ada data yang diubah'), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('PT-08', 'Portal Warga', 'Pembaruan Data', 'Positif', 'Ajukan pembaruan data warga valid',
  'Login warga, tidak ada permintaan aktif', ['Buka /portal/perbaruan', 'Ubah pekerjaan', 'Kirim'], 'Permintaan dibuat status diajukan',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/portal/perbaruan?/ajukan', 'POST', { pekerjaan: 'Karyawan Swasta' }); await c.dispose(); return { ok: isOk(r), evidence: `${r.status} ${payload(r).slice(0, 160)}` }; });

C('PT-09', 'Portal Warga', 'Pembaruan Data', 'Negatif', 'Ajukan pembaruan kedua saat masih ada yang aktif',
  'Sudah ada permintaan aktif dari PT-08', ['Kirim permintaan baru'], 'Ditolak 409, tunggu permintaan selesai',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/portal/perbaruan?/ajukan', 'POST', { pekerjaan: 'Pegawai Negeri' }); await c.dispose(); return { ok: isFail(r) && r.json?.status === 409, evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('PT-10', 'Portal Warga', 'Konfirmasi Bayar', 'Negatif', 'Konfirmasi tagihan milik KK lain',
  'Tagihan id 2 milik KK 2', ['POST /portal/iuran?/ajukan', 'tagihanId 2', 'jumlah 1000'], 'Ditolak 403, bukan milik KK Anda',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/portal/iuran?/ajukan', 'POST', { tagihanId: '2', jumlah: '1000', metodeBayar: 'tunai' }); await c.dispose(); return { ok: isFail(r) && r.json?.status === 403, evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('PT-11', 'Portal Warga', 'Konfirmasi Bayar', 'Negatif', 'Konfirmasi tagihan yang sudah lunas',
  'Tagihan id 1 lunas', ['POST ajukan', 'tagihanId 1', 'jumlah 1000'], 'Ditolak, tagihan sudah lunas',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/portal/iuran?/ajukan', 'POST', { tagihanId: '1', jumlah: '1000', metodeBayar: 'tunai' }); await c.dispose(); return { ok: isFail(r) && has(r, 'sudah lunas'), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('PT-12', 'Portal Warga', 'Konfirmasi Bayar', 'Negatif', 'Konfirmasi jumlah melebihi sisa tagihan',
  'Tagihan id 9 nominal 50000', ['POST ajukan', 'jumlah 999999'], 'Ditolak, melebihi sisa',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/portal/iuran?/ajukan', 'POST', { tagihanId: '9', jumlah: '999999', metodeBayar: 'tunai' }); await c.dispose(); return { ok: isFail(r) && has(r, 'melebihi'), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('PT-13', 'Portal Warga', 'Konfirmasi Bayar', 'Negatif', 'Konfirmasi dengan jumlah 0',
  'Tagihan id 9', ['POST ajukan', 'jumlah 0'], 'Ditolak, jumlah harus > 0',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/portal/iuran?/ajukan', 'POST', { tagihanId: '9', jumlah: '0', metodeBayar: 'tunai' }); await c.dispose(); return { ok: isFail(r), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('PT-14', 'Portal Warga', 'Konfirmasi Bayar', 'Positif', 'Ajukan konfirmasi pembayaran valid',
  'Tagihan id 9 milik KK 1', ['POST ajukan', 'jumlah 1000', 'metode tunai'], 'Konfirmasi tersimpan status menunggu',
  async () => {
    const c = await makeCtx('warga@rw.id', 'warga123');
    const r = await go(c, '/portal/iuran?/ajukan', 'POST', { tagihanId: '9', jumlah: '1000', metodeBayar: 'tunai', catatan: 'Blackbox' });
    await c.dispose();
    const row = await db.execute({ sql: `select id,status from konfirmasi_bayar where tagihan_id = 9 order by id desc limit 1` });
    return { ok: isOk(r) && row.rows[0]?.status === 'menunggu', evidence: `${r.status} ${payload(r).slice(0, 120)}; row=${JSON.stringify(row.rows[0])}` };
  });

C('PT-15', 'Portal Warga', 'Konfirmasi Bayar', 'Negatif', 'Ajukan konfirmasi ganda saat masih menunggu',
  'Konfirmasi PT-14 masih menunggu', ['POST ajukan lagi tagihan 9'], 'Ditolak, sudah ada konfirmasi menunggu',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await go(c, '/portal/iuran?/ajukan', 'POST', { tagihanId: '9', jumlah: '1000', metodeBayar: 'tunai' }); await c.dispose(); return { ok: isFail(r) && has(r, 'menunggu diproses'), evidence: `${r.status} ${payload(r).slice(0, 180)}` }; });

C('PT-16', 'Portal Warga', 'Konfirmasi Bayar', 'Positif', 'Batalkan konfirmasi milik sendiri',
  'Konfirmasi PT-14 menunggu', ['POST /portal/iuran?/batalkan', 'id konfirmasi'], 'Konfirmasi dibatalkan',
  async () => {
    const row = await db.execute({ sql: `select id from konfirmasi_bayar where tagihan_id = 9 order by id desc limit 1` });
    const id = row.rows[0]?.id;
    const c = await makeCtx('warga@rw.id', 'warga123');
    const r = await go(c, '/portal/iuran?/batalkan', 'POST', { id: String(id) });
    await c.dispose();
    const after = await db.execute({ sql: 'select id from konfirmasi_bayar where id = ?', args: [id] });
    return { ok: isOk(r) && after.rows.length === 0, evidence: `id=${id} ${r.status}, remaining=${after.rows.length}` };
  });

C('PT-17', 'Portal Warga', 'Konfirmasi Bayar', 'Positif', 'Ajukan ulang konfirmasi setelah dibatalkan',
  'Tagihan 9 belum lunas', ['POST ajukan jumlah 1000'], 'Konfirmasi baru dibuat',
  async () => {
    const c = await makeCtx('warga@rw.id', 'warga123');
    const r = await go(c, '/portal/iuran?/ajukan', 'POST', { tagihanId: '9', jumlah: '1000', metodeBayar: 'tunai' });
    await c.dispose();
    return { ok: isOk(r), evidence: `${r.status} ${payload(r).slice(0, 140)}` };
  });

// ───────────────────────────── MIDTRANS / API ─────────────────────────────
C('M-01', 'Midtrans', 'Charge Iuran', 'Negatif', 'Charge iuran tanpa login',
  'Belum punya sesi', ['POST /api/midtrans/charge-iuran'], 'Ditolak 401',
  async () => { const c = await makeCtx(); const r = await c.post('/api/midtrans/charge-iuran', { data: { tagihanId: 9, jumlah: 1000 } }); await c.dispose(); return { ok: r.status() === 401, evidence: `HTTP ${r.status()}` }; });

C('M-02', 'Midtrans', 'Charge Iuran', 'Negatif', 'Charge iuran dengan tagihanId tidak valid',
  'Login warga', ['POST charge-iuran tagihanId 0'], 'Ditolak 400 tagihan tidak valid',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await c.post('/api/midtrans/charge-iuran', { data: { tagihanId: 0, jumlah: 1000 } }); await c.dispose(); const b = await r.json().catch(() => ({})); return { ok: r.status() === 400, evidence: `HTTP ${r.status()} ${JSON.stringify(b)}` }; });

C('M-03', 'Midtrans', 'Charge Iuran', 'Negatif', 'Charge iuran tagihan milik KK lain',
  'Tagihan id 13 milik KK 2', ['Login warga KK 1', 'POST charge-iuran tagihanId 13'], 'Ditolak 403',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await c.post('/api/midtrans/charge-iuran', { data: { tagihanId: 13, jumlah: 1000 } }); await c.dispose(); const b = await r.json().catch(() => ({})); return { ok: r.status() === 403, evidence: `HTTP ${r.status()} ${JSON.stringify(b)}` }; });

C('M-04', 'Midtrans', 'Charge Kas RT', 'Negatif', 'Warga mencatat Kas RT via API Midtrans',
  'Login warga', ['POST /api/midtrans/charge-kas-rt'], 'Ditolak 403 hanya pengurus',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await c.post('/api/midtrans/charge-kas-rt', { data: { rtId: 1, namaKas: 'Kas', nominal: 1000, keterangan: 'Test' } }); await c.dispose(); return { ok: r.status() === 403, evidence: `HTTP ${r.status()}` }; });

C('M-05', 'Midtrans', 'Charge Kas RT', 'Negatif', 'Charge Kas RT tanpa login',
  'Belum punya sesi', ['POST /api/midtrans/charge-kas-rt'], 'Ditolak 401',
  async () => { const c = await makeCtx(); const r = await c.post('/api/midtrans/charge-kas-rt', { data: {} }); await c.dispose(); return { ok: r.status() === 401, evidence: `HTTP ${r.status()}` }; });

C('M-06', 'Midtrans', 'Webhook', 'Negatif', 'Webhook tanpa order_id',
  'Endpoint publik', ['POST /api/midtrans/notification', 'body kosong'], 'Ditolak 400 order id missing',
  async () => { const c = await makeCtx(); const r = await c.post('/api/midtrans/notification', { data: {} }); await c.dispose(); return { ok: r.status() === 400, evidence: `HTTP ${r.status()}` }; });

C('M-07', 'Midtrans', 'Webhook', 'Negatif', 'Webhook dengan signature tidak valid',
  'Order id sembarang', ['POST notification', 'signature_key palsu'], 'Ditolak 401/403, tidak memproses pembayaran',
  async () => { const c = await makeCtx(); const r = await c.post('/api/midtrans/notification', { data: { order_id: 'FAKE-' + RUN, status_code: '200', gross_amount: '1000.00', signature_key: 'palsu', transaction_status: 'settlement' } }); await c.dispose(); return { ok: r.status() >= 400, evidence: `HTTP ${r.status()}` }; });

C('M-08', 'Midtrans', 'Finish Iuran', 'Negatif', 'Sinkronisasi transaksi tanpa login',
  'Belum punya sesi', ['POST /api/midtrans/finish-iuran'], 'Ditolak 401',
  async () => { const c = await makeCtx(); const r = await c.post('/api/midtrans/finish-iuran', { data: { orderId: 'X' } }); await c.dispose(); return { ok: r.status() === 401, evidence: `HTTP ${r.status()}` }; });

C('M-09', 'Midtrans', 'Finish Iuran', 'Negatif', 'Sinkronisasi tanpa orderId',
  'Login warga', ['POST finish-iuran body kosong'], 'Ditolak 400 order id wajib',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await c.post('/api/midtrans/finish-iuran', { data: {} }); await c.dispose(); return { ok: r.status() === 400, evidence: `HTTP ${r.status()}` }; });

C('M-10', 'Midtrans', 'Finish Iuran', 'Negatif', 'Sinkronisasi orderId tidak dikenal',
  'Order id tidak ada', ['POST finish-iuran orderId acak'], 'Ditolak 404 transaksi tidak ditemukan',
  async () => { const c = await makeCtx('warga@rw.id', 'warga123'); const r = await c.post('/api/midtrans/finish-iuran', { data: { orderId: 'TIDAK-ADA-' + RUN } }); await c.dispose(); return { ok: r.status() === 404, evidence: `HTTP ${r.status()}` }; });

C('M-11', 'Iuran', 'Konfirmasi', 'Positif', 'Terima konfirmasi pembayaran warga',
  'Konfirmasi PT-17 menunggu', ['Login admin', 'Buka konfirmasi', 'Terima'], 'Pembayaran tercatat, konfirmasi diterima',
  async () => {
    const row = await db.execute({ sql: `select id from konfirmasi_bayar where tagihan_id = 9 and status = 'menunggu' order by id desc limit 1` });
    const id = row.rows[0]?.id;
    const c = await makeCtx('admin@rw.id', 'admin123');
    const r = await go(c, '/iuran/konfirmasi?/terima', 'POST', { id: String(id) });
    await c.dispose();
    const after = await db.execute({ sql: 'select status from konfirmasi_bayar where id = ?', args: [id] });
    return { ok: isOk(r) && after.rows[0]?.status === 'diterima', evidence: `id=${id} ${r.status} ${payload(r).slice(0, 140)}; status=${after.rows[0]?.status}` };
  });

C('M-12', 'Iuran', 'Konfirmasi', 'Positif', 'Tolak konfirmasi pembayaran warga dengan alasan',
  'Buat konfirmasi baru pada tagihan 10', ['Login warga', 'Ajukan konfirmasi tagihan 10', 'Login admin', 'Tolak dengan alasan'], 'Konfirmasi berstatus ditolak',
  async () => {
    const w = await makeCtx('warga@rw.id', 'warga123');
    await go(w, '/portal/iuran?/ajukan', 'POST', { tagihanId: '10', jumlah: '1000', metodeBayar: 'tunai' });
    await w.dispose();
    const row = await db.execute({ sql: `select id from konfirmasi_bayar where tagihan_id = 10 and status = 'menunggu' order by id desc limit 1` });
    const id = row.rows[0]?.id;
    const c = await makeCtx('admin@rw.id', 'admin123');
    const r = await go(c, '/iuran/konfirmasi?/tolak', 'POST', { id: String(id), alasanTolak: 'Bukti transfer tidak valid' });
    await c.dispose();
    const after = await db.execute({ sql: 'select status from konfirmasi_bayar where id = ?', args: [id] });
    return { ok: isOk(r) && after.rows[0]?.status === 'ditolak', evidence: `id=${id} ${r.status} ${payload(r).slice(0, 140)}; status=${after.rows[0]?.status}` };
  });

export { cases };
