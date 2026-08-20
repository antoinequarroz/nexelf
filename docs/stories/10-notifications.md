# 10 — Recevoir des rappels choisis

Statut : à faire  
Taille : M  
Dépend de : 04, 05

## Récit

En tant qu'utilisateur, je veux choisir des rappels utiles afin de retrouver Nexelf au bon moment sans être envahi.

## Critères d'acceptation

- [ ] La permission est demandée après le premier planning, avec une explication.
- [ ] Briefing, revue et rappel contextuel se règlent séparément.
- [ ] Un mode pause existe et le défaut ne dépasse pas trois notifications par jour.
- [ ] Chaque notification ouvre l'écran concerné.

## Cas limites

- État vide : les préférences indiquent qu'aucun rappel n'est actif.
- Erreur : l'app explique si la planification a échoué et permet de réessayer.
- Chargement : le changement de préférence affiche son enregistrement.
- Permissions : après refus, l'app reste utilisable et ouvre les réglages système sur demande.

## Hors périmètre de cette story

- Localisation en arrière-plan et campagnes marketing push.

## Notes techniques

Pas de badge permanent ; textes disponibles en français et anglais.
