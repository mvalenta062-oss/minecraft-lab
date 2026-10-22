import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { URL } from "node:url";
import vm from "node:vm";
import { transformSync } from "esbuild";

const zdroj = readFileSync(new URL("../behavior_pack/scripts/main.ts", import.meta.url), "utf8");
const kod = transformSync(zdroj.replace(/^import\s*\{[\s\S]*?\}\s*from\s*"@minecraft\/server";\s*/, ""), {
  loader: "ts",
}).code;

function pokus({
  nastroj = "motyka",
  blok = "dirt",
  vzduch = true,
  strana = "Up",
  rezim = "Survival",
  damage = 0,
  chance = 100,
  osa = "x",
} = {}) {
  let callback;
  let zmena;
  let ulozeno = false;
  let vybaveni;
  const vydrz = { damage, maxDurability: 1405, getDamageChance: () => chance };
  const predmet = {
    typeId: `factory:smaragdova_${nastroj}`,
    getComponent: (id) => (id === "minecraft:durability" ? vydrz : undefined),
  };
  class Player {
    dimension = { playSound() {} };
    location = {};
    getGameMode() {
      return rezim;
    }
    getComponent() {
      return {
        getEquipment: () => predmet,
        setEquipment: (_slot, item) => {
          ulozeno = true;
          vybaveni = item;
        },
      };
    }
  }
  vm.runInNewContext(kod, {
    Player,
    Direction: { Down: "Down" },
    EquipmentSlot: { Mainhand: "mainhand" },
    GameMode: { Survival: "Survival", Creative: "Creative" },
    BlockPermutation: { resolve: (id, states) => ({ id, states }) },
    system: {
      beforeEvents: {
        startup: {
          subscribe: (fn) =>
            fn({
              itemComponentRegistry: {
                registerCustomComponent: (_name, component) => {
                  callback = component.onUseOn;
                },
              },
            }),
        },
      },
    },
  });
  callback({
    source: new Player(),
    block: {
      typeId: `minecraft:${blok}`,
      location: {},
      above: () => ({ isAir: vzduch }),
      permutation: { getState: () => osa },
      setPermutation: (p) => {
        zmena = p;
      },
    },
    itemStack: predmet,
    blockFace: strana,
  });
  return { zmena, vydrz, ulozeno, vybaveni };
}

test("motyka obdělá půdu a spotřebuje bod výdrže", () => {
  const p = pokus();
  assert.equal(p.zmena.id, "minecraft:farmland");
  assert.equal(p.vydrz.damage, 1);
});
test("blok nad půdou, spodní strana a dobrodružný režim zabrání změně", () => {
  for (const volby of [{ vzduch: false }, { strana: "Down" }, { rezim: "Adventure" }]) {
    const p = pokus(volby);
    assert.equal(p.zmena, undefined);
    assert.equal(p.vydrz.damage, 0);
  }
});
test("lopata tvoří cestu, ale nemění kámen", () => {
  assert.equal(pokus({ nastroj: "lopata" }).zmena.id, "minecraft:grass_path");
  assert.equal(pokus({ nastroj: "lopata", blok: "stone" }).zmena, undefined);
});
test("sekera zachová osu odkorňovaného dřeva a ignoruje hotové prkno", () => {
  for (const osa of ["x", "y", "z"]) {
    const p = pokus({ nastroj: "sekera", blok: "oak_log", osa });
    assert.equal(p.zmena.id, "minecraft:stripped_oak_log");
    assert.equal(p.zmena.states.pillar_axis, osa);
  }
  assert.equal(pokus({ nastroj: "sekera", blok: "oak_planks" }).zmena, undefined);
});
test("kreativní režim a nulová šance opotřebení nespotřebují výdrž", () => {
  for (const volby of [{ rezim: "Creative" }, { chance: 0 }]) {
    const p = pokus(volby);
    assert.ok(p.zmena);
    assert.equal(p.vydrz.damage, 0);
    assert.equal(p.ulozeno, false);
  }
});
test("poslední použití rozbije nástroj", () => {
  const p = pokus({ damage: 1404 });
  assert.ok(p.zmena);
  assert.equal(p.ulozeno, true);
  assert.equal(p.vybaveni, undefined);
});
