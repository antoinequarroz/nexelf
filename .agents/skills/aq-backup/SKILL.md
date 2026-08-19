---
name: aq-backup
description: Conçoit, configure, documente et teste la sauvegarde et la restauration d'un projet AQ. À utiliser pour définir un plan de reprise, RPO/RTO, rétention, chiffrement, copies hors fournisseur, restauration après suppression ou corruption, ou protéger Convex, Supabase/Postgres, Directus, Better Auth, fichiers, médias, contenu, configuration, DNS, Stripe, RevenueCat, EAS et services externes. Fonctionne pour vitrine, CMS, SaaS et mobile, avec un test de restauration isolé obligatoire. Ne jamais lancer une restauration destructive de production sans confirmation explicite.
---

# Backup AQ

Une sauvegarde n'existe réellement qu'après une restauration réussie. Protéger le service complet, pas seulement la table principale.

## Garde-fous

- Commencer par des inventaires et vérifications en lecture seule.
- Ne jamais restaurer, remplacer, purger ou importer dans la production sans autorisation explicite et identification exacte de la cible.
- Avant toute restauration destructive, créer si possible une sauvegarde de l'état actuel, annoncer l'indisponibilité et disposer d'un retour arrière.
- Tester par défaut dans un projet, déploiement ou base isolé sans trafic ni intégration externe active.
- Chiffrer les copies contenant des données personnelles et limiter les accès.
- Ne jamais mettre secrets, exports clients ou sauvegardes dans Git.

## 1. Définir le besoin métier

Lire `AGENTS.md`, l'architecture, l'hébergement, les services et les contrats. Poser un bloc de questions à la fois :

1. Quels incidents doivent être récupérables : suppression, corruption, compte supprimé, fournisseur indisponible, mauvaise migration, perte de domaine ou compromission ?
2. Combien de données peut-on perdre ? Définir le **RPO** en temps.
3. Combien de temps le service peut-il rester indisponible ? Définir le **RTO**.
4. Quelles obligations de conservation, résidence, suppression et coûts s'appliquent ?
5. Qui décide d'une restauration, qui l'exécute et qui communique au client ?

Proposer un niveau proportionné : vitrine légère, CMS critique pour le contenu, SaaS critique pour données/auth, mobile selon le backend partagé.

## 2. Inventorier tout l'état

Copier `assets/backup.md` vers `docs/backup.md`. Lire `references/project-state.md` et lister :

- code, historique Git, releases et artefacts reproductibles ;
- base, auth, fichiers et médias ;
- schéma, migrations, fonctions, cron et configuration ;
- variables d'environnement et secrets via un gestionnaire approprié ;
- contenu CMS et traductions ;
- domaine, DNS, certificats et configuration d'hébergement ;
- fournisseurs externes, identifiants de produits/prix, webhooks et accès ;
- stores mobiles, configuration EAS, signatures et deep links.

Pour chaque élément, noter la source de vérité, ce que le fournisseur sauvegarde réellement, ce qui est exclu et comment le reconstruire.

## 3. Concevoir la politique

Définir pour chaque actif : fréquence, rétention, emplacement, chiffrement, propriétaire, alerte d'échec, procédure de restauration et preuve du dernier test.

- Aligner la fréquence sur le RPO ; une sauvegarde quotidienne ne satisfait pas un RPO d'une heure.
- Conserver plusieurs points dans le temps pour détecter tardivement une corruption.
- Garder au moins une copie récupérable indépendamment du compte/fournisseur principal lorsque le risque le justifie.
- Séparer les identifiants permettant de restaurer des données des données sauvegardées.
- Vérifier que la suppression légale peut aussi être appliquée aux sauvegardes selon la politique validée avec `aq-nlpd`.
- Budgéter stockage, trafic, PITR et temps humain.

Ne pas présenter la réplication, la corbeille ou Git comme une sauvegarde complète : ils couvrent des incidents différents.

## 4. Configurer par plateforme

Choisir uniquement les références pertinentes :

- Convex : `references/convex.md` ;
- Supabase, Postgres ou Directus : `references/postgres-directus.md` ;
- projet web/mobile et services externes : `references/project-state.md`.

Utiliser la documentation officielle actuelle et vérifier le plan souscrit : fréquence, rétention et fonctionnalités évoluent. Activer alertes et automatisation quand possible. Documenter les étapes manuelles impossibles à automatiser.

## 5. Préparer le runbook de restauration

Écrire une procédure exécutable par une autre personne :

1. déclarer l'incident et geler les écritures si nécessaire ;
2. identifier l'instant sain et l'étendue de la perte ;
3. préserver l'état courant et les preuves ;
4. créer la cible isolée et désactiver emails, paiements, webhooks et jobs ;
5. restaurer code/configuration, schéma, données puis fichiers dans l'ordre requis ;
6. reconfigurer auth, secrets, URLs, DNS et intégrations non incluses ;
7. exécuter les contrôles d'intégrité et parcours prioritaires ;
8. mesurer RPO/RTO obtenus ;
9. décider explicitement du basculement ;
10. surveiller, communiquer et faire une rétrospective.

Ne jamais utiliser de données de production restaurées sur un environnement moins sécurisé ou accessible à davantage de personnes.

## 6. Tester la restauration

Réaliser un exercice trimestriel pour les projets avec données client, au minimum annuel pour une vitrine simple.

- Choisir une sauvegarde existante sans la modifier.
- Restaurer dans une cible isolée et compatible.
- Empêcher tout effet externe : email, Stripe, RevenueCat, notifications, cron et webhooks sortants.
- Vérifier nombres d'enregistrements, relations, fichiers, comptes de test, contenu publié et migrations.
- Tester connexion, lecture, écriture contrôlée, upload et parcours métier critique.
- Chronométrer récupération et perte de données effective.
- Supprimer proprement la cible de test après conservation des preuves autorisées.

Un export lisible n'est pas un test de restauration.

## 7. Préparer l'urgence

Attribuer les rôles : décideur, opérateur, contact client, fournisseur et sécurité. Garder le runbook accessible même si le service principal ou le compte d'Antoine est indisponible. Le client possède les comptes ; Antoine dispose seulement des accès délégués nécessaires.

Pour une compromission, ne pas réinjecter aveuglément secrets ou code suspects. Faire tourner les secrets, révoquer les accès, préserver les preuves et utiliser `aq-audit` avant remise en ligne.

## 8. Vérifier et transmettre

- RPO/RTO validés par le client.
- Tous les actifs ont un propriétaire et une méthode de récupération.
- Sauvegardes et alertes visibles.
- Copie indépendante testée si requise.
- Runbook suivi par une personne autre que son auteur si possible.
- Restauration isolée réussie avec preuve, durée et écarts.
- Actions manuelles, coûts et limites remis via `aq-handover`.
- Prochain test planifié via `aq-maintenance`.

Terminer par **Couverture**, **RPO/RTO**, **Dernière sauvegarde**, **Restauration testée**, **Écarts**, **Prochain exercice**.
