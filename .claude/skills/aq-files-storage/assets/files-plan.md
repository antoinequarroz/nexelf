# Plan de stockage de fichiers

## Contexte

- Produit et plateformes :
- Utilisateurs/organisations :
- Région et marchés :
- Volumes actuels, 12 mois et 36 mois :
- RPO/RTO :

## Matrice

| Catégorie | Qui envoie | Qui lit | Visibilité | Formats | Taille max | Quota | Transformation/scan | Rétention | Suppression |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |

## Fournisseur

- Solution retenue :
- Alternatives rejetées :
- Région :
- Propriétaire du compte :
- Coût projeté :
- Limites vérifiées :
- Export/migration :

## Modèle et flux

- Métadonnées Convex :
- Clé d'objet :
- Autorisation upload :
- Finalisation/validation :
- Accès public/privé :
- URLs signées :
- Nettoyage des incomplets/orphelins :

## UX/UI

- Sélection/caméra/drag-and-drop :
- Progression, annulation et retry :
- Aperçu/recadrage/texte alternatif :
- Erreurs et quota :
- Mobile hors ligne :

## Cycle de vie

- Remplacement/version :
- Suppression compte/organisation :
- Dérivés et cache CDN :
- Sauvegarde/restauration :
- Rétention et purge :

## Tests

- [ ] Autorisation et isolation organisation
- [ ] Validation type/taille/contenu
- [ ] Upload interrompu, double et concurrent
- [ ] Quota sous concurrence
- [ ] URL privée expirée/révoquée
- [ ] Remplacement sans perte
- [ ] Orphelins et nettoyage
- [ ] Suppression et restauration
- [ ] Aucun secret ou contenu sensible exposé

## Reste manuel

- Compte et credentials :
- DNS/CORS :
- Appareils/navigateurs à tester :
- Validation sécurité/juridique :
