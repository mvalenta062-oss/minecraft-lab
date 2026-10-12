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
    stav: "hotovo",
  },
  {
    nazev: "První vlastní výtvor",
    popis: "Duhová hlína je hotová a funguje v Minecraftu na Windows!",
    stav: "hotovo",
  },
  {
    nazev: "Vzhled a vlastnosti",
    popis: "První vlastní textura: duhové proužky a barevné skvrnky na všech stranách kostky.",
    stav: "hotovo",
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
    popis: "Duhovou hlínu nabízíme ke stažení. Další krok: vyzkoušet balíček na iPadu kamarádů.",
    stav: "delame",
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
  /** Náhled textury nebo obrázek doplňku. */
  nahled?: string;
  /** Zelená = ověřeno ve hře, šedá = zatím neověřeno. */
  platformy?: { platforma: "windows" | "ipad"; overeno: boolean }[];
  /** Jak výtvor získat běžným hraním. */
  rezimy?: ("creative" | "survival")[];
}

export const PROJEKTY: Projekt[] = [
  {
    nazev: "Duhová hlína",
    popis: "Duhové proužky a barevné skvrnky ze všech stran. Na stavění v kreativním režimu.",
    stav: "hotovo",
    odkazStazeni: `${import.meta.env.BASE_URL}addony/duhova-hlina.mcaddon`,
    rezimy: ["creative"],
    nahled: `${import.meta.env.BASE_URL}images/duhova-hlina.png`,
    platformy: [
      { platforma: "windows", overeno: true },
      { platforma: "ipad", overeno: false },
    ],
    odkazZdroj: "https://github.com/mvalenta062-oss/minecraft-lab/tree/main/projects/duhova-hlina",
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
    datum: "2026-10-12",
    nadpis: "První kostička je na světě. A je duhová!",
    text: `Máťa vymyslel **duhovou hlínu**: kostičku s proužky a barevnými skvrnkami na stavění v kreativním režimu. Byl nadšený a všechno šlo skoro jako po drátkách. Až na drobnou chybu: balíček byl zapnutý, ale kostička v inventáři nikde. Svět vývoje není vždycky růžový — ani když vyrábíme duhu. :-D

Opravili jsme zastaralý zápis jedné vlastnosti a po novém nasazení už vše fungovalo. Poučení jsme zapsali pro příště. **První doplněk je hotový a ke stažení!** Na Windows ověřeno, iPad nás ještě čeká.`,
  },
  {
    datum: "2026-10-11",
    nadpis: "Dílna stojí. A teď konečně Minecraft!",
    text: `Chtěli jsme se synem vyrábět vlastní věci do Minecraftu. Nejdřív jsme ale museli přichystat místo, kde je budeme vyrábět. Tak vznikla naše **Minecraft Factory**.

První boss nás čekal ještě před instalací nářadí: dětský účet u Microsoftu. Při jeho přípravě taťka málem umřel, obnova starého účtu selhala a chvílemi to vypadalo, že jednodušší bude vyrobit celý Minecraft znovu. Nakonec ale všechno dobře dopadlo. Ve Windows jsme oddělili správce od účtu mladého vynálezce a zařídili přístup na GitHub.

Následovalo vybavení dílny: editor, Git, vývojářské nástroje a hlídaná cesta pro stahování balíčků. Uklidili jsme projekt do složek, rozběhli webový deník a připravili nástroje, které doplněk sestaví, pošlou do Minecraftu a zabalí pro kamarády. Nechyběla ani výprava za správnou edicí hry a jejími schovanými adresáři.

Nakonec dostal místo u ponku i AI pomocník. Codex už pracuje lokálně s projektem a v \`AGENTS.md\` má základní pravidla dílny, aby se při každé návštěvě nemusel znovu ptát, kde je kladivo.

**Dílna je připravená.** Taťka nachystal nářadí, AI může přidržovat součástky a Máťa rozhodne, co vznikne. Teď už konečně můžeme rozbíjet věci ve světě z kostek.`,
  },
  {
    datum: "2026-10-10",
    nadpis: "Založili jsme dílnu",
    text: "Máme repozitář na GitHubu a tenhle web. Máťa vybral obrázek z Copper Age jako pozadí. Teď připravujeme notebook a Minecraft.",
  },
];
