# Banque de questions — SaaS

Un domaine à la fois. Sur chaque feature évoquée : qui peut le faire, que se passe-t-il si ça échoue, est-ce annulable ?

## 1. Comptes et identité

- Inscription ouverte, sur invitation, ou validée manuellement ?
- Connexion : email + mot de passe, Google, magic link ? (chaque méthode ajoutée = un parcours de récupération de plus)
- Vérification d'email obligatoire avant d'utiliser le produit, ou après ?
- Un utilisateur peut-il changer son adresse email ? (plus coûteux qu'il n'y paraît : ré-vérification, unicité, factures déjà émises)
- 2FA : nécessaire, ou survendu pour ce public ?

## 2. Organisations et rôles

**La question qui change tout : un utilisateur appartient-il à une organisation, ou est-il seul ?**

Si organisations :
- Un utilisateur peut-il appartenir à plusieurs organisations, et basculer entre elles ?
- Qui invite ? Par email, par lien ? Le lien expire-t-il ?
- Quels rôles exactement, et que peut faire chacun ? Lister les permissions, pas les noms de rôles.
- Que devient une organisation quand son dernier admin part ?
- Transfert de propriété possible ?

Le multi-organisation double la surface de test et se rétrofitte très mal. C'est une décision d'architecture, à prendre maintenant.

## 3. Le domaine métier

- Quels sont les objets principaux du produit ? (projets, clients, documents, réservations…)
- Pour chacun : créer, lire, modifier, supprimer — lesquelles sont réellement nécessaires ?
- Suppression : définitive, corbeille, ou archivage ? Pendant combien de temps récupérable ?
- Y a-t-il des relations entre objets ? Que se passe-t-il quand on supprime le parent ?
- Recherche : sur quoi, avec quels filtres ? Une recherche plein texte est un chantier, pas une case à cocher.
- Import de données existantes au démarrage ? Depuis quel format, à quel volume ?
- Export : lequel, dans quel format, pour quel usage réel ?

## 4. Facturation

- Plans, prix, mensuel et annuel ?
- Essai gratuit : avec ou sans carte ? Combien de jours ?
- Plan gratuit permanent ? Limité comment ?
- **Que se passe-t-il quand l'essai se termine sans paiement ?** Blocage, lecture seule, suppression après X jours ?
- **Que se passe-t-il quand un paiement échoue ?** Combien de relances, puis quoi ?
- Un abonnement annulé reste actif jusqu'à la fin de la période payée. Ensuite : lecture seule ou blocage ?
- Quotas par plan : lesquels, et que voit l'utilisateur quand il atteint la limite ?
- Changement de plan en cours de période : proratisé ou à la prochaine échéance ?
- Facture : TVA suisse, mentions légales, numérotation — à valider avec le fiduciaire du client.

## 5. Notifications

- Emails transactionnels : lesquels exactement ? (bienvenue, vérification, reset, invitation, quota atteint, échec de paiement, résumé)
- Notifications dans l'app ? Push ?
- L'utilisateur peut-il en désactiver ? Lesquelles ne sont pas désactivables (légales, sécurité) ?
- Digest quotidien ou hebdomadaire, ou notification immédiate ?

## 6. Onboarding

- Que voit un utilisateur à sa **première connexion**, quand il n'a encore aucune donnée ? (l'état vide est un écran à concevoir, pas un oubli)
- Données de démonstration, visite guidée, ou rien ?
- Combien d'étapes avant qu'il obtienne sa première valeur ? C'est la métrique qui décide de la rétention.

## 7. Administration et support

- Y a-t-il un back-office pour Antoine ou le client ? Que permet-il ?
- Peut-on se connecter en tant qu'un utilisateur pour l'aider ? (très utile, très sensible : à journaliser)
- Comment répondre à « j'ai supprimé quelque chose par erreur » ?
- Statistiques d'usage : lesquelles servent vraiment à décider ?

## Les oubliés — passe 3

À poser systématiquement, aucun client ne les soulève :

- **Suppression de compte** — obligation légale. Que deviennent les données partagées avec d'autres membres ?
- **Export de ses données** par l'utilisateur — obligation RGPD, à chiffrer comme une feature.
- **Deux personnes modifient le même objet en même temps.** Dernier qui écrit gagne, verrou, ou fusion ?
- **Le lien d'invitation d'une personne qui a quitté l'organisation** est-il révoqué ?
- **Que voit un utilisateur dont l'accès vient d'être retiré** pendant qu'il a l'app ouverte ?
- **Limites concrètes** : taille max d'un fichier, nombre max d'objets, longueur max d'un champ. Non décidées = découvertes en production.
- **Sauvegarde et restauration** : qui restaure quoi, en combien de temps ? Testé une fois ?
- **Le client peut-il partir avec ses données ?** À dire dans le contrat, à construire dans le produit.
