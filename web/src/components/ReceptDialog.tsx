import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import type { Projekt } from "../data";

export function ReceptDialog({ projekt, zavrit }: { projekt: Projekt | null; zavrit: () => void }) {
  const recept = projekt?.recept;
  const policko = {
    width: { xs: 44, sm: 56 },
    height: { xs: 44, sm: 56 },
    display: "grid",
    placeItems: "center",
    bgcolor: "#8b8b8b",
    border: "3px solid",
    borderColor: "#373737 #fff #fff #373737",
  };
  return (
    <Dialog open={Boolean(recept)} onClose={zavrit} maxWidth="sm" fullWidth aria-labelledby="recept-nadpis">
      <DialogTitle id="recept-nadpis" sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <SvgIcon viewBox="0 0 16 16" aria-hidden="true" sx={{ flexShrink: 0 }}>
          <path fill="#68442b" d="M1 5h14v10H1z" />
          <path fill="#bc8751" d="M1 1h14v5H1z" />
          <path fill="#593b26" d="M5 1h1v5H5zm5 0h1v5h-1zM1 3h14v1H1zM3 7h2v8H3zm8 0h2v8h-2z" />
          <path fill="#d5ad72" d="M6 7h4v5H6z" />
        </SvgIcon>
        {projekt?.nazev}
      </DialogTitle>
      <DialogContent>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Pracovní stůl
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 3 }}
          alignItems="center"
          justifyContent="center"
          sx={{ bgcolor: "#c6c6c6", p: { xs: 1.5, sm: 3 }, mb: 2, border: "3px solid #555" }}
        >
          <Box
            role="group"
            aria-label="Výrobní mřížka, tři řádky a tři sloupce"
            sx={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 0.5 }}
          >
            {recept?.radky.flatMap((radek, y) =>
              [...radek].map((znak, x) => {
                const surovina = recept.suroviny[znak];
                const popisek = `Řádek ${y + 1}, sloupec ${x + 1}: ${surovina?.nazev ?? "prázdné"}`;
                return (
                  <Tooltip key={`${y}-${x}`} title={popisek}>
                    <Box tabIndex={0} role="img" aria-label={popisek} sx={policko}>
                      {surovina && (
                        <Box
                          component="img"
                          src={surovina.obrazek}
                          alt=""
                          sx={{ width: 32, height: 32, imageRendering: "pixelated" }}
                        />
                      )}
                    </Box>
                  </Tooltip>
                );
              }),
            )}
          </Box>
          <Typography
            aria-label="Vyrobí"
            sx={{ color: "#555", fontSize: { xs: 26, sm: 36 }, transform: { xs: "rotate(90deg)", sm: "none" } }}
          >
            →
          </Typography>
          <Tooltip title={`1× ${recept?.vysledek ?? ""}`}>
            <Box role="img" aria-label={`Výsledek: 1× ${recept?.vysledek ?? ""}`} sx={policko}>
              <Box
                component="img"
                src={projekt?.nahled}
                alt=""
                sx={{ width: 40, height: 40, imageRendering: "pixelated" }}
              />
            </Box>
          </Tooltip>
        </Stack>
        <Typography>{recept?.popis}</Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          V tvořivé hře najdeš výsledek receptu rovnou v inventáři. Úplný přehled vlastností najdeš na kartě výtvoru pod
          tlačítkem Podrobnosti.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={zavrit}>Zavřít</Button>
      </DialogActions>
    </Dialog>
  );
}
