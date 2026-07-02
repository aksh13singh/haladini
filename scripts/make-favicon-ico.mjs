/**
 * Builds app/favicon.ico from the peacock icon (app/icon.png).
 *
 * Google's favicon crawler (and many older clients) request /favicon.ico at
 * the domain root; Next.js only serves it if app/favicon.ico exists. This
 * packs 16/32/48px PNGs into a single .ico container (PNG-compressed ICO
 * entries are valid since Windows Vista and accepted by Google).
 *
 * Run: node scripts/make-favicon-ico.mjs
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SRC = "app/icon.png";
const OUT = "app/favicon.ico";
const SIZES = [16, 32, 48];

const pngs = await Promise.all(
  SIZES.map((s) =>
    sharp(SRC).resize(s, s, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  )
);

// ICO container: ICONDIR (6B) + ICONDIRENTRY (16B × n) + image data.
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(SIZES.length, 4);

const entries = [];
let offset = 6 + 16 * SIZES.length;
for (let i = 0; i < SIZES.length; i++) {
  const e = Buffer.alloc(16);
  e.writeUInt8(SIZES[i] === 256 ? 0 : SIZES[i], 0); // width
  e.writeUInt8(SIZES[i] === 256 ? 0 : SIZES[i], 1); // height
  e.writeUInt8(0, 2); // palette
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // color planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8); // data size
  e.writeUInt32LE(offset, 12); // data offset
  entries.push(e);
  offset += pngs[i].length;
}

await writeFile(OUT, Buffer.concat([header, ...entries, ...pngs]));
console.log(
  `${OUT} written (${SIZES.join("/")}px, ${Buffer.concat([header, ...entries, ...pngs]).length} bytes)`
);
