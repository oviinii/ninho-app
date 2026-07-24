/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#7C3AED',
          600: '#6D28D9',
        },
        secondary: {
          500: '#A855F7',
        },
        accent: {
          500: '#F472B6',
        },
        background: {
          DEFAULT: '#0F172A',
          surface: '#111827',
          card: 'rgba(255,255,255,.06)',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,.08)',
        },
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#CBD5E1',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}