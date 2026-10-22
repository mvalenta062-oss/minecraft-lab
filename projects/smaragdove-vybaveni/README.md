# Smaragdové vybavení — 1.1.0

Autorova kompletní smaragdová sada: meč, krumpáč, sekera, lopata, motyka,
helma, kyrys, kalhoty a boty. V receptech nahrazují diamanty smaragdy. Vzhled
je zelený a vlastnosti přibližně o 10 % slabší. Diamantové vybavení zůstává.
Meč a upravený krumpáč z první verze se při rozšíření nemění.

## Vlastnosti

Všechny nástroje mají výdrž **1405 místo diamantových 1561**, tedy přibližně
−10 %. Rychlost těžení vhodných bloků u krumpáče, sekery, lopaty a motyky je
nastavená na **7 místo 8** (−12,5 %). Celé hodnoty znamenají zaokrouhlení;
nejde o přesně 10 % u každé vlastnosti ani přesně stejný rozdíl v čase těžení.

Základní zásahy bez očarování: meč 7, krumpáč 5, sekera 6, lopata 4 a motyka 4.
Krumpáč zachovává diamantovou úroveň těžby pro obsidián a odpovídající rudy.

| Brnění    | Výdrž diamant → smaragd       | Ochrana diamant → smaragd |
| --------- | ----------------------------- | ------------------------- |
| Helma     | 363 → 327                     | 3 → 3                     |
| Kyrys     | 528 → 475                     | 8 → 7                     |
| Kalhoty   | 495 → 446                     | 6 → 5                     |
| Boty      | 429 → 386                     | 3 → 3                     |
| Celá sada | každý kus zhruba −10 % výdrže | 20 → 18 bodů              |

Ochrana je celočíselná: snížení o 10 % se vztahuje na součet bodů celé sady,
ne na každý kus nebo na výsledné zranění. Helma a boty mají menší výdrž, ale
stejný počet bodů ochrany. Běžná očarování a oprava smaragdem na kovadlině jsou
podporované; jeden smaragd opraví přibližně čtvrtinu výdrže daného kusu.

## Recepty a použití

Stejné tvary jako diamantové předměty na pracovním stole, diamanty nahradit
smaragdy. Pro celou sadu potřebujete **35 smaragdů a 9 tyček**; nově přidaných
sedm předmětů spotřebuje 30 smaragdů a 6 tyček.

| Předmět | Smaragdy | Tyčky |
| ------- | -------- | ----- |
| Meč     | 2        | 1     |
| Krumpáč | 3        | 2     |
| Sekera  | 3        | 2     |
| Lopata  | 1        | 2     |
| Motyka  | 2        | 2     |
| Helma   | 5        | 0     |
| Kyrys   | 8        | 0     |
| Kalhoty | 7        | 0     |
| Boty    | 4        | 0     |

Sekera odkorňuje běžná polena a dřevo včetně netherových stonků a bambusového
bloku; zachovává směr vláken. Lopata vytvoří cestičku z běžné zeminy, motyka
obdělá hlínu, trávník nebo cestičku; hrubou hlínu nejprve změní na obyčejnou.
Nad půdou musí být vzduch a použití nesmí mířit na spodní stranu bloku.
Tyto akce fungují v přežití a kreativitě; v dobrodružném režimu skript bloky
nemění. Úspěšné použití v přežití spotřebuje bod výdrže s ohledem na Unbreaking.
Těžení a boj zajišťují herní komponenty, skript jejich opotřebení nezdvojuje.

Zatím nepřidáno: voskování/odvoskování a škrábání mědi sekerou, hašení táboráku
lopatou, speciální obsluha zakořeněné hlíny motykou. Tyto vedlejší akce zatím
nejsou součástí implementace. Rychlost těžby různých materiálů a výdrž musí
potvrdit herní test; samotné úspěšné sestavení je nezaručuje.

## Zapnutí a herní zkouška

1. Z kořene repozitáře: `npm run bedrock:deploy -- smaragdove-vybaveni`.
2. Zapněte **Smaragdové vybavení** v balíčcích chování i vzhledu. Při aktualizaci
   opusťte svět a znovu jej načtěte, případně restartujte Minecraft. Balíček je
   aktualizací původního doplňku, UUID zůstávají stejná. Experimenty nejsou potřeba.
3. V kreativním inventáři hledejte „Smaragd“: má se objevit všech devět kusů.
   Nástroje prohlédněte v ruce a oblečené brnění také pohledem třetí osoby.
   Ověřte všechny čtyři části, pohyb, úzké i široké paže skinu a očarovaný vzhled.
