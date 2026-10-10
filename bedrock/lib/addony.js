// Kde jsou add-ony a co v nich je.
import fs from "node:fs";
import path from "node:path";
import { ChybaNastroje } from "./vystup.js";

/** Složka se zdrojáky add-onů (každý add-on = podsložka). */
export const SLOZKA_ADDONU = "projects";
/** Složka pro build artefakty (ignorovaná Gitem). */
export const SLOZKA_DIST = "dist";

/** Dva druhy packů a kam se nasazují. Přípona odlišuje složky v Minecraftu a v .mcaddon. */
export const PACKY = {
  behavior_pack: { vyvojova: "development_behavior_packs", pripona: "_bp", popis: "chování" },
  resource_pack: { vyvojova: "development_resource_packs", pripona: "_rp", popis: "vzhled" },
};

const PLATNE_ID = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export function overId(id) {
  if (typeof id !== "string" || !PLATNE_ID.test(id)) {
    throw new ChybaNastroje(
      `"${id}" není platné jméno add-onu. Použij malá písmena bez diakritiky, číslice, pomlčku nebo podtržítko (např. magicky-blok).`,
    );
  }
  return id;
}

function packyVeSlozce(slozka) {
  return Object.keys(PACKY).filter((pack) => fs.existsSync(path.join(slozka, pack, "manifest.json")));
}

/**
 * Najde všechny add-ony v projects/. Add-on je složka, která má aspoň jeden manifest.json.
 * Složky bez manifestu vrací zvlášť jako "prazdne", složky se špatným jménem jako "spatne".
 */
export function najdiAddony(koren) {
  const slozkaProjektu = path.join(koren, SLOZKA_ADDONU);
  const vysledek = { addony: [], prazdne: [], spatne: [] };
  if (!fs.existsSync(slozkaProjektu)) return vysledek;
  for (const jmeno of fs.readdirSync(slozkaProjektu).sort()) {
    const slozka = path.join(slozkaProjektu, jmeno);
    if (jmeno.startsWith(".") || !fs.statSync(slozka).isDirectory()) continue;
    if (!PLATNE_ID.test(jmeno)) {
      vysledek.spatne.push(jmeno);
      continue;
    }
    const packy = packyVeSlozce(slozka);
    if (packy.length === 0) vysledek.prazdne.push(jmeno);
    else vysledek.addony.push({ id: jmeno, slozka, packy });
  }
  return vysledek;
}

/** Načte jeden add-on podle jména, nebo srozumitelně vysvětlí, proč to nejde. */
export function nactiAddon(koren, id) {
  overId(id);
  const slozka = path.join(koren, SLOZKA_ADDONU, id);
  if (!fs.existsSync(slozka)) {
    throw new ChybaNastroje(
      `Add-on "${id}" neexistuje (hledám složku ${SLOZKA_ADDONU}/${id}). Nový založíš: npm run bedrock:new ${id}`,
    );
  }
  const packy = packyVeSlozce(slozka);
  if (packy.length === 0) {
    throw new ChybaNastroje(
      `Add-on "${id}" nemá ani behavior_pack/manifest.json, ani resource_pack/manifest.json. ` +
        `Kostru doplní: npm run bedrock:new ${id}`,
    );
  }
  return { id, slozka, packy };
}

/** Složka s buildem add-onu: dist/<id>/. */
export function slozkaBuildu(koren, id) {
  return path.join(koren, SLOZKA_DIST, id);
}
