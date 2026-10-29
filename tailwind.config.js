/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1E293B',
        navy: '#0B2A5B',
        royal: '#1D4ED8',
        tint: '#F3F8FF',
        pale: '#EAF2FF',
      },
      fontFamily: {
        sans: ['Fraunces', 'serif'],
        serif: ['Fraunces', 'serif'],
      },
      boxShadow: {
        soft: '0 16px 48px rgba(29, 78, 216, 0.09)',
      },
    },
  },
  plugins: [],
}
