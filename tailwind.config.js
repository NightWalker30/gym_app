/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,tsx,ts,jsx}',
    './src/**/*.{js,tsx,ts,jsx}', // au cas où tu utilises un dossier src
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
   colors:{
     primary:'#5f854a'
   }
















    },
  },
  plugins: [],
};
