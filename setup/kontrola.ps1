<#
  Rychlá kontrola, že je počítač nastavený: Node.js + npm přes gateway, uv přes gateway, Minecraft Bedrock.
  Spuštění:  powershell -ExecutionPolicy Bypass -File .\kontrola.ps1
#>
$NpmGateway = "https://npm.shieldoo-gate.cloudfield.cz/"
$chyby = 0

function Ok($text)    { Write-Host "  [OK] $text" -ForegroundColor Green }
function Chyba($text) { Write-Host "  [!!] $text" -ForegroundColor Red; $script:chyby++ }
function Je($prikaz)  { [bool](Get-Command $prikaz -ErrorAction SilentlyContinue) }
function Promenna($n) { [bool](Get-Item "env:$n" -ErrorAction SilentlyContinue) }

# Instalace zapsala proměnné do profilu uživatele, ale okno otevřené dřív je nezná.
# Načteme je do téhle relace, aby kontrola nezávisela na novém okně.
foreach ($n in "SGW_AUTH", "UV_INDEX_SHIELDOO_USERNAME", "UV_INDEX_SHIELDOO_PASSWORD") {
  if (-not (Promenna $n)) {
    $hodnota = [Environment]::GetEnvironmentVariable($n, "User")
    if ($hodnota) { Set-Item "env:$n" $hodnota }
  }
}

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

Write-Host "`nMinecraft Bedrock"
$mcKandidati = @(
  (Join-Path $env:APPDATA "Minecraft Bedrock\Users\Shared\games\com.mojang"),
  (Join-Path $env:LOCALAPPDATA "Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang")
)
$comMojang = $mcKandidati | Where-Object { Test-Path $_ -PathType Container } | Select-Object -First 1
if ($comMojang) {
  Ok "datová složka: $comMojang"
  foreach ($n in "development_behavior_packs", "development_resource_packs") {
    if (Test-Path (Join-Path $comMojang $n) -PathType Container) { Ok "složka $n" } else { Chyba "chybí složka $n" }
  }
} else { Chyba "datová složka Minecraftu nenalezena (Minecraft není nainstalovaný nebo ještě nebyl spuštěn)" }

Write-Host ""
if ($chyby -eq 0) { Write-Host "Vše je nastavené." -ForegroundColor Green }
else { Write-Host "Problémů: $chyby. Spusť znovu instalace-node.ps1, instalace-python.ps1 nebo instalace-minecraft.ps1." -ForegroundColor Yellow }
