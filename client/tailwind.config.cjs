/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          950: '#0f112e',
          900: '#1a1d4a',
          800: '#252966',
          700: '#303682',
        },
        lavender: {
          DEFAULT: '#dcdcfc',
          light: '#e6e6ff',
        },
        electric: {
          blue: '#3b82f6',
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
