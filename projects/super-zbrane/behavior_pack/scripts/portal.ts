import type { Dimension, Vector3 } from "@minecraft/server";

// Vrací pouze prázdný vnitřek úplného obsidiánového rámu. Rohy nejsou povinné.
export function najdiPortal(dim: Dimension, zasah: Vector3): { body: Vector3[]; osa: "x" | "z" } | undefined {
  if (dim.id === "minecraft:the_end" || dim.id === "the_end") return;
  const typ = (p: Vector3) => dim.getBlock(p)?.typeId;
  const volno = (p: Vector3) => ["minecraft:air", "minecraft:fire"].includes(typ(p) ?? "");
  const obsidian = (p: Vector3) => typ(p) === "minecraft:obsidian";
  const stred = { x: Math.floor(zasah.x), y: Math.floor(zasah.y), z: Math.floor(zasah.z) };
  for (const osa of ["x", "z"] as const) {
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++) {
          const seed = { x: stred.x + dx, y: stred.y + dy, z: stred.z + dz };
          if (!volno(seed)) continue;
          const bod = (u: number, y: number): Vector3 =>
            osa === "x" ? { x: u, y, z: seed.z } : { x: seed.x, y, z: u };
          let dolu = seed.y;
          for (let i = 0; i < 21 && volno(bod(seed[osa], dolu - 1)); i++) dolu--;
          if (!obsidian(bod(seed[osa], dolu - 1))) continue;
          let vlevo = seed[osa];
          for (let i = 0; i < 21 && volno(bod(vlevo - 1, dolu)); i++) vlevo--;
          if (!obsidian(bod(vlevo - 1, dolu))) continue;
          let sirka = 0,
            vyska = 0;
          while (sirka <= 21 && volno(bod(vlevo + sirka, dolu))) sirka++;
          while (vyska <= 21 && volno(bod(vlevo, dolu + vyska))) vyska++;
          if (sirka < 2 || sirka > 21 || vyska < 3 || vyska > 21) continue;
          const body: Vector3[] = [];
          let platny = true;
          for (let x = 0; x < sirka; x++) {
            if (!obsidian(bod(vlevo + x, dolu - 1)) || !obsidian(bod(vlevo + x, dolu + vyska))) platny = false;
            for (let y = 0; y < vyska; y++) {
              const p = bod(vlevo + x, dolu + y);
              if (!volno(p)) platny = false;
              body.push(p);
            }
          }
          for (let y = 0; y < vyska; y++) {
            if (!obsidian(bod(vlevo - 1, dolu + y)) || !obsidian(bod(vlevo + sirka, dolu + y))) platny = false;
          }
          if (platny) return { body, osa };
        }
  }
}
