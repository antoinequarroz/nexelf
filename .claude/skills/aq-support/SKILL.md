---
name: aq-support
description: >-
  Cadre, conçoit, implémente et valide le support client d'un projet AQ : FAQ
  et centre d'aide, contact public, tickets authentifiés, conversations,
  catégories, priorités, assignation, SLA, pièces jointes, notifications,
  dashboard admin, diagnostic mobile, anti-spam, confidentialité et mesure.
  À utiliser pour une vitrine, un portfolio, un CMS, un SaaS ou une app mobile
  lorsque visiteurs, clients ou équipes doivent demander de l'aide et suivre
  une réponse. Travaille avec aq-email, aq-notifications, aq-files-storage,
  aq-organizations, aq-admin-dashboard et aq-nlpd.
---

# Support client AQ

Aider l'utilisateur à résoudre son problème avec le moins d'effort possible, puis transformer les demandes récurrentes en améliorations du produit. Ne pas construire un système de tickets complet lorsqu'un formulaire fiable suffit.

## 1. Choisir le bon niveau

Lire `AGENTS.md`, le produit, les utilisateurs, les plans, les rôles et les canaux existants. Poser progressivement :

- Qui demande de l'aide : visiteur anonyme, client identifié, membre d'organisation, éditeur CMS ou utilisateur mobile ?
- Quels problèmes sont attendus et lesquels sont urgents, sensibles ou liés à la sécurité ?
- Le support est-il assuré par Antoine, le client, une équipe ou un prestataire ?
- Quels canaux existent déjà : email, téléphone, chat, centre d'aide ou aucun ?
- L'utilisateur doit-il suivre l'état et l'historique dans le produit ?
- Quels horaires, langues, volumes, délais réalistes et engagements contractuels ?
- Les plans payants donnent-ils un niveau de support différent ?

Choisir le plus petit système suffisant :

- **Vitrine/portfolio** : FAQ ciblée + formulaire de contact robuste et réponse email.
- **CMS** : aide contextuelle + contact, éventuellement tickets pour les éditeurs.
- **SaaS** : centre d'aide + tickets authentifiés par organisation si le suivi apporte une vraie valeur.
- **Mobile** : aide intégrée + ticket/contact incluant un diagnostic explicitement consenti.

## 2. Concevoir l'expérience

Poser les questions UX/UI avant le schéma :

- Où l'utilisateur cherche-t-il de l'aide et dans quel contexte ?
- Peut-il résoudre le problème avant d'ouvrir une demande sans être bloqué par une FAQ envahissante ?
- Quelles informations sont indispensables pour répondre au premier échange ?
- Quels délais afficher sans promettre ce que l'équipe ne peut pas tenir ?
- Comment signaler une urgence de sécurité, facturation ou accès au compte ?
- Comment suivre, répondre, rouvrir et clôturer une demande ?
- Quels états vides, hors ligne, erreur et accessibilité clavier/lecteur d'écran ?

Ne pas forcer un bot, une recherche ou dix champs avant de permettre le contact. Ne pas appeler chaque demande « urgente ».

## 3. Écrire le plan

Copier `assets/support-plan.md` vers `docs/support.md`. Définir :

- périmètre et canaux ;
- catégories et routage ;
- données demandées et diagnostics ;
- états, priorités et règles de réouverture ;
- rôles et permissions ;
- attentes de réponse et éventuels SLA ;
- notifications ;
- rétention, export et suppression ;
- métriques réellement utiles.

Obtenir l'accord du responsable opérationnel. Un workflow que personne ne surveille ne doit pas être livré.

## 4. Modéliser tickets et conversations

Lire `references/tickets.md`. Pour un système authentifié, séparer :

- ticket : sujet, catégorie, état, priorité, demandeur, organisation et assignation ;
- messages : auteur, visibilité client/interne, contenu et ordre stable ;
- pièces jointes : références sécurisées gérées avec `aq-files-storage` ;
- événements d'audit : changements d'état, priorité, assignation et accès sensible.

Utiliser des index pour les files réelles et paginer tickets/messages. Ne pas stocker une conversation croissante dans un tableau du ticket.

Toutes les fonctions Convex vérifient identité, appartenance et capacité avant lecture. Un membre ne voit que les tickets autorisés de son organisation ; un agent support ne reçoit que le périmètre nécessaire.

## 5. Recevoir une demande publique

- Valider et normaliser les champs côté serveur.
- Utiliser un honeypot, une limite de débit et, si le risque le justifie, Turnstile avec vérification serveur.
- Ne jamais révéler si une adresse possède un compte.
- Créer une clé d'idempotence pour éviter les doublons lors d'un retry.
- Envoyer via `aq-email`, hors mutation Convex, avec une adresse de réponse surveillée.
- Afficher une confirmation honnête et une solution alternative si l'envoi échoue durablement.
- Ne pas inclure secrets, mots de passe, données médicales ou cartes bancaires dans le formulaire.

