# 13 — Obtenir de l'aide et signaler un problème

Statut : à faire  
Taille : M  
Dépend de : 01, 06

## Récit

En tant qu'utilisateur, je veux obtenir de l'aide et signaler une réponse problématique afin de résoudre mon problème sans exposer mes données personnelles.

## Critères d'acceptation

- [ ] Un centre d'aide couvre compte, données, abonnement et fonctionnement IA.
- [ ] Le formulaire de contact conserve un brouillon et confirme l'envoi.
- [ ] Le diagnostic technique est facultatif et détaille ce qui sera transmis.
- [ ] Une réponse IA peut être signalée sans l'ajouter à la mémoire.
- [ ] L'admin ne voit que compte, droits, version, consommation et erreurs, sauf consentement explicite.

## Cas limites

- État vide : le centre d'aide propose recherche et contact.
- Erreur : le message reste en brouillon et peut être renvoyé.
- Chargement : l'envoi ne peut pas être dupliqué.
- Permissions : toute consultation exceptionnelle de contenu demande consentement et est journalisée.

## Hors périmètre de cette story

- Chat humain en direct, forum et communauté.

## Notes techniques

Journaliser suspension, rétablissement Pro et accès administratifs ; aucune donnée personnelle dans Sentry.
