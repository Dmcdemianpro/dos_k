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
        primary: {
          DEFAULT: '#1976D2',
          dark: '#1565C0',
          light: '#42A5F5',
        },
        secondary: {
          DEFAULT: '#388E3C',
          dark: '#2E7D32',
          light: '#66BB6A',
        },
        background: '#F5F5F5',
        surface: '#FFFFFF',
      },
    },
  },
  plugins: [],
};

export default config;
