# Architecture de recherche

## Échelle de choix

1. Query + index métier + filtres déterministes.
2. Index plein texte natif de la base.
3. Moteur externe synchronisé.

Monter d'un niveau seulement avec un besoin mesuré. Pour tout moteur externe, définir projection indexable, version, clé stable, filtre tenant obligatoire, suppression, retries, réconciliation et rebuild.

## Pagination

Préférer curseurs stables. Définir le tie-breaker du tri. Un changement entre pages peut créer doublons/absences : documenter la cohérence promise.

## Pertinence

Séparer filtres obligatoires, filtres utilisateur et ranking. Tester exact, préfixe, typo, popularité et récence selon l'intention ; ne pas ajouter un boost sans requêtes de référence.
