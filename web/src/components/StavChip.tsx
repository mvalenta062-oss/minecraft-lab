import { Chip } from "@mui/material";
import { NAZVY_STAVU, type Stav } from "../data";
import { barvy } from "../theme";

const BARVA_STAVU: Record<Stav, string> = {
  hotovo: barvy.patina,
  delame: barvy.lampa,
  plan: barvy.textTlumeny,
};

/** Malý štítek "V plánu / Děláme / Hotovo" */
export function StavChip({ stav }: { stav: Stav }) {
  return (
    <Chip
      label={NAZVY_STAVU[stav]}
      size="small"
      sx={{ bgcolor: BARVA_STAVU[stav], color: barvy.kamenTmavy }}
    />
  );
}
