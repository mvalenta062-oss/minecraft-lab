import { Avatar, Grid, Paper, Stack, Typography } from "@mui/material";
import { Sekce } from "./Sekce";
import { barvy } from "../theme";

const OBRAZKY = `${import.meta.env.BASE_URL}images/`;

const AUTORI = [
  {
    jmeno: "Máťa",
    role: "Tvůrce a vynálezce · 9 let",
    text: "Hráč Minecraftu, který má hlavu plnou nápadů. Vybírá, co se bude vyrábět.",
    obrazek: "avatar-mata.webp",
    alt: "Avatar Máti: kluk s diamantovým mečem",
  },
  {
    jmeno: "Taťka Martin",
    role: "Pomocník a průvodce",
    text: "Připravuje nástroje, pomáhá s problémy a hlídá, aby to nebylo moc těžké.",
    obrazek: "avatar-tata.webp",
    alt: "Avatar taťky: čaroděj s kouzelnou holí",
  },
];

export function Autori() {
  return (
    <Sekce id="autori" nadpis="Kdo to dělá">
      <Grid container spacing={2.5}>
        {AUTORI.map((a) => (
          <Grid key={a.jmeno} size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ p: 2.5, height: "100%" }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2.5}
                alignItems="center"
                textAlign={{ xs: "center", md: "left" }}
              >
                <Avatar
                  src={OBRAZKY + a.obrazek}
                  alt={a.alt}
                  sx={{
                    width: 140,
                    height: 140,
                    border: `4px solid ${barvy.patinaTmava}`,
                    // Lehké zvětšení schová černé rohy původního obrázku
                    "& img": { transform: "scale(1.04)" },
                  }}
                />
                <div>
                  <Typography variant="h3" sx={{ mt: 0, color: barvy.lampa }}>
                    {a.jmeno}
                  </Typography>
                  <Typography sx={{ color: barvy.patina, fontWeight: 700, mb: 1 }}>{a.role}</Typography>
                  <Typography>{a.text}</Typography>
                </div>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Sekce>
  );
}
