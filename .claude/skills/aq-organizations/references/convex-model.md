# Modèle Convex natif

## Entités

`organizations` : nom, slug stable si public, état, propriétaire de facturation, dates. Ne pas utiliser le slug comme frontière d'autorisation.

`organizationMembers` : `organizationId`, identifiant utilisateur Better Auth résolu, rôle fixe, état, dates et auteur du changement. Indexer par organisation, par utilisateur, et la paire logique. Refuser les doublons en mutation.

`organizationInvitations` : organisation, email normalisé, rôle prévu, état, expiration, invitant et clé de déduplication. Ne jamais exposer le secret brut dans une liste admin.

`auditEvents` : organisation, acteur, capacité, cible, résultat, horodatage et corrélation, sans secret ni contenu privé inutile.

Chaque ressource tenant possède `organizationId`. Éviter de déduire l'organisation uniquement via une chaîne de relations longue et fragile.

## Capacités

Définir une union typée de capacités et une matrice centralisée. Exemple conceptuel :

- owner : organisation, facturation, membres et données ;
- admin : membres/données, sans suppression/transfert/facturation selon la décision ;
- member : actions métier explicites ;
- viewer : lecture explicite si nécessaire.

Ne pas donner `*` par commodité sauf owner et avec une résolution centralisée. Les rôles internes support/admin sont dans un autre espace de noms et d'autres helpers.

## Mutations sensibles

Faire les contrôles et l'écriture dans la même mutation : limite de sièges, unicité, dernier owner, état invitation et appartenance. Les appels email/paiement suivent via action idempotente ; une panne externe ne doit pas annuler une appartenance déjà acceptée sans stratégie explicite.
