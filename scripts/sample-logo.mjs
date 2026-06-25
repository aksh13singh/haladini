import sharp from "sharp";

const { data, info } = await sharp("public/haladini-logo.png.jpg")
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

const sample = (label, x, y, box = 6) => {
  let r = 0,
    g = 0,
    b = 0,
    n = 0;
  for (let dy = -box; dy <= box; dy++) {
    for (let dx = -box; dx <= box; dx++) {
      const px = Math.min(W - 1, Math.max(0, x + dx));
      const py = Math.min(H - 1, Math.max(0, y + dy));
      const o = (py * W + px) * C;
      r += data[o];
      g += data[o + 1];
      b += data[o + 2];
      n++;
    }
  }
  console.log(
    `${label.padEnd(22)} rgb(${Math.round(r / n)}, ${Math.round(
      g / n
    )}, ${Math.round(b / n)})   r-g=${Math.round((r - g) / n)}  r-b=${Math.round(
      (r - b) / n
    )}`
  );
};

console.log(`Image ${W}x${H}, channels=${C}\n--- background ---`);
sample("top-left corner", 30, 30);
sample("top-right corner", W - 30, 30);
sample("bottom-left corner", 30, H - 30);
sample("bottom-center", W / 2, H - 60);
sample("upper-middle field", W / 2, 220);
console.log("--- lettering (magenta) ---");
sample("H stroke (left)", 95, 690);
sample("d stroke (right)", 520, 690);
sample("i dot (far right)", 690, 600);
console.log("--- peacock ---");
sample("peacock body", 370, 700);
sample("peacock tail gold", 380, 860);
sample("peacock dark outline", 355, 660);
