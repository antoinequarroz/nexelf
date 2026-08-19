# Mobile — Expo et React Native

Référence officielle : <https://reactnative.dev/docs/accessibility> et guides Apple/Android correspondant aux versions cibles.

## Sémantique native

- Utiliser composants pressables/text/input adaptés et `accessibilityRole` correct.
- Fournir label seulement si le texte visible ne donne pas déjà un nom correct ; éviter les annonces dupliquées.
- Exposer `accessibilityState` pour selected, disabled, checked, busy et expanded.
- Exposer `accessibilityValue` pour progression, slider et valeurs.
- Utiliser live regions/announcements avec modération pour changements importants.
- Masquer uniquement les éléments décoratifs ou l'arrière-plan d'une vraie modal, jamais du contenu utile par commodité.

## Différences plateformes

VoiceOver et TalkBack ne regroupent, n'ordonnent et n'annoncent pas toujours pareil. Tester les deux. Une propriété iOS peut ne pas avoir d'équivalent Android.

Ne pas utiliser une API expérimentale d'ordre d'accessibilité en production sans décision explicite ; corriger d'abord la structure et le layout.

## Texte et interface

- Respecter la taille dynamique et éviter `allowFontScaling={false}` sauf cas exceptionnel démontré.
- Prévoir plusieurs lignes, contenu traduit et tailles système maximales.
- Assurer zones tactiles généreuses, actions alternatives aux swipes et feedback non uniquement haptique/couleur.
- Respecter réduction de mouvement, contraste/inversion et orientation prévue.

## Focus

Après navigation ou modal, placer le contexte de manière prévisible si nécessaire. Ne pas forcer le focus à chaque mise à jour temps réel. Tester écran ouvert à froid, retour arrière, erreur et deep link.
