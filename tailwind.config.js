module.exports = {
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'outline-grey': '0 0 0 3px LightGrey',
      },
    },
  },
  variants: {
    boxShadow: ['responsive', 'hover', 'focus', 'focus-within'],
  },
  plugins: [],
}
