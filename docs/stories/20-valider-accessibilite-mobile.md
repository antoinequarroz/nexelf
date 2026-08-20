# 20 — Valider l'accessibilité mobile de la nouvelle interface

Statut : bloqué — essais humains VoiceOver, TalkBack et appareils manquants
Taille : M
Dépend de : 16, 17, 18, 19

## Récit

En tant qu'utilisateur ayant des besoins visuels, moteurs ou cognitifs, je veux accomplir les parcours essentiels avec les réglages et technologies d'assistance de mon téléphone afin d'utiliser Nexelf de manière autonome.

## Critères d'acceptation

- [ ] La validation suit l'ordre vertical des parcours : création ou connexion, onboarding, accueil et action du jour, planning, revue du soir, puis objectifs, habitudes, copilote, mémoire et réglages.
- [ ] VoiceOver sur iOS et TalkBack sur Android permettent d'accomplir les parcours principaux sans blocage, avec une preuve indiquant appareil ou simulateur, version, étapes, résultat attendu et résultat observé.
- [ ] Les éléments interactifs exposent un nom, un rôle, un état et une valeur utiles sans annonce dupliquée.
- [ ] L'ordre lecteur d'écran suit la hiérarchie visuelle ; les formes, images et versions décoratives du logo original sont ignorées sans masquer le contenu utile.
- [ ] Le logo original conserve un nom accessible lorsqu'il informe sur la marque et n'est jamais utilisé seul pour nommer une action.
- [ ] Les changements majeurs — navigation, dialogue, erreur, succès, contenu chargé — annoncent ou déplacent le contexte de façon prévisible sans bruit répété.
- [ ] Les textes supportent les tailles système maximales ciblées sans chevauchement, perte d'information, action masquée ou défilement horizontal imposé.
- [ ] La faible densité reste effective avec grande police : les groupes horizontaux passent en pile, les contenus secondaires peuvent se replier et l'action primaire reste identifiable.
- [ ] Les contrastes du texte, icônes informatives, bordures, états et indicateurs respectent au minimum le niveau applicable WCAG AA.
- [ ] Aucune progression, sélection, réussite, erreur, disponibilité ou priorité n'est transmise uniquement par couleur, position, image ou vibration.
- [ ] Les cibles tactiles sont suffisamment grandes et espacées sur les petits écrans iOS et Android pris en charge.
- [ ] Toute interaction gestuelle possède une action accessible équivalente ; le retour Android, le geste retour iOS et le clavier externe n'enferment pas le focus.
- [ ] La réduction des animations retire ou simplifie les mouvements non essentiels sans faire disparaître la progression ou le changement d'état.
- [ ] Les formulaires conservent la saisie valide, associent les erreurs aux champs et restent compatibles avec gestionnaires de mots de passe, copier-coller et claviers adaptés.
- [ ] Les images porteuses de sens ont une alternative concise décrivant leur fonction ou leur information ; les images d'ambiance sont masquées aux lecteurs d'écran.
- [ ] Les cinq états nominal, vide, chargement, erreur et hors ligne sont testés sur les parcours représentatifs ; les refus de permission sont testés lorsqu'ils s'appliquent.
- [ ] Des tests Maestro vérifient les parcours et libellés accessibles reproductibles, sans être présentés comme un remplacement des essais humains VoiceOver et TalkBack.
- [ ] Les défauts sont classés par impact utilisateur ; tout bloquant ou majeur sur un parcours essentiel est corrigé et retesté avant acceptation.
- [ ] Aucun document ne revendique une conformité légale globale sur la seule base de cette story.

## Cas limites

- État vide : le titre, l'explication et l'action sont annoncés dans un ordre logique, sans image décorative intercalée dans le parcours de focus.
- Erreur : le message est annoncé une fois, relié au champ ou à l'action concernée et permet de reprendre sans effacer les données valides.
- Chargement : l'état occupé est exposé sans annonces répétées à chaque rendu et sans déplacer constamment le focus.
- Permissions : un refus est compréhensible sans couleur, laisse l'app utilisable autant que possible et propose une alternative ou un accès aux réglages.
- Hors ligne : le statut est annoncé, le contenu disponible reste parcourable et les actions impossibles expliquent clairement pourquoi.
- Grande police : les contrôles horizontaux, dialogues, cartes et en-têtes se recomposent sans troncature ni action inaccessible.
- Orientation et petit écran : les safe areas, le clavier et le scroll permettent d'atteindre tous les champs et boutons.
- Image ou animation désactivée : le sens, la progression et la prochaine action restent disponibles sous forme textuelle ou sémantique.

## Hors périmètre de cette story

- Certification ou déclaration juridique de conformité complète.
- Audit d'anciennes versions iOS ou Android non supportées.
- Support tablette dédié, version web et périphériques spécialisés non prévus au périmètre.
- Réécriture éditoriale complète des contenus métier.
- Validation automatique de la qualité artistique des images.
- Remplacement des tests métier, de sécurité ou de performance.

## Notes techniques

Appliquer les APIs d'accessibilité React Native et tester les différences réelles entre VoiceOver et TalkBack. Maestro confirme les parcours et propriétés exposées, mais la qualité des annonces, l'ordre et la compréhension exigent une écoute humaine. Documenter chaque combinaison testée et chaque limite non couverte.
