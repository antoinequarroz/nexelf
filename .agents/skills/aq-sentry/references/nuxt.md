# Sentry sur Nuxt

## Surfaces

Vérifier séparément le navigateur et le serveur Nitro. Une erreur reçue côté client ne prouve pas que les erreurs SSR/API arrivent, et inversement.

## Configuration

- Utiliser le module/SDK Nuxt recommandé pour les versions courantes.
- Garder les fichiers d'initialisation client et serveur explicites.
- Lire DSN, environnement et release depuis la configuration d'exécution appropriée.
- Le token d'upload des source maps reste au build/CI ; il n'entre jamais dans `runtimeConfig.public`.
- Vérifier le preset de déploiement et les chemins d'artefacts réellement produits avant de configurer l'upload.

## Cas de test

- Erreur navigateur déclenchée depuis une route de test protégée ou temporaire.
- Erreur SSR/API déclenchée côté serveur.
- Stack trace minifiée résolue sur une build preview ou production contrôlée.
- Navigation et formulaire continuent d'afficher une erreur utilisateur traduite ; Sentry ne remplace pas la gestion UX.
