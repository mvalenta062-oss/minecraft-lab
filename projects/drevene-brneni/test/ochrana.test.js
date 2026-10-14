import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { URL } from "node:url";
import { transformSync } from "esbuild";

const zdroj = readFileSync(new URL("../behavior_pack/scripts/main.ts", import.meta.url), "utf8");
const kod = transformSync(zdroj.replace(/^import .*?;\s*/s, ""), { loader: "ts" }).code;

function pokus({
  utocnik = "minecraft:zombie",
  kosile = "factory:drevena_kosile",
  pricina = "entityAttack",
  projektil = false,
  cil = "minecraft:player",
} = {}) {
  let callback;
  let odrazeni = 0;
  const cekajici = [];
  const hrac = {
    typeId: cil,
    isValid: true,
    dimension: { id: "overworld" },
    location: { x: 0, z: 0 },
    getComponent: () => ({ getEquipment: () => (kosile ? { typeId: kosile } : undefined) }),
    getViewDirection: () => ({ x: 1, z: 0 }),
  };
  const nepritel = {
    typeId: utocnik,
    isValid: true,
    dimension: hrac.dimension,
    location: { x: 1, z: 0 },
    applyKnockback: (smer) => {
      assert.ok(smer.x > 0);
      odrazeni++;
    },
  };
  vm.runInNewContext(kod, {
    EntityComponentTypes: { Equippable: "equippable" },
    EntityDamageCause: { entityAttack: "entityAttack" },
    EquipmentSlot: { Chest: "Chest" },
    system: { run: (fn) => cekajici.push(fn) },
    world: {
      beforeEvents: {
        entityHurt: {
          subscribe: (fn) => {
            callback = fn;
          },
        },
      },
    },
  });
  const event = {
    hurtEntity: hrac,
    damage: 1000,
    cancel: false,
    damageSource: {
      cause: pricina,
      damagingEntity: utocnik ? nepritel : undefined,
      damagingProjectile: projektil ? {} : undefined,
    },
  };
  callback(event);
  assert.equal(odrazeni, 0, "Odražení musí počkat mimo before event");
  return {
    event,
    nepritel,
    dokonci: () => {
      cekajici.forEach((fn) => fn());
      return odrazeni;
    },
  };
}

test("Košile zastaví i smrtící úder a odrazí útočníka", () => {
  for (const utocnik of ["minecraft:zombie", "minecraft:iron_golem", "minecraft:player"]) {
    const p = pokus({ utocnik });
    assert.equal(p.event.cancel, true);
    assert.equal(p.dokonci(), 1);
  }
});
test("Warden může udeřit a neodrazí se", () => {
  const p = pokus({ utocnik: "minecraft:warden" });
  assert.equal(p.event.cancel, false);
  assert.equal(p.dokonci(), 0);
});
test("Střely, výbuch, pád a oheň zůstávají nechráněné", () => {
  for (const pricina of ["projectile", "entityExplosion", "fall", "fire", "magic", "contact"]) {
    assert.equal(pokus({ pricina }).event.cancel, false);
  }
  assert.equal(pokus({ projektil: true }).event.cancel, false);
});
test("Bez oblečené košile ochrana neplatí; neplatí ani pro moby", () => {
  for (const kosile of ["", "minecraft:leather_chestplate"]) assert.equal(pokus({ kosile }).event.cancel, false);
  assert.equal(pokus({ cil: "minecraft:zombie" }).event.cancel, false);
  assert.equal(pokus({ utocnik: "" }).event.cancel, false);
});
test("Zmizelý útočník nezpůsobí chybu při odražení", () => {
  const p = pokus();
  p.nepritel.isValid = false;
  assert.equal(p.dokonci(), 0);
});
test("Neodhoditelná entita nezruší ochranu", () => {
  const p = pokus();
  p.nepritel.applyKnockback = () => {
    throw new Error("Nelze odhodit");
  };
  assert.doesNotThrow(p.dokonci);
  assert.equal(p.event.cancel, true);
});
