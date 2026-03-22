/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cptm: ['var(--fonte-principal)'],
      },
      colors: {
        cptm: {
          vermelho: 'var(--cptm-vermelho)',
          branco: 'var(--cptm-branco)',
          cinza: {
            fundo: 'var(--cptm-cinza-fundo)',
            medio: 'var(--cptm-cinza-medio)',
          },
        },
      },
    },
  },
  plugins: [],
}
