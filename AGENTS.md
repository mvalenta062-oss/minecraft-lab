# Pokyny pro asistenty — Minecraft Factory

Tyto pokyny platí pro celý repozitář a pro všechny jeho add-ony. Jsou společné
pro Codex, Claude Code a další asistenty pracující s projektovými soubory.

## Kontext a způsob spolupráce

- Minecraft Factory je dílna, ve které syn Máťa tvoří s pomocí taťky Martina
  vlastní doplňky pro Minecraft Bedrock Edition na Windows. Chceme je pokud
  možno sdílet také s kamarády na iPadech.
- Komunikuj česky, jednoduše a prakticky. Technické pojmy krátce vysvětli,
  pokud jsou potřeba. Při práci se synem vysvětluj změny po malých krocích.
- Nápady patří autorovi. Pomoz jeho nápad převést na nejmenší funkční verzi;
  chybějící herní vlastnosti si nevymýšlej jako hotové zadání.
- Cílem je něco zábavného, co lze vidět a vyzkoušet ve hře. Teorii vysvětluj
  v souvislosti s tím, co právě vytváříme. Nepřidávej zbytečnou infrastrukturu.
- Nevymýšlej historii práce ani výsledky testů. Rozlišuj připravené soubory,
  úspěšnou kontrolu nástroji a skutečné ověření v Minecraftu.

## Jak načíst kontext

- Na začátku práce přečti `README.md` a `PROJECT.md` v kořeni repozitáře.
  `PROJECT.md` obsahuje společný plán a principy dílny; neopisuj je do každého
  add-onu.
- Při práci na doplňku přečti také `bedrock/README.md`, jeho
  `projects/<nazev>/README.md` a případné místní instrukce.
- Cílové verze čti z `bedrock/nastaveni.json` a závislosti z `package.json`.
  Konkrétní verze neukládej do těchto pokynů. Konfigurace projektu sama
  nepotvrzuje verzi skutečně nainstalované hry.
- Když potřebný údaj chybí, nejprve prohledej příslušné projektové soubory.
  Ptej se jen na informace, které jsou pro další krok skutečně potřeba.

## Kde uchovávat výtvory a jejich stav

- Každý add-on patří do vlastní složky `projects/<nazev>/`. Používej existující
  nástroje projektu pro jeho založení, kontrolu, sestavení a balení.
- Jeho `README.md` udržuj jako stručný kontext pro další práci: nápad a zamýšlené
  chování, postup zapnutí a vyzkoušení, aktuální stav, známé potíže a další krok.
  Zaznamenej také potřebné nastavení světa, pokud je doplněk vyžaduje.
- Po významné změně tento popis aktualizuj podle skutečného výsledku. U testování
  výslovně uveď, co prošlo nástroji a co už bylo ověřeno ve hře.
- Zdrojové soubory add-onů upravuj v `projects/`, nikoli ve vygenerovaném `dist/` nebo
  v kopiích nainstalovaných do Minecraftu.
- Projektový web a deník jsou v `web/`; obsah se spravuje hlavně v
  `web/src/data.ts`. Aktualizuj je, pokud je to součást zadání.

## Práce s Minecraftem a ověřování

- Vyvíjíme Bedrock add-ony. Formáty a API ověřuj vůči cílovým verzím projektu;
  nepoužívej návody pro Java Edition jako náhradu.
- U vlastních bloků ověř i změny formátu komponent pro jejich `format_version`.
  Duhová hlína se nenačetla kvůli starému zápisu
  `"tag:minecraft:is_shovel_item_destructible": {}`. Pro moderní formát použij
  `"minecraft:tags": ["minecraft:is_shovel_item_destructible"]`; požadavek ověř
  v [poznámkách ke změně formátu](https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.26.20?view=minecraft-bedrock-stable).
  Úspěšné `bedrock:validate`, build ani deploy nezaručují, že hra přijme všechny
  komponenty: kontrola nástrojů není úplná validace herního schématu.
- Pokud je balíček aktivní, ale blok chybí v inventáři, zkontroluj definici bloku
  a případné chyby v herním Content Log (záznam chyb obsahu). Nezapínej experimenty
  ani vývojářský režim bez konkrétního požadavku použité funkce. Po opravě znovu
  nasaď doplněk a načti svět; podle potřeby restartuj hru. Deploy aktualizuje
  původní balíček, nepřidává další položku do seznamu.
- Před předáním změny spusť odpovídající kontrolu. Pro doplněk používej
  `npm run bedrock:validate -- <nazev>` a podle změny také
  `npm run bedrock:build -- <nazev>`. Pro změny nástrojů použij
  `npm run bedrock:test`; kontrolu kódu provádí `npm run lint`.
- Při nasazení používej existující `bedrock:deploy` a místní konfiguraci
  `bedrock.local.json`. Zachovej ochranu, která dovoluje přepisovat pouze
  balíčky označené nástroji tohoto projektu.
- Neupravuj ani nemaž cizí balíčky a herní světy. Pokud je nutná změna světa,
  nejprve s uživatelem domluv její rozsah a zálohu.
- Připrav krátký konkrétní postup, podle kterého lze výsledek vyzkoušet ve hře.
  Kompatibilitu s iPadem označ jako ověřenou až po skutečném testu.

## Balíčky a ukládání práce

- Závislosti instaluj pouze přes nastavenou gateway. Neobcházej ji pomocí
  `--registry`, vlastní `.npmrc`, `--index-url` ani instalací přes pip mimo uv.
- Při chybě `403` nebo `quarantined` neobcházej blokaci. Hledej vhodnou jinou
  verzi či alternativu; pokud řešení není, informuj Martina.
- Před úpravami zkontroluj stav Gitu a zachovej rozpracované změny uživatele.
  Do commitu zahrnuj pouze soubory patřící k danému úkolu.
- Do Gitu nepřidávej místní cesty, přihlašovací údaje ani osobní údaje dítěte.
  Účty a zveřejňování spravuje rodič. Publikuj jen v rámci uživatelova zadání.
- Pokud se v repozitáři objeví `sources/` se synchronizovanými podklady původního
  projektu ChatGPT, používej je pouze ke čtení: neupravuj je, nepřejmenovávej,
  nepřesouvej ani nemaž.
