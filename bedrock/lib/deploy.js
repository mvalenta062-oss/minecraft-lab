// Nasazení buildu do Minecraftu: dist/<id>/<pack> -> com.mojang/development_*_packs/<id>_bp|_rp.
// Přepisujeme jen složky, které jsme sami vytvořili (poznáme je podle značky .minecraft-lab.json).
import fs from "node:fs";
import path from "node:path";
import { PACKY, slozkaBuildu } from "./addony.js";
import { nactiJson } from "./manifest.js";
import { ChybaNastroje } from "./vystup.js";

export const ZNACKA = ".minecraft-lab.json";

/** Složka v Minecraftu smí být přepsaná jen tehdy, když ji spravujeme my pro tenhle add-on. */
function overZeJeNase(cil, id) {
  const znacka = path.join(cil, ZNACKA);
  if (!fs.existsSync(znacka)) {
    throw new ChybaNastroje(
      `Ve složce ${cil} už je pack, který nespravuje minecraft-lab (chybí ${ZNACKA}). ` +
        "Smaž ho ručně, nebo add-on přejmenuj. Cizí packy nikdy nepřepisuju.",
    );
  }
  let obsah;
  try {
    obsah = nactiJson(znacka);
  } catch {
    obsah = {};
  }
  if (obsah.addon !== id) {
    throw new ChybaNastroje(`Složka ${cil} patří add-onu "${obsah.addon}", ne "${id}". Nepřepisuju ji.`);
  }
}

/**
 * Nasadí add-on (už sestavený v dist/) do složky com.mojang. Vrací seznam { pack, akce, cil }.
 * Pack, který add-on už nemá, ale dřív jsme ho nasadili, odstraní.
 */
export function deployAddon(koren, addon, comMojang) {
  const vysledky = [];
  for (const [pack, info] of Object.entries(PACKY)) {
    const vyvojova = path.join(comMojang, info.vyvojova);
    if (!fs.existsSync(vyvojova)) {
      throw new ChybaNastroje(`Složka ${vyvojova} neexistuje. Spusť setup/instalace-minecraft.ps1, ta ji založí.`);
    }
    const cil = path.join(vyvojova, addon.id + info.pripona);
    const zdroj = path.join(slozkaBuildu(koren, addon.id), pack);
    const existuje = fs.existsSync(cil);
    if (existuje) overZeJeNase(cil, addon.id);

    if (!addon.packy.includes(pack)) {
      if (existuje) {
        fs.rmSync(cil, { recursive: true, force: true });
        vysledky.push({ pack, akce: "odstraněno", cil });
      }
      continue;
    }
    if (!fs.existsSync(path.join(zdroj, "manifest.json"))) {
      throw new ChybaNastroje(`Chybí build v ${zdroj}. Spusť nejdřív: npm run bedrock:build ${addon.id}`);
    }
    fs.rmSync(cil, { recursive: true, force: true });
    fs.cpSync(zdroj, cil, { recursive: true });
    fs.writeFileSync(
      path.join(cil, ZNACKA),
      JSON.stringify(
        {
          addon: addon.id,
          spravuje: "minecraft-lab",
          poznamka: "Tuhle složku přepisuje npm run bedrock:deploy. Ručně v ní nic neměň, změny by se ztratily.",
        },
        null,
        2,
      ) + "\n",
    );
    vysledky.push({ pack, akce: existuje ? "přepsáno" : "nasazeno", cil });
  }
  return vysledky;
}
