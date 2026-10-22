import {
  BlockPermutation,
  Direction,
  EquipmentSlot,
  GameMode,
  Player,
  system,
  type ItemComponentUseOnEvent,
} from "@minecraft/server";

// Pouze běžná použití nové sekery, lopaty a motyky. Meč a krumpáč se nemění.
const dreva = ["oak", "spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry", "pale_oak"];
const odkornit = new Map<string, string>();
for (const drevo of dreva) {
  for (const tvar of ["log", "wood"]) {
    odkornit.set(`minecraft:${drevo}_${tvar}`, `minecraft:stripped_${drevo}_${tvar}`);
  }
}
for (const drevo of ["crimson", "warped"]) {
  for (const tvar of ["stem", "hyphae"]) {
    odkornit.set(`minecraft:${drevo}_${tvar}`, `minecraft:stripped_${drevo}_${tvar}`);
  }
}
odkornit.set("minecraft:bamboo_block", "minecraft:stripped_bamboo_block");

function pouzit(event: ItemComponentUseOnEvent) {
  const { source, block, itemStack, blockFace } = event;
  if (!(source instanceof Player)) return;
  const rezim = source.getGameMode();
  if (rezim !== GameMode.Survival && rezim !== GameMode.Creative) return;
  const vybaveni = source.getComponent("minecraft:equippable");
  const predmet = vybaveni?.getEquipment(EquipmentSlot.Mainhand);
  if (!predmet || predmet.typeId !== itemStack.typeId) return;

  let cil: BlockPermutation | undefined;
  let zvuk = "use.gravel";
  if (predmet.typeId === "factory:smaragdova_sekera") {
    const typ = odkornit.get(block.typeId);
    if (!typ) return;
    const osa = block.permutation.getState("pillar_axis");
    cil = BlockPermutation.resolve(typ, osa === undefined ? {} : { pillar_axis: osa });
    zvuk = "step.wood";
  } else {
    if (blockFace === Direction.Down || !block.above()?.isAir) return;
    if (predmet.typeId === "factory:smaragdova_motyka") {
      if (
        ["minecraft:dirt", "minecraft:grass_block", "minecraft:grass", "minecraft:grass_path"].includes(block.typeId)
      ) {
        cil = BlockPermutation.resolve("minecraft:farmland");
      } else if (block.typeId === "minecraft:coarse_dirt") {
        cil = BlockPermutation.resolve("minecraft:dirt");
      }
    } else if (predmet.typeId === "factory:smaragdova_lopata") {
      if (
        [
          "minecraft:dirt",
          "minecraft:grass_block",
          "minecraft:grass",
          "minecraft:coarse_dirt",
          "minecraft:podzol",
          "minecraft:mycelium",
          "minecraft:rooted_dirt",
        ].includes(block.typeId)
      ) {
        cil = BlockPermutation.resolve("minecraft:grass_path");
      }
    }
  }
  if (!cil) return;
  block.setPermutation(cil);
  source.dimension.playSound(zvuk, block.location);

  // Tohle použití není zásah ani těžení, proto výdrž ubíráme zde.
  // Běžné těžení a boj nadále obstarávají herní komponenty.
  if (rezim === GameMode.Creative) return;
  const vydrz = predmet.getComponent("minecraft:durability");
  if (!vydrz) return;
  const nerozbitnost = predmet.getComponent("minecraft:enchantable")?.getEnchantment("unbreaking")?.level ?? 0;
  if (Math.random() * 100 >= vydrz.getDamageChance(nerozbitnost)) return;
  if (vydrz.damage + 1 >= vydrz.maxDurability) {
    vybaveni?.setEquipment(EquipmentSlot.Mainhand, undefined);
    source.dimension.playSound("random.break", source.location);
  } else {
    vydrz.damage += 1;
    vybaveni?.setEquipment(EquipmentSlot.Mainhand, predmet);
  }
}

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("factory:smaragdove_pouziti", { onUseOn: pouzit });
});
