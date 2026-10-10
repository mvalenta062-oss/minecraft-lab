// Kde má Minecraft datovou složku com.mojang: parametr, bedrock.local.json, nebo známá místa na Windows.
import fs from "node:fs";
import path from "node:path";
import { nactiJson } from "./manifest.js";
import { ChybaNastroje } from "./vystup.js";

/** Lokální soubor v kořeni repa (ignorovaný Gitem), píše ho setup/instalace-minecraft.ps1. */
export const SOUBOR_LOKALNI = "bedrock.local.json";

/** Stejná místa a pořadí jako v setup/instalace-minecraft.ps1. */
export function kandidatiComMojang(env = process.env) {
  const kandidati = [];
  if (env.APPDATA) {
    kandidati.push(path.join(env.APPDATA, "Minecraft Bedrock", "Users", "Shared", "games", "com.mojang"));
  }
  if (env.LOCALAPPDATA) {
    kandidati.push(
      path.join(
        env.LOCALAPPDATA,
        "Packages",
        "Microsoft.MinecraftUWP_8wekyb3d8bbwe",
        "LocalState",
        "games",
        "com.mojang",
      ),
    );
  }
  if (env.APPDATA) {
    kandidati.push(path.join(env.APPDATA, "Minecraft Bedrock Preview", "Users", "Shared", "games", "com.mojang"));
  }
  if (env.LOCALAPPDATA) {
    kandidati.push(
      path.join(
        env.LOCALAPPDATA,
        "Packages",
        "Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe",
        "LocalState",
        "games",
        "com.mojang",
      ),
    );
  }
  return kandidati;
}

function overSlozku(cesta, odkud) {
  if (!fs.existsSync(cesta) || !fs.statSync(cesta).isDirectory()) {
    throw new ChybaNastroje(`Složka com.mojang neexistuje: ${cesta} (${odkud})`);
  }
  return cesta;
}

/**
 * Najde složku com.mojang. Vrací { cesta, zdroj }, kde zdroj říká, odkud cesta je.
 * Pořadí: zadaná cesta, bedrock.local.json, automatické hledání (jen Windows).
 */
export function najdiComMojang(koren, zadana, env = process.env) {
  if (zadana) return { cesta: overSlozku(path.resolve(zadana), "parametr --cil"), zdroj: "parametr --cil" };

  const soubor = path.join(koren, SOUBOR_LOKALNI);
  if (fs.existsSync(soubor)) {
    let konfigurace;
    try {
      konfigurace = nactiJson(soubor);
    } catch (e) {
      throw new ChybaNastroje(`${SOUBOR_LOKALNI} nejde přečíst: ${e.message}`);
    }
    if (typeof konfigurace.comMojang !== "string" || !konfigurace.comMojang) {
      throw new ChybaNastroje(`${SOUBOR_LOKALNI} musí obsahovat { "comMojang": "C:\\\\...\\\\com.mojang" }`);
    }
    return { cesta: overSlozku(konfigurace.comMojang, SOUBOR_LOKALNI), zdroj: SOUBOR_LOKALNI };
  }

  for (const kandidat of kandidatiComMojang(env)) {
    if (fs.existsSync(kandidat) && fs.statSync(kandidat).isDirectory()) {
      return { cesta: kandidat, zdroj: "automaticky nalezeno" };
    }
  }

  throw new ChybaNastroje(
    "Nevím, kde má Minecraft datovou složku com.mojang.\n" +
      `  - spusť setup/instalace-minecraft.ps1 (vytvoří ${SOUBOR_LOKALNI}),\n` +
      `  - nebo napiš do kořene repa soubor ${SOUBOR_LOKALNI}: { "comMojang": "C:\\\\...\\\\com.mojang" },\n` +
      '  - nebo cestu zadej přímo: npm run bedrock:deploy -- <addon> --cil "C:\\...\\com.mojang"',
  );
}
