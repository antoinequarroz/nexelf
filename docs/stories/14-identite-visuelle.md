# 14 — Donner une identité visuelle cohérente à Nexelf

Statut : à faire  
Taille : M  
Dépend de : 02, 05

## Récit

En tant qu'utilisateur, je veux reconnaître immédiatement Nexelf et ressentir une expérience calme, premium et cohérente dès l'ouverture de l'application.

## Critères d'acceptation

- [ ] Une piste créative principale traduit la promesse « Become your next self. » sans reprendre les codes d'un chatbot générique.
- [ ] Le logo comprend un symbole distinctif, un logotype Nexelf et des versions horizontale, compacte et monochrome.
- [ ] L'icône iOS et Android reste identifiable aux petites tailles et respecte les zones sûres et masques natifs.
- [ ] Une icône adaptative Android fournit séparément premier plan, arrière-plan et variante monochrome.
- [ ] Le splash screen natif reprend le symbole, le fond Quiet Command et une transition discrète vers l'application, sans faux chargement.
- [ ] Les assets couvrent les variantes sombre, claire sur fond de marque et monochrome nécessaires aux stores et communications.
- [ ] Une mini charte documente palette, typographies, espacements autour du logo, tailles minimales et usages interdits.
- [ ] Les fichiers maîtres vectoriels et exports PNG sont nommés, versionnés et intégrés à la configuration Expo.
- [ ] Le contraste, la réduction des mouvements et le rendu avec grande police restent conformes aux exigences d'accessibilité.
- [ ] Le résultat est vérifié sur au moins un appareil ou simulateur iOS et Android, ainsi que sur les aperçus d'icônes des stores.

## Livrables

- Logo maître vectoriel et variantes.
- Icônes iOS, Android adaptative et notification monochrome.
- Splash screen et fond de lancement.
- Favicon et image de partage pour les futures surfaces web.
- Page de mini charte dans `docs/brand.md`.
- Maquette de validation présentant briefing, planning et copilote avec l'identité retenue.

## Cas limites

- Le symbole reste lisible sur petit écran, écran OLED et fond à faible contraste.
- Le lancement ne montre ni flash blanc ni logo étiré selon le ratio de l'appareil.
- Une version monochrome reste exploitable quand les couleurs système ou une notification l'imposent.
- L'application démarre normalement si une animation est désactivée ou interrompue.

## Hors périmètre de cette story

- Refonte complète des écrans métier.
- Campagne publicitaire, mascotte, illustration éditoriale et motion design avancé.
- Mode clair complet de l'application.
- Captures et textes définitifs des fiches App Store et Play Store.

## Notes techniques

Conserver les sources éditables hors des dossiers générés. Exporter les assets aux dimensions requises par Expo, déclarer le splash et l'icône adaptative dans `app.json`, puis vérifier le résultat dans une development build : Expo Go ne représente pas fidèlement tous les écrans de lancement natifs.

