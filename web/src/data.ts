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
  podrobnosti?: {
    nadpis: string;
    text: string;
    predmety?: { nazev: string; obrazek: string }[];
  }[];
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
    nazev: "Smaragdové vybavení",
    popis:
      "Dej smaragdům novou práci! Vyrob si zelený meč, čtyři pracovní nástroje a celé brnění. Známé recepty, nový kámen a trochu menší výdrž než u diamantu.",
    stav: "hotovo",
    odkazStazeni: `${import.meta.env.BASE_URL}addony/smaragdove-vybaveni.mcaddon`,
    odkazZdroj: "https://github.com/mvalenta062-oss/minecraft-lab/tree/main/projects/smaragdove-vybaveni",
    nahled: `${import.meta.env.BASE_URL}images/smaragdove-vybaveni.png`,
    rezimy: ["creative", "survival"],
    platformy: [
      { platforma: "windows", overeno: true },
      { platforma: "ipad", overeno: false },
    ],
    podrobnosti: [
      {
        nadpis: "Devět zelených kousků",
        text: "Meč, krumpáč, sekera, lopata, motyka, helma, kyrys, kalhoty a boty. V kreativním inventáři vyhledej Smaragd. Brnění je zelené také po oblečení.",
        predmety: [
          ["Meč", "smaragdovy_mec"],
          ["Krumpáč", "smaragdovy_krumpac"],
          ["Sekera", "smaragdova_sekera"],
          ["Lopata", "smaragdova_lopata"],
          ["Motyka", "smaragdova_motyka"],
          ["Helma", "smaragdova_helma"],
          ["Kyrys", "smaragdovy_kyrys"],
          ["Kalhoty", "smaragdove_kalhoty"],
          ["Boty", "smaragdove_boty"],
        ].map(([nazev, soubor]) => ({
          nazev,
          obrazek: `${import.meta.env.BASE_URL}images/smaragdove-vybaveni/${soubor}.png`,
        })),
      },
      {
        nadpis: "Diamantové recepty se smaragdy",
        text: "Na pracovním stole použij stejné tvary jako u diamantového vybavení, jen diamanty nahraď smaragdy. Na celou sadu potřebuješ 35 smaragdů a 9 tyček. Původní diamantové vybavení zůstává ve hře.",
      },
      {
        nadpis: "O trochu slabší než diamant",
        text: "Nástroje mají 1405 bodů výdrže místo diamantových 1561. Brnění má přibližně o 10 % menší výdrž a celá sada dává 18 bodů ochrany místo 20. Síla a rychlost jsou také nižší; kvůli zaokrouhlení nejde všude přesně o 10 %.",
      },
      {
        nadpis: "Do dolu, na zahradu i do lesa",
        text: "Krumpáč zachovává diamantovou úroveň těžby. Sekera umí odkorňovat dřevo, lopata tvoří cestičky a motyka obdělává půdu. Měď sekerou zatím neošetříš a lopata nehasí táborák.",
      },
      {
        nadpis: "Opravy a očarování",
        text: "Vybavení můžeš běžně očarovat a opravovat smaragdy na kovadlině. Jeden smaragd obnoví přibližně čtvrtinu výdrže daného kusu.",
      },
      {
        nadpis: "Vyzkoušeno na Windows",
        text: "Celá sada prošla první herní zkouškou v Minecraft Bedrock na Windows a autorovi se moc líbí. Jednotlivé mechaniky ještě průběžně ověřujeme. iPad zatím není otestovaný. Zapni balíček chování i vzhledu; experimenty nejsou potřeba.",
      },
    ],
  },
  {
    nazev: "Lucky block",
    popis:
      "Zlatá krabička s překvapením. Udeř do ní, sleduj blikající otazníky a za tři sekundy sesbírej náhodné odměny!",
    stav: "hotovo",
    odkazStazeni: `${import.meta.env.BASE_URL}addony/lucky-block.mcaddon`,
    odkazZdroj: "https://github.com/mvalenta062-oss/minecraft-lab/tree/main/projects/lucky-block",
    nahled: `${import.meta.env.BASE_URL}images/lucky-block.png`,
    rezimy: ["creative"],
    platformy: [
      { platforma: "windows", overeno: true },
      { platforma: "ipad", overeno: true },
    ],
    podrobnosti: [
      {
        nadpis: "Z Creativu do Survivalu",
        text: "V kreativním inventáři vyhledej Lucky block a vezmi si několik krabiček. Potom přepni do Survivalu. Krabička nemá výrobní recept a při začátku hry se automaticky nerozdává.",
      },
      {
        nadpis: "Polož, udeř a počkej",
        text: "Polož krabičku na zem a udeř do ní nebo ji začni těžit. Bílé otazníky začnou blikat. Asi za tři sekundy krabička zmizí a odměny vyletí ven.",
      },
      {
        nadpis: "Co může vypadnout?",
        text: "Pokaždé 3–7 různých druhů z celého seznamu předmětů ve hře, včetně bloků, nástrojů, brnění a vajíček. Může padnout i další Lucky block nebo předmět z jiného aktivního doplňku. Vzduch se nelosuje.",
      },
      {
        nadpis: "Náhodné množství",
        text: "Od každého druhu dostaneš 1–16 kusů podle náhody a velikosti hromádky. Nástroje a brnění padají po jednom. Očarování ani další zvláštní varianty se nelosují.",
      },
      {
        nadpis: "Bouchnutí bez kráteru",
        text: "Otevření doprovází zvuk a obláček. Samotné bouchnutí nezraňuje a neničí okolní bloky.",
      },
      {
        nadpis: "Ověřeno ve hře",
        text: "Vzhled, otevření i rozšířený výběr odměn jsme ověřili v Minecraft Bedrock na Windows. Uživatel potvrdil také úspěšnou zkoušku na iPadu. Experimenty nejsou potřeba.",
      },
    ],
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
      { platforma: "ipad", overeno: true },
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
  {
    nazev: "Duhová hlína",
    popis: "Duhové proužky a barevné skvrnky ze všech stran. Na stavění v kreativním režimu.",
    podrobnosti: [
      {
        nadpis: "Jak ji získat",
        text: "V kreativním inventáři vyhledej Duhová hlína. Recept pro přežití nemá.",
      },
      {
        nadpis: "Duhové stavění",
        text: "Polož ji jako běžnou kostičku a stav podle fantazie. Duhové proužky a barevné skvrnky má na všech stranách.",
      },
      { nadpis: "Ověřeno ve hře", text: "Funguje v Minecraft Bedrock na Windows i na iPadu." },
    ],
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
    datum: "2026-10-22",
    nadpis: "Smaragdy patří i do výbavy!",
    text: `Co kdyby šlo diamantové vybavení vyrábět ze **smaragdů**? Máťa chtěl zelenou sadu, která bude o trochu slabší než diamantová. Domluvili jsme se na přibližně **10 % menší výdrži** a pustili se do meče a krumpáče.

Při zkoušení Máťa odhalil i drobnosti v kresbě: zelenající dřevo, krátkou násadu a její zvláštní konec. Ladili jsme jednotlivé pixely, až dřevo přirozeně procházelo pod zelenou hlavou krumpáče.

Pak přibyla sekera, lopata, motyka a všechny čtyři části brnění. **Celá smaragdová sada už prošla první zkouškou ve hře na Windows a má úspěch!** Recepty známe z diamantového vybavení, jen v nich vyměníme kámen. Další podrobnosti mechanik budeme ověřovat při hraní; iPad zatím čeká.`,
  },
  {
    datum: "2026-10-17",
    nadpis: "Lucky block: co se skrývá pod otazníkem?",
    text: `Máťa vymyslel **Lucky block**: zlatou krabičku s bílými otazníky a překvapením uvnitř. Vezmeš ji v Creativu, položíš a v Survivalu do ní udeříš. Otazníky zablikají a asi za tři sekundy krabička bouchne — jen zvukem a obláčkem, bez kráteru a zranění.

Nejdřív jsme losovali z deseti druhů zásob, ale při hraní se moc opakovaly. Máťa chtěl raději **všechny možné věci**. Krabička proto vybírá z celého herního seznamu: vyletí 3–7 různých druhů a náhodné množství. Nový výběr jsme vyzkoušeli ve hře a funguje podle představ. Na Windows ověřeno, iPad ještě čeká.`,
  },
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
