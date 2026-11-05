# Tarik isi Capstone.docx (SharePoint, read-only) menjadi cermin teks di docs/laporan/laporan.md.
# Pakai helper skill capstone-word (Word COM, sesi login Office). Tidak pernah menyimpan ke docx.
#   npm run laporan:pull
# Setelah itu: `git diff docs/laporan/laporan.md` = perubahan di Word sejak tarikan terakhir.
$ErrorActionPreference = 'Stop'
$helper = Join-Path $env:USERPROFILE '.agents\skills\capstone-word\word-helper.ps1'
if (-not (Test-Path $helper)) { throw "Helper capstone-word tidak ditemukan: $helper" }
. $helper

$repo = Split-Path -Parent $PSScriptRoot
$out  = Join-Path $repo 'docs\laporan\laporan.md'

$s = Open-Capstone -ReadOnly
try { $t = [string](Get-CapstoneText $s.Doc) } finally { Close-Capstone $s }

$a = [char]7
$t = $t.Replace("`r$a`r$a", "`n").Replace("`r$a", "`t").Replace("$a", "`t")
$t = $t.Replace([string][char]11, "`n").Replace([string][char]12, "`n").Replace("`r", "`n")
$t = [regex]::Replace($t, '[\x00-\x08\x0E-\x1F]', '')

$stamp  = Get-Date -Format 'yyyy-MM-dd HH:mm'
$header = "<!-- CERMIN Capstone.docx (ditarik $stamp lewat ``npm run laporan:pull``). " +
          "Artefak asli = docx. Edit di file ini hanya sebagai USULAN untuk ditempel ke Word; " +
          "git diff = daftar review. -->`n`n"

$body = ($header + $t).Replace("`n", "`r`n")
[IO.File]::WriteAllText($out, $body, (New-Object System.Text.UTF8Encoding $false))
Write-Host "[laporan:pull] $($t.Length) karakter -> docs/laporan/laporan.md"
