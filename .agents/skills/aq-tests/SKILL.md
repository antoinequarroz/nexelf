---
name: aq-tests
description: Écrit les tests d'un projet AQ — Playwright pour le web, Maestro pour Expo, Vitest pour l'unitaire. À utiliser quand on ajoute des tests à une fonctionnalité, quand on met en place la suite de tests initiale, quand un bug doit être verrouillé par un test, ou quand l'utilisateur dit "écris des tests", "ajoute un test e2e", "teste ce parcours".
---

# Tests

## Principe

L'objectif n'est pas la couverture, c'est de savoir en cinq minutes si le produit est cassé. Trois tests qui tournent valent mieux que trente qu'on ignore.

## Outils

| Cible | Outil |
|---|---|
| Parcours web | Playwright |
| Parcours mobile (Expo) | Maestro |
| Logique pure, helpers, validation | Vitest |
| Fonctions Convex | Vitest + `convex-test` |

Playwright ne pilote pas une app native. Ne pas essayer.

## Les trois tests fondateurs

Toujours ces trois-là en premier, adaptés au projet :

1. La page ou l'écran d'accueil charge, sans erreur console.
2. Le parcours d'entrée fonctionne (formulaire de contact, ou inscription puis connexion).
3. Le parcours principal du produit aboutit.

Sur un projet avec comptes, ajouter un quatrième qui compte double : **un utilisateur A ne peut pas lire les données d'un utilisateur B.** C'est un test de sécurité ; il ne se supprime jamais.

## Règles d'écriture

- Sélecteurs par rôle et par texte accessible, pas par classe CSS. Un test qui casse au moindre changement de style ne sera pas maintenu.
- Chaque test crée ses propres données et les nettoie. Pas de dépendance à l'ordre d'exécution.
- Jamais de test sur des données de production.
- Pas de `sleep` arbitraire : attendre une condition.
- Un test qui échoue au hasard est pire qu'aucun test. Le réparer ou le supprimer — jamais le désactiver « temporairement ».

## Quand un bug est corrigé

Écrire d'abord le test qui échoue, corriger ensuite. Sinon on ne sait pas si la correction corrige quelque chose.

## En CI

`pnpm test` à chaque push, `pnpm e2e` sur les pull requests seulement. Un CI lent finit contourné.
