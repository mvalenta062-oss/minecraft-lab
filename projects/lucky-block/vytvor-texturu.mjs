import fs from "node:fs";
import { Buffer } from "node:buffer";
import { URL } from "node:url";
import { deflateSync } from "node:zlib";
const glyph = ["011110", "110011", "000011", "000110", "001100", "001100", "000000", "001100", "001100"];
function pixel(x, y, question) {
  const edge = x === 0 || y === 0 || x === 15 || y === 15;
  const white = question && x >= 5 && x < 11 && y >= 3 && y < 12 && glyph[y - 3][x - 5] === "1";
  return white
    ? [255, 255, 245, 255]
    : edge
      ? [150, 91, 12, 255]
      : x === 1 || y === 1
        ? [255, 234, 125, 255]
        : [239, 182 + ((x * 3 + y * 7) % 18), 35, 255];
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
  const body = Buffer.concat([Buffer.from(type), data]),
    len = Buffer.alloc(4),
    crc = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function png(size, question) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  const rows = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      rows.set(
        pixel(Math.floor((x * 16) / size), Math.floor((y * 16) / size), question),
        y * (1 + size * 4) + 1 + x * 4,
      );
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
const base = new URL("./", import.meta.url);
for (const [file, size, q] of [
  ["resource_pack/textures/blocks/lucky_block.png", 16, true],
  ["resource_pack/textures/blocks/lucky_blank.png", 16, false],
  ["nahled.png", 256, true],
  ["behavior_pack/pack_icon.png", 256, true],
  ["resource_pack/pack_icon.png", 256, true],
]) {
  const url = new URL(file, base);
  fs.mkdirSync(new URL(".", url), { recursive: true });
  fs.writeFileSync(url, png(size, q));
}
