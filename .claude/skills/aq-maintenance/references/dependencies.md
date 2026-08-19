# Maintenance des dépendances

## Préflight

1. Lire package manager, lockfile, versions épinglées et instructions du dépôt.
2. Vérifier l'état Git ; préserver tout changement utilisateur.
3. Obtenir la liste des versions installées, obsolètes et advisories sans modifier le projet.
4. Lire les notes officielles seulement pour les versions candidates pertinentes.
5. Grouper les changements par risque, pas en une mise à jour globale.

## Ordre recommandé

1. outillage de développement sans impact runtime ;
2. correctifs runtime isolés ;
3. UI et modules non critiques ;
4. framework/build ;
5. base, auth, paiement, monitoring et mobile dans des opérations séparées.

## Preuves après changement

- Lockfile explique uniquement les versions attendues.
- Typecheck/lint/tests/build passent.
- Tests e2e couvrent les parcours touchés.
- Preview vérifiée avant production.
- Sentry ne montre pas de régression après déploiement.
- Retour arrière identifié au niveau code, données et configuration.

Un advisory n'autorise pas automatiquement une mise à jour majeure : confirmer exploitabilité, code affecté, correctif disponible et mesures compensatoires. Inversement, l'absence d'advisory ne rend pas une version abandonnée acceptable.
