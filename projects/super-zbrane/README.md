# Super zbraně

Rozšiřitelná sada zbraní pro Minecraft Bedrock. Prvním kusem je **Pirátská
bambitka** s měděnou hlavní, dřevěnou rukojetí a křesadlem. Aktuální verze: 1.0.4.
Vzhled je pixelová textura 32 × 32 v inventáři i v ruce, ne samostatný 3D model.

## Jak funguje

- Použití předmětu vystřelí jednu kompaktní ohnivou kouli. Další výstřel za
  2 sekundy; munice je zatím neomezená a bambitka se neopotřebovává.
- Koule letí rovně rychlostí 20,8 bloku/s, nejvýše 48 bloků. Voda ji uhasí.
- Náraz vyvolá výbuch silou 1,5, který zraňuje, ničí bloky a může založit oheň.
  Velikost kráteru závisí na materiálu. Zranit může i střelce poblíž zásahu.
- Živé tvory do 3 bloků od nárazu se pokusí zapálit na 5 sekund před výbuchem.
  U lovu očekáváme běžnou upečenou kořist hořících zvířat; voda, déšť a odolnost
  proti ohni ovlivňují zapálení. Výbuch či oheň může kořist také zničit.
- Zásah úplného obsidiánového rámu u otvoru aktivuje portál do Netheru místo
  výbuchu. Vnitřek musí být prázdný nebo s ohněm, široký 2–21 a vysoký 3–21
  bloků. Rohy nejsou povinné. Funguje v obou osách; v Endu se neaktivuje.

## Recept

Na pracovním stole (tečka = prázdné políčko):

```text
K M M
D M .
D . .
```

K = celé křesadlo (spotřebuje se), M = měděný ingot, D = libovolná prkna.
Výsledek je jedna bambitka. Recept se v knize receptů odemkne získáním měděného ingotu.

## Zapnutí a vyzkoušení

1. Z kořene spusť `npm run bedrock:deploy -- super-zbrane`, nebo importuj
   balíček vytvořený příkazem `npm run bedrock:package -- super-zbrane`.
2. V testovacím světě zapni chování **Super zbraně** i jeho vzhled.
   Experimenty nejsou potřeba. Po aktualizaci restartuj Minecraft kvůli textuře.
3. V kreativním inventáři hledej **Pirátská bambitka**. S povolenými příkazy
   ji lze získat přes `/give @s factory:bambitka`.
4. Pravým tlačítkem vystřel do hlíny a kmene dál od sebe. Zkontroluj náraz,
   kráter, oheň a opakovanou střelbu bez levého tlačítka. Vyzkoušej vodu.
5. V survivalu ověř recept s dubovými prkny a lov za sucha včetně kořisti.
6. Postav rám 4 × 5 bloků (otvor 2 × 3) a střel na spodní obsidián u otvoru.
   Ověř fialovou výplň i skutečný průchod do Netheru.

## Ověření a omezení

- Windows: uživatel potvrdil funkční vzhled a střelbu, po opravě nárazů
  a spouštění se vše kromě vzhledu ústí a velikosti plamenů jevilo v pořádku.
  Kompaktní částici i konečný vzhled 1.0.3 následně potvrdil ve hře.
- Recept původně nefungoval ani se správným rozložením a dubovými prkny.
  Content Log potvrdil, že hra odmítá odemčení přes kontext AlwaysUnlocked.
  Verze 1.0.4 používá běžnou podmínku získání měděného ingotu, stejným
  způsobem jako oficiální recepty a ostatní doplňky v projektu.
  Uživatel potvrdil funkční výrobu (fungovala již před touto opravou).
  Nový Content Log po nasazení 1.0.4 neobsahuje chyby receptu ani skriptu.
- Aktivace portálu, průchod a upečená kořist nejsou samostatně potvrzené ve hře.
  iPad není otestovaný. Cílové verze jsou v `bedrock/nastaveni.json`;
  skutečná nainstalovaná verze hry nebyla ověřena.
- Prošly `bedrock:validate`, `bedrock:build`, `lint` a 17 testů skriptu:
  `node --test projects/super-zbrane/strelba.test.mjs`.
  Testy používají náhradu herního rozhraní, nenahrazují test v Minecraftu.
- Záložní detekce nárazů kontroluje neprázdná políčka po 0,05 bloku,
  takže u rostlin a neúplných bloků může reagovat i na prázdnou část políčka.
- Další krok: potvrdit výrobu, portál a kořist; potom test na iPadu.

Textury a náhledy obnoví `node projects/super-zbrane/vytvor-texturu.mjs`.
`nahled-herni-textury.png` ukazuje zrcadlenou texturu používanou ve hře,
`nahled.png` běžný boční náhled a `nahled-koule.png` sprite koule.

Formáty vycházejí z dokumentace
[částic](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_appearance_billboard?view=minecraft-bedrock-stable),
[výbuchů](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/explosionoptions?view=minecraft-bedrock-stable)
a [oficiálního receptu s prkny](https://raw.githubusercontent.com/Mojang/bedrock-samples/main/behavior_pack/recipes/stick.json).

Po aktualizaci receptu znovu načti svět, vezmi měděný ingot do inventáře a
zkus původní recept s novým křesadlem a dubovými prkny. Zkontroluj Content Log,
že se už neobjevuje „invalid unlock ingredient“ u `factory:bambitka`.
