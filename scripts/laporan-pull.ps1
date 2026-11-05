# Tarik isi Capstone.docx (SharePoint, read-only) menjadi cermin teks di docs/laporan/laporan.md,
# lalu commit sebagai "sync(docx)" (patokan untuk npm run laporan:usulan).
# Pakai helper skill capstone-word (Word COM, sesi login Office). Tidak pernah menyimpan ke docx.
#   npm run laporan:pull
$ErrorActionPreference = 'Stop'
$helper = Join-Path $env:USERPROFILE '.agents\skills\capstone-word\word-helper.ps1'
if (-not (Test-Path $helper)) { throw "Helper capstone-word tidak ditemukan: $helper" }

$repo = Split-Path -Parent $PSScriptRoot
Set-Location $repo
$rel = 'docs/laporan/laporan.md'
$out = Join-Path $repo $rel

# Usulan yang belum di-commit akan tertimpa -> tolak.
if (git status --porcelain -- $rel) {
  throw "[laporan:pull] $rel punya perubahan belum di-commit. Commit dulu usulanmu (mis. 'docs(laporan): usulan ...'), lalu ulangi."
}
$prev = (git rev-parse HEAD).Trim()

. $helper
$s = Open-Capstone -ReadOnly
try { $t = [string](Get-CapstoneText $s.Doc) } finally { Close-Capstone $s }

$a = [char]7
$t = $t.Replace("`r$a`r$a", "`n").Replace("`r$a", "`t").Replace("$a", "`t")
$t = $t.Replace([string][char]11, "`n").Replace([string][char]12, "`n").Replace("`r", "`n")
$t = [regex]::Replace($t, '[\x00-\x08\x0E-\x1F]', '')

$stamp  = Get-Date -Format 'yyyy-MM-dd HH:mm'
$header = "<!-- CERMIN Capstone.docx (ditarik $stamp lewat ``npm run laporan:pull``). " +
          "Artefak asli = docx. Edit di file ini hanya sebagai USULAN untuk ditempel ke Word; " +
          "lembar copas: ``npm run laporan:usulan``. -->`n`n"
$body = ($header + $t).Replace("`n", "`r`n")

$old = if (Test-Path $out) { [IO.File]::ReadAllText($out) } else { '' }
$strip = { param($x) [regex]::Replace($x, '^<!-- CERMIN Capstone\.docx[^\r\n]*', '') }
[IO.File]::WriteAllText($out, $body, (New-Object System.Text.UTF8Encoding $false))
Write-Host "[laporan:pull] $($t.Length) karakter -> $rel"

if ((& $strip $old) -ne (& $strip $body)) {
  git add -- $rel
  git commit -q -m "sync(docx): tarik Capstone.docx $stamp" -- $rel
  Write-Host "[laporan:pull] commit sync(docx) dibuat."
} else {
  git checkout -q -- $rel   # isi sama; buang perubahan stempel waktu
  Write-Host "[laporan:pull] isi docx tidak berubah sejak cermin terakhir."
}

node scripts/laporan-usulan.mjs --verify $prev
