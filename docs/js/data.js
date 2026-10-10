// ==========================================================
// Minecraft Factory – data pro web
//
// Tady je všechno, co se na webu mění nejčastěji.
// Když chceš přidat nový výtvor nebo zápis do deníku,
// stačí upravit tenhle soubor. HTML ani CSS sahat nemusíš.
//
// Stav může být:  "plan"   = v plánu
//                 "delame" = právě na tom pracujeme
//                 "hotovo" = hotovo
// ==========================================================

// ---------- Fáze projektu ----------
const FAZE = [
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
// odkazStazeni: odkaz na hotový .mcaddon (klidně nech prázdný "")
// odkazZdroj:   odkaz na složku s projektem na GitHubu
const PROJEKTY = [
  {
    nazev: "První add-on",
    popis: "Ještě nevíme, co to bude. Máťa vybírá nápad.",
    stav: "plan",
    odkazStazeni: "",
    odkazZdroj: "https://github.com/mvalenta062-oss/minecraft-lab/tree/main/projects/first-addon",
  },
];

// ---------- Deník ----------
// Nový zápis přidej NAHORU, aby byl nejnovější první.
// Datum piš jako "RRRR-MM-DD".
const DENIK = [
  {
    datum: "2026-10-10",
    nadpis: "Založili jsme dílnu",
    text: "Máme repozitář na GitHubu a tenhle web. Máťa vybral obrázek z Copper Age jako pozadí. Teď připravujeme notebook a Minecraft.",
  },
];
