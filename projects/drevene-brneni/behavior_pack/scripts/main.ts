import { EntityComponentTypes, EntityDamageCause, EquipmentSlot, system, world } from "@minecraft/server";
import { zaznamenejSip } from "./sipy";

world.beforeEvents.entityHurt.subscribe((event) => {
  const { hurtEntity: hrac, damageSource: zdroj } = event;
  const utocnik = zdroj.damagingEntity;
  if (hrac.typeId !== "minecraft:player") return;
  const vybaveni = hrac.getComponent(EntityComponentTypes.Equippable);
  if (vybaveni?.getEquipment(EquipmentSlot.Chest)?.typeId !== "factory:drevena_kosile") return;

  // Měníme původní zásah, nevytváříme náhradní zranění po explozi.
  if (
    [EntityDamageCause.entityExplosion, EntityDamageCause.blockExplosion, EntityDamageCause.fireworks].includes(
      zdroj.cause,
    )
  ) {
    event.damage *= 0.5;
    return;
  }

  if (zdroj.cause === EntityDamageCause.projectile) {
    const strela = zdroj.damagingProjectile;
    if (!strela || !["minecraft:arrow", "minecraft:thrown_trident", "minecraft:fireball"].includes(strela.typeId))
      return;
    event.cancel = true;
    // Neodstraňujeme skutečný projektil: jeho jed, výbuch či návrat trojzubce řídí hra.
    if (strela.typeId === "minecraft:arrow") zaznamenejSip(hrac, strela);
    return;
  }

  if (
    zdroj.cause !== EntityDamageCause.entityAttack ||
    zdroj.damagingProjectile ||
    !utocnik ||
    utocnik.typeId === "minecraft:warden"
  )
    return;
  event.cancel = true;
  system.run(() => {
    if (!hrac.isValid || !utocnik.isValid || hrac.dimension.id !== utocnik.dimension.id) return;
    const dx = utocnik.location.x - hrac.location.x;
    const dz = utocnik.location.z - hrac.location.z;
    const delka = Math.hypot(dx, dz);
    const smer = delka > 0.001 ? { x: dx / delka, z: dz / delka } : hrac.getViewDirection();
    try {
      utocnik.applyKnockback({ x: smer.x * 1.2, z: smer.z * 1.2 }, 0.35);
    } catch {
      // Některé entity odhodit nelze; ochrana před úderem přesto platí.
    }
  });
});
