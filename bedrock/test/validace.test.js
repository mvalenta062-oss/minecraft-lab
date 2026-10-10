import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { after, before, describe, test } from "node:test";
import { najdiAddony, nactiAddon } from "../lib/addony.js";
import { vytvorAddon } from "../lib/novy.js";
import { validujAddon, validujVse } from "../lib/validace.js";
import { NASTAVENI, docasnyKoren, nactiJsonSoubor, zapisJsonSoubor } from "./pomocne.js";

function obsahuje(seznam, text) {
  return seznam.some((polozka) => polozka.includes(text));
}

describe("validace", () => {
  let koren, uklid;
  before(() => {
    ({ koren, uklid } = docasnyKoren());
    vytvorAddon(koren, "dobry", NASTAVENI);
  });
  after(() => uklid());

  const manifestBp = (id) => path.join(koren, "projects", id, "behavior_pack", "manifest.json");

  test("čerstvý add-on projde, jen upozorní na chybějící ikonu", () => {
    const { chyby, varovani } = validujAddon(nactiAddon(koren, "dobry"), NASTAVENI);
    assert.deepEqual(chyby, []);
    assert.equal(varovani.length, 2);
    assert.ok(obsahuje(varovani, "pack_icon.png"));
  });

  test("najde špatné UUID, verzi serveru a chybějící zdroj skriptu", () => {
    vytvorAddon(koren, "spatny", NASTAVENI);
    const manifest = nactiJsonSoubor(manifestBp("spatny"));
    manifest.header.uuid = "tohle-neni-uuid";
    manifest.dependencies[1].version = "1.0.0";
    manifest.modules[1].entry = "scripts/jiny.js";
    zapisJsonSoubor(manifestBp("spatny"), manifest);

    const { chyby } = validujAddon(nactiAddon(koren, "spatny"), NASTAVENI);
    assert.ok(obsahuje(chyby, "header.uuid"));
    assert.ok(obsahuje(chyby, `cílová verze je "${NASTAVENI.server}"`));
    assert.ok(obsahuje(chyby, "scripts/jiny.ts"));
  });

  test("najde rozbitý JSON kdekoli v packu", () => {
    const soubor = path.join(koren, "projects", "dobry", "resource_pack", "textures", "rozbity.json");
    fs.mkdirSync(path.dirname(soubor), { recursive: true });
    fs.writeFileSync(soubor, "{ tohle není json");
    const { chyby } = validujAddon(nactiAddon(koren, "dobry"), NASTAVENI);
    assert.equal(chyby.length, 1);
    assert.ok(chyby[0].startsWith("dobry/resource_pack/textures/rozbity.json"));
    fs.rmSync(path.dirname(soubor), { recursive: true });
  });

  test("manifest s BOM je v pořádku", () => {
    const soubor = manifestBp("dobry");
    const puvodni = fs.readFileSync(soubor, "utf8");
    fs.writeFileSync(soubor, "\uFEFF" + puvodni);
    assert.deepEqual(validujAddon(nactiAddon(koren, "dobry"), NASTAVENI).chyby, []);
    fs.writeFileSync(soubor, puvodni);
  });

  test("hlídá vazbu behavior packu na resource pack", () => {
    const manifest = nactiJsonSoubor(manifestBp("dobry"));
    const puvodni = structuredClone(manifest);
    manifest.dependencies[0].version = [9, 9, 9];
    zapisJsonSoubor(manifestBp("dobry"), manifest);
    assert.ok(
      obsahuje(validujAddon(nactiAddon(koren, "dobry"), NASTAVENI).chyby, "závisí na resource packu ve verzi 9.9.9"),
    );

    manifest.dependencies.splice(0, 1);
    zapisJsonSoubor(manifestBp("dobry"), manifest);
    const vysledek = validujAddon(nactiAddon(koren, "dobry"), NASTAVENI);
    assert.deepEqual(vysledek.chyby, []);
    assert.ok(obsahuje(vysledek.varovani, 'nemá v "dependencies" uuid resource packu'));
    zapisJsonSoubor(manifestBp("dobry"), puvodni);
  });

  test("stejné UUID ve dvou add-onech je chyba", () => {
    vytvorAddon(koren, "kopie", NASTAVENI);
    const zdroj = nactiJsonSoubor(manifestBp("dobry"));
    const kopie = nactiJsonSoubor(manifestBp("kopie"));
    kopie.header.uuid = zdroj.header.uuid;
    zapisJsonSoubor(manifestBp("kopie"), kopie);

    const vysledky = validujVse([nactiAddon(koren, "dobry"), nactiAddon(koren, "kopie")], NASTAVENI);
    assert.deepEqual(vysledky.dobry.chyby, []);
    assert.ok(obsahuje(vysledky.kopie.chyby, "už používá dobry/behavior_pack header"));
  });

  test("add-on jen s resource packem je platný", () => {
    vytvorAddon(koren, "jen-vzhled", NASTAVENI);
    fs.rmSync(path.join(koren, "projects", "jen-vzhled", "behavior_pack"), { recursive: true });
    const addon = nactiAddon(koren, "jen-vzhled");
    assert.deepEqual(addon.packy, ["resource_pack"]);
    assert.deepEqual(validujAddon(addon, NASTAVENI).chyby, []);
  });

  test("hledání add-onů rozliší prázdné složky a špatná jména", () => {
    fs.mkdirSync(path.join(koren, "projects", "prazdny"));
    fs.mkdirSync(path.join(koren, "projects", "Spatne Jmeno"));
    const { addony, prazdne, spatne } = najdiAddony(koren);
    assert.deepEqual(
      addony.map((a) => a.id),
      ["dobry", "jen-vzhled", "kopie", "spatny"],
    );
    assert.deepEqual(prazdne, ["prazdny"]);
    assert.deepEqual(spatne, ["Spatne Jmeno"]);
  });
});
