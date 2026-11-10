import fs from 'node:fs';
const out = JSON.parse(fs.readFileSync('scripts/bb-results.json', 'utf8'));
const SC = {
  'Autentikasi': 'SC-01', 'Klaim Akun': 'SC-02', 'Dashboard': 'SC-03',
  'Kependudukan': 'SC-04', 'Kas': 'SC-05', 'Iuran': 'SC-06',
  'Pengumuman': 'SC-07', 'Surat': 'SC-08', 'Pengaturan': 'SC-09',
  'Portal Warga': 'SC-10', 'Midtrans': 'SC-11'
};
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
const modules = [...new Set(out.results.map(r => r.module))];
let md = '';
for (const m of modules) {
  const rows = out.results.filter(r => r.module === m);
  md += `\n### ${m} (${SC[m]})\n\n`;
  md += '| Scenario ID | Case ID | Test | Type | Test Case | Pre Condition | Steps | Steps Description | Expected Result | Status |\n';
  md += '|---|---|---|---|---|---|---|---|---|---|\n';
  for (const r of rows) {
    const n = r.steps.length;
    const stepsNo = n === 1 ? '1' : `1-${n}`;
    const desc = r.steps.map((s, i) => `${i + 1}) ${s}`).join(' ');
    md += `| ${SC[m]} | ${r.id} | ${esc(r.test)} | ${r.type} | ${esc(r.testCase)} | ${esc(r.pre)} | ${stepsNo} | ${esc(desc)} | ${esc(r.expected)} | ${r.status === 'Pass' ? 'Pass' : '**Fail**'} |\n`;
  }
}
md += '\n## Summary\n\n';
md += `- Total: **${out.total}**\n- Pass: **${out.pass}**\n- Fail: **${out.fail}**\n`;
const fails = out.results.filter(r => r.status === 'Fail');
if (fails.length) {
  md += '\n## Failed Cases\n\n';
  md += '| Case ID | Module | Failure Evidence |\n|---|---|---|\n';
  for (const f of fails) md += `| ${f.id} | ${f.module} | ${esc(f.evidence).slice(0, 220)} |\n`;
}
fs.writeFileSync('scripts/bb-tables.md', md, 'utf8');
console.log(`Wrote ${md.length} chars, ${out.total} rows`);
