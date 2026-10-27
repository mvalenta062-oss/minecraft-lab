import assert from "node:assert/strict";
import console from "node:console";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { URL } from "node:url";
import { transformSync } from "esbuild";

const zdroj = readFileSync(new URL("../behavior_pack/scripts/sipy.ts", import.meta.url), "utf8");
const kod = transformSync(zdroj.replace(/^import .*?;\s*/gm, "").replace("export function", "function"), {
  loader: "ts",
}).code;
const popisEntity = JSON.parse(
  readFileSync(new URL("../behavior_pack/entities/zabodnuty_sip.json", import.meta.url), "utf8"),
)["minecraft:entity"].description;
function dilna() {
  let krok, odchod, smrt;
  const fronta = [],
    entity = [];
  const system = {
    currentTick: 0,
    run: (fn) => fronta.push(fn),
    runInterval: (fn) => {
      krok = fn;
    },
  };
  const dimension = {
    id: "overworld",
    spawnEntity: (id) => {
      assert.equal(id, popisEntity.identifier);
      if (!popisEntity.is_summonable) throw new Error("Dekorace šípu má zakázané vytvoření pomocí spawnEntity");
      const e = {
        isValid: true,
        dimension,
        remove() {
          this.isValid = false;
        },
        teleport(p, o) {
          this.location = p;
          this.rotation = o.rotation;
        },
      };
      entity.push(e);
      return e;
    },
  };
  let kosile = true;
  const hrac = {
    id: "hrac1",
    isValid: true,
    isSneaking: false,
    dimension,
    location: { x: 0, y: 64, z: 0 },
    rotation: { x: 0, y: 0 },
    getRotation() {
      return this.rotation;
    },
    getComponent: () => ({ getEquipment: () => (kosile ? { typeId: "factory:drevena_kosile" } : undefined) }),
  };
  const context = vm.createContext({
    console,
    system,
    EntityComponentTypes: { Equippable: "equippable" },
    EquipmentSlot: { Chest: "Chest" },
    world: {
      afterEvents: {
        playerLeave: {
          subscribe: (fn) => {
            odchod = fn;
          },
        },
        entityDie: {
          subscribe: (fn) => {
            smrt = fn;
          },
        },
      },
    },
  });
  vm.runInContext(kod, context);
  return {
    hrac,
    entity,
    system,
    sundej: () => {
      kosile = false;
    },
    zasah: () => {
      context.zaznamenejSip(hrac, { getVelocity: () => ({ x: 0, y: 0, z: 1 }) });
    },
    dokonci: () => {
      fronta.splice(0).forEach((fn) => fn());
    },
    krok: () => krok(),
    odchod: () => odchod({ playerId: hrac.id }),
    smrt: () => smrt({ deadEntity: hrac }),
    zive: () => entity.filter((e) => e.isValid),
  };
}
test("Dekorace vzniká až mimo before událost a nepřekročí pět šípů", () => {
  const d = dilna();
  for (let i = 0; i < 8; i++) d.zasah();
  assert.equal(d.entity.length, 0);
  d.dokonci();
  assert.equal(d.zive().length, 5);
  assert.equal(d.entity.length, 8);
});
test("Každý šíp mizí po vlastních 20 sekundách", () => {
  const d = dilna();
  d.zasah();
  d.dokonci();
  d.system.currentTick = 100;
  d.zasah();
  d.dokonci();
  d.system.currentTick = 400;
  d.krok();
  assert.equal(d.zive().length, 1);
  d.system.currentTick = 500;
  d.krok();
  assert.equal(d.zive().length, 0);
});
test("Sundání, smrt, odchod a změna dimenze dekorace uklidí", () => {
  for (const zmena of ["sundej", "smrt", "odchod", "dimenze"]) {
    const d = dilna();
    d.zasah();
    d.dokonci();
    if (zmena === "dimenze") d.hrac.dimension = { id: "nether" };
    else d[zmena]();
    d.krok();
    assert.equal(d.zive().length, 0, zmena);
  }
});
test("Sundání před odloženým zobrazením nevytvoří dekoraci", () => {
  const d = dilna();
  d.zasah();
  d.sundej();
  d.dokonci();
  assert.equal(d.entity.length, 0);
});
test("Šíp následuje posun, otočení i přikrčení hráče", () => {
  const d = dilna();
  d.zasah();
  d.dokonci();
  const e = d.zive()[0],
    p = { ...e.location };
  d.hrac.location.x = 10;
  d.krok();
  assert.equal(e.location.x, p.x + 10);
  d.hrac.isSneaking = true;
  d.krok();
  assert.equal(e.location.y, p.y - 0.25);
  d.hrac.rotation.y = 90;
  d.krok();
  assert.equal(e.rotation.y, 90);
  assert.ok(Math.abs(e.location.z) < 0.3);
});
test("Zmizelá entita dekorace nezpůsobí chybu", () => {
  const d = dilna();
  d.zasah();
  d.dokonci();
  d.zive()[0].isValid = false;
  assert.doesNotThrow(() => d.krok());
  assert.equal(d.zive().length, 0);
});
