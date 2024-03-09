import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        black: "#1D1D1D",
      },
      keyframes: {
        shake: {
          "0%,20%,40%,60%,80%,100%": { transform: "translate(0px, 0px)" },
          "10%,30%,50%,70%,90%": { transform: "translate(0px, 5px)" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
}
export default config
