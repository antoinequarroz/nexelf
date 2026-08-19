# Invitations

## États et transitions

Utiliser un cycle explicite : `pending` → `accepted`, `declined`, `revoked` ou `expired`. Seul `pending` non expiré peut être accepté. Une transition terminale ne revient pas en arrière.

## Envoi

- Normaliser l'email sans inventer de règles destructrices propres aux fournisseurs.
- Créer l'invitation et une intention d'envoi atomiquement.
- Envoyer via `aq-email` avec une clé d'idempotence.
- Le lien contient un identifiant/token opaque et une destination autorisée.
- Ne pas inclure de rôle sensible ou d'autorisation utilisable directement depuis les paramètres du lien.

## Acceptation

- Exiger une session Convex validée.
- Prouver la maîtrise de l'adresse invitée selon la politique choisie.
- Vérifier invitation, expiration, organisation active, limite, rôle autorisé et absence d'appartenance.
- Créer l'appartenance une seule fois et marquer l'invitation acceptée dans la même frontière transactionnelle lorsque le modèle le permet.
- Journaliser sans stocker le token.

## Cas obligatoires

- utilisateur déjà membre ;
- invitation existante renvoyée ;
- changement d'email ;
- compte connecté avec une autre adresse ;
- invitation ouverte sur mobile sans app, app fermée ou session expirée ;
- invitant retiré avant acceptation ;
- organisation supprimée/suspendue ;
- plan ou nombre de sièges changé ;
- double acceptation concurrente.

Un message d'erreur public ne doit pas révéler la liste des membres ni confirmer une organisation privée.
