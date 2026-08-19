---
name: aq-kit-retro
description: Rétrospective qui améliore le kit AQ lui-même — identifie ce qui a coincé pendant un projet ou une grosse tâche, ce qui a dû être réexpliqué, ce qui manquait, puis écrit réellement la modification dans les skills du kit. À utiliser en fin de projet, après une livraison, après une session qui s'est mal passée, ou quand l'utilisateur dit "rétro", "qu'est-ce qu'on améliore", "ça m'a encore fait perdre du temps".
---

# Rétro du kit

<objective>
Transformer ce qui a coûté du temps en règle écrite, pour que ça ne recommence pas. Sans ce geste, un kit se fige puis pourrit.
</objective>

## Les cinq questions

Une à la fois. Creuser les réponses vagues une fois, puis passer.

1. **Qu'est-ce qui a coincé ?** Le moment précis où tu t'es dit « encore ».
2. **Qu'as-tu dû réexpliquer à l'agent ?** Si tu l'as tapé deux fois, ça devrait être écrit quelque part.
3. **Qu'as-tu redécouvert ?** Une commande, un piège, une config — quelque chose que tu savais déjà il y a six mois.
4. **Quelle règle du kit a été violée, et pourquoi ?** Si la règle a été contournée, c'est souvent la règle qui est mauvaise, pas toi.
5. **Qu'est-ce qui a servi à rien ?** Une question inutile, une étape ignorée, une skill jamais déclenchée.

## Le filtre — la partie qui compte

Tout n'entre pas dans le kit. Un kit qui grossit à chaque projet devient illisible et cesse d'être suivi.

Une chose entre si **l'une** de ces conditions est vraie :

- elle s'est produite **deux fois** ;
- elle a coûté cher **une fois** (plus d'une demi-journée, ou un incident client) ;
- elle relève de la sécurité ou du légal, même sans avoir jamais posé problème.

Sinon : ne rien écrire. Le noter mentalement et attendre la deuxième occurrence.

## Classer chaque point

| Nature | Où ça va |
|---|---|
| Une décision (quel outil, quel ordre, quel défaut) | Modifier la skill AQ concernée |
| Un piège récurrent d'une librairie | Vérifier d'abord si une skill amont le couvre déjà |
| Un détail spécifique à un projet | `AGENTS.md` du projet, pas le kit |
| Une question inutile pendant l'init ou la spec | **Supprimer** la question |
| Une étape systématiquement sautée | La supprimer, ou comprendre pourquoi elle est ignorée |

La colonne « supprimer » doit être utilisée. Une rétro qui n'ajoute que des règles produit un kit que personne ne lit.

## Écrire la modification

Ne pas se contenter de recommander : **appliquer**.

1. Modifier les fichiers dans `skills/` — jamais dans `plugins/`, qui est généré.
2. Faire tourner `node scripts/sync.mjs`.
3. Bumper la version dans le `plugin.json` concerné et dans `marketplace.json`.
4. Commiter avec un message qui dit **pourquoi**, pas quoi : « le setup Expo a encore coûté 3 h faute de préciser X » vaut mieux que « update aq-better-auth ».

## Ménage — une fois par trimestre

- Une skill qui ne s'est déclenchée sur aucun projet en trois mois : sa description est mauvaise, ou elle est inutile. Corriger la description, ou supprimer.
- Deux skills qui se recouvrent : en garder une.
- Une règle que tu contournes systématiquement : la supprimer ou la réécrire. Une règle non suivie décrédibilise les autres.

## Sortie

Un résumé en trois listes : **modifié**, **ajouté**, **supprimé** — avec pour chaque ligne la raison en une phrase.
