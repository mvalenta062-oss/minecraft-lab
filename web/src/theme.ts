import { createTheme } from "@mui/material/styles";

// Barvy jsou laděné podle "copper age" (měď, zoxidovaná měď,
// tmavý kámen a teplé světlo lamp), ale trochu tlumenější.
export const barvy = {
  kamenTmavy: "#1e2023",
  kamen: "#2b2e33",
  kamenSvetly: "#3a3e45",
  med: "#b86f4a",
  medTmava: "#8f5236",
  patina: "#5c9c82",
  patinaTmava: "#3f7560",
  lampa: "#e0b45a",
  text: "#ece6dc",
  textTlumeny: "#a9a39a",
};

const pismoNadpis = '"Pixelify Sans", "Trebuchet MS", sans-serif';
const pismoText = '"Nunito", "Segoe UI", system-ui, sans-serif';

// "Pixelový" stín, který používají karty a tlačítka
export const pixelStin = "4px 4px 0 rgba(0, 0, 0, 0.35)";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: barvy.med, dark: barvy.medTmava, contrastText: "#fff" },
    secondary: { main: barvy.patina, dark: barvy.patinaTmava },
    warning: { main: barvy.lampa },
    background: { default: barvy.kamenTmavy, paper: barvy.kamen },
    text: { primary: barvy.text, secondary: barvy.textTlumeny },
    divider: barvy.kamenSvetly,
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: pismoText,
    fontSize: 16,
    h1: { fontFamily: pismoNadpis, fontWeight: 700 },
    h2: { fontFamily: pismoNadpis, fontWeight: 700, fontSize: "2rem", color: barvy.lampa },
    h3: { fontFamily: pismoNadpis, fontWeight: 700, fontSize: "1.4rem", color: barvy.patina },
    h4: { fontFamily: pismoNadpis, fontWeight: 700, fontSize: "1.15rem" },
    body1: { fontSize: "1.1rem", lineHeight: 1.6 },
    button: { fontFamily: pismoNadpis, textTransform: "none", fontSize: "1.05rem" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `3px solid ${barvy.kamenSvetly}`,
          boxShadow: pixelStin,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          border: `3px solid ${barvy.kamenSvetly}`,
          boxShadow: pixelStin,
          padding: "8px 22px",
          "&:active": { transform: "translate(2px, 2px)", boxShadow: "2px 2px 0 rgba(0,0,0,0.4)" },
        },
        containedPrimary: { borderColor: barvy.medTmava },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: pismoNadpis, fontWeight: 700, borderRadius: 0, height: 26 },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: { color: barvy.patina, "&:hover": { color: barvy.lampa } },
      },
    },
  },
});
