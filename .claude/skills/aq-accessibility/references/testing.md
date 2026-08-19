# Tests et preuves

## Automatisation web

Utiliser `@axe-core/playwright` ou l'intégration compatible avec la version du projet. Scanner après que l'état à tester est stable : page initiale, menu/dialog ouvert, formulaire en erreur, contenu chargé et thème alternatif.

Une absence de violation axe signifie seulement qu'aucune règle automatisable active n'a échoué. Elle ne vérifie pas la qualité des textes alternatifs, l'ordre logique complet, la compréhension, ni l'expérience lecteur d'écran.

## Tests manuels web

Documenter navigateur + lecteur d'écran. Exemples de combinaisons réalistes : Safari/VoiceOver sur macOS, Chrome/NVDA sur Windows. Choisir selon le support projet ; ne pas prétendre avoir testé un environnement indisponible.

Pour chaque parcours : point de départ, touches/gestes, annonces attendues, focus, résultat et blocage.

## Mobile

Tester VoiceOver et TalkBack selon les procédures officielles, idéalement sur appareil. Vérifier navigation par balayage, exploration tactile, actions, rotor/granularité pertinente, retour, modal et clavier.

Maestro vérifie le parcours et les libellés accessibles exposés, mais pas la qualité réelle des annonces ou de l'ordre.

## Triage

- Bloquant : parcours essentiel impossible ou information indispensable absente.
- Majeur : tâche possible avec obstacle important ou erreur probable.
- Modéré : friction répétée, compréhension ou confort dégradé.
- Mineur : amélioration localisée sans blocage.

Associer quand possible le critère WCAG précis. Ne pas attribuer un critère au hasard pour rendre le rapport plus officiel.
