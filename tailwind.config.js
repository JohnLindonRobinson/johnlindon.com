/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111827',
        accent: '#6366F1',
        background: '#F9FAFB',
        text: '#1F2937',
        highlight: '#F59E0B',
      },
    },
  },
  plugins: [],
};
