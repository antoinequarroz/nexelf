# AQ Mobile — base de démarrage

> Source de vérité pour les agents. `CLAUDE.md` en est une copie.

## Ce que c'est

Base `mobile` du kit AQ : React Native via Expo, backend Convex partagé avec
une éventuelle version web, abonnements RevenueCat.

## Stack

| Couche | Choix |
|---|---|
| Framework | Expo SDK 57, React Native 0.86, React 19 |
| Navigation | Expo Router (dossier `src/app/`) |
| Styles | NativeWind 4 + Tailwind 3, tokens dans `tailwind.config.js` |
| Données | Convex 1.43 |
| Auth | Better Auth 1.6 + `@better-auth/expo` + `expo-secure-store` |
| Abonnements | RevenueCat (`react-native-purchases`) |
| i18n | `expo-localization` + i18next, `fr` par défaut |
| Monitoring | `@sentry/react-native` |
| Tests | **Maestro**, pas Playwright |

## Démarrage — l'ordre compte

```bash
pnpm install
npx convex dev          # OBLIGATOIRE en premier
pnpm start
```

Sans `npx convex dev`, `convex/_generated` n'existe pas et `tsc` échoue.
Ce n'est pas un bug.

Puis, dans l'environnement **Convex** :

```bash
npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
npx convex env set SITE_URL aqmobile://
```

## Versions épinglées — règle stricte

`@better-auth/expo` doit correspondre **exactement** à `better-auth`, et
`@convex-dev/better-auth` impose la plage. Jamais de `pnpm update` large
sur ces trois paquets. Une montée de version d'auth est une opération à
part : sa branche, son test de bout en bout.

## Pièges connus — découverts en construisant cette base

- **API `@convex-dev/better-auth` 0.12** : dès qu'on utilise `triggers`,
  `authFunctions` devient **obligatoire**. Et le plugin serveur est
  `convex({ authConfig })` importé de `@convex-dev/better-auth/plugins` —
  **pas** `authComponent.convexPlugin()` comme sur les bases web.
- **Incompatibilité de typage en amont** : `@better-auth/expo@1.6.26` déclare
  `getActions` avec deux paramètres là où `better-auth@1.6.26` en attend
  trois. Contourné par un `as never` dans `src/lib/auth-client.ts` et
  `src/app/_layout.tsx`, sans effet à l'exécution. **À retirer dès que c'est
  corrigé en amont** — vérifier à chaque montée de version.
- **pnpm 11 bloque les scripts natifs.** `@sentry/cli` s'autorise dans
  `pnpm-workspace.yaml` → `allowBuilds`, pas dans `package.json`.
- Le template Expo SDK 57 met le code dans **`src/app/`**, pas `app/`.
- `expo lint` exige un accès réseau à expo.dev pour vérifier les versions
  natives. En environnement isolé, il échoue sans que le projet soit en cause.

## Interdits

- Aucune chaîne de texte en dur : tout passe par `src/i18n/locales/`.
- Aucune couleur en dur : classes NativeWind, ou `src/lib/theme.ts` pour les
  rares cas natifs (barre de statut, options de navigation).
- **Jamais Stripe dans l'app.** Le contenu numérique passe obligatoirement
  par les achats in-app, via RevenueCat.
- Jamais de jeton dans `AsyncStorage` : `expo-secure-store` uniquement.
- Pas de permission demandée au premier lancement.

## Ce qui fait rejeter une soumission

- **Suppression de compte depuis l'app** — Apple l'exige dès que l'app permet
  d'en créer un. Rejet garanti sinon.
- **Restauration des achats** — obligatoire chez Apple.
- Politique de confidentialité et étiquette de confidentialité manquantes.
- Comptes de test non fournis pour la revue.
- Permission de localisation en arrière-plan sans justification.

## Avant de livrer

`pnpm check`, `pnpm e2e`, puis `aq-audit` et `aq-ship`.
