# Étape 3 — Scaffolding de la base

> Cette étape ne sert que si `aq new` n'a pas pu être utilisé. Dans le cas normal, le code existe déjà : passer directement à l'étape 8.

Lire `references/stacks.md` avant de commencer. En appliquer la section correspondant à la base retenue.

## Ordre

1. **Créer le projet** avec l'outil officiel. Ne pas assembler à la main ce qu'un scaffolder fait mieux.
   - Web : `pnpm dlx nuxi@latest init <nom> --template ui --packageManager pnpm --no-gitInit`
     **`--template` est obligatoire en non-interactif**, sinon la commande s'arrête.
   - Mobile : `create-expo-app` avec expo-router.
2. **Installer les dépendances de la base**, telles que listées dans `references/stacks.md`.
3. **Épingler les versions critiques** sans `^` ni `~` : `convex`, `@convex-dev/better-auth`, `better-auth`, `@better-auth/expo`. Voir `aq-better-auth` pour la matrice de compatibilité.
4. **Appliquer les tokens** de l'étape 2 dans la configuration Tailwind / NativeWind.
5. **Autoriser les scripts de build natifs** dans `pnpm-workspace.yaml` → `allowBuilds` : `better-sqlite3: true`, `'@sentry/cli': true`. pnpm 11 les bloque par défaut et Content échoue sans.
6. **Vérifier que ça démarre ET que ça build.** Après `pnpm build`, regarder `.output/public` : s'il n'y a pas de fichiers HTML, le prérendu ne fonctionne pas, même si le build affiche un succès.

## Par base

- `vitrine` — `nuxi init`, puis Content, i18n, image, seo, ui. Rendu statique par défaut.
- `cms-maison` (défaut) — Nuxt + Convex, puis `aq-better-auth`. Créer d'emblée le schéma des rôles (éditeur, admin) : le rétrofitter sur des données existantes est une migration.
  **Point d'arrêt obligatoire** : `npx convex dev` demande un compte et une saisie humaine. S'arrêter, le demander à l'utilisateur, et ne reprendre qu'une fois `convex/_generated` présent. Tout typecheck lancé avant échouera.
- `cms-directus` (bascule) — le front Nuxt d'abord. Directus est une étape d'infra séparée, notée dans « à toi de jouer ».
- `saas` — Nuxt + Convex, puis `aq-better-auth`, puis `aq-stripe`. Dans cet ordre : la facturation dépend de l'identité.
- `mobile` — `create-expo-app` avec expo-router, puis NativeWind, puis Convex, puis `aq-better-auth`, puis RevenueCat.

## Structure de dossiers

Appliquer les conventions de `aq-conventions`. Créer dès maintenant :

```
docs/adr/
docs/design.md
.env.example
```

## Ne pas faire

- Ne pas installer de librairie « au cas où ». Chaque dépendance doit servir à l'étape suivante.
- Ne pas générer d'UI de démonstration au-delà de ce qui valide les tokens.
- Ne pas configurer le déploiement ici : c'est `aq-production`, plus tard.
