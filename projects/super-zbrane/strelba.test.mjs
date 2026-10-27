import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { URL, fileURLToPath } from "node:url";
import test from "node:test";
import { buildSync } from "esbuild";

const zdroj = fs
  .readFileSync(new URL("./behavior_pack/scripts/main.ts", import.meta.url), "utf8")
  .replace(/^import[^;]+;/, "const { BlockPermutation, system, world } = globalThis.api;");
const kod = buildSync({
  stdin: {
    contents: zdroj,
    loader: "ts",
    resolveDir: fileURLToPath(new URL("./behavior_pack/scripts/", import.meta.url)),
  },
  bundle: true,
  write: false,
  format: "cjs",
}).outputFiles[0].text;

function hra({ blok = () => "minecraft:air", paprsek = () => undefined, mobX, chybaOhne = false } = {}) {
  const behy = new Map();
  const fronta = [];
  const exploze = [];
  const castice = [];
  let pouziti;
  let komponenta;
  let dalsi = 1;
  const dim = {
    id: "overworld",
    getBlockFromRay: paprsek, // Výchozí stav nic nenajde: test záložní detekce.
    getBlock(p) {
      const typeId = blok(p);
      if (typeId === undefined) return undefined;
      return {
        typeId,
        isAir: typeId === "minecraft:air",
        isLiquid: typeId === "minecraft:water",
        location: { x: Math.floor(p.x), y: Math.floor(p.y), z: Math.floor(p.z) },
      };
    },
    getEntitiesFromRay(p, smer, { maxDistance }) {
      const distance = mobX - p.x;
      return distance >= 0 && distance <= maxDistance
        ? [{ distance, entity: { id: "mob", typeId: "minecraft:cow" } }]
        : [];
    },
    getEntities: () =>
      chybaOhne
        ? [
            {
              typeId: "minecraft:cow",
              getComponent() {
                throw Error("zaniklý tvor");
              },
            },
          ]
        : [],
    createExplosion(p) {
      exploze.push(p);
    },
    spawnParticle(id, p) {
      castice.push({ id, p });
    },
    playSound() {},
  };
  const strelec = {
    id: "player",
    isValid: true,
    dimension: dim,
    getViewDirection: () => ({ x: 1, y: 0, z: 0 }),
    getHeadLocation: () => ({ x: 0, y: 2, z: 0 }),
  };
  const system = {
    currentTick: 0,
    beforeEvents: {
      startup: {
        subscribe(fn) {
          fn({
            itemComponentRegistry: {
              registerCustomComponent(id, c) {
                komponenta = c;
              },
            },
          });
        },
      },
    },
    run(fn) {
      fronta.push(fn);
    },
    runInterval(fn) {
      const id = dalsi++;
      behy.set(id, fn);
      return id;
    },
    clearRun(id) {
      behy.delete(id);
    },
  };
  const world = {
    beforeEvents: {
      itemUse: {
        subscribe(fn) {
          pouziti = fn;
        },
      },
    },
    afterEvents: { playerLeave: { subscribe() {} } },
  };
  vm.runInNewContext(kod, {
    api: { system, world, BlockPermutation: { resolve: (id, states) => ({ id, states }) } },
    console: { warn() {} },
  });
  return {
    exploze,
    castice,
    behy,
    system,
    klik() {
      const event = { itemStack: { typeId: "factory:bambitka" }, source: strelec, cancel: false };
      pouziti(event);
      assert.equal(event.cancel, true);
    },
    fallback() {
      komponenta.onUse({ source: strelec });
    },
    tick(n = 1) {
      for (let i = 0; i < n; i++) {
        system.currentTick++;
        for (const fn of fronta.splice(0)) fn();
        for (const fn of [...behy.values()]) fn();
      }
    },
  };
}

