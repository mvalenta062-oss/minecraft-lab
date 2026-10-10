import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  id: string;
  nadpis: string;
  children: ReactNode;
}

/** Jedna sekce stránky: nadpis + obsah, oddělená čárkovanou linkou */
export function Sekce({ id, nadpis, children }: Props) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        py: 7,
        borderBottom: "2px dashed",
        borderColor: "divider",
        "&:last-of-type": { borderBottom: "none" },
        // Aby nadpis po kliknutí v menu nezůstal schovaný pod lištou
        scrollMarginTop: 72,
      }}
    >
      <Typography variant="h2" gutterBottom>
        {nadpis}
      </Typography>
      {children}
    </Box>
  );
}
