import type { Config } from "tailwindcss";

export default {
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.25rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
    },
    extend: {
      colors: {
        brand: {
          green: "#0B5D4D",
          sand: "#F3EBDD",
          slate: "#0F172A",
        },
      },
      screens: {
        "2xl": "1536px",
      },
    },
  },
  content: ["./src/**/*.{ts,tsx}", "./public/**/*.{svg,png}"],
} satisfies Config;
