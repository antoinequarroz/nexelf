---
name: aq-search
description: >-
  Cadre, conçoit, implémente et valide la recherche d'un CMS, SaaS ou app
  mobile AQ : recherche plein texte, filtres, facettes, tri, pagination,
  suggestions, index Convex ou moteur externe, synchronisation, permissions par
  organisation, pertinence, UX, accessibilité et mesure. À utiliser lorsqu'un
  utilisateur doit retrouver rapidement du contenu ou des données sans fuite
  entre tenants, ou lorsque les listes et filtres existants ne suffisent plus.
---

# Recherche AQ

Commencer par les tâches de recherche réelles, pas par le choix d'un moteur. Une recherche rapide qui révèle une donnée interdite reste une faille.

## 1. Cadrer l'intention

Demander : qui cherche quoi, avec quels mots, dans quel périmètre, pour accomplir quelle action ? Quels filtres, langues, fautes, synonymes, volumes, fraîcheur et latence ? La recherche est-elle publique, personnelle ou limitée à une organisation ? Que doit-il se passer sans résultat ou hors ligne ?

Écrire des requêtes exemples et résultats attendus avant l'implémentation. Copier `assets/search-plan.md` vers `docs/search.md`.

## 2. Choisir le mécanisme

- Filtres/index Convex pour recherche structurée, préfixes et volumes compatibles avec les capacités officielles vérifiées.
- Index de recherche Convex si ses limites, langue, filtres et pagination répondent au besoin.
- Moteur externe seulement pour pertinence avancée, typo, facettes, multi-index ou volume prouvé.
- Recherche locale mobile uniquement pour un corpus déjà autorisé et synchronisé.

Lire `references/architecture.md`. Documenter coût, région, limites, fraîcheur, migration et comportement en panne.

## 3. Protéger l'index

- Appliquer l'autorisation côté serveur avant chaque résultat et action.
- Inclure la frontière d'organisation dans l'index et les filtres non contournables ; ne jamais dépendre d'un filtre envoyé par le client.
- Indexer le minimum : exclure secrets, notes internes, brouillons privés et données sensibles inutiles.
- Une suggestion, un compteur, un snippet ou un message d'erreur ne doit pas révéler l'existence d'une ressource interdite.
- Lors d'un retrait de membre ou d'une suppression, révoquer l'accès immédiatement même si l'index externe est en retard.

## 4. Synchroniser sans dérive

Pour un moteur externe, utiliser `aq-jobs` : produire un événement/version, indexer idempotemment, conserver l'identifiant externe et réconcilier périodiquement. Gérer création, mise à jour, suppression, changement d'organisation et rebuild complet. Le système métier reste la source de vérité.

Définir la tolérance à la fraîcheur et afficher une UX adaptée. Prévoir alias/version d'index pour reconstruire sans interruption.

## 5. Concevoir pertinence et UX

- Résultats utiles dès la saisie seulement si latence, coût et accessibilité le permettent ; debounce et annuler les requêtes obsolètes.
- Supporter clavier, focus, lecteurs d'écran et annonce du nombre de résultats.
- Garder requête/filtres partageables dans l'URL sur web lorsque pertinent.
- Afficher filtres actifs, suppression claire, chargement, erreur, vide initial et zéro résultat distincts.
- Utiliser snippets sûrs et surlignage sans injection HTML.
- Ne pas masquer les résultats pertinents derrière un tri opaque ; expliquer filtres métier importants.
- Sur mobile, gérer clavier, réseau lent, historique privé et retour à la liste.

## 6. Mesurer et améliorer

Mesurer sans contenu personnel inutile : taux zéro résultat, reformulation, clic/action après recherche, latence et erreurs. Échantillonner les requêtes seulement avec finalité, rétention et accès définis via `aq-nlpd`.

Construire un petit jeu de requêtes de référence avec résultats attendus. Comparer toute modification de ranking, synonymes ou tokenizer avant déploiement.

## 7. Tester

Tester fautes, accents, apostrophes, Unicode, mots courts/longs, filtres combinés, pagination stable, concurrence de mises à jour, suppression, panne/rebuild d'index, utilisateur retiré, deux organisations, appel direct falsifié, snippets hostiles, accessibilité et performance mobile.

Terminer par **Intentions**, **Moteur**, **Index**, **Permissions**, **UX**, **Pertinence**, **Synchronisation**, **Reste manuel**.
