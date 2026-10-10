import { Box, Link, Typography } from "@mui/material";

export function Paticka() {
  return (
    <Box component="footer" sx={{ textAlign: "center", px: 2, py: 4, borderTop: "4px solid", borderColor: "divider" }}>
      <Typography color="text.secondary">
        Minecraft Factory · zdrojové soubory jsou na{" "}
        <Link href="https://github.com/mvalenta062-oss/minecraft-lab">GitHubu</Link>.
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: "0.85rem", mt: 1 }}>
        Postaveno z Reactu a MUI. Minecraft je ochranná známka Mojang / Microsoft, tenhle web je jen fanouškovský
        projekt.
      </Typography>
    </Box>
  );
}
