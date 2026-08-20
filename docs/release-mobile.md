# Première distribution TestFlight — Nexelf

Statut : préparation  
Canal : TestFlight interne  
Plateforme : iOS  
Version marketing : 1.0.0  
Numéro de build : géré à distance et incrémenté par EAS  
Profil : `production`  

## Objectif

Distribuer un premier binaire de travail à Antoine via TestFlight afin de valider sur appareil le design « Élan lumineux », la navigation et les parcours principaux. Cette distribution n'est pas une publication publique ni une validation de mise en production.

## Source et backend

- Dépôt : `antoinequarroz/nexelf`, branche `main`.
- Backend : déploiement Convex de développement actuellement compatible avec le binaire.
- URL Convex publique injectée par le profil EAS ; aucun secret serveur n'entre dans le bundle.
- RevenueCat reste indisponible tant que les clés et produits stores ne sont pas configurés.
- OpenAI reste en mode manuel tant que la clé serveur n'est pas enregistrée.

## Vérifications automatisées

- `expo-doctor` : 21 contrôles sur 21.
- TypeScript et lint.
- Suite Vitest.
- Validation du manifest média.
- Déploiement des fonctions Convex.

## Limites acceptées pour ce TestFlight

- L'icône et le splash définitifs sont bloqués par l'absence du maître vectoriel du logo original.
- Les images générées restent en attente d'approbation et utilisent le fallback dans l'application.
- Sentry n'a pas encore ses variables d'upload de source maps.
- Achats réels, emails, OAuth Apple/Google, IA réelle et notifications distantes ne sont pas validés.
- Les informations légales et métadonnées App Store complètes restent nécessaires avant toute publication publique.

## Tests sur le binaire

1. Installation et premier démarrage.
2. Inscription, connexion, déconnexion et suppression de compte.
3. Onboarding et création du premier plan.
4. Accueil, objectifs, planning, revue, progression et copilote manuel.
5. Hors ligne, reconnexion et redémarrage.
6. Notifications locales et ouverture profonde.
7. Grande taille de texte, VoiceOver et réduction des animations.
8. Vérification qu'aucun achat trompeur n'est proposé sans offering.

## Rollout et retour arrière

- Groupe interne uniquement pour la première build.
- Aucun OTA de production configuré.
- En cas de défaut bloquant : retirer la build du groupe, corriger, incrémenter le numéro et soumettre un nouveau binaire.

## Reste manuel

- Authentification Apple Developer et création/validation des credentials.
- Traitement App Store Connect puis ajout d'Antoine comme testeur interne.
- Exécution et consignation des tests sur l'iPhone réel.
- Fourniture du logo maître et approbation des images.
