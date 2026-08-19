# Étape 7 — Dépôt GitHub

> Si le projet vient de `scripts/nouveau.mjs`, **cette étape est déjà faite** : historique détaché, commit initial, dépôt créé. Passer à l'étape 8.

## Avant de créer quoi que ce soit

Vérifier `gh auth status`. Si le CLI GitHub n'est pas connecté, s'arrêter et le signaler — ne pas tenter de contourner.

## Confirmation obligatoire

La création d'un dépôt est irréversible côté nommage et visibilité. Demander en une seule fois, avec les valeurs proposées :

> Je crée `{{compte}}/{{nom-du-projet}}`, dépôt **privé**, et je pousse le premier commit. Je confirme ?

- Compte : le GitHub perso d'Antoine, sauf indication contraire.
- Nom : kebab-case, sans nom de client complet si le projet est confidentiel.
- Visibilité : déduite de la réponse « client ou perso » de l'étape 1.

| Projet | Visibilité |
|---|---|
| Client | **Privé**, toujours. Aucune exception sans accord écrit du client. |
| Perso | **Public** |

En cas de doute sur la nature du projet, prendre privé. Passer un dépôt de privé à public se fait en deux clics ; l'inverse ne répare rien, l'historique a déjà été cloné.

### Avant un dépôt public — vérifications supplémentaires, bloquantes

Un dépôt public rend l'historique complet consultable, à jamais. Vérifier :

- [ ] Aucune clé, aucun token, aucun secret dans **l'historique**, pas seulement dans les fichiers actuels
- [ ] Aucune donnée client, aucun nom réel, aucune capture d'écran d'un projet client
- [ ] Aucune URL d'environnement privé ni identifiant de déploiement
- [ ] Les fichiers de contenu ne contiennent pas de brouillon non destiné à être lu

Si un seul point échoue : créer en privé, le signaler, et laisser Antoine décider après nettoyage.

## Séquence

1. `git init`, branche `main`.
2. Vérifier `.gitignore` : `node_modules`, `.env.local`, `.output`, `dist`, `.expo`.
3. **Vérifier qu'aucun secret n'est dans les fichiers à commiter.** Bloquant. Si une clé apparaît, s'arrêter et le signaler.
4. Premier commit : `chore: init projet {{nom}} (base {{base}})`.
5. `gh repo create {{compte}}/{{nom}} --private --source=. --remote=origin --push`
6. Protéger `main` si le projet est collaboratif. Inutile en solo.

## CI

Un seul workflow, `.github/workflows/ci.yml` :

- déclenché sur push et pull request
- `pnpm install`, `pnpm check`, `pnpm test`
- `pnpm e2e` seulement sur les PR, pour ne pas ralentir chaque push

Ne pas configurer le déploiement ici. Le déploiement se fait via `aq-production`, quand le projet a quelque chose à montrer.

## Ne pas faire

- Ne pas pousser sur un dépôt existant sans que l'utilisateur l'ait explicitement demandé.
- Ne pas créer d'organisation, de team ou de secrets de dépôt sans validation.
- Ne pas activer de dépôt public « pour le portfolio » sans accord du client.
