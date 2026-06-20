import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    // Sharp, editorial look — no border radius anywhere.
    borderRadius: {
      none: "0",
      sm: "0",
      DEFAULT: "0",
      md: "0",
      lg: "0",
      xl: "0",
      "2xl": "0",
      "3xl": "0",
      full: "0",
    },
    extend: {
      colors: {
        // Brand palette
        primary: {
          DEFAULT: "#6E0D25", // deoxygenated burgundy
          50: "#FDF2F5",
          100: "#FBE3E9",
          600: "#8A1130",
          700: "#6E0D25",
          800: "#560A1D",
          900: "#3F0715",
        },
        accent: {
          DEFAULT: "#C9184A", // CTA crimson
          hover: "#A8123D",
          50: "#FFE9EF",
        },
        ink: "#16161F", // text (slightly deeper for crisper contrast)
        blush: "#FFF0F3", // soft brand accent surface
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
