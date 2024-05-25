import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const brand = colors.sky;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...colors,
        brand,
      },
    },
  },
  plugins: [],
};
export default config;
