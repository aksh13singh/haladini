/**
 * Compresses the category/banner images in public/categories.
 *
 * Banner photos are full-bleed but sit under a dark scrim, so a 2000px-wide
 * progressive JPEG at q80 is visually identical while a fraction of the size.
 * PNGs (poor for photos) are converted to JPEG. Everything is normalised to
 * `.jpeg`. Re-runnable: `node scripts/optimize-category-images.mjs`.
 *
 * After running, make sure any `.png` paths in lib/site-config.ts point to the
 * new `.jpeg` files.
 */
import sharp from "sharp";
import { readdir, stat, unlink, rename } from "node:fs/promises";
import path from "node:path";

const DIR = path.resolve("public/categories");
const MAX_WIDTH = 2000;
const QUALITY = 80;

const files = (await readdir(DIR)).filter((f) =>
  [".jpg", ".jpeg", ".png"].includes(path.extname(f).toLowerCase())
);

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const src = path.join(DIR, file);
  const tmp = path.join(DIR, `${base}.__opt.jpg`);
  const final = path.join(DIR, `${base}.jpeg`);

  const before = (await stat(src)).size;
  await sharp(src)
    .rotate() // honour EXIF orientation
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toFile(tmp);
  const after = (await stat(tmp)).size;

  await unlink(src);
  await rename(tmp, final);

  totalBefore += before;
  totalAfter += after;
  console.log(
    `${file.padEnd(24)} ${(before / 1e6).toFixed(2)}MB -> ${(after / 1e6).toFixed(2)}MB` +
      (file !== `${base}.jpeg` ? `  (→ ${base}.jpeg)` : "")
  );
}

console.log(
  `\nTotal: ${(totalBefore / 1e6).toFixed(1)}MB -> ${(totalAfter / 1e6).toFixed(1)}MB ` +
    `(${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`
);
