---
name: aq-brief
description: >-
  Cadrage d'un projet client (site vitrine, CMS, SaaS, app mobile) pour Antoine Quarroz. A utiliser quand on prepare un devis, qu'on debriefe un rendez-vous client, qu'on redige un brief, un PRD ou des user stories, ou qu'on hesite entre plusieurs stacks pour un projet. Declencheurs : "nouveau client", "devis", "cadrage", "brief", "de quoi il a besoin", "quelle stack pour ce projet".
---

# Cadrage projet AQ

Le but de cette skill : transformer une discussion client floue en trois documents exploitables, et **refuser de choisir une stack tant que les inconnues bloquantes ne sont pas levees**.

## Ordre de travail

1. Lire `references/questionnaire.md`.
2. Mener l'entretien bloc par bloc (une relance max par bloc).
3. Ecrire `docs/brief.md`, puis `docs/prd.md`, puis `docs/stack.md` avec les gabarits de `templates/`.
4. S'arreter. Pas de code a cette etape.

## Principes

- **Marquer l'incertitude, pas la masquer.** Toute reponse dont Antoine n'est pas sur est prefixee `[a confirmer]` et remonte en haut du brief.
- **Le perimetre exclu vaut le perimetre inclus.** Un PRD sans section "hors perimetre" ne protege rien.
- **Estimer en fourchette.** Basse = tout se passe bien et le contenu arrive a l'heure. Haute = le contenu arrive en retard et il y a un aller-retour de plus.
- **Trois risques, formules en consequence.** Pas "risque : le contenu" mais "si les textes arrivent apres le 15, la livraison glisse de 3 semaines a cause des vacances".

## Signaux a detecter pendant l'entretien

| Signal | Ce que ca veut dire |
|---|---|
| "On verra ca plus tard" sur le contenu | Le projet n'a pas de date de livraison fiable |
| "Ce serait bien de pouvoir aussi..." | Perimetre en expansion : le noter en phase 2, pas en phase 1 |
| Le client n'a pas acces a son propre domaine | Prevoir une demi-journee de recuperation d'acces |
| "Mon neveu s'en occupait avant" | Verifier ce qui existe avant de promettre une reprise |
| Donnees de sante ou de mineurs | nLPD renforcee : hebergement et contrat a cadrer avant de coder |
| Budget refuse mais deadline dure | Le vrai contrainte est le delai : cadrer le perimetre minimal |

## Apres

Cette skill cadre le **client** : contexte, budget, contraintes, delais.
Elle ne liste pas les fonctionnalites. Pour ca, enchainer sur `aq-product-spec`, qui produit l'inventaire des features, les stories et l'arbitrage MVP.

Flux complet : `aq-brief` -> `aq-product-spec` -> `aq-init`.

## Ce que cette skill ne fait pas

- Elle ne redige pas le devis commercial (prix, conditions de paiement).
- Elle ne genere pas de code ni de maquette.
- Elle ne donne pas de conseil juridique : elle signale qu'un point nLPD/RGPD doit etre valide par le client ou son juriste.
