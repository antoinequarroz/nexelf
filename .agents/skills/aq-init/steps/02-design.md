# Étape 2 — Direction artistique et design tokens

Objectif : décider à quoi ça ressemble **avant** d'écrire une ligne d'UI. C'est l'étape que tout le monde saute et qui produit des sites qui se ressemblent tous.

## Pourquoi maintenant

Un projet sans direction écrite finit sur les mêmes réflexes : dégradé violet, Inter partout, cartes arrondies empilées, hiérarchie typographique plate. Ce n'est pas un style, c'est une absence de décision.

## Bloc A — Le registre

1. **Le métier, en trois adjectifs.** Pas « moderne » ni « professionnel » : ces mots ne décident de rien. Chercher du concret — clinique, artisanal, nocturne, institutionnel, brut, chaleureux, technique, éditorial.
2. **Deux ou trois sites de référence, et ce qui plaît dedans.** Le « quoi » compte plus que le lien : la typo ? la densité ? le calme ? le contraste ?
3. **Une charte existe déjà ?** Logo vectoriel, couleurs imposées, police achetée. Si oui, on part de là et les questions suivantes se réduisent.

## Bloc B — Le style

Proposer 3 ou 4 directions **nommées et décrites**, pas une liste de mots. Par exemple :

- **Éditorial** — grande serif, colonnes de texte larges, beaucoup de blanc, presque pas de bordures. Pour un cabinet, un consultant, une institution.
- **Technique** — grotesque condensée, grille visible, filets fins, monospace pour les données. Pour un produit, un outil, un SaaS.
- **Chaleureux** — sans-serif ronde, fonds crème, coins généreux, une couleur d'accent saturée. Pour de l'artisanat, du soin, de l'alimentaire.
- **Brut** — contrastes forts, typo display lourde, peu de couleurs, aucune ombre. Pour du créatif, du sport, du culturel.

L'utilisateur en choisit une, ou en compose une.

## Bloc C — Les décisions concrètes

4. **Typographies.** Deux familles maximum : une display avec du caractère, une de lecture. Proposer 3 paires cohérentes avec le style retenu, disponibles en licence libre. Ne jamais proposer Inter seule par défaut.
5. **Couleurs.** Une couleur d'accent, une neutre, une de fond. Proposer 3 palettes concrètes avec les valeurs. Éviter le dégradé bleu-violet.
6. **Densité et rondeur.** Compact ou aéré ? Angles francs, légèrement arrondis, ou très ronds ?
7. **L'élément signature.** Une seule audace par page — un traitement typographique, une numérotation, un filet, une image traitée. Le reste reste calme. Laquelle ?
8. **Mode sombre ?** Défaut : non, sauf app produit ou SaaS.

## Sortie

**a)** `docs/design.md` — le style retenu, les références, les décisions, et surtout **ce qu'on s'interdit** sur ce projet.

**b)** Le fichier de tokens, selon la base :
- Web : `app/assets/css/tokens.css` en Tailwind v4 (`@theme`) — voir `templates/tokens.css`
- Mobile : `theme.ts` consommé par NativeWind

**b bis)** Sur les bases web, brancher les tokens sur **Nuxt UI** : ses alias de couleurs (`primary`, `neutral`, etc.) et ses réglages globaux doivent pointer vers les variables du fichier de tokens, jamais vers des valeurs en dur. Un composant Nuxt UI qui affiche une couleur absente des tokens est un bug, pas un choix.

Nuxt UI donne des composants corrects par défaut — c'est précisément le risque : sans direction appliquée, le site ressemble à tous les autres sites Nuxt UI. La direction artistique se joue sur la typographie, l'échelle, la densité et l'élément signature, pas sur les composants.

**c)** Un écran ou une section de démonstration qui applique les tokens, pour valider visuellement avant d'aller plus loin.

## Règles

- Aucune valeur hex en dur ailleurs que dans le fichier de tokens.
- Contraste AA minimum, vérifié sur la palette choisie, pas supposé.
- `prefers-reduced-motion` respecté dès le départ.
- Si `jakubkrehel/skills` ou `impeccable` sont installées, les utiliser à cette étape et pour toute UI ultérieure.
