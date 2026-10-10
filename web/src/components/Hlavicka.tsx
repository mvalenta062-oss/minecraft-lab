import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { barvy } from "../theme";

const ODKAZY = [
  { text: "O co jde", cil: "#o-projektu" },
  { text: "Kdo to dělá", cil: "#autori" },
  { text: "Plán", cil: "#plan" },
  { text: "Výtvory", cil: "#vytvory" },
  { text: "Deník", cil: "#denik" },
];

/** Horní lišta s logem a menu. Na mobilu se menu schová do šuplíku. */
export function Hlavicka() {
  const [otevreno, setOtevreno] = useState(false);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "rgba(30, 32, 35, 0.95)", borderBottom: `4px solid ${barvy.kamenSvetly}` }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Box
          aria-hidden
          sx={{
            width: 22,
            height: 22,
            bgcolor: barvy.patina,
            boxShadow: `inset -5px -5px 0 ${barvy.patinaTmava}, inset 5px 5px 0 rgba(255,255,255,0.15)`,
          }}
        />
        <Typography
          component="a"
          href="#"
          sx={{ fontFamily: "Pixelify Sans", fontSize: "1.3rem", color: "text.primary", textDecoration: "none", flexGrow: 1 }}
        >
          Minecraft Factory
        </Typography>

        {/* Menu pro širší obrazovky */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
          {ODKAZY.map((o) => (
            <Button
              key={o.cil}
              href={o.cil}
              sx={{ color: "text.primary", border: "none", boxShadow: "none", fontFamily: "Nunito", fontWeight: 700 }}
            >
              {o.text}
            </Button>
          ))}
        </Box>

        {/* Tlačítko menu pro mobil */}
        <IconButton
          aria-label="Otevřít menu"
          onClick={() => setOtevreno(true)}
          sx={{ display: { xs: "inline-flex", sm: "none" }, color: "text.primary", fontSize: "1.4rem" }}
        >
          ☰
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={otevreno} onClose={() => setOtevreno(false)}>
        <List sx={{ width: 220 }}>
          {ODKAZY.map((o) => (
            <ListItemButton key={o.cil} component="a" href={o.cil} onClick={() => setOtevreno(false)}>
              <ListItemText primary={o.text} slotProps={{ primary: { fontWeight: 700 } }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
