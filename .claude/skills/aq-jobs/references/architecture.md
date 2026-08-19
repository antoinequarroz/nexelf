# Architecture des jobs

## Modèle possible

- `jobs` : type, version, payload minimal, état, priorité, idempotency key, tentative, `runAt`, lease, progression, résultat et erreur nettoyée ;
- `jobAttempts` : optionnel pour audit détaillé et forte volumétrie ;
- `jobEvents` : optionnel pour workflow ou audit.

Indexer les accès réels : état + échéance, type + état, organisation + date, idempotency key. Paginer l'administration.

## Payload

Stocker des identifiants stables et recharger les données fraîches au moment du travail. Versionner le payload pour permettre aux jobs anciens de survivre à un déploiement. Ne pas stocker session, secret, URL signée courte ou snapshot personnel inutile.

## Workflow

Découper un traitement long en étapes idempotentes avec checkpoint. Chaque étape écrit son résultat durable avant de planifier la suivante. Pour les lots, conserver un curseur et des compteurs ; chaque tranche reste petite et bornée.

## Restaurations

Après restauration de base, ne pas rejouer aveuglément tous les jobs : certains effets externes ont déjà eu lieu. Réconcilier par type avec les identifiants externes avant reprise.
