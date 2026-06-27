/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Paleta corporativa premium
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb', // azul claro (ação)
          600: '#1d4ed8',
          700: '#1e40af',
          900: '#0f172a', // azul escuro (base)
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,.06), 0 1px 2px rgba(15,23,42,.04)',
        lift: '0 12px 30px -10px rgba(37,99,235,.35)',
        glow: '0 0 0 3px rgba(37,99,235,.15)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-alert': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.45' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16,185,129,.5)' },
          '50%': { boxShadow: '0 0 0 8px rgba(16,185,129,0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .5s cubic-bezier(.16,1,.3,1) both',
        'fade-in': 'fade-in .4s ease both',
        'scale-in': 'scale-in .25s cubic-bezier(.16,1,.3,1) both',
        'slide-in': 'slide-in .35s ease both',
        shimmer: 'shimmer 1.6s infinite',
        'pulse-alert': 'pulse-alert 1.4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
