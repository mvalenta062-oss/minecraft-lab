<#
  Příprava Minecraft Bedrock na Windows 11 pro vývoj add-onů.

  Najde datovou složku Minecraftu (com.mojang), ověří, že je Minecraft
  nainstalovaný, a vytvoří v ní složky development_behavior_packs
  a development_resource_packs. Tam se kopírují naše add-ony.
  Nalezenou cestu zapíše do bedrock.local.json v kořeni repa (soubor je
  ignorovaný Gitem), odkud ji bere npm run bedrock:deploy.

  Spuštění (PowerShell, nemusí být jako správce):
    powershell -ExecutionPolicy Bypass -File .\instalace-minecraft.ps1

  Když Minecraft ukládá data někam jinam, dá se cesta ke složce com.mojang zadat ručně:
    powershell -ExecutionPolicy Bypass -File .\instalace-minecraft.ps1 -Cesta "D:\...\com.mojang"

  Skript jde spustit kolikrát chceš. Nic nemaže, světy ani nastavení nemění,
  jen založí chybějící složky.
#>
param(
  # Ruční cesta ke složce com.mojang. Když se nezadá, skript ji najde sám.
  [string]$Cesta
)

$ErrorActionPreference = "Stop"

function Krok($text) { Write-Host "`n== $text" -ForegroundColor Cyan }

# Kde Minecraft Bedrock ukládá data. Pořadí = priorita.
$Kandidati = @(
  @{ Nazev = "Minecraft (nový, od verze 1.21.120)"
     Cesta = Join-Path $env:APPDATA "Minecraft Bedrock\Users\Shared\games\com.mojang" },
  @{ Nazev = "Minecraft (starý, UWP)"
     Cesta = Join-Path $env:LOCALAPPDATA "Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang" },
  @{ Nazev = "Minecraft Preview (nový)"
     Cesta = Join-Path $env:APPDATA "Minecraft Bedrock Preview\Users\Shared\games\com.mojang" },
  @{ Nazev = "Minecraft Preview (starý, UWP)"
     Cesta = Join-Path $env:LOCALAPPDATA "Packages\Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe\LocalState\games\com.mojang" }
)
$VyvojoveSlozky = "development_behavior_packs", "development_resource_packs"

Krok "1/4 Je Minecraft nainstalovaný?"
$balicky = @()
try {
  $balicky = @(Get-AppxPackage -Name "Microsoft.Minecraft*" -ErrorAction Stop)
} catch {
  Write-Host "Seznam aplikací se nepodařilo načíst ($($_.Exception.Message)), zkusím jen datovou složku."
}
foreach ($b in $balicky) { Write-Host "Nalezeno: $($b.Name) $($b.Version)" }
if ($balicky.Count -eq 0) { Write-Host "Minecraft jsem v nainstalovaných aplikacích nenašel." }

Krok "2/4 Datová složka Minecraftu (com.mojang)"
$comMojang = $null
if ($Cesta) {
  Write-Host "Cesta zadaná ručně: $Cesta"
  if (-not (Test-Path $Cesta -PathType Container)) { throw "Zadaná složka neexistuje: $Cesta" }
  $comMojang = (Resolve-Path $Cesta).Path
} else {
  foreach ($k in $Kandidati) {
    $je = Test-Path $k.Cesta -PathType Container
    $znacka = if ($je) { "[nalezeno]" } else { "[není]    " }
    Write-Host "  $znacka $($k.Nazev): $($k.Cesta)"
    if ($je -and -not $comMojang) { $comMojang = $k.Cesta }
  }
}
if (-not $comMojang) {
  if ($balicky.Count -eq 0) {
    throw "Minecraft Bedrock není nainstalovaný. Nainstaluj ho z Microsoft Store a spusť ho aspoň jednou."
  }
  throw "Minecraft je nainstalovaný, ale datovou složku ještě nemá. Spusť Minecraft, počkej na hlavní menu, zavři ho a pusť tenhle skript znovu."
}
Write-Host "Používám: $comMojang"

Krok "3/4 Složky pro vývoj add-onů"
foreach ($nazev in $VyvojoveSlozky) {
  $slozka = Join-Path $comMojang $nazev
  if (Test-Path $slozka -PathType Container) {
    Write-Host "  [je]       $slozka"
  } else {
    New-Item -ItemType Directory -Path $slozka | Out-Null
    Write-Host "  [vytvořeno] $slozka"
  }
}

Krok "4/4 Zápis cesty pro nástroje (bedrock.local.json)"
$koren = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$konfig = Join-Path $koren "bedrock.local.json"
$stavajici = $null
if (Test-Path $konfig) {
  try { $stavajici = (Get-Content $konfig -Raw | ConvertFrom-Json).comMojang } catch { $stavajici = $null }
}
if ($stavajici -eq $comMojang) {
  Write-Host "  [je]       $konfig"
} else {
  $json = @{ comMojang = $comMojang } | ConvertTo-Json
  # Bez BOM, aby soubor přečetl i Node.js.
  [IO.File]::WriteAllText($konfig, $json + "`n", [Text.UTF8Encoding]::new($false))
  Write-Host "  [zapsáno]  $konfig"
}

Write-Host "`nHotovo. Minecraft je připravený na vývoj add-onů." -ForegroundColor Green
Write-Host "Datová složka: $comMojang"
Write-Host "Add-on do ní nakopíruje: npm run bedrock:deploy <jmeno-addonu> (v kořeni repa)."
