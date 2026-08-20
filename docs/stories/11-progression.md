# 11 — Comprendre sa progression hebdomadaire

Statut : fait — validation automatisée réussie, parcours Maestro à exécuter sur appareil  
Taille : M  
Dépend de : 05, 08

## Récit

En tant qu'utilisateur, je veux comprendre ma régularité et mes blocages afin d'ajuster ma trajectoire sans être jugé.

## Critères d'acceptation

- [ ] Le bilan montre actions terminées, reportées et abandonnées ainsi que l'avancement des objectifs.
- [ ] La semaine peut être comparée aux précédentes.
- [ ] Nexelf présente au maximum trois insights comme hypothèses avec leurs données sources.
- [ ] L'utilisateur peut marquer un insight faux ou inutile.

## Cas limites

- État vide : l'app indique combien de données sont nécessaires sans inventer d'analyse.
- Erreur : les données brutes restent visibles et l'analyse peut être relancée.
- Chargement : les indicateurs disponibles précèdent les insights IA.
- Permissions : seul le propriétaire voit ses bilans.

## Hors périmètre de cette story

- Diagnostic, score global et partage avec un tiers.

## Notes techniques

Chaque graphique dispose d'un résumé textuel accessible.
