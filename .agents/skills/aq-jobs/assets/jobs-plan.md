# Plan des jobs

## Architecture

- Mécanisme retenu :
- Producteurs :
- Workers/actions :
- Concurrence globale/par type :
- Stockage des états :
- Administration :

## Catalogue

| Type/version | Déclencheur | Résultat métier | Idempotency key | Timeout | Retries | Concurrence | UX/notification | Rétention |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

## Cron

| Nom | Cadence/UTC | Travail recherché | Chevauchement | Pagination/checkpoint | Alerte |
|---|---|---|---|---|---|
| | | | | | |

## Échecs et reprise

- Classification :
- Backoff/jitter :
- Dead letters :
- Résultat externe inconnu :
- Compensation :
- Runbook :

## UX/UI

- États utilisateur :
- Progression :
- Annulation :
- Résultat :
- Erreurs et retry :
- Notifications :

## Tests

- [ ] Création/exécution dupliquée
- [ ] Interruption et lease expirée
- [ ] Timeout externe inconnu
- [ ] Backoff et rate limit
- [ ] Cron manqué/chevauché
- [ ] Lots paginés et reprise
- [ ] Annulation/relance autorisées
- [ ] Dead letter, alerte et réparation
- [ ] Aucun secret dans payload/logs

## Reste manuel

- Limites fournisseurs vérifiées :
- Alertes et responsables :
- Procédures de réconciliation :
