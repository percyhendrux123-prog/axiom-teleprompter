/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // gloss-literature 2026-05-01: literary serif; overrides Tailwind default `font-serif`
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        cream: '#F5F1E8',
        // gloss-literature 2026-05-01: ink is now true black, not near-black
        ink: '#000000',
      },
    },
  },
  plugins: [],
}
