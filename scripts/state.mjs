#!/usr/bin/env node
// Dev-state helper untuk docs/dev/STATE.md.
//
//   npm run state        -> tulis ulang blok AUTO (stamp + 5 commit terakhir)
//   npm run state:check  -> gagal kalau ada perubahan tapi STATE.md tidak ikut diubah
//
// Tidak mencatat hash HEAD: hash commit baru belum ada saat file ditulis, jadi stamp-nya
// akan selalu basi. Yang dicatat hanya waktu, branch, device, dan daftar commit terakhir.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { hostname } from 'node:os';

const FILE = 'docs/dev/STATE.md';
const START = '<!-- auto:start -->';
const END = '<!-- auto:end -->';

const git = (cmd) => execSync(`git ${cmd}`, { encoding: 'utf8' }).trim();

let file;
try {
  file = readFileSync(FILE, 'utf8');
} catch {
  console.error(`[state] ${FILE} tidak ditemukan`);
  process.exit(1);
}

if (!file.includes(START) || !file.includes(END)) {
  console.error(`[state] penanda ${START} / ${END} tidak ada di ${FILE}`);
  process.exit(1);
}

if (process.argv.includes('--check')) {
  const dirty = git('status --porcelain');
  if (!dirty) {
    console.log('[state] tidak ada perubahan — tidak ada yang perlu dicek');
    process.exit(0);
  }
  const touched = git(`status --porcelain -- ${FILE}`);
  if (!touched) {
    console.error('[state] ada perubahan tapi STATE.md belum diperbarui. Jalankan: npm run state');
    process.exit(1);
  }
  console.log('[state] STATE.md ikut diperbarui — lolos');
  process.exit(0);
}

const branch = git('rev-parse --abbrev-ref HEAD');
const done = git('log -5 --no-merges --pretty=format:"- `%h` %s"');

const now = new Date().toLocaleString('sv-SE', { hour12: false }).slice(0, 16);
const block = [
  START,
  `**updated** ${now} · **branch** \`${branch}\` · **device** \`${hostname()}\``,
  '',
  '### DONE (5 commit sebelum commit ini)',
  done,
  END,
].join('\n');

const next = file.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block);
writeFileSync(FILE, next, 'utf8');

const head = git('rev-parse --short HEAD');
console.log(`[state] ${FILE} diperbarui (HEAD ${head}, ${branch})`);
console.log('[state] ingat: commit berikutnya akan muncul di DONE setelah `npm run state` lagi');
