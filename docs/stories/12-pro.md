# 12 — Découvrir et restaurer Nexelf Pro

Statut : partiel — UI et intégration sûre livrées, catalogue et tests stores manquants
Taille : M  
Dépend de : 01, 06

## Récit

En tant qu'utilisateur, je veux comprendre, essayer et restaurer Nexelf Pro afin de choisir l'offre sans perdre mes droits entre appareils.

## Critères d'acceptation

- [x] Les limites Free et avantages Pro sont expliqués avant achat.
- [ ] Les offres mensuelle et annuelle ainsi que l'essai de 7 jours affichent prix et renouvellement.
- [ ] L'achat confirme le droit Pro sans double soumission.
- [ ] La restauration des achats fonctionne depuis les réglages.
- [ ] La gestion et l'annulation ouvrent le parcours du store concerné.

## Cas limites

- État vide : si aucune offre n'est disponible, aucun bouton d'achat trompeur n'apparaît.
- Erreur : l'état de paiement n'est jamais supposé et une nouvelle vérification est proposée.
- Chargement : le bouton est occupé et l'utilisateur peut quitter sans second débit.
- Permissions : les droits sont liés au compte authentifié et à RevenueCat.

## Hors périmètre de cette story

- Achat à vie et paiement Stripe dans l'app.

## Notes techniques

RevenueCat, restauration Apple obligatoire, prix exacts décidés avec `aq-pricing`.

L'écran `/nexelf-pro` ne montre un bouton d'achat que lorsqu'une offering réelle est chargée et utilise exclusivement le prix localisé du store. L'absence de clé ou d'offre reste explicite et sans prix de substitution. Achat, restauration et gestion sont implémentés mais ne seront cochés qu'après validation Test Store puis sandbox sur development builds réels.
