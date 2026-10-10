// ==========================================================
// Minecraft Factory – vykreslení webu
//
// Tenhle soubor vezme data z data.js a vyrobí z nich HTML.
// Data měníš v data.js, tady měníš jen to, JAK vypadají.
// ==========================================================

// Jak se stav jmenuje na webu
const NAZVY_STAVU = {
  plan: "V plánu",
  delame: "Děláme",
  hotovo: "Hotovo",
};

// Vyrobí štítek se stavem, např. <span class="stitek stitek-hotovo">Hotovo</span>
function stitek(stav) {
  return `<span class="stitek stitek-${stav}">${NAZVY_STAVU[stav] || stav}</span>`;
}

// Převede "2026-10-10" na "10. 10. 2026"
function hezkeDatum(datum) {
  const [rok, mesic, den] = datum.split("-");
  return `${Number(den)}. ${Number(mesic)}. ${rok}`;
}

// ---------- Plán ----------
function vykresliFaze() {
  const seznam = document.getElementById("seznam-fazi");
  seznam.innerHTML = FAZE.map((faze, i) => `
    <li>
      <span class="faze-cislo">${i}</span>
      <div>
        <h4>${faze.nazev}</h4>
        <p>${faze.popis}</p>
      </div>
      ${stitek(faze.stav)}
    </li>
  `).join("");
}

// ---------- Výtvory ----------
function vykresliVytvory() {
  const seznam = document.getElementById("seznam-vytvoru");
  seznam.innerHTML = PROJEKTY.map((projekt) => {
    const odkazy = [];
    if (projekt.odkazStazeni) {
      odkazy.push(`<a href="${projekt.odkazStazeni}">⬇ Stáhnout</a>`);
    }
    if (projekt.odkazZdroj) {
      odkazy.push(`<a href="${projekt.odkazZdroj}">Zdrojové soubory</a>`);
    }
    return `
      <article class="karta vytvor">
        ${stitek(projekt.stav)}
        <h4>${projekt.nazev}</h4>
        <p>${projekt.popis}</p>
        <div class="vytvor-odkazy">${odkazy.join("")}</div>
      </article>
    `;
  }).join("");
}

// ---------- Deník ----------
function vykresliDenik() {
  const seznam = document.getElementById("seznam-deniku");
  seznam.innerHTML = DENIK.map((zapis) => `
    <article class="zapis">
      <time datetime="${zapis.datum}">${hezkeDatum(zapis.datum)}</time>
      <h4>${zapis.nadpis}</h4>
      <p>${zapis.text}</p>
    </article>
  `).join("");
}

// ---------- Menu na mobilu ----------
function nastavMenu() {
  const tlacitko = document.getElementById("menu-tlacitko");
  const menu = document.getElementById("menu");

  tlacitko.addEventListener("click", () => {
    const otevrene = menu.classList.toggle("otevrene");
    tlacitko.setAttribute("aria-expanded", otevrene);
  });

  // Po kliknutí na odkaz menu zavřeme
  menu.querySelectorAll("a").forEach((odkaz) => {
    odkaz.addEventListener("click", () => {
      menu.classList.remove("otevrene");
      tlacitko.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- Start ----------
vykresliFaze();
vykresliVytvory();
vykresliDenik();
nastavMenu();
