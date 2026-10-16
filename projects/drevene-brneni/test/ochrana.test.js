import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { URL } from "node:url";
import { transformSync } from "esbuild";

const zdroj = readFileSync(new URL("../behavior_pack/scripts/main.ts", import.meta.url), "utf8");
const kod = transformSync(zdroj.replace(/^import .*?;\s*/gm, ""), { loader: "ts" }).code;

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
    zaznamenejSip: () => {},
    EntityComponentTypes: { Equippable: "equippable" },
    EntityDamageCause: {
      entityAttack: "entityAttack",
      projectile: "projectile",
      entityExplosion: "entityExplosion",
      blockExplosion: "blockExplosion",
      fireworks: "fireworks",
    },
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
      damagingProjectile: projektil
        ? { typeId: typeof projektil === "string" ? projektil : "minecraft:arrow" }
        : undefined,
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
test("Jiné příčiny zůstávají nechráněné", () => {
  for (const pricina of ["projectile", "fall", "fire", "fireTick", "lava", "magic", "wither", "contact"]) {
    assert.equal(pokus({ pricina }).event.cancel, false);
  }
  assert.equal(pokus({ projektil: true }).event.cancel, false);
});
test("Šíp kostlivce, hráče i dávkovače zastaví bez odražení střelce", () => {
  for (const utocnik of ["minecraft:skeleton", "minecraft:player", ""]) {
    const p = pokus({ utocnik, pricina: "projectile", projektil: true });
    assert.equal(p.event.cancel, true);
    assert.equal(p.dokonci(), 0);
  }
});
test("Creeper způsobí polovinu původního zásahu, bez náhradního zranění", () => {
  const p = pokus({ utocnik: "minecraft:creeper", pricina: "entityExplosion" });
  assert.equal(p.event.cancel, false);
  assert.equal(p.event.damage, 500);
  assert.equal(p.dokonci(), 0);
});
test("Výbuchy TNT i ghasta mají stejnou ochranu, jiné střely nikoli", () => {
  for (const utocnik of ["minecraft:tnt", "minecraft:ghast", ""]) {
    const p = pokus({ utocnik, pricina: "entityExplosion" });
    assert.equal(p.event.damage, 500);
    assert.equal(p.event.cancel, false);
  }
  assert.equal(pokus({ pricina: "projectile", projektil: "minecraft:snowball" }).event.cancel, false);
});
test("Nové ochrany vyžadují kyrys a platí pouze pro hráče", () => {
  for (const volby of [{ kosile: "" }, { kosile: "minecraft:leather_chestplate" }, { cil: "minecraft:zombie" }]) {
    const sip = pokus({ ...volby, pricina: "projectile", projektil: true });
    assert.equal(sip.event.cancel, false);
    const vybuch = pokus({ ...volby, utocnik: "minecraft:creeper", pricina: "entityExplosion" });
    assert.equal(vybuch.event.damage, 1000);
  }
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

test("Blokové exploze a ohňostroje způsobí polovinu zranění", () => {
  for (const pricina of ["blockExplosion", "fireworks"]) {
    const p = pokus({ pricina, utocnik: "" });
    assert.equal(p.event.damage, 500);
    assert.equal(p.event.cancel, false);
  }
});
test("Trojzubec a přímý zásah ghastovou koulí jsou zastavené", () => {
  for (const projektil of ["minecraft:thrown_trident", "minecraft:fireball"]) {
    const p = pokus({ pricina: "projectile", projektil });
    assert.equal(p.event.cancel, true);
    assert.equal(p.dokonci(), 0);
  }
});
