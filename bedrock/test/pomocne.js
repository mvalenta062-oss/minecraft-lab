// Pomůcky pro testy: dočasný kořen repa s projects/ (uvnitř dist/, aby fungovalo hledání node_modules).
import fs from "node:fs";
import path from "node:path";
import { KOREN_REPA, nactiNastaveni } from "../lib/nastaveni.js";

export const NASTAVENI = nactiNastaveni();
export const CLI = path.join(KOREN_REPA, "bedrock", "cli.js");

/** Založí dočasný kořen s projects/tsconfig.json a projects/*.d.ts zkopírovanými z repa. */
export function docasnyKoren() {
  const slozkaTestu = path.join(KOREN_REPA, "dist", ".test");
  fs.mkdirSync(slozkaTestu, { recursive: true });
  const koren = fs.mkdtempSync(path.join(slozkaTestu, "koren-"));
  const projekty = path.join(koren, "projects");
  fs.mkdirSync(projekty);
  for (const jmeno of fs.readdirSync(path.join(KOREN_REPA, "projects"))) {
    if (jmeno === "tsconfig.json" || jmeno.endsWith(".d.ts")) {
      fs.copyFileSync(path.join(KOREN_REPA, "projects", jmeno), path.join(projekty, jmeno));
    }
  }
  return { koren, uklid: () => fs.rmSync(koren, { recursive: true, force: true }) };
}

/** Dočasná složka com.mojang s oběma vývojovými složkami (mimo repo). */
export function docasnyComMojang() {
  const slozka = fs.mkdtempSync(path.join(fs.realpathSync(path.join(KOREN_REPA, "dist", ".test")), "com.mojang-"));
  fs.mkdirSync(path.join(slozka, "development_behavior_packs"));
  fs.mkdirSync(path.join(slozka, "development_resource_packs"));
  fs.mkdirSync(path.join(slozka, "minecraftWorlds"));
  return { slozka, uklid: () => fs.rmSync(slozka, { recursive: true, force: true }) };
}

/** Relativní cesty všech souborů ve složce, seřazené (s lomítky). */
export function seznamSouboru(slozka) {
  const vysledek = [];
  const projdi = (aktualni) => {
    for (const polozka of fs.readdirSync(aktualni, { withFileTypes: true })) {
      const cesta = path.join(aktualni, polozka.name);
      if (polozka.isDirectory()) projdi(cesta);
      else vysledek.push(path.relative(slozka, cesta).split(path.sep).join("/"));
    }
  };
  if (fs.existsSync(slozka)) projdi(slozka);
  return vysledek.sort();
}

export function nactiJsonSoubor(soubor) {
  return JSON.parse(fs.readFileSync(soubor, "utf8"));
}

export function zapisJsonSoubor(soubor, hodnota) {
  fs.mkdirSync(path.dirname(soubor), { recursive: true });
  fs.writeFileSync(soubor, JSON.stringify(hodnota, null, 2) + "\n");
}
