# Resend et délivrabilité

Utiliser la documentation officielle actuelle : <https://resend.com/docs>.

## Domaine

Resend recommande un sous-domaine pour isoler la réputation. La vérification configure SPF et DKIM. Copier les valeurs du dashboard : elles dépendent du domaine et de la région.

DMARC dépend de SPF/DKIM. Commencer avec une politique d'observation et une adresse de rapports surveillée, inventorier toutes les sources d'envoi du domaine, puis passer progressivement à `quarantine` ou `reject`. Ne jamais durcir sans tester les autres services du client.

## Idempotence et retries

Utiliser une clé d'idempotence par requête d'envoi. Resend déduplique actuellement les clés pendant une fenêtre limitée : conserver une contrainte métier côté application pour empêcher un renvoi tardif. Les retries réutilisent exactement la même clé.

## Webhooks

- Vérifier la signature avant de parser et d'agir.
- Dédupliquer via l'identifiant Svix de l'événement.
- Répondre vite, puis traiter de manière asynchrone.
- Accepter livraison dans le désordre et répétée.
- Ne souscrire qu'aux événements réellement exploités.

Références : <https://resend.com/docs/dashboard/domains/introduction>, <https://resend.com/docs/dashboard/domains/dmarc>, <https://resend.com/docs/dashboard/emails/idempotency-keys> et <https://resend.com/docs/webhooks>.
