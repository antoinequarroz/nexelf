---
name: aq-notifications
description: >-
  Cadre, conçoit, implémente et valide les notifications d'un CMS, SaaS ou app
  mobile AQ : centre de notifications in-app, emails transactionnels, push Expo,
  préférences par canal, événements Convex, invitations, facturation, sécurité,
  deep links, retries, déduplication et mesure. À utiliser lorsqu'un produit doit
  informer ses utilisateurs ou organisations sans bruit ni doublons, ou lors de
  l'ajout d'une notification web/mobile. Travaille avec aq-email,
  aq-organizations, aq-onboarding, Stripe, RevenueCat et Better Auth.
---

# Notifications AQ

Faire parvenir une information utile, au bon utilisateur, par le canal approprié et au bon moment. Une notification n'est pas une fonctionnalité par défaut : chaque interruption doit justifier sa valeur.

## 1. Comprendre avant de construire

Lire `AGENTS.md`, les parcours produit, l'auth, les organisations, l'onboarding, les paiements et l'email existant. Poser un bloc de questions à la fois.

### Événements et destinataires

- Quel événement métier vient réellement de se produire ?
- Qui doit le savoir : acteur, owner, admin, membre, équipe ou support AQ ?
- Quelle action ou décision devient possible grâce au message ?
- Est-ce immédiat, différable, regroupable dans un digest ou consultable uniquement dans le produit ?
- Qu'arrive-t-il si le message n'est jamais reçu ?

### Canaux et UX/UI

- In-app, email, push, ou combinaison avec règle d'escalade ?
- Quel niveau : sécurité, action requise, transaction, activité, conseil produit ou marketing ?
- Faut-il un badge, une liste, une bannière persistante, un toast ou aucun élément visuel ?
- Quand considère-t-on le message lu : ouverture de la liste, vue du détail ou action accomplie ?
- Quelles préférences l'utilisateur peut-il modifier ? Les messages indispensables au service doivent rester séparés du marketing.
- Quelles langues, heures calmes, fuseaux horaires, exigences d'accessibilité et comportements hors ligne ?

### Contraintes produit

- Les notifications appartiennent-elles à un utilisateur ou à une organisation ?
- Web, mobile ou les deux ? Quels deep links existent sur chaque plateforme ?
- Quels volumes, pics et délais sont attendus ?
- Quelle durée de conservation et quelles données sensibles faut-il exclure ?

Ne pas demander toute l'architecture d'un coup. Proposer des défauts explicites, puis confirmer les décisions qui changent l'expérience ou le coût.

## 2. Écrire le catalogue

Copier `assets/notifications-plan.md` vers `docs/notifications.md`. Pour chaque type, définir :

- identifiant stable et événement source ;
- destinataire et frontière d'organisation ;
- valeur utilisateur et CTA ;
- priorité et canaux ;
- délai, regroupement et heures calmes ;
- règle de préférence ou caractère obligatoire ;
- données minimales, traduction et deep link ;
- clé de déduplication, expiration et rétention ;
- comportement en cas d'échec ;
- test et signal de succès utile.

Supprimer les notifications sans action, information durable ou conséquence claire. Obtenir l'accord sur le catalogue avant l'implémentation.

## 3. Choisir l'architecture

Lire `references/architecture.md`. Séparer strictement :

1. l'événement métier, enregistré une seule fois ;
2. la décision de notification et les destinataires ;
3. la livraison par canal ;
4. le statut de livraison ;
5. l'état utilisateur lu/archivé et ses préférences.

Ne jamais envoyer un email ou un push directement dans une mutation Convex. Enregistrer l'intention atomiquement avec le changement métier, puis livrer par action/job hors transaction.

Concevoir l'idempotence avant les retries. Une clé doit représenter une notification métier précise, pas seulement une tentative de transport.

## 4. Protéger les destinataires et le contenu

