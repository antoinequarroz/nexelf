---
name: aq-jobs
description: >-
  Cadre, conçoit, implémente et valide les tâches asynchrones et planifiées
  d'un CMS, SaaS ou backend mobile AQ avec Convex : scheduler, cron, files,
  traitements longs, imports/exports, retries, backoff, idempotence,
  concurrence, états, progression, annulation, dead letters, observabilité et
  relance admin. À utiliser pour emails et notifications différés, nettoyage,
  synchronisation Stripe/RevenueCat, expiration, rapports ou tout effet externe
  qui ne doit pas vivre dans une mutation ou bloquer une requête utilisateur.
---

# Jobs asynchrones AQ

Rendre les traitements fiables sous retry, concurrence, interruption et duplication. Un job « lancé » n'est pas un job réussi.

## 1. Cadrer le travail

Lire `AGENTS.md`, le schéma Convex, les intégrations et l'observabilité. Poser progressivement :

- Quel événement déclenche le travail : action utilisateur, webhook, cron ou admin ?
- Quel résultat métier prouve la réussite et sous quel délai ?
- Le traitement appelle-t-il un service externe, parcourt-il beaucoup de données ou génère-t-il un fichier ?
- Peut-il être exécuté deux fois sans dommage ? Peut-il être découpé et repris ?
- Qui doit voir progression, erreur, annulation ou résultat ?
- Quels volumes, pics, limites fournisseur et exigences de rétention ?

Ne pas créer une file générique si `ctx.scheduler` et une fonction interne idempotente suffisent. Ne pas exécuter d'appel réseau externe dans une mutation Convex.

## 2. Écrire le catalogue

Copier `assets/jobs-plan.md` vers `docs/jobs.md`. Pour chaque job, définir : déclencheur, payload minimal, propriétaire, priorité, idempotency key, étapes, timeout, retries, résultat, compensation, observabilité, rétention et procédure manuelle.

Choisir le mécanisme après le catalogue :

- **scheduler immédiat/différé** pour un travail ponctuel issu d'un événement ;
- **cron** pour une cadence fixe et un balayage idempotent ;
- **table de jobs + workers bornés** pour visibilité, priorité, reprise ou gros volume ;
- **workflow par étapes** pour les traitements longs avec checkpoints ;
- **fournisseur externe** seulement si durabilité, durée ou intégration dépasse les capacités vérifiées de la stack.

Lire `references/architecture.md` avant le modèle.

## 3. Séparer transaction et effet externe

Dans la mutation métier : valider l'autorisation, appliquer le changement et enregistrer atomiquement l'intention ou un identifiant stable. Planifier ensuite une fonction interne.

Dans l'action/worker : charger l'état serveur frais, réclamer le travail, exécuter l'effet, stocker le résultat puis planifier la suite si nécessaire.

- Ne jamais faire un dual write naïf base + fournisseur.
- Ne jamais transmettre un secret, rôle ou entitlement dans un payload et lui faire confiance plus tard.
- Réévaluer l'autorisation/état métier au moment de l'effet lorsque cela reste pertinent.
- Prévoir réconciliation si l'enregistrement et la planification ne peuvent être atomiques.

## 4. Concevoir l'idempotence

Définir une clé depuis l'événement métier stable, pas depuis la tentative. Garantir atomiquement qu'une seule opération logique possède cette clé.

- Vérifier un résultat existant avant l'effet.
- Passer la clé au fournisseur lorsqu'il supporte officiellement l'idempotence.
- Traiter tout webhook ou callback au moins une fois et le dédupliquer.
- Stocker les identifiants externes nécessaires à la réconciliation.
- Ne pas supposer qu'un timeout signifie échec : le fournisseur peut avoir réussi.

Pour un effet non idempotent, concevoir réservation, état intermédiaire et vérification externe avant retry.

## 5. États, claim et concurrence

Utiliser uniquement les états utiles, par exemple `pending`, `running`, `waiting`, `succeeded`, `failed`, `cancelled`. Stocker tentative, prochaine exécution, lease/claim, erreur classifiée, progression et timestamps si le produit les exploite.

