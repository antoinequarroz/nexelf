---
name: aq-conventions
description: >-
  Conventions de code et de structure des projets d'Antoine Quarroz (Nuxt, Vue, Convex, Supabase, Expo, Tailwind). A utiliser des qu'on ecrit ou modifie du code dans un projet AQ, qu'on choisit une dependance, qu'on cree un fichier, ou qu'on prepare une livraison. Declencheurs : nouveau composant, nouvelle route, migration, choix de librairie, "on met ca ou ?", revue de code.
---

# Conventions AQ

Skills externes à installer et répartition des rôles avec elles : `references/skills-externes.md`.

Ces regles s'appliquent a tous les projets du kit. Si un projet a un `AGENTS.md` local qui contredit ce fichier, **le fichier local gagne** : cette skill est le defaut, pas la loi.

## Regles non negociables

1. **TypeScript strict.** Pas de `any`, pas de `@ts-ignore` sans commentaire expliquant pourquoi. `unknown` + narrowing plutot que `any`.
2. **Pas de secret dans le repo.** Toute cle vit dans `.env.local` (jamais commite) et dans le dashboard de l'hebergeur. `.env.example` liste les cles avec des valeurs bidons.
3. **Une seule facon de faire une chose par projet.** Si le projet utilise deja un pattern (fetch, gestion d'erreur, toasts), on le reutilise. On n'introduit pas une deuxieme approche "parce que c'est mieux" sans ADR.
4. **Pas de dependance ajoutee sans justification.** Avant d'installer : est-ce que la stack le fait deja ? Est-ce maintenu (derniere release < 12 mois) ? Combien de KB cote client ?
5. **Le code livre au client doit tourner sans Antoine.** Pas de script local non commite, pas d'etape manuelle non documentee dans le README.

## Structure des projets

Tous les projets exposent les memes scripts, quel que soit le framework :

```
pnpm dev        # dev local
pnpm build      # build de prod
pnpm check      # typecheck + lint + format, en une commande
pnpm test       # tests unitaires (Vitest)
pnpm e2e        # tests end-to-end (Playwright / Maestro)
```

Si un script manque dans un projet, on l'ajoute avant de faire autre chose.

Dossiers communs :

```
docs/
  brief.md        # sortie de /aq-brief : le contexte client
  prd.md          # le quoi et le pourquoi
  stories/        # une story = un fichier = une PR
  adr/            # decisions d'architecture, numerotees
AGENTS.md         # regles specifiques au projet (CLAUDE.md est un symlink vers lui)
```

## Frontend (Nuxt / Vue / Tailwind)

- Composants : `PascalCase.vue`, un composant par fichier, `<script setup lang="ts">` uniquement.
- Ordre dans un SFC : `<script setup>`, puis `<template>`, puis `<style>` si vraiment necessaire.
- Etat : `ref`/`computed` local d'abord. Un composable (`useX`) quand c'est partage par 2+ composants. Un store Pinia seulement quand l'etat survit a la navigation.
- Bibliotheque de composants : **Nuxt UI**, sur toutes les bases web. Une seule, pas de melange.
- Ne pas reecrire un composant que Nuxt UI fournit deja (modale, menu, formulaire, table). Un composant maison n'est justifie que si le besoin sort vraiment du cadre — et alors il vit dans `app/components/`, construit sur les memes tokens.
- Ne pas surcharger un composant Nuxt UI a coups de classes qui combattent son style : passer par la configuration de theme.
- Tailwind : classes utilitaires dans le template. Pas de `@apply` sauf pour un pattern repete 3+ fois, et alors il devient un composant.
- Les tokens de design (couleurs, rayons, espacements, typo) vivent dans **un seul endroit** (`app/assets/css/main.css` en Tailwind v4). Aucune valeur hex en dur dans un composant.
- Accessibilite : focus visible au clavier, contraste AA, `prefers-reduced-motion` respecte. Ce n'est pas une option a discuter avec le client, c'est le plancher.
- Pas de `<div>` cliquable. Un bouton est un `<button>`, un lien est un `<a>`/`<NuxtLink>`.

## Design

Le piege du code genere par IA, c'est le rendu "template" : gradients violets, hierarchie typographique plate, cartes imbriquees, meme palette Inter-sur-fond-sombre partout. Avant de construire une interface :

- Partir du sujet du client (son metier, son vocabulaire, ses matieres), pas d'un layout generique.
- Choisir deliberement 2 familles typographiques (une display avec du caractere, une de lecture) et une echelle de tailles.
- Une seule audace par page : l'element signature. Tout le reste reste calme.
- Les elements de structure (numerotation, filets, eyebrows) doivent encoder une information vraie, pas decorer.

Les skills `better-ui`, `better-typography`, `better-colors` et `impeccable` couvrent le detail. Cette section dit juste : **on ne commence pas a coder l'UI avant d'avoir une direction ecrite.**

## Backend

### Convex (defaut SaaS et mobile)
- Le dossier `convex/` est la frontiere de securite. **Toute** verification d'autorisation se fait la, jamais dans le client.
- Une fonction = une responsabilite. Les `query` sont pures et sans effet de bord. Les effets externes (mail, paiement, appel HTTP) vont dans une `action`, jamais dans une `mutation`.
- Le schema (`convex/schema.ts`) est la source de verite. On ne stocke pas de champ non declare.
- Chaque fonction publique commence par resoudre l'identite : pas d'identite = on jette, avant toute lecture.

### Supabase (defaut quand le client doit pouvoir reprendre le projet)
- RLS activee sur **toutes** les tables, sans exception, des la creation. Une table sans policy est une table publique.
- La `service_role key` ne quitte jamais le serveur. Si elle apparait cote client, c'est un incident, pas un bug.
- Les migrations sont versionnees dans le repo. Pas de modification via le dashboard en prod.

## Definition of done

Une story n'est terminee que si :

- [ ] `pnpm check` passe
- [ ] Les cas d'erreur et l'etat vide sont geres dans l'UI (pas seulement le happy path)
- [ ] Navigable au clavier, teste en 375px de large
- [ ] Aucun secret ni donnee client dans le diff
- [ ] Le README ou l'ADR est a jour si le comportement change
- [ ] Les textes sont en francais correct, en voix active, sans jargon technique visible par l'utilisateur final

## Ce qu'on ne fait pas

- Refactorer du code non demande pendant une story.
- "Corriger" le formatage de fichiers hors du perimetre de la story (ca pollue le diff).
- Ajouter des commentaires qui paraphrasent le code.
- Supprimer des tests qui echouent pour faire passer la CI.
