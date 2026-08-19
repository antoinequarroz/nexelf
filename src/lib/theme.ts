// Miroir TypeScript des tokens de tailwind.config.js, pour les rares cas
// où une valeur ne peut pas passer par une classe NativeWind
// (barre de statut, écran de démarrage, options de navigation).
// Si tu modifies l'un, modifie l'autre. Aucune autre valeur en dur ailleurs.
export const theme = {
  encre: { 100: '#e3e8ea', 500: '#587380', 600: '#4a5f6b', 950: '#1e262c' },
  craie: { 50: '#faf9f7', 100: '#f2f0eb', 300: '#d3cdc0', 700: '#635c50' }
} as const
