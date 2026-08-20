# Support mobile

## Canaux

La story 13 livre un centre d’aide embarqué, un contact authentifié et le signalement d’une réponse IA. Le suivi se limite à une confirmation enregistrée, une référence et le statut `reçu`. Il n’existe ni chat, ni faux dashboard agent, ni promesse de réponse humaine.

L’email est désactivé tant qu’un fournisseur, une boîte surveillée, un responsable et un remplaçant ne sont pas configurés et testés. La mutation Convex ne réalise aucun appel réseau.

## Parcours

Le centre d’aide couvre compte, données, abonnement et fonctionnement IA. La recherche reste locale. Le formulaire conserve un brouillon chiffré par compte avec SecureStore ; il l’efface après envoi et ignore tout brouillon vieux de plus de 30 jours.

Le diagnostic est désactivé par défaut. Avant consentement, l’écran détaille la liste exhaustive : version de l’app, plateforme, version du système et locale. Il exclut contenu, historique, contacts, position, photos, identifiants, jetons et logs complets.

## Workflow

Une demande devient uniquement `recu`. La clé d’opération rend les retries idempotents. Le serveur autorise cinq contacts et dix signalements par heure et par profil. Une réponse ne peut être signalée que si elle appartient au profil et possède le rôle assistant.

## Permissions

Toutes les fonctions publiques appellent `exigerProfil` avant lecture. La confirmation vérifie le propriétaire. Un refus de cible reste générique. Aucun contenu de support ou diagnostic n’est envoyé à Sentry ou aux analytics.

## Notifications

Aucune notification externe dans cette story. Une intégration future devra utiliser une action interne, dédupliquer les retries et ne jamais faire dépendre l’enregistrement de l’email.

## SLA

Aucun SLA ni délai humain n’est affiché. « Reçu » signifie seulement que Convex a enregistré la demande.

## Exploitation

- Tests unitaires : validation et expiration du brouillon.
- Backend : identité, autorisation de la cible, idempotence, validation fermée et limites serveur.
- Maestro : centre d’aide, restauration du brouillon, diagnostic facultatif, confirmation et signalement.
- Contrôles manuels requis : VoiceOver, TalkBack, texte agrandi et session expirée.

## Reste manuel

- Désigner le propriétaire du support et son remplaçant.
- Valider les textes français/anglais et la durée de conservation serveur.
- Configurer puis tester une boîte surveillée avant tout email.
- Exécuter les passages VoiceOver et TalkBack sur les versions supportées.
