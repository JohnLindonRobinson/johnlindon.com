import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C348D",
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F9F5FC",
          tertiary: "#F5F5F5",
          card: "#F5EAFD",
        },
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        "work-sans": ["Work Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config; 