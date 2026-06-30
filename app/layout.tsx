import type { Metadata, Viewport } from "next";
import { Fraunces, Poppins } from "next/font/google";

import NextTopLoader from "nextjs-toploader";

import "./globals.css";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CouponTab } from "@/components/layout/coupon-tab";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { contact, siteConfig } from "@/lib/site-config";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-fraunces",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FC8EAC",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Haladini",
    "Haladini Jaipur",
    "hand block print Jaipur",
    "block print bedsheets",
    "handcrafted bedsheets India",
    "Jaipur cushions",
    "block print suits",
    "cotton shirts India",
    "boutique home decor India",
    "Indian fashion",
  ],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  verification: {
    google: "FUHkGvajexpPQOLgQD8e3WEDDvNAewr-Megt7lyeIf4",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} handcrafted Jaipur textiles`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${siteConfig.url.replace(/\/$/, "")}/#store`,
  name: siteConfig.name,
  alternateName: "HALADINI",
  url: siteConfig.url,
  logo: new URL("/haladini-logo.png", siteConfig.url).toString(),
  image: new URL("/opengraph-image", siteConfig.url).toString(),
  description: siteConfig.description,
  email: contact.email,
  telephone: contact.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Haladini Studio",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    postalCode: "302001",
    addressCountry: "IN",
  },
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  priceRange: "INR",
  knowsAbout: [
    "Jaipur hand block printing",
    "handcrafted bedsheets",
    "block-print cushions",
    "cotton suits",
    "cotton shirts",
    "Indian home textiles",
    "Rajasthan textile craft",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Haladini handcrafted collections",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Bedsheets",
        url: new URL("/shop/bedsheets", siteConfig.url).toString(),
      },
      {
        "@type": "OfferCatalog",
        name: "Dohar",
        url: new URL("/shop/dohar", siteConfig.url).toString(),
      },
      {
        "@type": "OfferCatalog",
        name: "Cushions",
        url: new URL("/shop/cushions", siteConfig.url).toString(),
      },
      {
        "@type": "OfferCatalog",
        name: "Suits",
        url: new URL("/shop/suits", siteConfig.url).toString(),
      },
      {
        "@type": "OfferCatalog",
        name: "Shirts",
        url: new URL("/shop/shirts", siteConfig.url).toString(),
      },
    ],
  },
  sameAs: [contact.instagram, contact.facebook],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-canvas">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextTopLoader
          color="#F76C9C"
          height={3}
          showSpinner={false}
          shadow="0 0 10px #F76C9C,0 0 5px #F76C9C"
        />
        <AnnouncementBar />
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <CouponTab />
        <CartDrawer />
      </body>
    </html>
  );
}
