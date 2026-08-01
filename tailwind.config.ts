import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // CV Dock brand — muted sage / olive green (from the logo mark)
        brand: {
          50: "#f5f7ee",
          100: "#e8edd7",
          200: "#d3dcb5",
          300: "#b6c48c",
          400: "#9aab66",
          500: "#7e8f4a",
          600: "#63722f",
          700: "#4d5926",
          800: "#3f4922",
          900: "#363e20",
        },
        // Charcoal ink (the "C" / "DOCK" wordmark)
        ink: {
          DEFAULT: "#2e2e2e",
          50: "#f4f4f3",
          100: "#e4e4e2",
          200: "#c9c9c5",
          300: "#a3a39d",
          400: "#7c7c75",
          500: "#5f5f58",
          600: "#4a4a45",
          700: "#3b3b37",
          800: "#2e2e2e",
          900: "#242422",
        },
        // Warm cream paper (the logo tile background)
        cream: {
          50: "#fdfbf4",
          100: "#f7f1e1",
          200: "#efe6cc",
          300: "#e4d6ad",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(46,46,46,0.04), 0 8px 24px rgba(46,46,46,0.08)",
        page: "0 4px 30px rgba(46,46,46,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
