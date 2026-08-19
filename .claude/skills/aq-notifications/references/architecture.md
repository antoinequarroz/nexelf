# Architecture de notifications

## Modèle recommandé

Utiliser les concepts utiles au projet, sans imposer toutes les tables :

- `notificationEvents` : fait métier immuable ou référence vers celui-ci ;
- `notifications` : message logique destiné à un utilisateur dans une organisation ;
- `notificationDeliveries` : tentative par canal et fournisseur ;
- `notificationPreferences` : choix par utilisateur, catégorie et canal ;
- `pushInstallations` : appareils et tokens push révocables.

Le message logique ne doit pas être confondu avec ses tentatives de livraison. Un email peut échouer puis réussir sans créer une seconde notification in-app.

## Pipeline

1. La mutation métier valide l'autorisation et applique le changement.
2. Elle enregistre atomiquement un événement ou une intention avec une clé stable.
3. Un job/action résout les destinataires et préférences.
4. Il crée la notification logique et les livraisons nécessaires.
5. Chaque canal livre avec retries bornés et backoff.
6. Les retours fournisseur mettent à jour la livraison après vérification et déduplication.

Si l'événement et l'intention ne peuvent pas être atomiques, prévoir une réconciliation. Éviter le dual write vers Convex et un fournisseur externe.

## Idempotence

Composer la clé depuis des identifiants stables, par exemple :

`eventType:eventId:recipientId:variant`

Ajouter le canal uniquement pour la livraison. Créer un index permettant de refuser atomiquement une seconde notification avec la même clé.

## États

Garder peu d'états et distinguer :

- état logique : créée, lue, archivée, action accomplie ;
- état de transport : planifiée, envoyée, livrée, erreur temporaire, erreur définitive ;
- état d'installation push : actif, invalide, révoqué.

Ne pas promettre « livré » si le fournisseur confirme seulement l'acceptation de la requête.

## Rétention

Définir séparément la durée des notifications visibles, des journaux de livraison et des événements d'audit. Nettoyer par job paginé. Ne pas conserver indéfiniment le contenu pour faciliter le support.