Pour une simple vitrine, préférer une boîte email bien configurée à un faux dashboard de tickets inutilisé.

## 6. Construire le dashboard support

Appeler `aq-admin-dashboard`. Fournir uniquement les outils utilisés :

- files par état, assignation et ancienneté ;
- recherche bornée et filtres sauvegardables si le volume le justifie ;
- réponse publique et note interne visuellement distinctes ;
- assignation, priorité, tags et historique d'audit ;
- réponses enregistrées relues avant envoi ;
- contexte produit minimal et accès explicite aux données sensibles ;
- prévention des doubles réponses concurrentes.

Ne jamais confondre admin global AQ, agent support et admin de l'organisation cliente. Les notes internes ne doivent jamais apparaître dans l'API ou les notifications client.

## 7. Ajouter pièces jointes et diagnostic

Utiliser `aq-files-storage` : fichiers privés, types/poids bornés, scan adapté, URL courte et autorisation fraîche. Ne jamais rendre une pièce jointe accessible par simple connaissance de son URL.

Pour le diagnostic web/mobile :

- demander un consentement clair avant de joindre les informations ;
- montrer ce qui sera envoyé ;
- limiter à version app, plateforme, langue, identifiants techniques non secrets et erreur utile ;
- exclure tokens, corps de requête, contenu utilisateur, contacts, position et logs complets par défaut ;
- permettre de retirer le diagnostic avant envoi.

Lier Sentry par un identifiant d'événement sûr lorsque possible, sans copier automatiquement les données de production dans le ticket.

## 8. Notifier sans créer de doubles conversations

Utiliser `aq-notifications` et `aq-email` pour accusé de réception, réponse, demande d'information et clôture.

- Définir une source de vérité unique pour la conversation.
- Dédupliquer chaque message et notification.
- Ne pas transformer une réponse email entrante en nouveau ticket sans threading fiable.
- Ne pas envoyer d'email à l'auteur d'une action qu'il vient de faire sauf besoin explicite.
- Respecter préférences pour les messages optionnels ; les mises à jour nécessaires au ticket restent clairement séparées.

## 9. Définir priorité et SLA

Lire `references/operations.md`.

- Déduire la priorité depuis impact, périmètre et urgence vérifiés, pas depuis la formulation émotionnelle seule.
- Afficher « délai indicatif » tant qu'aucun engagement contractuel n'existe.
- Si un SLA existe, définir heures ouvrées, fuseau, point de départ, pause, résolution, exclusions et escalade.
- Les plans peuvent changer le canal ou le délai, jamais la sécurité ni le respect des droits utilisateur.
- Prévoir propriétaire de la file, remplaçant, jours fériés et alerte avant dépassement.

## 10. Vie privée, sécurité et rétention

- Appliquer `aq-nlpd` et `aq-legal-pages` aux finalités, sous-traitants, diagnostics et durées.
- Minimiser le contenu libre et avertir de ne pas transmettre de secrets.
- Limiter l'accès agent, auditer les consultations sensibles et révoquer immédiatement les départs.
- Définir export, anonymisation/suppression et traitement lors de la suppression d'un compte ou d'une organisation.
- Ne pas réutiliser les conversations pour entraîner un modèle, faire du marketing ou publier un témoignage sans base et information distinctes.

## 11. Tester et exploiter

Tester au minimum :

- spam, rate limit, validation serveur et double soumission ;
- utilisateur A/organisation A contre ticket ou pièce jointe de B ;
- demandeur, membre, admin organisation, agent support et admin global ;
- note interne absente de chaque vue/API/email client ;
- message simultané, assignation concurrente et retry sans doublon ;
- email invalide, panne fournisseur et notification répétée ;
- pièce jointe refusée, infectée, expirée et supprimée ;
- diagnostic avec consentement, retrait et absence de secret ;
- SLA/heures ouvrées, réouverture et ticket sans réponse ;
- export, suppression, rétention et journal d'audit.

Mesurer volume par catégorie, temps de première réponse, temps de résolution, réouverture et problèmes récurrents. Ne pas optimiser une métrique au détriment d'une résolution réelle.

## Résultat attendu

- niveau de support proportionné au projet ;
- expérience de contact et de suivi validée ;
- permissions et isolation prouvées ;
- dashboard exploitable par une équipe identifiée ;
- pièces jointes et diagnostics minimisés ;
- notifications fiables sans doublons ;
- délais/SLA réalistes ;
- rétention et tests documentés.

Terminer par **Canaux**, **Parcours**, **Workflow**, **Permissions**, **Notifications**, **SLA**, **Exploitation**, **Reste manuel**.
