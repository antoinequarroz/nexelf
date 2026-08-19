---
name: aq-maintenance
description: >-
  Audite, exécute et documente la maintenance récurrente d'un projet AQ déjà livré : disponibilité, parcours critiques, Sentry, emails, paiements, domaines, certificats, sauvegardes, dépendances, sécurité, performance, SEO, conformité, accès, quotas, coûts et obsolescence. À utiliser pour un contrôle mensuel, trimestriel ou annuel, un forfait de maintenance, une revue de santé, un rapport client ou quand un site/SaaS/CMS/app mobile doit être maintenu. Fonctionne pour vitrine, CMS, SaaS et mobile, distingue vérification, correction incluse et évolution hors forfait, et exige des preuves avant de déclarer un point sain.
---

# Maintenance AQ

Maintenir la capacité du produit à rendre son service, pas seulement obtenir un voyant vert. Exécuter ce qui est autorisé et vérifiable ; ne jamais cocher un point sur supposition.

## Garde-fous

- Commencer en lecture seule et inspecter le contrat, le dernier rapport, les alertes et les changements depuis la dernière passe.
- Ne pas déployer, renouveler, acheter, changer un plan, restaurer, révoquer un accès ou mettre à jour une version majeure sans autorisation correspondant au contrat.
- Ne jamais faire de mise à jour large. Better Auth, Convex et leur intégration restent épinglés et se mettent à niveau dans une opération dédiée.
- Préserver les changements locaux existants et séparer toute correction fonctionnelle importante dans une story/branche.
- Masquer secrets et données personnelles dans les rapports, captures et logs.
- Classer chaque constat avant d'agir : urgence, correction de maintenance, recommandation ou évolution hors périmètre.

## 1. Cadrer la passe

Lire `AGENTS.md`, README, architecture, contrat/SLA, `docs/maintenance/`, `docs/backup.md`, `docs/monitoring.md`, incidents et rapports précédents.

Demander seulement ce qui manque :

1. Passe mensuelle, trimestrielle, annuelle, reprise après incident ou bilan avant renouvellement ?
2. Quelles surfaces et environnements sont couverts ?
3. Quels parcours sont critiques et quel niveau de disponibilité a été promis ?
4. Quelles corrections sont incluses, quelle limite de temps/coût et qui approuve le dépassement ?
5. Qui reçoit les alertes et le rapport ?

Créer un dossier daté `docs/maintenance/YYYY-MM-DD.md` depuis `assets/report.md`. Ne jamais écraser un ancien rapport.

## 2. Établir un état de référence

Avant toute mutation, noter : version/release déployée, commit, état des services, incidents ouverts, volume d'erreurs, performance de référence, quotas, coûts et dernière sauvegarde/restauration.

Choisir la variante du projet dans `references/profiles.md`. Pour chaque contrôle, conserver une preuve proportionnée : commande et résultat, identifiant d'événement, horodatage, capture sans donnée sensible ou URL publique.

## 3. Passe mensuelle — continuité du service

Vérifier ce qui casse silencieusement :

- disponibilité sur domaine canonique, mobile/desktop, SSL et redirections ;
- parcours e2e critiques en production avec comptes et données de test dédiés ;
- formulaire réellement reçu, email réellement délivré, auth et récupération si concernés ;
- Sentry : nouvelles erreurs, régressions, alertes délivrées et propriétaires actifs ;
- paiement test/sandbox ou contrôle non destructif des webhooks et événements échoués ;
- publication/édition CMS et upload contrôlés si prévus au contrat ;
- stores, build distribué, OTA, deep links et crashs pour mobile ;
- tâches planifiées, files, webhooks, intégrations et derniers succès ;
- disponibilité des sauvegardes, sans confondre présence et restauration ;
- expiration proche, quota, stockage, facture ou moyen de paiement menaçant le service.

Ne pas envoyer de vrai paiement, notification client ou contenu public pendant un test. Utiliser sandbox, ressources dédiées et nettoyage documenté.

## 4. Passe trimestrielle — dérive technique

Lire `references/dependencies.md`, puis :

