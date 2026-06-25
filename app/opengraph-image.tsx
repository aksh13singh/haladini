import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";
import { ogLogo } from "./og-logo-data";

// Edge runtime: avoids the Windows @vercel/og font bug and the need for fs.
export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #FFFFFF 0%, #FFF7FA 45%, #FFE9F0 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ogLogo} alt="Haladini" width={720} />
        <p style={{ marginTop: 28, fontSize: 34, color: "#7A2E45", opacity: 0.9 }}>
          Handcrafted home &amp; fashion · Made in Jaipur
        </p>
        <p
          style={{
            marginTop: 46,
            fontSize: 22,
            color: "#F76C9C",
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Bedsheets · Cushions · Suits · Shirts
        </p>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 14,
            background: "#FC8EAC",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
