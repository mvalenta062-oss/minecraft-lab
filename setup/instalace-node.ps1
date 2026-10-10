<#
  Instalace Node.js (a Gitu) na Windows 11 a nastavení npm tak,
  aby chodil jen přes naši gateway.

  Spuštění (PowerShell, nemusí být jako správce, winget si o práva řekne sám):
    powershell -ExecutionPolicy Bypass -File .\instalace-node.ps1

  Skript se zeptá na jméno (project) a token. Podle postupu gateway z nich
  udělá base64("jmeno:token") a uloží to do uživatelské proměnné prostředí
  SGW_AUTH, soubor .npmrc se na ni pouze odkazuje.
#>
param(
  # Jméno pro gateway (project), třeba "mata". Když ho nezadáš, skript se zeptá.
  [string]$Uzivatel,
  # Token pro gateway. Když ho nezadáš, skript se zeptá (vstup se nezobrazuje).
  [string]$Token
)

$ErrorActionPreference = "Stop"
$GatewayHost = "npm.shieldoo-gate.cloudfield.cz"
$Gateway     = "https://$GatewayHost/"

function Krok($text) { Write-Host "`n== $text" -ForegroundColor Cyan }
function ObnovPath {
  # winget přidá nové programy do PATH, ale tahle relace o tom ještě neví
  $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
              [Environment]::GetEnvironmentVariable("Path", "User")
}
function Nainstaluj($prikaz, $wingetId, $nazev) {
  if (Get-Command $prikaz -ErrorAction SilentlyContinue) {
    Write-Host "$nazev už je nainstalovaný, přeskakuji."
    return
  }
  winget install --id $wingetId --exact --silent `
    --accept-source-agreements --accept-package-agreements
  ObnovPath
  if (-not (Get-Command $prikaz -ErrorAction SilentlyContinue)) {
    throw "$nazev se nenainstaloval (příkaz '$prikaz' není v PATH). Zkus zavřít a znovu otevřít PowerShell."
  }
}

Krok "1/4 Git"
Nainstaluj "git" "Git.Git" "Git"
git --version

Krok "2/4 Node.js LTS (22 nebo novější)"
Nainstaluj "node" "OpenJS.NodeJS.LTS" "Node.js"
Write-Host "node $(node --version), npm $(npm --version)"

Krok "3/4 Přihlášení ke gateway"
if (-not $Uzivatel) { $Uzivatel = Read-Host "Jméno pro gateway (project, třeba mata)" }
if (-not $Token) {
  $secure = Read-Host "Vlož token (při psaní se nic nezobrazuje)" -AsSecureString
  $Token  = [System.Net.NetworkCredential]::new("", $secure).Password
}
if (-not $Uzivatel -or -not $Token) { throw "Jméno nebo token je prázdné." }

# npm chce přihlášení jako base64("jmeno:token"), viz postup na webu gateway
$auth = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("${Uzivatel}:${Token}"))

# Uloží to do uživatelské proměnné prostředí (přežije restart) i do téhle relace
[Environment]::SetEnvironmentVariable("SGW_AUTH", $auth, "User")
$env:SGW_AUTH = $auth

# .npmrc v domovské složce: registry = gateway, přihlášení bere z proměnné SGW_AUTH
$npmrc = Join-Path $HOME ".npmrc"
@"
registry=$Gateway
//$GatewayHost/:_auth=`${SGW_AUTH}
"@ | Set-Content -Path $npmrc -Encoding ascii
Write-Host "Zapsáno $npmrc"

Krok "4/4 Zkouška, že npm chodí přes gateway"
$registry = npm config get registry
if ($registry -ne $Gateway) { throw "npm má registry '$registry', čekal jsem '$Gateway'." }
$verze = npm view vite version
if ($LASTEXITCODE -ne 0 -or -not $verze) { throw "npm se přes gateway nedostalo. Zkontroluj token." }
Write-Host "Gateway odpovídá, vite má verzi $verze."

Write-Host "`nHotovo. Zavři a znovu otevři PowerShell, aby se načetly nové proměnné." -ForegroundColor Green
Write-Host "Potom: cd web ; npm install ; npm run dev"
