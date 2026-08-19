---
name: aq-onboarding
description: Conçoit, implémente et valide l'onboarding d'un SaaS web, d'une app mobile ou des éditeurs d'un CMS AQ. À utiliser pour une première connexion, une activation, une checklist, des états vides, un assistant de configuration, l'invitation d'une équipe, un essai ou paywall, la restauration d'achat, des emails d'activation ou l'amélioration du taux d'activation. Pose des questions produit et UX/UI progressivement, relie le parcours à l'auth, au pricing, aux paiements et aux analytics, sans imposer une visite guidée générique. Ne pas utiliser pour une simple landing page publique.
---

# Onboarding AQ

Amener l'utilisateur à sa première valeur réelle avec le moins de friction possible. L'inscription n'est pas l'activation et une visite guidée n'est pas une stratégie d'onboarding.

## Prérequis

Lire `AGENTS.md`, la spec produit, `docs/pricing.md`, les parcours d'auth et l'interface existante. Lire ensuite une seule variante :

- `references/saas.md` pour un SaaS web ;
- `references/mobile.md` pour Expo et RevenueCat ;
- `references/cms.md` pour l'arrivée d'un éditeur ou administrateur.

Si l'identité n'est pas fiable, traiter d'abord `aq-better-auth`. Si l'offre n'est pas définie, traiter `aq-pricing` avant un essai ou paywall.

## 1. Choisir le niveau d'intervention

Demander si le besoin est **spécification**, **audit d'un parcours existant**, ou **spécification puis implémentation**. Proposer la dernière option par défaut lorsque le dépôt est disponible.

Ne pas coder avant d'avoir validé le moment de valeur, les segments et les étapes obligatoires.

## 2. Conduire l'entretien produit et UX/UI

Poser un bloc à la fois avec un défaut raisonné. Ne pas présenter un questionnaire massif.

### Valeur et segments

- Qui arrive, depuis quelle promesse et avec quel niveau de connaissance ?
- Quelle action prouve que cette personne a obtenu une première valeur ?
- Quel délai maximal est acceptable avant ce moment ?
- Les rôles, plans ou sources d'acquisition exigent-ils des parcours différents ?

### Données et configuration

- Que faut-il absolument connaître avant de montrer le produit ?
- Que peut-on déduire, préremplir ou demander plus tard ?
- Faut-il créer un premier objet, importer des données, connecter un service ou inviter une équipe ?
- Une organisation, un workspace ou un rôle doit-il exister avant l'usage ?

### Progression et retour

- Quelles étapes sont obligatoires, optionnelles, reportables ou réversibles ?
- Comment reprendre après fermeture, erreur ou changement d'appareil ?
- Une checklist persistante aide-t-elle réellement, ou l'état vide suffit-il ?
- Comment l'utilisateur peut-il passer, revenir et demander de l'aide ?

### Présentation

- Faut-il apprendre par l'action, avec un exemple, une démo ou du contenu réel ?
- Quel ton, quelle densité et quel niveau d'accompagnement conviennent au segment ?
- Quelles différences desktop/mobile, clavier, lecteur d'écran et réduction des animations ?

Préférer l'apprentissage dans le contexte et les états vides utiles. Éviter les carrousels, modales successives et longues visites guidées sauf preuve qu'ils servent le moment de valeur.

## 3. Cartographier le parcours

Copier `assets/onboarding.md` vers `docs/onboarding.md`, puis documenter :

- promesse d'entrée et moment d'activation ;
- segments et branches ;
- étapes, prérequis, sorties et reprise ;
- données demandées et justification ;
- états vide, chargement, erreur, hors ligne et interdit ;
- messages et emails éventuels ;
- événements de mesure ;
- sécurité, confidentialité et tests.

Pour chaque étape, demander : « Peut-elle disparaître, être préremplie ou arriver après la première valeur ? » Obtenir une confirmation avant l'implémentation.

## 4. Concevoir l'état et la sécurité

- Enregistrer la progression côté serveur quand elle doit suivre le compte ou l'organisation ; ne pas la déduire seulement du client.
- Définir un état métier explicite et versionné plutôt qu'un unique booléen `onboarded` dès que le parcours branche.
- Rendre les étapes et callbacks idempotents : un rafraîchissement ou double clic ne doit rien dupliquer.
- Vérifier côté Convex l'identité, l'organisation, le rôle, le plan et les limites avant toute écriture.
- Ne jamais accepter un `userId`, rôle, entitlement ou état de paiement fourni comme vérité par le client.
- Minimiser les données demandées et expliquer les permissions sensibles juste avant leur usage.
- Prévoir la migration des utilisateurs déjà présents quand le parcours évolue.

## 5. Construire l'expérience

- Commencer par la plus petite action menant à la valeur.
- Garder une action principale claire par écran et afficher la progression seulement si elle aide à terminer.
- Sauvegarder automatiquement ce qui peut l'être et rendre les erreurs réparables sans tout recommencer.
- Utiliser les tokens et traductions du projet ; aucune chaîne ou couleur en dur.
- Fournir de vrais états vides avec une prochaine action, pas des écrans décoratifs.
- Laisser passer les étapes optionnelles et permettre de retrouver l'aide plus tard.
- Demander les notifications, contacts, importations ou permissions au moment où leur bénéfice devient concret.
- Adapter l'interface au clavier, au lecteur d'écran, aux zones tactiles, au hors ligne mobile et à la réduction des animations.

Pour un paywall ou essai, ne pas cacher prix, durée, renouvellement ou annulation. Appeler `aq-stripe` sur le web et `aq-revenuecat` sur mobile pour l'implémentation du paiement.

## 6. Relier messages et mesure

Définir seulement les événements nécessaires au diagnostic du parcours : entrée, étape importante, activation, abandon explicable et conversion. Passer par `aq-analytics` pour le plan de mesure et ne jamais envoyer de données personnelles.

Les emails ou notifications doivent aider à reprendre une action utile, pas compenser un produit incompréhensible. Prévoir fréquence, consentement, deep link, arrêt après activation et cas où l'utilisateur a déjà terminé sur un autre appareil.

## 7. Valider de bout en bout

Tester au minimum :

- nouvel utilisateur jusqu'au moment de valeur ;
- retour après abandon à chaque étape persistée ;
- rafraîchissement, double soumission et réseau lent ;
- étape optionnelle passée puis retrouvée ;
- rôle ou organisation différents ;
- refus d'une permission et solution alternative ;
- essai, achat, restauration ou annulation si concernés ;
- mobile, clavier, focus et lecteur d'écran selon la plateforme ;
- événements reçus une seule fois, sans donnée personnelle.

Vérifier aussi qu'un ancien utilisateur n'est pas bloqué par une nouvelle version du parcours. Lancer les tests ciblés, `pnpm check` et l'e2e applicable.

## 8. Livrer et apprendre

Documenter les preuves, actions manuelles et hypothèses dans `docs/onboarding.md`. Définir une métrique d'activation, un délai jusqu'à la valeur, les abandons par étape et une date de revue. Ne pas optimiser uniquement le taux de complétion si les utilisateurs ne tirent ensuite aucune valeur du produit.

Terminer par **Décidé**, **Implémenté**, **Validé**, **Mesuré**, **Reste manuel**.
