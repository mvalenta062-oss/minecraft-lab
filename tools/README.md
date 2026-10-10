# Nástroje

Sem budeme dávat pomocné skripty v Pythonu, až je budeme potřebovat
(třeba úpravy obrázků nebo generování textur).

Kontrola, build, kopírování do Minecraftu a balení add-onů jsou v Node.js
ve složce [bedrock/](../bedrock/README.md) a spouští se `npm run bedrock:...` z kořene repa.

Zatím tu žádný skript není a je to tak správně.

## Jak to spustit

Skripty jsou v Pythonu a spouští je nástroj `uv`.

```bash
cd tools
uv sync             # jen poprvé, připraví prostředí
uv run nazev.py     # spustí skript
```

Když skript potřebuje nějakou knihovnu, přidá se příkazem `uv add nazev-knihovny`.
Soubor `uv.lock` patří do Gitu, aby měli všichni stejné verze.
