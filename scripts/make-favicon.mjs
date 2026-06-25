// Extract just the gold peacock from the logo and build favicon assets:
//   app/icon.png       (256x256)  — browser tab favicon
//   app/apple-icon.png (180x180)  — iOS home-screen icon
// The peacock is placed on a flamingo-pink rounded tile.
//
// Run: node scripts/make-favicon.mjs
import sharp from "sharp";

const SRC = "assets/haladini-logo-source.jpg";

const { data, info } = await sharp(SRC)
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const N = W * H;

// Peacock pixels = artwork (not the pink field) that is NOT magenta lettering.
//   background pink ... r-b ≈ 53-56
//   magenta letters .... r-g ≈ 148-182
//   gold/brown peacock . r-b > 72 AND r-g < 110
const idx = (i) => i * C;
const isPeacock = (i) => {
  const o = idx(i);
  const r = data[o],
    g = data[o + 1],
    b = data[o + 2];
  return r - b > 72 && r - g < 110;
};

// build mask + connected components, keep the big ones (drop specks)
const lab = new Int32Array(N);
let next = 0;
const comps = [];
const st = [];
for (let s = 0; s < N; s++) {
  if (!isPeacock(s) || lab[s]) continue;
  next++;
  let area = 0,
    minx = W,
    miny = H,
    maxx = 0,
    maxy = 0;
  lab[s] = next;
  st.push(s);
  while (st.length) {
    const i = st.pop();
    const x = i % W;
    const y = (i - x) / W;
    area++;
    if (x < minx) minx = x;
    if (x > maxx) maxx = x;
    if (y < miny) miny = y;
    if (y > maxy) maxy = y;
    for (let dy = -1; dy <= 1; dy++) {
      const ny = y + dy;
      if (ny < 0 || ny >= H) continue;
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        if (nx < 0 || nx >= W) continue;
        const ni = ny * W + nx;
        if (!lab[ni] && isPeacock(ni)) {
          lab[ni] = next;
          st.push(ni);
        }
      }
    }
  }
  comps.push({ label: next, area, minx, miny, maxx, maxy });
}

comps.sort((a, b) => b.area - a.area);
console.log(
  "Peacock component areas:",
  comps.slice(0, 8).map((c) => c.area)
);
// Keep components within the main peacock's vertical/horizontal span.
const main = comps[0];
const keep = new Set([main.label]);
for (const c of comps.slice(1)) {
  if (
    c.area >= 200 &&
    c.minx >= main.minx - 40 &&
    c.maxx <= main.maxx + 40 &&
    c.miny >= main.miny - 40 &&
    c.maxy <= main.maxy + 40
  )
    keep.add(c.label);
}

let minX = W,
  minY = H,
  maxX = 0,
  maxY = 0;
const rgba = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const on = keep.has(lab[i]);
  const o = idx(i);
  const d = i * 4;
  rgba[d] = data[o];
  rgba[d + 1] = data[o + 1];
  rgba[d + 2] = data[o + 2];
  rgba[d + 3] = on ? 255 : 0;
  if (on) {
    const x = i % W;
    const y = (i - x) / W;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

const cw = maxX - minX + 1;
const ch = maxY - minY + 1;
const crop = Buffer.alloc(cw * ch * 4);
for (let y = 0; y < ch; y++) {
  for (let x = 0; x < cw; x++) {
    const si = ((y + minY) * W + (x + minX)) * 4;
    const di = (y * cw + x) * 4;
    crop[di] = rgba[si];
    crop[di + 1] = rgba[si + 1];
    crop[di + 2] = rgba[si + 2];
    crop[di + 3] = rgba[si + 3];
  }
}
const peacockPng = await sharp(crop, {
  raw: { width: cw, height: ch, channels: 4 },
})
  .png()
  .toBuffer();
console.log(`Peacock cropped to ${cw}x${ch}`);

// Compose just the peacock, centered on a transparent square (no tile).
const tile = async (size, out) => {
  const inner = Math.round(size * 0.92);
  const bird = await sharp(peacockPng)
    .resize({ height: inner, fit: "inside" })
    .toBuffer();
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: bird, gravity: "center" }])
    .png()
    .toFile(out);
  console.log(`Wrote ${out} (${size}x${size}, transparent)`);
};

await tile(256, "app/icon.png");
await tile(180, "app/apple-icon.png");
