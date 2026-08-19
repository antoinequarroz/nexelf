# Variante mobile

## Principes

- Montrer rapidement une expérience utilisable ; éviter le carrousel explicatif obligatoire.
- Demander caméra, photos, localisation, contacts ou notifications au moment précis du bénéfice.
- Prévoir refus, restriction système et ouverture des réglages sans cul-de-sac.
- Persister la progression importante côté serveur et prévoir un cache local pour réseau instable.
- Tester fermeture forcée, reprise, changement d'appareil et reconnexion.

## RevenueCat et stores

- Expliquer clairement produit, période, prix, renouvellement et restauration.
- Fournir « Restaurer les achats » lorsqu'applicable et tester un achat existant sur un nouvel appareil.
- L'entitlement RevenueCat vérifié est la source du droit premium ; l'écran de succès ne l'est pas.
- Identifier correctement l'utilisateur avant l'achat lorsque le produit l'exige, puis gérer login/logout sans transférer les droits au mauvais compte.
- Ne pas utiliser Stripe dans l'app pour vendre du contenu numérique soumis aux règles des stores.

## Deep links et notifications

- Chaque relance mène à l'étape ou l'action utile, avec repli si le lien n'est plus valide.
- Arrêter les relances dès l'activation, y compris si elle a eu lieu sur un autre appareil.
