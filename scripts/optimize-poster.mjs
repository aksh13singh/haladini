// Compress the hero poster to a lean JPEG so it loads fast on mobile.
// Run: node scripts/optimize-poster.mjs
import sharp from "sharp";

const info = await sharp("public/hero-poster.png")
  .resize({ width: 1920, withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("public/hero-poster.jpg");

console.log(
  `hero-poster.jpg -> ${(info.size / 1024).toFixed(0)} KB  (${info.width}x${info.height})`
);
