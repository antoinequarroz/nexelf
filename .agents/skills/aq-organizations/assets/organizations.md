# Organisations — [Projet]

## Architecture

- Profil : CMS / SaaS / mobile partagé
- Versions Auth/Convex :
- Source de vérité : Better Auth Organization / Convex natif
- Compatibilité vérifiée dans :
- ADR :

## Modèle

- Frontière tenant :
- Organisation / workspace / team :
- Création autorisée pour :
- Plusieurs organisations par utilisateur :
- Organisation active :
- Suppression / rétention :

## Rôles et capacités

| Capacité | Owner | Admin | Member | Autre |
|---|---|---|---|---|
| organisation:update | | | | |
| organisation:delete | | | | |
| ownership:transfer | | | | |
| members:invite | | | | |
| members:manage | | | | |
| billing:manage | | | | |
| data:read | | | | |
| data:create | | | | |
| data:update | | | | |
| data:delete | | | | |

## Invitations

- Expiration :
- Vérification d'email :
- Rôles invitables :
- Renvoi/révocation :
- Mauvais compte :
- Deep link web/mobile :
- Déduplication :

## Facturation et sièges

- Billing owner :
- Sièges inclus :
- Invitation en attente comptée :
- Dépassement :
- Downgrade :
- Stripe / RevenueCat :

## Cycle de vie

- Dernier owner :
- Transfert :
- Départ/retrait :
- Ressources d'un membre supprimé :
- Suspension :
- Export et suppression :

## UX web/mobile

- Switch d'organisation :
- Écrans membres/invitations :
- États vide/chargement/erreur/interdit :
- Cache et reconnexion :

## Validation

- [ ] Identité et appartenance vérifiées avant lecture
- [ ] Chaque ressource vérifie son organisation
- [ ] Matrice de capacités testée
- [ ] A → B impossible par ID falsifié
- [ ] Invitations et courses testées
- [ ] Dernier owner et transfert protégés
- [ ] Limites de sièges côté serveur
- [ ] Switch web/mobile sans fuite de cache
- [ ] Audit et journal d'actions sensibles

## Reste manuel

-
