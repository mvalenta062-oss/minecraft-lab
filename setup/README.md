# Nastavení nového počítače (Windows 11)

Tři skripty, které nainstalují vše potřebné, nastaví gateway a připraví Minecraft.
Stačí je spustit a vložit token. Každý jde spustit i víckrát, co už je, přeskočí.

| Skript                    | Co udělá                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `instalace-node.ps1`      | Git, Node.js LTS, `~/.npmrc` na gateway, přihlášení do proměnné `SGW_AUTH`, zkouška                                                |
| `instalace-python.ps1`    | uv, Python 3.13, proměnné `UV_INDEX_SHIELDOO_*`, zkouška v `tools/`                                                                |
| `instalace-minecraft.ps1` | najde datovou složku Minecraft Bedrock (`com.mojang`), založí v ní složky pro vývoj add-onů a cestu zapíše do `bedrock.local.json` |
| `kontrola.ps1`            | rychlá kontrola, že je vše nastavené (`kontrola.sh` je totéž pro Linux)                                                            |

## Postup

1. Stáhni repo (zip z GitHubu nebo `git clone`, když už Git máš).
2. Otevři PowerShell ve složce `setup` (v Průzkumníku pravé tlačítko → _Otevřít v Terminálu_).
3. Spusť:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\instalace-node.ps1
   powershell -ExecutionPolicy Bypass -File .\instalace-python.ps1
   powershell -ExecutionPolicy Bypass -File .\instalace-minecraft.ps1
   ```

4. Když se skript zeptá, vlož token od taťky. Při psaní se nic nezobrazuje, to je správně.
   Jméno projektu na gateway je napevno `mv-minecraft`.
   Winget si může říct o potvrzení správce, klikni _Ano_.
5. Zavři a znovu otevři PowerShell a spusť kontrolu:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\kontrola.ps1
   ```

Minecraft musí být nainstalovaný z Microsoft Store a aspoň jednou spuštěný (až do hlavního menu),
jinak ještě nemá datovou složku a skript to řekne. Minecraft nic nemění, jen založí dvě složky
a nalezenou cestu zapíše do `bedrock.local.json` v kořeni repa (odtud ji bere `npm run bedrock:deploy`).
Když Minecraft ukládá data jinam, dá se cesta zadat: `-Cesta "...\com.mojang"`.

Token jde zadat i rovnou jako parametr `-Token "..."`,
ale pak zůstane v historii PowerShellu, takže radši nech skript zeptat se.

## VS Code

Nainstaluj [VS Code](https://code.visualstudio.com/) a otevři v něm celou složku repa.
VS Code sám nabídne doporučená rozšíření (vpravo dole _Install All_), seznam je
v `.vscode/extensions.json`: podpora Bedrock add-onů, ESLint, Prettier, Python a Pylance.
Když nabídka zmizí, najdeš je v Rozšířeních (Ctrl+Shift+X) po zadání `@recommended`.

### Konce řádků (jen jednou po prvním stažení na Windows)

Soubory v repu mají konce řádků LF (`.gitattributes` to vynucuje). Pokud bylo repo staženo
dřív, než tam tohle pravidlo bylo, Git na Windows má soubory s CRLF a po `npm run format`
hlásí změny v půlce repa. Srovná se to jednou v PowerShellu v kořeni repa:

```powershell
git pull
git rm --cached -r . ; git reset --hard
```

Nebo prostě složku smaž a repo stáhni znovu.

## Kde co je po instalaci

- `%USERPROFILE%\.npmrc` – npm registry = gateway, přihlášení bere z proměnné `SGW_AUTH` (base64 z `mv-minecraft:token`)
- proměnné prostředí uživatele: `SGW_AUTH`, `UV_INDEX_SHIELDOO_USERNAME`, `UV_INDEX_SHIELDOO_PASSWORD`
  (Nastavení → Systém → Upřesnit → Proměnné prostředí)
- data Minecraftu: `%APPDATA%\Minecraft Bedrock\Users\Shared\games\com.mojang` (nový Minecraft od 1.21.120),
  starší verze `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang`.
  Uvnitř jsou `development_behavior_packs` a `development_resource_packs`, kam `npm run bedrock:deploy` kopíruje naše add-ony.
- `bedrock.local.json` v kořeni repa: `{ "comMojang": "C:\\...\\com.mojang" }`, jen pro tenhle počítač, Git ho ignoruje

## Výměna tokenu

Spusť oba skripty znovu a vlož nový token. Vše ostatní přeskočí.
