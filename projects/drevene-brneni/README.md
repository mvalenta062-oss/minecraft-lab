# Dřevěné brnění — aktualizace 1.2.0

Dřevěný kyrys s péřovou podšívkou. Vzhled tvoří dřevěné pláty, vystouplá hruď a ramenní chrániče; na textuře už není pírko. Identifikátor `factory:drevena_kosile` a UUID obou balíčků zůstávají stejné, takže jde o aktualizaci původního doplňku. Název předmětu je nově Dřevěný kyrys.

## Recept

Stejných 7 libovolných polen a 1 slepičí pírko na pracovním stole (D = poleno, S = pírko):

```text
D D D
D S D
D · D
```

Druhy polen lze míchat, prkna recept nepřijímá. Pírko zůstává uvnitř jako podšívka, pouze se nezobrazuje.

## Ochrana při nošení na hrudi

- Přímé údery mobů a hráčů: zrušení zranění a odražení útočníka, jako dříve. Warden zůstává výjimkou.
- Šípy (`minecraft:arrow`), hozený trojzubec (`minecraft:thrown_trident`) a přímý zásah ghastovou koulí (`minecraft:fireball`): zrušení přímého zranění. Střelec se neodráží. Ostatní střely se nemění.
- Všechny výbuchy: snížení původního zranění na 50 %. Platí pro entityExplosion, blockExplosion i fireworks, tedy i TNT, nabitého creepera, ghastovu kouli a výbuch bez uvedeného původce. Nezaručuje přežití zblízka.
- Pády, oheň, láva, magie a další příčiny zůstávají původní.
- Bez běžných bodů ochrany a bez omezené životnosti. Barvení v kotlíku zůstává podporované; tónuje celý dřevěný model. Přidána součást enchantable pro hrudní brnění: běžné očarování Fire Protection může snížit zranění ohněm. Očarování řídí hra, skript jeho účinek nezdvojuje. Tato součást umožní také další běžná očarování hrudního brnění; nepřidáváme vlastní kouzla.

Ochrana mění zranění, ne zničení okolních bloků, odhození hráče ani doprovodné účinky (například efekt otráveného šípu). Tyto okrajové případy je třeba ověřit ve hře. Zapíchnuté šípy mají vlastní dočasnou dekoraci: maximálně pět na hráče, každý mizí po 20 sekundách. Šestý nahradí nejstarší. Při sundání kyrysu, smrti, odchodu nebo změně dimenze se uklidí. Dekorace nemá kolizi ani útok, po odložení oblasti se neukládá; má i záložní časovač úklidu. Skutečný šíp ani trojzubec neodstraňujeme, aby jejich speciální účinky a návrat dál řídila hra.

## Zapnutí a zkouška ve hře

Ze svého repozitáře spusť `npm run bedrock:deploy -- drevene-brneni`. Nástroj používá místní `bedrock.local.json` a přepíše pouze vlastní označené balíčky. Potom znovu načti svět, případně restartuj hru. Experimenty nejsou vyžadovány.

Ve zkušebním světě na obtížnost Snadná nebo vyšší:

1. Obleč dříve vyrobený kus, případně použij `/give @s factory:drevena_kosile`. Zkontroluj pláty, ramena a nepřítomnost pírka při chůzi, běhu a plížení; vyzkoušej široké i úzké paže skinu.
2. Zombík nemá ubrat srdíčka a má odskočit. Warden má stále zraňovat.
3. Kostlivec nemá šípem ubrat srdíčka; po sundání kyrysu má zranění opět fungovat. Porovnej i hráčův šíp a dávkovač.
4. Porovnej creepera s kyrysem a bez něj při stejném zdraví, vzdálenosti, obtížnosti a terénu. Kyrys má snížit zranění, ne ochránit okolní stavby. Nabitého creepera testuj zvlášť.
5. Ověř poloviční zranění TNT a ghastovým výbuchem, zastavení přímého zásahu ghastovy koule i hozeného trojzubce. Pád a oheň mají dál zraňovat; otrávený šíp nesmí ubrat srdíčka nárazem, ale jed má působit. Zvlášť ověř odhození a návrat očarovaného trojzubce.
6. Obarvi kyrys v kotlíku a smyj barvu čistou vodou. Ulož a znovu načti svět, ověř starý předmět i nově vyrobený kus.

7. Nech se zasáhnout alespoň šesti šípy: má být vidět nejvýš pět a každý má po 20 sekundách zmizet. Ověř chůzi, otočení, plížení, sundání kyrysu, smrt, portál, odchod a opětovné načtení světa; vyzkoušej i dva hráče současně.
8. Na očarovacím stole nebo knihou na kovadlině vyzkoušej Fire Protection a porovnej stejnou situaci s neokouzleným kyrysem. V testovacím světě lze použít i `/enchant @s fire_protection 4` s kyrysem v ruce. Kyrys zůstává nezničitelný.

## Stav a další možnosti

Původní recept a chování uživatel potvrdil ve hře 14. 10. 2026. Aktualizace 1.2.0 je připravená pro Bedrock 1.26.40 / stabilní Script API 2.10.0. Uživatel 16. 10. 2026 potvrdil vyzkoušení aktualizace v Minecraftu na Windows a spokojenost s výsledkem. Rozsah jednotlivých zkoušek nebyl upřesněn; okrajové případy z postupu výše nejsou samostatně potvrzené. Uživatel 17. 10. 2026 potvrdil funkčnost také na iPadu; rozsah jednotlivých zkoušek nebyl upřesněn. Výsledek kontrol nástroji je uveden v přiloženém souboru OVERENI.txt.

Odsouhlaseno autorem: nezničitelnost, bez vlastní ochrany proti jedu, bez základní ochrany proti ohni, běžné Fire Protection, ochrana proti trojzubci, jednotná ochrana všech výbuchů a dočasně nejvýš pět šípů. Dekorace šípů sleduje polohu a vodorovné otočení hráče; není fyzikální simulací přesného místa zásahu. Její vzhled při plavání, létání a rychlém otáčení je třeba doladit podle herního testu.

Kontroly: `npm run bedrock:validate -- drevene-brneni`, `npm run bedrock:build -- drevene-brneni`, `node --test "projects/drevene-brneni/test/*.test.js"`, `npm run lint`.

Reference: [úprava původního zranění](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityhurtbeforeevent?view=minecraft-bedrock-stable), [vlastní model vybavení](https://learn.microsoft.com/en-us/minecraft/creator/documents/attachables?view=minecraft-bedrock-stable).
