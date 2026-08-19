# Pricing mobile et achats intégrés

## Classifier avant de tarifer

Déterminer si le paiement concerne : contenu/fonctionnalité numérique dans l'app, abonnement récurrent, achat non consommable, crédits consommables, bien physique ou service consommé hors app. Cette classification décide du système de paiement autorisé.

## Questions

1. Quelle valeur reste récurrente pendant toute la durée d'un abonnement ?
2. L'achat doit-il être restaurable sur un nouvel appareil ?
3. Les crédits représentent-ils une consommation réelle et compréhensible ?
4. Quelles plateformes et régions sont ciblées ?
5. Le prix doit-il être équivalent ou adapté entre iOS et Android ?
6. Quel essai, quelle période et quelle offering tester ?
7. Existe-t-il une version web partageant le même entitlement ?

## Garde-fous

- Ne pas utiliser Stripe directement dans l'app pour du numérique sans exception store vérifiée.
- Ne pas faire expirer les crédits achetés sur iOS.
- Ne pas vendre un bénéfice ponctuel sous forme d'abonnement.
- Prévoir les commissions stores dans les scénarios de marge.
- Utiliser les prix localisés fournis par les stores dans l'interface.

Produire dans `docs/pricing.md` une matrice compatible avec `aq-revenuecat` : type de produit, entitlement, période, offering, prix cible par plateforme et hypothèses de commission.
