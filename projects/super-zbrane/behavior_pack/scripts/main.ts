import { system, world, type Block, type Dimension, type Entity, type Vector3 } from "@minecraft/server";

import { obsluzPortal } from "./portal";

const RYCHLOST = 1.04;
const MAX_DOLET = 48;
const DOLET = Math.ceil(MAX_DOLET / RYCHLOST);
const SILA = 1.5;
// Paprsky míří dál než jeden krok a výsledek se ořízne: krátký paprsek pod jeden blok
// může hra vyhodnotit nepřesně. Platí stejně pro bloky i tvory.
const DOSAH_PAPRSKU = 2;
const JEMNOST = 0.05;
const nabito = new Map<string, number>();

type Zasah = { bod: Vector3; vzdalenost: number };

function posun(p: Vector3, smer: Vector3, vzdalenost: number): Vector3 {
  return { x: p.x + smer.x * vzdalenost, y: p.y + smer.y * vzdalenost, z: p.z + smer.z * vzdalenost };
}

function vzdalenost(a: Vector3, b: Vector3): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

// Políčko, ve kterém má střelec hlavu. Mimo meze světa hra vrací nic nebo vyhazuje výjimku.
function polickoHlavy(dim: Dimension, misto: Vector3): Vector3 | undefined {
  try {
    const blok = dim.getBlock(misto);
    if (blok) return blok.location;
    console.warn("[Super zbraně] Hlava střelce je mimo načtený svět, výstřel se neprovede.");
  } catch (chyba) {
    console.warn(`[Super zbraně] Políčko hlavy střelce nelze určit: ${chyba}`);
  }
  return undefined;
}

// Nejbližší blok do délky kroku, nebo nic. Paprsek respektuje tvar bloků a ignoruje
// průchodné (tráva, květiny). Nález mimo dosah kroku se zahodí a dál rozhoduje záchytný cyklus.
function najdiBlok(
  dim: Dimension,
  misto: Vector3,
  smer: Vector3,
  krok: number,
  hlava: Vector3,
): (Zasah & { blok: Block }) | undefined {
  const paprsek = dim.getBlockFromRay(misto, smer, { maxDistance: DOSAH_PAPRSKU, includeLiquidBlocks: true });
  if (paprsek) {
    const { location: l } = paprsek.block;
    const bod = { x: l.x + paprsek.faceLocation.x, y: l.y + paprsek.faceLocation.y, z: l.z + paprsek.faceLocation.z };
    const d = vzdalenost(bod, misto);
    if (d <= krok + 0.001) return { bod, vzdalenost: d, blok: paprsek.block };
  }
  // Záchytná kontrola po 0,05 bloku: zachytí i bloky, které paprsek minul, nebo kouli už
  // uvnitř bloku. Políčko hlavy střelce se vynechá, aby výstřel z trávy, lián či řasy
  // nevybuchl u jeho obličeje.
  for (let d = 0; d <= krok + 0.001; d += JEMNOST) {
    const bod = posun(misto, smer, d);
    const kontrola = dim.getBlock(bod);
    if (!kontrola || kontrola.isAir) continue;
    if (vzdalenost(kontrola.location, hlava) === 0) continue;
    return { bod, vzdalenost: d, blok: kontrola };
  }
  return undefined;
}

// Nejbližší tvor do délky kroku, kromě střelce a ležících předmětů, nebo nic.
function najdiTvora(dim: Dimension, misto: Vector3, smer: Vector3, krok: number, strelec: Entity): Zasah | undefined {
  const zasah = dim
    .getEntitiesFromRay(misto, smer, { maxDistance: DOSAH_PAPRSKU })
    .filter((z) => z.distance <= krok + 0.001)
    .filter((z) => z.entity.id !== strelec.id && z.entity.typeId !== "minecraft:item")
    .sort((a, b) => a.distance - b.distance)[0];
  return zasah && { bod: posun(misto, smer, zasah.distance), vzdalenost: zasah.distance };
}

function vybuch(dim: Dimension, misto: Vector3, strelec: Entity) {
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

  const dim = strelec.dimension;
  const smer = strelec.getViewDirection();

  let misto = strelec.getHeadLocation();

  // U očí: nepřeskočit zeď těsně před hlavní.
  const hlava = polickoHlavy(dim, misto);
  if (!hlava) return;

  nabito.set(strelec.id, system.currentTick + 40);
  let vek = 0;
  dim.playSound("firework.launch", misto, { pitch: 0.6, volume: 0.8 });
  dim.spawnParticle("minecraft:basic_smoke_particle", posun(misto, smer, 0.5));
  const beh = system.runInterval(() => {
    try {
      vek++;
      if (!strelec.isValid || strelec.dimension.id !== dim.id || vek > DOLET) {
        system.clearRun(beh);
        return;
      }
      // Poslední krok je kratší, aby dolet skončil přesně na MAX_DOLET.
      const krok = Math.min(RYCHLOST, MAX_DOLET - (vek - 1) * RYCHLOST);
      const blok = najdiBlok(dim, misto, smer, krok, hlava);
      const tvor = najdiTvora(dim, misto, smer, krok, strelec);
      if (tvor && tvor.vzdalenost < (blok?.vzdalenost ?? Infinity)) {
        system.clearRun(beh);
        vybuch(dim, tvor.bod, strelec);
        return;
      }
      if (blok) {
        system.clearRun(beh);
        if (!blok.blok.isLiquid && !obsluzPortal(dim, blok.blok)) vybuch(dim, blok.bod, strelec); // Voda kouli uhasí a portal je specifický
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
