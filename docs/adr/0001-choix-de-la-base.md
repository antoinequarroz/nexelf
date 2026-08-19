# 0001. Base mobile Expo et backend Convex

Date : 2026-08-19
Statut : accepté

## Contexte

Nexelf est un copilote personnel IA utilisé quotidiennement sur téléphone. Le produit demande des comptes, des données propres à chaque utilisateur, des notifications, un abonnement et, à terme, des intégrations natives. Le MVP ne traite pas de données sensibles au sens nLPD et n'impose pas de résidence suisse.

## Décision

- Utiliser la base `mobile` AQ : Expo SDK 57, React Native, Expo Router et NativeWind.
- Utiliser Convex pour les données et le backend temps réel.
- Utiliser Better Auth avec Secure Store pour les comptes et sessions.
- Utiliser RevenueCat pour Nexelf Pro ; aucun paiement numérique direct avec Stripe dans l'app.
- Utiliser EAS pour les builds et la distribution iOS/Android.
- Utiliser Maestro pour les tests de bout en bout.

## Raisons

L'usage principal est mobile et bénéficiera des notifications, des intégrations natives et d'une distribution sur les stores. Convex est officiellement intégré à React, convient au temps réel et ne contrevient à aucune contrainte de résidence retenue. EAS est la chaîne de build naturelle d'Expo.

## Alternatives écartées

- Une application web seule ne répond pas à l'usage quotidien et contextuel visé.
- Supabase reste une porte de sortie si les besoins deviennent fortement relationnels ou si une région de données spécifique devient obligatoire.
- Stripe dans l'app est écarté pour les contenus numériques ; les achats intégrés passent par RevenueCat et les stores.

## Conséquences

- La stratégie hors ligne, les permissions et les intégrations doivent être spécifiées avant le code métier.
- Les versions Better Auth restent épinglées et évoluent ensemble.
- La suppression de compte et la restauration des achats devront exister avant soumission aux stores.
- Le compte Convex et les comptes Apple/Google restent au nom d'Antoine pour ce projet personnel.
