/** @type {import('tailwindcss').Config} */
const { theme, fonts } = require("./theme")

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fonts: {
        ...fonts,
      },
      colors: {
        ...theme.colors,
      },
    },
  },
  plugins: [],
}
