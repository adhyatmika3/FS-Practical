/** @type {import('tailwindcss').Config} */
export default {
  // Scan ALL html files in root + JS files in src/
  content: [
    "./*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
