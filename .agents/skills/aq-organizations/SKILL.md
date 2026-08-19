---
name: aq-organizations
description: Conçoit, implémente et valide les organisations, workspaces, équipes, appartenances, rôles, permissions et invitations d'un projet AQ avec Better Auth et Convex, partagés entre Nuxt et Expo. À utiliser pour du multi-tenant, owner/admin/member, équipes éditoriales, invitations email, changement d'organisation active, transfert de propriété, limites de sièges, audit d'accès ou isolation des données. Vérifie d'abord la compatibilité des versions épinglées, choisit une seule source de vérité et impose toutes les autorisations métier côté serveur. Pour CMS, SaaS et mobile ; pas pour une vitrine sans comptes.
---

# Organisations AQ

Construire un système multi-tenant où aucune donnée ni action ne traverse la mauvaise organisation. L'interface peut guider ; seule l'autorisation serveur décide.

## Principes non négociables

- Better Auth prouve l'identité et la session. Les fonctions Convex protègent chaque donnée métier.
- Choisir une seule source de vérité pour organisations, membres, rôles et invitations. Ne jamais maintenir deux modèles modifiables en parallèle.
- Résoudre l'utilisateur depuis le contexte d'auth, jamais depuis un `userId` reçu du client.
- Recevoir un `organizationId` ne prouve ni l'appartenance ni la permission.
- Vérifier identité, appartenance, statut et capacité avant toute lecture, puis vérifier que chaque ressource appartient à cette organisation.
- Aucun rôle, entitlement, plan ou organisation active stocké côté client n'est une autorisation.

## 1. Préflight de compatibilité

Lire `AGENTS.md`, les versions exactes de `better-auth`, `@convex-dev/better-auth`, `convex`, `@better-auth/expo`, la configuration et le schéma existants.

Lire `references/architecture.md`. Vérifier dans les documentations officielles de **ces versions** si le plugin Organization et ses options sont supportés par le composant Convex installé.

- Si compatible : utiliser le plugin Organization comme source du cycle organisations/membres/invitations et appliquer les permissions métier dans les helpers Convex.
- Si incompatible ou si le schéma requis n'est pas supporté : utiliser un modèle applicatif Convex pour organisations, membres et invitations, Better Auth restant l'identité.
- Si l'activation exige Better Auth 1.7+ alors que le projet impose `<1.7.0`, arrêter et proposer une montée de version séparée ou le modèle Convex natif. Ne jamais desserrer les versions silencieusement.

Documenter le choix dans `docs/organizations.md` et une ADR si la décision modifie l'architecture.

## 2. Poser les questions produit et UX/UI

Poser un bloc à la fois avec un défaut raisonné.

### Modèle de compte

- Un utilisateur agit-il seul, dans une organisation, ou dans plusieurs ?
- Qui peut créer une organisation et combien ?
- Organisation, workspace et team désignent-ils la même frontière de données ? Défaut : une seule notion tant qu'une différence métier n'est pas prouvée.
- Le CMS utilise-t-il une seule organisation éditoriale ou plusieurs clients séparés ?

### Rôles et capacités

- Quelles actions concrètes owner, admin et member doivent-ils accomplir ?
- Faut-il un rôle supplémentaire réel : éditeur, finance, support, viewer ?
- Les rôles sont-ils fixes ou personnalisables ? Défaut : fixes ; les rôles dynamiques augmentent fortement UI, tests et audit.
- Quelles actions sont irréversibles, financières ou exportent des données ?

### Invitations et cycle de vie

- Qui invite, pour quel rôle, avec quelle expiration et limite ?
- Une invitation compte-t-elle dans la limite de sièges ?
- Que faire si l'adresse est déjà membre, si le mauvais compte est connecté ou si le lien expire ?
- Qui peut retirer un membre, se retirer, transférer la propriété ou supprimer l'organisation ?

### Expérience

- Faut-il créer ou rejoindre une organisation pendant `aq-onboarding` ?
- Comment changer d'organisation sur web et mobile sans afficher des données de la précédente ?
- Quels écrans membres, invitations, rôles, facturation et activité sont nécessaires ?

## 3. Écrire le modèle d'autorisation

Copier `assets/organizations.md` vers `docs/organizations.md`. Définir avant le schéma :

- frontière tenant et terminologie ;
- source de vérité retenue ;
- matrice rôle × capacité ;
- états membre/invitation ;
- règles owner et transfert ;
- limites de plan et sièges ;
- cycle suppression/rétention ;
- audit et événements externes ;
- parcours web/mobile et tests d'isolation.

Nommer les capacités métier (`project:create`, `billing:manage`, `content:publish`) plutôt que disperser des comparaisons `role === "admin"`. Obtenir une validation avant de coder.

## 4. Concevoir le schéma Convex

Lire `references/convex-model.md`. Pour le modèle natif, prévoir au minimum :

- `organizations` ;
- `organizationMembers` avec paire unique logique organisation/utilisateur ;
- `organizationInvitations` avec email normalisé, rôle, expiration, état et créateur ;
- ressources métier portant un `organizationId` obligatoire ;
- journal d'audit pour actions sensibles.

Créer les index par organisation et accès réels. Paginer les listes. Ne pas mettre tous les membres ou invitations dans un tableau croissant du document organisation.

