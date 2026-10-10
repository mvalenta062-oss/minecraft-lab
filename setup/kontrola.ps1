<#
  Rychlá kontrola, že je počítač nastavený: Node.js + npm přes gateway, uv přes gateway.
  Spuštění:  powershell -ExecutionPolicy Bypass -File .\kontrola.ps1
#>
$NpmGateway = "https://npm.shieldoo-gate.cloudfield.cz/"
$chyby = 0

function Ok($text)    { Write-Host "  [OK] $text" -ForegroundColor Green }
function Chyba($text) { Write-Host "  [!!] $text" -ForegroundColor Red; $script:chyby++ }
function Je($prikaz)  { [bool](Get-Command $prikaz -ErrorAction SilentlyContinue) }
function Promenna($n) { [bool][Environment]::GetEnvironmentVariable($n, "User") -or [bool](Get-Item "env:$n" -ErrorAction SilentlyContinue) }

Write-Host "`nnpm"
if (Je "node") { Ok "node $(node --version), npm $(npm --version)" } else { Chyba "node není nainstalovaný" }
if (Je "npm") {
  $reg = npm config get registry
  if ($reg -eq $NpmGateway) { Ok "npm registry = gateway" } else { Chyba "npm registry je '$reg', má být '$NpmGateway'" }
  if (Promenna "SGW_AUTH") { Ok "proměnná SGW_AUTH je nastavená" } else { Chyba "chybí proměnná SGW_AUTH" }
  $v = npm view vite version 2>$null
  if ($LASTEXITCODE -eq 0 -and $v) { Ok "gateway odpovídá (vite $v)" } else { Chyba "npm se přes gateway nedostalo (špatný token?)" }
}

Write-Host "`nPython (uv)"
if (Je "uv") { Ok "$(uv --version)" } else { Chyba "uv není nainstalované" }
foreach ($n in "UV_INDEX_SHIELDOO_USERNAME", "UV_INDEX_SHIELDOO_PASSWORD") {
  if (Promenna $n) { Ok "proměnná $n je nastavená" } else { Chyba "chybí proměnná $n" }
}
$tools = Join-Path $PSScriptRoot "..\tools"
if ((Je "uv") -and (Test-Path (Join-Path $tools "pyproject.toml"))) {
  Push-Location $tools
  try {
    uv pip install --dry-run requests 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { Ok "gateway odpovídá (uv dry-run v tools/)" } else { Chyba "uv se přes gateway nedostalo (spusť nejdřív 'uv sync' v tools/, nebo je špatný token)" }
  } finally { Pop-Location }
}

Write-Host ""
if ($chyby -eq 0) { Write-Host "Vše je nastavené." -ForegroundColor Green }
else { Write-Host "Problémů: $chyby. Spusť znovu instalace-node.ps1 nebo instalace-python.ps1." -ForegroundColor Yellow }
