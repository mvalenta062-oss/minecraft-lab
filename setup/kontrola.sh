#!/usr/bin/env bash
# Rychlá kontrola na Linuxu: Node.js + npm přes gateway, uv přes gateway.
# Spuštění:  bash setup/kontrola.sh
NPM_GATEWAY="https://npm.shieldoo-gate.cloudfield.cz/"
chyby=0
ok()    { printf '  \033[32m[OK]\033[0m %s\n' "$1"; }
chyba() { printf '  \033[31m[!!]\033[0m %s\n' "$1"; chyby=$((chyby+1)); }
je()    { command -v "$1" >/dev/null 2>&1; }

echo; echo "npm"
if je node; then ok "node $(node --version), npm $(npm --version)"; else chyba "node není nainstalovaný"; fi
if je npm; then
  reg=$(npm config get registry)
  [ "$reg" = "$NPM_GATEWAY" ] && ok "npm registry = gateway" || chyba "npm registry je '$reg', má být '$NPM_GATEWAY'"
  [ -n "${SGW_AUTH:-}" ] && ok "proměnná SGW_AUTH je nastavená" || chyba "chybí proměnná SGW_AUTH"
  if v=$(npm view vite version 2>/dev/null) && [ -n "$v" ]; then ok "gateway odpovídá (vite $v)"; else chyba "npm se přes gateway nedostalo (špatný token?)"; fi
fi

echo; echo "Python (uv)"
if je uv; then ok "$(uv --version)"; else chyba "uv není nainstalované"; fi
for n in UV_INDEX_SHIELDOO_USERNAME UV_INDEX_SHIELDOO_PASSWORD; do
  [ -n "${!n:-}" ] && ok "proměnná $n je nastavená" || chyba "chybí proměnná $n"
done
tools="$(dirname "$0")/../tools"
if je uv && [ -f "$tools/pyproject.toml" ]; then
  if (cd "$tools" && uv pip install --dry-run requests >/dev/null 2>&1); then ok "gateway odpovídá (uv dry-run v tools/)"
  else chyba "uv se přes gateway nedostalo (spusť nejdřív 'uv sync' v tools/, nebo je špatný token)"; fi
fi

echo
if [ "$chyby" -eq 0 ]; then printf '\033[32mVše je nastavené.\033[0m\n'; else printf '\033[33mProblémů: %s.\033[0m\n' "$chyby"; fi
