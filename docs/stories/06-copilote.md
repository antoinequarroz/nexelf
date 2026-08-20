# 06 — Adapter sa journée avec le copilote

Statut : à faire  
Taille : L  
Dépend de : 04

## Récit

En tant qu'utilisateur, je veux expliquer mon contexte en langage naturel afin que Nexelf m'aide à adapter ma journée sans décider à ma place.

## Critères d'acceptation

- [ ] Les réponses sont progressives, annulables et régénérables.
- [ ] Conseil, hypothèse et action proposée sont visuellement distingués.
- [ ] Toute mutation présente un aperçu et exige confirmation.
- [ ] L'historique montre les actions réalisées et permet leur annulation lorsque possible.
- [ ] Les contenus dangereux déclenchent les garde-fous définis.

## Cas limites

- État vide : des amorces expliquent ce que le copilote peut faire.
- Erreur : le message reste conservé et peut être renvoyé.
- Chargement : la réponse peut être arrêtée sans perdre la conversation.
- Permissions : le copilote n'accède qu'aux données autorisées du propriétaire.

## Hors périmètre de cette story

- Voix, audio, diagnostic et actions autonomes.

## Notes techniques

Sorties structurées, journal d'outils, quotas Free/Pro et évaluations de sécurité obligatoires.
