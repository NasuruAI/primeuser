import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    // Soft, modern radius scale.
    borderRadius: {
      none: "0",
      sm: "0.25rem",
      DEFAULT: "0.375rem",
      md: "0.5rem",
      lg: "0.625rem",
      xl: "0.875rem",
      "2xl": "1.125rem",
      "3xl": "1.5rem",
      full: "9999px",
    },
    extend: {
      colors: {
        // Brand palette — driven by CSS variables so the admin can set the brand
        // colour at runtime. Shades are derived from the base with color-mix.
        primary: {
          DEFAULT: "rgb(var(--brand-primary) / <alpha-value>)",
          50: "color-mix(in srgb, rgb(var(--brand-primary)) 8%, white)",
          100: "color-mix(in srgb, rgb(var(--brand-primary)) 14%, white)",
          600: "color-mix(in srgb, rgb(var(--brand-primary)) 88%, white)",
          700: "rgb(var(--brand-primary))",
          800: "color-mix(in srgb, rgb(var(--brand-primary)) 86%, black)",
          900: "color-mix(in srgb, rgb(var(--brand-primary)) 72%, black)",
        },
        accent: {
          DEFAULT: "rgb(var(--brand-accent) / <alpha-value>)",
          hover: "color-mix(in srgb, rgb(var(--brand-accent)) 86%, black)",
          50: "color-mix(in srgb, rgb(var(--brand-accent)) 10%, white)",
        },
        ink: "#16161F", // text (slightly deeper for crisper contrast)
        // Soft brand surface — tracks the brand colour.
        blush: "color-mix(in srgb, rgb(var(--brand-primary)) 6%, white)",
        canvas: "#FAF8F6", // warm off-white page background
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,22,31,0.03), 0 10px 30px rgba(22,22,31,0.05)",
        "card-hover": "0 2px 8px rgba(22,22,31,0.06), 0 24px 50px rgba(22,22,31,0.14)",
        soft: "0 8px 30px rgba(22,22,31,0.06)",
      },
      maxWidth: {
        site: "82rem",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("@tailwindcss/typography")],
};

export default config;
