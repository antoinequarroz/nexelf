# 22 — Constituer la médiathèque et tracer les droits

Statut : fait — infrastructure prête, sélection éditoriale à fournir
Taille : M
Dépend de : 21

## Récit

En tant qu'équipe produit, je veux une médiathèque dont chaque image possède une provenance, des droits et des variantes Expo vérifiables, afin de publier des visuels cohérents sans risque juridique, fuite de données ni fichier inutilement lourd.

## Critères d'acceptation

- [x] Un manifest versionné contient les identifiants, rôles, familles, provenance, droits, consentement, informations IA, point focal, ratios, accessibilité, variantes, dimensions, poids et revue.
- [x] Les champs non applicables sont explicitement `null` et le validateur bloque les champs conditionnels incohérents.
- [x] Des types TypeScript offrent une surface de lecture unique à l'application.
- [x] Un schéma JSON documente le contrat sans ajouter de dépendance au runtime.
- [x] Les masters privés, preuves juridiques et dérivés livrables ont des emplacements et responsabilités distincts.
- [x] Deux placeholders abstraits, légers et non trompeurs exercent les ratios `1:1` et `4:5` sans prétendre constituer une photothèque finale.
- [x] Le validateur contrôle identifiants, droits approuvés, consentement, génération, point focal, dimensions, poids, doublons, dérivés orphelins et SVG dangereux.
- [x] Des tests purs couvrent un asset valide, les preuves manquantes, le dépassement de budget, les fichiers orphelins, les dimensions et la sécurité SVG.
- [x] Le workflow sépare clairement ce que Codex prépare de ce que l'utilisateur fournit ou approuve.
- [x] Les procédures de remplacement, retrait normal et retrait urgent sont documentées.
- [ ] Le lot éditorial de 12 à 20 assets définitifs sera constitué après fourniture ou validation des visuels et de leurs droits par l'utilisateur.

## Livrables

- [`../../assets/media/manifest.json`](../../assets/media/manifest.json)
- [`../media-manifest.schema.json`](../media-manifest.schema.json)
- [`../media-workflow.md`](../media-workflow.md)
- `src/lib/media/manifest.ts`
- `scripts/validate-media.mjs` et ses tests
- `assets/media/derivatives/placeholder-elan-*.svg`

## Cas limites

- **État vide :** l'absence d'asset approuvé reste un état valide ; l'écran doit fonctionner sans photographie et aucun placeholder `needs_review` n'est publié automatiquement.
- **Erreur :** le script retourne une liste actionnable et un code d'échec sans publier partiellement le manifest.
- **Chargement :** un asset en traitement reste `processing` et ses masters ne sont ni exposés ni consommables par l'application.
- **Permissions :** Codex peut préparer et contrôler ; une personne désignée fournit les droits et passe l'asset à `approved`.

## Hors périmètre de cette story

- Acheter, télécharger ou publier un asset externe.
- Fabriquer artificiellement le lot éditorial avant la décision de marque.
- Ajouter un DAM, un CDN ou un stockage distant.
- Intégrer le manifest ou les placeholders dans un écran.
- Modifier la navigation, les composants UI ou les tokens.

## Notes techniques

Exécuter `pnpm media:check` avant tout commit qui ajoute ou modifie un dérivé. `pnpm check` et `pnpm test` restent les contrôles globaux. Les entrées `needs_review`, `rejected` et `withdrawn` peuvent rester dans le manifest pour assurer la traçabilité, mais elles ne seront jamais rendues par le composant de la story 23.
