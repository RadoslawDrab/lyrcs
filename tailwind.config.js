/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          50: '#f89da3',
          100: '#f68991',
          200: '#f5757e',
          300: '#f3616c',
          400: '#f24e59',
          500: '#f03a47',
          600: '#d83440',
          700: '#c02e39',
          800: '#a82932',
          900: '#90232b',
          950: '#781d24',
        },
      },
    },
  },
  plugins: [],
}

