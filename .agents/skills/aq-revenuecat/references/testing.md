# Tests RevenueCat

## Test Store

Valider rapidement : chargement de l'offering, affichage du paywall, achat réussi, annulation utilisateur, entitlement actif, restauration et webhook. Les métadonnées du Test Store sont contrôlables, mais ce test ne couvre pas les comportements propres à Apple/Google.

## Development build

Un module natif RevenueCat exige un development build Expo pour les achats réels. Expo Go peut prévisualiser certaines interfaces/mocks, mais ne prouve pas que StoreKit ou Google Play Billing fonctionne.

## Sandboxes plateformes

Tester au minimum :

- achat initial ;
- renouvellement accéléré ;
- annulation avec droit maintenu jusqu'à échéance ;
- expiration ;
- remboursement/révocation ;
- problème de facturation ou période de grâce ;
- restauration sur un autre appareil ;
- login, logout et changement de compte ;
- même utilisateur sur iOS et Android ;
- réception multiple du même webhook ;
- absence temporaire de réseau ou d'offering.

Vérifier après chaque scénario l'app, `CustomerInfo`, le profil RevenueCat et la projection Convex.

## Avant production

- Clés plateformes dans le build de production ; aucune clé Test Store.
- Produits approuvables et attachés aux bons entitlements/offerings.
- Paywall conforme et localisé.
- Restore accessible.
- Notes de review et compte de démonstration prêts.
- Alertes webhook et procédure support documentées.
