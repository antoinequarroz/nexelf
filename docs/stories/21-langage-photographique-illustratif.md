# 21 — Définir le langage photographique et illustratif

Statut : fait
Taille : M
Dépend de : 15

## Récit

En tant qu'équipe produit, je veux disposer d'un langage photographique et illustratif propre à Nexelf, afin que l'application donne envie d'avancer et soit reconnaissable sans dépendre d'une interface sombre ou d'effets génériques.

## Critères d'acceptation

- [x] Une planche documentée présente trois familles photographiques et une famille d'illustrations, chacune avec deux références à retenir et une anti-référence argumentée.
- [x] Les règles de lumière, couleur, cadrage, profondeur, matière, espace négatif et rythme sont écrites dans `docs/visual-language.md`.
- [x] Une matrice associe les écrans prioritaires à une intention, une famille, un ratio Expo, un point focal normalisé et un repli sans image.
- [x] Le briefing, le détail d'un objectif et la progression hebdomadaire possèdent une composition conceptuelle avec image et une variante sans image.
- [x] Les usages respectifs de la génération, du shooting, de la photographie licenciée et de l'illustration sont tranchés.
- [x] Les responsabilités de Codex et celles de l'utilisateur ou de la marque sont explicites.
- [x] Un prompt canonique, quatre variantes de famille et un prompt négatif sont disponibles pour les explorations futures.
- [x] Une grille de revue couvre artefacts, marques, anatomie, biais, recadrage, accessibilité et provenance.
- [x] Le logo original reste inchangé et aucune approximation n'a été créée en l'absence du maître vectoriel.
- [x] Aucun média tiers ou asset à la licence inconnue n'a été téléchargé.
- [x] Les interdits de la direction Élan lumineux sont consolidés dans `docs/design.md`.

## Livrables

- [`../visual-language.md`](../visual-language.md) — langage de production, matrice, arbitrages et prompts.
- [`../visual-reference-board.md`](../visual-reference-board.md) — planche de direction, anti-références et compositions de validation.
- [`../design.md`](../design.md) — direction artistique alignée sur Élan lumineux et liens vers les références.

## Cas limites

- **État vide :** chaque rôle indique un repli sans photographie ; une illustration abstraite n'est utilisée que si elle apporte un repère utile.
- **Erreur :** une image avec artefact, marque, texte, mauvais cadrage ou provenance impossible est rejetée par la grille de revue.
- **Chargement :** les compositions prévoient un aplat discret qui réserve le ratio sans retarder le contenu.
- **Permissions :** Codex peut proposer ; seuls les responsables de marque valident une direction, un portrait réel ou une publication.

## Hors périmètre de cette story

- Produire, acheter ou télécharger la photothèque finale.
- Modifier l'UI, les composants Expo, la navigation ou les tokens.
- Redessiner le logo ou fabriquer un maître vectoriel depuis les exports existants.
- Implémenter le manifest, le pipeline, les licences et les exports des stories 22 et 23.

## Notes techniques

La planche est volontairement documentaire : aucune maquette claire exploitable n'était stockée dans le dépôt au moment de la story. Les briefs peuvent servir à la génération, au sourcing ou à un shooting sans créer de dépendance à une image non autorisée.
