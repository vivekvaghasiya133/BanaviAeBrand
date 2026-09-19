/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: {
          DEFAULT: '#BFFF00',
          hover: '#99CC00',
          dim: 'rgba(191, 255, 0, 0.15)',
          glow: 'rgba(191, 255, 0, 0.4)'
        },
        site: {
          bg: '#050507',
          card: '#0A0A0F',
          surface: '#101018',
          border: 'rgba(255, 255, 255, 0.08)',
          muted: 'rgba(255, 255, 255, 0.6)'
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        serif: ['"Fraunces"', 'serif']
      }
    },
  },
  plugins: [],
}
