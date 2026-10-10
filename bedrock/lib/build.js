// Build add-onu: validace, kopie souborů packů do dist/<id>/ a překlad skriptů (TypeScript -> JavaScript).
import fs from "node:fs";
import path from "node:path";
import * as esbuild from "esbuild";
import ts from "typescript";
import { SLOZKA_ADDONU, slozkaBuildu } from "./addony.js";
import { najdiZdrojSkriptu, validujAddon } from "./validace.js";
import { ChybaNastroje } from "./vystup.js";

/** Soubory, které do packu nepatří (dokumentace a smetí operačních systémů). */
const VYNECHAT = new Set([".DS_Store", "Thumbs.db", "desktop.ini"]);

function patriDoPacku(zdroj, soubor) {
  const relativni = path.relative(zdroj, soubor);
  if (!relativni) return true;
  if (relativni.split(path.sep)[0] === "scripts") return false; // skripty řeší esbuild
  const jmeno = path.basename(soubor);
  return !VYNECHAT.has(jmeno) && !jmeno.endsWith(".md");
}

/** Nastavení TypeScriptu: z projects/tsconfig.json, nebo rozumná výchozí hodnota. */
function nastaveniTypescriptu(koren) {
  const tsconfig = path.join(koren, SLOZKA_ADDONU, "tsconfig.json");
  if (fs.existsSync(tsconfig)) {
    const { config, error } = ts.readConfigFile(tsconfig, ts.sys.readFile);
    if (error) throw new ChybaNastroje(`${tsconfig}: ${ts.flattenDiagnosticMessageText(error.messageText, "\n")}`);
    const { options } = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(tsconfig));
    return { ...options, noEmit: true };
  }
  return {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    lib: ["lib.es2023.d.ts"],
    types: [],
    strict: true,
    skipLibCheck: true,
    noEmit: true,
  };
}

/** Zkontroluje typy ve všech .ts souborech ve scripts/. Při chybě vyhodí srozumitelný výpis. */
function zkontrolujTypy(koren, slozkaSkriptu) {
  const soubory = [];
  const projdi = (slozka) => {
    for (const polozka of fs.readdirSync(slozka, { withFileTypes: true })) {
      const cesta = path.join(slozka, polozka.name);
      if (polozka.isDirectory()) projdi(cesta);
      else if (cesta.endsWith(".ts")) soubory.push(cesta);
    }
  };
  projdi(slozkaSkriptu);
  if (soubory.length === 0) return;
  // Společné typy pro všechny add-ony (projects/*.d.ts), např. globální console.
  const slozkaProjektu = path.join(koren, SLOZKA_ADDONU);
  if (fs.existsSync(slozkaProjektu)) {
    for (const jmeno of fs.readdirSync(slozkaProjektu)) {
      if (jmeno.endsWith(".d.ts")) soubory.push(path.join(slozkaProjektu, jmeno));
    }
  }

  const program = ts.createProgram({ rootNames: soubory, options: nastaveniTypescriptu(koren) });
  const diagnostiky = ts.getPreEmitDiagnostics(program);
  if (diagnostiky.length === 0) return;

  const host = {
    getCanonicalFileName: (f) => f,
    getCurrentDirectory: () => koren,
    getNewLine: () => "\n",
  };
  const vypis = process.stdout.isTTY
    ? ts.formatDiagnosticsWithColorAndContext(diagnostiky, host)
    : ts.formatDiagnostics(diagnostiky, host);
  throw new ChybaNastroje(`TypeScript našel chyby ve skriptech:\n${vypis}`);
}

async function prelozSkript(koren, zdrojPacku, cilPacku, entry) {
  const zdroj = najdiZdrojSkriptu(zdrojPacku, entry);
  zkontrolujTypy(koren, path.join(zdrojPacku, "scripts"));
  try {
    await esbuild.build({
      entryPoints: [zdroj],
      outfile: path.join(cilPacku, entry),
      bundle: true,
      format: "esm",
      target: "es2020",
      charset: "utf8",
      // Moduly Minecraftu dodává hra, do balíčku nepatří.
      external: ["@minecraft/*"],
      logLevel: "silent",
      absWorkingDir: koren,
    });
  } catch (e) {
    const zpravy = e.errors ? await esbuild.formatMessages(e.errors, { kind: "error", color: false }) : [e.message];
    throw new ChybaNastroje(`Skript ${path.relative(koren, zdroj)} se nepodařilo přeložit:\n${zpravy.join("\n")}`);
  }
}

/**
 * Sestaví add-on do dist/<id>/. Vrací { vystup, varovani, packy }.
 * Při chybě validace nebo překladu vyhodí ChybaNastroje.
 */
export async function buildAddon(koren, addon, nastaveni) {
  const validace = validujAddon(addon, nastaveni);
  if (validace.chyby.length > 0) {
    throw new ChybaNastroje(
      `Add-on "${addon.id}" má chyby, oprav je a zkus to znovu:\n` + validace.chyby.map((c) => `  - ${c}`).join("\n"),
    );
  }

  const vystup = slozkaBuildu(koren, addon.id);
  fs.rmSync(vystup, { recursive: true, force: true });
  const packy = [];
  for (const pack of addon.packy) {
    const zdroj = path.join(addon.slozka, pack);
    const cil = path.join(vystup, pack);
    fs.cpSync(zdroj, cil, { recursive: true, filter: (soubor) => patriDoPacku(zdroj, soubor) });
    const skript = validace.manifesty[pack].modules.find((m) => m.type === "script");
    if (skript) await prelozSkript(koren, zdroj, cil, skript.entry);
    packy.push({ pack, cil, skript: skript ? skript.entry : null });
  }
  return { vystup, varovani: validace.varovani, packy };
}
