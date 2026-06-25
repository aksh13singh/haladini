/**
 * Central, editable configuration for the Haladini storefront.
 * Change copy, links, contact details, and the announcement bar here —
 * no need to dig through components.
 */

export const siteConfig = {
  name: "Haladini",
  tagline: "Handcrafted home & fashion, made in Jaipur",
  description:
    "Haladini is a boutique store of handcrafted home & fashion — block-print bedsheets, cushions, suits, and shirts. Made in Jaipur, with love.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://haladini.in",
  ogImage: "/og-image.png",

  // ── Slim announcement bar (top of every page) — edit freely ──
  announcement: "✶  Free shipping on orders over ₹1499  ·  Made in Jaipur  ✶",

  // ── Sticky side coupon tab ──
  coupon: {
    tabLabel: "Get ₹100 off",
    code: "HELLO100",
    headline: "Get ₹100 off your first order",
    subhead:
      "Join the Haladini list for first dibs on new drops, styling notes, and a welcome treat.",
  },

  freeShippingThreshold: 1499,
} as const;

export type Category = {
  name: string;
  slug: string;
  href: string;
  blurb: string;
  /** Optional cover photo (e.g. /categories/bedsheets.jpg). Falls back to a
   *  branded gradient card when omitted. */
  image?: string;
  /** Optional subcategories — shown as a nav dropdown + chips on the category
   *  page, each with its own /shop/<category>/<subcategory> page. */
  subcategories?: { name: string; slug: string; blurb?: string }[];
};

export const categories: Category[] = [
  {
    name: "Bedsheets",
    slug: "bedsheets",
    href: "/shop/bedsheets",
    blurb: "Block-print cotton bedsheets for restful, beautiful sleep.",
    subcategories: [
      {
        name: "Handblock Print",
        slug: "handblock-print",
        blurb:
          "Bedsheets hand block-printed by Jaipur artisans, in natural dyes.",
      },
    ],
  },
  {
    name: "Cushions",
    slug: "cushions",
    href: "/shop/cushions",
    blurb: "Hand-finished cushion covers to layer your living space.",
  },
  {
    name: "Suits",
    slug: "suits",
    href: "/shop/suits",
    blurb: "Elegant block-print suit sets in soft, natural fabrics.",
  },
  {
    name: "Shirts",
    slug: "shirts",
    href: "/shop/shirts",
    blurb: "Relaxed block-print shirts, made for everyday ease.",
  },
];

export type NavLink = { label: string; href: string; children?: NavLink[] };

export const mainNav: NavLink[] = [
  { label: "New In", href: "/shop?sort=newest" },
  {
    label: "Bedsheets",
    href: "/shop/bedsheets",
    children: [
      { label: "Handblock Print", href: "/shop/bedsheets/handblock-print" },
    ],
  },
  { label: "Cushions", href: "/shop/cushions" },
  { label: "Suits", href: "/shop/suits" },
  { label: "Shirts", href: "/shop/shirts" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const contact = {
  phone: "+91 98290 00000",
  phoneHref: "tel:+919829000000",
  email: "hello@haladini.in",
  emailHref: "mailto:hello@haladini.in",
  address: "Haladini Studio, Jaipur, Rajasthan 302001, India",
  whatsapp: "https://wa.me/919829000000",
  instagram: "https://instagram.com/haladini",
  facebook: "https://facebook.com/haladini",
} as const;

export const footerLinks = {
  about: [
    { label: "Our Story", href: "/about" },
    { label: "The Craft", href: "/about#craft" },
    { label: "Journal", href: "/journal" },
    { label: "Stockists", href: "/about#stockists" },
  ],
  support: [
    { label: "Contact", href: "/contact" },
    { label: "FAQs", href: "/faqs" },
    { label: "Returns", href: "/returns" },
    { label: "Shipping", href: "/shipping" },
    { label: "Terms", href: "/terms" },
  ],
} as const;
