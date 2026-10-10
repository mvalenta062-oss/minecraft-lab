# Nástroje

Sem budeme dávat pomocné skripty, až je budeme potřebovat.
Například:

- kontrolu, že JSON soubory v add-onu nemají chybu,
- zabalení add-onu do souboru `.mcaddon`,
- zkopírování add-onu do Minecraftu na notebooku.

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
