/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilita a troca de tema claro/escuro por classe CSS
  theme: {
    extend: {
      colors: {
        // Cores baseadas no Radix Colors (Figma)
        purple: {
          1: 'var(--purple-1)',
          2: 'var(--purple-2)',
          3: 'var(--purple-3)',
          4: 'var(--purple-4)',
          5: 'var(--purple-5)',
          6: 'var(--purple-6)',
          7: 'var(--purple-7)',
          8: 'var(--purple-8)',
          9: 'var(--purple-9)',   // Cor principal dos botões
          10: 'var(--purple-10)', // Hover
          11: 'var(--purple-11)',
          12: 'var(--purple-12)',
        },
        mauve: {
          1: 'var(--mauve-1)',   // Fundo principal do Dark Mode
          2: 'var(--mauve-2)',   // Fundo de cards/modais
          // ... mapeamento das outras variáveis
          11: 'var(--mauve-11)', // Texto secundário
          12: 'var(--mauve-12)', // Texto principal
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Assumindo uma fonte limpa estilo Figma
      }
    },
  },
  plugins: [],
}
