---
name: aq-files-storage
description: >-
  Cadre, choisit, implémente et valide le stockage de fichiers d'un CMS, SaaS
  ou backend mobile AQ : uploads web/Expo, images, avatars, PDF, pièces jointes,
  stockage Convex ou objet, accès public/privé, URLs signées, permissions par
  organisation, validation, quotas, optimisation, suppression, rétention,
  antivirus, sauvegarde et migration. À utiliser dès qu'un utilisateur ou un
  admin peut envoyer, consulter, remplacer ou supprimer un fichier. Travaille
  avec aq-organizations, aq-pricing, aq-media, aq-backup et aq-nlpd.
---

# Stockage de fichiers AQ

Traiter chaque fichier envoyé par un utilisateur comme non fiable et chaque URL comme une décision d'accès. Choisir le stockage après avoir compris le produit, pas d'après l'habitude.

## 1. Cadrer progressivement

Lire `AGENTS.md`, le schéma Convex, les rôles, les plans, l'hébergement, les sauvegardes et les parcours web/mobile. Poser un bloc à la fois.

### Usages

- Qui envoie quoi : avatar, image éditoriale, PDF, justificatif, export, vidéo ou pièce jointe ?
- Qui peut consulter, remplacer, partager, télécharger et supprimer chaque catégorie ?
- Le fichier est-il public, privé, interne à une organisation ou partageable temporairement ?
- Quelle valeur maximale réaliste pour taille, quantité, fréquence et durée de conservation ?
- Une transformation est-elle nécessaire : miniature, compression, conversion, OCR, scan antivirus ?

### Produit et UX/UI

- Upload unique ou multiple, glisser-déposer, caméra/mobile, reprise après interruption ?
- Faut-il aperçu, recadrage, ordre, légende, texte alternatif et progression individuelle ?
- Que se passe-t-il si l'utilisateur ferme l'écran, perd le réseau, renvoie le même fichier ou dépasse son quota ?
- Le remplacement conserve-t-il le lien, l'historique ou crée-t-il une nouvelle version ?
- Quelle erreur compréhensible afficher pour type, poids, quota, réseau ou traitement refusé ?

### Exploitation

- Quels marchés et contraintes de résidence des données ?
- Quels RPO/RTO, coûts, volumes futurs et exigences d'export/migration ?
- Le client possède-t-il le compte fournisseur et la facturation ?

## 2. Écrire la matrice des fichiers

Copier `assets/files-plan.md` vers `docs/files-storage.md`. Définir pour chaque catégorie : propriétaire, visibilité, formats autorisés, taille, quota, transformation, rétention, suppression, sauvegarde et tests.

Ne pas utiliser une règle globale permissive. Obtenir la validation des usages et de la matrice avant l'implémentation.

## 3. Choisir le stockage

Lire `references/providers.md` et vérifier les documentations officielles et tarifs actuels avant de décider.

- Préférer le stockage Convex pour des fichiers applicatifs privés simples, modestes et étroitement liés aux données Convex, si ses limites et coûts vérifiés conviennent.
- Préférer un stockage objet compatible S3/R2 lorsque volumes, gros médias, egress, CDN, lifecycle, intégration externe ou portabilité le justifient.
- Garder les médias de build d'une vitrine dans le dépôt ou son pipeline via `aq-media`; ne pas ajouter un service d'upload sans éditeur ni compte.
- Séparer métadonnées métier et octets : Convex reste généralement la source des permissions, appartenances et états, même si l'objet vit ailleurs.

Documenter le fournisseur, la région, la propriété du compte, les coûts, les limites, la stratégie de migration et les responsabilités. Créer une ADR si le choix engage durablement l'architecture.

## 4. Concevoir le modèle et le cycle de vie

Conserver une entrée de fichier avec au minimum :

- propriétaire utilisateur et organisation selon le produit ;
- catégorie métier et ressource liée ;
- identifiant opaque de l'objet, jamais une clé client arbitraire ;
- nom d'affichage séparé de la clé de stockage ;
- taille, type déclaré, type détecté si nécessaire et checksum ;
- état `pending`, `ready`, `rejected`, `deleting` ou `deleted` selon les besoins ;
- dates, auteur et politique de rétention.

Utiliser un flux explicite : autoriser → transférer → finaliser/vérifier → rendre accessible. Nettoyer les uploads incomplets et objets orphelins par job paginé et observable.

Ne jamais remplacer ou supprimer définitivement l'ancien objet avant que le nouveau soit validé et référencé. Définir une compensation pour chaque échec entre stockage et base de données.

## 5. Sécuriser upload et lecture

