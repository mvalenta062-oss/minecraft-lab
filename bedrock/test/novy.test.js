import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { after, before, describe, test } from "node:test";
import { najdiAddony, nactiAddon, overId } from "../lib/addony.js";
import { jeUuid } from "../lib/manifest.js";
import { hezkyNazev, vytvorAddon } from "../lib/novy.js";
import { validujAddon } from "../lib/validace.js";
import { ChybaNastroje } from "../lib/vystup.js";
import { NASTAVENI, docasnyKoren, nactiJsonSoubor, seznamSouboru } from "./pomocne.js";

describe("nový add-on", () => {
  let koren, uklid;
  before(() => ({ koren, uklid } = docasnyKoren()));
  after(() => uklid());

  test("založí kostru s platnými manifesty a bez chyb validace", () => {
    const { vytvoreno, preskoceno } = vytvorAddon(koren, "muj-addon", NASTAVENI);
    assert.deepEqual(vytvoreno, [
      "README.md",
      "behavior_pack/manifest.json",
      "behavior_pack/scripts/main.ts",
      "resource_pack/manifest.json",
    ]);
    assert.deepEqual(preskoceno, []);

    const addon = nactiAddon(koren, "muj-addon");
    assert.deepEqual(addon.packy, ["behavior_pack", "resource_pack"]);
    const bp = nactiJsonSoubor(path.join(addon.slozka, "behavior_pack", "manifest.json"));
    const rp = nactiJsonSoubor(path.join(addon.slozka, "resource_pack", "manifest.json"));
    assert.equal(bp.header.name, "Muj addon");
    assert.ok(jeUuid(bp.header.uuid));
    assert.notEqual(bp.header.uuid, rp.header.uuid);
    assert.deepEqual(bp.header.min_engine_version, NASTAVENI.minecraft);
    assert.equal(bp.dependencies[0].uuid, rp.header.uuid);
    assert.equal(bp.dependencies[1].version, NASTAVENI.server);

    const { chyby } = validujAddon(addon, NASTAVENI);
    assert.deepEqual(chyby, []);
  });

  test("opakované spuštění nic nepřepíše", () => {
    const readme = path.join(koren, "projects", "muj-addon", "README.md");
    fs.writeFileSync(readme, "# Moje poznámky\n");
    const { vytvoreno, preskoceno } = vytvorAddon(koren, "muj-addon", NASTAVENI);
    assert.deepEqual(vytvoreno, []);
    assert.equal(preskoceno.length, 4);
    assert.equal(fs.readFileSync(readme, "utf8"), "# Moje poznámky\n");
  });

  test("doplní jen chybějící soubory do existující složky", () => {
    fs.mkdirSync(path.join(koren, "projects", "druhy"), { recursive: true });
    fs.writeFileSync(path.join(koren, "projects", "druhy", "README.md"), "# Druhý\n");
    assert.deepEqual(najdiAddony(koren).prazdne, ["druhy"]);
    const { vytvoreno } = vytvorAddon(koren, "druhy", NASTAVENI);
    assert.ok(!vytvoreno.includes("README.md"));
    assert.ok(vytvoreno.includes("behavior_pack/manifest.json"));
    assert.deepEqual(seznamSouboru(path.join(koren, "projects", "druhy")), [
      "README.md",
      "behavior_pack/manifest.json",
      "behavior_pack/scripts/main.ts",
      "resource_pack/manifest.json",
    ]);
  });

  test("odmítne špatné jméno", () => {
    for (const spatne of ["Velke", "s mezerou", "háček", "-zacina-pomlckou", ""]) {
      assert.throws(() => overId(spatne), ChybaNastroje);
    }
    assert.equal(overId("ok-jmeno_1"), "ok-jmeno_1");
    assert.equal(hezkyNazev("magicky_blok-2"), "Magicky blok 2");
  });
});
