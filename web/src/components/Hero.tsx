import { Box, Button, Stack, Typography } from "@mui/material";
import { barvy } from "../theme";

const POZADI = `${import.meta.env.BASE_URL}images/pozadi-copper-age.webp`;

/** Úvodní obrázek s názvem a tlačítky */
export function Hero() {
  return (
    <Box
      sx={{
        minHeight: { xs: 380, sm: 460 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
        py: 8,
        borderBottom: `6px solid ${barvy.medTmava}`,
        background: `linear-gradient(rgba(20,22,25,0.55), rgba(30,32,35,0.85)), url(${POZADI}) center / cover no-repeat`,
      }}
    >
      <Box sx={{ maxWidth: 640 }}>
        <Typography
          sx={{
            display: "inline-block",
            fontFamily: "Pixelify Sans",
            fontSize: "0.9rem",
            letterSpacing: 1,
            textTransform: "uppercase",
            color: barvy.kamenTmavy,
            bgcolor: barvy.lampa,
            px: 1.5,
            py: 0.5,
            mb: 2,
          }}
        >
          Dílna na vlastní add-ony
        </Typography>

        <Typography
          variant="h1"
          sx={{
            fontSize: "clamp(2.6rem, 8vw, 4.5rem)",
            color: "#fff",
            textShadow: `4px 4px 0 ${barvy.medTmava}`,
            mb: 1,
          }}
        >
          Minecraft Factory
        </Typography>

        <Typography sx={{ fontSize: "1.2rem", mb: 3 }}>
          Tady vymýšlíme a vyrábíme vlastní věci do Minecraftu. Nové bloky, předměty a nápady, které ve hře ještě nikdo
          neviděl.
        </Typography>

        <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap>
          <Button variant="contained" color="primary" href="#vytvory">
            Naše výtvory
          </Button>
          <Button variant="outlined" href="#denik" sx={{ color: "text.primary", bgcolor: "background.paper" }}>
            Co je nového
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
