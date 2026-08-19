# Choix du stockage

Comparer uniquement avec les limites, régions et tarifs officiels actuels.

## Stockage Convex

Bon candidat lorsque les fichiers sont applicatifs, privés, de taille/volume raisonnables et que simplicité et cohérence avec Convex dominent. Vérifier avant choix : limites d'upload et de téléchargement, quotas, URLs, rétention, sauvegarde/export et coût réel au volume projeté.

Conserver malgré tout une table métier : un identifiant de stockage seul n'exprime ni permission, catégorie, organisation, état ni rétention.

## Stockage objet S3/R2

Bon candidat pour gros volumes, CDN, médias, uploads directs, lifecycle, outils externes ou portabilité. Vérifier :

- région et résidence des données ;
- coût stockage, opérations, egress et transformations ;
- signatures d'upload/download et CORS ;
- versioning, lifecycle, réplication et suppression ;
- compatibilité du SDK avec le runtime serveur choisi ;
- propriétaire des credentials et rotation.

Garder le bucket privé par défaut. Mettre les ressources publiques dans un espace ou préfixe distinct avec une politique explicite, plutôt que de mélanger privé et public par hasard.

## Service média spécialisé

Envisager un service spécialisé lorsque transformations d'images/vidéos, modération, streaming ou optimisation mondiale constituent le cœur du besoin. Chiffrer le coût, le lock-in et l'export. Ne pas l'ajouter uniquement pour redimensionner quelques images.

## Décision

Comparer : usages, volume à 12/36 mois, taille maximale, régions, accès privé, transformations, sauvegarde, migration, coût et capacité du client à reprendre le compte.
