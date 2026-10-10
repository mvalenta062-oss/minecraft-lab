// Nastavení ESLintu pro celé repo: web i skripty v add-onech.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  { ignores: ["**/node_modules/", "**/dist/", "**/.venv/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Web: React
    files: ["web/src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    // Skripty v add-onech (Minecraft Script API) a jejich šablona
    files: ["projects/**/scripts/**/*.{js,ts}", "bedrock/sablona/**/*.ts"],
    languageOptions: { globals: { console: "readonly" } },
  },
  {
    // Nástroje pro add-ony (Node.js)
    files: ["bedrock/**/*.js"],
    languageOptions: { globals: globals.node },
  },
  // Prettier musí být poslední, vypíná pravidla, která by se hádala s formátováním.
  prettier,
);
