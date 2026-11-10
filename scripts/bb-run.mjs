import fs from 'node:fs';
import { cases, runCase, results, db } from './bb-cases.mjs';
import './bb-cases2.mjs';

// Deduplicate by id (second module re-exports same array but C pushes once)
const seen = new Set();
const unique = [];
for (const c of cases) {
  if (!seen.has(c.id)) { seen.add(c.id); unique.push(c); }
}

console.log(`Running ${unique.length} blackbox cases...`);
for (const c of unique) {
  process.stdout.write(`[${c.id}] `);
  await runCase(c);
  const r = results[results.length - 1];
  console.log(`${r.status} ${r.evidence}`);
}

const out = {
  generatedAt: new Date().toISOString(),
  total: results.length,
  pass: results.filter(r => r.status === 'Pass').length,
  fail: results.filter(r => r.status === 'Fail').length,
  results
};
fs.writeFileSync('scripts/bb-results.json', JSON.stringify(out, null, 2), 'utf8');
console.log(`\nTOTAL ${out.total} | PASS ${out.pass} | FAIL ${out.fail}`);
console.log('Wrote scripts/bb-results.json');
await db.close();
