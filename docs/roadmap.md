# Roadmap — Nexelf

## MVP

| #   | Story                                            | Taille | Dépend de  |
| --- | ------------------------------------------------ | ------ | ---------- |
| 01  | Créer et maîtriser son compte                    | M      | aucune     |
| 02  | Terminer l'onboarding et obtenir un premier plan | L      | 01         |
| 03  | Gérer ses objectifs                              | L      | 01         |
| 04  | Consulter et adapter son planning quotidien      | L      | 02, 03     |
| 05  | Commencer et clôturer sa journée                 | M      | 04         |
| 06  | Adapter sa journée avec le copilote              | L      | 04         |
| 07  | Contrôler la mémoire de Nexelf                   | L      | 06         |
| 08  | Suivre ses habitudes et routines                 | M      | 03, 04     |
| 09  | Utiliser l'essentiel sans réseau                 | L      | 04, 05, 08 |
| 10  | Recevoir des rappels choisis                     | M      | 04, 05     |
| 11  | Comprendre sa progression hebdomadaire           | M      | 05, 08     |
| 12  | Découvrir et restaurer Nexelf Pro                | M      | 01, 06     |
| 13  | Obtenir de l'aide et signaler un problème        | M      | 01, 06     |

Total : 7 M, 6 L. L'accessibilité, le français/anglais, la sécurité, les états dégradés et l'observabilité sont transversaux.

## Ordre de construction

1. **Fondations** — compte, sécurité, modèle de données, i18n.
2. **Première valeur** — onboarding, objectifs, premier plan et briefing réel.
3. **Boucle quotidienne** — actions, revue du soir et historique.
4. **Intelligence contrôlée** — copilote, confirmations, garde-fous et mémoire.
5. **Résilience** — hors-ligne, synchronisation, notifications et erreurs.
6. **Progression et revenu** — insights, RevenueCat, support et opérations.
7. **Validation** — accessibilité, sécurité, performance et préparation stores.

Construire chaque tranche de bout en bout, avec ses états vide, chargement, erreur et permissions, avant de passer à la suivante.

## Phase 2

| Story                                          | Pourquoi pas maintenant                                         |
| ---------------------------------------------- | --------------------------------------------------------------- |
| Synchroniser Apple Calendar et Google Calendar | OAuth, conflits et récurrences élargissent fortement la surface |
| Connecter Apple Health et Health Connect       | Données sensibles et nouveau cadrage juridique requis           |
| Ajouter widgets, voix et audio                 | N'améliore pas la preuve de valeur centrale                     |
| Ajouter automatisations et mémoire avancées    | Nécessite d'abord des usages réels et des évaluations IA        |
| Créer une version web                          | Nouveau produit et nouvelle surface de test                     |
| Partager un bilan avec un proche ou coach      | Permissions et confidentialité supplémentaires                  |
| Ajouter mode clair et personnalisation avancée | Quiet Command sombre suffit à valider le produit                |
| Intégrer météo et sport                        | Dépendances externes non nécessaires au parcours principal      |

## Écarté

| Idée                                | Raison de l'écarter                                        |
| ----------------------------------- | ---------------------------------------------------------- |
| Réseau social et classements        | Contredit l'accompagnement personnel calme                 |
| Publicité et revente de données     | Contredit la confiance nécessaire à la mémoire personnelle |
| Score global de la personne         | Réducteur, culpabilisant et facilement mal interprété      |
| Actions autonomes non confirmées    | Retire le contrôle final promis à l'utilisateur            |
| Diagnostic médical ou psychologique | Hors rôle et à haut risque                                 |
| Localisation permanente             | Intrusive et non nécessaire au cœur du produit             |
| Management d'employés               | Transforme Nexelf en outil de surveillance B2B             |

## Risques

1. Si les 13 stories sont construites en parallèle, alors le parcours principal restera impossible à tester jusqu'à la fin ; les livrer dans l'ordre vertical défini.
2. Si chaque réponse IA consomme le contexte complet, alors coût et latence augmenteront avec l'ancienneté ; résumer et budgéter la mémoire dès la première version.
3. Si le hors-ligne est ajouté après le planning, alors la couche de mutations devra être réécrite ; concevoir la file locale avant les actions quotidiennes.
4. Si les intégrations santé entrent sans nouveau cadrage, alors Nexelf traitera des données sensibles sans architecture adaptée ; les bloquer derrière une ADR et une revue juridique.
5. Si les confirmations IA deviennent trop fréquentes, alors l'expérience sera pénible ; mesurer acceptation, refus et annulation pour ajuster leur granularité.
