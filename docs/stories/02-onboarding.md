# 02 — Terminer l'onboarding et obtenir un premier plan

Statut : à faire  
Taille : L  
Dépend de : 01

## Récit

En tant que nouvel utilisateur, je veux expliquer ma trajectoire et mes contraintes afin d'obtenir un premier plan réaliste.

## Critères d'acceptation

- [ ] L'utilisateur définit ses domaines de vie, son futur souhaité, 1 à 3 objectifs, ses contraintes et son énergie.
- [ ] Chaque étape est sauvegardée et reprise après fermeture de l'app.
- [ ] Nexelf propose un plan que l'utilisateur peut corriger avant validation.
- [ ] Le choix du ton du copilote est modifiable.

## Cas limites

- État vide : des exemples aident sans préremplir de données personnelles.
- Erreur : l'étape reste enregistrée et la génération peut être relancée.
- Chargement : progression visible, annulable, sans bloquer le retour arrière.
- Permissions : aucune permission native n'est demandée pendant l'onboarding.

## Hors périmètre de cette story

- Calendrier, santé, finances et import depuis une autre app.

## Notes techniques

Le formulaire doit résister à l'arrière-plan, au redémarrage et au texte agrandi.
