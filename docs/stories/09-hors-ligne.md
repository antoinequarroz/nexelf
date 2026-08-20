# 09 — Utiliser l'essentiel sans réseau

Statut : à faire  
Taille : L  
Dépend de : 04, 05, 08

## Récit

En tant qu'utilisateur mobile, je veux consulter et mettre à jour ma journée sans réseau afin que Nexelf reste utile partout.

## Critères d'acceptation

- [ ] Le briefing, les priorités et routines du jour sont lisibles depuis le cache.
- [ ] Terminer, reporter et noter créent des opérations locales synchronisées plus tard.
- [ ] L'état hors ligne et les actions en attente sont visibles.
- [ ] En cas de conflit, la modification la plus récente gagne et l'historique reste consultable.
- [ ] La conversation IA explique clairement qu'elle exige le réseau.

## Cas limites

- État vide : sans cache ni réseau, l'écran explique comment réessayer.
- Erreur : les opérations restent en file sans être dupliquées.
- Chargement : la synchronisation n'empêche aucune lecture locale.
- Permissions : les données locales sont isolées par compte et effacées à la déconnexion.

## Hors périmètre de cette story

- Génération IA et modification complexe d'objectifs hors ligne.

## Notes techniques

File d'opérations idempotentes et stratégie dernière écriture gagnante documentée.
