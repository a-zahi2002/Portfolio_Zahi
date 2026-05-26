/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'sans-serif'],
        display: ['Clash Display', 'sans-serif'],
      },
      colors: {
        // Deep dark atmospheric palette
        charcoal: {
          950: '#030303', // Almost pure black for deeper contrast
          900: '#09090b',
          800: '#121214',
          700: '#1a1a1d',
        },
        // Muted premium accents
        accent: {
          muted: '#8b8b8b', // Muted text/elements
          gold: '#c4a976', // Subtle gold/sand for premium feel
          cyan: '#00f3ff', // Keeping it for compatibility but using less
          purple: '#9d00ff',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
        'grain': "url('/noise.png')",
      },
    },
  },
  plugins: [],
};