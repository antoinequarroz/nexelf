# Convex

Documentation officielle : <https://docs.convex.dev/database/backup-restore> et <https://docs.convex.dev/database/import-export/import>.

## Couverture

Une sauvegarde Convex est un snapshot cohérent des documents et peut inclure le stockage de fichiers. Vérifier explicitement cette option. Elle n'inclut pas le code, les variables d'environnement, la configuration du déploiement ni les fonctions planifiées en attente.

Les sauvegardes périodiques et leurs rétentions dépendent du plan. Une sauvegarde disponible uniquement quelques jours ne constitue pas seule une archive durable : télécharger une copie chiffrée hors du compte si la politique l'exige.

## Restauration

- Une restauration de déploiement remplace les données existantes : sauvegarder l'état courant avant de commencer.
- Tester d'abord vers un autre déploiement de la même équipe ou via import du ZIP dans une cible isolée compatible.
- Ne pas modifier manuellement le ZIP avant import.
- Restaurer séparément code connu, variables, auth/config et jobs.
- Les fichiers déjà présents peuvent avoir un comportement différent des documents lors d'une restauration ; vérifier l'état final et les références `_storage`.
- Si un export continu est utilisé, suivre la procédure officielle de resynchronisation après import/restauration.

## Vérifications

Comparer tables, documents, références, fichiers et checksums disponibles. Déployer une version connue du code, rétablir les variables via le canal sécurisé, puis tester Better Auth et les parcours critiques sans effets externes.
