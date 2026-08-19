---
name: aq-adr
description: >-
  Redige une decision d'architecture (ADR) dans docs/adr/ pour un projet AQ. A utiliser quand on tranche un choix technique structurant, qu'on change de librairie, d'hebergeur ou de modele de donnees, ou qu'on veut documenter pourquoi une option a ete ecartee. Declencheurs : ADR, decision technique, pourquoi on a choisi, on change de.
---

# ADR

Numerote a la suite de ce qui existe dans `docs/adr/` (`0001-`, `0002-`, ...). Nom de fichier en kebab-case.

```md
# {{numero}}. {{Titre}}

Date : {{AAAA-MM-JJ}}
Statut : accepte | remplace par ADR-XXXX

## Contexte

Le probleme reel, avec les contraintes qui existaient a ce moment-la : budget, delai, competences, exigence client.

## Decision

Ce qu'on fait. Au present, a l'actif.

## Alternatives ecartees

Pour chacune : pourquoi elle a ete ecartee. C'est la partie qui aura de la valeur dans 18 mois.

## Consequences

Ce que ca coute, ce que ca bloque, ce qu'il faudra refaire si le contexte change.
```

## Regles

- Si la decision annule une ADR precedente, marque l'ancienne comme remplacee. Ne la supprime pas.
- Une ADR fait moins d'une page. Plus longue, c'est deux decisions.
- N'invente pas une alternative ecartee pour faire joli : si une seule option a ete envisagee, dis-le.

## A ecrire systematiquement en ADR

- Choix de l'hebergeur, surtout quand il est contraint par le legal
- Choix Convex vs Supabase
- Tout contournement d'une convention AQ
- Toute dependance qui serait couteuse a remplacer
