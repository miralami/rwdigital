# Tarik isi Capstone.docx (SharePoint, read-only) menjadi cermin teks docs/laporan/cermin.txt,
# lalu commit sebagai "sync(docx)" (patokan untuk npm run laporan:usulan).
# laporan.md (sumber Markdown usulan) TIDAK pernah disentuh di sini.
# Pakai helper skill capstone-word (Word COM, sesi login Office). Tidak pernah menyimpan ke docx.
#   npm run laporan:pull
$ErrorActionPreference = 'Stop'
$helper = Join-Path $env:USERPROFILE '.agents\skills\capstone-word\word-helper.ps1'
if (-not (Test-Path $helper)) { throw "Helper capstone-word tidak ditemukan: $helper" }

$repo = Split-Path -Parent $PSScriptRoot
Set-Location $repo
$rel = 'docs/laporan/cermin.txt'
$out = Join-Path $repo $rel

# Cermin yang diedit manual akan tertimpa -> tolak.
if (git status --porcelain -- $rel) {
  throw "[laporan:pull] $rel punya perubahan belum di-commit. Cermin hanya boleh ditulis oleh laporan:pull; buang perubahannya (git checkout -- $rel) lalu ulangi."
}
$prev = (git rev-parse HEAD).Trim()

. $helper
$s = Open-Capstone -ReadOnly
try { $t = [string](Get-CapstoneText $s.Doc) } finally { Close-Capstone $s }

$a = [char]7
$t = $t.Replace("`r$a`r$a", "`n").Replace("`r$a", "`t").Replace("$a", "`t")
$t = $t.Replace([string][char]11, "`n").Replace([string][char]12, "`n").Replace("`r", "`n")
$t = [regex]::Replace($t, '[\x00-\x08\x0E-\x1F]', '')

$body = $t.Replace("`n", "`r`n")

$old = if (Test-Path $out) { [IO.File]::ReadAllText($out) } else { '' }
[IO.File]::WriteAllText($out, $body, (New-Object System.Text.UTF8Encoding $false))
Write-Host "[laporan:pull] $($t.Length) karakter -> $rel"

if ($old -ne $body) {
  $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
  git add -- $rel
  git commit -q -m "sync(docx): tarik Capstone.docx $stamp" -- $rel
  Write-Host "[laporan:pull] commit sync(docx) dibuat."
} else {
  Write-Host "[laporan:pull] isi docx tidak berubah sejak cermin terakhir."
}

node scripts/laporan-usulan.mjs --verify
