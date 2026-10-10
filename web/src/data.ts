// ==========================================================
// Minecraft Factory – data pro web
//
// Tady je všechno, co se na webu mění nejčastěji.
// Když chceš přidat nový výtvor nebo zápis do deníku,
// stačí upravit tenhle soubor.
// ==========================================================

export type Stav = "plan" | "delame" | "hotovo";

export const NAZVY_STAVU: Record<Stav, string> = {
  plan: "V plánu",
  delame: "Děláme",
  hotovo: "Hotovo",
};

// ---------- Fáze projektu ----------
export interface Faze {
  nazev: string;
  popis: string;
  stav: Stav;
}

export const FAZE: Faze[] = [
  {
    nazev: "Připravit dílnu",
    popis: "Nastavit notebook, Minecraft, editor a tenhle web.",
    stav: "delame",
  },
  {
    nazev: "První vlastní výtvor",
    popis: "Máťa vybere nápad. Vyrobíme první blok nebo předmět.",
    stav: "plan",
  },
  {
    nazev: "Vzhled a vlastnosti",
    popis: "Vlastní textury, modely a nastavení v JSON.",
    stav: "plan",
  },
  {
    nazev: "Herní mechaniky",
    popis: "Recepty, efekty a jednoduchá pravidla, aby to bylo zábavné i při hraní.",
    stav: "plan",
  },
  {
    nazev: "První programování",
    popis: "Skripty v JavaScriptu, když už JSON nestačí.",
    stav: "plan",
  },
  {
    nazev: "Sdílení a vydání",
    popis: "Zabalíme add-on do .mcaddon a dáme ho vyzkoušet kamarádům.",
    stav: "plan",
  },
];

// ---------- Výtvory (add-ony) ----------
export interface Projekt {
  nazev: string;
  popis: string;
  stav: Stav;
  /** Odkaz na hotový .mcaddon ke stažení (nepovinné) */
  odkazStazeni?: string;
  /** Odkaz na složku s projektem na GitHubu (nepovinné) */
  odkazZdroj?: string;
}

export const PROJEKTY: Projekt[] = [
  {
    nazev: "První add-on",
    popis: "Ještě nevíme, co to bude. Máťa vybírá nápad.",
    stav: "plan",
    odkazZdroj: "https://github.com/mvalenta062-oss/minecraft-lab/tree/main/projects/first-addon",
  },
];

// ---------- Deník ----------
// Nový zápis přidej NAHORU, aby byl nejnovější první.
// Datum piš jako "RRRR-MM-DD".
export interface Zapis {
  datum: string;
  nadpis: string;
  text: string;
}

export const DENIK: Zapis[] = [
  {
    datum: "2026-10-10",
    nadpis: "Založili jsme dílnu",
    text: "Máme repozitář na GitHubu a tenhle web. Máťa vybral obrázek z Copper Age jako pozadí. Teď připravujeme notebook a Minecraft.",
  },
];
