---
name: aq-design-setup
description: >-
  Installe et initialise les skills de design Better UI et Impeccable dans un projet AQ web ou mobile, au niveau du projet pour Codex et Claude Code. A utiliser au demarrage d'une vitrine, d'un CMS, d'un SaaS ou d'une app Expo, avant de concevoir l'interface, ou quand l'utilisateur dit "installe Better UI", "ajoute Impeccable", "setup design", "ameliore le design" ou "initialise le design system". Sur mobile, adapte le workflow a React Native, NativeWind et aux interactions tactiles. Ne pas utiliser pour polir directement une interface deja construite.
---

# Setup design AQ

Installer les outils externes sans les recopier dans `aq-kit`. Better UI apporte les détails d'interface web ; Impeccable apporte le cadrage, la critique et les passes de finition sur le web comme sur mobile.

## 1. Préflight

- Identifier d'abord le profil : `vitrine`, `cms`, `saas` ou `mobile`.
- Lire `AGENTS.md`, `package.json`, `docs/design.md` et `theme.ts` s'ils existent.
- Inspecter `.agents/skills/`, `.claude/skills/`, `.codex/hooks.json`, `PRODUCT.md` et `DESIGN.md` avant toute installation.
- Vérifier `git status --short`. Ne pas écraser une installation ou un document design modifié par l'utilisateur.
- Vérifier Node.js. Impeccable exige une version compatible avec sa CLI courante.

Demander une seule chose si elle n'est pas déjà explicite : installer Better UI seulement, Impeccable seulement, ou les deux ? Proposer **les deux** par défaut sur le web et **Impeccable seulement** sur mobile.

## 2. Installer Better UI sur le web

Sur `mobile`, sauter cette étape sauf si le dépôt contient aussi une surface web. Ne pas transposer directement des recettes CSS, hover ou DOM dans React Native.

Depuis la racine du projet :

```bash
npx skills add jakubkrehel/skills --skill better-ui
```

Choisir une installation **projet**, pour Codex et Claude Code. Ne jamais installer globalement pour un projet client.

Après la commande, vérifier qu'un `SKILL.md` Better UI existe réellement dans au moins un dossier attendu. Un code de sortie `0` sans fichier installé n'est pas un succès.

Ne pas installer toute la collection Jakub Krehel par défaut. Ajouter `better-typography`, `better-colors`, `better-accessibility`, `better-layout` ou `better-writing` seulement sur demande explicite.

## 3. Installer Impeccable

Depuis la racine du projet :

```bash
npx impeccable skills install -y --providers=claude,codex --scope=project
```

Après la commande :

- vérifier la présence de la skill Impeccable dans les dossiers projet annoncés par l'installateur ;
- vérifier `.codex/hooks.json` si l'installateur annonce un hook Codex ;
- ne jamais conclure à la réussite à partir du seul code de sortie ;
- signaler à l'utilisateur qu'un redémarrage ou rechargement de l'agent peut être nécessaire ;
- sous Codex, demander d'approuver le hook du projet dans `/hooks` si l'interface le réclame.

## 4. Initialiser le contexte design

Ne pas tenter d'exécuter `impeccable init` comme une commande shell. Après rechargement de l'agent, lancer :

- Codex : `$impeccable init`
- Claude Code : `/impeccable init`

Si `docs/design.md`, `PRODUCT.md` ou `DESIGN.md` existe déjà, le lire avant l'initialisation et demander confirmation avant de le remplacer. Conserver les décisions existantes comme source de vérité et résoudre explicitement toute contradiction.

L'initialisation doit préciser au minimum :

- surface `brand` pour une landing/vitrine, ou `product` pour une app/dashboard ;
- audience et problème résolu ;
- personnalité visuelle recherchée et anti-références ;
- contraintes de marque, couleurs, typographie et accessibilité ;
- composants ou écrans prioritaires.

Sur `mobile`, consigner les décisions dans `theme.ts` ou dans le système de tokens existant et vérifier en plus :

- zones tactiles, gestes, clavier logiciel et safe areas ;
- états hors ligne, chargement, erreur et permissions refusées ;
- contraste, taille dynamique du texte et lecteur d'écran ;
- cohérence iOS/Android sans forcer une apparence web ;
- navigation, onboarding et empty states sur petits écrans.

## 5. Validation

- Better UI est visible par les agents choisis sur les profils web, ou explicitement marqué comme non installé sur mobile.
- Impeccable est visible par les agents choisis.
- Les éventuels hooks sont présents et approuvables.
- `PRODUCT.md` et le document design ne se contredisent pas avec `docs/design.md`.
- Les fichiers de travail générés par Impeccable sont ignorés s'ils sont temporaires ; ne pas ignorer ses documents de conception durables.
- `git diff --check` passe.

Terminer avec trois lignes : outils installés, action de rechargement requise, commande exacte d'initialisation à lancer.
