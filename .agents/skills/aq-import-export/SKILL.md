---
name: aq-import-export
description: >-
  Cadre, implémente et valide les imports et exports de données d'un CMS, SaaS
  ou backend mobile AQ : CSV/XLSX/JSON, modèles, mapping de colonnes, aperçu,
  validation par ligne, déduplication, reprise, gros volumes, permissions,
  fichiers privés, portabilité et conformité. À utiliser pour migrer des
  données client, importer un catalogue ou des membres, produire un export,
  répondre à une demande de portabilité ou construire un traitement via
  aq-jobs et aq-files-storage.
---

# Import et export AQ

Faire entrer et sortir les données sans corruption silencieuse, doublons ni fuite inter-tenant. Toujours proposer un aperçu avant une écriture massive.

## 1. Cadrer

Lire `AGENTS.md`, le schéma, les permissions et les volumes. Demander progressivement :

- Quel objet métier, quelle source, quel format, quel volume et quelle fréquence ?
- Création seule, mise à jour, synchronisation ou remplacement ? Quelle clé métier identifie une ligne ?
- Qui peut importer/exporter et pour quelle organisation ?
- Atomicité totale ou succès partiel par ligne ? Comment corriger puis reprendre ?
- Quelles colonnes sensibles, relations, langues, fuseaux et formats régionaux ?
- Quel résultat UX : modèle téléchargeable, mapping, aperçu, progression et rapport d'erreurs ?

## 2. Écrire le contrat

Copier `assets/import-export-plan.md` vers `docs/import-export.md`. Versionner le format : colonnes, types, champs requis, valeurs autorisées, normalisation, clé de déduplication, règles relationnelles et comportement sur absence.

Ne jamais déduire silencieusement séparateur décimal, jour/mois, devise, fuseau ou encodage lorsque l'ambiguïté change les données.

## 3. Construire un pipeline sûr

1. Autoriser l'opération côté serveur.
2. Recevoir le fichier privé via `aq-files-storage` avec limites strictes.
3. Parser en streaming ou par lots bornés ; ne pas charger un gros fichier en mémoire.
4. Normaliser sans écrire, puis valider schéma et règles métier.
5. Présenter résumé, échantillon et erreurs téléchargeables.
6. Obtenir une confirmation explicite du mode création/mise à jour.
7. Exécuter via `aq-jobs` avec idempotency key, checkpoints et progression.
8. Produire un rapport final et supprimer les artefacts selon rétention.

Pour XLSX, traiter les cellules comme données non fiables et lire `references/formats.md`.

## 4. Protéger les données

- Vérifier organisation, rôle et capacité à chaque lancement, consultation et téléchargement.
- Ne jamais accepter `organizationId`, rôle, chemin de fichier ou propriétaire comme preuve client.
- Empêcher CSV injection dans les exports ; neutraliser les cellules commençant par une formule selon le format cible.
- Limiter feuilles, lignes, colonnes, taille décompressée et profondeur ; refuser archives dangereuses.
- Ne pas journaliser lignes, emails ou contenu personnel.
- Chiffrer et expirer les exports privés ; une URL difficile à deviner n'est pas une permission.
- Appliquer `aq-nlpd` pour portabilité, finalité, rétention et suppression.

## 5. Gérer cohérence et reprise

- Définir une clé stable par ligne et une clé par exécution.
- Écrire par lots transactionnels bornés avec statut/checkpoint durable.
- Réévaluer les relations et quotas au moment de l'écriture.
- Éviter les effets externes dans les mutations ; les isoler dans des étapes idempotentes.
- Pour succès partiel, conserver numéro de ligne, code d'erreur compréhensible et valeur nettoyée minimale.
- Une relance ne doit pas dupliquer les lignes déjà appliquées.
- Pour remplacement destructif, préparer export de secours, diff, confirmation renforcée et stratégie de restauration.

## 6. Concevoir l'export

- Exporter uniquement les champs et lignes autorisés au moment de la génération.
- Générer côté serveur et en arrière-plan pour les gros volumes.
- Inclure version du schéma, date UTC, fuseau/devise explicites et dictionnaire si nécessaire.
- Garder identifiants stables utiles à une réimportation sans exposer d'identifiants internes sensibles.
- Définir cohérence du snapshot si les données changent pendant l'export.
- Afficher progression, expiration et nouvelle génération ; ne pas conserver indéfiniment.

## 7. Tester

Tester : fichier vide, encodage/BOM, séparateurs, guillemets, retours ligne, Unicode, dates ambiguës, décimales, formules, fichier trop grand, colonnes inconnues/manquantes, doublons internes/existants, relations absentes, autre organisation, concurrence, interruption/reprise, import répété, export expiré et suppression de compte.

Terminer par **Contrat**, **Mapping**, **Validation**, **Sécurité**, **Exécution**, **Rapport**, **Reste manuel**.
