# AQ Mobile

Base de démarrage `mobile` du [kit AQ](https://github.com/antoinequarroz/aq-kit).
Expo, Convex, Better Auth, RevenueCat.

## Lancer

```bash
pnpm install
npx convex dev          # OBLIGATOIRE : sans lui, tsc échoue
npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
npx convex env set SITE_URL aqmobile://
cp .env.example .env.local   # puis remplir
pnpm start
```

## Vérifier

```bash
pnpm check    # tsc + expo lint
pnpm e2e      # Maestro
pnpm doctor   # expo-doctor
```

## Après le clonage

1. Renommer dans `package.json`, `app.json` (`name`, `slug`, `scheme`,
   `bundleIdentifier`, `package`)
2. Remplacer le `scheme` `aqmobile` partout : `app.json`,
   `src/lib/auth-client.ts`, `convex/auth.ts`, `.maestro/*.yaml`
3. Adapter les tokens dans `tailwind.config.js` et `src/lib/theme.ts`
4. Adapter `convex/schema.ts` au domaine réel
5. Créer le projet Sentry (**région EU** si contrainte nLPD, irréversible)
6. Configurer les produits RevenueCat sur les deux plateformes
7. Trancher **avant de coder** : hors ligne, permissions, propriété des
   comptes stores

## Les trois questions qui changent l'architecture

À trancher pendant `spec-product`, pas après :

1. **Hors ligne** — erreur, lecture seule en cache, ou création avec
   synchronisation différée ? Répondre « on verra » ici, c'est accepter de
   réécrire la couche de données.
2. **Permissions** — demandées quand l'utilisateur comprend pourquoi, jamais
   au premier lancement. L'app doit rester utilisable si elles sont refusées.
3. **Comptes App Store et Google Play** — au nom du client, pas du prestataire.
   À trancher avant de commencer.

## Ce qui n'est pas vérifié dans cette base

**Aucun build natif n'a été produit.** Le typecheck passe (hors codegen
Convex), le code suit les règles du kit, mais rien n'a tourné sur un appareil :
ni l'auth, ni les achats, ni les permissions, ni le hors ligne.

Ton premier vrai test : `npx convex dev`, puis `pnpm start` avec Expo Go ou
un build de développement.

Compter plusieurs jours de revue au planning des stores, davantage pour une
première soumission.

## Les skills disponibles

Ce boilerplate embarque **40 skills AQ**. Leur source de vérité se trouve dans `aq-kit`; les copies locales servent à Codex et Claude Code.

- Avec Codex : demander explicitement `Utilise $aq-nom-du-skill…`, ou décrire la tâche ; le skill correspondant est chargé automatiquement.
- Avec Claude Code : utiliser `/aq-nom-du-skill` ou décrire le besoin.
- Les fichiers sont dans `.agents/skills/` pour Codex et `.claude/skills/` pour Claude.
- Ne pas lancer tous les skills sur chaque projet : utiliser uniquement ceux qui correspondent au besoin et au stade du projet.
- Les changements durables se font dans `aq-kit/skills/`, puis sont resynchronisés ; ne pas modifier les copies générées ici.

### Catalogue

