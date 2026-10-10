<#
  Instalace Pythonu (přes uv) na Windows 11 a nastavení tak,
  aby instalace balíčků chodila jen přes naši gateway.

  Spuštění (PowerShell, nemusí být jako správce):
    powershell -ExecutionPolicy Bypass -File .\instalace-python.ps1

  Skript se zeptá na uživatelské jméno a token. Uloží je do uživatelských
  proměnných prostředí UV_INDEX_SHIELDOO_USERNAME a UV_INDEX_SHIELDOO_PASSWORD,
  odkud si je bere uv (index "shieldoo" je zapsaný v tools/pyproject.toml).
  Pip napřímo nepoužíváme, takže se nenastavuje.
#>
param(
  # Uživatelské jméno pro gateway. Když ho nezadáš, skript se zeptá.
  [string]$Uzivatel,
  # Token pro gateway. Když ho nezadáš, skript se zeptá (vstup se nezobrazuje).
  [string]$Token
)

$ErrorActionPreference = "Stop"
$PythonVerze = "3.13"

function Krok($text) { Write-Host "`n== $text" -ForegroundColor Cyan }
function ObnovPath {
  $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
              [Environment]::GetEnvironmentVariable("Path", "User")
}

Krok "1/4 uv"
if (Get-Command uv -ErrorAction SilentlyContinue) {
  Write-Host "uv už je nainstalované, přeskakuji."
} else {
  winget install --id astral-sh.uv --exact --silent `
    --accept-source-agreements --accept-package-agreements
  ObnovPath
  if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    throw "uv se nenainstalovalo. Zkus zavřít a znovu otevřít PowerShell."
  }
}
uv --version

Krok "2/4 Přihlášení ke gateway"
if (-not $Uzivatel) { $Uzivatel = Read-Host "Uživatelské jméno pro gateway (krátký login, ne e-mail)" }
if (-not $Token) {
  $secure = Read-Host "Vlož token (při psaní se nic nezobrazuje)" -AsSecureString
  $Token  = [System.Net.NetworkCredential]::new("", $secure).Password
}
if (-not $Uzivatel -or -not $Token) { throw "Jméno nebo token je prázdné." }

[Environment]::SetEnvironmentVariable("UV_INDEX_SHIELDOO_USERNAME", $Uzivatel, "User")
[Environment]::SetEnvironmentVariable("UV_INDEX_SHIELDOO_PASSWORD", $Token, "User")
$env:UV_INDEX_SHIELDOO_USERNAME = $Uzivatel
$env:UV_INDEX_SHIELDOO_PASSWORD = $Token
Write-Host "Proměnné UV_INDEX_SHIELDOO_USERNAME a UV_INDEX_SHIELDOO_PASSWORD nastaveny."

Krok "3/4 Python $PythonVerze"
uv python install $PythonVerze

Krok "4/4 Zkouška, že uv chodí přes gateway"
$tools = Join-Path $PSScriptRoot "..\tools"
if (Test-Path (Join-Path $tools "pyproject.toml")) {
  Push-Location $tools
  try {
    uv sync
    # --dry-run nic neinstaluje, jen se zeptá gateway, jestli balíček zná
    uv pip install --dry-run requests
    if ($LASTEXITCODE -ne 0) { throw "uv se přes gateway nedostalo. Zkontroluj jméno a token." }
  } finally { Pop-Location }
  Write-Host "Gateway odpovídá, prostředí v tools/ je připravené."
} else {
  Write-Host "Složku tools/ jsem nenašel, zkoušku přeskakuji (spusť skript z naklonovaného repa)."
}

Write-Host "`nHotovo. Zavři a znovu otevři PowerShell, aby se načetly nové proměnné." -ForegroundColor Green
Write-Host "Potom: cd tools ; uv run nazev.py"
