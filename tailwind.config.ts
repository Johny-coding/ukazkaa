import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#f2f7f1",
          100: "#e4efe3",
          500: "#4f8961",
          700: "#2d6446",
          900: "#1f4c37",
        },
        ink: "#203329",
      },
      boxShadow: {
        soft: "0 16px 45px rgba(36, 64, 46, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
