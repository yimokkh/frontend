/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#e0e0d7',
        text: '#000',
        border: '#73716C',
        primary: '#bedac3',
        secondary: '#e0bca0'
      }
    },
  },
  plugins: [],
}

