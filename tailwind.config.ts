import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        /* ----- Haladini brand palette ----- */
        // Page backgrounds
        canvas: "#FFFFFF", // primary white page background
        cream: "#FFF7FA", // warm off-white for alternating sections

        // Signature flamingo pinks
        flamingo: {
          DEFAULT: "#FC8EAC", // primary flamingo pink
          deep: "#F76C9C", // buttons, links, hover
          tint: "#FFE9F0", // soft pink for cards & chips
        },

        // Deep rose-wine for footer & dark editorial banners
        wine: {
          DEFAULT: "#7A2E45",
          dark: "#5F2335",
          light: "#9A4760",
        },

        // Text
        ink: "#1F1A1C", // charcoal body text

        /* ----- shadcn/ui semantic aliases (mapped to brand) ----- */
        border: "#F1D6DF",
        input: "#F1D6DF",
        ring: "#F76C9C",
        background: "#FFFFFF",
        foreground: "#1F1A1C",
        primary: {
          DEFAULT: "#F76C9C",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFE9F0",
          foreground: "#7A2E45",
        },
        muted: {
          DEFAULT: "#FFF7FA",
          foreground: "#6B5860",
        },
        accent: {
          DEFAULT: "#FFE9F0",
          foreground: "#7A2E45",
        },
        destructive: {
          DEFAULT: "#D64545",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F1A1C",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F1A1C",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(122, 46, 69, 0.18)",
        card: "0 8px 30px -14px rgba(31, 26, 28, 0.20)",
        lift: "0 18px 50px -18px rgba(247, 108, 156, 0.40)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
