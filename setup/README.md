# Nastavení nového počítače (Windows 11)

Dva skripty, které nainstalují vše potřebné a nastaví gateway.
Stačí je spustit a vložit token. Každý jde spustit i víckrát, co už je, přeskočí.

| Skript | Co udělá |
| --- | --- |
| `instalace-node.ps1` | Git, Node.js LTS, `~/.npmrc` na gateway, přihlášení do proměnné `SGW_AUTH`, zkouška |
| `instalace-python.ps1` | uv, Python 3.13, proměnné `UV_INDEX_SHIELDOO_*`, zkouška v `tools/` |
| `kontrola.ps1` | rychlá kontrola, že je vše nastavené (`kontrola.sh` je totéž pro Linux) |

## Postup

1. Stáhni repo (zip z GitHubu nebo `git clone`, když už Git máš).
2. Otevři PowerShell ve složce `setup` (v Průzkumníku pravé tlačítko → *Otevřít v Terminálu*).
3. Spusť:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\instalace-node.ps1
   powershell -ExecutionPolicy Bypass -File .\instalace-python.ps1
   ```

4. Když se skript zeptá, vlož token od taťky. Při psaní se nic nezobrazuje, to je správně.
   Jméno projektu na gateway je napevno `mv-minecraft`.
   Winget si může říct o potvrzení správce, klikni *Ano*.
5. Zavři a znovu otevři PowerShell a spusť kontrolu:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\kontrola.ps1
   ```

Token jde zadat i rovnou jako parametr `-Token "..."`,
ale pak zůstane v historii PowerShellu, takže radši nech skript zeptat se.

## VS Code

Nainstaluj [VS Code](https://code.visualstudio.com/) a otevři v něm celou složku repa.
VS Code sám nabídne doporučená rozšíření (vpravo dole *Install All*), seznam je
v `.vscode/extensions.json`: podpora Bedrock add-onů, ESLint, Prettier, Python a Pylance.
Když nabídka zmizí, najdeš je v Rozšířeních (Ctrl+Shift+X) po zadání `@recommended`.

## Kde co je po instalaci

- `%USERPROFILE%\.npmrc` – npm registry = gateway, přihlášení bere z proměnné `SGW_AUTH` (base64 z `mv-minecraft:token`)
- proměnné prostředí uživatele: `SGW_AUTH`, `UV_INDEX_SHIELDOO_USERNAME`, `UV_INDEX_SHIELDOO_PASSWORD`
  (Nastavení → Systém → Upřesnit → Proměnné prostředí)

## Výměna tokenu

Spusť oba skripty znovu a vlož nový token. Vše ostatní přeskočí.
