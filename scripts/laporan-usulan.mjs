#!/usr/bin/env node
// Lembar copas: ubah diff laporan.md (usulan) terhadap cermin docx terakhir menjadi
// docs/laporan/usulan.md — teks bersih per lokasi di Word, tanpa tanda diff.
//   npm run laporan:usulan            → tulis lembar copas
//   node scripts/laporan-usulan.mjs --verify <ref>
//                                     → (dipakai laporan:pull) daftar baris usulan di <ref> yang
//                                       belum ada di cermin baru
// Patokan = commit terakhir "sync(docx)" yang menyentuh laporan.md. Usulan boleh di-commit.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';

const SRC = 'docs/laporan/laporan.md';
const OUT = 'docs/laporan/usulan.md';
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const baseline = (ref = 'HEAD') =>
	git('log', '-1', '--format=%H', '-E', '--grep=^sync\\(docx\\)|jadi cermin Capstone\\.docx', ref, '--', SRC).trim() ||
	'HEAD';
const isStamp = (s) => s.startsWith('<!-- CERMIN Capstone.docx');

if (process.argv[2] === '--verify') {
	const ref = process.argv[3];
	const base = baseline(ref);
	const added = git('diff', '--no-color', '-U0', base, ref, '--', SRC)
		.replace(/\r/g, '')
		.split('\n')
		.filter((s) => s.startsWith('+') && !s.startsWith('+++'))
		.map((s) => s.slice(1).trim())
		.filter((s) => s && !isStamp(s));
	const mirror = new Set(readFileSync(SRC, 'utf8').replace(/\r/g, '').split('\n').map((s) => s.trim()));
	const missing = added.filter((s) => !mirror.has(s));
	if (missing.length) {
		console.log(`[laporan:pull] ⚠ ${missing.length} baris usulan belum ada di Word. Teksnya tetap di commit ${ref.slice(0, 7)}:`);
		missing.slice(0, 15).forEach((s) => console.log('  - ' + (s.length > 100 ? s.slice(0, 100) + '…' : s)));
		console.log(`  Kembalikan: git checkout ${ref.slice(0, 7)} -- ${SRC}  (lalu npm run laporan:usulan)`);
	} else console.log('[laporan:pull] semua usulan sebelumnya sudah ada di Word.');
	process.exit(0);
}

const BASE = baseline();
const diff = git('diff', '--no-color', '-U0', BASE, '--', SRC);
const now = readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n').split('\n');

const isHeading = (s) =>
	s.length < 120 &&
	!/\t\d+\s*$/.test(s) && // baris daftar isi (ada nomor halaman)
	/^\s*(BAB\s+[IVX]+\b|\d+(\.\d+)+\.?\s+\S|DAFTAR PUSTAKA|ABSTRAK|LAMPIRAN)/i.test(s);
const clip = (s, n = 90) => {
	const t = s.trim().replace(/\s+/g, ' ');
	return t.length > n ? t.slice(0, n) + '…' : t;
};
const headingAbove = (idx) => {
	for (let i = idx; i >= 0; i--) if (isHeading(now[i])) return now[i].trim().replace(/\s+/g, ' ');
	return 'Halaman judul / awal dokumen';
};
const prevText = (idx) => {
	for (let i = idx; i >= 0; i--) if (now[i].trim()) return now[i];
	return '';
};

// parse hunk
const hunks = [];
let h = null;
for (const raw of diff.replace(/\r/g, '').split('\n')) {
	const m = raw.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
	if (m) {
		h = { newStart: +m[3], newLen: m[4] === undefined ? 1 : +m[4], del: [], add: [] };
		hunks.push(h);
	} else if (h && raw.startsWith('-') && !raw.startsWith('---')) h.del.push(raw.slice(1));
	else if (h && raw.startsWith('+') && !raw.startsWith('+++')) h.add.push(raw.slice(1));
}
const real = hunks
	.map((x) => ({ ...x, del: x.del.filter((s) => !isStamp(s)), add: x.add.filter((s) => !isStamp(s)) }))
	.filter((x) => x.del.some((s) => s.trim()) || x.add.some((s) => s.trim()));

if (!real.length) {
	if (existsSync(OUT)) rmSync(OUT);
	console.log('[laporan:usulan] tidak ada usulan — laporan.md sama dengan cermin docx terakhir.');
	process.exit(0);
}

const out = [
	'# Lembar Copas ke Capstone.docx',
	'',
	`> Dibuat ${new Date().toLocaleString('sv-SE').slice(0, 16)} dari \`git diff ${BASE.slice(0, 7)} -- ${SRC}\` ` +
		'(cermin docx terakhir). ' +
		'File sementara (gitignored) — jangan diedit, edit `laporan.md` lalu jalankan ulang ' +
		'`npm run laporan:usulan`.',
	'> Cara tempel: salin blok teks, di Word **Ctrl+Shift+V** (Keep Text Only). ' +
		'Baris berisi tab = tabel → blok, *Insert → Table → Convert Text to Table*.',
	'> Selesai menempel? Commit usulan, lalu `npm run laporan:pull` — ia memberi tahu baris usulan yang belum masuk Word.',
	''
];

real.forEach((x, i) => {
	const at = x.newLen === 0 ? x.newStart : x.newStart - 1; // index 0-based baris pertama hunk
	const where = headingAbove(x.newLen === 0 ? at - 1 : at);
	const del = x.del.filter((s) => s.trim());
	const add = x.add;
	let action;
	if (!del.length) action = 'SISIPKAN';
	else if (!add.some((s) => s.trim())) action = 'HAPUS';
	else action = 'GANTI';

	out.push(`## ${i + 1}. ${where} — ${action}`, '');
	if (action === 'SISIPKAN') {
		const before = prevText(at - 1);
		out.push(`**Sisipkan setelah paragraf:** «${clip(before)}»`, '');
	} else {
		out.push(`**${action === 'HAPUS' ? 'Hapus' : 'Ganti'} paragraf yang diawali:**`);
		del.forEach((s) => out.push(`- «${clip(s)}»`));
		out.push('');
	}
	if (action !== 'HAPUS') {
		const body = add.join('\n').replace(/^\n+|\n+$/g, '');
		const tabel = add.some((s) => s.includes('\t') && !/^\s*([0-9]+|[a-z])[.)]\t[^\t]*$/.test(s));
		out.push(tabel ? '*(ada baris tabel — dipisah tab)*' : '', '```text', body, '```', '');
	}
});

writeFileSync(OUT, out.join('\n').replace(/\n{3,}/g, '\n\n'), 'utf8');
console.log(`[laporan:usulan] ${real.length} usulan -> ${OUT}`);
