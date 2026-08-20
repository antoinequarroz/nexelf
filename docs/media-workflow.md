# Médiathèque Nexelf — provenance, validation et retrait

## Sources de vérité

- Manifest livré : [`../assets/media/manifest.json`](../assets/media/manifest.json)
- Schéma documentaire : [`media-manifest.schema.json`](media-manifest.schema.json)
- Types consommables par l'application : [`../src/lib/media/manifest.ts`](../src/lib/media/manifest.ts)
- Langage de sélection : [`visual-language.md`](visual-language.md)
- Planche de référence : [`visual-reference-board.md`](visual-reference-board.md)
- Contrôle : `pnpm media:check`

Le manifest ne remplace pas une preuve juridique. Il pointe vers une facture, licence ou autorisation conservée dans un espace privé durable, avec un identifiant interne qui ne révèle aucune donnée personnelle.

## États

| État | Sens | Peut être livré ? |
|---|---|---|
| `processing` | Master en cours de contrôle ou de conversion | Non |
| `needs_review` | Dérivés prêts, décision humaine manquante | Non |
| `approved` | Droits et rendu approuvés par une personne nommée | Oui |
| `rejected` | Asset refusé, motif dans `reviewNotes` | Non |
| `withdrawn` | Asset précédemment utilisable, désormais retiré | Non |

Les deux placeholders initiaux restent `needs_review`. Ils sont légers, abstraits et décoratifs, mais leur présence dans Git ne vaut pas validation de marque ni autorisation d'intégration.

## Ajouter un asset

1. **Utilisateur — établir le droit.** Fournir le master, la source originale, l'auteur, la licence et sa preuve. Si une personne est identifiable, fournir une référence vers le consentement privé couvrant l'usage. Ne transmettre aucun secret ou document nominatif dans Git.
2. **Codex — préparer sans publier.** Attribuer un identifiant sémantique, créer une entrée complète avec les valeurs non applicables à `null`, proposer ratios, point focal, statut décoratif et alternative française.
3. **Codex — dériver.** Recadrer avant de redimensionner, supprimer EXIF/GPS, produire seulement les densités justifiées et placer les fichiers livrables sous `assets/media/derivatives/` ou sous une clé distante stable.
4. **Codex — contrôler.** Lancer `pnpm media:check`, inspecter mains, visages, reflets, texte involontaire, marques, couleur, compression et recadrages.
5. **Utilisateur — approuver.** Vérifier la fidélité de marque, la représentation, la licence et le consentement. Renseigner `approvedBy` et `approvedAt`, puis passer à `approved`.
6. **Équipe — vérifier sur appareil.** Comparer iOS et Android, `1x`/`2x` et seulement `3x` si le gain est visible. L'intégration écran relève de la story 23.

## Champs de provenance selon la source

### Création originale Nexelf

- `sourceType: original`
- auteur et référence de création internes
- licence ou règle d'usage interne et preuve dans l'historique de projet
- champs IA à `null`

### Génération assistée

- `sourceType: generated`
- modèle, date et référence de prompt obligatoires
- références d'entrée uniquement si leurs droits autorisent cet usage
- revue humaine obligatoire avant `approved`
- jamais de personne générée utilisée comme témoignage, équipe ou preuve

### Photothèque ou commande

- `sourceType: licensed` ou `shooting`
- fournisseur ou photographe, date d'acquisition, licence et facture référencés
- usages commerciaux, modification, application mobile, territoires, attribution, durée et redistribution vérifiés
- consentement séparé pour toute personne identifiable lorsque nécessaire

### Fichier fourni par un utilisateur

- `sourceType: user_provided`
- origine déclarée et droit de traitement confirmés
- accès privé par défaut ; ne jamais transformer une URL privée en URL publique permanente
- suppression et isolement par compte traités avant tout usage produit

## Budgets bloquants

| Rôle | Cible de production | Maximum contrôlé |
|---|---:|---:|
| `screen_hero` | 120 Ko | 180 Ko |
| `card_image` | 40 Ko | 70 Ko |
| `thumbnail` ou `avatar` | 20 Ko | 35 Ko |
| `state_illustration` | 50 Ko | 80 Ko |

Le script bloque le maximum, les dimensions déclarées fausses, les identifiants instables, les fichiers manquants, les doublons binaires, les dérivés orphelins, les SVG exécutables ou externes et les champs conditionnels absents. La cible reste une décision de qualité contrôlée en revue.

## Remplacer un asset

1. Créer un nouvel identifiant ou une nouvelle version de chemin ; ne pas écraser silencieusement un fichier susceptible d'être en cache.
2. Faire passer le remplaçant par toutes les étapes de provenance et de validation.
3. Mettre à jour les usages vers le nouvel identifiant.
4. Vérifier l'absence d'usage de l'ancien asset.
5. Passer l'ancien asset à `withdrawn`, documenter le motif, puis supprimer ses dérivés lorsque les caches et versions encore supportées le permettent.

## Retrait normal

1. Le responsable de marque ou des droits passe immédiatement l'entrée à `withdrawn` et note la date et le motif sans donnée personnelle.
2. L'équipe recherche l'identifiant et chaque `pathOrKey` dans le dépôt, le stockage distant et les contenus configurables.
3. Un fallback approuvé remplace l'asset. L'écran doit conserver son sens sans image.
4. Les clés distantes sont révoquées, les dérivés supprimés et les caches invalidés ou versionnés.
5. Une version corrective est publiée si un asset embarqué est concerné ; l'impossibilité d'effacer un ancien binaire déjà installé est expliquée au demandeur.
6. Les preuves de retrait et les obligations de conservation restent dans l'espace privé prévu.

## Retrait urgent

Pour une fuite, un retrait de consentement ou un droit invalide : bloquer d'abord la diffusion distante, désactiver l'usage par identifiant, puis traiter l'interface et le binaire. Ne pas attendre une nouvelle image parfaite. Un aplat ou un écran sans média est le fallback sûr.

## Inventaire initial

La story installe deux placeholders originaux, décoratifs et non trompeurs afin de tester le pipeline carré et portrait. Elle ne fabrique pas les 12 à 20 images éditoriales définitives : ce lot dépend du choix de la marque, des masters et des droits fournis par l'utilisateur. Aucun asset externe n'a été acheté ou téléchargé.
