import { Block, BlockPermutation, ItemStack, ItemTypes, system, world } from "@minecraft/server";
const ID = "factory:lucky_block";
const PHASE = "factory:phase";
const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
function activate(block: Block) {
  if (block.typeId === ID && block.permutation.getAllStates()[PHASE] === 0)
    block.setPermutation(BlockPermutation.resolve(ID, { [PHASE]: 1 }));
}
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("factory:lucky_timer", {
    onTick({ block, dimension }) {
      const phase = block.permutation.getAllStates()[PHASE] as number;
      if (phase === 0) return;
      if (phase < 13) {
        block.setPermutation(BlockPermutation.resolve(ID, { [PHASE]: phase + 1 }));
        return;
      }
      const center = block.center();
      // Pouze zmizení krabičky a kosmetický efekt, žádná skutečná exploze.
      block.setType("minecraft:air");
      // Hra dodá úplný seznam, včetně předmětů z aktivních doplňků.
      const pool = ItemTypes.getAll().filter((type) => type.id !== "minecraft:air");
      const count = randomInt(3, 7);
      let emitted = 0;
      while (emitted < count && pool.length > 0) {
        const type = pool.splice(randomInt(0, pool.length - 1), 1)[0];
        try {
          const stack = new ItemStack(type, 1);
          stack.amount = randomInt(1, Math.min(16, stack.maxAmount));
          const item = dimension.spawnItem(stack, {
            x: center.x,
            y: center.y + 0.6,
            z: center.z,
          });
          const angle = (emitted * Math.PI * 2) / count;
          emitted++;
          item.applyImpulse({ x: Math.cos(angle) * 0.15, y: 0.3, z: Math.sin(angle) * 0.15 });
        } catch (error) {
          // Neplatný nebo nevytvořitelný předmět nesmí zastavit ostatní odměny.
          console.warn(`Lucky block: předmět ${type.id}: ${error}`);
        }
      }
      try {
        dimension.spawnParticle("minecraft:large_explosion", center);
        dimension.playSound("random.explode", center, { volume: 0.6, pitch: 1.3 });
      } catch (error) {
        console.warn(`Lucky block: efekt se nepodařil: ${error}`);
      }
    },
  });
});
world.afterEvents.entityHitBlock.subscribe(({ hitBlock, damagingEntity }) => {
  if (damagingEntity.typeId === "minecraft:player") activate(hitBlock);
});
world.beforeEvents.playerBreakBlock.subscribe((event) => {
  if (event.block.typeId !== ID) return;
  event.cancel = true;
  const { dimension, location } = event.block;
  // Změnu světa odložíme až za událost před rozbitím bloku.
  system.run(() => {
    const block = dimension.getBlock(location);
    if (block) activate(block);
  });
});
