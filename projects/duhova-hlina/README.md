# Duhová hlína

**Stav:** podle potvrzení uživatele funguje v Minecraftu na Windows i na iPadu.

Stavební kostička s duhovými proužky a barevnými skvrnkami jako hlína.
Stejná textura 16 × 16 pixelů je na všech šesti stranách. Je v kreativním inventáři
v kategorii Příroda; nemá recept ani přirozené generování ve světě.

## Co tu je

- `behavior_pack/` – vlastnosti bloku a kořist při rozbití; bez herních skriptů
- `resource_pack/` – vzhled: textury, modely, zvuky, názvy

## Jak to vyzkoušet ve hře

Z kořene repa:

```bash
npm run bedrock:deploy duhova-hlina
```

Alternativa: `npm run bedrock:package -- duhova-hlina` vytvoří
`web/public/addony/duhova-hlina.mcaddon`. Otevři ho v Minecraftu a počkej na import.

1. Vytvoř nový testovací svět v kreativním režimu. Zapni balíček chování **Duhová hlína**
   a ověř, že je aktivní také jeho balíček vzhledu. Experimenty nejsou potřeba.
2. V inventáři vyhledej **Duhová hlína** (v angličtině **Rainbow Dirt**).
3. Polož několik kostek, prohlédni je z boku, shora i zespodu a zkus je rozbít.
4. Pokud hledání nepomůže, se zapnutými příkazy použij
   `/give @s factory:duhova_hlina 64`.

## Ověření a známá omezení

- Při prvním pokusu blok nebyl nalezen v inventáři. Opraven starší zápis `tag:`
  na `minecraft:tags`, který vyžaduje cílová verze. Po novém nasazení uživatel
  potvrdil, že doplněk ve hře funguje správně.
- Kontrola `bedrock:validate`, sestavení `bedrock:build`, balení `bedrock:package`
  a kontrola kódu `lint` prošly. Kontrola doplňku je bez varování.
- Cílová verze je v `bedrock/nastaveni.json`; skutečná verze hry nebyla ověřena.
- Minecraft na Windows i na iPadu: funkčnost potvrzena uživatelem (iPad potvrzen 14. 10. 2026).
- První verze napodobuje hlínu jako pevný stavební blok se zvukem hlíny a základní
  odolností. Při těžbě mimo kreativní režim má vracet sama sebe.
- Nepřebírá automaticky zarůstání trávou, obdělávání motykou, změnu na pěšinu
  ani sázení rostlin. Tyto vlastnosti nejsou součástí první verze.
- Další krok: další úpravy podle přání autora.

`nahled.png` je zvětšený náhled textury, nikoli snímek ze hry. Texturu a náhled lze
znovu vytvořit pomocí `node projects/duhova-hlina/vytvor-texturu.mjs` bez nových závislostí.

Formát bloku vychází ze stabilních komponent v
[dokumentaci Bedrock](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/blockreference/examples/blockcomponents/minecraftblock_material_instances?view=minecraft-bedrock-stable).
