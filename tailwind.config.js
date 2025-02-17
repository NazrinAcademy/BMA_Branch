module.exports = {
  content: [
      './src/**/*.{js,jsx,ts,tsx,html}',
      './public/index.html',
  ],
  theme: {
      extend: {
          colors: {
              grayCustom: '#C9C9CD',
              purpleCustom: '#593FA9',
          },
      },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}

