# Contrôles par profil

## Vitrine

- Domaine, SSL, pages principales, 404, redirections et partage social.
- Formulaire complet : protection antispam, envoi, réception et réponse.
- Contenu, traductions, liens, médias, droits et informations obsolètes.
- Sitemap, robots, canonicals, Search Console et indexation anormale.
- Build statique/revalidation, déploiement et cache/CDN.

## CMS

Ajouter :

- login, invitation, récupération, rôles éditeur/admin côté serveur ;
- brouillon, preview, publication, dépublication, corbeille/historique ;
- uploads, quotas et traitement des médias ;
- journal d'audit et absence de fuite de brouillons ;
- sauvegarde/restauration de la base **et** des fichiers.

## SaaS

Ajouter :

- auth, organisations, invitations, isolement entre tenants et suppression ;
- activation/onboarding et tâches planifiées ;
- Stripe : webhooks, événements échoués, abonnements, annulations, grâce et réconciliation ;
- quotas/limites vérifiés côté serveur ;
- emails transactionnels, bounces et plaintes ;
- admin, support et journal d'audit ;
- base, stockage, coûts variables et restauration sans effets externes.

## Mobile

Ajouter :

- dernière version publiée, adoption, crash-free users et version minimale supportée ;
- certificats/profils, comptes stores, contrats et dates d'expiration ;
- EAS builds/updates, canaux OTA et compatibilité runtime ;
- deep links, notifications et permissions après changements OS ;
- RevenueCat : offerings, entitlements, webhooks, achat sandbox et restauration ;
- mode hors ligne, reprise réseau et synchronisation ;
- conformité avec les exigences actuelles des stores, à vérifier dans leurs sources officielles.

## Services communs

Pour chaque fournisseur : propriétaire, accès, MFA, plan, moyen de paiement, quota, région, statut, export, sauvegarde, webhook, secret à faire tourner et procédure si le compte disparaît.
