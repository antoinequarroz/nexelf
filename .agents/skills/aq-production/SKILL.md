---
name: aq-production
description: Déploie un projet AQ en production pour la première fois ou après un changement d'environnement — provisionne le déploiement Convex de prod, configure l'hébergeur (Vercel ou Infomaniak), synchronise les variables, lance le premier déploiement, puis liste ce qui ne peut pas être automatisé. À utiliser quand l'utilisateur dit "on met en prod", "déploie", "publish to production", "première mise en ligne", ou après une rotation de clés.
---

# Mise en production

<objective>
Déployer avec le moins d'intervention manuelle possible, puis dire clairement à l'utilisateur le petit nombre de choses qu'il doit faire lui-même : URL de callback OAuth, clés live, domaine personnalisé, DNS.
</objective>

<prerequis>
Lancer `aq-ship` d'abord. Si la checklist de pré-livraison a des bloquants, ne pas déployer.
</prerequis>

<strict_order>
1. Préflight — `aq-ship` passé, dépôt propre, branche à jour
2. Backend de production (déploiement Convex de prod, ou base Supabase de prod)
3. Variables d'environnement — les secrets vont dans le backend, pas chez l'hébergeur
4. Hébergeur — projet lié, commande de build, preset Nitro
5. Premier déploiement
6. Vérification post-déploiement
7. Ce qui reste manuel
</strict_order>

## Variables — la règle

Les secrets d'application (clés Stripe, secret d'auth, clés de mail) vivent dans l'environnement **Convex de production**. L'hébergeur ne reçoit que ce dont le build a besoin : URL publique du backend, DSN Sentry, clés de déploiement.

Un secret qui n'a aucune raison d'être chez l'hébergeur ne doit pas y être.

## Hébergeur

**Vercel** — preset Nitro `vercel` (auto-détecté). Variables définies sur les trois environnements. Région des fonctions choisie explicitement. Protection des previews si le contenu est confidentiel.

**Infomaniak** — preset `node-server`. Version de Node figée dans le panel **et alignée sur celle du projet** — le piège classique. Vérifier le redémarrage automatique après reboot, le SSL et son renouvellement, et les sauvegardes au niveau de l'hébergement.

## Vérification post-déploiement

- La page d'accueil répond en production.
- Sentry reçoit une erreur volontaire depuis la prod, puis on retire l'erreur.
- Le parcours principal fonctionne sur l'URL de production, pas seulement en local.
- Le webhook Stripe reçoit un événement de test.
- Aucun secret exposé côté client — vérifié dans le bundle.

## Ce qui reste manuel — à lister explicitement

Ces points ne s'automatisent pas. Les donner en liste claire, avec où aller et quoi remplir :

- URL de callback OAuth à ajouter chez chaque fournisseur, pour le domaine de production
- Clés Stripe live, et recréation du webhook live avec son propre secret
- Produits et prix Stripe à recréer en mode live — ils ne migrent pas depuis le mode test
- Domaine personnalisé et enregistrements DNS
- SPF, DKIM et DMARC sur le domaine d'envoi des mails, sinon l'auth part en spam
- Transmission des accès au client

## Ne pas faire

- Ne pas déployer une branche qui n'est pas à jour avec `main`.
- Ne pas exécuter de migration de données dans le même mouvement qu'un déploiement de code.
- Ne pas passer Stripe en live dans la même session que la première mise en production.
