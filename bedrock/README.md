# Nástroje pro add-ony

Skripty, které add-on z `projects/` zkontrolují, sestaví, nakopírují do Minecraftu a zabalí
do `.mcaddon`. Všechno se spouští z kořene repa přes npm (po `npm install` v kořeni).

## Příkazy

| Příkaz                             | Co udělá                                                                                |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| `npm run bedrock:new <jmeno>`      | založí nový add-on v `projects/<jmeno>/` (manifesty s novými UUID, první skript)        |
| `npm run bedrock:validate [jmeno]` | zkontroluje manifesty a všechny JSON soubory                                            |
| `npm run bedrock:build [jmeno]`    | sestaví add-on do `dist/<jmeno>/` (zkopíruje soubory, přeloží TypeScript na JavaScript) |
| `npm run bedrock:deploy [jmeno]`   | sestaví a nakopíruje do Minecraftu (složky `development_*_packs`)                       |
| `npm run bedrock:package [jmeno]`  | sestaví, vytvoří `.mcaddon` a katalog pro web do `web/public/addony/`                   |
| `npm run bedrock:test`             | spustí testy nástrojů (nic v Minecraftu nemění)                                         |

Bez jména se příkaz týká všech add-onů v `projects/`. Jméno add-onu je zároveň jméno složky:
malá písmena bez diakritiky, číslice, pomlčka nebo podtržítko (třeba `magicky-blok`).

Typický den v dílně:

```bash
npm run bedrock:new magicky-blok      # jen poprvé
# ... upravit JSON, textury, skripty v projects/magicky-blok/ ...
npm run bedrock:deploy magicky-blok   # a ve hře zapnout pack ve světě
npm run bedrock:package magicky-blok  # až to chceme poslat kamarádovi (.mcaddon)
```

## Jak vypadá add-on

```text
projects/magicky-blok/
├── README.md                     <- co to je (do balíčku se nedává)
├── behavior_pack/                <- chování
│   ├── manifest.json
│   ├── scripts/main.ts           <- skript, build ho přeloží na scripts/main.js
│   └── ... (blocks/, items/, recipes/, ...)
└── resource_pack/                <- vzhled
    ├── manifest.json
    └── ... (textures/, models/, texts/, ...)
```

Add-on může mít jen jeden z packů. Do buildu jde všechno kromě `scripts/` (ty přeloží esbuild
do jednoho souboru podle `entry` v manifestu), souborů `*.md` a smetí operačního systému.
Skripty můžou importovat další soubory ze `scripts/`, jen `@minecraft/*` zůstává na hře.
Typy pro skripty jsou v `projects/tsconfig.json` a `projects/bedrock.d.ts`.

## Kam co jde

- `dist/<jmeno>/behavior_pack`, `dist/<jmeno>/resource_pack` – build (Git ho ignoruje)
- `com.mojang/development_behavior_packs/<jmeno>_bp`, `.../development_resource_packs/<jmeno>_rp` – deploy.
  Do každé nasazené složky přidáme značku `.minecraft-lab.json`. Přepisujeme a mažeme **jen** složky
  s touhle značkou, cizích packů ani světů se nedotkneme.
- `web/public/addony/<jmeno>.mcaddon` + `web/public/addony/katalog.json` – balíčky pro sdílení.
  Vite tuhle složku při buildu webu vezme s sebou, takže na GitHub Pages bude
  `.../minecraft-lab/addony/katalog.json`. V katalogu je `url` relativní ke katalogu.

Kde je `com.mojang`, se bere z `bedrock.local.json` v kořeni repa (píše ho `setup/instalace-minecraft.ps1`),
jinak se zkusí známá místa na Windows. Cestu jde dát i ručně:
`npm run bedrock:deploy -- magicky-blok --cil "C:\...\com.mojang"`.

## Verze Minecraftu

V `bedrock/nastaveni.json` je cílová verze Minecraftu a k ní stabilní verze `@minecraft/server`.
Validace hlídá, že manifesty používají právě tuhle verzi a že je stejná nainstalovaná v `node_modules`.
Při přechodu na novější Minecraft změň `nastaveni.json`, verzi v `package.json`, spusť `npm install`
a opravy manifestů ti vypíše `npm run bedrock:validate`.

## Testy

`npm run bedrock:test` vytvoří dočasné add-ony v `dist/.test/` a dočasnou složku `com.mojang`,
projde celý postup (new, validate, build, deploy, package) a po sobě uklidí.
Skutečného Minecraftu se nedotkne.
