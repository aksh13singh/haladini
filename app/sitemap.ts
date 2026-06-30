import type { MetadataRoute } from "next";

import { categories, siteConfig } from "@/lib/site-config";
import { sampleProducts } from "@/lib/sample-products";

const baseUrl = siteConfig.url.replace(/\/$/, "");

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/shop", priority: 0.95 },
  { path: "/about", priority: 0.8 },
  { path: "/contact", priority: 0.7 },
  { path: "/journal", priority: 0.6 },
  { path: "/faqs", priority: 0.55 },
  { path: "/returns", priority: 0.45 },
  { path: "/shipping", priority: 0.45 },
  { path: "/privacy", priority: 0.35 },
  { path: "/terms", priority: 0.35 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const categoryRoutes = categories.flatMap((category) => [
    {
      path: category.href,
      priority: 0.85,
    },
    ...(category.subcategories ?? []).map((subcategory) => ({
      path: `${category.href}/${subcategory.slug}`,
      priority: 0.75,
    })),
  ]);

  const productRoutes = sampleProducts.map((product) => ({
    path: `/product/${product.slug}`,
    priority: product.isNew ? 0.75 : 0.65,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.path.startsWith("/product")
      ? "weekly"
      : route.path === "/"
        ? "daily"
        : "weekly",
    priority: route.priority,
  }));
}
