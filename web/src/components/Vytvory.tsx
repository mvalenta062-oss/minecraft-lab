import { Box, Grid, Link, Paper, Stack, Typography } from "@mui/material";
import { PROJEKTY } from "../data";
import { Sekce } from "./Sekce";
import { StavChip } from "./StavChip";
import { barvy } from "../theme";

export function Vytvory() {
  return (
    <Sekce id="vytvory" nadpis="Výtvory">
      <Typography paragraph>
        Naše vlastní add-ony do Minecraft Bedrock. Stáhněte balíček, otevřete ho v Minecraftu a zapněte ho v nastavení
        světa.
      </Typography>

      <Grid container spacing={2.5}>
        {PROJEKTY.map((p) => (
          <Grid key={p.nazev} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column" }}>
              <Stack direction="row" sx={{ mb: 1.5 }}>
                <StavChip stav={p.stav} />
              </Stack>
              {p.nahled && (
                <Box sx={{ mb: 2 }}>
                  <Box
                    component="img"
                    src={p.nahled}
                    alt={`Náhled textury: ${p.nazev}`}
                    sx={{ width: 128, height: 128, imageRendering: "pixelated", borderRadius: 1 }}
                  />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Náhled textury
                  </Typography>
                </Box>
              )}
              <Typography variant="h4" sx={{ color: barvy.lampa }}>
                {p.nazev}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                {p.popis}
              </Typography>
              {p.navod && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {p.navod}
                </Typography>
              )}
              <Stack direction="row" spacing={2} sx={{ mt: 2, fontWeight: 700 }}>
                {p.odkazStazeni && <Link href={p.odkazStazeni}>⬇ Stáhnout</Link>}
                {p.odkazZdroj && <Link href={p.odkazZdroj}>Zdrojové soubory</Link>}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Sekce>
  );
}
