// Remove the pink background from the Haladini logo and trim it tightly.
// Strategy: classify each pixel as foreground (magenta lettering / gold-brown
// peacock) or background (light pink field), then flood-fill the background
// starting from the image borders — so light detail *inside* the letters is
// preserved (it isn't connected to the border). Finally erode + feather the
// edge to kill the pink halo, trim to the artwork, and pad slightly.
//
// Run: node scripts/remove-logo-bg.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "assets/haladini-logo-source.jpg";
const OUT = "public/haladini-logo.png";

// Calibrated from sampled pixels:
//   background pink ........ r-b ≈ 53-56,  r-g ≈ 85-106
//   magenta lettering ...... r-b ≈ 91-105, r-g ≈ 148-182
//   gold/brown peacock ..... r-b ≈ 82-115
// r-b cleanly separates the saturated artwork from the washed pink field.
const isForeground = (r, g, b) => {
  return r - b > 72 || r - g > 125;
};

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;

// ---- flood fill background from the borders ----
const visited = new Uint8Array(N);
const bg = new Uint8Array(N);
const stack = [];
const fgAt = (i) => {
  const o = i * 4;
  return isForeground(data[o], data[o + 1], data[o + 2]);
};
const seed = (i) => {
  if (!visited[i] && !fgAt(i)) {
    visited[i] = 1;
    bg[i] = 1;
    stack.push(i);
  }
};
for (let x = 0; x < W; x++) {
  seed(x);
  seed((H - 1) * W + x);
}
for (let y = 0; y < H; y++) {
  seed(y * W);
  seed(y * W + W - 1);
}
while (stack.length) {
  const i = stack.pop();
  const x = i % W;
  const y = (i - x) / W;
  if (x > 0) seed(i - 1);
  if (x < W - 1) seed(i + 1);
  if (y > 0) seed(i - W);
  if (y < H - 1) seed(i + W);
}

// ---- binary alpha ----
let alpha = new Uint8Array(N);
for (let i = 0; i < N; i++) alpha[i] = bg[i] ? 0 : 255;

// ---- remove ENCLOSED background pockets ----
// The border flood can't reach pink that's walled in by the lettering + peacock
// (e.g. the field trapped between "Hal", the peacock, and "dini"). Find opaque
// regions that aren't actually foreground and, if large, clear them — while
// leaving the small light details *inside* the letters intact.
{
  const lab = new Int32Array(N);
  let next = 0;
  const st = [];
  for (let s = 0; s < N; s++) {
    if (lab[s] || alpha[s] === 0 || fgAt(s)) continue;
    next++;
    let area = 0;
    const px = [];
    lab[s] = next;
    st.push(s);
    while (st.length) {
      const i = st.pop();
      area++;
      px.push(i);
      const x = i % W;
      const y = (i - x) / W;
      const tryN = (ni) => {
        if (ni >= 0 && ni < N && !lab[ni] && alpha[ni] !== 0 && !fgAt(ni)) {
          lab[ni] = next;
          st.push(ni);
        }
      };
      if (x > 0) tryN(i - 1);
      if (x < W - 1) tryN(i + 1);
      if (y > 0) tryN(i - W);
      if (y < H - 1) tryN(i + W);
    }
    if (area > 220) for (const i of px) alpha[i] = 0;
  }
}

// ---- 1px erosion (min filter) to remove the pink edge ring ----
const erode = (a) => {
  const out = new Uint8Array(N);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let m = 255;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= H) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= W) continue;
          const v = a[ny * W + nx];
          if (v < m) m = v;
        }
      }
      out[y * W + x] = m;
    }
  }
  return out;
};

// ---- 3x3 box blur for a soft, anti-aliased edge ----
const blur = (a) => {
  const out = new Uint8Array(N);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let s = 0;
      let c = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= H) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= W) continue;
          s += a[ny * W + nx];
          c++;
        }
      }
      out[y * W + x] = Math.round(s / c);
    }
  }
  return out;
};

// ---- despeckle: keep the main logo mass + real marks within its bbox ----
const despeckle = (a) => {
  const lab = new Int32Array(N);
  let next = 0;
  const comps = [];
  const st = [];
  for (let s = 0; s < N; s++) {
    if (a[s] <= 10 || lab[s]) continue;
    next++;
    let area = 0,
      minx = W,
      miny = H,
      maxx = 0,
      maxy = 0,
      sx = 0,
      sy = 0;
    lab[s] = next;
    st.push(s);
    while (st.length) {
      const i = st.pop();
      const x = i % W;
      const y = (i - x) / W;
      area++;
      sx += x;
      sy += y;
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
          if (a[ni] > 10 && !lab[ni]) {
            lab[ni] = next;
            st.push(ni);
          }
        }
      }
    }
    comps.push({ label: next, area, minx, miny, maxx, maxy, cx: sx / area, cy: sy / area });
  }
  const sorted = [...comps].sort((x, y) => y.area - x.area);
  console.log(
    "Top component areas:",
    sorted.slice(0, 14).map((c) => c.area)
  );
  const keep = new Set();
  for (const c of comps) if (c.area >= MIN_COMPONENT_AREA) keep.add(c.label);
  const out = new Uint8Array(N);
  for (let i = 0; i < N; i++) out[i] = keep.has(lab[i]) ? a[i] : 0;
  console.log(`Components: ${comps.length}, kept: ${keep.size}`);
  return out;
};

// Despeckle on the raw flood mask (before erosion fragments thin strokes).
const MIN_COMPONENT_AREA = 250;
alpha = blur(erode(despeckle(alpha)));

// ---- bounding box of visible pixels ----
let minX = W,
  minY = H,
  maxX = 0,
  maxY = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (alpha[y * W + x] > 10) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const cw = maxX - minX + 1;
const ch = maxY - minY + 1;
const cropped = Buffer.alloc(cw * ch * 4);
for (let y = 0; y < ch; y++) {
  for (let x = 0; x < cw; x++) {
    const si = (y + minY) * W + (x + minX);
    const so = si * 4;
    const di = (y * cw + x) * 4;
    cropped[di] = data[so];
    cropped[di + 1] = data[so + 1];
    cropped[di + 2] = data[so + 2];
    cropped[di + 3] = alpha[si];
  }
}

const pad = Math.round(Math.max(cw, ch) * 0.04);
await sharp(cropped, { raw: { width: cw, height: ch, channels: 4 } })
  .extend({
    top: pad,
    bottom: pad,
    left: pad,
    right: pad,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(OUT);

console.log(`Source: ${W}x${H}  ->  cropped logo: ${cw}x${ch} (+${pad}px pad)`);

// ---- QA previews on white & wine ----
mkdirSync(".qa", { recursive: true });
const logo = await sharp(OUT).resize({ width: 520 }).toBuffer();
const lm = await sharp(logo).metadata();
const frame = (bgColor, name) =>
  sharp({
    create: {
      width: 640,
      height: lm.height + 80,
      channels: 4,
      background: bgColor,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(`.qa/${name}.png`);
await frame({ r: 255, g: 255, b: 255, alpha: 1 }, "on-white");
await frame({ r: 122, g: 46, b: 69, alpha: 1 }, "on-wine");
console.log("QA previews written to .qa/on-white.png and .qa/on-wine.png");
