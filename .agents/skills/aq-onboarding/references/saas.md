# Variante SaaS

## Décisions spécifiques

- Déterminer si l'utilisateur agit seul ou dans une organisation.
- Choisir qui crée le workspace, devient propriétaire et invite les membres.
- Distinguer l'onboarding du propriétaire, d'un membre invité et d'un administrateur.
- Définir la première entité métier qui produit de la valeur : projet, document, client, automatisation ou autre.
- Décider si des données d'exemple accélèrent la compréhension et comment les supprimer.

## Essai et paiement

- Ne demander une carte au départ que si la stratégie tarifaire le justifie.
- Montrer clairement durée de l'essai, plan, date et montant du prochain paiement.
- Définir ce qui arrive à l'expiration : lecture seule, limite, grâce ou blocage.
- Ne jamais confondre statut d'onboarding et droit d'accès payé.
- Consommer l'état Stripe synchronisé côté serveur, jamais un paramètre client.

## Invitations

- Un lien expiré ou déjà utilisé doit mener à une résolution claire.
- Après authentification, préserver l'organisation et la destination attendues.
- Tester membre existant, nouvelle adresse, mauvais compte et révocation avant acceptation.
