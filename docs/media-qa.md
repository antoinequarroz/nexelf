# QA images Expo — story 23

## Périmètre livré

Le registre est branché sur trois surfaces prioritaires :

| Surface | Asset candidat | Position | Ratio réservé | Comportement actuel |
|---|---|---|---|---|
| Accueil / briefing | `illustration-placeholder-portrait-01` | Au-dessus du cap | `4:5` | Fallback natif, asset `needs_review` bloqué |
| Onboarding, étape 1 | `illustration-placeholder-portrait-01` | Après l'intention | `4:5` | Fallback natif, asset `needs_review` bloqué |
| Objectifs | `illustration-placeholder-square-01` | Avant la création | `1:1` | Fallback natif, asset `needs_review` bloqué |

Une seule instance `ManifestImage` est présente sur chacun de ces écrans. Le média reste séparé des titres, données, formulaires et actions. Les états de chargement et d'accès interdit ne demandent aucun média.

## Garde de publication

`resolveMedia` ne renvoie une source que si :

1. l'identifiant existe ;
2. `reviewStatus` vaut `approved` ;
3. la date d'expiration n'est pas dépassée ;
4. une variante adaptée existe ;
5. la source embarquée est enregistrée statiquement ou l'URL distante est HTTPS.

Tout autre cas utilise le fallback natif. Un asset `withdrawn`, `rejected`, `processing` ou `needs_review` n'est jamais passé à `expo-image`.

## Comportement du composant

- Le ratio du manifest est réservé par le conteneur avant décodage.
- Le point focal normalisé devient `contentPosition`.
- La variante choisie est la plus petite couvrant `largeur rendue × densité`, avec la plus grande disponible en repli.
- `expo-image` utilise `memory-disk`, une priorité haute au-dessus de la ligne de flottaison et basse sinon.
- Une source distante reçoit une clé de cache composée de l'identifiant et du chemin versionné. Un remplacement crée un nouveau chemin ; il n'écrase jamais silencieusement l'ancien.
- Le fallback est un motif abstrait natif sans texte, sans personne et sans revendication de résultat.
- Une erreur de décodage bascule vers ce fallback sans retirer le titre ni l'action.
- Une image décorative est ignorée par VoiceOver/TalkBack. Une image informative utilise uniquement `altFr` validé dans le manifest.
- La transition reste courte et sans animation continue.

## Budget observé dans ce commit

| Mesure | Valeur | Budget |
|---|---:|---:|
| Asset candidat portrait | 397 octets | 180 Ko maximum hero |
| Asset candidat carré | 397 octets | 80 Ko maximum illustration |
| Réseau au premier écran | 0 octet | 300 Ko cible / 450 Ko maximum |
| Surcoût brut des deux SVG embarqués | 794 octets | À suivre dans le binaire réel |
| Images fortes par écran | 1 | 1 maximum |

Le réseau reste à zéro car les candidats sont embarqués et bloqués avant approbation ; le fallback est composé de vues natives. Ces chiffres ne remplacent pas la mesure du binaire compressé ni le profil mémoire sur appareil.

## Contrôles automatisés

- `pnpm media:check` : provenance, statut, poids, dimensions, formats, doublons, orphelins et sécurité SVG.
- `pnpm test` : refus des candidats non approuvés, sélection des variantes, expiration/retrait, source embarquée non résolue, cache distant versionné et ratios.
- `pnpm check` : types React Native/Expo et lint.

## Matrice manuelle sur appareils

Ne cocher une ligne qu'après observation sur une development build ; Expo Go et une capture web ne suffisent pas.

| Scénario | iOS | Android | Attendu |
|---|---|---|---|
| 320 px, police système normale | à faire | à faire | Point focal conservé, contenu accessible par défilement |
| 375–390 px, police normale | à faire | à faire | Ratio stable, aucune action masquée |
| Tablette | à faire | à faire | Pas d'étirement flou, largeur visuelle maîtrisée |
| Grande taille de texte | à faire | à faire | Titres et actions hors image, aucun contenu tronqué |
| VoiceOver / TalkBack | à faire | à faire | Fallback et décorations ignorés, alt informatif annoncé une fois |
| Cache froid | à faire | à faire | Surface stable puis média sans saut |
| Cache chaud | à faire | à faire | Pas de flash d'une ancienne version |
| Réseau lent | à faire | à faire | Contenu utilisable avant le média distant |
| Hors ligne | à faire | à faire | Embarqué/cache ou fallback, jamais d'écran bloqué |
| URL distante invalide | à faire | à faire | Fallback terminal, aucune donnée technique affichée |
| Asset retiré | à faire | à faire | Source bloquée et ancienne clé non réutilisée |
| Mode sombre du système | à faire | à faire | App claire cohérente, aucun flash sombre inattendu |

## Profil performance à réaliser

Sur un appareil Android modeste et une development build :

1. vider le cache de l'application ;
2. mesurer le temps entre navigation et contenu utile, puis entre navigation et média final ;
3. relever mémoire avant l'écran, après affichage et après dix allers-retours ;
4. faire défiler une liste contenant plusieurs futurs médias et vérifier qu'aucun téléchargement identique concurrent n'apparaît ;
5. recommencer cache chaud et réseau dégradé ;
6. consigner appareil, OS, build, poids transféré, durée et pic mémoire.

Aucune valeur native n'est revendiquée dans cette story faute d'appareil ou simulateur observé. Les futures photographies devront être mesurées à nouveau : les placeholders de quelques centaines d'octets ne prédisent pas leur coût.

## Retrait et confidentialité

Le retrait suit [`media-workflow.md`](media-workflow.md). En urgence, passer le statut à `withdrawn` bloque immédiatement toute nouvelle résolution. Pour une URL distante, révoquer ensuite la source et invalider sa clé ; pour un asset embarqué, publier une mise à jour corrective et expliquer qu'un ancien binaire installé ne peut pas être effacé à distance.
