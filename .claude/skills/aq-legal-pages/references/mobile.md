# Stores et applications mobiles

Les politiques évoluent : vérifier les pages officielles avant chaque soumission.

## Apple

Références : <https://developer.apple.com/app-store/review/guidelines/> et <https://developer.apple.com/support/offering-account-deletion-in-your-app/>.

- Politique de confidentialité accessible dans App Store Connect et dans l'app.
- Décrire données collectées, usages, tiers, protection, conservation/suppression et retrait du consentement/demande de suppression.
- Si l'app permet de créer un compte, permettre d'initier la suppression dans l'app ; une simple désactivation ne suffit pas.
- Expliquer qu'un abonnement Apple peut continuer et proposer l'accès à sa gestion. La suppression immédiate du compte doit rester possible selon les règles décrites par Apple.
- Présenter clairement valeur, prix, durée et renouvellement avant abonnement.

## Google Play

Référence : politiques Google Play actuelles, notamment <https://support.google.com/googleplay/android-developer/answer/17190352>.

- Politique complète, publique, accessible dans l'app et liée dans Play Console.
- La fiche Data safety doit correspondre aux SDK et pratiques réelles.
- Pour une app créant des comptes, offrir une suppression claire dans l'app **et** une ressource web externe dont l'URL est fournie à Play Console.
- La désactivation ne remplace pas la suppression ; expliquer toute conservation légitime.

## Achats et RevenueCat

Les stores gèrent paiement, renouvellement et remboursement selon leurs règles, tandis que l'app gère compte/données. Ne pas promettre qu'une suppression de compte annule automatiquement l'abonnement. Relier vers la gestion du store et réconcilier les entitlements via `aq-revenuecat`.

## Pages publiques

Prévoir des URLs stables HTTPS pour confidentialité, support, conditions et suppression. Elles doivent rester accessibles sans compte, sur mobile, et ne pas dépendre d'un deep link uniquement.
