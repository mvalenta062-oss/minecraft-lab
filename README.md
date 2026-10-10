# Minecraft Factory

Malá dílna, kde vymýšlíme a vyrábíme vlastní věci do Minecraftu (Bedrock Edition).
Je to projekt na učení: nejdřív něco vyrobíme, potom zjistíme, jak to funguje.

- **Web (deník projektu):** https://mvalenta062-oss.github.io/minecraft-lab/
- **Podrobný plán projektu:** [PROJECT.md](PROJECT.md)

## Co je kde

```text
minecraft-lab/
├── README.md             <- tenhle soubor
├── PROJECT.md            <- plán a pravidla celého projektu
├── docs/                 <- web (GitHub Pages)
│   ├── index.html        <- hlavní stránka
│   ├── css/style.css     <- jak web vypadá
│   ├── js/data.js        <- výtvory, deník a plán (tohle se mění nejčastěji)
│   ├── js/main.js        <- kód, který z dat vyrobí stránku
│   └── assets/images/    <- obrázky
├── projects/             <- naše add-ony, každý ve své složce
│   └── first-addon/
│       ├── README.md     <- co to je a jak to funguje
│       ├── behavior_pack/  <- chování (co věci dělají)
│       └── resource_pack/  <- vzhled (textury, modely, zvuky)
└── tools/                <- pomocné skripty (zatím prázdné)
```

## Web

Web je obyčejné HTML, CSS a JavaScript. Nic se nemusí instalovat.

- **Lokálně:** otevři `docs/index.html` v prohlížeči.
- **Na internetu:** GitHub Pages ho zveřejňuje z větve `main` a složky `/docs`.
  Po každém pushi se web sám obnoví (trvá to asi minutu).

Když chceš přidat nový výtvor nebo zápis do deníku, uprav `docs/js/data.js`.

## Výtvory

| Název | Stav | Složka |
| --- | --- | --- |
| První add-on | v plánu | [projects/first-addon](projects/first-addon) |

Každý add-on má svou složku v `projects/`. Uvnitř je vždy:

- `behavior_pack/` – chování: co blok nebo předmět dělá (JSON, později skripty),
- `resource_pack/` – vzhled: textury, modely, zvuky, názvy,
- `README.md` – popis výtvoru.

## Kdo to dělá

- **Máťa** – tvůrce a vynálezce. Vybírá, co se bude vyrábět.
- **Taťka Martin** – pomocník. Připravuje nástroje a pomáhá s problémy.
