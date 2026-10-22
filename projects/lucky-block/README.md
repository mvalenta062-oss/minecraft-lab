# Lucky block

Zlatá krabička s bílými otazníky podle autorova nápadu. Hráč si ji vezme
v creativu, položí ji a v survivalu do ní udeří nebo ji začne těžit.
Otazníky blikají a přibližně za 3 sekundy krabička zmizí se zvukem a částicemi.
Nepoužívá skutečnou explozi: nezraňuje a neničí okolní bloky.

## Náhodné odměny

Každé otevření vylosuje **3–7 různých druhů věcí** i jejich množství.
Na přání autora vybírá ze všech typů předmětů registrovaných ve hře,
včetně bloků v podobě předmětu, nástrojů, brnění, vajíček a předmětů
z aktivních doplňků. Vynechává pouze vzduch a při chybě přeskočí předmět,
který hra nedokáže vytvořit. Může padnout i další Lucky block nebo technický
předmět; výběr není omezený na survivalové zásoby. Druhy mají stejnou šanci.
Losuje 1–16 kusů, nejvýše však limit jedné hromádky daného předmětu
(například meč vždy jeden). Očarování a další varianty dat se zvlášť nelosují.
Seznam se načítá přímo ze hry přes ItemTypes.getAll().
Krabička se automaticky při vstupu do světa nerozdává, bere se z creativu.
Recept zatím není součástí zadání.

## Jak vyzkoušet

1. Z kořene spusť `npm run bedrock:deploy -- lucky-block`.
2. V nastavení zkušebního světa aktivuj chování i vzhled **Lucky block**.
   Experimenty nejsou potřeba. Pro přepnutí režimu příkazem povol cheaty.
3. V creativu vyhledej **Lucky block** ve stavebních blocích a vezmi několik kusů.
4. Polož je na zem a přepni svět do survivalu (případně `/gamemode survival`).
5. Udeř do jedné krabičky. Ověř blikání otazníků a otevření přibližně za 3 sekundy.
6. Stůj vedle ní: nesmí tě zranit ani udělat kráter. Sesbírej odměny.
7. Otevři několik dalších: počet druhů, jejich výběr a množství se mají měnit.
   Opakované údery do běžící krabičky nesmějí odměny zdvojit ani restartovat čas.
8. Zkus dvě krabičky současně a odchod ze světa během blikání.
   Fáze je uložená v bloku; po načtení oblasti odpočet pokračuje.

## Stav a další krok

Připravené zdroje, pixelové textury, miniatura a skript pro cílovou verzi
z `bedrock/nastaveni.json`. Validace, build, TypeScript a lint prošly.
Uživatel při testu v Minecraftu potvrdil vzhled a fungování krabičky podle
představ. Dne 17. 10. 2026 potvrdil také úspěšný test rozšířeného losování
z celého herního seznamu: „funguje úplně skvěle“. Původní opakování druhů
z malé nabídky je tím vyřešené. Kontroly a simulace aktuálního skriptu
mimo Minecraft rovněž prošly. Dne 22. 10. 2026 uživatel potvrdil také
úspěšné vyzkoušení balíčku na iPadu; rozsah jednotlivých zkoušek nebyl upřesněn.

První funkční verze je ověřená uživatelem na Windows i na iPadu. Další krok
jsou případné úpravy podle dalšího hraní. Samostatné okrajové scénáře z postupu výše
(například odchod během odpočtu) uživatel výslovně nepotvrdil.
Při pomalejším běhu hry může odpočet trvat déle; v nenačtené oblasti stojí.
Pokud blok chybí, zkontroluj Content Log.

Textury lze obnovit příkazem `node projects/lucky-block/vytvor-texturu.mjs`.
