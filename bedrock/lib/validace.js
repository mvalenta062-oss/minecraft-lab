// Kontrola struktury add-onů a jejich manifestů. Vrací seznam chyb a varování, nic nevyhazuje.
import fs from "node:fs";
import path from "node:path";
import { PACKY } from "./addony.js";
import { jeUuid, jeVerze, nactiJson, projdiSoubory, verzeNaText } from "./manifest.js";

/** Soubor se zdrojem skriptu k zadanému entry (scripts/main.js -> scripts/main.ts nebo .js). */
export function najdiZdrojSkriptu(slozkaPacku, entry) {
  const bezPripony = entry.replace(/\.js$/, "");
  for (const pripona of [".ts", ".js"]) {
    const soubor = path.join(slozkaPacku, bezPripony + pripona);
    if (fs.existsSync(soubor)) return soubor;
  }
  return null;
}

function validujPack(addon, pack, nastaveni, vysledek) {
  const slozka = path.join(addon.slozka, pack);
  const kde = `${addon.id}/${pack}`;
  const { chyby, varovani } = vysledek;

  let manifest;
  try {
    manifest = nactiJson(path.join(slozka, "manifest.json"));
  } catch (e) {
    chyby.push(`${kde}/manifest.json nejde přečíst: ${e.message}`);
    return null;
  }

  if (manifest.format_version !== 2) chyby.push(`${kde}/manifest.json: "format_version" má být 2`);

  const hlavicka = manifest.header;
  if (!hlavicka || typeof hlavicka !== "object") {
    chyby.push(`${kde}/manifest.json: chybí "header"`);
  } else {
    if (typeof hlavicka.name !== "string" || !hlavicka.name.trim()) chyby.push(`${kde}: header.name chybí`);
    if (typeof hlavicka.description !== "string") varovani.push(`${kde}: header.description chybí`);
    if (!jeUuid(hlavicka.uuid)) chyby.push(`${kde}: header.uuid není platné UUID`);
    if (!jeVerze(hlavicka.version)) chyby.push(`${kde}: header.version má být např. [1, 0, 0]`);
    if (!jeVerze(hlavicka.min_engine_version)) {
      chyby.push(`${kde}: header.min_engine_version má být např. [${nastaveni.minecraft.join(", ")}]`);
    }
  }

  const povoleneTypy = pack === "behavior_pack" ? ["data", "script"] : ["resources"];
  const moduly = Array.isArray(manifest.modules) ? manifest.modules : [];
  if (moduly.length === 0) chyby.push(`${kde}/manifest.json: "modules" chybí nebo je prázdné`);
  moduly.forEach((modul, i) => {
    const kdeModul = `${kde}: modules[${i}]`;
    if (!povoleneTypy.includes(modul.type)) {
      chyby.push(`${kdeModul} má type "${modul.type}", v ${pack} může být jen ${povoleneTypy.join(" nebo ")}`);
    }
    if (!jeUuid(modul.uuid)) chyby.push(`${kdeModul}: uuid není platné UUID`);
    if (!jeVerze(modul.version)) chyby.push(`${kdeModul}: version má být např. [1, 0, 0]`);
    if (modul.type === "script") {
      if (modul.language !== "javascript") chyby.push(`${kdeModul}: language má být "javascript"`);
      if (typeof modul.entry !== "string" || !modul.entry.startsWith("scripts/") || !modul.entry.endsWith(".js")) {
        chyby.push(`${kdeModul}: entry má být cesta ve tvaru scripts/main.js`);
      } else if (!najdiZdrojSkriptu(slozka, modul.entry)) {
        chyby.push(`${kdeModul}: zdroj skriptu ${modul.entry.replace(/\.js$/, ".ts")} (nebo .js) neexistuje`);
      }
      const zavislosti = Array.isArray(manifest.dependencies) ? manifest.dependencies : [];
      if (!zavislosti.some((z) => z.module_name === "@minecraft/server")) {
        chyby.push(
          `${kde}: skript potřebuje v "dependencies" { "module_name": "@minecraft/server", "version": "${nastaveni.server}" }`,
        );
      }
    }
  });

  const zavislosti = Array.isArray(manifest.dependencies) ? manifest.dependencies : [];
  zavislosti.forEach((z, i) => {
    const kdeZav = `${kde}: dependencies[${i}]`;
    if (z.module_name) {
      if (z.module_name === "@minecraft/server" && verzeNaText(z.version) !== nastaveni.server) {
        chyby.push(
          `${kdeZav}: @minecraft/server má verzi "${verzeNaText(z.version)}", ` +
            `cílová verze je "${nastaveni.server}" (bedrock/nastaveni.json)`,
        );
      }
    } else if (!jeUuid(z.uuid)) {
      chyby.push(`${kdeZav}: uuid není platné UUID`);
    }
  });

  for (const soubor of projdiSoubory(slozka)) {
    if (!soubor.endsWith(".json") || soubor.endsWith(path.join(slozka, "manifest.json"))) continue;
    try {
      nactiJson(soubor);
    } catch (e) {
      chyby.push(`${addon.id}/${path.relative(addon.slozka, soubor).split(path.sep).join("/")}: ${e.message}`);
    }
  }

  if (!fs.existsSync(path.join(slozka, "pack_icon.png"))) varovani.push(`${kde}: chybí pack_icon.png (ikona ve hře)`);
  if (
    pack === "behavior_pack" &&
    fs.existsSync(path.join(slozka, "scripts")) &&
    !moduly.some((m) => m.type === "script")
  ) {
    varovani.push(`${kde}: složka scripts/ existuje, ale manifest nemá modul typu "script", skripty se nepoužijí`);
  }
  return manifest;
}

