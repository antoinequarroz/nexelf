/** Design tokens — source de vérité unique.
 *  Aucune valeur de couleur en dur dans un écran.
 *  Direction de démonstration : à remplacer à l'étape 2 de `init-project`. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Échelles nommées, pas de variables plates : c'est ce qui permet
        // d'écrire `bg-encre-600` et de tout changer d'un seul endroit.
        encre: {
          50: '#f4f6f7',
          100: '#e3e8ea',
          300: '#a3b5bd',
          500: '#587380',
          600: '#4a5f6b',
          800: '#3a454d',
          950: '#1e262c'
        },
        craie: {
          50: '#faf9f7',
          100: '#f2f0eb',
          300: '#d3cdc0',
          500: '#948b78',
          700: '#635c50',
          950: '#23211d'
        }
      },
      borderRadius: {
        // Angles francs, cohérents avec le registre éditorial.
        sm: 2,
        DEFAULT: 3,
        lg: 4
      }
    }
  },
  plugins: []
}
