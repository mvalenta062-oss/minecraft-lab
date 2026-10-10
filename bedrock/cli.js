#!/usr/bin/env node
// Příkazová řádka pro add-ony. Spouští se z kořene repa přes npm:
//   npm run bedrock:new <addon>        založí nový add-on v projects/
//   npm run bedrock:validate [addon]   zkontroluje manifesty a JSON
//   npm run bedrock:build [addon]      sestaví do dist/
//   npm run bedrock:deploy [addon]     sestaví a nakopíruje do Minecraftu
//   npm run bedrock:package [addon]    sestaví, zabalí do .mcaddon a přepíše katalog pro web
// Bez jména add-onu se příkaz týká všech add-onů v projects/.
import path from "node:path";
import { najdiAddony, nactiAddon, SLOZKA_ADDONU } from "./lib/addony.js";
import { KATALOG, slozkaDistribuce, vytvorKatalog, zabalAddon } from "./lib/balik.js";
import { buildAddon } from "./lib/build.js";
import { deployAddon } from "./lib/deploy.js";
import { najdiComMojang } from "./lib/konfigurace.js";
import { KOREN_REPA, nactiNastaveni, overInstalovanyServer } from "./lib/nastaveni.js";
import { vytvorAddon } from "./lib/novy.js";
import { validujVse } from "./lib/validace.js";
import { ChybaNastroje, chyba, hotovo, info, krok, ok, varovani } from "./lib/vystup.js";

const NAPOVEDA = `Použití: npm run bedrock:<příkaz> [addon] [-- --cil <složka com.mojang>]

Příkazy:
  new <addon>        založí nový add-on v ${SLOZKA_ADDONU}/<addon>
  validate [addon]   zkontroluje manifesty a JSON soubory
  build [addon]      sestaví add-on do dist/<addon>/
  deploy [addon]     sestaví a nakopíruje do Minecraftu (development_*_packs)
  package [addon]    sestaví, vytvoří .mcaddon a katalog pro web

Bez jména add-onu se pracuje se všemi add-ony v ${SLOZKA_ADDONU}/.
Jméno add-onu: malá písmena, číslice, pomlčka nebo podtržítko.
`;

function nactiArgumenty(argv) {
  const volby = { pozicni: [], cil: null, koren: null, napoveda: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") volby.napoveda = true;
    else if (arg === "--cil" || arg === "--koren") {
      const hodnota = argv[++i];
      if (!hodnota) throw new ChybaNastroje(`Za ${arg} chybí cesta.`);
      volby[arg.slice(2)] = hodnota;
    } else if (arg.startsWith("-")) throw new ChybaNastroje(`Neznámý přepínač ${arg}.\n\n${NAPOVEDA}`);
    else volby.pozicni.push(arg);
  }
  return volby;
}

/** Add-ony, se kterými příkaz pracuje: jeden podle jména, nebo všechny nalezené. */
function vyberAddony(koren, id) {
  if (id) return [nactiAddon(koren, id)];
  const { addony, prazdne, spatne } = najdiAddony(koren);
  for (const jmeno of spatne) {
    varovani(`složka ${SLOZKA_ADDONU}/${jmeno} má nepovolené jméno (malá písmena, číslice, - a _), přeskakuji`);
  }
  for (const jmeno of prazdne) {
    info(`${SLOZKA_ADDONU}/${jmeno}: zatím bez manifestu, přeskakuji (kostru doplní npm run bedrock:new ${jmeno})`);
  }
  if (addony.length === 0)
    info(`V ${SLOZKA_ADDONU}/ zatím není žádný add-on. Nový založíš: npm run bedrock:new <jmeno>`);
  return addony;
}

function vypisVarovani(seznam) {
  for (const v of seznam) varovani(v);
}

function prikazNew(koren, id, nastaveni) {
  if (!id) throw new ChybaNastroje(`Chybí jméno add-onu.\n\n${NAPOVEDA}`);
  krok(`Nový add-on ${id}`);
  const { slozka, vytvoreno, preskoceno } = vytvorAddon(koren, id, nastaveni);
  for (const soubor of vytvoreno) ok(`vytvořeno ${soubor}`);
  for (const soubor of preskoceno) info(`${soubor} už existuje, nechávám`);
  hotovo(`Add-on je ve složce ${path.relative(koren, slozka) || slozka}.`);
  info(`Další krok: npm run bedrock:deploy ${id}`);
}

