# 05 — Commencer et clôturer sa journée

Statut : à faire  
Taille : M  
Dépend de : 04

## Récit

En tant qu'utilisateur, je veux un briefing le matin et une revue rapide le soir afin de rester aligné sans subir une gestion lourde.

## Critères d'acceptation

- [ ] Le briefing présente le cap, les priorités, routines et contraintes du jour.
- [ ] L'utilisateur accepte le plan ou demande une adaptation.
- [ ] La revue du soir dure moins de deux minutes et chaque question peut être ignorée.
- [ ] Nexelf présente ce qu'il souhaite retenir avant tout ajout en mémoire.

## Cas limites

- État vide : une journée sans plan peut être créée manuellement.
- Erreur : le dernier briefing reste visible et les réponses de revue sont conservées.
- Chargement : une synthèse provisoire remplace les zones en attente.
- Permissions : aucun briefing d'un autre compte n'est accessible.

## Hors périmètre de cette story

- Coaching audio et bilan mensuel.

## Notes techniques

Une journée oubliée reste vide et ne casse aucune série punitive.
