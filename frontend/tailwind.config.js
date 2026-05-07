/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: 'rgb(15 23 42)',
          card: 'rgb(30 41 59)',
          border: 'rgb(51 65 85)',
          text: 'rgb(226 232 240)',
          muted: 'rgb(148 163 184)',
        },
      },
    },
  },
  plugins: [],
}
