# RevenueCat — Nexelf Pro

## Préflight

Nexelf vend des fonctionnalités numériques dans l'app : les achats intégrés Apple/Google sont donc le chemin prévu. Stripe est hors périmètre. Les comptes Apple, Google, Expo et RevenueCat ainsi que leurs contrats, informations bancaires et fiscales doivent être confirmés par leur propriétaire avant toute configuration live.

Le SDK `react-native-purchases` est installé. Les clés SDK publiques sont séparées par plateforme. Aucun secret serveur ne doit utiliser le préfixe `EXPO_PUBLIC_`.

## Catalogue proposé — non créé

| Droit | Type       | Produit iOS | Produit Android | Durée     | Offre              |
| ----- | ---------- | ----------- | --------------- | --------- | ------------------ |
| `pro` | abonnement | à décider   | à décider       | mensuelle | `default` proposée |
| `pro` | abonnement | à décider   | à décider       | annuelle  | `default` proposée |

Les identifiants, prix, devises et l'essai de 7 jours sont bloqués jusqu'à validation de `docs/pricing.md`. Aucun produit ou compte live n'a été créé.

## Identité et droits

- L'app vérifie uniquement l'entitlement explicite `pro`.
- L'App User ID doit être l'identifiant Better Auth stable et opaque, jamais l'e-mail.
- Le SDK se configure une fois, puis utilise `logIn` au rattachement d'une session et `logOut` à la déconnexion.
- Le serveur projette le droit reçu par webhook ; une fonctionnalité serveur ne doit jamais faire confiance à un booléen du client.

## Variables

Dans le bundle mobile (clés SDK publiques seulement) :

- `EXPO_PUBLIC_REVENUECAT_IOS`
- `EXPO_PUBLIC_REVENUECAT_ANDROID`

Dans l'environnement Convex uniquement :

- `REVENUECAT_WEBHOOK_AUTHORIZATION` — valeur complète attendue dans l'en-tête `Authorization`.

## Webhook et projection

La projection serveur conserve l'identifiant d'événement pour l'idempotence, l'identité RevenueCat, l'entitlement, l'état, la plateforme, l'expiration et la date de mise à jour. Les événements dupliqués doivent être ignorés. Il peut exister un délai entre l'achat, le webhook et la projection Convex ; le client relit immédiatement `CustomerInfo`, tandis que le serveur reste autoritaire pour les fonctions serveur.

## Tests requis

1. RevenueCat Test Store : offering absent, achat, annulation, droit `pro`, restauration et webhook dupliqué.
2. Development build Expo : Expo Go ne prouve pas StoreKit/Google Play Billing.
3. Sandbox Apple et piste Google Play : achat, renouvellement, annulation, expiration, remboursement, grâce, changement de compte et restauration multiappareil.
4. Vérifier après chaque cas l'app, `CustomerInfo`, RevenueCat et Convex.

## Configuré

- SDK présent, clés publiques séparées, entitlement `pro` explicite, état sans offre sûr, restauration et URL de gestion abstraites.

## Testé

- Test unitaire du verrouillage explicite de l'entitlement `pro` uniquement.
- Aucun achat, restore store, webhook ou build natif n'est déclaré testé sans comptes, clés et produits.

## À faire dans les consoles

- Valider prix, catalogue, essai, plateformes et propriété des comptes.
- Créer/importer les produits, l'entitlement `pro` et l'offering après confirmation.
- Configurer le secret webhook, Test Store, sandboxes et produits de revue.
- Exécuter et consigner la matrice de tests avant production.
