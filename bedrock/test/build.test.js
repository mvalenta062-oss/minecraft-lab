import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { after, before, describe, test } from "node:test";
import { nactiAddon } from "../lib/addony.js";
import { buildAddon } from "../lib/build.js";
import { vytvorAddon } from "../lib/novy.js";
import { ChybaNastroje } from "../lib/vystup.js";
import { NASTAVENI, docasnyKoren, nactiJsonSoubor, seznamSouboru, zapisJsonSoubor } from "./pomocne.js";

function otisk(slozka) {
  return seznamSouboru(slozka).map(
    (s) =>
      `${s} ${createHash("sha1")
        .update(fs.readFileSync(path.join(slozka, s)))
        .digest("hex")}`,
  );
}

describe("build", () => {
  let koren, uklid, addon;
  before(() => {
    ({ koren, uklid } = docasnyKoren());
    vytvorAddon(koren, "stavba", NASTAVENI);
    addon = nactiAddon(koren, "stavba");
    // Trochu obsahu navíc: JSON definice, textura (binární), dokumentace, pomocný modul.
    const bp = path.join(addon.slozka, "behavior_pack");
    const rp = path.join(addon.slozka, "resource_pack");
    zapisJsonSoubor(path.join(bp, "blocks", "kamen.json"), { format_version: "1.21.0" });
    fs.mkdirSync(path.join(rp, "textures", "blocks"), { recursive: true });
    fs.writeFileSync(
      path.join(rp, "textures", "blocks", "kamen.png"),
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 1, 2, 3]),
    );
    fs.writeFileSync(path.join(rp, "POZNAMKY.md"), "# jen poznámky\n");
    fs.writeFileSync(path.join(bp, "scripts", "pomocnik.ts"), "export const POZDRAV = `ahoj`;\n");
    fs.writeFileSync(
      path.join(bp, "scripts", "main.ts"),
      'import { world } from "@minecraft/server";\nimport { POZDRAV } from "./pomocnik";\n' +
        "world.afterEvents.worldLoad.subscribe(() => console.log(POZDRAV));\n",
    );
  });
  after(() => uklid());

  test("zkopíruje packy, přeloží a spojí skripty, dokumentaci vynechá", async () => {
    const { vystup, packy } = await buildAddon(koren, addon, NASTAVENI);
    assert.equal(vystup, path.join(koren, "dist", "stavba"));
    assert.deepEqual(
      packy.map((p) => p.skript),
      ["scripts/main.js", null],
    );
    assert.deepEqual(seznamSouboru(vystup), [
      "behavior_pack/blocks/kamen.json",
      "behavior_pack/manifest.json",
      "behavior_pack/scripts/main.js",
      "resource_pack/manifest.json",
      "resource_pack/textures/blocks/kamen.png",
    ]);
    const skript = fs.readFileSync(path.join(vystup, "behavior_pack", "scripts", "main.js"), "utf8");
    assert.ok(skript.includes('from "@minecraft/server"'), "import Minecraftu zůstane, hra ho dodá");
    assert.ok(skript.includes("ahoj"), "pomocný modul je spojený do jednoho souboru");
    assert.ok(!skript.includes("./pomocnik"), "žádný import relativního modulu");
    assert.deepEqual(
      nactiJsonSoubor(path.join(vystup, "behavior_pack", "manifest.json")),
      nactiJsonSoubor(path.join(addon.slozka, "behavior_pack", "manifest.json")),
    );
  });

  test("opakovaný build dá stejný výsledek a smaže staré soubory", async () => {
    const vystup = path.join(koren, "dist", "stavba");
    const prvni = otisk(vystup);
    fs.writeFileSync(path.join(vystup, "behavior_pack", "stary.json"), "{}");
    await buildAddon(koren, addon, NASTAVENI);
    assert.deepEqual(otisk(vystup), prvni);
  });

  test("chyba typu v TypeScriptu build zastaví", async () => {
    const main = path.join(addon.slozka, "behavior_pack", "scripts", "main.ts");
    const puvodni = fs.readFileSync(main, "utf8");
    fs.writeFileSync(main, 'const cislo: number = "text";\nconsole.log(cislo);\n');
    await assert.rejects(buildAddon(koren, addon, NASTAVENI), (e) => {
      assert.ok(e instanceof ChybaNastroje);
      assert.ok(e.message.includes("main.ts"), e.message);
      assert.ok(e.message.includes("TS2322"), e.message);
      return true;
    });
    fs.writeFileSync(main, puvodni);
  });

  test("chyba v manifestu build zastaví ještě před kopírováním", async () => {
    const manifest = path.join(addon.slozka, "resource_pack", "manifest.json");
    const puvodni = fs.readFileSync(manifest, "utf8");
    fs.writeFileSync(manifest, "{ rozbité");
    await assert.rejects(buildAddon(koren, addon, NASTAVENI), /manifest\.json nejde přečíst/);
    fs.writeFileSync(manifest, puvodni);
  });

  test("add-on bez skriptů se jen zkopíruje", async () => {
    vytvorAddon(koren, "bez-skriptu", NASTAVENI);
    const bez = nactiAddon(koren, "bez-skriptu");
    const manifestCesta = path.join(bez.slozka, "behavior_pack", "manifest.json");
    const manifest = nactiJsonSoubor(manifestCesta);
    manifest.modules = manifest.modules.filter((m) => m.type !== "script");
    manifest.dependencies = manifest.dependencies.filter((z) => !z.module_name);
    zapisJsonSoubor(manifestCesta, manifest);
    const { vystup, varovani } = await buildAddon(koren, bez, NASTAVENI);
    assert.ok(varovani.some((v) => v.includes("skripty se nepoužijí")));
    assert.deepEqual(seznamSouboru(vystup), ["behavior_pack/manifest.json", "resource_pack/manifest.json"]);
  });
});
