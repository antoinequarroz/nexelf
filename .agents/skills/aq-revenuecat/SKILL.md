---
name: aq-revenuecat
description: >-
  Configure et valide RevenueCat dans une app AQ Expo/React Native pour les abonnements, achats uniques, droits d'acces et paywalls iOS/Android. A utiliser apres `aq-pricing` quand l'utilisateur dit "RevenueCat", "achats integres", "in-app purchase", "abonnement mobile", "paywall", "entitlement", "offering", "restore purchases" ou veut monetiser une app publiee sur l'App Store ou Google Play. Couvre l'identite Better Auth/Convex, les webhooks idempotents et les tests sandbox. Ne pas utiliser pour un SaaS web Stripe ni pour des biens ou services physiques sans verifier les regles des stores.
---

# RevenueCat AQ

Passer d'une stratégie mobile validée à des achats intégrés testés sur iOS et Android. Ne jamais créer de produit live ni modifier un compte store sans confirmation explicite.

## Ordre obligatoire

1. Préflight métier et comptes
2. Catalogue stores
3. Projet RevenueCat
4. SDK et identité
5. Droits d'accès et paywall
6. Webhooks Convex
7. Restauration et gestion
8. Tests puis lancement

## 1. Préflight métier et comptes

- Exiger `docs/pricing.md`. S'il manque, lancer `aq-pricing` avec son parcours mobile.
- Lire l'auth existante, `app.json`, `eas.json`, `.env.example`, le code d'achats et le schéma Convex.
- Déterminer si l'achat porte sur du contenu/fonctionnalité numérique ou sur un bien/service physique. Lire `references/stores.md` avant de choisir le moyen de paiement.
- Vérifier la propriété des comptes Apple, Google, Expo et RevenueCat. Pour un client, les comptes doivent appartenir au client.
- Demander les plateformes ciblées et le mode : Test Store, sandbox Apple/Google ou production. Commencer par Test Store.

Points d'arrêt humains : contrats développeur, informations bancaires/fiscales, création d'app, validation des accords et soumission store. Les annoncer ; ne pas les contourner.

## 2. Construire le catalogue

À partir de `docs/pricing.md`, définir une table unique :

| Droit | Type | Produit iOS | Produit Android | Durée/consommation | Offre |
|---|---|---|---|---|---|

- Nommer les identifiants de produits de façon stable. Un identifiant publié ne se renomme pas comme une variable locale.
- Utiliser un **entitlement** pour représenter un droit métier (`premium`, par exemple), pas une période ou un prix.
- Attacher les produits équivalents iOS/Android au même entitlement.
- Utiliser une **offering** pour contrôler ce qui est présenté dans le paywall sans publier une nouvelle version.
- Distinguer abonnement, non-consommable et consommable. Ne pas modéliser un bénéfice unique comme un abonnement récurrent.
- Ne pas faire expirer les crédits achetés sur iOS.

Demander confirmation de la matrice avant toute création dans les dashboards.

## 3. Configurer RevenueCat

Créer ou sélectionner le projet, connecter chaque store, importer les produits, créer les entitlements et offerings, puis vérifier chaque liaison dans le dashboard.

Séparer :

- clés SDK publiques par plateforme, exposables à l'app ;
- secrets d'API et secret d'authentification webhook, uniquement côté serveur ;
- Test Store/sandbox et production.

Ne jamais écrire un secret serveur dans une variable `EXPO_PUBLIC_*`.

## 4. Installer et initialiser le SDK

Vérifier d'abord les versions Expo et les dépendances existantes. Installer avec l'outil Expo compatible :

```bash
npx expo install react-native-purchases react-native-purchases-ui
```

`react-native-purchases-ui` est optionnel si le projet construit son propre paywall. Ne pas l'installer inutilement.

- Configurer RevenueCat une seule fois au démarrage.
- Utiliser la clé correspondant à `Platform.OS`.
- En développement, activer les logs détaillés ; en production, réduire le bruit et les données exposées.
- Utiliser un App User ID stable, opaque et non devinable issu de l'identité applicative. Ne jamais utiliser email, ID public incrémental ou valeur en dur.
- Si l'identité arrive après le démarrage, configurer anonymement puis appeler `logIn`. Définir explicitement le comportement au logout et au changement de compte.
- Tester les fusions/alias d'utilisateurs ; ne pas supposer qu'un restore ou un login ne transfère jamais un reçu.

## 5. Vérifier les droits et construire le paywall

- Vérifier un entitlement nommé explicitement. Ne pas débloquer l'app parce que « n'importe quel entitlement est actif ».
- Écouter les mises à jour de `CustomerInfo` et rafraîchir après achat/restauration.
- Charger produits, prix et périodes depuis le store/RevenueCat. Ne pas mettre les prix localisés en dur.
- Afficher clairement prix, période, renouvellement automatique, essai et conditions.
- Prévoir chargement, absence d'offering, achat annulé, achat en attente, erreur réseau, succès et droit non activé.
- Rendre le paywall accessible et utilisable sur petit écran.

## 6. Synchroniser avec Convex

Créer un endpoint HTTP/action pour les webhooks RevenueCat. Jamais d'appel RevenueCat réseau dans une mutation.

- Vérifier le secret d'autorisation du webhook avant de traiter le corps.
- Utiliser `event.id` comme clé d'idempotence ; RevenueCat peut réémettre un événement.
- Conserver les identifiants utilisateur et aliases utiles à la résolution d'identité.
- Projeter côté Convex le droit, l'état, l'expiration, la plateforme et la date de mise à jour nécessaires aux contrôles serveur.
- Faire les écritures via `internalMutation` après validation dans l'action/route HTTP.
- Ne jamais faire confiance à un booléen envoyé par le client pour autoriser une fonctionnalité serveur.
- Documenter le délai possible entre achat et webhook, et la stratégie de réconciliation.

## 7. Restauration et gestion

- Fournir un bouton visible « Restaurer les achats ». Ne pas restaurer automatiquement au lancement.
- Après restauration, vérifier l'entitlement attendu et afficher un résultat explicite.
- Donner accès à la gestion de l'abonnement sur la plateforme d'achat ou au Customer Center retenu.
- Gérer renouvellement, annulation avec accès jusqu'à échéance, expiration, remboursement, période de grâce, problème de facturation et transfert de compte.
- Afficher un App User ID copiable dans les réglages/support sans exposer de donnée personnelle.

## 8. Tester et lancer

Lire `references/testing.md`. L'ordre est strict :

1. RevenueCat Test Store pour le flux et les entitlements.
2. Development build Expo ; Expo Go ne valide pas de vrais achats.
3. Sandbox Apple et piste de test Google Play sur appareil/build réel.
4. Webhook et projection Convex.
5. Soumission avec produits visibles et notes de review complètes.

Ne passer en production qu'après confirmation explicite. Vérifier que les builds production utilisent les clés plateformes, jamais la clé Test Store.

## Sortie

Écrire la matrice et les décisions dans `docs/revenuecat.md`, avec : comptes/propriété, catalogue, entitlements, offerings, IDs de produits, identité, webhook, variables d'environnement, cas de test et actions manuelles restantes.

Terminer par exactement : **Configuré**, **Testé**, **À faire dans les consoles**.
