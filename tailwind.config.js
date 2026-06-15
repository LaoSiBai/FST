/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', 'sans-serif'],
      },
      transitionTimingFunction: {
        'qq-bounce': 'cubic-bezier(0.34, 2.2, 0.4, 1)',
        'morph': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth-press': 'cubic-bezier(0.2, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 2s ease-in-out',
      }
    },
  },
  plugins: [],
}
