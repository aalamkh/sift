/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand accent — confident electric violet.
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Warm paper canvas + deep ink for type.
        ink: '#1c1830',
        canvas: '#faf8f5',
        // Roadmap buckets: Now = warm/urgent, Next = neutral, Later = cool.
        now: '#ea580c', // orange-600
        next: '#64748b', // slate-500
        later: '#0891b2', // cyan-600
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 24, 48, 0.04), 0 6px 20px -8px rgba(28, 24, 48, 0.12)',
        'card-hover': '0 2px 4px rgba(28, 24, 48, 0.05), 0 12px 28px -8px rgba(28, 24, 48, 0.18)',
        glow: '0 8px 30px -8px rgba(124, 58, 237, 0.35)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.35s ease-out both',
      },
    },
  },
  plugins: [],
}
