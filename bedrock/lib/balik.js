// Zabalení add-onu do .mcaddon a katalog pro web (web/public/addony/katalog.json).
import fs from "node:fs";
import path from "node:path";
import { zipSync } from "fflate";
import { PACKY, slozkaBuildu } from "./addony.js";
import { nactiJson, prelozText, projdiSoubory, verzeNaText } from "./manifest.js";
import { ChybaNastroje } from "./vystup.js";

export const KATALOG = "katalog.json";

/** Pevný čas souborů v archivu, aby stejný build dal vždy stejný .mcaddon (byte po bytu). */
const CAS_V_ARCHIVU = new Date(2020, 0, 1, 0, 0, 0);

export function slozkaDistribuce(koren, nastaveni) {
  return path.join(koren, ...nastaveni.distribuce.split("/"));
}

/**
 * Z buildu v dist/<id>/ vytvoří <distribuce>/<id>.mcaddon.
 * Archiv obsahuje složky <id>_bp/ a <id>_rp/, každou s manifest.json v kořeni (tak to Minecraft čeká).
 */
export function zabalAddon(koren, addon, nastaveni) {
  const polozky = {};
  for (const pack of addon.packy) {
    const zdroj = path.join(slozkaBuildu(koren, addon.id), pack);
    if (!fs.existsSync(path.join(zdroj, "manifest.json"))) {
      throw new ChybaNastroje(`Chybí build v ${zdroj}. Spusť nejdřív: npm run bedrock:build ${addon.id}`);
    }
    for (const soubor of projdiSoubory(zdroj)) {
      const relativni = path.relative(zdroj, soubor).split(path.sep).join("/");
      polozky[`${addon.id}${PACKY[pack].pripona}/${relativni}`] = fs.readFileSync(soubor);
    }
  }
  const archiv = zipSync(polozky, { level: 6, mtime: CAS_V_ARCHIVU });
  const slozka = slozkaDistribuce(koren, nastaveni);
  fs.mkdirSync(slozka, { recursive: true });
  const cil = path.join(slozka, `${addon.id}.mcaddon`);
  fs.writeFileSync(cil, archiv);
  return cil;
}

/**
 * Přepíše katalog.json podle add-onů, které mají v distribuční složce .mcaddon.
 * Zároveň smaže .mcaddon souborů, ke kterým už žádný add-on neexistuje (složka je celá naše).
 */
export function vytvorKatalog(koren, addony, nastaveni) {
  const slozka = slozkaDistribuce(koren, nastaveni);
  fs.mkdirSync(slozka, { recursive: true });

  for (const soubor of fs.readdirSync(slozka)) {
    if (soubor.endsWith(".mcaddon") && !addony.some((a) => `${a.id}.mcaddon` === soubor)) {
      fs.rmSync(path.join(slozka, soubor));
    }
  }

  const polozky = [];
  for (const addon of addony) {
    const soubor = `${addon.id}.mcaddon`;
    const cesta = path.join(slozka, soubor);
    if (!fs.existsSync(cesta)) continue;
    const pack = addon.packy.includes("behavior_pack") ? "behavior_pack" : "resource_pack";
    const slozkaPacku = path.join(addon.slozka, pack);
    const { header } = nactiJson(path.join(slozkaPacku, "manifest.json"));
    polozky.push({
      id: addon.id,
      nazev: prelozText(slozkaPacku, header.name),
      popis: prelozText(slozkaPacku, header.description ?? ""),
      verze: verzeNaText(header.version),
      minecraft: verzeNaText(header.min_engine_version),
      packy: addon.packy,
      url: soubor,
      velikost: fs.statSync(cesta).size,
    });
  }

  const katalog = {
    format: 1,
    poznamka: "Generuje npm run bedrock:package, ručně neupravovat. url je relativní ke složce s tímhle souborem.",
    addony: polozky,
  };
  fs.writeFileSync(path.join(slozka, KATALOG), JSON.stringify(katalog, null, 2) + "\n");
  return katalog;
}
