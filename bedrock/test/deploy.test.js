import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { after, before, describe, test } from "node:test";
import { nactiAddon } from "../lib/addony.js";
import { buildAddon } from "../lib/build.js";
import { ZNACKA, deployAddon } from "../lib/deploy.js";
import { SOUBOR_LOKALNI, kandidatiComMojang, najdiComMojang } from "../lib/konfigurace.js";
import { vytvorAddon } from "../lib/novy.js";
import { ChybaNastroje } from "../lib/vystup.js";
import { NASTAVENI, docasnyComMojang, docasnyKoren, nactiJsonSoubor, seznamSouboru } from "./pomocne.js";

describe("deploy", () => {
  let koren, uklid, mc, uklidMc, addon, bpCil, rpCil;
  before(async () => {
    ({ koren, uklid } = docasnyKoren());
    ({ slozka: mc, uklid: uklidMc } = docasnyComMojang());
    vytvorAddon(koren, "nasazeni", NASTAVENI);
    addon = nactiAddon(koren, "nasazeni");
    await buildAddon(koren, addon, NASTAVENI);
    bpCil = path.join(mc, "development_behavior_packs", "nasazeni_bp");
    rpCil = path.join(mc, "development_resource_packs", "nasazeni_rp");
    // Cizí packy, kterých se nesmíme dotknout.
    fs.mkdirSync(path.join(mc, "development_behavior_packs", "cizi_bp"));
    fs.writeFileSync(path.join(mc, "development_behavior_packs", "cizi_bp", "manifest.json"), "{}");
    fs.writeFileSync(path.join(mc, "minecraftWorlds", "svet.txt"), "svět");
  });
  after(() => {
    uklid();
    uklidMc();
  });

  test("nakopíruje oba packy a označí je", () => {
    const vysledky = deployAddon(koren, addon, mc);
    assert.deepEqual(
      vysledky.map((v) => [v.pack, v.akce]),
      [
        ["behavior_pack", "nasazeno"],
        ["resource_pack", "nasazeno"],
      ],
    );
    assert.deepEqual(seznamSouboru(bpCil), [ZNACKA, "manifest.json", "scripts/main.js"]);
    assert.deepEqual(seznamSouboru(rpCil), [ZNACKA, "manifest.json"]);
    assert.equal(nactiJsonSoubor(path.join(bpCil, ZNACKA)).addon, "nasazeni");
  });

  test("opakovaný deploy přepíše a odstraní staré soubory jen v našem packu", () => {
    fs.writeFileSync(path.join(bpCil, "stary.json"), "{}");
    const vysledky = deployAddon(koren, addon, mc);
    assert.deepEqual(
      vysledky.map((v) => v.akce),
      ["přepsáno", "přepsáno"],
    );
    assert.deepEqual(seznamSouboru(bpCil), [ZNACKA, "manifest.json", "scripts/main.js"]);
    assert.deepEqual(seznamSouboru(path.join(mc, "development_behavior_packs", "cizi_bp")), ["manifest.json"]);
    assert.deepEqual(seznamSouboru(path.join(mc, "minecraftWorlds")), ["svet.txt"]);
  });

  test("cizí složku se stejným jménem nepřepíše", () => {
    fs.rmSync(path.join(rpCil, ZNACKA));
    assert.throws(
      () => deployAddon(koren, addon, mc),
      (e) => {
        assert.ok(e instanceof ChybaNastroje);
        assert.ok(e.message.includes("nespravuje minecraft-lab"));
        return true;
      },
    );
    assert.deepEqual(seznamSouboru(rpCil), ["manifest.json"]);
    fs.writeFileSync(path.join(rpCil, ZNACKA), JSON.stringify({ addon: "jiny-addon" }));
    assert.throws(() => deployAddon(koren, addon, mc), /patří add-onu "jiny-addon"/);
    fs.writeFileSync(path.join(rpCil, ZNACKA), JSON.stringify({ addon: "nasazeni" }));
  });

  test("pack, který add-on už nemá, z Minecraftu odstraní", async () => {
    fs.rmSync(path.join(addon.slozka, "resource_pack"), { recursive: true });
    const jenBp = nactiAddon(koren, "nasazeni");
    await buildAddon(koren, jenBp, NASTAVENI);
    const vysledky = deployAddon(koren, jenBp, mc);
    assert.deepEqual(
      vysledky.map((v) => [v.pack, v.akce]),
      [
        ["behavior_pack", "přepsáno"],
        ["resource_pack", "odstraněno"],
      ],
    );
    assert.ok(!fs.existsSync(rpCil));
  });

  test("bez buildu nebo bez vývojových složek srozumitelně selže", () => {
    fs.rmSync(path.join(mc, "development_resource_packs"), { recursive: true });
    assert.throws(() => deployAddon(koren, addon, mc), /instalace-minecraft\.ps1/);
    fs.mkdirSync(path.join(mc, "development_resource_packs"));
    fs.rmSync(path.join(koren, "dist", "nasazeni"), { recursive: true });
    assert.throws(() => deployAddon(koren, addon, mc), /bedrock:build nasazeni/);
  });
});

describe("hledání com.mojang", () => {
  let koren, uklid, mc, uklidMc;
  before(() => {
    ({ koren, uklid } = docasnyKoren());
    ({ slozka: mc, uklid: uklidMc } = docasnyComMojang());
  });
  after(() => {
    uklid();
    uklidMc();
  });

  test("bez konfigurace a bez Windows poradí, co dělat", () => {
    assert.throws(() => najdiComMojang(koren, null, {}), /instalace-minecraft\.ps1/);
  });

  test("zadaná cesta má přednost a musí existovat", () => {
    assert.deepEqual(najdiComMojang(koren, mc, {}), { cesta: mc, zdroj: "parametr --cil" });
    assert.throws(() => najdiComMojang(koren, path.join(mc, "neni"), {}), /neexistuje/);
  });

  test("čte bedrock.local.json včetně BOM", () => {
    const soubor = path.join(koren, SOUBOR_LOKALNI);
    fs.writeFileSync(soubor, "\uFEFF" + JSON.stringify({ comMojang: mc }));
    assert.deepEqual(najdiComMojang(koren, null, {}), { cesta: mc, zdroj: SOUBOR_LOKALNI });
    fs.writeFileSync(soubor, JSON.stringify({ comMojang: "" }));
    assert.throws(() => najdiComMojang(koren, null, {}), /musí obsahovat/);
    fs.writeFileSync(soubor, "{ rozbité");
    assert.throws(() => najdiComMojang(koren, null, {}), /nejde přečíst/);
    fs.rmSync(soubor);
  });

  test("na Windows zkouší známá místa ve stejném pořadí jako setup skript", () => {
    const env = { APPDATA: path.join(mc, "AppData", "Roaming"), LOCALAPPDATA: path.join(mc, "AppData", "Local") };
    const kandidati = kandidatiComMojang(env);
    assert.equal(kandidati.length, 4);
    assert.ok(kandidati[0].includes(path.join("Minecraft Bedrock", "Users", "Shared", "games", "com.mojang")));
    assert.ok(kandidati[1].includes("Microsoft.MinecraftUWP_8wekyb3d8bbwe"));
    fs.mkdirSync(kandidati[1], { recursive: true });
    assert.deepEqual(najdiComMojang(koren, null, env), { cesta: kandidati[1], zdroj: "automaticky nalezeno" });
    fs.mkdirSync(kandidati[0], { recursive: true });
    assert.equal(najdiComMojang(koren, null, env).cesta, kandidati[0]);
  });
});