- inventorier dépendances obsolètes, advisories, versions runtime et images CI ;
- appliquer seulement les correctifs compatibles et autorisés, avec diff relu et tests avant déploiement ;
- lancer checks, tests unitaires et e2e pertinents ;
- utiliser `aq-backup` pour restaurer une sauvegarde dans une cible isolée et mesurer RPO/RTO ;
- utiliser `aq-performance` pour comparer aux mesures précédentes ;
- vérifier liens, médias, formulaires, indexabilité/SEO et contenu critique obsolète ;
- examiner volumétrie, index, requêtes lentes, journaux, rétention et coûts ;
- contrôler SPF/DKIM/DMARC, bounces/plaintes et délivrabilité avec `aq-email` ;
- revoir bruit, sampling, source maps et alertes avec `aq-sentry` ;
- rechercher secrets exposés, droits excessifs et vulnérabilités avec `aq-audit` selon le risque.

Une correction qui modifie le comportement produit, le schéma, l'auth, le paiement ou l'architecture devient une story séparée avec plan de retour arrière.

## 5. Passe annuelle — propriété et pérennité

- Domaine, registrar, renouvellement automatique, DNS, certificats et contacts d'urgence.
- Propriété client, facturation, accès délégués, MFA, comptes partagés, anciens collaborateurs et clés/API inutilisées.
- Contrats, plans, limites, tarifs, régions de données et dépendance aux fournisseurs.
- Versions encore supportées de Node, Nuxt, Expo, base, auth et CI ; planifier séparément les migrations majeures.
- Politique de confidentialité, consentement, sous-traitants, conservation, export/suppression via `aq-nlpd`.
- Procédures `aq-backup`, incident, passation et reprise par un autre prestataire.
- Documentation réellement exécutable sur une machine propre et contacts encore valides.
- Utilité des fonctionnalités, analytics, contenus et services payants ; supprimer seulement après décision.

Présenter les risques à 12 mois avec coût approximatif, urgence et alternative. Ne pas créer artificiellement du travail.

## 6. Triage et corrections

Classer chaque constat :

| Niveau | Sens | Action |
|---|---|---|
| P0 | service compromis, données ou sécurité en danger | contenir, alerter immédiatement, suivre le runbook |
| P1 | parcours critique cassé ou perte imminente | corriger/faire approuver aujourd'hui |
| P2 | dégradation réelle sans urgence immédiate | planifier dans la maintenance/story |
| P3 | amélioration ou dette sans impact démontré | recommander, ne pas gonfler le rapport |

Pour toute correction : reproduire, identifier la cause, limiter le diff, tester, prévoir retour arrière, déployer selon l'autorisation, puis vérifier le parcours en production. Utiliser `aq-story` pour une correction non triviale.

## 7. Gérer les dépendances

Ne pas prendre « dernière version » comme objectif. Évaluer support, sécurité, changelog, peer dependencies et risque de migration.

- Patch : appliquer si tests et compatibilité passent.
- Minor : vérifier breaking changes réelles et surface touchée.
- Major : ticket/branche/devis séparés, jamais cachés dans une passe.
- Auth, base, paiement, build mobile : toujours traiter comme sensibles même si le numéro semble mineur.

Après changement, comparer build, taille, tests, erreurs Sentry et parcours critique. Ne pas déployer un lockfile modifié sans comprendre pourquoi.

## 8. Produire le rapport client

Compléter `docs/maintenance/YYYY-MM-DD.md` en langage non technique :

- santé globale et période couverte ;
- contrôles réellement exécutés et preuves ;
- corrections réalisées avec impact ;
- incidents/risques classés ;
- décisions requises, options, coût et délai ;
- travaux hors forfait clairement séparés ;
- sauvegarde/restauration et prochaine échéance ;
- temps passé si le contrat l'exige.

Ne pas noyer le client sous les mises à jour de paquets. Traduire en risque ou bénéfice concret. Un contrôle non exécutable devient « non vérifié », jamais « OK ».

## 9. Clôturer

- Tous les P0/P1 sont résolus, contenus ou explicitement escaladés.
- Le dépôt et la production correspondent à une release connue.
- Tests post-déploiement exécutés.
- Alertes, accès temporaires et données de test nettoyés.
- Rapport remis et décisions assignées avec échéance.
- Prochaine passe et exercice de restauration planifiés.
- Une découverte réutilisable peut alimenter `aq-kit-retro`, sans ajouter une règle sur un incident unique.

Terminer par **Santé**, **Vérifié**, **Corrigé**, **Risques**, **Décisions client**, **Prochaine échéance**.
