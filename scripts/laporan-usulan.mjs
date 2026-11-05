#!/usr/bin/env node
// Lembar copas: bandingkan docs/laporan/laporan.md (Markdown, sumber usulan) dengan
// docs/laporan/cermin.txt (teks Capstone.docx, ditulis npm run laporan:pull) → docs/laporan/usulan.md.
//   npm run laporan:usulan            → tulis lembar copas (gitignored)
//   node scripts/laporan-usulan.mjs --verify
//                                     → (dipakai laporan:pull) baris usulan yang belum ada di cermin baru
// Perbandingan berbasis teks (bukan git diff), jadi tahan terhadap format Markdown & pemotongan paragraf.
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';

const MD = 'docs/laporan/laporan.md';
const CERMIN = 'docs/laporan/cermin.txt';
const OUT = 'docs/laporan/usulan.md';

const lines = (f) => readFileSync(f, 'utf8').replace(/\r/g, '').split('\n');
const isSep = (t) => /^[\s|:-]+$/.test(t) && t.includes('-'); // baris pemisah tabel Markdown
const isToc = (raw) => /\t\d+\s*$/.test(raw); // baris daftar isi dari Word (ada nomor halaman)
// Kunci perbandingan: buang markup Markdown, penanda daftar, dan rapatkan spasi.
const norm = (s) => {
	// "*" (bold/italic) dibuang tanpa spasi, "|" (sel tabel) jadi spasi.
	let t = s.replace(/\*/g, '').replace(/\|/g, ' ').replace(/\s+/g, ' ').trim();
	for (let prev; prev !== t; ) {
		prev = t;
		t = t.replace(/^(#{1,6}\s+|>\s*|[-+]\s+|\d+[.)]\s+|[a-z][.)]\s+)/, ''); // penanda berlapis: "- a. ..."
	}
	return t;
};
// Blok usulan ditulis sebagai Markdown (bukan blok kode) supaya bold/italic/tabel ikut saat
// disalin dari tampilan render. Baris daftar & tabel tetap rapat; paragraf dipisah baris kosong.
const isListish = (raw) => /^(\|| *[-+] |\d+[.)] )/.test(raw);
const blockOf = (g) =>
	g.map((x, k) => (k === 0 ? '' : isListish(x.raw) && isListish(g[k - 1].raw) ? '\n' : '\n\n') + x.raw).join('');
const clip = (s, n = 90) => (s.length > n ? s.slice(0, n) + '…' : s);
const HEAD_CERMIN = /^(BAB\s+[IVX]+\b|\d+(\.\d+)+\.?\s+\S|DAFTAR PUSTAKA|ABSTRAK|LAMPIRAN)/i;

// --- sisi Markdown (usulan) ---
const mdRaw = lines(MD);
const md = [];
mdRaw.forEach((raw) => {
	const t = raw.trim();
	if (!t || t.startsWith('<!--') || isSep(t)) return;
	md.push({ raw: t, n: norm(t), heading: /^#{1,6}\s/.test(t) });
});
const MDJ = ' ' + md.map((x) => x.n).join(' ') + ' ';

// --- sisi cermin (Word) ---
const cerRaw = lines(CERMIN);
const CER = ' ' + cerRaw.map(norm).filter(Boolean).join(' ') + ' ';
const cer = cerRaw
	.map((raw) => ({ raw: raw.trim(), n: norm(raw) }))
	.filter((x) => x.n && x.raw !== '/' && !isToc(x.raw) && x.raw);

// Baris Markdown yang tidak ada di Word = usulan (tambah/ubah).
const changed = md.map((x, i) => ({ ...x, i, add: !!x.n && !CER.includes(x.n) }));
// Baris Word yang tidak ada lagi di Markdown = hapus/ganti. Baris Word yang di Markdown dipecah
// per butir (mis. "... 1994): - Must Have ...") dicek per potongan, jadi pemecahan tidak dianggap hapus.
const fragments = (raw) => raw.split(/\s+[-*]\s+/).map(norm).filter((f) => f.length >= 3);
const removed = cer
	.map((x, i) => ({ ...x, i, del: fragments(x.raw).some((f) => !MDJ.includes(f)) }))
	.filter((x) => x.del);

// Kelompokkan baris berurutan.
const groupBy = (arr, pred) => {
	const out = [];
	let cur = null;
	arr.forEach((x) => {
		if (pred(x)) {
			if (!cur) out.push((cur = []));
			cur.push(x);
		} else cur = null;
	});
	return out;
};
const headingAboveMd = (idx) => {
	for (let i = idx; i >= 0; i--) if (md[i].heading) return md[i].n;
	return 'Halaman judul / awal dokumen';
};

const addGroups = groupBy(changed, (x) => x.add);
const delGroups = (() => {
	const out = [];
	let last = -2;
	removed.forEach((x) => {
		if (x.i === last + 1 && out.length) out[out.length - 1].push(x);
		else out.push([x]);
		last = x.i;
	});
	return out;
})();

if (process.argv[2] === '--verify') {
	const missing = changed.filter((x) => x.add);
	if (missing.length) {
		console.log(`[laporan:pull] ⚠ ${missing.length} baris usulan belum ada di Word:`);
		missing.slice(0, 15).forEach((x) => console.log('  - ' + clip(x.n, 100)));
		console.log('  Tempel ke Word (lihat docs/laporan/usulan.md), lalu jalankan npm run laporan:pull lagi.');
	} else console.log('[laporan:pull] semua usulan sebelumnya sudah ada di Word.');
	process.exit(0);
}

if (!addGroups.length && !delGroups.length) {
	if (existsSync(OUT)) rmSync(OUT);
	console.log('[laporan:usulan] tidak ada usulan — laporan.md sama dengan cermin Word terakhir.');
	process.exit(0);
}

const out = [
	'# Lembar Copas ke Capstone.docx',
	'',
	`> Dibuat ${new Date().toLocaleString('sv-SE').slice(0, 16)} dari perbandingan \`laporan.md\` vs \`cermin.txt\` ` +
		'(cermin Word terakhir). File sementara (gitignored) — jangan diedit; edit `laporan.md` lalu jalankan ulang `npm run laporan:usulan`.',
	'> Cara tempel: salin dari tampilan render (bukan blok kode), lalu di Word Ctrl+V biasa — bold, italic, dan tabel ikut.',
	'> Selesai menempel? Jalankan `npm run laporan:pull` — ia memberi tahu baris usulan yang belum masuk Word.',
	''
];

out.push(`## A. Tambah / ubah (${addGroups.length} lokasi)`, '');
addGroups.forEach((g, k) => {
	const first = g[0].i;
	let prev = '';
	for (let i = first - 1; i >= 0; i--) if (!changed[i].add) { prev = changed[i].n; break; }
	out.push(`### ${k + 1}. ${headingAboveMd(first)}`, '');
	out.push(`**Setelah paragraf:** «${clip(prev || 'awal dokumen')}»`, '');
	out.push(blockOf(g), '');
});

out.push(`## B. Hapus / ganti di Word (${delGroups.length} lokasi)`, '');
delGroups.forEach((g, k) => {
	let where = 'Halaman judul / awal dokumen';
	for (let i = g[0].i; i >= 0; i--) if (HEAD_CERMIN.test(cer[i].raw)) { where = cer[i].n; break; }
	out.push(`### ${k + 1}. ${where}`, '');
	g.forEach((x) => out.push(`- «${clip(x.n)}»`));
	out.push('');
});

writeFileSync(OUT, out.join('\n').replace(/\n{3,}/g, '\n\n'), 'utf8');
console.log(`[laporan:usulan] ${addGroups.length} lokasi tambah/ubah, ${delGroups.length} lokasi hapus/ganti -> ${OUT}`);
