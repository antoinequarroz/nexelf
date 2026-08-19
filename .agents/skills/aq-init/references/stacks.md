# Les quatre bases AQ

Socle commun à toutes : TypeScript strict, Tailwind v4, ESLint, Vitest, Sentry, i18n, `pnpm`.
Scripts identiques partout : `dev`, `build`, `check`, `test`, `e2e`.

---

## Base `vitrine`

Site public, contenu qui change quelques fois par an. Pas de base de données, pas d'auth.

Scaffolder : `pnpm dlx nuxi@latest init <nom> --template ui --packageManager pnpm --no-gitInit`
Le template `ui` configure Nuxt UI et Tailwind v4 correctement — fastidieux à faire à la main.

```
nuxt@^4            vue@^3.5
@nuxt/ui@^4        composants + Tailwind v4 (fourni par le template)
@nuxt/content@^3   contenu en Markdown, versionné avec le code
better-sqlite3     REQUIS par @nuxt/content — voir pièges
@nuxtjs/i18n       obligatoire, même en mono-langue
@nuxt/image        optimisation + formats modernes
@nuxtjs/seo        sitemap, robots, OG, schema.org
@nuxt/ui           composants + Tailwind v4
@sentry/nuxt
@nuxtjs/turnstile  anti-spam formulaires, sans cookie
resend             envoi des formulaires
```

- Rendu : `nuxt generate` (statique) sauf si un besoin dynamique apparaît.
- Analytics : Plausible ou Umami. **Jamais** Google Analytics par défaut — ça déclenche la bannière cookies.
- Hébergement : Vercel, ou Infomaniak si contrainte suisse. Cloudflare possible (statique uniquement).
### Pièges vérifiés en construisant la base

- **`nuxi init` exige `--template`** en non-interactif. Sans lui, la commande s'arrête. Templates : `minimal`, `content`, `ui`, `module`.
- **@nuxt/content réclame `better-sqlite3`** et pose une **question interactive** au build s'il manque. Un agent reste bloqué indéfiniment, sans message d'erreur. L'installer explicitement.
- **pnpm 11 bloque les scripts de build natifs.** Ils s'autorisent dans `pnpm-workspace.yaml` → `allowBuilds`, **pas** dans `package.json`. Mettre `better-sqlite3` et `@sentry/cli` à `true`, sinon Content ne fonctionne pas.
- **Une routeRule `'/**': { prerender: true }` ne prérend rien.** Nitro ne déplie pas un joker : le build « réussit » en produisant zéro HTML. Utiliser :
  ```ts
  nitro: { prerender: { routes: ['/'], crawlLinks: true, failOnError: true } }
  ```
  Vérifier `.output/public` après build — c'est le seul moyen de s'en apercevoir.
- **@nuxtjs/seo embarque les images OG dynamiques**, qui exigent `@takumi-rs/core` (dépendance native lourde). Sur une vitrine : `ogImage: { enabled: false }` et une image de partage statique.
- **Nuxt UI attend une échelle de couleur complète 50→950** nommée, pour la référencer dans `app.config.ts`. Une variable plate ne marche pas.
- Le prérendu impose que chaque page soit atteignable par un lien depuis la racine, sinon le crawler ne la trouve pas.
- Ne pas rendre le contenu éditable « juste un peu ». Si le client veut éditer, c'est la base `cms`.

---

## Base `cms`

Le client édite son contenu lui-même, régulièrement, sans toi.

**`cms-maison` (défaut)** — back-office sur mesure, intégré au site, taillé pour le client.
```
nuxt@^4 + @nuxtjs/i18n + @nuxt/image + @nuxtjs/seo + @nuxt/ui
convex@^1.43
nuxt-convex-module        intégration Vue/Nuxt
better-auth@1.6.x         version imposée par le composant Convex
@convex-dev/better-auth@^0.12
```
**Pas de `@nuxt/content` ici** : le contenu vit dans Convex, pas en Markdown.
Donc pas de `better-sqlite3` non plus, contrairement à la base `vitrine`.

Intégration Vue — état vérifié le 2026-08-06 :
- `convex-nuxt` dépend de `convex-vue`, dernière publication **juillet 2025**. Considéré non maintenu, ne pas l'utiliser.
- `nuxt-convex-module` : portage complet et récent (composables, SSR preload, Nitro, Better Auth, CSP), mais publié en **0.0.0**, une seule version, aucun historique de compatibilité. C'est le choix retenu, avec la porte de sortie de l'ADR 0001.

### Pièges vérifiés en construisant la base `cms`

- **`npx convex dev` est un prérequis humain.** Sans lui, `convex/_generated` n'existe pas : `pnpm check` échoue et `api` est indéfini. `convex codegen` seul ne suffit pas — il exige un déploiement configuré. **L'init ne peut pas se terminer sans compte Convex** : le dire à l'utilisateur au lieu de tourner en rond.
- **`nuxt-convex-module` fournit déjà un middleware `auth`.** En écrire un du même nom déclenche `NUXT_B4013` et le vôtre est ignoré.
- **Better Auth s'active automatiquement** dès que `@convex-dev/better-auth` est installé. Ne pas l'ajouter comme module Nuxt supplémentaire.
- `@convex-dev/better-auth` déclare React en peer sans le rendre optionnel. Ce n'est qu'un avertissement pnpm : rien n'installe React et le build passe.
- Les secrets d'auth (`BETTER_AUTH_SECRET`, `SITE_URL`) vont dans l'environnement **Convex** (`npx convex env set`), pas dans `.env.local`.
Le client édite dans une interface qui parle son métier, pas dans un back-office générique. Même stack que la base `saas` sans la facturation : ce qui est appris ici sert là-bas.

