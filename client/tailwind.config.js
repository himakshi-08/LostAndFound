/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          950: '#0a0c1b',
          900: '#141833',
          800: '#1e244d',
          700: '#283066',
        },
        lavender: {
          DEFAULT: '#e6e6fa',
          light: '#f3f3ff',
        },
        electric: {
          blue: '#1e90ff',
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