- Réclamer atomiquement un job avec lease expirante.
- Limiter concurrence globale, par type, organisation ou fournisseur.
- Un worker interrompu doit pouvoir être repris après expiration du lease.
- Utiliser checkpoints et curseurs pour lots ; ne pas parcourir toute une table en une exécution.
- Ne jamais maintenir une liste croissante de sous-tâches dans un seul document.

Lire `references/retries.md` pour retries, backoff et dead letters.

## 6. Planifier les cron

- Rendre chaque exécution sûre si la précédente est encore active ou si une occurrence est rejouée.
- Utiliser un verrou/lease borné lorsque les chevauchements sont interdits.
- Paginer le balayage et replanifier le curseur suivant.
- Stocker la dernière progression utile, pas seulement « cron lancé ».
- Définir UTC comme référence et gérer explicitement fuseaux, changements d'heure et jours ouvrés.
- Ne pas supposer une précision à la seconde sans garantie vérifiée.

Un cron doit trouver du travail éligible ; il ne doit pas dépendre d'avoir été exécuté exactement à chaque occurrence.

## 7. Construire l'UX et l'administration

- Pour une action utilisateur longue, répondre rapidement avec un identifiant et afficher `en attente`, progression utile, résultat et erreur récupérable.
- Préserver la navigation ; notifier avec `aq-notifications` quand le résultat arrive.
- Permettre annulation uniquement jusqu'au point réellement annulable et expliquer les effets déjà accomplis.
- Utiliser `aq-admin-dashboard` pour filtrer les échecs, inspecter une erreur nettoyée, relancer ou annuler selon permission.
- Une relance manuelle réutilise la même définition et les mêmes garde-fous ; elle est auditée.
- Ne jamais afficher payload, secrets ou contenu personnel complet aux opérateurs sans nécessité.

## 8. Observer et alerter

Mesurer : jobs créés, âge du plus ancien, durée, débit, retries, échecs définitifs, profondeur et taux de réussite par type.

- Envoyer à Sentry les exceptions inattendues avec identifiant de job et contexte minimal.
- Ne pas alerter à chaque retry attendu ; alerter sur backlog, âge, taux d'échec ou dead letter.
- Utiliser logs structurés corrélés, sans corps d'email, token, fichier ou données sensibles.
- Définir un runbook : diagnostiquer, stopper la création, activer un kill switch, réconcilier, relancer et confirmer.

## 9. Relier les skills

- `aq-email` et `aq-notifications` : livraisons différées, retries et déduplication.
- `aq-files-storage` : imports, exports et nettoyage d'orphelins.
- `aq-stripe` / `aq-revenuecat` : webhooks, réconciliation et effets idempotents.
- `aq-feature-flags` : kill switch d'un producteur/worker sans contourner la sécurité.
- `aq-backup` : restauration cohérente entre données métier, jobs et effets externes.
- `aq-maintenance` : revue des échecs, cron inactifs et coûts.

## 10. Tester les scénarios difficiles

Tester au minimum :

- double création et double exécution ;
- interruption avant, pendant et après l'effet externe ;
- timeout avec succès externe inconnu ;
- retry temporaire, erreur permanente et backoff ;
- deux workers réclament le même job ;
- lease expirée et reprise ;
- rate limit fournisseur et limite de concurrence ;
- cron chevauché, occurrence manquée et changement de fuseau ;
- lot volumineux avec pagination/checkpoint ;
- annulation et relance admin non autorisée ;
- suppression d'utilisateur/organisation pendant l'attente ;
- dead letter, alerte, réparation et réconciliation ;
- aucun secret ni payload sensible dans client, logs ou Sentry.

## Résultat attendu

- catalogue et mécanisme proportionné ;
- intention durable séparée de l'effet externe ;
- idempotence et concurrence prouvées ;
- retries bornés et erreurs classifiées ;
- lots reprenables et cron non fragiles ;
- UX de progression/erreur claire ;
- métriques, alertes, dead letters et runbook ;
- tests d'interruption et duplication réussis.

Terminer par **Catalogue**, **Architecture**, **Idempotence**, **Retries**, **Cron**, **UX**, **Observabilité**, **Reste manuel**.
