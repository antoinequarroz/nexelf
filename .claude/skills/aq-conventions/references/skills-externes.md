# Skills externes — quoi installer, et qui décide de quoi

## Le principe de répartition

Deux natures de savoir, deux sources.

**Les skills officielles amont** connaissent l'**API du jour** : signatures, noms d'options, commandes CLI, changements de version. Elles sont maintenues par ceux qui écrivent la librairie. Le kit AQ ne peut pas rivaliser là-dessus et ne doit pas essayer — il se périmerait en silence.

**Les skills AQ** connaissent les **décisions** : quel outil pour quel cas, dans quel ordre, avec quelles versions épinglées, quelle frontière de sécurité, quelle definition of done. Aucune skill amont ne connaîtra jamais la règle « résidence suisse → Convex disqualifié ».

Règle : **en cas de contradiction sur une décision, le kit AQ gagne. Sur un détail d'API, la skill officielle gagne.**

## À installer

### Auth
```
npx skills add better-auth/skills
```
Officiel. Configuration serveur et client, adaptateurs de base, sessions, plugins, variables d'environnement. `aq-better-auth` du kit garde la main sur l'ordre, les versions épinglées et les cinq cas oubliés.

### Vue / Nuxt
```
npx skills add onmax/nuxt-skills      # communautaire, écosystème Nuxt
npx skills add vueuse/skills          # maintenu par VueUse
```
`onmax/nuxt-skills` couvre nuxt-ui, nuxt-i18n, nuxt-seo, nuxt-better-auth, reka-ui, motion, vitest, vite, pnpm. C'est le plus proche de la stack AQ. Disponible aussi comme marketplace Claude Code (`/plugin marketplace add onmax/nuxt-skills`).

### Base de données
```
npx skills add supabase/agent-skills   # officiel : Postgres, RLS, Edge Functions
```
Pour Convex, chercher l'état actuel (`npx skills find convex`) : l'écosystème bouge. `aq-convex` du kit couvre les décisions — query/mutation/action, frontière de sécurité, index, migrations.

### Monitoring
```
npx skills add getsentry/skills
```

### Design et qualité
```
npx skills add jakubkrehel/skills     # polish UI, typo, couleurs, accessibilité
npx impeccable install                # vocabulaire de design, anti-patterns
```
Les deux se recouvrent. À évaluer séparément avant de garder les deux en permanence.

## Hygiène

- **Épingler.** Une skill mise à jour amont peut changer un comportement sans prévenir. `npx skills check` pour voir ce qui bouge, avant de mettre à jour.
- **Ne pas empiler.** Plusieurs skills qui couvrent le même terrain produisent des instructions contradictoires que l'agent arbitre au hasard. Une skill par domaine.
- **Auditer avant d'installer.** Jamais de skill non lue sur une machine ayant des accès client en production. Lire au moins le SKILL.md.
- **Une installation par projet, pas globale**, pour les skills liées à une stack. Global uniquement pour ce qui est transverse.

## Ce que le kit AQ ne délègue jamais

Ces décisions restent dans le kit, quelle que soit la skill amont installée :

- le choix de la base de données selon la contrainte (sensible, résidence, reprise par un tiers)
- le choix de l'hébergeur, et sa conséquence sur la base
- la politique de versions épinglées sur l'auth
- la frontière de sécurité côté serveur
- la definition of done et la checklist de pré-livraison
- la conformité nLPD/RGPD
