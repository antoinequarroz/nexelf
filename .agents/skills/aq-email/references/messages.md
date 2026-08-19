# Matrice de messages

## Vitrine

- Notification interne de contact : protéger contre le spam, ne pas inclure plus de données que nécessaire.
- Confirmation au visiteur : seulement si elle apporte une preuve ou un délai utile ; ne pas devenir un canal marketing implicite.

## Better Auth, CMS et SaaS

- Vérification d'adresse, lien magique, changement d'adresse et reset : token à usage unique, expiration, destination contrôlée, message neutre si le compte n'existe pas.
- Invitation : organisation, rôle, invitant, expiration et solution si le mauvais compte est connecté.
- Sécurité : expliquer l'événement et la marche à suivre sans mettre de secret dans l'email.
- Onboarding : arrêter après activation et rendre le deep link résilient.
- Facturation : ne pas fabriquer un état depuis le client ; partir d'un événement Stripe traité et dédupliqué. Distinguer reçu fournisseur, confirmation produit et relance de paiement.

## Mobile

Le backend envoie. L'app ouvre un deep link universel/app link avec fallback web, auth reprise et état expiré. Un achat ou entitlement RevenueCat doit être confirmé côté serveur avant tout email lié au droit premium.

## Marketing

Conserver la preuve du consentement, proposer désinscription et préférences, appliquer immédiatement la suppression et ne jamais réabonner automatiquement après une nouvelle transaction.
