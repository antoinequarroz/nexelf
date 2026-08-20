# 16 — Construire les primitives mobiles claires

Statut : partiel — primitives livrées, validation native à compléter  
Taille : L  
Dépend de : 15

## Récit

En tant qu'utilisateur, je veux retrouver les mêmes repères visuels et interactifs dans toute l'application afin d'agir rapidement, confortablement et sans ambiguïté.

## Critères d'acceptation

- [ ] Les couleurs « Élan lumineux » existent dans une source de tokens NativeWind et dans son miroir TypeScript pour les API natives, sans valeur hexadécimale dispersée dans les composants.
- [ ] Les tokens couvrent fonds, surfaces, textes, bordures, actions principales et secondaires, progression, succès, avertissement, danger, focus et états désactivés.
- [ ] Une échelle cohérente définit espacements, rayons, typographies, icônes et dimensions tactiles, avec une zone interactive minimale de 44 × 44 points.
- [ ] Des primitives réutilisables couvrent au minimum écran avec safe area, en-tête, bouton, bouton icône, champ, groupe de choix, carte, section, badge, progression, message d'état et cadre d'image.
- [ ] Chaque primitive expose les états normal, pressé, sélectionné, désactivé, chargement, erreur et focus lorsque ces états s'appliquent.
- [ ] Les variantes visuelles restent peu nombreuses et leur usage est documenté afin d'éviter les combinaisons arbitraires.
- [ ] Les champs restent visibles avec le clavier logiciel, annoncent leur libellé et leur erreur, et n'utilisent pas le placeholder comme seul libellé.
- [ ] Les textes acceptent la taille dynamique sans troncature d'une action essentielle ni superposition avec un contrôle.
- [ ] Les composants sont utilisables avec VoiceOver et TalkBack : rôle, nom accessible, état et ordre de lecture correspondent au rendu visible.
- [ ] Les surfaces importantes restent lisibles en mode contraste accru et ne dépendent ni d'une ombre légère ni d'une transparence seule.
- [ ] Les animations fonctionnelles respectent la réduction des mouvements et aucune animation continue n'est nécessaire à la compréhension.
- [ ] Les états chargement, vide, erreur et hors ligne disposent d'un patron cohérent qui conserve l'action de récupération utile.

## Cas limites

- Petit écran : les actions côte à côte passent en pile avant que leurs libellés soient tronqués.
- Grande police : une carte grandit avec son contenu et les boutons conservent leur zone tactile.
- Clavier : le champ actif et son message d'erreur restent visibles sur iOS et Android.
- Hors ligne : les primitives différencient une donnée mise en cache, une synchronisation en attente et un échec définitif sans recourir uniquement à la couleur.
- Image lente ou absente : le cadre conserve son ratio, affiche un placeholder stable et ne provoque pas de saut de mise en page.
- Thème système sombre : tant qu'aucun mode sombre n'est livré, l'application conserve explicitement son rendu clair validé.

## Hors périmètre de cette story

- Recomposition complète de chaque écran métier.
- Bibliothèque web, styles CSS de survol ou comportements propres au DOM.
- Mode sombre, personnalisation de thème par utilisateur et thèmes de marque multiples.
- Animations éditoriales avancées.

## Notes techniques

Centraliser les tokens dans `tailwind.config.js` et `src/lib/theme.ts`, puis remplacer progressivement les couleurs natives en dur, notamment celles des placeholders, sélections, indicateurs et options de navigation. Utiliser les safe areas React Native, tester le clavier réel et privilégier les API natives aux recettes web. Prévoir une surface de démonstration interne ou des états de test déterministes pour vérifier toutes les variantes avant leur déploiement.
