import { Box, Stack, Typography } from "@mui/material";
import { FAZE } from "../data";
import { Sekce } from "./Sekce";
import { StavChip } from "./StavChip";
import { barvy } from "../theme";

export function Plan() {
  return (
    <Sekce id="plan" nadpis="Plán">
      <Typography paragraph>
        Takhle to máme rozmyšlené. Není to pevný rozvrh, u zajímavé věci klidně zůstaneme déle.
      </Typography>

      <Stack component="ol" sx={{ listStyle: "none", p: 0, m: 0, mt: 3 }}>
        {FAZE.map((faze, i) => (
          <Box
            component="li"
            key={faze.nazev}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "44px 1fr", sm: "56px 1fr auto" },
              gap: 2,
              alignItems: "start",
              py: 2,
              borderTop: "2px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Pixelify Sans",
                fontSize: "1.6rem",
                color: barvy.med,
                textAlign: "center",
                lineHeight: 1,
              }}
            >
              {i}
            </Typography>
            <div>
              <Typography variant="h4" sx={{ mb: 0.5 }}>
                {faze.nazev}
              </Typography>
              <Typography color="text.secondary">{faze.popis}</Typography>
            </div>
            <Box sx={{ gridColumn: { xs: 2, sm: "auto" } }}>
              <StavChip stav={faze.stav} />
            </Box>
          </Box>
        ))}
      </Stack>
    </Sekce>
  );
}
