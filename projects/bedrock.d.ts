// Globální věci, které Minecraft skriptům dává, ale balíček @minecraft/server je nepopisuje.
// Soubor čte VS Code i build (projects/tsconfig.json).
declare const console: {
  log(...zpravy: unknown[]): void;
  info(...zpravy: unknown[]): void;
  warn(...zpravy: unknown[]): void;
  error(...zpravy: unknown[]): void;
};
