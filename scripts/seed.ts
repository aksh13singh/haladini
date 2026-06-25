// Seed the Supabase `products` table with the sample catalogue.
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local.
// Run: npm run seed
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

import { sampleProducts } from "../lib/sample-products";

function loadEnvLocal() {
  try {
    const env = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    for (const line of env.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* .env.local not found — rely on existing process.env */
  }
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error(
      "✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const rows = sampleProducts.map((p) => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    compare_at_price: p.compareAtPrice ?? null,
    category: p.category,
    subcategory: p.subcategory ?? null,
    images: p.images,
    sizes: p.sizes,
    fabric: p.fabric,
    care: p.care ?? null,
    stock: p.stock,
    is_new: p.isNew,
    created_at: p.createdAt,
  }));

  const { error } = await supabase
    .from("products")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("✗ Seed failed:", error.message);
    process.exit(1);
  }
  console.log(`✓ Seeded ${rows.length} products into Supabase.`);
}

main();
