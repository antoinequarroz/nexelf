# Cadrage — Nexelf

## Vision

Nexelf est un copilote personnel IA mobile qui aide chaque utilisateur à devenir progressivement la version de lui-même qu'il souhaite atteindre.

**Promesse :** _Become your next self._

## Utilisateur et contexte

- Usage individuel, principalement sur mobile.
- L'utilisateur confie à Nexelf ses objectifs, priorités, habitudes, contraintes, disponibilités et routines.
- L'application reste proactive sans devenir envahissante et laisse toujours la décision finale à l'utilisateur.

## Action principale

Consulter puis adapter son plan quotidien avec le copilote. Le morning briefing est le point d'entrée principal de la journée.

## Périmètre produit envisagé

- onboarding approfondi ;
- objectifs à court, moyen et long terme ;
- planning quotidien intelligent et priorisation automatique ;
- habitudes et routines ;
- morning briefing et evening review ;
- assistant conversationnel et mémoire personnelle contrôlée ;
- notifications contextuelles ;
- suivi de progression et insights hebdomadaires ;
- connexion calendrier ;
- recommandations adaptatives.

À terme, Nexelf pourra intégrer des données de calendrier, santé, sport, finances et météo.

## Modèle économique

Freemium limité, puis abonnement Nexelf Pro donnant accès à une IA avancée, une mémoire étendue, des intégrations, des automatisations et des analyses avancées. Les achats numériques mobiles passeront par les stores via RevenueCat.

## Contraintes et décisions

- Projet personnel.
- Aucune donnée sensible au sens nLPD prévue dans le MVP.
- Aucune exigence de résidence des données en Suisse.
- Projet documenté et transmissible à un autre développeur à trois ans.
- Langues au lancement : français et anglais, français par défaut.
- Base : `mobile`, dérivée du boilerplate `aq-mobile`.
- Données et backend : Convex.
- Builds et distribution : EAS.
- Spécification produit détaillée reportée après le scaffolding, avant tout code métier.

## Architecture retenue

**Base retenue : `mobile` — Données : `convex` — Hébergement/distribution : `EAS`**
