/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Serve the smallest modern format the browser supports (AVIF, then WebP).
    formats: ["image/avif", "image/webp"],
    // Remote image hosts used for placeholder + Supabase Storage product photos.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
