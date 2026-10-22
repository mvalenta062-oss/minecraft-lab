import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import type { Projekt } from "../data";

export function PodrobnostiDialog({ projekt, zavrit }: { projekt: Projekt | null; zavrit: () => void }) {
  return (
    <Dialog open={Boolean(projekt)} onClose={zavrit} maxWidth="sm" fullWidth aria-labelledby="podrobnosti-nadpis">
      <DialogTitle id="podrobnosti-nadpis" sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <SvgIcon viewBox="0 0 16 16" aria-hidden="true" sx={{ flexShrink: 0 }}>
          <path fill="#68442b" d="M1 2h6l1 1 1-1h6v12H9l-1 1-1-1H1z" />
          <path fill="#e6d2a6" d="M2 1h4l2 2 2-2h4v11h-4l-2 1-2-1H2z" />
          <path fill="#bc8751" d="M7 3h2v10H7zM3 4h3v1H3zm0 3h3v1H3zm0 3h3v1H3zm7-6h3v1h-3zm0 3h3v1h-3zm0 3h3v1h-3z" />
        </SvgIcon>
        {projekt?.nazev}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={2} alignItems="center">
            {projekt?.nahled && (
              <Box
                component="img"
                src={projekt.nahled}
                alt={`Náhled: ${projekt.nazev}`}
                sx={{ width: 72, height: 72, flexShrink: 0, imageRendering: "pixelated", borderRadius: 1 }}
              />
            )}
            <Typography color="text.secondary">{projekt?.popis}</Typography>
          </Stack>
          {projekt?.podrobnosti?.map(({ nadpis, text, predmety }) => (
            <Box key={nadpis}>
              <Typography variant="h3" sx={{ mb: 0.75 }}>
                {nadpis}
              </Typography>
              <Typography color="text.secondary">{text}</Typography>
              {predmety && (
                <Box
                  component="ul"
                  aria-label="Přehled vybavení"
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))", sm: "repeat(5, minmax(0, 1fr))" },
                    gap: 1.5,
                    listStyle: "none",
                    p: 0,
                    mt: 2,
                    mb: 0,
                  }}
                >
                  {predmety.map(({ nazev, obrazek }) => (
                    <Box
                      component="li"
                      key={nazev}
                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.75, py: 1 }}
                    >
                      <Box
                        component="img"
                        src={obrazek}
                        alt=""
                        sx={{ width: 48, height: 48, imageRendering: "pixelated" }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                        {nazev}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={zavrit}>Zavřít</Button>
      </DialogActions>
    </Dialog>
  );
}
