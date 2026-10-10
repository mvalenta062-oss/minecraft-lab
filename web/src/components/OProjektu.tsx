import { Grid, Paper, Typography } from "@mui/material";
import { Sekce } from "./Sekce";

const PRAVIDLA = [
  { ikona: "💡", nazev: "Nápady jsou Máťovy", text: "Co vyrobíme, vymýšlí Máťa. Taťka pomáhá najít první krok." },
  { ikona: "🧱", nazev: "Malé kroky", text: "Nejdřív jeden blok. Pak textura. Pak chování. Pak něco většího." },
  {
    ikona: "🧩",
    nazev: "Chyby jsou hádanky",
    text: "Když něco nefunguje, není to průšvih. Je to hádanka, kterou vyřešíme.",
  },
  { ikona: "💾", nazev: "Ukládáme si práci", text: "Každý funkční kousek uložíme, abychom se k němu mohli vrátit." },
];

export function OProjektu() {
  return (
    <Sekce id="o-projektu" nadpis="O co jde">
      <Typography paragraph>
        Minecraft Factory je naše malá dílna. Hrát Minecraft umíme. Teď se chceme naučit, jak do něj přidat něco{" "}
        <strong>vlastního</strong>.
      </Typography>
      <Typography paragraph>
        Nebudeme se nejdřív učit teorii. Nejdřív něco vyrobíme a pak zjistíme, jak to funguje. Každé setkání by mělo
        skončit něčím, co se dá ve hře vyzkoušet.
      </Typography>

      <Typography variant="h3" sx={{ mt: 4, mb: 2 }}>
        Naše pravidla
      </Typography>
      <Grid container spacing={2.5}>
        {PRAVIDLA.map((p) => (
          <Grid key={p.nazev} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2.5, height: "100%" }}>
              <Typography aria-hidden sx={{ fontSize: "2rem", lineHeight: 1 }}>
                {p.ikona}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, mb: 0.5 }}>
                {p.nazev}
              </Typography>
              <Typography>{p.text}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Sekce>
  );
}
