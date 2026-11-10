import fs from 'node:fs';
import { cases, runCase, results, db } from './bb-cases.mjs';

const id = process.argv[2];
const c = cases.find((x) => x.id === id);
if (!c) throw new Error('case not found ' + id);
await runCase(c);
const r = results[0];
const out = JSON.parse(fs.readFileSync('scripts/bb-results.json', 'utf8'));
const idx = out.results.findIndex((x) => x.id === id);
out.results[idx] = r;
out.pass = out.results.filter((x) => x.status === 'Pass').length;
out.fail = out.results.filter((x) => x.status === 'Fail').length;
out.total = out.results.length;
fs.writeFileSync('scripts/bb-results.json', JSON.stringify(out, null, 2), 'utf8');
console.log(id, r.status, r.evidence);
console.log(`TOTAL ${out.total} | PASS ${out.pass} | FAIL ${out.fail}`);
await db.close();
