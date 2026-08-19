/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"], // títulos estilo cartaz de lanchonete
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"], // usada na "comanda" e nos preços
      },
    },
  },
  plugins: [],
};
