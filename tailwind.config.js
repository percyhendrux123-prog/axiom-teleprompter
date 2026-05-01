/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        fraunces: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        cream: '#F5F1E8',
        ink: '#050505',
      },
    },
  },
  plugins: [],
}
