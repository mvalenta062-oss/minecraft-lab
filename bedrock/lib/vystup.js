// Výpis do konzole: kroky, úspěchy, varování a chyby. Barvy jen v terminálu.
const barvy = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;

function obarvi(kod, text) {
  return barvy ? `\x1b[${kod}m${text}\x1b[0m` : text;
}

export function krok(text) {
  console.log(`\n${obarvi("36", "== " + text)}`);
}
export function ok(text) {
  console.log(`  ${obarvi("32", "[OK]")} ${text}`);
}
export function info(text) {
  console.log(`  ${text}`);
}
export function varovani(text) {
  console.log(`  ${obarvi("33", "[?!]")} ${text}`);
}
export function chyba(text) {
  console.error(`  ${obarvi("31", "[!!]")} ${text}`);
}
export function hotovo(text) {
  console.log(`\n${obarvi("32", text)}`);
}

/** Chyba, kterou umíme srozumitelně vysvětlit. CLI ji vypíše bez stack trace. */
export class ChybaNastroje extends Error {
  constructor(zprava) {
    super(zprava);
    this.name = "ChybaNastroje";
  }
}
