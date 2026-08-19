---
name: aq-init
description: Initialise un nouveau projet AQ de bout en bout — questions de cadrage, direction artistique et design tokens, scaffolding de la base (vitrine, cms, saas ou mobile), i18n, Sentry, Playwright, création du dépôt GitHub et premier commit. À utiliser au tout début d'un projet, quand l'utilisateur dit "nouveau projet", "on démarre un site pour X", "init", "je commence un SaaS", "nouvelle app mobile", ou lance /aq-init. Ne pas utiliser pour ajouter une fonctionnalité à un projet existant.
---

# Init projet AQ

<objective>
Passer d'un dossier vide à un dépôt GitHub qui tourne, configuré exactement selon les conventions d'Antoine Quarroz, avec la direction artistique décidée et écrite avant qu'une seule ligne d'UI ne soit produite. L'utilisateur ne doit répondre qu'à des questions qui ont un impact réel sur le résultat.
</objective>

<deux_chemins>
**Le projet a-t-il déjà été créé avec `scripts/nouveau.mjs` ?**

Vérifier : présence d'un `package.json`, d'un `AGENTS.md` et d'un dossier `.git`.

- **Oui** → le code, les skills et le dépôt GitHub existent déjà. **Sauter les étapes 3, 4, 5, 6 et 7.** Ne faire que : étape 1 (cadrage), étape 2 (direction artistique et tokens), étape 8 (documentation). C'est le cas normal.
- **Non**, dossier vide → **lancer le script toi-même**, ne pas le faire taper à l'utilisateur :

  ```bash
  aq new <base> <nom> [--client]
  ```

  Déduire la base du bloc B de l'étape 1, le nom du contexte, et `--client` de la réponse « client ou perso ». Le script clone, détache l'historique, installe les skills, vérifie l'absence de secrets et crée le dépôt — il demandera lui-même confirmation avant de pousser.

  Puis enchaîner sur les étapes 2 et 8 uniquement.

  **Ne dérouler les 8 étapes à la main que si** le script échoue, si la base n'a pas de starter (`mobile` pour l'instant), ou si l'on régénère volontairement un starter avec des versions fraîches.

Ne jamais rescaffolder par-dessus un projet existant. Si un `package.json` est présent et que l'utilisateur demande un init, demander lequel des deux chemins avant de toucher à quoi que ce soit.
</deux_chemins>

<strict_order>
Suivre cet ordre exactement. Ne pas fusionner, réordonner ni sauter d'étape, sauf si l'utilisateur le demande explicitement.

1. `steps/01-cadrage.md` — ce que fait le projet, qui l'utilise, quelle base
2. `steps/02-design.md` — direction artistique et design tokens
3. `steps/03-scaffold.md` — création de la base selon le type retenu
4. `steps/04-socle.md` — i18n, Tailwind, ESLint, Vitest, conventions
5. `steps/05-sentry.md` — monitoring
6. `steps/06-tests.md` — Playwright (web) ou Maestro (mobile), 3 tests fondateurs
7. `steps/07-github.md` — dépôt GitHub, premier commit, CI
8. `steps/08-final.md` — AGENTS.md, README, ADR initiale, récapitulatif

Après chaque étape, afficher une ligne de statut et enchaîner. Ne pas redemander la permission entre chaque étape : l'utilisateur a lancé l'init, il veut que ça avance.
</strict_order>

<when_to_use>
- Nouveau projet client ou perso, dossier vide ou presque
- L'utilisateur dit : nouveau projet, on démarre, init, je lance un site pour, nouvelle app

À ne PAS utiliser pour :
- Ajouter une feature à un projet existant
- Reprendre un projet déjà scaffoldé (utiliser `setup-*` ciblé à la place)
- Cadrer un besoin client sans coder (utiliser `aq-brief`)
</when_to_use>

## Les quatre bases

| Base | Pour quoi | Détail |
|---|---|---|
| `vitrine` | Site public, contenu qui bouge peu | `references/stacks.md` |
| `cms` | Le client édite son contenu lui-même | `references/stacks.md` |
| `saas` | Comptes, données par utilisateur, abonnement | `references/stacks.md` |
| `mobile` | React Native / Expo | `references/stacks.md` |

Lire `references/stacks.md` **avant** l'étape 3 : il contient les paquets exacts, les versions épinglées et les pièges de chaque base.

## Règles de conduite

- **Une question à la fois, groupée par thème.** Ne jamais envoyer les 20 questions d'un coup.
- **Proposer un défaut sur chaque question.** L'utilisateur doit pouvoir répondre « ok » et avancer. Le défaut est celui des conventions AQ.
- **Ne pas demander ce qui se déduit.** Si le nom du dossier est `cabinet-dupont`, le nom du projet est trouvé. Si l'utilisateur a dit « app mobile », la base est trouvée.
- **Rien d'irréversible sans confirmation explicite** : création du dépôt GitHub, premier push, installation de dépendances lourdes.
- **Ne jamais inventer une clé d'API.** Si un service en demande une, laisser la variable vide dans `.env.local`, la lister dans `.env.example`, et la signaler dans le récapitulatif final.

## Sortie attendue

À la fin, le projet contient :

```
AGENTS.md            # règles projet (CLAUDE.md en copie)
README.md            # comment lancer, comment déployer
.env.example         # toutes les variables, valeurs bidons
docs/design.md       # direction artistique décidée
docs/adr/0001-*.md   # choix de la base et de l'hébergeur
.agents/skills/      # skills AQ installées pour Codex
.claude/skills/      # idem pour Claude Code
```

et `pnpm dev` démarre sans erreur.

## Récapitulatif final

Terminer par exactement trois listes, rien d'autre :

- **Fait** — ce qui tourne
- **À toi de jouer** — clés d'API à créer, comptes à ouvrir, DNS à pointer
- **Décidé** — les arbitrages pris pendant l'init, avec un renvoi vers l'ADR
