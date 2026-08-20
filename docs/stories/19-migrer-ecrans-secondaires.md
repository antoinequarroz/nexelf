# 19 — Migrer les écrans secondaires

Statut : à faire
Taille : L
Dépend de : 16, 17, 18

## Récit

En tant qu'utilisateur, je veux retrouver les objectifs, habitudes, copilote, mémoire, notifications et réglages dans la même expérience claire afin de gérer mon évolution sans rupture visuelle ni surcharge.

## Critères d'acceptation

- [ ] La migration suit cet ordre vertical et chaque écran est fonctionnel dans tous ses états avant le suivant : objectifs, habitudes, copilote, mémoire, notifications, puis réglages et support.
- [ ] Objectifs et habitudes privilégient la progression et la prochaine action plutôt qu'une grille dense de statistiques ou de cartes identiques.
- [ ] Le copilote reste un outil d'adaptation contrôlé : la proposition, son motif et les actions de confirmation ou refus sont hiérarchisés avant l'historique.
- [ ] La mémoire distingue clairement proposition, élément retenu, modification et suppression, sans diminuer les confirmations prévues par les stories métier.
- [ ] Les notifications et réglages regroupent les options par intention, avec libellés visibles et conséquences compréhensibles avant modification.
- [ ] Le logo original n'est employé qu'aux emplacements définis par le design system et n'est jamais redessiné, recoloré arbitrairement ou utilisé comme icône fonctionnelle.
- [ ] Chaque écran conserve une faible densité visuelle : une action primaire par section, informations secondaires repliées ou espacées, et aucun empilement uniforme de cartes.
- [ ] Une image n'est ajoutée que si elle aide à comprendre, se projeter ou reconnaître un état ; les écrans de contrôle et de réglages restent sobres lorsqu'une image n'apporte rien.
- [ ] Les images informatives disposent d'une alternative utile ; les images décoratives sont ignorées par les technologies d'assistance.
- [ ] Les formulaires, confirmations destructives, annulations et restaurations existants restent accessibles après migration.
- [ ] Les listes et historiques acceptent des contenus réels longs, des données anciennes et des volumes supérieurs aux exemples de maquette sans casser la hiérarchie.
- [ ] Les rendus iOS et Android respectent safe areas, clavier, retour natif, switchs, dialogues et conventions propres à chaque plateforme sans forcer une apparence web.
- [ ] Les contenus français et anglais utilisent i18n, supportent plusieurs lignes et ne sont pas tronqués aux tailles de texte prises en charge.
- [ ] Aucun écran migré ne conserve un fond noir, un accent lime dominant, une couleur en dur ou une primitive de présentation devenue obsolète.

## Cas limites

- État vide : chaque domaine explique ce qui pourra apparaître et propose l'action la plus utile, sans illustration générique imposée.
- Erreur : une erreur localisée ne remplace pas tout l'écran si les autres contenus restent utilisables ; l'utilisateur peut réessayer sans perdre sa saisie valide.
- Chargement : listes, messages et paramètres gardent une structure stable ; un indicateur occupé empêche les doubles soumissions.
- Permissions : la mémoire, les réglages du compte et les données personnelles ne sont jamais exposés à un utilisateur non autorisé ; une sortie sûre est proposée.
- Hors ligne : le contenu en cache est identifiable, les actions indisponibles sont expliquées et les mutations supportées suivent la stratégie de la story 09.
- Contenu long : les titres, réponses du copilote, souvenirs et libellés de réglages passent sur plusieurs lignes sans masquer les actions.
- Liste volumineuse : l'écran conserve ses performances et sa lisibilité sans rendre tous les éléments simultanément ni multiplier les décorations.
- Image indisponible : l'écran reste complet, compréhensible et actionnable sans la ressource distante.

## Hors périmètre de cette story

- Refonte de l'accueil, de l'onboarding, du planning ou de la revue du soir.
- Modification des règles IA, de la mémoire, des notifications ou des abonnements.
- Ajout de statistiques, d'intégrations calendrier ou santé.
- Nouveau logo, mascotte ou banque d'illustrations décoratives.
- Mode sombre, tablette dédiée ou version web.
- Réécriture des données existantes et modification des schémas Convex.

## Notes techniques

Réutiliser uniquement les composants et tokens partagés des stories 15 et 16. Éviter les composants locaux qui réintroduisent une variante visuelle déjà couverte. Pour chaque écran, vérifier d'abord les opérations existantes, puis les cinq états et enfin le rendu iOS/Android avant de passer à la tranche suivante.
