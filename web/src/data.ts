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
    popis: "Dřevěný kyrys má vlastní recept, odráží útočníky a chrání před šípy i částí zranění z výbuchů.",
    stav: "hotovo",
  },
  {
    nazev: "První programování",
    popis: "Skripty už řídí ochranu dřevěného kyrysu i dočasně zapíchnuté šípy.",
    stav: "hotovo",
  },
  {
    nazev: "Sdílení a vydání",
    popis: "Doplňky umíme zabalit a nabídnout ke stažení. Duhová hlína funguje i na iPadu!",
    stav: "hotovo",
  },
];

// ---------- Výtvory (add-ony) ----------
export interface Projekt {
  nazev: string;
  popis: string;
  stav: Stav;
  /** Úplné vlastnosti výtvoru v samostatném dialogu. */
  podrobnosti?: { nadpis: string; text: string }[];
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
  /** Podrobný recept otevřený z karty; mezera znamená prázdné políčko. */
  recept?: {
    radky: string[];
    suroviny: Record<string, { nazev: string; obrazek: string }>;
    popis: string;
  };
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
      { platforma: "ipad", overeno: true },
    ],
    odkazZdroj: "https://github.com/mvalenta062-oss/minecraft-lab/tree/main/projects/duhova-hlina",
  },
  {
    nazev: "Dřevěné brnění",
    popis:
      "Sedm polen, jedno pírko a nezničitelný kyrys na dobrodružství. Odrází útočníky, zastaví šípy a zmírní výbuchy. Jen na Wardena je krátký!",
    podrobnosti: [
      {
        nadpis: "Údery zblízka",
        text: "Zastaví úder a odrazí útočníka. Na Wardena neplatí.",
      },
      {
        nadpis: "Šípy a další střely",
        text: "Plná ochrana před přímým zásahem šípu, hozeného trojzubce a ghastovy koule. Jed ze šípu dál působí.",
      },
      {
        nadpis: "Výbuchy: o 50 % menší zranění",
        text: "Platí pro všechny výbuchy. Okolní bloky nechrání.",
      },
      {
        nadpis: "Oheň, láva, jed a pády",
        text: "Bez základní ochrany. Proti ohni může pomoci očarování Fire Protection. Ostatní zranění se nemění.",
      },
      {
        nadpis: "Nezničitelný a barvitelný",
        text: "Nepotřebuje opravy. Lze jej barvit v kotlíku a běžně očarovat.",
      },
      {
        nadpis: "Zapíchnuté šípy",
        text: "Nejvýš pět na hráči, každý na 20 sekund. Šestý nahradí nejstarší.",
      },
    ],
    stav: "hotovo",
    odkazStazeni: `${import.meta.env.BASE_URL}addony/drevene-brneni.mcaddon`,
    odkazZdroj: "https://github.com/mvalenta062-oss/minecraft-lab/tree/main/projects/drevene-brneni",
    nahled: `${import.meta.env.BASE_URL}images/drevene-brneni.png`,
    rezimy: ["creative", "survival"],
    platformy: [
      { platforma: "windows", overeno: true },
      { platforma: "ipad", overeno: false },
    ],
    recept: {
      radky: ["DDD", "DSD", "D D"],
      suroviny: {
        D: { nazev: "Libovolné poleno", obrazek: `${import.meta.env.BASE_URL}images/poleno.svg` },
        S: { nazev: "Slepičí pírko", obrazek: `${import.meta.env.BASE_URL}images/pirko.svg` },
      },
      popis:
        "Na pracovním stole použij 7 libovolných polen a 1 slepičí pírko. Druhy polen můžeš míchat. Spodní prostřední políčko nech prázdné. Výsledkem je jeden dřevěný kyrys; obleč jej místo hrudního brnění. Pírko slouží jako podšívka a na vzhledu není vidět.",
    },
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
    datum: "2026-10-16",
    nadpis: "Dřevěné brnění: od košile ke kyrysu",
    text: `Máťa při hraní objevil slabiny svého prvního brnění: připomínalo spíš košili a před šípy ani creeperem nechránilo. Rozhodli jsme se proto vylepšit stejný doplněk — přidat výraznější dřevěné pláty a ramena a odstranit pírko z jeho vzhledu.

Postupně jsme společně promysleli pravidla. Brnění zůstane nezničitelné, protože opravy na kovadlině by na začátku hry byly obtížné. Zastaví šípy a hozený trojzubec, zranění ze všech výbuchů sníží na polovinu. Oheň a jed zůstávají hrozbou; proti ohni může pomoci běžné očarování. Pro radost přibude i nejvýš pět dočasně zapíchnutých šípů.`,
  },
  {
    datum: "2026-10-14",
    nadpis: "Dřevo, peří a velká radost",
    text: `Máťa vymyslel **Dřevěné brnění**, které si můžeme vyrobit hned na začátku hry. Stačí sedm polen a jedno slepičí pírko: dřevo chrání a peří odpružuje údery. Útočník si bouchne a odskočí. Jen Warden zůstává pořádný soupeř.

Recept i chování jsme vyzkoušeli přímo ve hře a **funguje to!** Máťa měl obrovskou radost — nejen z vlastního výtvoru, ale i z toho, že košile pomůže kamarádům přežít začátky jejich dobrodružství.

A ještě jedna dobrá zpráva: **Duhová hlína je otestovaná i na iPadu.** Sdílení a vydávání doplňků tak můžeme v plánu odškrtnout.`,
  },
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
