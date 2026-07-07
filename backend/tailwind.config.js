/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [  "./views/**/*.html", // scan ALL html files inside views and subfolders
    "./public/**/*.html", // if you have any html in public
    "./views/**/*.ejs",
    "./views/partials/.ejs"
    ],
  theme: {
    extend: {},
  },
  plugins: [],
}

