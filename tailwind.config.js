/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      colors: {
        brand: {
          cream: '#FAF8F4',
          dark: '#1A1714',
          accent: '#C4662A',
          border: '#E8E4DF',
          muted: '#7A756F',
        }
      }
    },
  },
  plugins: [],
}
