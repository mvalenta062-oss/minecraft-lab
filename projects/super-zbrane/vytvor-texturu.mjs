// Pixelová pirátská bambitka, bez dalších závislostí.
import fs from "node:fs";
import { Buffer } from "node:buffer";
import { URL } from "node:url";
import { deflateSync } from "node:zlib";
const VELIKOST = 32;
const barvy = {
  obrys: [39, 27, 26, 255],
  drevo: [119, 62, 34, 255],
  svetleDrevo: [181, 107, 52, 255],
  ryha: [82, 42, 27, 255],
  med: [183, 85, 44, 255],
  svetlaMed: [246, 163, 91, 255],
  stinMedi: [118, 53, 34, 255],
  kov: [91, 100, 111, 255],
  svetlyKov: [195, 207, 211, 255],
  zlato: [219, 171, 66, 255],
};
// Vrstvy polygonů: krátká široká hlaveň, zvonovité ústí, pažba a lučík.
const vrstvy = [
  [
    "obrys",
    [
      [8, 13],
      [23, 7],
      [25, 4],
      [28, 5],
      [30, 15],
      [28, 18],
      [23, 15],
      [13, 19],
      [9, 18],
    ],
  ],
  [
    "med",
    [
      [9, 14],
      [24, 8],
      [26, 5],
      [28, 7],
      [29, 15],
      [28, 16],
      [23, 13],
      [12, 18],
    ],
  ],
  [
    "svetlaMed",
    [
      [10, 13],
      [24, 8],
      [26, 5],
      [27, 7],
      [25, 10],
      [11, 16],
    ],
  ],
  [
    "stinMedi",
    [
      [12, 17],
      [24, 12],
      [28, 15],
      [28, 17],
      [23, 15],
      [13, 19],
    ],
  ],
  [
    "kov",
    [
      [20, 9],
      [22, 8],
      [24, 14],
      [22, 15],
    ],
  ],
  [
    "svetlyKov",
    [
      [20, 9],
      [21, 9],
      [23, 14],
      [22, 14],
    ],
  ],
  [
    "obrys",
    [
      [7, 14],
      [12, 14],
      [14, 18],
      [11, 21],
      [9, 27],
      [5, 29],
      [2, 27],
      [3, 23],
      [6, 19],
    ],
  ],
  [
    "drevo",
    [
      [7, 16],
      [11, 16],
      [12, 18],
      [9, 21],
      [7, 26],
      [5, 27],
      [4, 26],
      [5, 22],
      [7, 19],
    ],
  ],
  [
    "svetleDrevo",
    [
      [7, 16],
      [9, 16],
      [9, 19],
      [7, 22],
      [6, 26],
      [4, 26],
      [5, 22],
      [7, 19],
    ],
  ],
  [
    "ryha",
    [
      [8, 20],
      [9, 20],
      [7, 26],
      [6, 26],
    ],
  ],
  [
    "zlato",
    [
      [3, 26],
      [5, 27],
      [8, 26],
      [8, 28],
      [5, 29],
      [2, 27],
    ],
  ],
  [
    "obrys",
    [
      [10, 18],
      [17, 16],
      [19, 18],
      [18, 22],
      [14, 24],
      [10, 23],
      [9, 21],
    ],
  ],
  [
    "zlato",
    [
      [11, 19],
      [17, 17],
      [18, 19],
      [17, 21],
      [14, 23],
      [11, 22],
      [10, 21],
    ],
  ],
  [
    "obrys",
    [
      [12, 19],
      [16, 18],
      [17, 19],
      [16, 21],
      [13, 22],
      [11, 21],
    ],
  ],
  [
    "svetlyKov",
    [
      [13, 18],
      [14, 18],
      [14, 20],
      [13, 21],
      [12, 20],
    ],
  ],
  [
    "kov",
    [
      [9, 14],
      [13, 13],
      [15, 16],
      [12, 18],
      [9, 17],
    ],
  ],
  [
    "svetlyKov",
    [
      [10, 14],
      [12, 14],
      [13, 15],
      [10, 16],
    ],
  ],
  [
    "obrys",
    [
      [10, 13],
      [9, 10],
      [10, 7],
      [13, 7],
      [14, 9],
      [12, 10],
      [13, 13],
    ],
  ],
  [
    "kov",
    [
      [10, 10],
      [11, 8],
      [13, 8],
      [12, 9],
      [11, 10],
      [12, 13],
      [11, 13],
    ],
  ],
  [
    "svetlyKov",
    [
      [11, 8],
      [13, 8],
      [12, 9],
      [11, 9],
    ],
  ],
  [
    "zlato",
    [
      [10, 16],
      [11, 16],
      [11, 17],
      [10, 17],
    ],
  ],
];
function uvnitr(x, y, body) {
  let ano = false;
  for (let i = 0, j = body.length - 1; i < body.length; j = i++) {
    const [ax, ay] = body[i],
      [bx, by] = body[j];
    if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) ano = !ano;
  }
  return ano;
}
function pixel(x, y) {
  let barva = [0, 0, 0, 0];
  for (const [nazev, body] of vrstvy) if (uvnitr(x + 0.5, y + 0.5, body)) barva = barvy[nazev];
  // Čelní obruč je skutečná uzavřená elipsa, nikoli několik překrytých hran.
  const dx = x + 0.5 - 28;
  const dy = y + 0.5 - 10.5;
  // Dlouhá osa ústí je kolmá k ose hlavně, nikoli svislá vůči obrázku.
  const u = dx * 0.955 - dy * 0.296;
  const v = dx * 0.296 + dy * 0.955;
  const elipsa = (rx, ry) => (u / rx) ** 2 + (v / ry) ** 2 <= 1;
  if (elipsa(1.8, 7)) {
    barva = barvy.obrys;
    if (elipsa(1.2, 6.1)) barva = u < 0 ? barvy.svetlaMed : barvy.med;
    // Boční pohled: žádný černý otvor na boku hlavně, jen úzký kovový lem.
  }
  return barva;
}
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type), data]);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}
function png(size, zrcadlit = false, kresli = pixel) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  const rows = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      rows.set(
        kresli(
          zrcadlit ? VELIKOST - 1 - Math.floor((x * VELIKOST) / size) : Math.floor((x * VELIKOST) / size),
          Math.floor((y * VELIKOST) / size),
        ),
        y * (1 + size * 4) + 1 + x * 4,
      );
    }
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
const slozka = new URL("./resource_pack/textures/items/", import.meta.url);
fs.mkdirSync(slozka, { recursive: true });
fs.writeFileSync(new URL("bambitka.png", slozka), png(VELIKOST, true));
fs.writeFileSync(new URL("./nahled.png", import.meta.url), png(256));
fs.writeFileSync(new URL("./nahled-herni-textury.png", import.meta.url), png(256, true));
for (const pack of ["behavior_pack", "resource_pack"])
  fs.writeFileSync(new URL(`./${pack}/pack_icon.png`, import.meta.url), png(256));

// Kompaktní žhavá koule, plně průhledné pozadí.
const castice = new URL("./resource_pack/textures/particle/", import.meta.url);
fs.mkdirSync(castice, { recursive: true });
function koule(x, y) {
  const px = Math.floor(x / 2) * 2 + 1,
    py = Math.floor(y / 2) * 2 + 1;
  const r = Math.hypot(px - 16, py - 16);
  if (r > 14) return [0, 0, 0, 0];
  if (r > 11) return [211, 54, 15, 255];
  if (r > 8) return [255, 126, 16, 255];
  if (Math.hypot(px - 14, py - 13) > 5) return [255, 207, 47, 255];
  return [255, 249, 177, 255];
}
fs.writeFileSync(new URL("ohniva_koule.png", castice), png(32, false, koule));
fs.writeFileSync(new URL("./nahled-koule.png", import.meta.url), png(256, false, koule));
