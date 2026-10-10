// Načtení bedrock/nastaveni.json a kontrola, že nainstalovaný @minecraft/server odpovídá.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ChybaNastroje } from "./vystup.js";

/** Kořen repozitáře (složka, ve které je bedrock/ a package.json). */
export const KOREN_REPA = fileURLToPath(new URL("../..", import.meta.url));

export function nactiNastaveni() {
  const soubor = fileURLToPath(new URL("../nastaveni.json", import.meta.url));
  const nastaveni = JSON.parse(fs.readFileSync(soubor, "utf8"));
  if (!Array.isArray(nastaveni.minecraft) || typeof nastaveni.server !== "string" || !nastaveni.distribuce) {
    throw new ChybaNastroje(`Soubor ${soubor} musí mít "minecraft" (pole), "server" (text) a "distribuce" (složka).`);
  }
  return nastaveni;
}

/** Zkontroluje, že v node_modules je přesně ta verze @minecraft/server, kterou cílíme. */
export function overInstalovanyServer(nastaveni) {
  const balicek = path.join(KOREN_REPA, "node_modules", "@minecraft", "server", "package.json");
  if (!fs.existsSync(balicek)) {
    throw new ChybaNastroje("Balíček @minecraft/server není nainstalovaný. Spusť v kořeni repa: npm install");
  }
  const { version } = JSON.parse(fs.readFileSync(balicek, "utf8"));
  if (version !== nastaveni.server) {
    throw new ChybaNastroje(
      `Nainstalovaný @minecraft/server je ${version}, ale bedrock/nastaveni.json chce ${nastaveni.server}. ` +
        "Srovnej package.json a nastaveni.json a spusť npm install.",
    );
  }
  return version;
}
