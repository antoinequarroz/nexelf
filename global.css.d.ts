// Metro gère l'import de global.css via NativeWind ; TypeScript a besoin
// de cette déclaration pour accepter l'import à effet de bord.
declare module '*.css' {}
