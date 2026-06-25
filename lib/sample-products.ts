import type { CategorySlug, Product } from "./types";

/**
 * Sample catalogue so the storefront looks alive before Supabase is wired in.
 * Images are generated block-print "swatch" placeholders in /public/products
 * (run `node scripts/make-product-placeholders.mjs`). Swap in real photos by
 * replacing those files — the filenames match each product slug.
 *
 * Later, the Supabase data layer can expose the same shape and these helpers
 * become thin wrappers around queries.
 */

const BED_SIZES = ["Single", "Double", "Queen", "King"];
const CUSHION_SIZES = ["16×16", "18×18"];
const APPAREL_SIZES = ["S", "M", "L", "XL"];
const CARE = "Gentle machine wash cold · Line dry in shade · Warm iron.";

// Each product ships with a main photo + 2 more. To add real photos, replace
// these files in /public/products (keep the names): <slug>.jpg, <slug>-2.jpg,
// <slug>-3.jpg. Need more/fewer shots for a product? Adjust its array below.
const img = (slug: string) => [
  `/products/${slug}.jpg`,
  `/products/${slug}-2.jpg`,
  `/products/${slug}-3.jpg`,
];

export const sampleProducts: Product[] = [
  // ── Bedsheets ──────────────────────────────────────────────
  {
    id: "gulbagh-block-print-bedsheet",
    name: "Gulbagh Block-Print Bedsheet",
    slug: "gulbagh-block-print-bedsheet",
    description:
      "A soft cotton bedsheet hand block-printed with a blooming Gulbagh garden motif. Includes two pillow covers.",
    price: 1899,
    compareAtPrice: 2299,
    category: "bedsheets",
    subcategory: "handblock-print",
    images: img("gulbagh-block-print-bedsheet"),
    sizes: BED_SIZES,
    fabric: "100% cotton, 200 TC",
    care: CARE,
    stock: 24,
    isNew: true,
    createdAt: "2026-06-10T10:00:00.000Z",
  },
  {
    id: "jaipur-indigo-cotton-bedsheet",
    name: "Jaipur Indigo Cotton Bedsheet",
    slug: "jaipur-indigo-cotton-bedsheet",
    description:
      "Deep indigo dabu print on breathable cotton — a calm, timeless statement for the bedroom.",
    price: 2199,
    category: "bedsheets",
    images: img("jaipur-indigo-cotton-bedsheet"),
    sizes: BED_SIZES,
    fabric: "100% cotton, 220 TC",
    care: CARE,
    stock: 18,
    isNew: true,
    createdAt: "2026-06-02T10:00:00.000Z",
  },
  {
    id: "bagru-floral-king-bedsheet",
    name: "Bagru Floral King Bedsheet",
    slug: "bagru-floral-king-bedsheet",
    description:
      "Generous king-size sheet in a classic Bagru floral, printed with natural dyes by Jaipur artisans.",
    price: 2499,
    compareAtPrice: 2899,
    category: "bedsheets",
    subcategory: "handblock-print",
    images: img("bagru-floral-king-bedsheet"),
    sizes: BED_SIZES,
    fabric: "100% cotton, 220 TC",
    care: CARE,
    stock: 12,
    isNew: false,
    createdAt: "2026-04-18T10:00:00.000Z",
  },
  {
    id: "sanganeri-blush-bedsheet",
    name: "Sanganeri Blush Bedsheet",
    slug: "sanganeri-blush-bedsheet",
    description:
      "Delicate Sanganeri blossoms in soft blush on ivory cotton. Quietly pretty, beautifully soft.",
    price: 1749,
    category: "bedsheets",
    subcategory: "handblock-print",
    images: img("sanganeri-blush-bedsheet"),
    sizes: BED_SIZES,
    fabric: "100% cotton, 200 TC",
    care: CARE,
    stock: 30,
    isNew: false,
    createdAt: "2026-03-22T10:00:00.000Z",
  },

  // ── Cushions ───────────────────────────────────────────────
  {
    id: "marigold-block-print-cushion-cover",
    name: "Marigold Block-Print Cushion Cover",
    slug: "marigold-block-print-cushion-cover",
    description:
      "A warm marigold block print on cotton canvas to layer onto sofas and beds. Cover only.",
    price: 699,
    category: "cushions",
    images: img("marigold-block-print-cushion-cover"),
    sizes: CUSHION_SIZES,
    fabric: "Cotton canvas",
    care: CARE,
    stock: 40,
    isNew: true,
    createdAt: "2026-06-12T10:00:00.000Z",
  },
  {
    id: "rosewood-mughal-cushion-cover",
    name: "Rosewood Mughal Cushion Cover",
    slug: "rosewood-mughal-cushion-cover",
    description:
      "An ornate Mughal jaal in rosewood and gold tones — a little bit of palace luxe for your living room.",
    price: 749,
    category: "cushions",
    images: img("rosewood-mughal-cushion-cover"),
    sizes: CUSHION_SIZES,
    fabric: "Cotton canvas",
    care: CARE,
    stock: 35,
    isNew: true,
    createdAt: "2026-05-28T10:00:00.000Z",
  },
  {
    id: "bagru-stripe-cushion-cover",
    name: "Bagru Stripe Cushion Cover",
    slug: "bagru-stripe-cushion-cover",
    description:
      "Easy-going hand block-printed stripes that mix and match with everything. Cover only.",
    price: 649,
    compareAtPrice: 799,
    category: "cushions",
    images: img("bagru-stripe-cushion-cover"),
    sizes: CUSHION_SIZES,
    fabric: "Cotton canvas",
    care: CARE,
    stock: 50,
    isNew: false,
    createdAt: "2026-04-05T10:00:00.000Z",
  },
  {
    id: "lotus-pond-cushion-cover",
    name: "Lotus Pond Cushion Cover",
    slug: "lotus-pond-cushion-cover",
    description:
      "A serene lotus-pond print in pinks and greens, hand-finished with piped edges.",
    price: 799,
    category: "cushions",
    images: img("lotus-pond-cushion-cover"),
    sizes: CUSHION_SIZES,
    fabric: "Cotton canvas",
    care: CARE,
    stock: 28,
    isNew: false,
    createdAt: "2026-02-15T10:00:00.000Z",
  },

  // ── Suits ──────────────────────────────────────────────────
  {
    id: "anarkali-block-print-suit-set",
    name: "Anarkali Block-Print Suit Set",
    slug: "anarkali-block-print-suit-set",
    description:
      "A flowing Anarkali kurta with matching dupatta and pants, hand block-printed on soft mulmul cotton.",
    price: 3299,
    compareAtPrice: 3799,
    category: "suits",
    images: img("anarkali-block-print-suit-set"),
    sizes: APPAREL_SIZES,
    fabric: "Cotton mulmul",
    care: CARE,
    stock: 16,
    isNew: true,
    createdAt: "2026-06-14T10:00:00.000Z",
  },
  {
    id: "gulmohar-cotton-suit-set",
    name: "Gulmohar Cotton Suit Set",
    slug: "gulmohar-cotton-suit-set",
    description:
      "Fiery gulmohar blooms on a breezy cotton suit set — straight kurta, pants and a printed dupatta.",
    price: 2899,
    category: "suits",
    images: img("gulmohar-cotton-suit-set"),
    sizes: APPAREL_SIZES,
    fabric: "Cotton mulmul",
    care: CARE,
    stock: 20,
    isNew: true,
    createdAt: "2026-06-06T10:00:00.000Z",
  },
  {
    id: "indigo-bagru-suit-set",
    name: "Indigo Bagru Suit Set",
    slug: "indigo-bagru-suit-set",
    description:
      "Hand-dyed indigo with Bagru motifs — an everyday-elegant three-piece set in soft cotton.",
    price: 3099,
    category: "suits",
    images: img("indigo-bagru-suit-set"),
    sizes: APPAREL_SIZES,
    fabric: "Cotton",
    care: CARE,
    stock: 14,
    isNew: false,
    createdAt: "2026-04-22T10:00:00.000Z",
  },
  {
    id: "rose-sanganeri-suit-set",
    name: "Rose Sanganeri Suit Set",
    slug: "rose-sanganeri-suit-set",
    description:
      "Romantic Sanganeri roses on ivory, tailored into a graceful suit set with a tasselled dupatta.",
    price: 3499,
    category: "suits",
    images: img("rose-sanganeri-suit-set"),
    sizes: APPAREL_SIZES,
    fabric: "Cotton",
    care: CARE,
    stock: 10,
    isNew: false,
    createdAt: "2026-03-10T10:00:00.000Z",
  },

  // ── Shirts ─────────────────────────────────────────────────
  {
    id: "bagru-block-print-shirt",
    name: "Bagru Block-Print Shirt",
    slug: "bagru-block-print-shirt",
    description:
      "A relaxed unisex shirt in hand block-printed Bagru cotton — easy to throw on, easy to love.",
    price: 1599,
    category: "shirts",
    images: img("bagru-block-print-shirt"),
    sizes: APPAREL_SIZES,
    fabric: "Cotton voile",
    care: CARE,
    stock: 26,
    isNew: true,
    createdAt: "2026-06-08T10:00:00.000Z",
  },
  {
    id: "indigo-hand-block-shirt",
    name: "Indigo Hand-Block Shirt",
    slug: "indigo-hand-block-shirt",
    description:
      "Deep indigo hand-block print on airy cotton voile, cut for a comfortable everyday fit.",
    price: 1699,
    compareAtPrice: 1999,
    category: "shirts",
    images: img("indigo-hand-block-shirt"),
    sizes: APPAREL_SIZES,
    fabric: "Cotton voile",
    care: CARE,
    stock: 22,
    isNew: true,
    createdAt: "2026-05-30T10:00:00.000Z",
  },
  {
    id: "sanganeri-floral-shirt",
    name: "Sanganeri Floral Shirt",
    slug: "sanganeri-floral-shirt",
    description:
      "Dainty Sanganeri florals scattered across a soft, breathable shirt — a warm-weather favourite.",
    price: 1499,
    category: "shirts",
    images: img("sanganeri-floral-shirt"),
    sizes: APPAREL_SIZES,
    fabric: "Cotton voile",
    care: CARE,
    stock: 32,
    isNew: false,
    createdAt: "2026-04-12T10:00:00.000Z",
  },
  {
    id: "pista-green-block-shirt",
    name: "Pista Green Block Shirt",
    slug: "pista-green-block-shirt",
    description:
      "A fresh pista-green block print on cotton — understated, breezy and endlessly wearable.",
    price: 1549,
    category: "shirts",
    images: img("pista-green-block-shirt"),
    sizes: APPAREL_SIZES,
    fabric: "Cotton",
    care: CARE,
    stock: 19,
    isNew: false,
    createdAt: "2026-02-28T10:00:00.000Z",
  },
];

