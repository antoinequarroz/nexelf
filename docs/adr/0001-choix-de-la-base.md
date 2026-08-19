# 0001. Base mobile : Expo + Convex + Better Auth + RevenueCat

Date : 2026-08-07
Statut : accepté

## Contexte

App React Native distribuée sur les stores, avec comptes utilisateurs et
abonnements. Backend potentiellement partagé avec une version web.

## Décision

- Expo SDK 57 avec Expo Router, code dans `src/app/`
- NativeWind pour les styles, tokens dans `tailwind.config.js`
- Convex comme backend — **intégration officielle React, contrairement au web**
- Better Auth via `@convex-dev/better-auth` + `@better-auth/expo`
- RevenueCat pour les abonnements
- Maestro pour les tests de bout en bout

## Alternatives écartées

**Stripe dans l'app** — impossible : le contenu numérique passe obligatoirement
par les achats in-app. RevenueCat gère les deux plateformes derrière une seule
API.

**Playwright** — ne pilote pas une app native.

**Supabase** — possible, mais Convex donne un backend partagé avec le web sans
duplication de logique. À reconsidérer si une résidence suisse est exigée :
Convex est alors disqualifié.

## Conséquences

- Sur mobile, l'intégration Convex est **officielle et first-class**, à la
  différence du web en Vue. C'est le point le plus solide de la stack AQ.
- Les versions d'auth sont épinglées et strictement liées entre elles.
- Un cast de type est nécessaire en attendant une correction en amont
  (voir `AGENTS.md`).

## Non vérifié

Aucun build natif n'a été produit. Le typecheck passe hors codegen Convex,
mais le comportement à l'exécution — auth, achats, permissions, hors ligne —
n'a jamais tourné sur un appareil. Voir `README.md`.
