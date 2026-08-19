# Étape 1 — Cadrage

Objectif : savoir quoi construire et sur quelle base, en moins de dix questions.

## Ce qu'on déduit sans demander

- Nom du projet → nom du dossier courant
- Base → si l'utilisateur a déjà dit « app mobile », « SaaS », « site vitrine »
- Langue de travail → français

Ne poser que ce qui reste inconnu.

## Bloc A — Le projet

1. **En une phrase, le projet fait quoi, pour qui ?**
2. **Qui l'utilise, et dans quel contexte ?** (mobile en déplacement, bureau, les deux)
3. **Quelle est l'action principale attendue ?** Une seule.
4. **Projet client ou projet perso ?** Si client : nom, pour le README et l'ADR.
   Cette réponse détermine aussi la visibilité du dépôt GitHub à l'étape 7 : privé pour un client, public pour un projet perso.

## Bloc B — La base

Proposer la base déduite du bloc A, avec sa justification, et demander confirmation :

- Contenu public, édité rarement → `vitrine`
- Le client édite lui-même, régulièrement → `cms`, variante **back-office maison** par défaut (Convex + Better Auth). Ne proposer Directus que si l'un des cas de bascule de `references/stacks.md` est vrai — et le dire alors explicitement.
- Comptes + données par utilisateur + abonnement → `saas`
- Usage principal sur téléphone, push, hors ligne → `mobile`

Cas limites à trancher explicitement :
- « Un espace membre » ne fait pas un SaaS. Sans abonnement ni données métier par compte, c'est `vitrine` + auth.
- « Un blog » ne fait pas un CMS. Markdown suffit si l'auteur est à l'aise.
- Un site **et** une app pour le même client = deux projets, deux dépôts.

## Bloc C — Contraintes (bloquant)

5. **Des données personnelles sensibles ?** (santé, religion, biométrie, poursuites)
6. **Résidence des données en Suisse exigée ?**
7. **Le client doit-il pouvoir reprendre le projet sans toi dans 3 ans ?**

Ces trois réponses déterminent la base de données. Appliquer la table de `references/stacks.md`. **Ne pas choisir Convex par habitude.**

Si résidence suisse = oui → Convex est disqualifié. Le dire immédiatement, avant de continuer.

## Bloc D — Langues et hébergement

8. **Langues au lancement ? Lesquelles plus tard ?** Défaut : `fr` seul, i18n installé quand même.
9. **Hébergement ?** Appliquer `aq-hosting`. Défaut : Vercel, sauf contrainte du bloc C → Infomaniak.

## Spécification produit

Sur une base `saas` ou `cms`, proposer avant de continuer :

> Ce projet a beaucoup de fonctionnalités à cadrer. On fait une session `aq-product-spec` maintenant (30 à 60 min), ou on scaffolde d'abord et on spécifie après ?

Scaffolder d'abord est acceptable — le socle ne dépend pas des features. Mais **ne pas écrire de code métier** avant que `docs/features.md` et `docs/roadmap.md` existent.

Sur une base `mobile`, `aq-product-spec` est aussi recommandé : le hors ligne et les permissions changent l'architecture, pas seulement l'UI.

## Sortie

Écrire `docs/cadrage.md` avec les réponses, puis annoncer :

> Base retenue : `{{base}}` — Données : `{{convex|supabase|postgres-infomaniak}}` — Hébergement : `{{vercel|infomaniak}}`

et passer à l'étape 2.
