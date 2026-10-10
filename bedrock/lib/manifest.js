// Pomůcky pro čtení manifestů a JSON souborů v packách.
import fs from "node:fs";
import path from "node:path";

/** Přečte JSON soubor. Toleruje BOM na začátku (občas ho přidá Windows). */
export function nactiJson(soubor) {
  const text = fs.readFileSync(soubor, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(text);
}

export function jeUuid(hodnota) {
  return (
    typeof hodnota === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(hodnota)
  );
}

/** Verze v manifestu: [1, 0, 0] nebo "1.0.0". */
export function jeVerze(hodnota) {
  if (Array.isArray(hodnota)) {
    return hodnota.length === 3 && hodnota.every((n) => Number.isInteger(n) && n >= 0);
  }
  return typeof hodnota === "string" && /^\d+\.\d+\.\d+(-[\w.]+)?$/.test(hodnota);
}

export function verzeNaText(hodnota) {
  return Array.isArray(hodnota) ? hodnota.join(".") : String(hodnota);
}

/**
 * Když je v manifestu místo názvu klíč do překladů (pack.name, pack.description),
 * najde text v texts/cs_CZ.lang nebo texts/en_US.lang.
 */
export function prelozText(slozkaPacku, text) {
  if (typeof text !== "string" || !text.startsWith("pack.")) return text;
  for (const jazyk of ["cs_CZ", "en_US"]) {
    const lang = path.join(slozkaPacku, "texts", `${jazyk}.lang`);
    if (!fs.existsSync(lang)) continue;
    for (const radek of fs.readFileSync(lang, "utf8").split(/\r?\n/)) {
      const i = radek.indexOf("=");
      if (i < 0) continue;
      if (radek.slice(0, i).trim() === text) {
        return radek
          .slice(i + 1)
          .replace(/\t#.*$/, "")
          .trim();
      }
    }
  }
  return text;
}

/** Všechny soubory ve složce (rekurzivně), seřazené, jako absolutní cesty. */
export function projdiSoubory(slozka) {
  const vysledek = [];
  const projdi = (aktualni) => {
    for (const polozka of fs
      .readdirSync(aktualni, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))) {
      const cesta = path.join(aktualni, polozka.name);
      if (polozka.isDirectory()) projdi(cesta);
      else vysledek.push(cesta);
    }
  };
  projdi(slozka);
  return vysledek;
}

/** JSON hezky odsazený, ale krátká pole čísel na jednom řádku (stejně jako Prettier). */
export function jsonText(hodnota) {
  const text = JSON.stringify(hodnota, null, 2).replace(
    /\[\s+((?:\d+,\s+)*\d+)\s+\]/g,
    (_, cisla) => `[${cisla.replace(/\s+/g, " ")}]`,
  );
  return text + "\n";
}
