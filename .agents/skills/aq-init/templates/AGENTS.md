# {{PROJET}}

> Source de vérité pour les agents sur ce projet. `CLAUDE.md` en est une copie.
> Codex lit ce fichier et `.agents/skills/`. Claude Code lit `CLAUDE.md` et `.claude/skills/`.

## Ce que c'est

{{Une phrase : pour qui, pour faire quoi.}}

Client : {{nom}} — Base : {{vitrine | cms | saas | mobile}}
Cadrage : `docs/cadrage.md` — Design : `docs/design.md` — Décisions : `docs/adr/`

## Stack

| Couche | Choix |
|---|---|
| Front | |
| Données | |
| Auth | |
| Paiement | |
| Hébergement | |
| Monitoring | Sentry ({{région}}) |

## Commandes

```bash
pnpm dev
pnpm check    # doit passer avant toute PR
pnpm test
pnpm e2e
```

## Contraintes de ce projet

- Données sensibles : {{oui / non}}
- Résidence des données : {{aucune / Suisse / UE}}
- Reprise par un tiers prévue : {{oui / non}}

Ces contraintes ont déterminé le choix de la base de données. Ne pas en changer sans nouvelle ADR.

## Règles spécifiques

Ce qui déroge aux conventions AQ, et pourquoi. Section vide = conventions par défaut.

- {{...}}

## Interdits

- Pas de chaîne de texte en dur : tout passe par i18n, dès le premier écran.
- Pas de valeur hex hors du fichier de tokens.
- Pas de `pnpm update` large sur les paquets d'auth : versions épinglées, voir `aq-better-auth`.
- Pas de migration exécutée directement en production.

## Pièges connus

Ce qui a déjà fait perdre du temps ici.

- {{...}}