function prikazValidate(koren, id, nastaveni) {
  krok("Kontrola add-onů");
  const addony = vyberAddony(koren, id);
  const vysledky = validujVse(addony, nastaveni);
  let chyb = 0;
  for (const addon of addony) {
    const { chyby, varovani: varovaniAddonu } = vysledky[addon.id];
    chyb += chyby.length;
    if (chyby.length === 0) ok(`${addon.id} (${addon.packy.join(" + ")})`);
    else chyba(`${addon.id}: ${chyby.length} chyb`);
    for (const c of chyby) chyba(`  ${c}`);
    vypisVarovani(varovaniAddonu);
  }
  if (chyb > 0) throw new ChybaNastroje(`Celkem ${chyb} chyb. Oprav je a spusť kontrolu znovu.`);
  hotovo("Vše v pořádku.");
  return addony;
}

async function prikazBuild(koren, id, nastaveni) {
  const addony = vyberAddony(koren, id);
  for (const addon of addony) {
    krok(`Build ${addon.id}`);
    const { vystup, varovani: varovaniAddonu, packy } = await buildAddon(koren, addon, nastaveni);
    vypisVarovani(varovaniAddonu);
    for (const { pack, skript } of packy) ok(`${pack}${skript ? ` (skript ${skript})` : ""}`);
    info(`výstup: ${path.relative(koren, vystup)}`);
  }
  if (addony.length > 0) hotovo("Build hotový.");
  return addony;
}

async function prikazDeploy(koren, id, nastaveni, volby) {
  const { cesta: comMojang, zdroj } = najdiComMojang(koren, volby.cil);
  const addony = await prikazBuild(koren, id, nastaveni);
  if (addony.length === 0) return;
  krok("Nasazení do Minecraftu");
  info(`com.mojang: ${comMojang} (${zdroj})`);
  for (const addon of addony) {
    for (const { pack, akce, cil } of deployAddon(koren, addon, comMojang))
      ok(`${addon.id}/${pack}: ${akce} -> ${cil}`);
  }
  hotovo("Nasazeno. Ve hře: nový nebo existující svět → Behavior Packs → Moje packy → zapnout.");
}

async function prikazPackage(koren, id, nastaveni) {
  const addony = await prikazBuild(koren, id, nastaveni);
  if (addony.length === 0) return;
  krok("Balení .mcaddon");
  for (const addon of addony) ok(`${addon.id} -> ${path.relative(koren, zabalAddon(koren, addon, nastaveni))}`);
  krok("Katalog pro web");
  const katalog = vytvorKatalog(koren, najdiAddony(koren).addony, nastaveni);
  const slozka = path.relative(koren, slozkaDistribuce(koren, nastaveni));
  for (const polozka of katalog.addony) info(`${polozka.id} ${polozka.verze}: ${polozka.nazev}`);
  ok(`${path.join(slozka, KATALOG)} (${katalog.addony.length} add-onů)`);
  hotovo(`Hotovo. Balíčky a katalog jsou v ${slozka}/, web je převezme při buildu.`);
}

async function main() {
  const volby = nactiArgumenty(process.argv.slice(2));
  const [prikaz, id] = volby.pozicni;
  if (volby.napoveda || !prikaz) {
    console.log(NAPOVEDA);
    return;
  }
  if (volby.pozicni.length > 2) throw new ChybaNastroje(`Moc argumentů: ${volby.pozicni.join(" ")}\n\n${NAPOVEDA}`);
  const koren = volby.koren ? path.resolve(volby.koren) : KOREN_REPA;
  const nastaveni = nactiNastaveni();
  overInstalovanyServer(nastaveni);

  switch (prikaz) {
    case "new":
      return prikazNew(koren, id, nastaveni);
    case "validate":
      return prikazValidate(koren, id, nastaveni);
    case "build":
      return prikazBuild(koren, id, nastaveni);
    case "deploy":
      return prikazDeploy(koren, id, nastaveni, volby);
    case "package":
      return prikazPackage(koren, id, nastaveni);
    default:
      throw new ChybaNastroje(`Neznámý příkaz "${prikaz}".\n\n${NAPOVEDA}`);
  }
}

main().catch((e) => {
  if (e instanceof ChybaNastroje) {
    console.error("");
    chyba(e.message);
    process.exitCode = 1;
  } else {
    console.error("\nNeočekávaná chyba (tohle je chyba nástroje, ne tvoje):");
    console.error(e);
    process.exitCode = 2;
  }
});
