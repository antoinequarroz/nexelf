# Étape 6 — Tests fondateurs

Trois tests. Pas trente. L'objectif n'est pas la couverture, c'est de savoir dans les cinq minutes si le site est cassé.

## Outils

- Web : Playwright.
- Mobile : Maestro. (Pas Playwright — il ne pilote pas une app native.)

## Les trois tests, selon la base

**vitrine**
1. La page d'accueil charge, titre correct, pas d'erreur console.
2. Le formulaire de contact part et affiche la confirmation.
3. La navigation principale mène à des pages qui existent (pas de 404).

**cms**
1. La page d'accueil charge avec du contenu venant du CMS.
2. Un éditeur se connecte au back-office.
3. Une modification de contenu apparaît côté public.

**saas**
1. Inscription puis connexion aboutissent.
2. Le parcours principal du produit aboutit pour un utilisateur connecté.
3. Un utilisateur non authentifié ne voit **pas** les données d'un autre. C'est un test de sécurité, il compte double.

**mobile**
1. L'app démarre et affiche l'écran d'accueil.
2. Connexion réussie.
3. Le parcours principal aboutit.

## Règles

- Les tests tournent sur des données de test, jamais sur la prod.
- Un test qui échoue au hasard est pire qu'aucun test : le réparer ou le supprimer, jamais le désactiver « temporairement ».
- Les tests tournent en CI à chaque PR (mis en place à l'étape 7).
- Si `aq-tests` est disponible, l'utiliser pour la rédaction.
