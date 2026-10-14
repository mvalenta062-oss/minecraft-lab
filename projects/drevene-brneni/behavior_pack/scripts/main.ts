import { EntityComponentTypes, EntityDamageCause, EquipmentSlot, system, world } from "@minecraft/server";

world.beforeEvents.entityHurt.subscribe((event) => {
  const { hurtEntity: hrac, damageSource: zdroj } = event;
  const utocnik = zdroj.damagingEntity;
  if (
    hrac.typeId !== "minecraft:player" ||
    zdroj.cause !== EntityDamageCause.entityAttack ||
    zdroj.damagingProjectile ||
    !utocnik ||
    utocnik.typeId === "minecraft:warden"
  )
    return;

  const vybaveni = hrac.getComponent(EntityComponentTypes.Equippable);
  if (vybaveni?.getEquipment(EquipmentSlot.Chest)?.typeId !== "factory:drevena_kosile") return;

  // Zranění rušíme před odečtením srdíček; odhození musí počkat na další herní krok.
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
