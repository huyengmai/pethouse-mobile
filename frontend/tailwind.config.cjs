/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B3A4B',
          light: '#2D5A6B',
        },
        yellow: {
          DEFAULT: '#FFD93D',
          light: '#FFF3B8',
        },
        'bg-light': '#F7FBFC',
        'bg-green': '#E8F5E9',
        'bg-blue': '#E3F2FD',
        'bg-pink': '#FCE4EC',
        'bg-orange': '#FFF3E0',
        'bg-purple': '#F3E5F5',
        'bg-teal': '#E0F2F1',
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'sans-serif'],
        vietnamese: ['Be Vietnam Pro', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
        'scroll-text': 'scrollText 25s linear infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'dropdown': 'dropdownFadeIn 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        scrollText: {
          '0%': { left: '100%' },
          '100%': { left: '-100%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dropdownFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}