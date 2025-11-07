import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        foreground: "#e0e0e0",
        primary: "#00d9ff",
        secondary: "#ff00ff",
        accent: "#00ff88",
        warning: "#ffc800",
      },
    },
  },
  plugins: [],
};
export default config;
