/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    './*.{html,js}'
  ],
  theme: {
    extend: {},
    container: {
      center: true,
      padding: '15px',
      screens: {
        'sm': '100%',
        'md': '100%',
        'lg': '1024px',
        'xl': '1160px'
      }
    }
  },
  plugins: [],
}