import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Web běží na GitHub Pages jako "project site", proto musí být base
// nastavený na název repozitáře. Build dělá GitHub Action (viz .github/workflows).
export default defineConfig({
  plugins: [react()],
  base: "/minecraft-lab/",
});
