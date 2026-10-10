# {{NAZEV}}

**Stav:** rozpracováno

Add-on založený příkazem `npm run bedrock:new {{ID}}`. Tady napiš, co to je a jak to funguje.

## Co tu je

- `behavior_pack/` – chování: co věci ve hře dělají (JSON, skripty ve `scripts/`)
- `resource_pack/` – vzhled: textury, modely, zvuky, názvy

## Jak to vyzkoušet ve hře

Z kořene repa:

```bash
npm run bedrock:deploy {{ID}}
```

Potom v Minecraftu: nový svět → Behavior Packs → Moje packy → zapnout `{{NAZEV}}`.
