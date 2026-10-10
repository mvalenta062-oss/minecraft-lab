import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { after, before, describe, test } from "node:test";
import { unzipSync } from "fflate";
import { najdiAddony, nactiAddon } from "../lib/addony.js";
import { KATALOG, slozkaDistribuce, vytvorKatalog, zabalAddon } from "../lib/balik.js";
import { buildAddon } from "../lib/build.js";
import { vytvorAddon } from "../lib/novy.js";
import { NASTAVENI, docasnyKoren, nactiJsonSoubor, zapisJsonSoubor } from "./pomocne.js";

describe("balení a katalog", () => {
  let koren, uklid, distribuce;
  before(async () => {
    ({ koren, uklid } = docasnyKoren());
    distribuce = slozkaDistribuce(koren, NASTAVENI);
    vytvorAddon(koren, "balik", NASTAVENI);
    vytvorAddon(koren, "druhy-balik", NASTAVENI);
    // Překlad názvu přes texts/*.lang
    const rp = path.join(koren, "projects", "druhy-balik", "resource_pack");
    const manifest = nactiJsonSoubor(path.join(rp, "manifest.json"));
    manifest.header.name = "pack.name";
    manifest.header.description = "pack.description";
    zapisJsonSoubor(path.join(rp, "manifest.json"), manifest);
    fs.mkdirSync(path.join(rp, "texts"));
    fs.writeFileSync(
      path.join(rp, "texts", "cs_CZ.lang"),
      "pack.name=Druhý balík\t## komentář\npack.description=Popis z lang\n",
    );
    fs.rmSync(path.join(koren, "projects", "druhy-balik", "behavior_pack"), { recursive: true });
    for (const id of ["balik", "druhy-balik"]) await buildAddon(koren, nactiAddon(koren, id), NASTAVENI);
  });
  after(() => uklid());

  test("vytvoří .mcaddon se správnou strukturou", () => {
    const soubor = zabalAddon(koren, nactiAddon(koren, "balik"), NASTAVENI);
    assert.equal(soubor, path.join(distribuce, "balik.mcaddon"));
    const obsah = unzipSync(fs.readFileSync(soubor));
    assert.deepEqual(Object.keys(obsah).sort(), [
      "balik_bp/manifest.json",
      "balik_bp/scripts/main.js",
      "balik_rp/manifest.json",
    ]);
    const manifest = JSON.parse(Buffer.from(obsah["balik_bp/manifest.json"]).toString("utf8"));
    assert.equal(manifest.format_version, 2);
  });

  test("stejný build dá byte po bytu stejný archiv", () => {
    const addon = nactiAddon(koren, "balik");
    const prvni = fs.readFileSync(zabalAddon(koren, addon, NASTAVENI));
    const druhy = fs.readFileSync(zabalAddon(koren, addon, NASTAVENI));
    assert.ok(prvni.equals(druhy));
  });

  test("balení bez buildu srozumitelně selže", () => {
    fs.rmSync(path.join(koren, "dist", "druhy-balik"), { recursive: true });
    assert.throws(() => zabalAddon(koren, nactiAddon(koren, "druhy-balik"), NASTAVENI), /bedrock:build druhy-balik/);
  });

  test("katalog popíše zabalené add-ony s relativní URL a překladem názvu", async () => {
    await buildAddon(koren, nactiAddon(koren, "druhy-balik"), NASTAVENI);
    zabalAddon(koren, nactiAddon(koren, "druhy-balik"), NASTAVENI);
    const katalog = vytvorKatalog(koren, najdiAddony(koren).addony, NASTAVENI);
    assert.deepEqual(katalog, nactiJsonSoubor(path.join(distribuce, KATALOG)));
    assert.equal(katalog.addony.length, 2);
    const [balik, druhy] = katalog.addony;
    assert.equal(balik.id, "balik");
    assert.equal(balik.url, "balik.mcaddon");
    assert.equal(balik.verze, "1.0.0");
    assert.equal(balik.minecraft, NASTAVENI.minecraft.join("."));
    assert.deepEqual(balik.packy, ["behavior_pack", "resource_pack"]);
    assert.equal(balik.velikost, fs.statSync(path.join(distribuce, "balik.mcaddon")).size);
    assert.equal(druhy.nazev, "Druhý balík");
    assert.equal(druhy.popis, "Popis z lang");
    assert.deepEqual(druhy.packy, ["resource_pack"]);
    assert.ok(!JSON.stringify(katalog).includes(koren), "v katalogu nesmí být absolutní cesty");
  });

  test("katalog vynechá add-on bez balíčku a smaže osiřelé .mcaddon", () => {
    fs.writeFileSync(path.join(distribuce, "smazany.mcaddon"), "x");
    fs.rmSync(path.join(distribuce, "balik.mcaddon"));
    const katalog = vytvorKatalog(koren, najdiAddony(koren).addony, NASTAVENI);
    assert.deepEqual(
      katalog.addony.map((a) => a.id),
      ["druhy-balik"],
    );
    assert.deepEqual(fs.readdirSync(distribuce).sort(), ["druhy-balik.mcaddon", KATALOG]);
  });
});
