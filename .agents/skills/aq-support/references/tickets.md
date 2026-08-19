# Modèle de tickets

## Entités possibles

N'ajouter que ce que le produit utilise réellement :

- `supportTickets` : référence, demandeur, organisation, sujet, catégorie, état, priorité, assigné, dates ;
- `supportMessages` : ticket, auteur, visibilité, corps, dates ;
- `supportAttachments` : message, fichier privé et état de scan ;
- `supportEvents` : audit des transitions et accès sensibles ;
- `supportSavedReplies` : réponses relues, langue et équipe propriétaire.

## États

Préférer un workflow court : `open`, `waiting_on_support`, `waiting_on_customer`, `resolved`, `closed`. N'ajouter `triaged`, `escalated` ou d'autres états que s'ils déclenchent une responsabilité opérationnelle distincte.

Une réponse client sur un ticket résolu peut le rouvrir pendant une période définie. Après clôture définitive, proposer une nouvelle demande liée plutôt que modifier indéfiniment l'historique.

## Permissions

- Le demandeur peut lire les messages publics de ses tickets autorisés.
- Les règles d'organisation déterminent si tous les admins, seulement le demandeur ou une équipe peuvent voir un ticket.
- Les agents support voient uniquement les files auxquelles ils sont affectés.
- Les notes internes et données d'audit ne passent jamais dans les modèles publics.
- Toute pièce jointe réutilise l'autorisation du message et du ticket au moment de chaque accès.

## Concurrence

Prévoir deux agents répondant ou changeant l'état en même temps. Utiliser version/date de mise à jour, avertissement de présence ou vérification atomique selon l'impact. Dédupliquer les réponses créées depuis un webhook email.
