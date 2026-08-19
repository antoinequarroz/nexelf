# Supabase, Postgres et Directus

## Supabase

Documentation officielle : <https://supabase.com/docs/guides/platform/backups>.

- Vérifier le plan, la rétention réelle et si le projet utilise sauvegardes quotidiennes ou PITR.
- Les sauvegardes de base ne restaurent pas automatiquement les objets Supabase Storage : sauvegarder les fichiers et la configuration des buckets séparément.
- Prévoir la reconfiguration des fonctions, secrets, paramètres Auth, clés, extensions, webhooks, Realtime et autres éléments non inclus.
- Une restauration peut rendre le projet indisponible ; tester vers un nouveau projet lorsque possible.
- Conserver un dump logique hors fournisseur si la portabilité ou la perte du compte fait partie des scénarios.
- Vérifier rôles et mots de passe personnalisés après restauration.

## Postgres auto-hébergé

Choisir dump logique, sauvegarde physique + WAL/PITR, ou combinaison selon RPO, taille et version. Tester avec la même version majeure et les extensions nécessaires. Une copie du volume en fonctionnement n'est pas automatiquement cohérente.

Sauvegarder aussi rôles, permissions, extensions, jobs, configuration serveur et chiffrement. Utiliser un compte de sauvegarde limité, chiffrer le transport et la destination, surveiller chaque exécution.

## Directus

Le snapshot de schéma Directus documente collections, champs et relations ; il ne remplace pas la sauvegarde de la base ni des fichiers. Conserver ensemble :

- dump/PITR de la base ;
- stockage des uploads avec structure et métadonnées ;
- version exacte de Directus et extensions ;
- snapshot de schéma compatible ;
- variables et configuration via gestionnaire de secrets.

Tester une restauration sur les mêmes versions de Directus et du moteur de base avant toute montée de version.
