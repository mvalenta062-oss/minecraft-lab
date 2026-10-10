# Minecraft Factory

> Malá vývojářská dílna pro vlastní Minecraft Bedrock add-ony. Hlavním motorem projektu je fantazie, experimentování a radost z výsledku.

## 1. Výchozí stav

- **Tvůrce:** začínající mladý vývojář, který Minecraft zná jako hráč, ale s vývojem a programováním teprve začíná.
- **Průvodce:** rodič se zkušenostmi s vývojem softwaru, který připravuje prostředí, pomáhá řešit problémy a hlídá přiměřenou obtížnost.
- **Platforma:** Minecraft **Bedrock Edition** na Windows 11; výtvory by měly být pokud možno použitelné i na iPadech kamarádů.
- **Hardware:** samostatný notebook s Windows 11, myší a běžným vývojářským vybavením.
- **Režim práce:** společné kratší bloky přibližně 1–2 hodiny; důležitější než tempo je viditelný výsledek.
- **Přístup:** nezačínáme výukou teorie. Nejdřív něco vytvoříme, potom postupně zjišťujeme, jak a proč to funguje.

## 2. Cíl

Vytvořit prostředí, ve kterém může dítě **samostatně vymýšlet vlastní věci do Minecraftu**, s pomocí je realizovat a postupně získávat praktické základy:

- práce se soubory, editorem a jednoduchou grafikou / 3D modely;
- strukturovaných dat (JSON), podmínek, událostí a později JavaScriptu / TypeScriptu;
- ladění, testování a postupného vylepšování;
- verzování v Gitu a základů sdílení vlastních projektů;
- rozumného používání AI jako pomocníka při tvorbě, ne jako náhrady vlastních nápadů.

**Měřítko úspěchu:** vznikají hratelné výtvory, na které je autor hrdý a chce je dál rozvíjet. Dokončený kurz ani množství napsaného kódu nejsou cílem.

## 3. Principy práce

1. **Nápady patří autorovi.** Dospělý nenavrhuje, co přesně má dítě vytvořit; pomáhá najít uskutečnitelný první krok.
2. **Malé funkční iterace.** Každé setkání by ideálně mělo skončit něčím, co lze vidět nebo vyzkoušet ve hře.
3. **Od jednoduchého ke složitému.** Model či textura → konfigurace → herní chování → skripty.
4. **Experimentování je součást vývoje.** Chyby řešíme jako hádanky, ne jako neúspěch.
5. **Zachováváme výsledky.** Průběžné commity, verze a krátké poznámky umožní vracet se k funkčnímu stavu.
6. **Bez zbytečné infrastruktury.** Nástroje a procesy přidáváme teprve tehdy, když mají jasný přínos.

## 4. Fáze projektu

| Fáze | Co uděláme | Výsledek |
| --- | --- | --- |
| **0. Připravit dílnu** | Nastavit Windows, Minecraft Bedrock, editor, nástroje a repozitář. Ověřit jednoduchý testovací add-on. | Funkční prostředí a záloha výchozího stavu. |
| **1. První vlastní výtvor** | Autor vybere nápad. Vytvoříme první jednoduchý blok, předmět nebo jinou drobnou úpravu. | Něco vlastního přímo ve hře. |
| **2. Vzhled a vlastnosti** | Upravíme textury či modely a základní vlastnosti pomocí JSON. | Výtvor dostává vlastní identitu a chování. |
| **3. Herní mechaniky** | Přidáme recepty, interakce, efekty a jednoduchá pravidla. | Výtvor je zajímavý i při hraní. |
| **4. První programování** | Podle potřeby využijeme Bedrock Script API a JavaScript / TypeScript. | Vlastní logika přesahující jednoduchou konfiguraci. |
| **5. Sdílení a vydání** | Otestujeme kompatibilitu, připravíme `.mcaddon`, vytvoříme verzi a nabídneme ji kamarádům. | První veřejně či soukromě sdílený add-on. |
| **6. Další rozvoj** | Nové schopnosti, větší projekty, opravy a další vydání. | Dlouhodobě rostoucí sbírka výtvorů. |

