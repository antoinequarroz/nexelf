# Services liés au domaine

## Email

- MX : réception, priorité et fournisseur.
- SPF : un seul TXT SPF par nom ; inclure seulement les sources autorisées.
- DKIM : sélecteurs propres à chaque fournisseur.
- DMARC : politique et adresse de rapports.
- Return-Path, tracking et sous-domaines Resend selon la configuration.

Après migration, envoyer et recevoir sur plusieurs fournisseurs de boîte et inspecter les en-têtes.

## Auth, API et paiements

Inventorier URLs Better Auth, OAuth callbacks, cookies, CORS, API, webhooks Stripe/RevenueCat/Resend/Sentry et domaines autorisés. Tester l'ancien callback refusé lorsque c'est voulu et le nouveau accepté.

## Mobile

- iOS Universal Links : domaine HTTPS et fichier `apple-app-site-association` exact, sans redirection problématique.
- Android App Links : domaine HTTPS et `assetlinks.json` avec package/certificat corrects.
- Expo/EAS : scheme, domaines associés, redirect URIs et builds qui embarquent la configuration.

Un changement de domaine peut exiger une nouvelle build store ; un OTA ne peut pas toujours modifier les entitlements/configurations natives.

## SEO et analytics

Mettre à jour canonicals, hreflang, sitemap, robots, Open Graph, Search Console, analytics et consentement. Garder une propriété de domaine indépendante du protocole/sous-domaine quand approprié.
