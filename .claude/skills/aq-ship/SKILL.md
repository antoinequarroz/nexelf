---
name: aq-ship
description: >-
  Checklist de pre-livraison d'un projet web ou mobile AQ avant mise en production. A utiliser avant un deploiement en prod, avant de transmettre un site a un client, ou quand on demande "est-ce que c'est pret a partir". Declencheurs : mise en ligne, deploiement, livraison, recette, go live.
---

# Pre-livraison AQ

Tu **executes** ce que tu peux verifier toi-meme, tu poses la question pour le reste. Tu ne coches rien sans preuve.

## Technique
- [ ] `pnpm check` et `pnpm test` passent
- [ ] Build de production reussi, sans warning nouveau
- [ ] Aucune cle ni secret dans le diff ni dans l'historique git
- [ ] `.env.example` a jour avec toutes les variables necessaires
- [ ] Variables d'environnement configurees cote hebergeur

## Contenu et UX
- [ ] Zero lorem ipsum, zero image placeholder, zero lien mort
- [ ] Pages 404 et 500 personnalisees
- [ ] Formulaires : etat de chargement, message d'erreur utile, confirmation d'envoi
- [ ] Teste en 375px de large et navigable au clavier
- [ ] Orthographe et accents verifies

## SEO et partage
- [ ] Titres et meta descriptions uniques par page
- [ ] Open Graph et image de partage
- [ ] `sitemap.xml` et `robots.txt` coherents
- [ ] Redirections depuis l'ancien site si refonte

## Legal
- [ ] Politique de confidentialite en ligne et a jour
- [ ] Mentions legales / impressum
- [ ] Banniere cookies **seulement** si des cookies non essentiels sont poses
- [ ] Formulaires : mention de la finalite de la collecte

## Exploitation
- [ ] Monitoring d'erreurs actif (Sentry) et teste avec une erreur volontaire
- [ ] Sauvegardes configurees et **restauration testee une fois**
- [ ] Acces transmis au client (domaine, hebergeur, CMS) et documentes
- [ ] README a jour : comment lancer, comment deployer, qui appeler

## Specifique a l'hebergeur

**Vercel**
- [ ] Variables definies sur les trois environnements (production, preview, development)
- [ ] Domaine custom rattache, redirection apex/www geree
- [ ] Region des fonctions choisie explicitement, pas laissee au defaut
- [ ] Protection des deploiements de preview activee si le contenu est confidentiel

**Infomaniak**
- [ ] Version de Node figee dans le panel et alignee sur celle du projet
- [ ] Le service redemarre automatiquement apres un reboot
- [ ] Certificat SSL actif, renouvellement automatique verifie
- [ ] Sauvegardes activees au niveau de l'hebergement, pas seulement de la base
- [ ] Un deploiement complet a ete refait depuis zero au moins une fois

## Sortie

Trois listes : verifie, non verifiable par moi, bloquant. Rien d'autre.
