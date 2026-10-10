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
├── web/                  <- web (React + TypeScript + MUI)
│   ├── src/data.ts       <- výtvory, deník a plán (tohle se mění nejčastěji)
│   ├── src/theme.ts      <- barvy a písma
│   ├── src/components/   <- jednotlivé části stránky
│   └── public/images/    <- obrázky
├── .github/workflows/    <- akce, která web zveřejní na GitHub Pages
├── projects/             <- naše add-ony, každý ve své složce
│   └── first-addon/
│       ├── README.md     <- co to je a jak to funguje
│       ├── behavior_pack/  <- chování (co věci dělají)
│       └── resource_pack/  <- vzhled (textury, modely, zvuky)
└── tools/                <- pomocné skripty v Pythonu (uv), zatím prázdné
```

## ⚠️ Pravidlo pro instalaci balíčků

Balíčky (npm i Python) se **vždy** instalují jen přes naši nastavenou gateway.
Na obou počítačích je přednastavená, takže `npm install` i `uv add` přes ni jdou samy.

- **Nikdy** gateway neobcházej: žádný `--registry`, žádný vlastní `.npmrc`,
  žádný `--index-url`, žádné `pip install` mimo uv.
- Když instalace spadne s chybou `403` nebo `quarantined`, gateway ten balíček
  zablokovala. **Zastav se** a řešení hledej jinde:
  1. zkus starší nebo novější verzi balíčku,
  2. zkus jiný balíček, který umí to samé,
  3. když nic nepomůže, řekni taťkovi.
- Chyba gateway není chyba tvoje. Je to pojistka, že si do počítače nestáhneme něco škodlivého.

## Web

Web je napsaný v Reactu a TypeScriptu s komponentami MUI, staví ho Vite.
Potřebuješ mít nainstalovaný Node.js (verze 22).

**Spuštění na počítači:**

```bash
cd web
npm install     # jen poprvé
npm run dev     # otevře web na http://localhost:5173/minecraft-lab/
```

Když chceš přidat nový výtvor nebo zápis do deníku, uprav `web/src/data.ts`.
Web se v prohlížeči sám obnoví.

**Zveřejnění na internetu:**

Web se zveřejní na GitHub Pages, když pushneš tag začínající na `v`:

```bash
git tag v1.0
git push origin v1.0
```

GitHub pak web sám sestaví a nahraje (trvá to asi minutu, průběh je v záložce *Actions*).
Druhá možnost je spustit akci *Publikovat web* ručně v záložce Actions.

## Nástroje

Pomocné skripty v `tools/` jsou v Pythonu a spouští je `uv`:

```bash
cd tools
uv sync             # jen poprvé
uv run nazev.py
```

Víc je v [tools/README.md](tools/README.md).

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
