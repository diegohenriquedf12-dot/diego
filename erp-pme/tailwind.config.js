/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Tokens semânticos (seguem o tema via variáveis CSS)
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        card2: 'rgb(var(--card2) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
          ink: 'rgb(var(--accent-ink) / <alpha-value>)',
        },
        // Laranja fixo (destaque/marca) e status — iguais nos dois temas
        brand: {
          50: '#FFF3E8',
          100: '#FFE3C7',
          500: '#FF7A00',
          600: '#E55F00',
          700: '#C24F00',
          900: '#0F0F0F',
        },
        pos: '#22C55E',
        warn: '#FACC15',
        neg: '#EF4444',
        info: '#FF7A00',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,.18), 0 1px 2px rgba(0,0,0,.10)',
        lift: '0 16px 40px -12px rgba(0,0,0,.45)',
        glow: '0 0 0 3px rgba(255,122,0,.20)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'pulse-alert': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '.45' } },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34,197,94,.5)' },
          '50%': { boxShadow: '0 0 0 8px rgba(34,197,94,0)' },
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