4. V přežití vyrobte nové předměty podle běžných diamantových receptů. Ověřte
   také původní diamantové recepty. Oblečte celou sadu: má ukazovat 18 bodů
   ochrany (9 symbolů brnění). Porovnejte se stejnou situací v diamantové sadě.
5. Sekerou vytěžte strom a pravým tlačítkem odkorňujte svislé i vodorovné poleno.
   Lopatou vytěžte hlínu a vytvořte cestičku. Motykou obdělávejte hlínu, zasaďte
   semínka a vyzkoušejte také rozbíjení listí či sena. Ověřte, že blok nad půdou
   brání obdělávání a že prkna nelze odkorňovat.
6. V přežití sledujte ubývání výdrže při práci, použití, boji a u brnění při
   zásahu. Ověřte rozbití opotřebeného kusu, opravu smaragdem, očarování včetně
   Unbreaking a zachování všeho po opětovném načtení světa.
7. Krumpáčem ověřte kámen, diamantovou i hlubinnou rudu a obsidián: mají padat
   příslušné předměty. Meč už uživatel celkově potvrdil, jeho definice se nemění.
8. Pokud předmět chybí nebo akce nefunguje, zkontrolujte Content Log (herní záznam
   chyb). Nástroje neověřují úplné herní schéma. Po opravě znovu nasaďte doplněk.

Příkazy pro testovací svět s povolenými cheaty používají `/give @s factory:<id>`:
`smaragdovy_mec`, `smaragdovy_krumpac`, `smaragdova_sekera`, `smaragdova_lopata`,
`smaragdova_motyka`, `smaragdova_helma`, `smaragdovy_kyrys`, `smaragdove_kalhoty`,
`smaragdove_boty`.

## Stav

Cíl Bedrock 1.26.40 a stabilní Script API 2.10.0 podle nastavení projektu;
konfigurace nepotvrzuje verzi nainstalované hry. Nový krátký skript obstarává
použití sekery, lopaty a motyky. Meč a krumpáč si zachovávají původní definice.

Uživatel 22. 10. 2026 potvrdil meč celkově jako funkční a schválil upravený vzhled
krumpáče včetně násady pod zelenou hlavou. Jednotlivé mechaniky krumpáče nebyly
samostatně potvrzené. Uživatel 22. 10. 2026 potvrdil, že autor rozšířený balíček
1.1.0 vyzkoušel ve hře a moc se mu líbí. První herní zkouška celé sady na Windows
tedy proběhla; rozsah jednotlivých zkoušek mechanik a nošeného brnění nebyl
upřesněn. iPad zatím neověřen.

Kontrola doplňku, sestavení, kontrola kódu, TypeScript a šest izolovaných testů
použití nových nástrojů prošly 22. 10. 2026. Textury vizuálně zkontrolovány.
Izolované testy používají napodobeninu herního rozhraní, nenahrazují herní test.
Verze 1.1.0 byla 22. 10. 2026 úspěšně nasazena do místního Minecraftu.
Další krok: podle dalšího hraní doladit případné připomínky; před sdílením
ověřit zbývající mechaniky a kompatibilitu na iPadu.

Kontroly: `npm run bedrock:validate -- smaragdove-vybaveni`,
`npm run bedrock:build -- smaragdove-vybaveni`, `npm run lint`,
`npx tsc --project projects/tsconfig.json`,
`node --test projects/smaragdove-vybaveni/test/pouziti.test.js`.

## Zdroje vzhledu a formátů

Původní meč a krumpáč mají vlastní pixelové kresby. Nové tři nástroje a čtyři ikony
brnění, textury nošeného brnění a definice připojení brnění vycházejí z oficiálních
[Mojang Bedrock Samples](https://github.com/Mojang/bedrock-samples), s přebarvením
diamantových částí do zelené. Dřevo zůstává původní. Modely a vykreslování brnění
jsou standardní herní. Podmínky: © Mojang AB, všechna práva vyhrazena;
[soubory podléhají Minecraft EULA](https://github.com/Mojang/bedrock-samples/blob/main/LICENSE.md).

Reference: [ochrana a sloty brnění](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/itemreference/examples/itemcomponents/minecraft_wearable?view=minecraft-bedrock-stable),
[vlastní komponenty](https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/custom-components?view=minecraft-bedrock-stable),
[použití předmětu](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemcustomcomponent?view=minecraft-bedrock-stable).
