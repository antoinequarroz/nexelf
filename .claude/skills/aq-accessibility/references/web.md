# Web — WCAG 2.2 AA

Références officielles : <https://www.w3.org/TR/WCAG22/>, <https://www.w3.org/WAI/WCAG22/quickref/> et <https://www.w3.org/WAI/WCAG22/Understanding/>.

## Principes

Organiser l'audit selon Perceptible, Utilisable, Compréhensible et Robuste, mais rapporter les problèmes par parcours utilisateur. WCAG définit des critères testables ; les documents « Understanding » expliquent l'intention sans remplacer le texte normatif.

## Points WCAG 2.2 souvent oubliés

- Le focus clavier ne doit pas être entièrement masqué par un contenu créé par le site.
- Les interactions de glisser doivent avoir une alternative sans glisser.
- Les cibles doivent atteindre la taille/espacement minimum applicable ; viser plus large sur mobile.
- L'aide répétée doit rester cohérente.
- Ne pas demander deux fois une information déjà fournie dans le même processus si elle peut être proposée automatiquement, sauf exception.
- L'authentification ne doit pas imposer inutilement un test cognitif ; permettre gestionnaires, copier-coller et méthodes alternatives.

## Sémantique

Préférer HTML natif : bouton, lien, label, fieldset/legend, table et headings. Ajouter ARIA uniquement lorsque le composant natif ne suffit pas, conformément au pattern et avec comportement clavier complet.

## CMS

L'interface d'édition et le contenu publié sont deux surfaces. Encadrer les champs alt, titres, liens et médias, mais permettre explicitement une image décorative. La prévisualisation doit révéler les problèmes avant publication sans publier un brouillon.