/** Newest products first. */
export function getNewArrivals(limit = 8): Product[] {
  return [...sampleProducts]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, limit);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return sampleProducts.filter((p) => p.category === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return sampleProducts.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return sampleProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

// ── Shop filtering / sorting ────────────────────────────────
export type SortOption = "newest" | "price-asc" | "price-desc";

export const PRICE_RANGES = {
  all: { label: "All prices", min: 0, max: Infinity },
  "under-1000": { label: "Under ₹1,000", min: 0, max: 999 },
  "1000-2500": { label: "₹1,000 – ₹2,500", min: 1000, max: 2500 },
  "over-2500": { label: "Over ₹2,500", min: 2501, max: Infinity },
} as const;
export type PriceKey = keyof typeof PRICE_RANGES;

export interface ProductQuery {
  category?: string;
  subcategory?: string;
  q?: string;
  sort?: SortOption;
  price?: PriceKey;
}

export function applyProductQuery(
  products: Product[],
  { category, subcategory, q, sort = "newest", price = "all" }: ProductQuery
): Product[] {
  const search = q?.trim().toLowerCase();
  const range = PRICE_RANGES[price] ?? PRICE_RANGES.all;

  const list = products.filter((p) => {
    if (category && category !== "all" && p.category !== category) return false;
    if (subcategory && p.subcategory !== subcategory) return false;
    if (p.price < range.min || p.price > range.max) return false;
    if (
      search &&
      !`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(search)
    )
      return false;
    return true;
  });

  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    default:
      return list.sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      );
  }
}

export function queryProducts(opts: ProductQuery): Product[] {
  return applyProductQuery(sampleProducts, opts);
}
