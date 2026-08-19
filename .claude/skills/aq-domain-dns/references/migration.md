# Migration de domaine ou DNS

## Trois opérations différentes

- Transfert registrar : change l'entreprise qui gère l'enregistrement et le renouvellement du domaine.
- Changement DNS autoritatif : change les nameservers et l'endroit où vit la zone.
- Changement d'hébergement : change la destination de certains records web/API.

Ne pas les confondre ni les combiner sans raison.

## Plan sans coupure

1. Inventorier et exporter la source.
2. Créer la cible et tous les records, y compris email/vérifications.
3. Préparer certificats, domaine dans l'hébergeur et application.
4. Baisser les TTL à l'avance si possible.
5. Traiter DNSSEC selon l'ordre fournisseur.
6. Basculer un seul niveau à la fois.
7. Vérifier depuis plusieurs résolveurs et réseaux.
8. Maintenir source et rollback pendant la fenêtre.
9. Réactiver DNSSEC/augmenter TTL après stabilité.

## Changement de domaine SEO

Créer un mapping de toutes les URLs utiles, redirections permanentes directes, canonical vers le nouveau domaine et sitemap propre. Vérifier les deux propriétés Search Console, liens externes prioritaires et 404. Conserver l'ancien domaine : l'abandonner permettrait à un tiers de récupérer trafic, emails ou confiance.

## Incident

Si la résolution casse, arrêter les modifications, comparer nameservers/DS/zone publique à l'inventaire, identifier la couche fautive et appliquer le rollback préparé. Ne pas alterner plusieurs valeurs pendant que les caches contiennent encore les anciennes.
