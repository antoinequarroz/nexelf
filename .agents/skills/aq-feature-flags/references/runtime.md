# Évaluation par runtime

## Convex

Centraliser une fonction d'évaluation pure et testable. Charger uniquement les règles nécessaires avec des index. Pour les opérations métier, évaluer dans la fonction serveur qui applique l'effet après l'autorisation.

Un appel externe n'a pas sa place dans une mutation. Si les règles viennent d'un fournisseur, utiliser une projection/cache mis à jour hors transaction et documenter son délai de propagation.

## Nuxt

Évaluer côté serveur pour SSR lorsque le flag change la structure initiale. Sérialiser seulement le résultat nécessaire vers le client, puis garder cette décision stable pendant l'interaction. Éviter un flash de variante et les différences d'hydratation.

## Expo

Conserver la dernière configuration valide avec version et date. Définir un bootstrap sûr sans cache et rafraîchir sans changer brutalement un parcours commencé. Les flags ne remplacent pas les mécanismes de mise à jour de l'application ni la compatibilité de schéma.

## Analytics

Enregistrer l'exposition uniquement quand l'utilisateur voit réellement la variante, une fois par unité d'analyse. Inclure clé, variante et version de règles, sans données de ciblage sensibles. Une expérimentation exige une hypothèse, une métrique primaire et une règle d'arrêt définies avant lancement.
