# Nexelf

Copilote personnel IA mobile. **Become your next self.**

## Comment lancer

```bash
pnpm install
npx convex dev
npx convex env set BETTER_AUTH_SECRET "<secret>"
npx convex env set SITE_URL nexelf://
Copy-Item .env.example .env.local
pnpm start
```

`npx convex dev` doit tourner une première fois avant le typecheck afin de générer `convex/_generated`.

## Comment déployer

Les builds iOS et Android passent par EAS. Le backend est déployé avec Convex. La procédure complète sera finalisée avec `aq-production`, puis `aq-release-mobile`.

## Qui appeler

Antoine Quarroz — [antoinequarroz.ch](https://antoinequarroz.ch)