Lire `references/security.md`.

- Authentifier et autoriser côté serveur avant d'émettre toute URL ou permission d'upload.
- Générer côté serveur une clé opaque bornée au bon préfixe, type, taille et délai ; ne jamais accepter un chemin de bucket brut depuis le client.
- Valider extension, MIME déclaré, signature/magic bytes lorsque le risque le demande, taille réelle et structure du fichier.
- Refuser les formats actifs inutiles. Ne jamais rendre du HTML/SVG utilisateur dans le même contexte de confiance que l'application sans traitement adapté.
- Servir le privé avec une autorisation fraîche ou une URL signée courte. Une URL difficile à deviner n'est pas une permission.
- Forcer des en-têtes de téléchargement sûrs et un nom de fichier nettoyé.
- Scanner les documents provenant d'utilisateurs quand ils seront ouverts par d'autres personnes ou systèmes sensibles ; mettre en quarantaine jusqu'au résultat.

Toutes les fonctions publiques Convex vérifient identité, appartenance, capacité et lien de la ressource avant la moindre divulgation de métadonnées ou URL.

## 6. Appliquer quotas et facturation

- Définir avec `aq-pricing` les limites par fichier, utilisateur, organisation, période et stockage total réellement utiles.
- Vérifier le quota côté serveur avant l'autorisation, puis réconcilier avec la taille finale ; réserver temporairement l'espace pour éviter les uploads concurrents.
- Ne pas faire confiance à un compteur client ou à une taille déclarée.
- Décider du comportement au downgrade : bloquer les nouveaux uploads, laisser télécharger/supprimer, proposer export ; ne pas supprimer silencieusement.
- Mesurer stockage actif, uploads incomplets et objets orphelins sans exposer les noms ou contenus.

## 7. Construire l'expérience web et mobile

- Afficher formats, taille et quota avant sélection.
- Montrer progression par fichier, annulation et résultat final réel ; ne pas annoncer la réussite avant finalisation serveur.
- Préserver la saisie de formulaire si un upload échoue.
- Permettre retry sans créer de doublon et gérer réseau lent/hors ligne sur Expo.
- Prévoir clavier, lecteur d'écran, focus, contraste, légendes et texte alternatif pour les médias publiés.
- Ne jamais afficher brièvement un fichier privé d'une ancienne organisation après un switch.
- Sur mobile, utiliser des URI locales temporaires correctement et ne pas conserver de copie sensible plus longtemps que nécessaire.

Appeler `aq-media` pour les transformations éditoriales, variantes responsives et qualité visuelle.

## 8. Suppression, confidentialité et sauvegarde

- Distinguer retrait de la ressource, suppression logique, suppression physique, expiration d'URL et purge des sauvegardes.
- Définir ce qui arrive au fichier lors de suppression de compte, organisation, contenu ou abonnement.
- Révoquer immédiatement les nouveaux accès même si la purge physique est différée.
- Mettre à jour ou invalider CDN et dérivés lors d'un remplacement/suppression.
- Documenter rétention et sous-traitant avec `aq-nlpd` et `aq-legal-pages`.
- Vérifier avec `aq-backup` si les objets sont couverts, comment les restaurer avec leurs métadonnées et comment éviter une restauration publique accidentelle.

## 9. Tester les frontières

Tester au minimum :

- non authentifié, mauvais rôle et autre organisation ;
- ID, clé, URL, type, extension et nom falsifiés ;
- fichier vide, trop gros, tronqué, corrompu, polyglotte ou format actif refusé ;
- upload double, concurrent, annulé, hors ligne et finalisation répétée ;
- quota atteint pendant plusieurs uploads simultanés ;
- objet présent sans métadonnée et métadonnée sans objet ;
- URL privée expirée, partagée, révoquée et utilisée après retrait du membre ;
- remplacement échoué sans perte de l'ancien fichier ;
- suppression, dérivés/CDN, rétention et restauration isolée ;
- token, clé fournisseur, chemin interne et contenu personnel absents des logs et du client.

Terminer par `aq-audit` pour les uploads publics ou les documents sensibles.

## Résultat attendu

- matrice de fichiers et UX validées ;
- fournisseur et région documentés ;
- autorisations serveur et isolation multi-tenant ;
- validation réelle des uploads ;
- quotas résistants à la concurrence ;
- états incomplets, retries et orphelins maîtrisés ;
- suppression, rétention, sauvegarde et migration définies ;
- tests de sécurité réussis.

Terminer par **Usages**, **Fournisseur**, **Modèle**, **Accès**, **Quotas**, **Cycle de vie**, **Tests**, **Reste manuel**.