/** Zkontroluje jeden add-on. Vrací { chyby, varovani, manifesty }. */
export function validujAddon(addon, nastaveni) {
  const vysledek = { chyby: [], varovani: [], manifesty: {} };
  for (const pack of addon.packy) {
    const manifest = validujPack(addon, pack, nastaveni, vysledek);
    if (manifest) vysledek.manifesty[pack] = manifest;
  }

  const bp = vysledek.manifesty.behavior_pack;
  const rp = vysledek.manifesty.resource_pack;
  if (bp?.header && rp?.header) {
    const naRp = (Array.isArray(bp.dependencies) ? bp.dependencies : []).find((z) => z.uuid === rp.header.uuid);
    if (!naRp) {
      vysledek.varovani.push(
        `${addon.id}: behavior_pack nemá v "dependencies" uuid resource packu (${rp.header.uuid}), Minecraft je pak nezapne spolu`,
      );
    } else if (verzeNaText(naRp.version) !== verzeNaText(rp.header.version)) {
      vysledek.chyby.push(
        `${addon.id}: behavior_pack závisí na resource packu ve verzi ${verzeNaText(naRp.version)}, ` +
          `ale resource pack má verzi ${verzeNaText(rp.header.version)}`,
      );
    }
  }
  return vysledek;
}

/** Zkontroluje víc add-onů najednou včetně toho, že se UUID neopakují. */
export function validujVse(addony, nastaveni) {
  const vysledky = {};
  const uuidKde = new Map();
  for (const addon of addony) {
    const vysledek = validujAddon(addon, nastaveni);
    vysledky[addon.id] = vysledek;
    for (const [pack, manifest] of Object.entries(vysledek.manifesty)) {
      const zaznamy = [[manifest.header?.uuid, `${addon.id}/${pack} header`]];
      (Array.isArray(manifest.modules) ? manifest.modules : []).forEach((m, i) =>
        zaznamy.push([m.uuid, `${addon.id}/${pack} modules[${i}]`]),
      );
      for (const [uuid, kde] of zaznamy) {
        if (!jeUuid(uuid)) continue;
        const klic = uuid.toLowerCase();
        if (uuidKde.has(klic)) {
          vysledek.chyby.push(`${kde}: UUID ${uuid} už používá ${uuidKde.get(klic)}. Každé UUID musí být jiné.`);
        } else {
          uuidKde.set(klic, kde);
        }
      }
    }
  }
  return vysledky;
}

export { PACKY };
