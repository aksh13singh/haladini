// Generate on-brand block-print "swatch" placeholder images for each sample
// product (so the store looks alive before real photos exist). Each is a
// gradient + a repeating floral block-print pattern, with a small per-product
// hue shift for variety. Replace any file in /public/products with a real photo
// (keep the slug filename) to upgrade a product.
//
// Run: node scripts/make-product-placeholders.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const W = 800;
const H = 1000;

// category -> gradient + motif colour
const styles = {
  bedsheets: { c1: "#FAD4E0", c2: "#F48FB1", motif: "#B23A66", opacity: 0.22 },
  cushions: { c1: "#F58BAC", c2: "#B2546F", motif: "#FFFFFF", opacity: 0.2 },
  suits: { c1: "#EC6F9E", c2: "#7A2E45", motif: "#FFFFFF", opacity: 0.18 },
  shirts: { c1: "#9A4760", c2: "#5F2335", motif: "#FFE3EC", opacity: 0.16 },
};

// product slug -> category, plus per-item hue offset for subtle variety
const products = [
  ["gulbagh-block-print-bedsheet", "bedsheets", -12],
  ["jaipur-indigo-cotton-bedsheet", "bedsheets", 8],
  ["bagru-floral-king-bedsheet", "bedsheets", -4],
  ["sanganeri-blush-bedsheet", "bedsheets", 14],
  ["marigold-block-print-cushion-cover", "cushions", -10],
  ["rosewood-mughal-cushion-cover", "cushions", 6],
  ["bagru-stripe-cushion-cover", "cushions", -4],
  ["lotus-pond-cushion-cover", "cushions", 12],
  ["anarkali-block-print-suit-set", "suits", -8],
  ["gulmohar-cotton-suit-set", "suits", 10],
  ["indigo-bagru-suit-set", "suits", -16],
  ["rose-sanganeri-suit-set", "suits", 6],
  ["bagru-block-print-shirt", "shirts", -6],
  ["indigo-hand-block-shirt", "shirts", -16],
  ["sanganeri-floral-shirt", "shirts", 10],
  ["pista-green-block-shirt", "shirts", 4],
];

const flower = (color) => {
  let petals = "";
  for (let i = 0; i < 8; i++) {
    petals += `<ellipse cx="0" cy="-26" rx="9" ry="22" fill="${color}" transform="rotate(${i * 45})"/>`;
  }
  return `${petals}<circle r="10" fill="${color}"/>`;
};

const motifGrid = (color, opacity) => {
  const step = 160;
  let cells = "";
  let row = 0;
  for (let y = step / 2; y < H + step; y += step, row++) {
    const startX = row % 2 ? step : step / 2;
    for (let x = startX; x < W + step; x += step) {
      cells += `<g transform="translate(${x},${y}) scale(0.52)">${flower(color)}</g>`;
    }
  }
  return `<g opacity="${opacity}">${cells}</g>`;
};

const svgFor = (style, grad) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="${grad.x1}" y1="${grad.y1}" x2="${grad.x2}" y2="${grad.y2}">
      <stop offset="0" stop-color="${style.c1}"/>
      <stop offset="1" stop-color="${style.c2}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  ${motifGrid(style.motif, style.opacity)}
</svg>`;

// 3 variants per product (main + 2) so the gallery shows distinct thumbnails.
const variants = [
  { suffix: "", hue: 0, grad: { x1: 0, y1: 0, x2: 1, y2: 1 } },
  { suffix: "-2", hue: 22, grad: { x1: 1, y1: 0, x2: 0, y2: 1 } },
  { suffix: "-3", hue: -18, grad: { x1: 0, y1: 0, x2: 0, y2: 1 } },
];

mkdirSync("public/products", { recursive: true });

let count = 0;
for (const [slug, category, hue] of products) {
  for (const v of variants) {
    const svg = Buffer.from(svgFor(styles[category], v.grad));
    await sharp(svg)
      .modulate({ hue: hue + v.hue })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(`public/products/${slug}${v.suffix}.jpg`);
    count++;
  }
}

console.log(`Generated ${count} product placeholders in public/products/`);
