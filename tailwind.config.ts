import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "var(--font-cyrillic)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        surface: "var(--surface-shadow)",
        "surface-lg": "var(--surface-shadow-lg)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        border: "var(--border)",
        input: "var(--border-strong)",
        ring: "var(--accent)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--accent)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--panel-solid)",
          foreground: "var(--foreground)",
        },
        destructive: {
          DEFAULT: "#dc2626",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "var(--muted-bg)",
          foreground: "var(--muted)",
        },
        accent: {
          DEFAULT: "var(--accent-soft)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--panel-solid)",
          foreground: "var(--foreground)",
        },
        card: {
          DEFAULT: "var(--panel-solid)",
          foreground: "var(--foreground)",
        },
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
          "6": "var(--chart-6)",
          "7": "var(--chart-7)",
          "8": "var(--chart-8)",
          "9": "var(--chart-9)",
          "10": "var(--chart-10)",
        },
        // Tailwind `accent` = soft selected/hover surface.
        // CSS `var(--accent)` is the brand system blue (#0071e3).
        "accent-soft": "var(--accent-soft)",
        "accent-foreground": "var(--accent-foreground)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
