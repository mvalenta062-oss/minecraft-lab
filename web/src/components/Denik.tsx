import { Box, Typography } from "@mui/material";
import { DENIK } from "../data";
import { Sekce } from "./Sekce";
import { barvy } from "../theme";

/** Převede "2026-10-10" na "10. 10. 2026" */
function hezkeDatum(datum: string) {
  const [rok, mesic, den] = datum.split("-");
  return `${Number(den)}. ${Number(mesic)}. ${rok}`;
}

export function Denik() {
  return (
    <Sekce id="denik" nadpis="Deník">
      <Typography paragraph>Krátké zápisky o tom, co jsme kdy udělali. Nejnovější nahoře.</Typography>

      <Box sx={{ mt: 3 }}>
        {DENIK.map((z) => (
          <Box
            component="article"
            key={z.datum + z.nadpis}
            sx={{
              position: "relative",
              pl: 3.5,
              pb: 3.5,
              borderLeft: "4px solid",
              borderColor: "divider",
              // Měděná "kostka" na časové ose
              "&::before": {
                content: '""',
                position: "absolute",
                left: -10,
                top: 6,
                width: 16,
                height: 16,
                bgcolor: barvy.med,
                boxShadow: `inset -4px -4px 0 ${barvy.medTmava}`,
              },
            }}
          >
            <Typography component="time" dateTime={z.datum} sx={{ fontFamily: "Pixelify Sans", color: barvy.patina }}>
              {hezkeDatum(z.datum)}
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5, mb: 0.5 }}>
              {z.nadpis}
            </Typography>
            {z.text.split(/\n\s*\n/).map((odstavec, index) => (
              <Typography key={index} sx={{ mb: 1.5 }}>
                {odstavec.split(/(\*\*.*?\*\*|`.*?`)/g).map((cast, castIndex) => {
                  if (cast.startsWith("**") && cast.endsWith("**")) {
                    return <strong key={castIndex}>{cast.slice(2, -2)}</strong>;
                  }
                  if (cast.startsWith("`") && cast.endsWith("`")) {
                    return <code key={castIndex}>{cast.slice(1, -1)}</code>;
                  }
                  return cast;
                })}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    </Sekce>
  );
}
