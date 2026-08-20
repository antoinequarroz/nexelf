# Inventaire des fonctionnalités — Nexelf

Type : mobile — Session du 20 août 2026

## À confirmer

Aucun point fonctionnel ouvert. Les fournisseurs IA, les prix et les durées exactes de conservation seront décidés dans leurs chantiers dédiés.

## Parcours principal

1. L'utilisateur découvre Nexelf et crée son compte.
2. Il décrit la personne qu'il souhaite devenir, ses objectifs et ses contraintes.
3. Nexelf propose un premier plan que l'utilisateur corrige puis valide.
4. Chaque matin, l'utilisateur consulte et adapte son briefing.
5. Il termine, reporte ou déplace ses priorités pendant la journée.
6. Le soir, il réalise une revue de moins de deux minutes.
7. Il confirme ce que Nexelf peut retenir en mémoire.
8. Chaque semaine, il observe sa progression et ajuste sa trajectoire.

## Inventaire

| #   | Fonctionnalité                                            | Domaine                | Qui                 | Taille | Arbitrage |
| --- | --------------------------------------------------------- | ---------------------- | ------------------- | ------ | --------- |
| 1   | Compte, vérification, récupération, export et suppression | Identité               | Utilisateur         | M      | MVP       |
| 2   | Onboarding sauvegardé et premier plan                     | Activation             | Utilisateur         | L      | MVP       |
| 3   | Objectifs court, moyen et long terme                      | Objectifs              | Utilisateur         | L      | MVP       |
| 4   | Planning quotidien intelligent et modifiable              | Planification          | Utilisateur         | L      | MVP       |
| 5   | Morning briefing et evening review                        | Quotidien              | Utilisateur         | M      | MVP       |
| 6   | Copilote conversationnel avec confirmation des actions    | IA                     | Utilisateur         | L      | MVP       |
| 7   | Mémoire consultable, confirmée, corrigible et supprimable | IA / données           | Utilisateur         | L      | MVP       |
| 8   | Habitudes et routines simples                             | Habitudes              | Utilisateur         | M      | MVP       |
| 9   | Cache du jour et synchronisation différée                 | Hors ligne             | Utilisateur         | L      | MVP       |
| 10  | Notifications configurables matin, soir et contextuelles  | Engagement             | Utilisateur         | M      | MVP       |
| 11  | Suivi et trois insights hebdomadaires explicables         | Progression            | Utilisateur         | M      | MVP       |
| 12  | Free/Pro, essai et restauration via RevenueCat            | Monétisation           | Utilisateur         | M      | MVP       |
| 13  | Support, signalement IA et administration minimale        | Opérations             | Utilisateur / admin | M      | MVP       |
| 14  | Calendriers Apple et Google                               | Intégrations           | Utilisateur         | L      | Phase 2   |
| 15  | Apple Health et Health Connect                            | Intégrations sensibles | Utilisateur         | L      | Phase 2   |
| 16  | Widgets mobiles                                           | Mobile                 | Utilisateur         | M      | Phase 2   |
| 17  | Voix, audio et automatisations avancées                   | IA                     | Utilisateur         | L      | Phase 2   |
| 18  | Version web compagnon                                     | Plateforme             | Utilisateur         | L      | Phase 2   |
| 19  | Partage ponctuel avec un coach ou un proche               | Collaboration          | Utilisateur         | L      | Phase 2   |
| 20  | Mode clair et personnalisation avancée                    | Apparence              | Utilisateur         | M      | Phase 2   |
| 21  | Réseau social et classement public                        | Social                 | Tous                | —      | Jamais    |
| 22  | Publicité comportementale ou revente de données           | Monétisation           | Admin               | —      | Jamais    |
| 23  | Score global jugeant la personne                          | Progression            | Utilisateur         | —      | Jamais    |
| 24  | Modification autonome sans confirmation                   | IA                     | Copilote            | —      | Jamais    |
| 25  | Diagnostic médical ou psychologique                       | Santé                  | Copilote            | —      | Jamais    |
| 26  | Surveillance permanente de la localisation                | Données                | Application         | —      | Jamais    |
| 27  | Gestion d'équipes ou surveillance d'employés              | B2B                    | Managers            | —      | Jamais    |

## Décisions structurantes

| Décision                   | Choix                                                      | Conséquence si on change plus tard                                       |
| -------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| Types d'utilisateur        | Un utilisateur individuel ; admin technique interne        | Ajouter coachs ou équipes multiplie les permissions et parcours à tester |
| Validation IA              | Toute mutation importante exige une confirmation           | L'autonomie complète modifierait le modèle d'audit et de confiance       |
| Comportement hors ligne    | Lecture du jour et actions simples, puis synchronisation   | Un mode hors ligne complet imposerait une résolution de conflits métier  |
| Conflit de synchronisation | Dernière modification gagnante avec historique minimal     | Une fusion avancée demanderait un journal d'opérations complet           |
| Suppression du compte      | Corbeille récupérable 7 jours, puis suppression définitive | Changer la rétention affecte conformité, sauvegardes et support          |
| Langues                    | Français et anglais, contenu personnel non traduit         | Traduire le contenu utilisateur ajoute coût IA et risques de sens        |
| Plateformes                | iOS et Android, téléphone uniquement                       | Tablette et web exigent de nouveaux layouts et campagnes de test         |

## Limites décidées

- Volumétrie à un an : 10 000 comptes, 1 000 actifs mensuels.
- Usage intensif Pro : jusqu'à 20 échanges IA par jour.
- Planning : 3 à 5 priorités principales par jour.
- Notifications par défaut : maximum 3 par jour.
- Insights : maximum 3 par semaine.
- Objectifs prioritaires à l'onboarding : 1 à 3.
- Les anciennes conversations sont résumées afin de maîtriser volume et coût.

## Hors périmètre

- Intégrations calendrier, santé, météo, sport et finance dans le MVP.
- Tablette optimisée et version web.
- Collaboration, équipes, coach marketplace et fil social.
- Diagnostic, surveillance permanente et action autonome non confirmée.
