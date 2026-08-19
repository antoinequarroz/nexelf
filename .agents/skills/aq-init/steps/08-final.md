# Étape 8 — Finalisation

## Fichiers à produire

**`AGENTS.md`** — à partir de `templates/AGENTS.md`, rempli avec les décisions réelles de l'init : base, données, hébergement, auth, contraintes du bloc C.
Puis copier en `CLAUDE.md` (copie, pas symlink : Windows).

**`README.md`** — à partir de `templates/README.md`. Il doit répondre à trois questions : comment lancer, comment déployer, qui appeler. Rien d'autre.

**`docs/adr/0001-choix-de-la-base.md`** — à partir de `templates/adr-0001.md`. Elle documente :
- pourquoi cette base,
- pourquoi cette base de données (avec la contrainte qui l'a imposée),
- pourquoi cet hébergeur,
- et pour la base `saas` : le risque assumé sur l'intégration Convex↔Vue et la porte de sortie.

## Vérifications finales

- [ ] `pnpm dev` démarre sans erreur
- [ ] `pnpm check` passe
- [ ] Sentry a reçu l'erreur de test, et l'erreur de test est retirée
- [ ] Les trois tests e2e passent
- [ ] `.env.example` liste toutes les variables
- [ ] Aucun secret dans l'historique git
- [ ] Le dépôt GitHub existe et le premier push est passé

## Récapitulatif

Exactement trois listes, rien d'autre, pas de paragraphe de conclusion.

**Fait** — ce qui tourne, avec l'URL du dépôt.

**À toi de jouer** — les clés d'API à créer, comptes à ouvrir, DNS à pointer. Chaque ligne dit *où* aller et *quelle variable* remplir.

**Décidé** — les arbitrages pris pendant l'init, en une ligne chacun, avec renvoi vers l'ADR.

Puis proposer la suite logique : `aq-stripe` si base `saas`, ou la première story.
