/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import { addDynamicIconSelectors } from "@iconify/tailwind";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui, addDynamicIconSelectors()],
  theme: {
    extend: {},
  },
  darkMode: "class",
};
