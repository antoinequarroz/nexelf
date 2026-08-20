# Validation accessibilité mobile — Élan lumineux

Ce document consigne l'audit de la story 20. Il ne constitue ni une certification ni une déclaration de conformité légale globale.

## Périmètre audité dans le code

Ordre suivi : authentification, onboarding, accueil, planning, revue du soir, objectifs, habitudes, copilote, mémoire, réglages et notifications.

| Contrôle | Résultat vérifiable |
|---|---|
| Noms et rôles | Boutons, liens, choix, champs, progression et interrupteurs exposent un libellé et un rôle natif. |
| États | Boutons exposent `busy` et `disabled` ; choix exposent `checked` ; chargements exposent `busy`. |
| Annonces | Erreurs restent assertives ; chargements et succès utilisent une région dynamique polie. |
| Formulaires | Les champs conservent libellé visible, saisie, clavier adapté et aide ou erreur dans l'indication accessible. |
| Images | `ImageFrame` impose soit une alternative informative, soit le statut décoratif masqué. Aucune image tierce n'est requise pour accomplir un parcours. |
| Cibles tactiles | Le token partagé vaut 48 dp, couvrant le minimum Android de 48 dp et iOS de 44 pt. |
| Grande police | Les écrans défilent, les groupes de choix se replient et les actions principales ne fixent pas leur hauteur. Une validation sur appareil reste requise. |
| Contrastes | Les couples de texte, action et états sémantiques sont couverts par les tests WCAG AA. Une bordure décorative n'est jamais le seul porteur d'un état. |
| Mouvement | Aucun parcours audité ne dépend d'une animation. Les images utilisent une transition nulle ; la progression conserve une valeur textuelle accessible. |
| Gestes | Les actions métier possèdent un contrôle pressable ; les retours visibles complètent les gestes système. |

## Corrections réalisées

- Passage de la cible partagée de 44 à 48.
- Nom explicite sur les boutons et les choix afin d'éviter les annonces dérivées ambiguës.
- Contexte vocal complet pour l'énergie et les durées numériques.
- Annonce polie des chargements et confirmations, avec état occupé.
- Association de l'aide ou de l'erreur au champ via son indication accessible.
- Suppression de l'annonce des glyphes de sélection dans la composition d'une routine.
- Extension des tests de contraste aux états succès, avertissement et danger.
- Correction du groupe radio d'énergie : une valeur sélectionnée reste sélectionnée jusqu'au choix d'une autre valeur.
- Suppression du faux retour sur l'onglet racine Trajectoire et remplacement du chevron Unicode par une action « Retour » localisée.
- Encadrement des états génériques par le shell safe area ; désactivation de la cible tablette tant qu'une adaptation dédiée n'est pas validée.

## Vérifications automatisées

Exécuter :

```text
pnpm test
pnpm check
pnpm e2e
```

Les tests unitaires verrouillent les contrastes, la taille tactile et les contrats des primitives. Maestro vérifie que les libellés essentiels restent trouvables dans l'authentification et les réglages. Maestro ne valide ni la qualité d'une annonce ni l'ordre réel de VoiceOver ou TalkBack.

## Validation humaine restant à exécuter

Renseigner une ligne par combinaison réellement testée. Ne remplacer « à faire » qu'après écoute et observation sur la cible indiquée.

| Plateforme | Cible et version | Réglage | Parcours | Résultat observé | Statut |
|---|---|---|---|---|---|
| iOS | appareil ou simulateur à préciser | VoiceOver | connexion → onboarding → accueil → planning → revue | Non exécuté dans cet environnement Windows | À faire |
| iOS | appareil ou simulateur à préciser | taille de texte maximale ciblée + Réduire les animations | parcours principal et écrans secondaires | Non exécuté dans cet environnement Windows | À faire |
| Android | appareil ou émulateur à préciser | TalkBack | connexion → onboarding → accueil → planning → revue | Aucun émulateur et aucun lecteur d'écran disponible ici | À faire |
| Android | appareil ou émulateur à préciser | police 1,3× + suppression des animations | parcours principal et écrans secondaires | Aucun émulateur disponible ici | À faire |

Pour chaque parcours, vérifier : focus initial sur le titre ou le premier contenu utile, ordre identique à la hiérarchie visuelle, retour système sans piège, clavier ne masquant pas l'action, état vide/chargement/erreur/hors ligne compréhensible, et absence d'annonce répétée après stabilisation.

## Classification des défauts

- **Bloquant** : impossible d'accomplir une action essentielle avec la technologie d'assistance.
- **Majeur** : information ou état essentiel absent, ordre trompeur, action difficilement atteignable.
- **Mineur** : annonce redondante ou formulation perfectible sans perte d'autonomie.

Tout défaut bloquant ou majeur découvert pendant la validation humaine doit être corrigé et retesté avant de considérer la story acceptée.

## Limites connues à reprendre

- Les mutations des objectifs, habitudes et souvenirs n'exposent pas encore toutes un état occupé, un succès et une erreur locale. Ce renforcement relève d'une passe de robustesse dédiée ; il ne doit pas être déclaré validé par les seuls états de page.
- Les chargements génériques conservent désormais safe area et fond, mais certains écrans secondaires ne répètent pas encore leur titre pendant la requête initiale.
- Aucun test natif automatisé VoiceOver ou TalkBack n'a été exécuté. Les tests Vitest et Maestro présents ne remplacent pas cette validation.