Fáze nejsou pevný školní plán. Můžeme se vracet, přeskakovat nebo zůstat u jedné zajímavé věci déle.

## 5. Nástroje

| Nástroj | K čemu slouží | Kdy ho potřebujeme |
| --- | --- | --- |
| **Minecraft Bedrock (Windows)** | Spouštění a testování výtvorů. | Od začátku. |
| **Visual Studio Code** | Úpravy JSON, skriptů a souborů projektu. | Od začátku. |
| **Blockbench** | Tvorba modelů a textur; případně průvodci pro Bedrock. | Podle prvního nápadu. |
| **Git + GitHub** | Historie změn, zálohování zdrojových souborů a vydání. | Od začátku, obsluhu zpočátku řeší rodič. |
| **Node.js + npm** | Nástroje pro JavaScript / TypeScript a případné build skripty. | Až při skriptování nebo automatizaci. |
| **Bedrock Script API** | Pokročilejší herní logika a interakce. | V pozdější fázi. |
| **GitHub Pages** | Jednoduchý projektový web / deník výtvorů. | Až budeme mít co ukazovat. |
| **GitHub Releases** | Distribuce verzovaných balíčků `.mcaddon`. | Při prvním sdílení. |
| **AI asistent** | Vysvětlení, hledání chyb, návrhy malých kroků a pomoc s kódem. | Pod vedením rodiče, podle potřeby. |

**Poznámka:** Zaměřujeme se na Bedrock add-ony, nikoli na Java Edition modifikace. Formáty, API a kompatibilitu ověřujeme vůči používané verzi Minecraftu.

## 6. Typický pracovní cyklus

1. **Nápad:** Co chceme, aby se ve hře stalo?
2. **Nejmenší funkční verze:** Co je úplně první věc, kterou dokážeme zprovoznit?
3. **Tvorba:** Model, textura, JSON nebo skript.
4. **Test ve hře:** Funguje to? Jak poznáme, že to funguje správně?
5. **Vylepšení:** Co bychom změnili v další verzi?
6. **Uložení:** Commit, případně screenshot a krátká poznámka do deníku.

## 7. Sdílení a kompatibilita

Primárně vyvíjíme na Windows, ale chceme umožnit hraní také kamarádům na **iPadech** s Minecraft Bedrock.

- Preferujeme standardní Bedrock resource packy a behavior packy.
- Pro sdílení lze připravit balíček **`.mcaddon`**; podle typu obsahu může být vhodný také **`.mcworld`**.
- Kompatibilitu s iPadOS a konkrétní verzí Minecraftu vždy ověříme praktickým testem.
- Při zveřejnění chráníme soukromí dítěte. Účty, publikování a přístupová oprávnění spravuje rodič.

## 8. První milníky

- [ ] Minecraft Bedrock běží na notebooku.
- [ ] Funguje editor a základní nástroje.
- [ ] Zprovozníme technický testovací add-on.
- [ ] Vytvoříme zálohu funkčního systému (golden image).
- [ ] Autor vybere svůj první skutečný projekt.
- [ ] První vlastní výtvor funguje ve hře.
- [ ] První vylepšení je uložené v Gitu.
- [ ] První balíček funguje na jiném zařízení.
- [ ] První vydání může vyzkoušet kamarád.

## 9. Co zatím neřešíme

Složitou architekturu, automatizované CI/CD, velké frameworky, monetizaci, vlastní server ani pravidelné publikování videí. To všechno může přijít později, pokud o to bude zájem a projekt k tomu přirozeně doroste.

---

**Hlavní pravidlo Minecraft Factory:** Nejdřív vytvořit něco zábavného. Technologii se naučíme cestou.
