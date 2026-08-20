# 04 — Consulter et adapter son planning quotidien

Statut : à faire  
Taille : L  
Dépend de : 02, 03

## Récit

En tant qu'utilisateur, je veux un plan quotidien réaliste et modifiable afin d'agir sur mes objectifs malgré mes contraintes.

## Critères d'acceptation

- [ ] Le plan propose 3 à 5 priorités avec durée, créneau conseillé et raison.
- [ ] Une action peut être terminée, reportée, déplacée, modifiée ou supprimée.
- [ ] Une réorganisation globale présente un aperçu avant confirmation.
- [ ] La dernière réorganisation peut être annulée.

## Cas limites

- État vide : Nexelf propose de générer ou composer manuellement la journée.
- Erreur : le dernier plan reste modifiable et la génération peut être relancée.
- Chargement : le plan existant reste visible pendant la génération.
- Permissions : seul le propriétaire agit sur son planning.

## Hors périmètre de cette story

- Réservation automatique dans un calendrier externe.

## Notes techniques

Modéliser les mutations pour une future file hors ligne dès cette story.
