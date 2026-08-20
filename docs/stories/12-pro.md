# 12 — Découvrir et restaurer Nexelf Pro

Statut : à faire  
Taille : M  
Dépend de : 01, 06

## Récit

En tant qu'utilisateur, je veux comprendre, essayer et restaurer Nexelf Pro afin de choisir l'offre sans perdre mes droits entre appareils.

## Critères d'acceptation

- [ ] Les limites Free et avantages Pro sont expliqués avant achat.
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
