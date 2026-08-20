# 17 — Clarifier la navigation et la hiérarchie des écrans

Statut : à faire  
Taille : L  
Dépend de : 16

## Récit

En tant qu'utilisateur, je veux comprendre immédiatement où je suis, ce qui compte maintenant et comment avancer afin que Nexelf soutienne mon élan sans m'imposer un tableau de bord dense.

## Critères d'acceptation

- [ ] L'architecture de navigation distingue clairement le rituel quotidien, la trajectoire, le copilote et les réglages, avec un accès stable aux destinations principales.
- [ ] Chaque écran possède un seul titre principal, une action dominante et un ordre de lecture qui place l'essentiel avant les détails et réglages.
- [ ] L'accueil expose dans cet ordre le cap de vie, le pas essentiel du jour et la progression utile, avant les priorités secondaires.
- [ ] Le logo original apparaît uniquement aux emplacements de marque définis et ne remplace ni un bouton de retour ni une indication de position.
- [ ] Les écrans à faible contenu restent aérés sans agrandir artificiellement des cartes, tandis que les écrans chargés regroupent ou dévoilent progressivement les informations secondaires.
- [ ] Une image éditoriale peut introduire un parcours ou un moment important sans pousser l'action principale hors de la zone utile ni entrer en concurrence avec le contenu.
- [ ] Les formulaires longs séparent la saisie de la consultation lorsque leur coexistence rend l'écran dense ; les données déjà saisies restent conservées lors d'un retour.
- [ ] Les actions destructives ou rares sont visuellement secondaires, explicites et séparées de l'action principale.
- [ ] Le retour natif, le geste de retour et les boutons visibles conduisent au même résultat prévisible, sans boucle ni perte silencieuse de saisie.
- [ ] Les libellés de navigation et de retour passent par l'internationalisation et restent compréhensibles hors contexte visuel.
- [ ] Le parcours reste complet avec grande police, lecteur d'écran, réduction des mouvements, orientation portrait et utilisation à une main.
- [ ] Les écrans chargement, vide, erreur et hors ligne conservent le même en-tête, la même position dans la navigation et une prochaine action claire.

## Cas limites

- Première utilisation : l'absence de données conduit vers une seule action de démarrage plutôt que vers plusieurs cartes vides.
- Journée sans priorité : le cap et le bouton de composition restent visibles sans afficher un faux progrès.
- Saisie non enregistrée : un retour demande confirmation ou conserve un brouillon selon le risque de perte.
- Lien profond : l'utilisateur arrive sur un écran secondaire avec un titre, un contexte et un chemin de retour valides.
- Connexion expirée : le retour vers l'authentification préserve la destination demandée lorsque cela ne compromet pas la sécurité.
- Texte traduit plus long : les onglets, en-têtes et boutons se réorganisent sans troncature ambiguë.

## Hors périmètre de cette story

- Modification des règles métier des objectifs, du planning ou du copilote.
- Ajout de nouvelles destinations produit ou d'intégrations externes.
- Refonte du contenu éditorial complet de chaque écran.
- Navigation tablette ou paysage dédiée.

## Notes techniques

Formaliser la carte de navigation avant de modifier Expo Router. Réutiliser les primitives de la story 16 pour les en-têtes et états. Vérifier les safe areas, le geste prédictif Android lorsqu'il sera activé, les liens profonds et la restauration d'état. Ajouter des scénarios Maestro pour les parcours principaux et les retours avec saisie en cours.
