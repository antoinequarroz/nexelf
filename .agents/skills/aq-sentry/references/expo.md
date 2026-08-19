# Sentry sur Expo / React Native

## Propriété et builds

Associer le projet Sentry à l'app, aux bundle identifiers et aux profils EAS corrects. Les source maps et symboles dépendent du build natif : un simple démarrage Expo ne valide pas la chaîne de production.

## Configuration

- Installer avec `npx expo install @sentry/react-native` pour respecter la compatibilité Expo.
- Configurer le plugin Expo et les variables de build selon la documentation Sentry courante.
- Distinguer développement, preview interne et production.
- Associer release/version et build number/versionCode.
- Uploader les source maps JS et les artefacts/symboles natifs requis par iOS/Android.
- Limiter les breadcrumbs contenant URLs, saisies, notifications ou données personnelles.

## Cas de test

- Erreur JavaScript sur development build.
- Crash natif contrôlé uniquement dans un environnement de test adapté.
- Erreur iOS et Android avec release/build exacts.
- Mode hors ligne : l'événement est envoyé après reconnexion sans bloquer l'app.
- Vérifier que l'identifiant utilisateur change ou disparaît correctement après logout.
