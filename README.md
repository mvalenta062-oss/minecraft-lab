# Minecraft Factory

Malá dílna, kde vymýšlíme a vyrábíme vlastní věci do Minecraftu (Bedrock Edition).
Je to projekt na učení: nejdřív něco vyrobíme, potom zjistíme, jak to funguje.

- **Web (deník projektu):** https://mvalenta062-oss.github.io/minecraft-lab/
- **Podrobný plán projektu:** [PROJECT.md](PROJECT.md)

## Co je kde

```text
minecraft-lab/
├── README.md             <- tenhle soubor
├── eslint.config.js      <- pravidla pro kontrolu kódu (ESLint), .prettierrc = formátování
├── .vscode/              <- doporučená rozšíření a nastavení VS Code
├── PROJECT.md            <- plán a pravidla celého projektu
├── web/                  <- web (React + TypeScript + MUI)
│   ├── src/data.ts       <- výtvory, deník a plán (tohle se mění nejčastěji)
│   ├── src/theme.ts      <- barvy a písma
│   ├── src/components/   <- jednotlivé části stránky
│   └── public/images/    <- obrázky
├── .github/workflows/    <- akce, která web zveřejní na GitHub Pages
├── projects/             <- naše add-ony, každý ve své složce (založí je npm run bedrock:new)
│   └── <jmeno>/
│       ├── README.md     <- co to je a jak to funguje
│       ├── behavior_pack/  <- chování (co věci dělají)
│       └── resource_pack/  <- vzhled (textury, modely, zvuky)
├── bedrock/              <- nástroje pro add-ony (build, deploy, .mcaddon), viz bedrock/README.md
├── dist/                 <- sestavené add-ony (Git je ignoruje)
├── tools/                <- pomocné skripty v Pythonu (uv), zatím prázdné
└── setup/                <- skripty na nastavení nového počítače (Windows 11)
```

## ⚠️ Pravidlo pro instalaci balíčků

Balíčky (npm i Python) se **vždy** instalují jen přes naši nastavenou gateway.
Na obou počítačích je přednastavená, takže `npm install` i `uv add` přes ni jdou samy.
Nový počítač se nastaví skripty ve složce [setup/](setup/README.md).

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
Potřebuješ mít nainstalovaný Node.js (verze 22 nebo novější, nainstaluje ho `setup/instalace-node.ps1`).

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

GitHub pak web sám sestaví a nahraje (trvá to asi minutu, průběh je v záložce _Actions_).
Druhá možnost je spustit akci _Publikovat web_ ručně v záložce Actions.

## Kontrola a formátování kódu

V kořeni repa je ESLint (hledá chyby v TypeScriptu a JavaScriptu) a Prettier (sjednocuje formátování
kódu, JSON i Markdownu). Ve VS Code se soubor zformátuje sám při uložení. Ručně:

```bash
npm install        # jen poprvé, v kořeni repa
npm run lint       # najde chyby v kódu (web i skripty v add-onech)
npm run format     # zformátuje všechny soubory
```

## Minecraft – instalace a první spuštění

Pro výrobu a testování add-onů potřebuješ na Windows **Minecraft for Windows (Bedrock Edition)**. Prodává se v balíčku **Minecraft: Java & Bedrock Edition for PC**, ale pro tento projekt spouštíme **Bedrock**, ne Java Edition.

1. Otevři [Minecraft: Java & Bedrock Edition for PC](https://www.xbox.com/cs-cz/games/store/minecraft-java--bedrock-edition-for-pc/9NXP44L49SHJ) a pořiď hru pod svým Microsoft účtem (u dětského účtu může být potřeba schválení rodičem).
2. Ve Windows otevři **Microsoft Store** nebo **Xbox aplikaci**, přihlas se stejným účtem a nainstaluj **Minecraft for Windows**. Pokud instalace požaduje **Gaming Services**, nainstaluj je přes Microsoft Store / Xbox aplikaci.
3. Spusť **Minecraft for Windows**, ověř přihlášení Xbox účtem a zkus otevřít hlavní menu hry.
4. V kořeni repozitáře spusť ve Windows PowerShellu setup (není potřeba správce):

   ```powershell
   .\setup\instalace-minecraft.ps1
   ```

   Skript vyhledá lokální složku Minecraftu, připraví vývojové adresáře a uloží cesty do `bedrock.local.json`. Tento soubor je lokální a Git ho ignoruje.

5. Potom můžeš pokračovat příkazy v sekci [Add-ony](#add-ony).

**Když instalace nefunguje:** Zkontroluj, že Microsoft Store a Xbox aplikace fungují pod stejným uživatelským účtem jako hra. Chybějící Gaming Services doinstaluj z Microsoft Store. Pokud Microsoft Store na daném účtu vůbec není, požádej taťku o pomoc; nepřepínej účet na správce a nezasahuj do systémových složek.

## Add-ony

Add-on se založí, sestaví a nakopíruje do Minecraftu příkazy z kořene repa (jen jméno, o zbytek se postarají nástroje):

```bash
npm install                            # jen poprvé, v kořeni repa
npm run bedrock:new magicky-blok       # založí projects/magicky-blok
npm run bedrock:deploy magicky-blok    # sestaví a nakopíruje do Minecraftu
npm run bedrock:package magicky-blok   # zabalí do .mcaddon pro kamarády
```

Kde má Minecraft svou složku, si nástroje přečtou z `bedrock.local.json` (vytvoří ho `setup/instalace-minecraft.ps1`).
Podrobnosti jsou v [bedrock/README.md](bedrock/README.md).

## Nástroje

Pomocné skripty v `tools/` jsou v Pythonu a spouští je `uv`:

```bash
cd tools
uv sync             # jen poprvé
uv run nazev.py
```

Víc je v [tools/README.md](tools/README.md).

## Výtvory

Zatím žádný. První vznikne, až Máťa vybere nápad: `npm run bedrock:new <jmeno>`.

Každý add-on má svou složku v `projects/`. Uvnitř je vždy:

- `behavior_pack/` – chování: co blok nebo předmět dělá (JSON, později skripty),
- `resource_pack/` – vzhled: textury, modely, zvuky, názvy,
- `README.md` – popis výtvoru.

## Kdo to dělá

- **Máťa** – tvůrce a vynálezce. Vybírá, co se bude vyrábět.
- **Taťka Martin** – pomocník. Připravuje nástroje a pomáhá s problémy.
