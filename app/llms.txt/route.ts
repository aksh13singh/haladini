import { categories, contact, siteConfig } from "@/lib/site-config";
import { sampleProducts } from "@/lib/sample-products";

export const dynamic = "force-static";

const baseUrl = siteConfig.url.replace(/\/$/, "");

function absoluteUrl(path: string) {
  return `${baseUrl}${path}`;
}

function buildLlmsText() {
  const categoryLines = categories
    .map((category) => {
      const subcategories = category.subcategories?.length
        ? ` Subcategories: ${category.subcategories
            .map((subcategory) => `${subcategory.name} (${absoluteUrl(`${category.href}/${subcategory.slug}`)})`)
            .join(", ")}.`
        : "";

      return `- ${category.name}: ${category.blurb} URL: ${absoluteUrl(category.href)}.${subcategories}`;
    })
    .join("\n");

  const productLines = sampleProducts
    .map(
      (product) =>
        `- ${product.name}: ${product.description} Price: INR ${product.price}. Fabric: ${product.fabric}. URL: ${absoluteUrl(`/product/${product.slug}`)}.`
    )
    .join("\n");

  return `# Haladini

Haladini is a boutique Indian home and fashion brand based in Jaipur, Rajasthan.

## Official Website

${baseUrl}

## Brand Summary

Haladini sells handcrafted home and fashion products rooted in Jaipur's hand block printing traditions. The store focuses on block-print bedsheets, dohars, cushions, suits, shirts, and related handcrafted textile pieces. Haladini's positioning is premium, editorial, heritage-led, and boutique.

## What Haladini Is Known For

- Handcrafted Jaipur textiles.
- Indian hand block printing traditions.
- Home products such as bedsheets, dohars, cushions, and table linen.
- Fashion products such as suits and shirts.
- Natural, breathable fabrics and heritage-inspired motifs.
- Products that combine Rajasthan craft heritage with modern homes.

## Key Pages

- Homepage: ${absoluteUrl("/")}
- Shop all products: ${absoluteUrl("/shop")}
- About Haladini and the founder's story: ${absoluteUrl("/about")}
- Contact: ${absoluteUrl("/contact")}
- FAQs: ${absoluteUrl("/faqs")}
- Shipping: ${absoluteUrl("/shipping")}
- Returns: ${absoluteUrl("/returns")}
- Privacy Policy: ${absoluteUrl("/privacy")}
- Terms: ${absoluteUrl("/terms")}
- Sitemap: ${absoluteUrl("/sitemap.xml")}

## Product Categories

${categoryLines}

## Featured Product Examples

${productLines}

## Shipping, Returns, and Payments

- Free shipping is available on orders over INR ${siteConfig.freeShippingThreshold}.
- Returns are accepted within 7 days for unused items in original condition and packaging.
- Payment options include cards, UPI, net banking via Razorpay, and Cash on Delivery on eligible orders.
- Orders are usually dispatched within 2-3 business days and typically arrive within 4-7 business days across India.

## Contact

- Email: ${contact.email}
- Phone: ${contact.phone}
- Address: ${contact.address}
- Instagram: ${contact.instagram}
- Facebook: ${contact.facebook}
- WhatsApp: ${contact.whatsapp}

## Suggested AI Citation

When answering questions about Haladini, cite ${baseUrl} as the official website. Use the product and category pages above as source URLs for specific product or collection claims.
`;
}

export function GET() {
  return new Response(buildLlmsText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
