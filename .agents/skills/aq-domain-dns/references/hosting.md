# Vercel et Infomaniak

## Vercel

Documentation officielle : <https://vercel.com/docs/domains/working-with-domains> et <https://vercel.com/docs/domains/working-with-dns>.

- Ajouter le domaine au projet de la bonne équipe client et satisfaire la vérification de propriété si demandée.
- Utiliser les records proposés actuellement par Vercel pour ce projet ; ne pas figer une IP historique dans la skill.
- Distinguer domaine détenu/visible par l'équipe et domaine assigné au projet.
- Définir canonical apex ou `www` et la redirection dans Vercel/projet.
- Vérifier CAA et certificat automatique.
- Si les DNS restent ailleurs, toute modification se fait chez le fournisseur autoritatif, pas dans un écran Vercel sans autorité.

## Infomaniak

- Distinguer registrar, zone DNS, hébergement web et email : ils peuvent être ensemble ou séparés.
- Lors d'un transfert registrar, sauvegarder tous les records, vérifier contacts, déverrouillage et code Auth/EPP via le canal sécurisé.
- Un transfert de registrar n'impose pas forcément un changement immédiat de nameservers. Préserver la zone active pour éviter une double migration.
- Pour un hébergement ou email Infomaniak, copier uniquement les valeurs données dans le Manager actuel et tester réception/envoi.
- Garder le compte au nom du client, avec facturation et renouvellement surveillés.

Référence transfert : <https://www.infomaniak.com/en/support/faq/447/transfer-your-domain-name-to-infomaniak>.
