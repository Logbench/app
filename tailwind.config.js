/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,svelte}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))'
      }
    }
  },
  plugins: []
}
