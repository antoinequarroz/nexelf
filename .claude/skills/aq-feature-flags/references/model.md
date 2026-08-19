# Modèle des feature flags

## Entités possibles

Pour une implémentation Convex simple :

- `featureFlags` : clé, type, défaut, description, propriétaire, expiration et état ;
- `featureFlagRules` : flag, environnement, ordre, condition, valeur et rollout ;
- `featureFlagOverrides` : sujet, valeur, raison et expiration ;
- `featureFlagAudit` : acteur, avant/après, raison et date.

Ne pas ajouter un moteur de règles générique si allowlist + pourcentage suffisent. Valider strictement opérateurs, attributs et valeurs côté serveur.

## Identité de ciblage

- installation : expérience avant connexion ou strictement liée à l'appareil ;
- utilisateur : expérience personnelle ;
- organisation : fonctionnalité collaborative et données partagées.

Éviter de changer de sujet après connexion sans stratégie explicite. Pour un SaaS B2B, l'organisation est souvent le sujet cohérent.

## Types

Préférer booléen ou enum typée. Utiliser nombre/chaîne uniquement pour une configuration bornée. Une structure JSON libre rend compatibilité et rollback fragiles.

## Expiration

Exiger `owner`, `expiresAt` et lien vers story/ADR. Les flags ops permanents sont rares mais peuvent exister ; les revoir périodiquement et tester leur action.
