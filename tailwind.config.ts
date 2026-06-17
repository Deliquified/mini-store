import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "canvas-cream": "hsl(var(--canvas-cream))",
        "text-secondary": "hsl(var(--text-secondary))",
        "text-tertiary": "hsl(var(--text-tertiary))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        brand: {
          DEFAULT: "hsl(var(--brand))",
          hover: "hsl(var(--brand-hover))",
          text: "hsl(var(--brand-text))",
          2: "hsl(var(--brand-2))",
        },
        salmon: "hsl(var(--salmon))",
        peach: "hsl(var(--brand-2))",
        cream: "hsl(var(--cream))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        border: "hsl(var(--border))",
        "border-strong": "hsl(var(--border-strong))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      backgroundImage: {
        "brand-gradient": "var(--brand-gradient)",
        "brand-gradient-soft": "var(--brand-gradient-soft)",
        "brand-gradient-cta": "var(--brand-gradient-cta)",
        "glow-ambient": "var(--glow-ambient)",
        "hero-sheen": "var(--hero-sheen)",
      },
      boxShadow: {
        rest: "var(--shadow-rest)",
        hover: "var(--shadow-hover)",
        brand: "var(--shadow-brand)",
        cta: "var(--shadow-cta)",
        "cta-hover": "var(--shadow-cta-hover)",
        glass: "var(--glass-shadow)",
      },
      backdropBlur: {
        glass: "24px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-2%, 1%) scale(1.04)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 1.5s linear infinite",
        "glow-drift": "glow-drift 10s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
