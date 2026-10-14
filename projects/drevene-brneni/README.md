# Dřevěné brnění

První verze nápadu: dřevěná košile s péřovou podšívkou, dostupná už na začátku přežití i v tvořivé hře. Dřevo chrání, peří odpružuje údery.

## Recept a chování

Na pracovním stole slož 7 libovolných polen (D) a 1 slepičí pírko (S). Druhy polen lze míchat; používá se skupina `minecraft:logs` jako u táboráku. Prkna už recept nepřijímá.

```text
D D D
D S D
D · D
```

Tečka znamená prázdné políčko. Výsledkem je **Dřevěná košile s peřím** (`factory:drevena_kosile`), oblékaná místo hrudního brnění.

- Při nošení ruší zranění hráče z přímých úderů mobů i ostatních hráčů, včetně smrtících úderů. Warden je výjimka a zraňuje normálně.
- Zablokovaný úder útočníka odhodí směrem od hráče, pokud to daná entita dovoluje. Síla odražení je první návrh k vyzkoušení.
- Střely, výbuchy, oheň, pády, magie a další příčiny zranění zůstávají beze změny. Ochrana zatím rozpoznává přímý úder (`entityAttack`), nikoli každé zranění od blízké entity.
- Zatím nemá běžné body ochrany ani omezenou životnost; chrání skriptem proti uvedeným úderům. Další vlastnosti nejsou součástí zadání.
- Na postavě má dřevěný vzor a světlé peří; náhledová ikona je čistě dřevěná bez pírka. Podporuje barvení v kotlíku; po obarvení se tónuje i péřový vzor.

## Zapnutí a zkouška ve hře

Z kořene repozitáře spusť `npm run bedrock:deploy -- drevene-brneni`. Nasazení používá místní `bedrock.local.json`.

1. Vytvoř zkušební svět a zapni balíček **Dřevěné brnění** v balíčcích chování; ověř i aktivní balíček vzhledu. Experimenty nejsou vyžadovány. Pro boj zvol obtížnost Snadná nebo vyšší.
2. V tvořivé hře vyhledej košili mezi vybavením (nebo použij `/give @s factory:drevena_kosile`, pokud má svět povolené příkazy). Obleč ji a zkontroluj vzhled z pohledu třetí osoby.
3. V přežití vyrob košili z polen a pírka. Zkus také směs různých polen a ověř, že prkna recept nepřijímá. Příkazy nejsou k výrobě potřeba.
4. Nech se udeřit zombíkem: s košilí nesmějí ubýt srdíčka a zombík má odskočit. Sundej ji a porovnej další úder.
5. Ve zkušebním světě ověř, že Warden zraňuje i s košilí a neodskakuje. Ověř také šíp kostlivce a pád: před těmi košile nechrání.
6. Naplň kotlík vodou, přidej barvivo a použij na něj košili. Porovnej barvu v inventáři i po oblečení; vodou bez barviva zkus barvu smýt.
7. Ulož svět a znovu jej načti; zkontroluj zachování barvy a ochrany.

## Skutečný stav a další krok

- Cíl podle společného nastavení při vytvoření: Bedrock 1.26.40, stabilní Script API 2.10.0. Verze nainstalované hry nebyla ověřena.
- Prošla projektová validace JSON a manifestů, sestavení a kontrola TypeScriptu. Šest automatických testů s napodobeným herním API ověřilo větvení ochrany a odražení; nejde o herní test.
- Uživatel 14. 10. 2026 potvrdil ve hře funkčnost aktuálního receptu z polen i chování brnění. Jednotlivé okrajové případy, barvení a zobrazení nové ikony nebyly potvrzeny zvlášť. Aktuální balíčky prošly validací a sestavením a byly nasazeny do Minecraftu. Na iPadu neověřeno.
- Zrušení zranění nemusí zastavit doprovodné účinky útoku, například zapálení očarovanou zbraní či odhození hráče; to je potřeba vyzkoušet zvlášť.
- Další krok při další zkoušce: ověřit barvení a dosud nepotvrzené okrajové případy podle postupu výše. Další herní úpravy podle přání autora.

Kontroly: `npm run bedrock:validate -- drevene-brneni`, `npm run bedrock:build -- drevene-brneni`, `npx tsc -p projects/tsconfig.json`, `npm run lint`, `node --test projects/drevene-brneni/test/ochrana.test.js`.

Použité reference: [rušení zranění](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityhurtbeforeevent?view=minecraft-bedrock-stable), [barvitelné předměty a jejich vykreslení](https://learn.microsoft.com/en-us/minecraft/creator/documents/addcustomitems?view=minecraft-bedrock-stable), [vzor hrudního brnění Mojangu](https://github.com/Mojang/bedrock-samples/blob/main/resource_pack/attachables/leather_chestplate.json).