- Résoudre l'identité et l'appartenance côté serveur ; ne jamais accepter un destinataire ou rôle fourni par le client comme autorisation.
- Vérifier l'organisation et les capacités avant de créer, lister, lire ou marquer une notification.
- Ne pas révéler le nom d'un projet, d'une organisation, un montant ou une donnée médicale/sensible sur écran verrouillé sans décision explicite.
- Garder tokens push, clés fournisseur et secrets webhook côté serveur.
- Ne pas placer de secret ni de token durable dans un deep link.
- Journaliser identifiants techniques, résultat et cause d'échec, pas le corps complet par défaut.
- Appliquer `aq-nlpd` aux préférences, au suivi, à la rétention et au marketing.

## 5. Implémenter les canaux

### In-app

- Stocker une notification adressable par utilisateur et, si nécessaire, organisation.
- Paginer par index ; ne jamais charger toute l'historique ni maintenir un tableau croissant sur le profil.
- Distinguer `created`, `delivered`, `read`, `archived` et `acted` seulement si le produit utilise réellement ces états.
- Calculer le compteur non lu côté serveur avec une stratégie qui reste correcte sous concurrence.
- Lors d'un switch d'organisation, invalider les données de l'ancienne organisation avant d'afficher les nouvelles.

### Email

Appeler `aq-email` pour domaine, templates, consentement, délivrabilité, webhooks et désinscription. Partager l'événement métier et la clé d'idempotence, pas deux déclencheurs indépendants.

### Push mobile

Lire `references/mobile-push.md` et la documentation officielle actuelle d'Expo, Apple et Google avant de coder. Gérer permission contextuelle, token par installation, rotation, révocation, foreground/background, deep link et réception après reconnexion.

Ne pas demander l'autorisation push au premier lancement sans avoir expliqué sa valeur. Une permission refusée ne doit jamais bloquer le produit.

## 6. Préférences et fréquence

- Modéliser les préférences par **catégorie métier**, pas par écran ni par template.
- Laisser les alertes de sécurité ou obligations de service séparées et expliquer pourquoi elles ne sont pas désactivables.
- Appliquer les préférences au moment de planifier chaque canal, côté serveur.
- Prévoir digest, fréquence et heures calmes seulement quand le besoin est réel.
- Respecter fuseau horaire et langue enregistrés ; définir un fallback déterministe.
- Un changement de préférence doit s'appliquer aux livraisons futures, y compris celles déjà planifiées si la promesse produit l'exige.

## 7. Relier les autres skills

- `aq-organizations` : rôles, invitations, organisation active et isolation.
- `aq-onboarding` : progression et relances utiles, sans harcèlement.
- `aq-stripe` / `aq-revenuecat` : événements de paiement vérifiés et idempotents ; ne jamais déduire un paiement depuis le client.
- `aq-email` : livraison email et réputation du domaine.
- `aq-sentry` : erreurs techniques sans contenu personnel.
- `aq-admin-dashboard` : inspection des échecs et renvoi autorisé, jamais lecture libre du contenu privé.

## 8. Tester le système complet

Tester au minimum :

- bon événement, bon utilisateur et bonne organisation ;
- appel client falsifié et utilisateur retiré entre événement et livraison ;
- double événement, double job, retry et webhook dupliqué sans double message ;
- préférence désactivée, catégorie obligatoire, digest et heures calmes ;
- langue, fuseau, contenu long et données absentes ;
- compteur non lu concurrent, lecture sur plusieurs appareils et pagination ;
- email invalide, token push expiré, panne fournisseur et reprise ;
- permission push acceptée, refusée puis activée dans les réglages ;
- app fermée, ouverte, en arrière-plan, hors ligne et deep link invalide ;
- organisation active changée et absence de fuite inter-tenant ;
- aucun secret ni contenu sensible dans logs, analytics ou écran verrouillé.

Mesurer livraison et action utile quand cela répond à une question produit. Ne pas utiliser l'ouverture comme preuve de lecture ou de satisfaction.

## Résultat attendu

- catalogue validé et limité aux événements utiles ;
- architecture événement → planification → livraison documentée ;
- autorisation serveur et isolation par organisation ;
- in-app, email et/ou push cohérents sans doublons ;
- préférences, fuseaux et heures calmes respectés ;
- retries bornés et échecs observables ;
- UX accessible sur web et mobile ;
- scénarios critiques testés.

Terminer par **Catalogue**, **Canaux**, **Architecture**, **Préférences**, **Sécurité**, **Tests**, **Reste manuel**.
