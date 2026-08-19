---
name: aq-release-mobile
description: >-
  Prépare, construit, soumet et valide une release Expo iOS/Android AQ avec EAS
  Build, TestFlight et Google Play : comptes, certificats, identifiants,
  versions, profils, variables, fiches stores, confidentialité, achats,
  phased rollout, OTA, compatibilité backend, monitoring et rollback. À utiliser
  pour une première publication, une mise à jour, un build interne, une
  soumission store ou un incident de release mobile.
---

# Release mobile AQ

Livrer une version reproductible, compatible avec le backend et récupérable en cas de problème. Vérifier les documentations Expo, Apple et Google actuelles avant toute action store.

## 1. Préflight

Lire `AGENTS.md`, `app.json/app.config`, `eas.json`, package IDs, versions Expo, auth, RevenueCat, Sentry, deep links et politique de confidentialité. Demander : propriétaire des comptes, plateformes, environnements, type de release, pays, achats, données collectées, date et stratégie de rollout.

Le client doit idéalement posséder les comptes stores et moyens de paiement. Ne jamais créer/révoquer certificat, profil ou clé sans cible vérifiée et autorisation explicite.

## 2. Écrire le plan

Copier `assets/release-plan.md` vers `docs/release-mobile.md`. Définir version marketing, build numbers monotones, canal, profil EAS, commit, backend/API, migrations, flags, tests, métadonnées, review notes, rollout et rollback.

Lire `references/checklist.md`. Distinguer : build interne, preview, TestFlight/closed testing et production.

## 3. Stabiliser configuration et secrets

- Garder bundle/application IDs immuables et cohérents avec les stores/services.
- Séparer environnements et variables ; aucun secret dans bundle, dépôt ou logs.
- Vérifier credentials push, Sign in with Apple, domaines/liens, Sentry source maps et RevenueCat selon les fonctionnalités.
- Épingler versions et lockfile ; construire depuis un commit propre.
- Documenter qui possède chaque accès et sa rotation.

## 4. Compatibilité backend et OTA

- Le backend doit accepter au minimum la version encore distribuée et la nouvelle.
- Faire les migrations additive/expand avant de supprimer un ancien contrat.
- Versionner payloads, jobs et données locales.
- Utiliser OTA uniquement pour des changements compatibles avec le runtime natif déjà installé et les règles officielles actuelles.
- Associer clairement runtime/version/canal ; tester démarrage froid, update interrompue et fallback.
- Un rollback binaire passe par stores ; préparer flags/kill switches et compatibilité serveur pour limiter l'impact.

## 5. Vérifier le produit

Tester sur appareils physiques iOS/Android : installation propre, upgrade, auth, deep links, push, permissions, offline/reconnexion, paiement/restauration, suppression de compte, liens légaux, accessibilité, performance, crash et analytics consentis.

Appeler `aq-ship`, `aq-audit`, `aq-sentry`, `aq-revenuecat`, `aq-legal-pages` et `aq-accessibility` selon le périmètre.

## 6. Préparer les stores

- Nom, description, mots-clés/catégorie, URL support et politique de confidentialité cohérents avec le produit réel.
- Captures par appareils/langues requises, sans données client.
- Déclarations de données/confidentialité basées sur l'app et tous les SDK, jamais copiées d'un modèle.
- Review notes, compte de démonstration non sensible et étapes pour fonctions cachées.
- Achats, abonnements, restauration et suppression de compte conformes aux règles actuelles.
- Vérifier classification d'âge, droits sur contenus et exigences régionales.

## 7. Construire et soumettre

Vérifier branche/commit, état Git et configuration avant EAS Build. Enregistrer identifiants de build, checksums/artefacts utiles, version et environnement. Tester exactement le binaire soumis, puis soumettre sans modifier silencieusement les métadonnées convenues.

Ces opérations modifient des services externes : demander confirmation avant build payant, soumission, promotion, rollout ou OTA production.

## 8. Déployer et surveiller

Commencer par un groupe interne, puis test store et rollout progressif selon risque. Observer crashes, ANR, démarrage, auth, paiements, jobs, support et métriques clés. Définir seuils d'arrêt avant lancement.

En incident : stopper rollout, activer kill switch sûr, diagnostiquer version/runtime, choisir OTA compatible ou nouveau binaire, communiquer puis vérifier la récupération.

## 9. Clôturer

Conserver preuve de validation, build soumis, version, date, reviewers, décisions et tâches manuelles. Mettre à jour handover et runbook. Ne supprimer d'anciens credentials ou contrats backend qu'après adoption suffisante vérifiée.

Terminer par **Version**, **Build**, **Tests**, **Stores**, **Compatibilité**, **Rollout**, **Monitoring**, **Reste manuel**.
