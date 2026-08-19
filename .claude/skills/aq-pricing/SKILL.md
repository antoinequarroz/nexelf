---
name: aq-pricing
description: >-
  Conçoit la stratégie tarifaire, les offres et les modalités de paiement d'un SaaS, d'une app mobile ou d'un site de services AQ. A utiliser quand on définit des plans SaaS, des abonnements, des achats intégrés, des quotas, un essai, un paiement unique, des crédits, une tarification à l'usage, des forfaits freelance, un prix "dès", une fourchette ou une offre sur devis ; quand l'utilisateur dit "pricing", "combien facturer", "plans", "abonnement", "prix", "paiement unique" ou "grille tarifaire". Pose les questions métier et économiques avant de recommander. Ne configure aucun prestataire de paiement et ne donne pas de conseil fiscal ou juridique.
---

# Pricing AQ

Transformer un produit ou un service en offres compréhensibles, viables et testables. Ne jamais inventer un prix précis sans hypothèses explicites.

## 1. Déterminer le parcours

Lire `AGENTS.md`, le brief, la spec produit et les offres existantes avant de poser une question déjà résolue.

Choisir un seul parcours :

- **SaaS** : lire `references/saas.md`.
- **Services, portfolio, vitrine ou CMS d'agence** : lire `references/services.md`.
- **App mobile** : lire `references/mobile.md`.
- **Hybride** : suivre les deux séparément, puis lire `references/payments.md` pour les articuler.

## 2. Conduire l'entretien

Poser une question thématique à la fois. Proposer un défaut raisonné à chaque étape et accepter « je ne sais pas » : transformer alors la décision en hypothèse à tester.

Toujours couvrir :

1. Client cible, problème payé et alternative actuelle.
2. Résultat ou valeur créée, fréquence d'usage et moment où le client perçoit cette valeur.
3. Coûts variables, temps humain, support, marge minimale et capacité de livraison.
4. Unité qui augmente avec la valeur : utilisateur, organisation, projet, usage, crédit, livraison ou aucune.
5. Différences réelles entre offres, limites chiffrées et cas nécessitant un devis.
6. Devise, pays vendus, mensuel/annuel, acompte, échéances, essai, remboursement et moyens de paiement souhaités.
7. Prix à afficher publiquement ou seulement après qualification, et effet recherché sur le parcours commercial.

Ne pas demander dix prix au hasard. Partir de la valeur, des coûts et de la simplicité d'achat.

## 3. Comparer les modèles

Comparer au maximum trois options pertinentes parmi :

- abonnement fixe ;
- abonnement par siège ;
- tarification à l'usage ;
- packs de crédits prépayés ;
- paiement unique ;
- hybride abonnement + usage ;
- forfait de service ;
- prix « dès » ou fourchette ;
- devis sur mesure.

Pour chaque option, expliquer : simplicité pour le client, prévisibilité du revenu, risque de marge, complexité technique et comportement indésirable possible.

Recommander une option principale et une alternative. Marquer clairement les hypothèses non vérifiées.

## 4. Construire les offres

- Limiter à trois offres publiques sauf justification forte.
- Faire correspondre chaque offre à un type de client ou un niveau de valeur, pas à une liste artificielle de fonctionnalités.
- Donner à chaque plan une raison claire d'exister.
- Ne pas créer un plan gratuit par réflexe. Définir son rôle : acquisition, démonstration ou usage durable.
- Ne pas afficher « le plus populaire » sans choix réel ou preuve ; préférer « recommandé pour… ».
- Vérifier que les limites importantes sont applicables côté serveur pour un SaaS.
- Pour un service sur mesure, ne pas promettre un prix fixe si le périmètre reste inconnu.

## 5. Définir les paiements

Lire `references/payments.md`. Décider explicitement :

- récurrent, unique, crédits ou combinaison ;
- mensuel et/ou annuel ;
- acompte et échéancier pour les services ;
- essai avec ou sans carte ;
- comportement en cas d'échec, annulation ou crédits expirés ;
- TVA, facture et conditions à faire valider par le client ou sa fiduciaire.

Ne jamais manipuler de clé de paiement ici. Pour un SaaS web, transmettre ensuite la matrice validée à `aq-stripe`. Pour une app mobile, transmettre la matrice à `aq-revenuecat` et appliquer les règles des stores.

## 6. Produire la décision

Copier et remplir `assets/pricing.md` vers `docs/pricing.md`. Le document doit contenir :

- segment et valeur ;
- modèle retenu et alternatives écartées ;
- matrice des offres ;
- modalités de paiement ;
- coûts, marge et hypothèses ;
- règles de passage de plan ou de dépassement ;
- présentation publique et CTA ;
- métriques et date de révision ;
- points fiscaux/juridiques à valider.

Ne modifier ni le prestataire de paiement ni l'interface sans demande explicite. Si l'utilisateur demande l'implémentation, proposer `aq-stripe` sur le web, `aq-revenuecat` sur mobile et `aq-landing-page` pour la présentation marketing.

## 7. Vérifier

- Chaque offre cible un client identifiable.
- Les différences et limites sont compréhensibles sans appel commercial.
- Le modèle suit la valeur et reste calculable.
- Le pire cas d'usage ne détruit pas la marge.
- Le client sait combien il paie, quand et ce qui se passe ensuite.
- Les hypothèses sont séparées des faits.
- Une date de révision et des métriques sont prévues.

Terminer par la recommandation, les deux plus grandes incertitudes et la prochaine expérience à mener.