| Skill | Ce qu’il fait |
|---|---|
| `aq-accessibility` | Audite, conçoit, corrige et valide l'accessibilité d'un projet AQ web Nuxt ou mobile Expo selon WCAG 2.2 AA et les conventions natives iOS/Android |
| `aq-adr` | Redige une decision d'architecture (ADR) dans docs/adr/ pour un projet AQ. A utiliser quand on tranche un choix technique structurant, qu'on change de librairie, d'hebergeur ou de modele de donnees, ou qu'on veut documenter pourquoi une option a ete ecartee. Declencheurs : ADR, decision technique, pourquoi on a choisi, on change de |
| `aq-ai` | Cadre, conçoit, implémente et évalue une fonctionnalité IA dans un CMS, SaaS ou backend mobile AQ : cas d'usage, UX, choix de modèle/fournisseur, prompts, sorties structurées, streaming, outils, RAG, sécurité, données privées, modération, coûts, quotas, observabilité, évaluations et fallback humain |
| `aq-audit` | Audit de securite d'un projet AQ avant livraison : secrets, autorisations, entrees utilisateur, dependances, en-tetes, donnees personnelles. A utiliser avant une mise en production, lors d'une revue de securite, ou quand on demande si le code est sur. Declencheurs : audit, securite, faille, RLS, secrets, avant livraison |
| `aq-auth` | Choix et mise en place de l'authentification sur un projet AQ (Better Auth, Convex, Supabase, Clerk, Directus). A utiliser quand un projet a besoin de comptes utilisateurs, de connexion sociale, de 2FA, de gestion d'organisations, ou quand on cable l'auth a la base de donnees. Declencheurs : auth, login, connexion, inscription, comptes utilisateurs, session, OAuth, Clerk, Better Auth, magic link |
| `aq-backup` | Conçoit, configure, documente et teste la sauvegarde et la restauration d'un projet AQ |
| `aq-better-auth` | Met en place Better Auth sur un projet Convex — web (Nuxt) ou mobile (Expo) — avec versions épinglées, vérification d'identité côté serveur, connexion sociale, et les cas oubliés (reset, vérification mail, suppression de compte) |
| `aq-brief` | Cadrage d'un projet client (site vitrine, CMS, SaaS, app mobile) pour Antoine Quarroz. A utiliser quand on prepare un devis, qu'on debriefe un rendez-vous client, qu'on redige un brief, un PRD ou des user stories, ou qu'on hesite entre plusieurs stacks pour un projet. Declencheurs : "nouveau client", "devis", "cadrage", "brief", "de quoi il a besoin", "quelle stack pour ce projet" |
| `aq-conventions` | Conventions de code et de structure des projets d'Antoine Quarroz (Nuxt, Vue, Convex, Supabase, Expo, Tailwind). A utiliser des qu'on ecrit ou modifie du code dans un projet AQ, qu'on choisit une dependance, qu'on cree un fichier, ou qu'on prepare une livraison. Declencheurs : nouveau composant, nouvelle route, migration, choix de librairie, "on met ca ou ?", revue de code |
| `aq-convex` | Conventions Convex sur les projets AQ — schéma, queries, mutations, actions, sécurité, index, pagination, migrations et performance |
| `aq-design-setup` | Installe et initialise les skills de design Better UI et Impeccable dans un projet AQ web ou mobile, au niveau du projet pour Codex et Claude Code. A utiliser au demarrage d'une vitrine, d'un CMS, d'un SaaS ou d'une app Expo, avant de concevoir l'interface, ou quand l'utilisateur dit "installe Better UI", "ajoute Impeccable", "setup design", "ameliore le design" ou "initialise le design system". Sur mobile, adapte le workflow a React Native, NativeWind et aux interactions tactiles. Ne pas utiliser pour polir directement une interface deja construite |
| `aq-domain-dns` | Choisit, achète, transfère, configure, sécurise, migre et documente les domaines et DNS d'un projet AQ : registrar, titulaire, nameservers, Cloudflare, Infomaniak, Vercel, A/AAAA/CNAME/MX/TXT/CAA, DNSSEC, SSL, apex/www, sous-domaines, emails SPF/DKIM/DMARC, redirections, Search Console, API, webhooks et universal/app links |
| `aq-email` | Conçoit, configure et valide les emails transactionnels, de sécurité, d'onboarding et marketing d'un projet AQ avec Resend |
| `aq-feature-flags` | Cadre, choisit, implémente et valide les feature flags d'un CMS, SaaS ou app mobile AQ : activation globale, bêta, allowlist, pourcentage progressif, ciblage par organisation, kill switch, configuration distante, cohérence Nuxt/Expo/Convex, audit, observabilité, rollback et suppression des flags |
| `aq-files-storage` | Cadre, choisit, implémente et valide le stockage de fichiers d'un CMS, SaaS ou backend mobile AQ : uploads web/Expo, images, avatars, PDF, pièces jointes, stockage Convex ou objet, accès public/privé, URLs signées, permissions par organisation, validation, quotas, optimisation, suppression, rétention, antivirus, sauvegarde et migration |
| `aq-handover` | Passation d'un projet AQ au client — transfert des accès et de la propriété des comptes, documentation, formation, et ce qui reste ou non chez Antoine |
| `aq-hosting` | Choix de l'hebergement pour un projet AQ, entre Infomaniak, Vercel et Cloudflare, et consequences sur le choix de la base de donnees. A utiliser quand on decide ou deployer, quand un client demande un hebergement suisse, quand on configure un preset Nitro ou un pipeline de deploiement, ou quand on compare les couts d'hebergement. Declencheurs : hebergement, deploiement, Infomaniak, Vercel, Cloudflare, Workers, ou on met le site, hebergement suisse, souverainete |
| `aq-import-export` | Cadre, implémente et valide les imports et exports de données d'un CMS, SaaS ou backend mobile AQ : CSV/XLSX/JSON, modèles, mapping de colonnes, aperçu, validation par ligne, déduplication, reprise, gros volumes, permissions, fichiers privés, portabilité et conformité |
| `aq-init` | Initialise un nouveau projet AQ de bout en bout — questions de cadrage, direction artistique et design tokens, scaffolding de la base (vitrine, cms, saas ou mobile), i18n, Sentry, Playwright, création du dépôt GitHub et premier commit |
| `aq-jobs` | Cadre, conçoit, implémente et valide les tâches asynchrones et planifiées d'un CMS, SaaS ou backend mobile AQ avec Convex : scheduler, cron, files, traitements longs, imports/exports, retries, backoff, idempotence, concurrence, états, progression, annulation, dead letters, observabilité et relance admin |
| `aq-kit-retro` | Rétrospective qui améliore le kit AQ lui-même — identifie ce qui a coincé pendant un projet ou une grosse tâche, ce qui a dû être réexpliqué, ce qui manquait, puis écrit réellement la modification dans les skills du kit |
| `aq-legal-pages` | Cadre, rédige, intègre et maintient les pages et mentions légales d'un projet AQ à partir de faits vérifiés : politique de confidentialité, impressum/mentions légales, cookies, CGU, CGV, abonnements, remboursements, suppression de compte, formulaires, pricing et informations App Store/Google Play |
| `aq-localization` | Cadre, implémente et valide la localisation d'une vitrine, CMS, SaaS ou app mobile AQ : langues et variantes régionales, @nuxtjs/i18n/Expo, routes, fallback, formats de dates/nombres/devises, contenu CMS, emails, notifications, SEO international, traduction humaine, workflow éditorial, pseudo-localisation et tests |
| `aq-maintenance` | Audite, exécute et documente la maintenance récurrente d'un projet AQ déjà livré : disponibilité, parcours critiques, Sentry, emails, paiements, domaines, certificats, sauvegardes, dépendances, sécurité, performance, SEO, conformité, accès, quotas, coûts et obsolescence |
| `aq-nlpd` | Points de conformite nLPD (Suisse) et RGPD a couvrir sur un projet web ou mobile livre a un client. A utiliser quand un projet collecte des donnees personnelles, quand on redige une politique de confidentialite, quand on choisit un hebergeur ou un outil d'analytics, ou quand le client demande "est-ce que c'est aux normes". Ce n'est pas un conseil juridique |
| `aq-notifications` | Cadre, conçoit, implémente et valide les notifications d'un CMS, SaaS ou app mobile AQ : centre de notifications in-app, emails transactionnels, push Expo, préférences par canal, événements Convex, invitations, facturation, sécurité, deep links, retries, déduplication et mesure |
| `aq-onboard-project` | Prend en main un projet existant qu'Antoine n'a pas écrit — cartographie la stack, détecte les risques et les secrets exposés, évalue l'état réel, puis produit un AGENTS.md et un rapport d'audit chiffré |
| `aq-onboarding` | Conçoit, implémente et valide l'onboarding d'un SaaS web, d'une app mobile ou des éditeurs d'un CMS AQ |
| `aq-organizations` | Conçoit, implémente et valide les organisations, workspaces, équipes, appartenances, rôles, permissions et invitations d'un projet AQ avec Better Auth et Convex, partagés entre Nuxt et Expo |
| `aq-pricing` | Conçoit la stratégie tarifaire, les offres et les modalités de paiement d'un SaaS, d'une app mobile ou d'un site de services AQ. A utiliser quand on définit des plans SaaS, des abonnements, des achats intégrés, des quotas, un essai, un paiement unique, des crédits, une tarification à l'usage, des forfaits freelance, un prix "dès", une fourchette ou une offre sur devis ; quand l'utilisateur dit "pricing", "combien facturer", "plans", "abonnement", "prix", "paiement unique" ou "grille tarifaire". Pose les questions métier et économiques avant de recommander. Ne configure aucun prestataire de paiement et ne donne pas de conseil fiscal ou juridique |
| `aq-product-spec` | Entretien de spécification produit approfondi pour un projet AQ — passe en revue toutes les fonctionnalités nécessaires d'un SaaS, d'un CMS, d'une app mobile ou d'un site vitrine, y compris les cas que personne ne pense à demander, puis produit l'inventaire des features, les user stories et l'arbitrage MVP |
| `aq-production` | Déploie un projet AQ en production pour la première fois ou après un changement d'environnement — provisionne le déploiement Convex de prod, configure l'hébergeur (Vercel ou Infomaniak), synchronise les variables, lance le premier déploiement, puis liste ce qui ne peut pas être automatisé |
| `aq-release-mobile` | Prépare, construit, soumet et valide une release Expo iOS/Android AQ avec EAS Build, TestFlight et Google Play : comptes, certificats, identifiants, versions, profils, variables, fiches stores, confidentialité, achats, phased rollout, OTA, compatibilité backend, monitoring et rollback |
| `aq-revenuecat` | Configure et valide RevenueCat dans une app AQ Expo/React Native pour les abonnements, achats uniques, droits d'acces et paywalls iOS/Android. A utiliser apres `aq-pricing` quand l'utilisateur dit "RevenueCat", "achats integres", "in-app purchase", "abonnement mobile", "paywall", "entitlement", "offering", "restore purchases" ou veut monetiser une app publiee sur l'App Store ou Google Play. Couvre l'identite Better Auth/Convex, les webhooks idempotents et les tests sandbox. Ne pas utiliser pour un SaaS web Stripe ni pour des biens ou services physiques sans verifier les regles des stores |
| `aq-search` | Cadre, conçoit, implémente et valide la recherche d'un CMS, SaaS ou app mobile AQ : recherche plein texte, filtres, facettes, tri, pagination, suggestions, index Convex ou moteur externe, synchronisation, permissions par organisation, pertinence, UX, accessibilité et mesure |
| `aq-sentry` | Installe, configure et valide Sentry sur un projet AQ Nuxt ou Expo — propriété du compte, région, erreurs client/serveur/mobile, environnements, releases, source maps, performance, confidentialité, filtrage et alertes. A utiliser quand un projet n'a pas encore de monitoring, quand Sentry existe mais n'est pas vérifié, avant une mise en production, ou quand l'utilisateur dit "ajoute Sentry", "monitoring", "source maps", "alertes erreurs", "je veux voir les crashes" ou "Sentry ne remonte rien". Pose les questions de cadrage avant l'installation et déclenche une erreur contrôlée de bout en bout. Ne pas utiliser pour analyser des incidents Sentry existants sans modifier la configuration |
| `aq-ship` | Checklist de pre-livraison d'un projet web ou mobile AQ avant mise en production. A utiliser avant un deploiement en prod, avant de transmettre un site a un client, ou quand on demande "est-ce que c'est pret a partir". Declencheurs : mise en ligne, deploiement, livraison, recette, go live |
| `aq-story` | Mène une story ou une tâche de développement de bout en bout sur un projet AQ — comprendre le contexte existant, planifier, exécuter par petits pas, traiter les quatre états d'interface, relire, finir proprement |
| `aq-support` | Cadre, conçoit, implémente et valide le support client d'un projet AQ : FAQ et centre d'aide, contact public, tickets authentifiés, conversations, catégories, priorités, assignation, SLA, pièces jointes, notifications, dashboard admin, diagnostic mobile, anti-spam, confidentialité et mesure |
| `aq-tests` | Écrit les tests d'un projet AQ — Playwright pour le web, Maestro pour Expo, Vitest pour l'unitaire |


## Qui appeler

Antoine Quarroz — antoinequarroz.ch