for (const material of ["minecraft:dirt", "minecraft:oak_log"]) {
  test(`Náraz do ${material} i při prázdném raycastu`, () => {
    const h = hra({ blok: (p) => (p.x >= 3 ? material : "minecraft:air") });
    h.klik();
    h.tick(10);
    assert.equal(h.exploze.length, 1);
    assert.ok(h.exploze[0].x >= 3 && h.exploze[0].x < 3.1);
    assert.equal(h.behy.size, 0);
  });
}
test("Mob před zdí dostane přednost, mob za zdí ne", () => {
  for (const mobX of [2.5, 3.5]) {
    const h = hra({ blok: (p) => (p.x >= 3 ? "minecraft:stone" : "minecraft:air"), mobX });
    h.klik();
    h.tick(10);
    assert.equal(h.exploze.length, 1);
    assert.ok(Math.abs(h.exploze[0].x - (mobX < 3 ? mobX : 3)) < 0.1);
  }
});
test("Sto kliknutí, pauza 2 sekundy, bez levého tlačítka", () => {
  const h = hra({ blok: (p) => (p.x >= 3 ? "minecraft:dirt" : "minecraft:air") });
  for (let i = 0; i < 100; i++) {
    h.klik();
    h.tick(1);
  }
  h.tick(10);
  assert.equal(h.exploze.length, 3);
  h.tick(40);
  h.klik();
  h.tick(10);
  assert.equal(h.exploze.length, 4);
});
test("Dvě události použití nevytvoří dvě koule", () => {
  const h = hra({ mobX: 2 });
  h.fallback();
  h.fallback();
  h.klik();
  h.tick(5);
  assert.equal(h.exploze.length, 1);
});
test("Výstřel z vysoké trávy nevybuchne u hlavy, trávu před sebou zasáhne", () => {
  const h = hra({ blok: (p) => (p.x < 1 || p.x >= 3 ? "minecraft:tall_grass" : "minecraft:air") });
  h.klik();
  h.tick(10);
  assert.equal(h.exploze.length, 1);
  assert.ok(h.exploze[0].x >= 3 && h.exploze[0].x < 3.1);
});
test("Koule uvnitř bloku mimo hlavu střelce vybuchne hned", () => {
  // Blok se objeví až po prvním ticku kolem koule (např. píst), ne u hlavy.
  let tick = 0;
  const h = hra({ blok: (p) => (tick >= 2 && p.x >= 1 && p.x < 2 ? "minecraft:stone" : "minecraft:air") });
  h.klik();
  h.tick(1);
  tick = 2;
  h.tick(1);
  assert.equal(h.exploze.length, 1);
  assert.ok(Math.abs(h.exploze[0].x - 1.04) < 1e-8);
});
test("Nález paprsku mimo dosah kroku nezastaví záložní cyklus", () => {
  // Paprsek vidí až zeď na x = 5, cyklus má zachytit políčko na x = 3 (např. list, který paprsek minul).
  const h = hra({
    blok: (p) => (p.x >= 3 && p.x < 4 ? "minecraft:oak_leaves" : "minecraft:air"),
    paprsek: (misto) => ({
      block: { typeId: "minecraft:stone", isAir: false, isLiquid: false, location: { x: 5, y: 2, z: 0 } },
      faceLocation: { x: 0, y: 2 - Math.floor(misto.y) + (misto.y - Math.floor(misto.y)), z: 0 },
    }),
  });
  h.klik();
  h.tick(10);
  assert.equal(h.exploze.length, 1);
  assert.ok(h.exploze[0].x >= 3 && h.exploze[0].x < 3.1);
});
test("Nález paprsku v dosahu kroku má přednost před cyklem", () => {
  const h = hra({
    blok: (p) => (p.x >= 3 ? "minecraft:stone" : "minecraft:air"),
    paprsek: (misto) => {
      const d = 3 - misto.x;
      return d <= 2
        ? {
            block: { typeId: "minecraft:stone", isAir: false, isLiquid: false, location: { x: 3, y: 2, z: 0 } },
            faceLocation: { x: 0, y: misto.y - 2, z: misto.z },
          }
        : undefined;
    },
  });
  h.klik();
  h.tick(10);
  assert.equal(h.exploze.length, 1);
  assert.ok(Math.abs(h.exploze[0].x - 3) < 1e-8);
});
test("Tvor dál než jeden krok počká na další tick", () => {
  const h = hra({ mobX: 1.5 });
  h.klik();
  h.tick(1);
  assert.equal(h.exploze.length, 0);
  h.tick(1);
  assert.equal(h.exploze.length, 1);
  assert.ok(Math.abs(h.exploze[0].x - 1.5) < 1e-8);
});
test("Hlava mimo svět: bez výstřelu, bez cooldownu, bez běžící koule", () => {
  const h = hra({ blok: (p) => (p.x < 1 ? undefined : "minecraft:air"), mobX: 2 });
  h.klik();
  h.tick(5);
  assert.equal(h.exploze.length, 0);
  assert.equal(h.behy.size, 0);
  assert.equal(h.castice.length, 0);
  h.klik(); // Cooldown nebyl nastaven, další pokus hned projde stejnou cestou.
  h.tick(1);
  assert.equal(h.behy.size, 0);
});
test("Voda kouli uhasí", () => {
  const h = hra({ blok: (p) => (p.x >= 3 ? "minecraft:water" : "minecraft:air") });
  h.klik();
  h.tick(10);
  assert.equal(h.exploze.length, 0);
  assert.equal(h.behy.size, 0);
});
test("Chyba zapálení jednoho tvora nezastaví výbuch", () => {
  const h = hra({ mobX: 2, chybaOhne: true });
  h.klik();
  h.tick(5);
  assert.equal(h.exploze.length, 1);
});
test("Rychlost 20,8 bloku/s, jedna kompaktní částice a konec v 48 blocích", () => {
  const h = hra();
  h.klik();
  h.tick();
  const plameny = h.castice.filter((p) => p.id === "factory:ohniva_koule");
  assert.equal(plameny.length, 1);
  assert.ok(Math.abs(plameny[0].p.x - 1.04) < 1e-8);
  h.tick(60);
  const vse = h.castice.filter((p) => p.id === "factory:ohniva_koule");
  assert.ok(Math.abs(vse.at(-1).p.x - 48) < 1e-8);
  assert.equal(h.behy.size, 0);
  assert.equal(h.exploze.length, 0);
});

