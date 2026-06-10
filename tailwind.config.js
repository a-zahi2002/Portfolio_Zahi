/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      colors: {
        // Deep space dark palette
        charcoal: {
          950: '#06080f',
          900: '#0a0e18',
          800: '#0c1019',
          700: '#131827',
          600: '#1c2333',
        },
        // Neon accents
        accent: {
          cyan: 'var(--ct-cyan)',
          purple: 'var(--ct-purple)',
          gold: 'var(--ct-gold)',
          rose: 'var(--ct-rose)',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'gradient': 'gradient 8s linear infinite',
        'float': 'float-bob 6s ease-in-out infinite',
        'glow': 'glow-breathe 3s ease-in-out infinite',
        'grid-pulse': 'grid-pulse 4s ease-in-out infinite',
        'border-trace': 'border-trace 3s ease-out forwards',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'float-bob': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-breathe': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
        'cyber-gradient': 'linear-gradient(135deg, #00f3ff 0%, #9d5fff 50%, #e88da3 100%)',
      },
    },
  },
  plugins: [],
};