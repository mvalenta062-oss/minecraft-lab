// Založení nového add-onu: kostra složek, manifesty s čerstvými UUID a první skript.
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SLOZKA_ADDONU, overId } from "./addony.js";
import { jsonText } from "./manifest.js";

const SABLONA = fileURLToPath(new URL("../sablona/", import.meta.url));

/** Z "magicky-blok" udělá "Magicky blok". */
export function hezkyNazev(id) {
  const text = id.replace(/[-_]+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function zeSablony(soubor, nahrady) {
  let text = fs.readFileSync(path.join(SABLONA, soubor), "utf8");
  for (const [klic, hodnota] of Object.entries(nahrady)) text = text.replaceAll(`{{${klic}}}`, hodnota);
  return text;
}

/**
 * Vytvoří add-on projects/<id>/. Soubory, které už existují, nechá být (jde spustit opakovaně).
 * Vrací { slozka, vytvoreno, preskoceno }.
 */
export function vytvorAddon(koren, id, nastaveni) {
  overId(id);
  const slozka = path.join(koren, SLOZKA_ADDONU, id);
  const nazev = hezkyNazev(id);
  const uuidRp = randomUUID();
  const verze = [1, 0, 0];

  const behaviorManifest = {
    format_version: 2,
    header: {
      name: nazev,
      description: `${nazev} (chování)`,
      uuid: randomUUID(),
      version: verze,
      min_engine_version: nastaveni.minecraft,
    },
    modules: [
      { type: "data", uuid: randomUUID(), version: verze },
      { type: "script", language: "javascript", entry: "scripts/main.js", uuid: randomUUID(), version: verze },
    ],
    dependencies: [
      { uuid: uuidRp, version: verze },
      { module_name: "@minecraft/server", version: nastaveni.server },
    ],
  };
  const resourceManifest = {
    format_version: 2,
    header: {
      name: nazev,
      description: `${nazev} (vzhled)`,
      uuid: uuidRp,
      version: verze,
      min_engine_version: nastaveni.minecraft,
    },
    modules: [{ type: "resources", uuid: randomUUID(), version: verze }],
  };

  const nahrady = { ID: id, NAZEV: nazev };
  const soubory = {
    "README.md": zeSablony("README.md", nahrady),
    "behavior_pack/manifest.json": jsonText(behaviorManifest),
    "behavior_pack/scripts/main.ts": zeSablony("behavior_pack/scripts/main.ts", nahrady),
    "resource_pack/manifest.json": jsonText(resourceManifest),
  };

  const vytvoreno = [];
  const preskoceno = [];
  for (const [relativni, obsah] of Object.entries(soubory)) {
    const cil = path.join(slozka, ...relativni.split("/"));
    if (fs.existsSync(cil)) {
      preskoceno.push(relativni);
      continue;
    }
    fs.mkdirSync(path.dirname(cil), { recursive: true });
    fs.writeFileSync(cil, obsah);
    vytvoreno.push(relativni);
  }
  return { slozka, vytvoreno, preskoceno };
}
