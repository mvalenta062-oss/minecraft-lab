// Malá pixelová textura: duhové pruhy s barevnými zrníčky hlíny.
// Spuštění z kořene: node projects/duhova-hlina/vytvor-texturu.mjs
import fs from "node:fs";
import { Buffer } from "node:buffer";
import { URL } from "node:url";
import { deflateSync } from "node:zlib";

const barvy = [
  [207, 67, 76],
  [226, 126, 57],
  [222, 190, 69],
  [87, 166, 77],
  [65, 148, 190],
  [84, 91, 178],
  [157, 79, 172],
];
function pixel(x, y) {
  const barva = barvy[Math.floor((y * barvy.length) / 16)];
  const zrno = (x * 31 + y * 17 + x * y * 13) % 23;
  const odstin = zrno < 5 ? 0.62 : zrno < 10 ? 1.18 : 0.9;
  return [...barva.map((v) => Math.min(255, Math.round(v * odstin))), 255];
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
function png(size) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  const rows = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      rows.set(pixel(Math.floor((x * 16) / size), Math.floor((y * 16) / size)), y * (1 + size * 4) + 1 + x * 4);
    }
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
const slozka = new URL("./resource_pack/textures/blocks/", import.meta.url);
fs.mkdirSync(slozka, { recursive: true });
fs.writeFileSync(new URL("duhova_hlina.png", slozka), png(16));
fs.writeFileSync(new URL("./nahled.png", import.meta.url), png(256));
for (const pack of ["behavior_pack", "resource_pack"]) {
  fs.writeFileSync(new URL(`./${pack}/pack_icon.png`, import.meta.url), png(256));
}
