---
name: aq-ai
description: >-
  Cadre, conçoit, implémente et évalue une fonctionnalité IA dans un CMS, SaaS
  ou backend mobile AQ : cas d'usage, UX, choix de modèle/fournisseur, prompts,
  sorties structurées, streaming, outils, RAG, sécurité, données privées,
  modération, coûts, quotas, observabilité, évaluations et fallback humain. À
  utiliser avant d'ajouter génération, résumé, extraction, assistant, recherche
  sémantique ou automatisation pilotée par un modèle.
---

# Fonctionnalités IA AQ

Partir d'une tâche utilisateur mesurable. Ne pas ajouter un chat générique lorsqu'une action déterministe résout mieux le problème.

## 1. Cadrer la valeur et le risque

Demander : utilisateur, entrée, sortie utile, décision/action influencée, fréquence, langues, latence, coût acceptable et alternative sans IA. Identifier erreurs tolérables, préjudices possibles, données sensibles, mineurs, domaines réglementés et besoin de validation humaine.

Écrire exemples réels de succès/échec et critères avant le fournisseur. Copier `assets/ai-plan.md` vers `docs/ai.md`.

## 2. Choisir l'architecture

Lire `references/safety-evals.md` et consulter la documentation officielle actuelle des modèles envisagés.

- Utiliser un modèle minimal suffisant, avec tâche étroite et sortie structurée.
- Garder clés et appels côté serveur/action ; jamais dans Nuxt/Expo client ni mutation Convex.
- Pour connaissances produit, préférer données structurées/recherche autorisée avant un RAG complexe.
- Pour actions, exposer des outils étroits, validés et autorisés côté serveur ; le modèle propose, le serveur décide.
- Prévoir timeout, retry borné, annulation, fallback et version du prompt/modèle.

## 3. Concevoir l'UX

- Expliquer clairement qu'un résultat est généré lorsqu'une confusion est possible.
- Montrer progression/streaming sans faire croire à une validation.
- Permettre corriger, régénérer, comparer ou revenir à l'original.
- Demander confirmation avant action externe, paiement, suppression, publication ou message à un tiers.
- Préserver le travail utilisateur en cas d'échec et proposer une voie manuelle.
- Afficher limites et provenance utiles, pas une confiance fictive.
- Rendre clavier, lecteur d'écran, mobile et textes longs utilisables.

## 4. Protéger données et outils

- Minimiser/redacter les données envoyées et documenter fournisseur, région, rétention et usage d'entraînement.
- Ne jamais inclure secrets, tokens, autres tenants ou instructions internes inutiles.
- Traiter prompt, documents récupérés et sortie comme non fiables.
- Résister à la prompt injection : séparer instructions/données, allowlist d'outils, validation des arguments et autorisation fraîche.
- Ne pas rendre HTML/Markdown généré sans sanitation adaptée.
- Appliquer `aq-nlpd`, `aq-legal-pages`, quotas et suppression de compte.

## 5. Fiabiliser sorties et actions

- Utiliser schéma strict et validation serveur ; rejeter/réparer de façon bornée.
- Vérifier références, identifiants, montants et permissions contre la source de vérité.
- Pour contenu public ou sensible, ajouter revue humaine proportionnée.
- Rendre les actions idempotentes via `aq-jobs` et journaliser l'intention, jamais le raisonnement privé du modèle.
- Modération et limites dépendent du contenu réel ; prévoir escalade et faux positifs.

## 6. Coûts et limites

Estimer coût par opération et par client à partir des tarifs actuels : entrée, sortie, embeddings, outils, retries et stockage. Appliquer limites serveur par utilisateur/organisation/plan, budgets et alertes. Prévoir contexte borné, cache sûr et modèle de repli sans compromettre la qualité critique.

## 7. Évaluer avant et après lancement

Construire un jeu versionné de cas normaux, limites, multilingues et adversariaux. Noter exactitude utile, conformité au format, refus, hallucination, sécurité, latence et coût. Comparer tout changement de prompt/modèle. Lancer progressivement avec `aq-feature-flags`, Sentry et feedback `aq-support`.

Ne pas se contenter de « ça a l'air bon ». Définir seuils de lancement et échantillonnage humain respectueux de la confidentialité.

## 8. Tester

Tester prompt injection, document hostile, autre organisation, sortie invalide, données absentes, timeout, rate limit, modèle indisponible, streaming interrompu, double clic/action, coût maximal, langues, contenu sensible, confirmation humaine et suppression/rétention.

Terminer par **Cas d'usage**, **Modèle**, **UX**, **Données**, **Outils**, **Évaluations**, **Coûts**, **Reste manuel**.