Si Better Auth possède le cycle des membres, ne pas recopier une seconde table éditable. Une projection Convex n'est acceptable que si elle est reconstruisible, synchronisée par un mécanisme documenté et jamais utilisée au-delà de ses garanties.

## 5. Centraliser l'autorisation serveur

Créer des helpers uniques, testables, exécutés avant les lectures :

1. `requireUser(ctx)` ;
2. `requireMembership(ctx, organizationId)` ;
3. `requireCapability(ctx, organizationId, capability)` ;
4. helper chargeant une ressource puis vérifiant son `organizationId`.

- Les fonctions publiques utilisent des validateurs stricts.
- Les fonctions admin globales sont séparées des fonctions tenant.
- Les actions externes appellent d'abord une query/mutation interne d'autorisation, puis l'effet externe.
- Un cache ou token de capacités doit être court, révocable et ne jamais permettre un accès après retrait du membre.
- L'organisation active sert la navigation, pas l'autorisation implicite.

## 6. Implémenter les invitations

Lire `references/invitations.md` et utiliser `aq-email`.

- Générer un identifiant/token imprévisible, stocker seulement la forme nécessaire et limiter la durée.
- Lier invitation, email normalisé, organisation et rôle ; vérifier l'identité correspondant à l'adresse avant acceptation selon le niveau de risque.
- Dédupliquer invitation active et envoi ; renvoyer sans créer des appartenances multiples.
- À l'acceptation, vérifier à nouveau expiration, état, limite de sièges et droit de l'invitant dans une opération atomique.
- Gérer acceptée, refusée, révoquée et expirée sans révéler inutilement l'existence d'une organisation.
- Après login/signup, revenir vers l'invitation sans accepter automatiquement sous le mauvais compte.

## 7. Protéger le cycle owner et membre

- Une organisation doit toujours conserver au moins un owner actif.
- Un owner ne peut pas se retirer, être retiré ou rétrogradé s'il est le dernier owner.
- Le transfert de propriété exige réauthentification récente, cible membre valide, confirmation et audit.
- Retirer un membre révoque immédiatement son accès et ses invitations/tokens liés selon le modèle.
- Définir explicitement ce que deviennent les ressources créées par un membre supprimé.
- La suppression d'organisation suit rétention, paiement, export et `aq-nlpd`; elle n'est jamais un simple delete depuis le client.

## 8. Relier plans et paiements

La facturation est généralement portée par l'organisation. Définir avec `aq-pricing` : sièges inclus, invitations en attente, dépassement, propriétaires gratuits ou non, et comportement lors d'un downgrade.

- Stripe/RevenueCat reste la source de l'état payé ; Convex conserve l'état réconcilié nécessaire aux capacités.
- Vérifier limites côté serveur au moment de l'invitation et de l'acceptation.
- Ne pas supprimer automatiquement des membres lors d'un downgrade. Bloquer la croissance ou demander une résolution explicite.
- Les webhooks sont vérifiés et idempotents via `aq-stripe` ou `aq-revenuecat`.

## 9. Construire l'UX web et mobile

- Afficher clairement l'organisation active et le rôle/capacités utiles.
- Lors d'un switch, annuler/invalider les requêtes de l'ancienne organisation et afficher un état de chargement avant les nouvelles données.
- Ne pas faire apparaître brièvement des données mises en cache d'un autre tenant.
- Proposer membres, invitations, renvoi/révocation et transfert seulement aux capacités autorisées.
- Sur mobile, partager les identifiants serveur mais stocker la session avec Secure Store ; tester deep links d'invitation à froid et app déjà ouverte.
- Utiliser `aq-admin-dashboard` pour la gestion globale sans confondre admin AQ et owner client.

## 10. Tester l'isolation et les courses

Créer au minimum deux organisations, plusieurs rôles et invitations. Tester :

- non authentifié ; membre absent, suspendu et retiré ;
- utilisateur A/org A tente chaque lecture et écriture sur une ressource de B ;
- `organizationId` ou `resourceId` falsifié par appel direct ;
- member/admin/owner sur chaque capacité ;
- dernier owner, transfert, départ et suppression simultanés ;
- invitation valide, expirée, révoquée, réutilisée, double clic, mauvais compte et siège devenu indisponible ;
- switch rapide entre organisations, onglets concurrents, mobile hors ligne/reconnexion ;
- downgrade, webhook répété et état de facturation en retard ;
- aucune fuite dans erreurs, listes, compteurs, recherche, exports, notifications ou cache.

Les tests d'accès direct aux fonctions Convex sont obligatoires ; cacher les boutons n'est pas un test de sécurité. Terminer par `aq-audit`.

## Résultat attendu

- architecture/version compatible documentée ;
- matrice de capacités validée ;
- une seule source de vérité ;
- helpers Convex appliqués avant toute lecture ;
- invitations email idempotentes et sûres ;
- owner/transfert/suppression protégés ;
- limites de plans appliquées côté serveur ;
- parcours Nuxt/Expo cohérents ;
- tests multi-tenant et audit réussis.

Terminer par **Source de vérité**, **Modèle**, **Permissions**, **Invitations**, **Facturation**, **Isolation prouvée**, **Reste manuel**.
