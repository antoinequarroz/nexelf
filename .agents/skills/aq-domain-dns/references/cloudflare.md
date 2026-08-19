# Cloudflare DNS

Documentation officielle : <https://developers.cloudflare.com/dns/get-started/>, <https://developers.cloudflare.com/dns/zone-setups/> et <https://developers.cloudflare.com/dns/dnssec/>.

## Setup primaire

Sur Free/Pro, le setup complet avec Cloudflare comme DNS autoritatif est le parcours courant. Ajouter d'abord la zone dans le compte client, importer/scanner, puis revoir manuellement tous les records avant de changer les nameservers. Le scan n'est pas garanti exhaustif.

## Proxy

- Proxied : trafic HTTP/S traverse Cloudflare ; cache, TLS, WAF et IP origine sont concernés.
- DNS-only : Cloudflare répond seulement en DNS.

Garder DNS-only pour MX et records de validation/service qui ne sont pas du trafic web proxyfiable. Vérifier les consignes du fournisseur pour chaque CNAME.

## DNSSEC et nameservers

Lors d'une arrivée depuis un autre DNS, l'ancien DS/DNSSEC peut invalider la nouvelle zone. Suivre l'ordre officiel : désactiver/retirer l'ancien DS si nécessaire, changer les nameservers, attendre l'activation et la résolution, puis activer DNSSEC Cloudflare et publier le nouveau DS chez le registrar.

Ne jamais préconfigurer au hasard des nameservers Cloudflare avant la création de la zone : utiliser exactement ceux assignés au compte.

## Sécurité

Compte client, MFA, membres nominatifs et token API limité à la zone. Noter les règles proxy/cache/WAF qui peuvent modifier le comportement applicatif, pas seulement les records DNS.