Prévoir dès la conception, sinon c'est douloureux après :
- rôles éditeur / administrateur, même s'il n'y a qu'une personne au lancement ;
- prévisualisation avant publication ;
- upload d'images avec redimensionnement (stockage Convex) ;
- un historique minimal : qui a modifié quoi, quand.

**`cms-directus` (bascule)** — à proposer uniquement si l'un de ces cas est vrai :
```
nuxt@^4 + @directus/sdk
```
- plus de 8 à 10 types de contenu distincts ;
- plusieurs éditeurs avec des droits fins et des flux de validation ;
- le client exige de pouvoir changer de prestataire sans dépendre de code sur mesure ;
- résidence des données en Suisse exigée (Directus auto-hébergé chez Infomaniak, Convex étant disqualifié).

Dans ces cas, écrire une ADR : le back-office maison a été écarté, et pourquoi.

- Rendu : ISR / hybride. Le contenu se rafraîchit sans rebuild complet.
- Le back-office maison est une **frontière de sécurité** : toute vérification de rôle se fait dans `convex/`, jamais dans le front. Voir `aq-convex`.
- Prévoir dès le départ : prévisualisation avant publication, et rôles si plusieurs éditeurs.
- Piège : un blog seul ne justifie pas cette base. Contenu Markdown + Nuxt Studio suffit souvent.

---

## Base `saas`

Comptes utilisateurs, données par utilisateur, abonnement récurrent.

```
nuxt@^4            vue@^3.5
convex             backend, temps réel, schéma typé
@convex-dev/better-auth  auth — VERSIONS ÉPINGLÉES, voir aq-better-auth
better-auth        version exacte imposée par le composant Convex
stripe             abonnements — voir aq-stripe
@nuxt/ui + Tailwind v4
@nuxtjs/i18n
@sentry/nuxt
resend             mails transactionnels
posthog-js         produit analytics (optionnel, à déclarer au client)
```

**Variante base de données** — appliquer la règle, ne pas choisir par habitude :

| Situation | Base |
|---|---|
| Ton produit, données non sensibles | Convex |
| Le client doit pouvoir reprendre le projet sans toi dans 3 ans | Supabase (Postgres, ça se transmet) |
| Résidence des données en Suisse exigée | Postgres auto-hébergé Infomaniak |
| Données relationnelles complexes, rapports, exports comptables | Supabase |
| Temps réel, collaboratif, mobile | Convex |

Si la variante est Supabase : `@supabase/supabase-js` + `@nuxtjs/supabase`, Better Auth reste possible mais Supabase Auth est plus direct — voir `aq-auth`.

- Risque connu et accepté : l'intégration Convex↔Vue est communautaire. Documenté dans l'ADR 0001 générée à l'init, avec la porte de sortie (bascule du front vers React/TanStack Start, le dossier `convex/` étant inchangé).
- Hébergement : Vercel. Infomaniak si contrainte suisse — et dans ce cas Convex est disqualifié, voir `aq-hosting`.

---

## Base `mobile`

React Native, distribué sur les stores.

Scaffolder : `pnpm dlx create-expo-app@latest <nom> --template default`
Le template SDK 57 met le code dans **`src/app/`**, pas `app/`.

```
expo@~57                expo-router (src/app/)
nativewind             Tailwind en RN
convex                 backend partagé si un web existe
@convex-dev/better-auth + @better-auth/expo + expo-secure-store
react-native-purchases  RevenueCat, abonnements
@sentry/react-native
expo-localization + i18next
expo-updates           correctifs OTA sans repasser en revue
```

- Tests : Maestro, pas Playwright.
- Build et distribution : EAS.
- Piège : le paiement in-app passe **obligatoirement** par les stores pour du contenu numérique. RevenueCat gère les deux plateformes ; ne jamais brancher Stripe directement dans l'app.
### Pièges vérifiés en construisant la base `mobile`

- **L'API diffère de celle des bases web.** Avec `@convex-dev/better-auth@0.12` : dès qu'on utilise `triggers`, `authFunctions` devient **obligatoire**, et le plugin serveur est `convex({ authConfig })` importé de `@convex-dev/better-auth/plugins` — **pas** `authComponent.convexPlugin()`. Ne pas copier le `convex/auth.ts` d'une base web tel quel.
- **Incompatibilité de typage en amont** : `@better-auth/expo@1.6.26` déclare `getActions` avec deux paramètres là où `better-auth@1.6.26` en attend trois. Contournable par un cast, sans effet à l'exécution. À revérifier à chaque montée de version.
- `expo lint` exige un accès réseau à expo.dev. En environnement isolé, il échoue sans que le projet soit en cause.
- pnpm 11 : `@sentry/cli` à autoriser dans `pnpm-workspace.yaml` → `allowBuilds`.
- Le `scheme` de `app.json` doit être répété dans `auth-client.ts`, `convex/auth.ts` (`trustedOrigins`) et les flux Maestro. Le renommer partout au clonage.
- **Point fort de la stack AQ** : sur mobile, l'intégration Convex est officielle et first-class, contrairement au web en Vue.
- Le setup Better Auth + Expo reste le plus capricieux du lot. Compter une demi-journée la première fois.

---

## Ce qui est commun, et non négociable

- `@nuxtjs/i18n` ou `expo-localization` **dès le premier commit**, même si une seule langue. Rétrofitter l'i18n sur un projet fini coûte une journée.
- Sentry configuré et **testé avec une erreur volontaire** avant la fin de l'init.
- Trois tests end-to-end fondateurs, pas plus : la page d'accueil charge, le formulaire ou le login marche, le parcours principal aboutit.
- `.env.example` complet, `.env.local` jamais commité.
- Design tokens dans **un seul fichier**. Aucune valeur hex en dur dans un composant.
