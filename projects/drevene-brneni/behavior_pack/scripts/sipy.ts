import { Entity, EntityComponentTypes, EquipmentSlot, system, world } from "@minecraft/server";

const DEKORACE = "factory:zabodnuty_sip";
const DOBA = 20 * 20; // Každý šíp zmizí po 20 sekundách, nezávisle na dalších zásazích.
const MAXIMUM = 5;
type Sip = { entita: Entity; do: number; uhel: number; vyska: number; strana: number };
const zasahy = new Map<string, { hrac: Entity; sipy: Sip[]; dalsi: number }>();

function maKyrys(hrac: Entity) {
  return (
    hrac.isValid &&
    hrac.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Chest)?.typeId ===
      "factory:drevena_kosile"
  );
}
function odstran(sip: Sip) {
  if (sip.entita.isValid) sip.entita.remove();
}
function uklid(id: string) {
  const stav = zasahy.get(id);
  if (stav) stav.sipy.forEach(odstran);
  zasahy.delete(id);
}

// Vizuální šíp je samostatná nekolizní, neútočící a neukládaná dekorace.
// Nemění definici hráče ani vlastnosti skutečného šípu.
export function zaznamenejSip(hrac: Entity, strela: Entity) {
  const otoceni = hrac.getRotation().y;
  const pohyb = strela.getVelocity();
  const uhel = Math.hypot(pohyb.x, pohyb.z) > 0.001 ? (Math.atan2(-pohyb.x, pohyb.z) * 180) / Math.PI : otoceni + 180;
  const dimenze = hrac.dimension.id;
  system.run(() => {
    if (!maKyrys(hrac) || hrac.dimension.id !== dimenze) return;
    const stav = zasahy.get(hrac.id) ?? { hrac, sipy: [], dalsi: 0 };
    stav.sipy = stav.sipy.filter((sip) => {
      if (!sip.entita.isValid || sip.do <= system.currentTick) {
        odstran(sip);
        return false;
      }
      return true;
    });
    if (stav.sipy.length >= MAXIMUM) odstran(stav.sipy.shift()!);
    const index = stav.dalsi++ % MAXIMUM;
    try {
      const entita = hrac.dimension.spawnEntity(DEKORACE, hrac.location);
      const sip = {
        entita,
        do: system.currentTick + DOBA,
        uhel: uhel - otoceni,
        vyska: [1.25, 1.05, 1.4, 1.15, 0.95][index],
        strana: [-0.12, 0.12, 0, -0.07, 0.07][index],
      };
      stav.sipy.push(sip);
      zasahy.set(hrac.id, stav);
      posun(hrac, sip);
    } catch (chyba) {
      console.warn(`Dřevěné brnění: nelze zobrazit šíp: ${chyba}`);
    }
  });
}

function posun(hrac: Entity, sip: Sip) {
  const yaw = hrac.getRotation().y + sip.uhel;
  const rad = (yaw * Math.PI) / 180;
  const { x, y, z } = hrac.location;
  // Hrot míří do hrudi; zbytek šípu vyčnívá proti směru zásahu.
  sip.entita.teleport(
    {
      x: x + Math.sin(rad) * 0.48 + Math.cos(rad) * sip.strana,
      y: y + sip.vyska - (hrac.isSneaking ? 0.25 : 0),
      z: z - Math.cos(rad) * 0.48 + Math.sin(rad) * sip.strana,
    },
    { dimension: hrac.dimension, rotation: { x: 0, y: yaw }, checkForBlocks: false },
  );
}

system.runInterval(() => {
  for (const [id, stav] of zasahy) {
    if (!maKyrys(stav.hrac)) {
      uklid(id);
      continue;
    }
    stav.sipy = stav.sipy.filter((sip) => {
      if (!sip.entita.isValid || sip.do <= system.currentTick || sip.entita.dimension.id !== stav.hrac.dimension.id) {
        odstran(sip);
        return false;
      }
      try {
        posun(stav.hrac, sip);
        return true;
      } catch {
        odstran(sip);
        return false;
      }
    });
    if (!stav.sipy.length) zasahy.delete(id);
  }
}, 1);
world.afterEvents.playerLeave.subscribe(({ playerId }) => uklid(playerId));
world.afterEvents.entityDie.subscribe(({ deadEntity }) => uklid(deadEntity.id));
