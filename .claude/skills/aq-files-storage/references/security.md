# Sécurité des fichiers

## Menaces à couvrir

- accès horizontal à un fichier d'une autre organisation ;
- écrasement ou suppression d'une clé arbitraire ;
- type déclaré différent du contenu ;
- fichier actif exécuté dans le contexte de l'application ;
- archive décompressée démesurée ou parser vulnérable ;
- malware transmis à un admin ou à un autre utilisateur ;
- URL privée durable copiée hors du produit ;
- métadonnées EXIF ou nom de fichier divulguant des informations ;
- déni de service par taille, quantité ou uploads incomplets.

## Défenses

- Autoriser l'opération et générer identifiant/chemin côté serveur.
- Borner taille et quantité avant transfert, puis vérifier la taille finale.
- Utiliser une allowlist de formats par catégorie métier.
- Détecter le type depuis le contenu lorsque l'impact justifie le coût.
- Réencoder les images lorsque cela fait partie du pipeline ; retirer les métadonnées non nécessaires.
- Mettre fichiers suspects en quarantaine, sans URL de lecture utilisateur.
- Servir les contenus actifs comme téléchargement ou depuis une origine isolée avec en-têtes stricts.
- Ne jamais extraire une archive sans limites de nombre, taille totale, profondeur et chemins.
- Rendre les signatures courtes, bornées à une opération et inutiles après suppression/révocation si le niveau de risque l'exige.
- Limiter débit et concurrence par utilisateur/organisation.

## Noms et URLs

Conserver le nom original uniquement comme donnée d'affichage nettoyée. Générer une clé opaque sans concaténer directement email, organisation, nom ou chemin client. Fixer `Content-Disposition`, `Content-Type` et les règles de cache selon public/privé.

## Antivirus

Le scan devient fortement pertinent si des utilisateurs envoient des documents que d'autres téléchargeront, si des fichiers arrivent par intégration externe, ou si un traitement automatique ouvre leur contenu. Concevoir `pending_scan → ready/rejected`, signature des callbacks, timeout, retry et suppression de quarantaine.
