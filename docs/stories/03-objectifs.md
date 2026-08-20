# 03 — Gérer ses objectifs

Statut : à faire  
Taille : L  
Dépend de : 01

## Récit

En tant qu'utilisateur, je veux organiser mes objectifs dans le temps afin que Nexelf puisse proposer des actions cohérentes.

## Critères d'acceptation

- [ ] Un objectif possède un domaine, un horizon, une motivation, une priorité et une échéance facultative.
- [ ] Nexelf peut proposer des étapes, confirmées avant enregistrement.
- [ ] L'utilisateur peut modifier, mettre en pause, archiver ou supprimer un objectif.
- [ ] Une suppression destructive demande confirmation et peut être annulée immédiatement.

## Cas limites

- État vide : un appel à créer le premier objectif explique sa valeur.
- Erreur : l'objectif saisi reste disponible en brouillon manuel.
- Chargement : la décomposition IA affiche une progression annulable.
- Permissions : seul le propriétaire lit ou modifie ses objectifs.

## Hors périmètre de cette story

- Objectifs partagés ou assignés par un tiers.

## Notes techniques

Les mutations IA passent par un aperçu et une confirmation explicite.
