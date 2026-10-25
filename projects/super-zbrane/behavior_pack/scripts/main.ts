import { BlockPermutation, system, world, type Dimension, type Entity, type Vector3 } from "@minecraft/server";

import { najdiPortal } from "./portal";

const RYCHLOST = 1.04;
const MAX_DOLET = 48;
const DOLET = Math.ceil(MAX_DOLET / RYCHLOST);
const SILA = 1.5;
const nabito = new Map<string, number>();

function posun(p: Vector3, smer: Vector3, vzdalenost: number): Vector3 {
  return { x: p.x + smer.x * vzdalenost, y: p.y + smer.y * vzdalenost, z: p.z + smer.z * vzdalenost };
}

function vybuch(dim: Dimension, misto: Vector3, strelec: Entity) {
  const portal = najdiPortal(dim, misto);
  if (portal) {
    const vypln = BlockPermutation.resolve("minecraft:portal", { portal_axis: portal.osa });
    for (const bod of portal.body) dim.getBlock(bod)?.setPermutation(vypln);
    dim.playSound("fire.ignite", misto);
    return; // Zapálení rámu bez výbuchu, aby právě vzniklý portál nezhasl.
  }
  // Zapálit před výbuchem: běžná kořist hořících zvířat pak může být upečená.
  for (const tvor of dim.getEntities({ location: misto, maxDistance: SILA * 2 })) {
    try {
      if (tvor.typeId !== "minecraft:item" && tvor.getComponent("minecraft:health")) tvor.setOnFire(5, true);
    } catch (chyba) {
      // Jeden zaniklý nebo nepodporovaný tvor nesmí zastavit celý výbuch.
      console.warn(`[Super zbraně] Zapálení tvora selhalo: ${chyba}`);
    }
  }
  dim.createExplosion(misto, SILA, { breaksBlocks: true, causesFire: true, source: strelec });
}

function vystrel(strelec: Entity) {
  if (system.currentTick < (nabito.get(strelec.id) ?? 0)) return;
  nabito.set(strelec.id, system.currentTick + 40);
  const dim = strelec.dimension;
  const smer = strelec.getViewDirection();
  // U očí: nepřeskočit zeď těsně před hlavní.
  let misto = strelec.getHeadLocation();
  let vek = 0;
  dim.playSound("firework.launch", misto, { pitch: 0.6, volume: 0.8 });
  dim.spawnParticle("minecraft:basic_smoke_particle", posun(misto, smer, 0.5));
  const beh = system.runInterval(() => {
    try {
      if (!strelec.isValid || strelec.dimension.id !== dim.id || ++vek > DOLET) {
        system.clearRun(beh);
        return;
      }
      const krok = Math.min(RYCHLOST, MAX_DOLET - (vek - 1) * RYCHLOST);
      // Delší paprsek: krátké maxDistance pod jeden blok může hra vyhodnotit nepřesně.
      const kandidat = dim.getBlockFromRay(misto, smer, { maxDistance: 2, includeLiquidBlocks: true });
      let blok: { block: import("@minecraft/server").Block } | undefined = kandidat;
      let bodBloku = kandidat
        ? {
            x: kandidat.block.location.x + kandidat.faceLocation.x,
            y: kandidat.block.location.y + kandidat.faceLocation.y,
            z: kandidat.block.location.z + kandidat.faceLocation.z,
          }
        : undefined;
      let vzdalenostBloku = bodBloku
        ? Math.hypot(bodBloku.x - misto.x, bodBloku.y - misto.y, bodBloku.z - misto.z)
        : Infinity;
      if (vzdalenostBloku > krok + 0.001) {
        blok = undefined;
        bodBloku = undefined;
        vzdalenostBloku = Infinity;
      }
      // Záchytná kontrola po 0,05 bloku: zachytí i kouli již uvnitř bloku.
      for (let d = 0; d <= krok + 0.001 && d < vzdalenostBloku; d += 0.05) {
        const bod = posun(misto, smer, d);
        const kontrola = dim.getBlock(bod);
        if (kontrola && !kontrola.isAir) {
          blok = { block: kontrola };
          bodBloku = bod;
          vzdalenostBloku = d;
          break;
        }
      }
      const tvor = dim
        .getEntitiesFromRay(misto, smer, { maxDistance: krok })
        .filter((zasah) => zasah.entity.id !== strelec.id && zasah.entity.typeId !== "minecraft:item")
        .sort((a, b) => a.distance - b.distance)[0];
      if (tvor && tvor.distance < vzdalenostBloku) {
        system.clearRun(beh);
        vybuch(dim, posun(misto, smer, tvor.distance), strelec);
        return;
      }
      if (blok && bodBloku) {
        system.clearRun(beh);
        if (!blok.block.isLiquid) vybuch(dim, bodBloku, strelec);
        return;
      }
      misto = posun(misto, smer, krok);
      dim.spawnParticle("factory:ohniva_koule", misto);
    } catch (chyba) {
      system.clearRun(beh);
      console.warn(`[Super zbraně] Koule se zastavila: ${chyba}`);
    }
  }, 1);
}

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("factory:strelba", {
    onUse({ source }) {
      vystrel(source);
    },
    onUseOn({ source }) {
      vystrel(source);
    },
  });
});
world.afterEvents.playerLeave.subscribe(({ playerId }) => nabito.delete(playerId));

// Zrušit standardní použití: nezůstane rozpracované použití/cooldown na klientovi.
// Střelbu provést v dalším ticku, kdy už lze měnit svět.
world.beforeEvents.itemUse.subscribe((udalost) => {
  if (udalost.itemStack.typeId !== "factory:bambitka") return;
  udalost.cancel = true;
  const strelec = udalost.source;
  system.run(() => {
    if (strelec.isValid) vystrel(strelec);
  });
});
