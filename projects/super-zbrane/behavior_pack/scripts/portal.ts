import type { Block, Dimension, Vector3 } from "@minecraft/server";

// Ověření úplnosti rámu a vytvoření portálu patří Minecraftu, ne našemu skriptu.
// true = střela skončila na obsidiánu/portálu, bez výbuchu.
export function obsluzPortal(dim: Dimension, blok: Block): boolean {
  if (blok.typeId === "minecraft:portal") return true;
  if (blok.typeId !== "minecraft:obsidian") return false;
  if (dim.id === "minecraft:the_end" || dim.id === "the_end") return true;

  const p = blok.location;
  const volno = (bod: Vector3) => {
    const typ = dim.getBlock(bod)?.typeId;
    return typ === "minecraft:air" || typ === "minecraft:fire" || typ === "minecraft:portal";
  };
  // Jen sloupce u zásahu. Potřebujeme mezeru mezi obsidiánovým dnem a stropem,
  // ne celý rám: jeho platnost při zapálení posoudí hra. Oheň na střeše se vynechá.
  for (const [dx, dz] of [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]) {
    for (const dy of [0, -1, 1]) {
      const seed = { x: p.x + dx, y: p.y + dy, z: p.z + dz };
      if (!volno(seed)) continue;
      let dole = seed.y,
        nahore = seed.y;
      for (let i = 0; i < 20 && volno({ ...seed, y: dole - 1 }); i++) dole--;
      if (dim.getBlock({ ...seed, y: dole - 1 })?.typeId !== "minecraft:obsidian") continue;
      for (let i = 0; i < 20 && volno({ ...seed, y: nahore + 1 }); i++) nahore++;
      if (nahore - dole + 1 < 3 || nahore - dole + 1 > 21) continue;
      if (dim.getBlock({ ...seed, y: nahore + 1 })?.typeId !== "minecraft:obsidian") continue;
      const pata = dim.getBlock({ ...seed, y: dole });
      if (pata?.isAir) pata.setType("minecraft:fire");
      return true;
    }
  }
  return true;
}
