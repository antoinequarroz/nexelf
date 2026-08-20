# 23 — Intégrer les images dans Expo et valider la qualité visuelle

Statut : fait — QA automatisée, validation sur appareils à exécuter
Taille : M
Dépend de : 21, 22

## Récit

En tant qu'utilisateur mobile, je veux voir des images inspirantes, nettes et stables sans attendre ni perdre le sens de l'écran, afin que Nexelf m'aide à avancer même sur un appareil modeste ou un réseau dégradé.

## Critères d'acceptation

- [x] `ManifestImage` et `ImageFrame` forment le point d'entrée unique du manifest vers Expo Image.
- [x] Le registre refuse tout asset non approuvé, expiré, retiré, absent ou non résolu.
- [x] La variante est choisie selon la largeur rendue et la densité sans charger un master.
- [x] Le ratio est réservé et le point focal pilote le recadrage.
- [x] Le cache mémoire/disque, la priorité et une clé distante versionnée sont configurés.
- [x] Une erreur de média affiche un fallback abstrait natif sans supprimer le contenu ou l'action.
- [x] Les images décoratives sont ignorées et les images informatives tirent leur libellé du manifest.
- [x] L'accueil, la première étape d'onboarding et les objectifs consomment le registre avec une seule image forte maximum par écran.
- [x] Les candidats `needs_review` restent bloqués ; aucun asset non approuvé n'est rendu.
- [x] Les budgets du lot actuel sont contrôlés et documentés.
- [x] Des tests purs couvrent approbation, variantes, cache, expiration, retrait, résolution et ratios.
- [x] La matrice de QA iOS/Android, accessibilité, réseau, cache et mémoire est documentée.
- [ ] Les captures et mesures sur appareils iOS/Android seront consignées lorsqu'une development build et les appareils cibles seront disponibles.

## Livrables

- `src/components/ui/image-frame.tsx`
- `src/components/media/manifest-image.tsx`
- `src/lib/media/registry.ts` et ses tests
- `src/lib/media/bundled-sources.ts`
- [`../media-qa.md`](../media-qa.md)

## Cas limites

- **État vide :** les trois écrans gardent contenu et action avec le fallback ou sans photographie approuvée.
- **Erreur :** une erreur de chargement ou une source non résolue termine sur le fallback, sans boucle ni détail technique visible.
- **Chargement :** le ratio est réservé et le contenu utile n'attend pas le média.
- **Permissions :** seul `approved` est résolu ; `needs_review`, `rejected`, `processing` et `withdrawn` restent invisibles.
- **Hors ligne :** un asset embarqué ou en cache peut apparaître ; sinon le fallback conserve l'écran.

## Hors périmètre de cette story

- Approuver les placeholders à la place du responsable de marque.
- Ajouter une photographie, un CDN, une vidéo ou une animation continue.
- Mesurer ou déclarer des performances natives sans appareil observé.
- Modifier les parcours, données, actions, navigation ou textes métier.

## Notes techniques

Le registre des sources embarquées reste statique pour Metro, mais le statut du manifest demeure la garde de rendu. Un remplacement distant change `pathOrKey`, ce qui change la clé de cache. Un asset embarqué retiré exige une mise à jour de l'application ; son statut empêche néanmoins toute résolution dans une version recevant le nouveau manifest.
