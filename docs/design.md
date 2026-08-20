# Direction artistique — Nexelf

## Registre

Nexelf est **lumineux, ambitieux et humain**. L'interface donne envie d'avancer : elle relie un cap de vie à un pas concret sans devenir un tableau de bord anxiogène, un coach culpabilisant ni un chatbot générique.

## Direction : Élan lumineux

Un fond ivoire chaleureux installe le calme. Un bleu profond porte la confiance et les actions principales. Le pêche donne une impulsion ponctuelle, la lavande ménage une respiration et le vert naturel matérialise la progression. Les compositions restent aérées, orientées vers l'avant et organisées autour d'une seule priorité visible.

Cette direction remplace explicitement **Quiet Command** et son registre nocturne. Le mode clair est la référence de Nexelf ; un éventuel mode sombre demandera une palette conçue et testée séparément.

## Palette sémantique

Les noms expriment un rôle d'interface, jamais une couleur décorative.

| Rôle | Valeur | Usage |
|---|---:|---|
| `background` | `#FBF8F1` | Fond ivoire de l'application |
| `surface` | `#FFFFFF` | Surface principale |
| `surfaceRaised` | `#F3EFE7` | Niveau secondaire, sans empiler les cartes |
| `border` | `#D9D5CC` | Séparateurs et contours nécessaires |
| `text` | `#17233B` | Texte principal bleu encre |
| `textMuted` | `#526078` | Texte secondaire |
| `textSubtle` | `#687386` | Métadonnées et placeholders |
| `action` | `#31579D` | Action principale et focus |
| `actionPressed` | `#24447E` | État pressé |
| `onAction` | `#FFFFFF` | Contenu sur action principale |
| `progress` | `#26734A` | Progression, confirmation et Next Line |
| `progressPressed` | `#1D5A3A` | État pressé de progression |
| `onProgress` | `#FFFFFF` | Contenu sur progression |
| `impulseSurface` | `#FBE4D5` | Pêche, impulsion éditoriale |
| `reflectionSurface` | `#ECE7F7` | Lavande, réflexion et respiration |
| `growthSurface` | `#E2F0E5` | Vert naturel, progression douce |
| `danger` | `#B4233C` | Erreur et action destructive |
| `onDanger` | `#FFFFFF` | Contenu sur danger |

Les couples texte/fond et libellé/action atteignent WCAG AA. Les teintes pêche, lavande et vert clair sont des surfaces : elles reçoivent `text`, jamais du blanc. Aucune information essentielle ne dépend uniquement d'une couleur.

## Typographie et composition

- Titres et moments de marque : **Sora SemiBold**.
- Lecture et interface : **Manrope Regular/Medium/SemiBold**.
- Échelle courte, titres expressifs et corps très lisible avec grande police.
- Rayons principaux de 14 à 18 px ; les pilules restent réservées aux petits contrôles.
- Espacement généreux entre les groupes, resserré à l'intérieur d'un même groupe.
- Une action dominante et deux niveaux de surface au maximum dans une zone importante.
- Les bordures structurent uniquement ce qui ne peut pas l'être par l'espace ou le contraste de surface.

## Logo original

Le symbole original validé est conservé dans sa forme et ses proportions. Il n'est ni redessiné, ni étiré, ni remplacé par un monogramme improvisé. Tant que le fichier maître n'est pas identifié, aucun export définitif n'est recréé.

- Préserver autour du symbole une zone de protection au moins égale à l'épaisseur de son élément principal.
- Ne jamais afficher le symbole sous une taille où ses détails cessent d'être distincts ; valider la taille minimale depuis le fichier maître.
- Utiliser uniquement les variantes fournies ou validées : originale, monochrome et adaptée au fond.
- Réserver le logo aux moments de marque ; il ne remplace pas une commande de navigation.

## Images éditoriales

Une image peut porter un écran clé lorsqu'elle rend tangible le cap, le mouvement ou une étape franchie. Privilégier la lumière naturelle, les gestes vrais, des horizons ouverts et une représentation diverse des trajectoires. Éviter les poses de performance, les clichés de productivité, les injonctions sportives et la positivité artificielle.

Une seule image forte suffit par écran important. Elle conserve un cadrage défini, une provenance et une licence documentées. Si elle manque ou charge mal, la hiérarchie et le sens de l'écran restent complets. Une image décorative est ignorée par les lecteurs d'écran ; une image informative reçoit une alternative concise.

## Élément signature : la Next Line

Un trait vert `progress` matérialise la trajectoire entre l'état actuel et la prochaine action. Il apparaît au maximum une fois par écran important, suit une direction ascendante ou progressive et ne remplace jamais un libellé, une valeur ou un état accessible.

## Mouvement

L'élan vient d'abord de la composition. Les animations sont brèves, déclenchées par une action et réversibles. Aucune animation continue ; avec la réduction des mouvements, utiliser une transition instantanée ou un fondu discret.

## Interdits

- Aucun retour au fond noir et à l'accent lime comme monde visuel principal.
- Aucun dégradé bleu-violet, texte en dégradé ou glassmorphism décoratif.
- Aucune succession de cartes arrondies sans hiérarchie.
- Aucune ombre et bordure simultanées pour simuler artificiellement la profondeur.
- Aucune couleur ou chaîne d'interface en dur dans un composant.
- Aucun pictogramme Unicode ou emoji en guise de système d'icônes.
- Aucun ton culpabilisant, alarmiste ou faussement enthousiaste.
