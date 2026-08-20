# 18 — Migrer l'accueil et les parcours principaux

Statut : partiel — écrans migrés, logo et validation E2E native manquants
Taille : L
Dépend de : 15, 16, 17

## Récit

En tant qu'utilisateur, je veux retrouver l'accueil, l'onboarding, le planning et le rituel quotidien dans une expérience claire et stimulante afin de comprendre immédiatement mon cap et d'avancer sans perdre mes repères.

## Critères d'acceptation

- [ ] La migration suit cet ordre vertical et chaque tranche est validée de bout en bout avant la suivante : onboarding, accueil, planning, puis revue du soir.
- [ ] L'onboarding conduit jusqu'au premier plan avec les nouveaux tokens et composants, sans modifier ses données, validations, sauvegarde ni reprise.
- [ ] L'accueil présente dans cet ordre le cap de vie, le pas essentiel du jour, sa progression et les informations secondaires ; une seule action primaire domine visuellement.
- [ ] Le planning permet toujours de créer, terminer, reporter, supprimer, réorganiser et restaurer une action, sans modifier les contrats Convex ni les règles métier.
- [ ] La revue du soir conserve ses questions facultatives, sa durée courte et la validation explicite de ce que Nexelf propose de mémoriser.
- [ ] Le logo original validé est réutilisé sans modifier son symbole, ses proportions ou son dessin ; il n'est pas répété comme décoration.
- [ ] Les écrans utilisent une faible densité : peu de blocs concurrents, regroupements explicites, espaces généreux et divulgation progressive des détails.
- [ ] Les images sont porteuses de sens — projection vers un futur souhaité, énergie, action ou progression — et ne servent pas de remplissage décoratif.
- [ ] Chaque image réserve son ratio avant chargement, possède un cadrage adapté au téléphone et laisse le texte ainsi que l'action principale lisibles.
- [ ] Les rendus iOS et Android respectent leurs safe areas, gestes de retour, boutons système, clavier logiciel et différences de hauteur d'écran.
- [ ] Les chaînes françaises et anglaises, les couleurs et les styles passent par les systèmes partagés existants ; aucune couleur ou chaîne d'interface n'est ajoutée en dur.
- [ ] Les données, l'authentification, le hors-ligne et les permissions existants continuent de fonctionner sans migration de schéma.
- [ ] Le parcours complet « terminer l'onboarding → voir son cap → agir sur le planning → clôturer sa journée » est vérifié sur au moins un appareil ou simulateur iOS et Android.

## Cas limites

- État vide : l'accueil et le planning expliquent leur valeur et proposent une seule prochaine action adaptée, sans remplir l'espace avec des cartes ou images gratuites.
- Erreur : les données déjà disponibles restent visibles lorsque c'est sûr, un message utile explique l'échec et une action permet de réessayer ou revenir à un état stable.
- Chargement : la hiérarchie et l'emplacement de l'action principale restent stables ; les placeholders réservent l'espace des images et contenus attendus.
- Permissions : aucune donnée d'un autre compte n'apparaît ; l'utilisateur voit une explication et une sortie sûre vers la connexion ou l'écran précédent.
- Hors ligne : le dernier contenu disponible et les actions réellement supportées restent accessibles, avec un statut visible qui ne dépend pas uniquement de la couleur.
- Image indisponible : un fond ou visuel de remplacement conserve la composition et l'action principale sans afficher un cadre vide cassé.
- Reprise : revenir dans l'app après interruption conserve l'étape d'onboarding, le brouillon ou la revue déjà saisis lorsque le comportement existant le prévoit.

## Hors périmètre de cette story

- Migration des objectifs, habitudes, copilote, mémoire, notifications et réglages.
- Modification des algorithmes de planning, du modèle Convex ou des capacités hors ligne.
- Création d'un nouveau logo ou modification du logo original.
- Mode sombre et personnalisation de thème.
- Génération personnalisée d'images pour chaque utilisateur.
- Nouvelle animation complexe, nouvelle fonctionnalité métier ou changement de navigation non prévu par la story 17.

## Notes techniques

Migrer une tranche à la fois et conserver un diff centré sur la présentation. Utiliser les primitives de la story 16 et la structure de navigation de la story 17. Pour les images, privilégier `expo-image`, un ratio explicite, un fallback local et une source dont les droits sont documentés. Vérifier les comportements à petite hauteur, avec clavier ouvert et avec réduction des animations.
