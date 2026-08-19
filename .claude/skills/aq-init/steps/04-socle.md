# Étape 4 — Socle commun

Ce qui est identique sur les quatre bases. C'est ce qui fait qu'un projet AQ se reprend en cinq minutes six mois plus tard.

## i18n — même en mono-langue

Web : `@nuxtjs/i18n`. Mobile : `expo-localization` + `i18next`.

- Locale par défaut `fr`, stratégie `prefix_except_default`.
- **Aucune chaîne en dur dans un composant**, dès le premier écran. C'est la seule règle qui compte : si elle tient, ajouter une langue est une après-midi. Sinon c'est une semaine.
- Fichiers de traduction découpés par domaine, pas un seul fichier géant.
- Si le projet est mono-langue, ne pas afficher de sélecteur de langue. L'infrastructure est là, l'UI viendra.

## Scripts npm — identiques partout

```json
{
  "dev": "...",
  "build": "...",
  "check": "nuxt typecheck && eslint . && prettier --check .",
  "test": "vitest run",
  "e2e": "playwright test"
}
```

`pnpm check` doit passer à la fin de l'init. Si un outil manque, l'ajouter maintenant.

## Qualité

- ESLint via `@nuxt/eslint` (web) ou la config Expo (mobile).
- Prettier, config partagée, pas de débat.
- TypeScript strict. Pas de `any`, pas de `@ts-ignore` sans commentaire.
- Vitest configuré, même sans test au départ : la barrière à l'entrée doit être nulle.

## Environnement

- `.env.example` avec **toutes** les variables et des valeurs bidons explicites.
- `.env.local` dans `.gitignore`, vérifié.
- Aucune clé réelle écrite par l'agent. Variables laissées vides et listées dans « à toi de jouer ».

## Skills AQ dans le projet

Installer les skills du kit pour que les prochaines sessions démarrent avec le contexte :

```
node <chemin-vers-aq-kit>/scripts/sync.mjs --target . --profile <base> --agents codex,claude
```

Codex lit `.agents/skills/`, Claude Code lit `.claude/skills/`.

## Analytics et formulaires (web)

- Plausible ou Umami. Pas de Google Analytics par défaut : ça déclenche la bannière cookies et alourdit toute la conformité.
- Turnstile sur les formulaires publics. Gratuit, sans cookie, plus propre que reCAPTCHA du point de vue nLPD.
