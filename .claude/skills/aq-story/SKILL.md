---
name: aq-story
description: Mène une story ou une tâche de développement de bout en bout sur un projet AQ — comprendre le contexte existant, planifier, exécuter par petits pas, traiter les quatre états d'interface, relire, finir proprement. À utiliser dès qu'on développe une fonctionnalité, qu'on corrige un bug, ou que l'utilisateur dit "on attaque la story X", "implémente", "corrige", "ajoute cette feature". C'est la boucle de travail par défaut entre l'init et la livraison.
---

# Boucle de travail

<objective>
Terminer une story sans élargir le périmètre, sans casser ce qui marchait, et sans que le résultat dépende de qui relit.
</objective>

<strict_order>
1. Comprendre — lire, ne pas coder
2. Planifier — écrire le plan, le faire valider
3. Exécuter — petits pas, commits atomiques
4. Les quatre états
5. Relecture
6. Finir
</strict_order>

## 1. Comprendre — ne pas coder

Interdiction d'écrire du code avant d'avoir lu.

- La story et ses critères d'acceptation. S'ils sont absents ou flous, les écrire avant, pas pendant.
- `AGENTS.md` du projet et les ADR pertinentes. Une décision déjà prise ne se rediscute pas en codant.
- **Le code existant qui fait quelque chose de proche.** La règle : s'il existe déjà un pattern pour ce besoin, on le suit, même si on le trouve perfectible. Une deuxième façon de faire coûte plus cher qu'une façon imparfaite.
- Les tests existants sur la zone touchée.

À la fin de cette passe, savoir répondre à : quels fichiers vont changer, et pourquoi ?

## 2. Planifier

Un plan court, écrit, montré avant d'exécuter :

- les fichiers à créer ou modifier, et ce qui change dans chacun
- l'ordre — données d'abord, serveur ensuite, interface en dernier
- ce qui est **hors** de cette story
- ce qui reste incertain

**Si le plan dépasse une demi-journée, la story est trop grosse.** S'arrêter, proposer un découpage, ne pas commencer.

## 3. Exécuter

- Du serveur vers le client, jamais l'inverse. Une frontière de sécurité ne se rattrape pas après l'UI.
- Petits pas vérifiables. Après chaque pas, l'application démarre encore.
- Un commit = une intention. Message à l'impératif, en français, qui dit le *pourquoi* quand ce n'est pas évident.
- Si un bug est découvert au passage : le noter, ne pas le corriger dans cette story — sauf s'il bloque.

## 4. Les quatre états

Aucune interface n'est finie tant que les quatre ne sont pas traités. C'est le manquement le plus fréquent.

| État | Ce qu'on voit |
|---|---|
| **Vide** | Aucune donnée : un écran conçu, pas un tableau à zéro ligne |
| **Chargement** | Ce qui se passe pendant l'attente, sans saut de mise en page |
| **Erreur** | Ce qui a échoué **et ce qu'on peut faire ensuite** |
| **Interdit** | Ce que voit quelqu'un sans le droit — jamais une page blanche |

## 5. Relecture — avant de dire que c'est fini

Relire son propre diff, ligne par ligne, en se posant :

- Est-ce que quelque chose est là qui ne devrait pas y être ? (fichier reformaté hors périmètre, `console.log`, code commenté, dépendance ajoutée sans raison)
- Un secret, une URL en dur, une donnée de test oubliée ?
- Une chaîne de texte non passée par i18n ?
- Une valeur de couleur ou d'espacement en dur au lieu d'un token ?
- Est-ce qu'un développeur qui découvre le projet comprend ce diff sans explication orale ?

## 6. Finir

- [ ] `pnpm check` passe
- [ ] Les tests passent, et un test couvre le nouveau comportement
- [ ] Si c'était un bug : le test qui échouait avant existe et passe maintenant
- [ ] Les quatre états sont traités
- [ ] Navigable au clavier, testé en 375px
- [ ] Documentation ou ADR mise à jour si le comportement change
- [ ] Le diff ne contient que ce que la story demandait

## Interdits pendant une story

- Refactorer du code non demandé.
- Reformater des fichiers hors périmètre — ça noie le diff.
- Supprimer ou désactiver un test qui échoue pour faire passer la CI.
- Ajouter une dépendance sans justifier : est-ce que la stack le fait déjà ? est-ce maintenu ? combien de KB côté client ?
- Élargir le périmètre parce que « tant qu'on y est ». Le noter en Phase 2 dans `docs/roadmap.md`.

## Quand s'arrêter et demander

- La story se révèle deux fois plus grosse que prévu.
- Il faut modifier une décision inscrite dans une ADR.
- Deux façons de faire existent déjà dans le projet et rien ne tranche.
- Une donnée existante doit être migrée.
