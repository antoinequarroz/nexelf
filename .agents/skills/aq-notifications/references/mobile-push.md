# Push mobile Expo

## Décisions préalables

- Déterminer si Expo Push Service ou un envoi direct APNs/FCM est justifié.
- Vérifier les versions Expo et les guides officiels actuels avant l'installation.
- Définir les environnements, credentials, bundle/application IDs et propriétaires des comptes stores.
- Concevoir les catégories et deep links avant les payloads.

## Installation et permission

- Identifier une installation indépendamment du compte utilisateur.
- Demander la permission après une explication contextuelle de la valeur.
- Enregistrer le token côté serveur avec plateforme, environnement, utilisateur éventuel et date de dernière confirmation.
- Mettre à jour le token lorsqu'il change ; le dissocier au logout et le rendre inutilisable après suppression de compte.
- Plusieurs appareils par utilisateur sont normaux. Ne pas remplacer aveuglément l'ancien token.

## Contenu

- Mettre le minimum dans le payload.
- Utiliser un identifiant de notification et une destination autorisée plutôt qu'une URL arbitraire.
- Résoudre les données fraîches après ouverture et vérifier à nouveau l'autorisation.
- Prévoir un texte générique pour écran verrouillé si les détails sont sensibles.
- Grouper/collapse uniquement les événements interchangeables ; ne jamais écraser une alerte critique distincte.

## Réception

Tester chaque plateforme avec application :

- au premier plan ;
- en arrière-plan ;
- terminée ;
- ouverte via tap ;
- déconnectée ou sur le mauvais compte ;
- sur un lien expiré ou une ressource supprimée.

Le deep link doit attendre la restauration de session, puis autoriser la ressource côté serveur. Rediriger proprement vers un écran sûr si elle n'est plus accessible.

## Échecs

- Traiter les réponses et reçus selon les garanties actuelles du fournisseur.
- Invalider les tokens signalés comme non enregistrés.
- Borner les retries et respecter les limites de débit.
- Ne pas réessayer une erreur permanente.
- Afficher les taux d'échec techniques sans exposer les messages.
