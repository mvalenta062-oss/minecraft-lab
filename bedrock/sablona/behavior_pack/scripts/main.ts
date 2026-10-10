// Skript add-onu {{NAZEV}}. Spustí se, když se načte svět, ve kterém je add-on zapnutý.
// Výpis z console.log uvidíš ve hře v Content Log (Nastavení → Creator → Enable Content Log GUI).
import { world } from "@minecraft/server";

world.afterEvents.worldLoad.subscribe(() => {
  console.log("[{{ID}}] add-on je načtený");
});
