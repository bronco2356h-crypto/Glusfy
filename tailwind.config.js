/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#FFFFFF',
          dark: '#0F172A',
          accent: '#FF4F00',
          border: '#E2E8F0',
          muted: '#64748B',
        }
      }
    },
  },
  plugins: [],
}
