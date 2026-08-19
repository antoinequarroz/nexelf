# Retries et erreurs

## Classifier

- temporaire : réseau, timeout, indisponibilité, rate limit ;
- permanent : validation, destinataire invalide, ressource supprimée, permission définitivement perdue ;
- inconnu : résultat externe indéterminé, à vérifier avant retry ;
- bug : invariant cassé ou erreur de code, à alerter.

## Backoff

Employer un backoff exponentiel borné avec jitter. Respecter `Retry-After` lorsqu'il est fiable. Définir nombre maximal, durée totale et échéance métier ; ne jamais réessayer indéfiniment.

## Dead letter

Après épuisement, rendre le job visible avec cause nettoyée, impact, propriétaire et action possible. Une relance manuelle exige une correction ou une raison, conserve l'audit et reste idempotente.

## Compensation

Une compensation est une nouvelle opération métier, pas un rollback magique. La rendre idempotente et observable. Si aucun retour automatique n'est sûr, arrêter et produire une tâche manuelle explicite.
