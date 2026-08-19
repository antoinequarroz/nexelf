# Étape 5 — Sentry

Le meilleur rapport effort/valeur de tout l'init. Vingt minutes, et tu apprends les bugs avant le client.

## Mise en place

- Web : `@sentry/nuxt`. Mobile : `@sentry/react-native`.
- Créer le projet côté Sentry si l'utilisateur a le CLI connecté, sinon lui demander le DSN et le noter dans « à toi de jouer ».
- DSN en variable d'environnement, jamais en dur.
- Environnements séparés : `development`, `preview`, `production`. Sans ça, tes erreurs de dev noient les vraies.
- Source maps uploadées au build, sinon les traces sont illisibles.
- Taux d'échantillonnage des traces bas au départ (0.1). On l'augmente si besoin, on ne paie pas pour du bruit.

## Filtrage — à faire tout de suite

Sans filtre, Sentry devient un flux qu'on ignore, ce qui est pire que pas de Sentry.

- Ignorer les erreurs d'extensions de navigateur et les erreurs réseau annulées.
- Ignorer les erreurs de bots et de crawlers.
- Ne **pas** envoyer de données personnelles dans les contextes. Vérifier `sendDefaultPii` et scrubber ce qui vient des formulaires.

## Conformité

Sentry est un sous-traitant. Si le projet a des contraintes nLPD :
- choisir la **région européenne** à la création du projet Sentry, c'est irréversible ;
- l'ajouter à la liste des sous-traitants dans `docs/cadrage.md`.

## Validation obligatoire

Déclencher une erreur volontaire et **vérifier qu'elle arrive dans le dashboard**. Une intégration Sentry non testée est une intégration qui ne marche pas — on ne le découvre qu'en production.

Retirer l'erreur de test avant de commiter.