const portalKod = buildSync({
  entryPoints: [fileURLToPath(new URL("./behavior_pack/scripts/portal.ts", import.meta.url))],
  bundle: true,
  write: false,
  format: "cjs",
}).outputFiles[0].text;
const portalModul = { exports: {} };
vm.runInNewContext(portalKod, { module: portalModul, exports: portalModul.exports });
const { obsluzPortal } = portalModul.exports;

function okoliPortal(bloky, id = "minecraft:overworld") {
  const mapa = new Map(bloky.map(([x, y, z, typ]) => [`${x},${y},${z}`, typ]));
  const ohen = [];
  let cteni = 0;
  const dim = {
    id,
    getBlock(p) {
      cteni++;
      const location = { x: Math.floor(p.x), y: Math.floor(p.y), z: Math.floor(p.z) };
      const key = `${location.x},${location.y},${location.z}`;
      const typeId = mapa.get(key) ?? "minecraft:air";
      return {
        location,
        typeId,
        isAir: typeId === "minecraft:air",
        setType(typ) {
          ohen.push(location);
          mapa.set(key, typ);
        },
      };
    },
  };
  return { dim, ohen, cteni: () => cteni };
}

test("Běžný blok portál vůbec nehledá", () => {
  const h = okoliPortal([]);
  assert.equal(obsluzPortal(h.dim, { typeId: "minecraft:dirt" }), false);
  assert.equal(h.cteni(), 0);
});
test("Přímý zásah aktivního portálu nečte okolí ani nevybuchuje", () => {
  const h = okoliPortal([]);
  assert.equal(obsluzPortal(h.dim, { typeId: "minecraft:portal" }), true);
  assert.equal(h.cteni(), 0);
  assert.equal(h.ohen.length, 0);
});
test("Osamělý obsidián nezapálí svůj vršek", () => {
  const h = okoliPortal([[0, 0, 0, "minecraft:obsidian"]]);
  assert.equal(obsluzPortal(h.dim, h.dim.getBlock({ x: 0, y: 0, z: 0 })), true);
  assert.equal(h.ohen.length, 0);
});

function ramPortal(osa = "x", sirka = 2, vyska = 3, aktivni = false) {
  const blocks = [];
  const bod = (u, y) => (osa === "x" ? [u, y, 0] : [0, y, u]);
  for (let u = 0; u < sirka + 2; u++) for (const y of [0, vyska + 1]) blocks.push([...bod(u, y), "minecraft:obsidian"]);
  for (let y = 1; y <= vyska; y++) for (const u of [0, sirka + 1]) blocks.push([...bod(u, y), "minecraft:obsidian"]);
  if (aktivni)
    for (let u = 1; u <= sirka; u++) for (let y = 1; y <= vyska; y++) blocks.push([...bod(u, y), "minecraft:portal"]);
  return { h: okoliPortal(blocks), bod };
}
for (const osa of ["x", "z"]) {
  test(`Každý blok rámu v ose ${osa} zapálí pouze patu otvoru`, () => {
    for (const [sirka, vyska] of [
      [2, 3],
      [21, 21],
    ]) {
      const { bod } = ramPortal(osa, sirka, vyska);
      const zasahy = [];
      for (let u = 0; u < sirka + 2; u++) for (const y of [0, vyska + 1]) zasahy.push(bod(u, y));
      for (let y = 1; y <= vyska; y++) for (const u of [0, sirka + 1]) zasahy.push(bod(u, y));
      for (const [x, y, z] of zasahy) {
        const { h } = ramPortal(osa, sirka, vyska);
        obsluzPortal(h.dim, h.dim.getBlock({ x, y, z }));
        assert.equal(h.ohen.length, 1, `zásah ${x},${y},${z}`);
        assert.equal(h.ohen[0].y, 1);
        const u = osa === "x" ? h.ohen[0].x : h.ohen[0].z;
        assert.ok(u >= 1 && u <= sirka);
      }
    }
  });
  test(`Aktivní rám v ose ${osa} nevytvoří další oheň`, () => {
    for (const [x, y, z] of [
      [0, 2, 0],
      [1, 4, 0],
      [1, 0, 0],
    ]) {
      const { h } = ramPortal(osa, 2, 3, true);
      const hit = osa === "x" ? { x, y, z } : { x: z, y, z: x };
      obsluzPortal(h.dim, h.dim.getBlock(hit));
      assert.equal(h.ohen.length, 0);
    }
  });
}

test("Obsidián s aktivním portálem jej nikdy nepřepíše", () => {
  const h = okoliPortal([
    [0, 0, 0, "minecraft:obsidian"],
    [0, 1, 0, "minecraft:portal"],
  ]);
  obsluzPortal(h.dim, h.dim.getBlock({ x: 0, y: 0, z: 0 }));
  assert.equal(h.ohen.length, 0);
});
test("V Endu zásah obsidiánu nezapaluje a nevybuchuje", () => {
  const h = okoliPortal([], "minecraft:the_end");
  assert.equal(obsluzPortal(h.dim, { typeId: "minecraft:obsidian", location: { x: 0, y: 0, z: 0 } }), true);
  assert.equal(h.cteni(), 0);
  assert.equal(h.ohen.length, 0);
});
