import type { Config } from "tailwindcss";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const tailgrids = require("tailgrids/plugin");


export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  //Esto es necesario para que las cartas se ajusten a los anchos deseados y debe coincidir con el indicado en cardDimensions 
  safelist: [
    'w-[300px]',
    'w-[280px]',
    'w-[170px]',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [tailgrids],

} satisfies Config;
