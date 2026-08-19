---
name: aq-handover
description: Passation d'un projet AQ au client — transfert des accès et de la propriété des comptes, documentation, formation, et ce qui reste ou non chez Antoine. À utiliser au moment de la remise d'un site ou d'une app, à la fin d'un mandat, quand un client change de prestataire, ou quand l'utilisateur dit "on livre au client", "passation", "je remets les accès".
---

# Passation au client

La passation décide si le client revient content ou t'appelle un dimanche. Elle se prépare, elle ne s'improvise pas le dernier jour.

## Principe de propriété

**Les comptes sont au nom du client, avec Antoine en accès délégué.** Pas l'inverse.

Un hébergement, un domaine ou un compte Stripe au nom du prestataire est une dette : elle se paie à la rupture, avec des données bloquées et une relation qui se dégrade. Si un compte a été créé au nom d'Antoine pendant le projet, c'est le moment de le transférer.

Comptes concernés : domaine, hébergement, base de données, Stripe, Sentry, mail transactionnel, analytics, App Store, Google Play, Google Business.

## 1. Inventaire des accès

Une table, remise par écrit :

| Service | Compte au nom de | Accès Antoine | Rôle |
|---|---|---|---|

Pour chacun : où se connecter, qui paie, quand ça se renouvelle.

**Les mots de passe ne se transmettent ni par email ni par message.** Gestionnaire de mots de passe partagé, ou remise en main propre. Ceux qui ont circulé pendant le projet sont à changer.

## 2. Documentation remise

Trois documents, courts. Personne ne lit un manuel de trente pages.

- **Comment ça marche** — deux pages, en français non technique : où est le site, comment il se met à jour, ce qui coûte combien par an.
- **Guide d'édition** (si CMS) — captures d'écran, les cinq gestes qu'il fera vraiment. Pas l'exhaustivité.
- **En cas de problème** — quoi vérifier soi-même, quand appeler, à quel numéro, et ce qui est couvert par le forfait.

## 3. Formation

- Une session, en visio ou sur place, avec la ou les personnes qui éditeront vraiment.
- **L'enregistrer.** Ils oublieront, et une nouvelle personne arrivera. Un enregistrement de 20 minutes vaut mieux qu'une deuxième session gratuite.
- Leur faire faire les gestes eux-mêmes pendant la session, pas les regarder.

## 4. Le contrat de suite

À dire explicitement, avant que la question ne se pose mal :

- ce qui est garanti, et pendant combien de temps
- ce qui est inclus dans le forfait de maintenance, ce qui ne l'est pas (voir `aq-maintenance`)
- le tarif d'une évolution ou d'une nouvelle page
- **le délai de réponse réaliste** — pas « je suis toujours dispo »
- ce qui se passe si le client veut changer de prestataire : il part avec son code, ses données et ses comptes. Le dire à voix haute, ça rassure et ça se retient

## 5. Vérification finale

- [ ] `aq-ship` passé, sans bloquant
- [ ] Tous les comptes au nom du client, transferts confirmés côté client
- [ ] Antoine conserve un accès délégué là où c'est nécessaire pour la maintenance
- [ ] Mots de passe ayant circulé : changés
- [ ] Documentation remise et accusée de réception
- [ ] Formation faite et enregistrée
- [ ] Facturation à jour
- [ ] Le code est chez le client, ou l'accès au dépôt lui est garanti

## Ce qui reste chez Antoine

- Le dépôt de code, sauf accord contraire — mais le client doit pouvoir y accéder ou en obtenir une copie sur demande. À écrire dans le contrat.
- Les fichiers sources de design, sauf cession explicite.
- Le droit de citer le projet en référence, sauf refus du client. **Demander, ne pas supposer.**
