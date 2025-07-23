/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1db954',
          'green-light': '#1ed760',
          'green-lighter': '#1fdf64',
          dark: '#1a1a1a',
          'dark-light': '#2d2d2d',
          gray: '#b3b3b3',
          'gray-dark': '#888',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.6s ease-out',
        'pulse-slow': 'pulse 2s infinite',
        'spin-slow': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      },
    },
  },
  plugins: [],
} 