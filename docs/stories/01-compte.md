# 01 — Créer et maîtriser son compte

Statut : à faire  
Taille : M  
Dépend de : aucune

## Récit

En tant qu'utilisateur individuel, je veux créer, sécuriser et supprimer mon compte afin de garder la maîtrise de mon identité et de mes données.

## Critères d'acceptation

- [ ] Inscription par e-mail, Apple ou Google, avec vérification lorsque nécessaire.
- [ ] Récupération du mot de passe et déconnexion de tous les appareils.
- [ ] Export téléchargeable des données personnelles.
- [ ] Suppression depuis l'app, récupérable 7 jours, puis définitive.

## Cas limites

- État vide : l'écran explique les méthodes de connexion disponibles.
- Erreur : la saisie reste présente et une nouvelle tentative est proposée.
- Chargement : l'action en cours est annoncée et ne peut pas être soumise deux fois.
- Permissions : un utilisateur non authentifié n'accède à aucune donnée personnelle.

## Hors périmètre de cette story

- Organisations, équipes et comptes enfants.

## Notes techniques

Better Auth, Secure Store, journalisation des actions sensibles et aucune donnée personnelle dans Sentry.
