# État du projet et services

## Vitrine

- Dépôt Git et tags/releases.
- Contenu Nuxt Content, traductions et médias originaux.
- Variables de build reproductibles via gestionnaire de secrets.
- Domaine, zone DNS exportable, redirects et configuration d'hébergement.
- Formulaires, Resend, analytics et Sentry : propriété et procédure de recréation.

## CMS et SaaS

Ajouter base, auth, uploads, journal d'audit, jobs, webhooks, quotas et configuration des fournisseurs. Les données de Stripe/RevenueCat restent chez ces fournisseurs, mais conserver dans l'application leurs identifiants stables et documenter la resynchronisation. Ne jamais restaurer un ancien état de facturation comme vérité sans reconciliation avec le fournisseur.

## Mobile

Sauvegarder le backend comme pour SaaS/CMS, plus :

- configuration Expo/EAS et identifiants de projets ;
- certificats, clés de signature et accès stores dans leurs coffres prévus ;
- bundle identifiers, universal/app links, profils et secrets CI ;
- mapping RevenueCat entre apps, produits, offerings et entitlements ;
- versions publiées et configuration OTA.

Les données uniquement locales sur un appareil ne sont récupérables que si le produit prévoit synchronisation/export. Le dire explicitement au client et à l'utilisateur.

## Secrets

Ne pas déposer un `.env` brut dans une archive ordinaire. Conserver secrets et codes de récupération dans un gestionnaire chiffré avec accès de secours testé. Documenter les noms, propriétaires et procédures de rotation sans recopier leurs valeurs dans `docs/backup.md`.
