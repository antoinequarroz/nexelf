---
name: aq-convex
description: Conventions Convex sur les projets AQ — schéma, queries, mutations, actions, sécurité, index, pagination, migrations et performance. À utiliser dès qu'on écrit ou modifie du code dans le dossier convex/, qu'on conçoit un schéma, qu'on ajoute une fonction backend, qu'on débogue une requête lente, ou qu'on fait une migration de données.
---

# Conventions Convex

## Le dossier `convex/` est la frontière de sécurité

Toute vérification d'autorisation se fait ici, jamais dans le client. Le client dit ce qu'il prétend être ; le serveur décide.

- Chaque fonction publique résout l'identité **avant** toute lecture. Pas d'identité, on rejette.
- Ne jamais filtrer par un `userId` reçu en argument : l'identité vient du contexte d'auth.
- Un helper unique, `requireUser(ctx)`, utilisé partout. Une seule façon de faire.
- `internal*` pour tout ce qui ne doit pas être appelable depuis l'extérieur. Par défaut, une fonction exportée est publique — s'en souvenir.

## Query, mutation, action

Trois types, trois rôles. Ne pas les mélanger.

| Type | Rôle | Interdit |
|---|---|---|
| `query` | Lire. Pure, réactive, mise en cache | Aucun effet de bord |
| `mutation` | Écrire. Transactionnelle | Aucun appel réseau externe |
| `action` | Effets externes : mail, paiement, API tierce | Pas d'accès direct à la base |

Un appel Stripe ou Resend dans une mutation casse la transaction. Il va dans une action, qui appelle ensuite une mutation interne.

## Schéma

- `convex/schema.ts` est la source de vérité. Aucun champ non déclaré.
- Validateurs explicites sur toutes les fonctions publiques. Ce sont les seules garde-fous entre le client et la base.
- Nommer les tables au pluriel, les champs en camelCase.
- Éviter les documents qui grossissent sans limite (tableaux qui s'allongent indéfiniment) : les sortir dans leur propre table.

## Index et performance

- Un `filter` sur une grande table qui n'utilise pas d'index scanne tout. Déclarer un index et utiliser `withIndex`.
- Nommer les index d'après leurs champs (`by_user`, `by_user_and_date`) pour rendre l'oubli visible.
- Toute liste potentiellement longue est paginée. Pas de « on verra plus tard » : le jour où il y a 10 000 lignes, c'est déjà en production.
- Éviter les requêtes en boucle. Une requête qui en déclenche N est un problème de conception, pas de performance.

## Migrations de données

- Un changement de schéma sur des données existantes est une opération à part : sa branche, son ADR si le modèle change.
- Migrer par lots avec une fonction interne, jamais en une passe sur toute la table.
- Rendre la migration idempotente : elle sera relancée.
- Garder l'ancien champ le temps que le nouveau soit rempli et vérifié, puis le supprimer dans un second temps.

## Environnement

- Les secrets vivent dans l'environnement Convex, pas dans un `.env` du front.
- Dev et prod sont deux déploiements distincts, avec leurs propres variables. Ne jamais pointer un front de dev sur la base de prod.

## Pièges

- La version de `convex` est liée à celle du composant Better Auth. Pas de mise à jour large à l'aveugle.
- L'intégration Vue/Nuxt est communautaire : lire les notes de version avant toute montée de version, et garder la porte de sortie de l'ADR 0001 en tête.
- Le temps réel est gratuit et automatique : ne pas réimplémenter de polling.
