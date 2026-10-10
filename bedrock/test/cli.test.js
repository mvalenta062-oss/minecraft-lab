import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { after, before, describe, test } from "node:test";
import { CLI, docasnyComMojang, docasnyKoren, seznamSouboru } from "./pomocne.js";

function spust(...argumenty) {
  const vysledek = spawnSync(process.execPath, [CLI, ...argumenty], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });
  return { kod: vysledek.status, vystup: vysledek.stdout + vysledek.stderr };
}

describe("příkazová řádka", () => {
  let koren, uklid, mc, uklidMc;
  before(() => {
    ({ koren, uklid } = docasnyKoren());
    ({ slozka: mc, uklid: uklidMc } = docasnyComMojang());
  });
  after(() => {
    uklid();
    uklidMc();
  });

  test("bez příkazu vypíše nápovědu, neznámý příkaz je chyba", () => {
    assert.equal(spust().kod, 0);
    assert.ok(spust().vystup.includes("Použití"));
    const { kod, vystup } = spust("smazat");
    assert.equal(kod, 1);
    assert.ok(vystup.includes('Neznámý příkaz "smazat"'));
  });

  test("new bez jména a build neexistujícího add-onu srozumitelně selžou", () => {
    assert.ok(spust("new", "--koren", koren).vystup.includes("Chybí jméno add-onu"));
    const { kod, vystup } = spust("build", "neni", "--koren", koren);
    assert.equal(kod, 1);
    assert.ok(vystup.includes('Add-on "neni" neexistuje'));
  });

  test("celý postup: new, validate, build, deploy, package", () => {
    assert.equal(spust("new", "cli-addon", "--koren", koren).kod, 0);
    assert.equal(spust("validate", "--koren", koren).kod, 0);
    assert.equal(spust("build", "cli-addon", "--koren", koren).kod, 0);
    assert.ok(fs.existsSync(path.join(koren, "dist", "cli-addon", "behavior_pack", "scripts", "main.js")));

    const deploy = spust("deploy", "cli-addon", "--koren", koren, "--cil", mc);
    assert.equal(deploy.kod, 0, deploy.vystup);
    assert.ok(deploy.vystup.includes("nasazeno"));
    assert.ok(fs.existsSync(path.join(mc, "development_behavior_packs", "cli-addon_bp", "manifest.json")));
    assert.equal(spust("deploy", "cli-addon", "--koren", koren, "--cil", mc).kod, 0, "druhý deploy projde");

    const balik = spust("package", "--koren", koren);
    assert.equal(balik.kod, 0, balik.vystup);
    assert.deepEqual(seznamSouboru(path.join(koren, "web", "public", "addony")), ["cli-addon.mcaddon", "katalog.json"]);
  });

  test("deploy bez konfigurace poradí a nic nesestaví navíc", () => {
    const { kod, vystup } = spust("deploy", "cli-addon", "--koren", koren, "--cil", path.join(mc, "neni"));
    assert.equal(kod, 1);
    assert.ok(vystup.includes("neexistuje"));
  });

  test("validate nahlásí chybu v manifestu s nenulovým kódem", () => {
    const manifest = path.join(koren, "projects", "cli-addon", "resource_pack", "manifest.json");
    const obsah = JSON.parse(fs.readFileSync(manifest, "utf8"));
    obsah.modules[0].type = "data";
    fs.writeFileSync(manifest, JSON.stringify(obsah));
    const { kod, vystup } = spust("validate", "cli-addon", "--koren", koren);
    assert.equal(kod, 1);
    assert.ok(vystup.includes("v resource_pack může být jen resources"));
  });
});
