---
name: aq-domain-dns
description: >-
  Choisit, achète, transfère, configure, sécurise, migre et documente les domaines et DNS d'un projet AQ : registrar, titulaire, nameservers, Cloudflare, Infomaniak, Vercel, A/AAAA/CNAME/MX/TXT/CAA, DNSSEC, SSL, apex/www, sous-domaines, emails SPF/DKIM/DMARC, redirections, Search Console, API, webhooks et universal/app links. À utiliser pour une mise en ligne, un changement d'hébergeur ou DNS, un transfert de domaine, une panne DNS/email, une expiration ou une passation client. Fonctionne pour vitrine, CMS, SaaS et mobile, inventorie avant toute mutation et exige un plan de retour arrière.
---

# Domaine et DNS AQ

Le domaine est le point d'entrée du site, des emails, des callbacks et parfois de l'app mobile. Une petite erreur de zone peut couper tous ces services à la fois.

## Garde-fous

- Le client est titulaire du domaine et propriétaire des comptes registrar/DNS ; Antoine reçoit un accès délégué.
- Ne jamais changer nameservers, DNSSEC, MX, apex ou domaine canonique sans inventaire vérifié, fenêtre, validation et retour arrière.
- Ne jamais supprimer un enregistrement inconnu « parce qu'il semble ancien ». Identifier son service et son propriétaire.
- Ne jamais afficher ni stocker publiquement AuthCode/EPP, token API, clé DNSSEC privée ou secret de vérification sensible.
- Préférer les vérifications DNS en lecture seule avant et après chaque mutation.
- Une propagation en cours n'est pas une raison pour empiler des modifications contradictoires.

## 1. Comprendre la demande

Lire `AGENTS.md`, `docs/hosting.md`/ADR, configuration de déploiement, domaines déclarés, emails, OAuth, webhooks, SEO et liens mobiles. Demander progressivement :

1. Nouveau domaine, rattachement à un hébergement, transfert registrar, migration DNS, changement de domaine ou dépannage ?
2. Qui est le titulaire légal, qui paie, qui reçoit les alertes et où sont registrar/DNS aujourd'hui ?
3. Quels services utilisent le domaine : web, email entrant/sortant, auth, API, CMS, fichiers, Stripe, Resend, analytics, Search Console, mobile ?
4. Domaine canonique apex ou `www`, langues, sous-domaines et redirections attendus ?
5. Quelle indisponibilité est acceptable et quelle fenêtre de changement ?

Pour l'hébergement, appeler `aq-hosting`. Pour le déploiement applicatif, `aq-production`. Cette skill garde la responsabilité du domaine, de la zone et des validations DNS.

## 2. Inventorier avant de toucher

Copier `assets/domain-dns.md` vers `docs/domain-dns.md`. Capturer :

- registrar, titulaire, contacts, verrouillage, expiration et renouvellement ;
- nameservers autoritatifs et fournisseur DNS ;
- état DNSSEC/DS ;
- export complet de zone et résolution publique depuis plusieurs résolveurs ;
- A, AAAA, CNAME, MX, TXT, CAA, SRV, NS et wildcards ;
- certificats, domaines chez l'hébergeur et redirections ;
- dépendance de chaque record, TTL et propriétaire ;
- callbacks OAuth, CORS, cookies, webhooks et URLs absolues ;
- canonicals, sitemap, Search Console et backlinks lors d'un changement de domaine ;
- universal links/app links, fichiers d'association et deep links mobiles.

Comparer l'export à ce qui résout réellement. Un scan automatique peut manquer des records ; le revoir avec le client et les fournisseurs.

## 3. Concevoir la cible

Lire uniquement le guide pertinent :

- Cloudflare : `references/cloudflare.md` ;
- Vercel/Infomaniak : `references/hosting.md` ;
- transfert ou migration : `references/migration.md` ;
- email et mobile : `references/services.md`.

Décider et documenter : registrar, DNS autoritatif, domaine canonique, apex/www, sous-domaines, proxy/DNS-only, TTL, DNSSEC, CAA, certificats, redirections et ownership.

Ne pas déplacer registrar, DNS et hébergement dans la même fenêtre sans nécessité. Chaque couche peut rester chez un fournisseur différent.

## 4. Préparer une matrice de changements

Pour chaque mutation, noter valeur actuelle, valeur cible, service, TTL, ordre, validation et rollback. Vérifier les valeurs dans la documentation officielle actuelle du fournisseur : ne pas recopier une IP/CNAME mémorisée d'un autre projet.

Avant migration :

- réduire les TTL suffisamment tôt lorsque le fournisseur le permet ;
- créer et vérifier la cible avant bascule ;
- conserver l'ancien service actif ;
- sauvegarder zone et captures des réglages ;
- définir qui peut revenir en arrière et jusqu'à quand ;
- préparer communication et surveillance.

## 5. Configurer web, apex et sous-domaines

- Ajouter le domaine au bon projet/compte client avant de pointer les DNS.
- Configurer apex et `www`, puis choisir un canonical et rediriger l'autre en permanent, sans boucle.
- Séparer `app`, `api`, `auth`, `cms`, `assets`, `status` seulement s'ils correspondent à de vrais services.
- Ne pas utiliser wildcard par facilité : elle peut rendre des hôtes inattendus actifs et compliquer cookies/certificats.
- Vérifier CAA avant l'émission du certificat ; une politique restrictive incorrecte bloque le SSL.
- Une fois émis, tester chaîne, noms couverts, renouvellement et redirection HTTP → HTTPS.
- Protéger previews/staging et ne pas les indexer.

Avec Cloudflare, les records de validation et d'email restent généralement DNS-only. Ne proxyfier que les hôtes HTTP compatibles et voulus.

## 6. Protéger le domaine et la zone

- Activer MFA, accès nominatifs, rôle minimal et codes de récupération dans le coffre client.
- Activer verrouillage du domaine et renouvellement automatique avec moyen de paiement valide.
- Utiliser des contacts fonctionnels surveillés, sans dépendre uniquement d'un ancien employé.
- Activer DNSSEC après stabilisation de la zone et vérifier la chaîne DS publiquement.
- Lors d'un changement de nameservers, traiter DNSSEC dans l'ordre documenté par les fournisseurs ; un ancien DS peut rendre tout le domaine inaccessible.
- Limiter les tokens API à la zone et aux actions nécessaires, puis révoquer les tokens temporaires.
- Exporter périodiquement la zone et intégrer domaine/accès à `aq-backup`, `aq-maintenance` et `aq-handover`.

## 7. Préserver les emails

Utiliser `aq-email` et `references/services.md`.

- Recopier exactement MX, SPF, DKIM, DMARC et records de vérification avant bascule des nameservers.
- Ne jamais créer plusieurs records SPF au même nom ; consolider selon la politique validée.
- Les records mail et de vérification ne passent pas par un proxy HTTP.
- Tester réception, envoi, reply-to et en-têtes SPF/DKIM/DMARC après changement.
- Ne durcir DMARC qu'après inventaire de toutes les sources et période d'observation.

Un site qui répond avec des emails cassés n'est pas une migration réussie.

## 8. Mettre à jour applications et services

Après validation DNS/SSL, mettre à jour de façon contrôlée :

- base URLs publiques, cookies/domaines autorisés et CORS ;
- callbacks Better Auth/OAuth et liens d'emails ;
- Stripe/RevenueCat/Resend/Sentry et autres webhooks/callbacks ;
- canonicals, sitemap, robots, Open Graph et Search Console via `aq-seo`/`aq-analytics` ;
- CSP, allowlists et protections anti-spam ;
- universal links iOS, Android App Links et fichiers d'association ;
- documentation, monitoring et tests e2e.

Ne pas élargir CORS ou cookies à `*.example.com` sans besoin et analyse de sécurité.

## 9. Gérer un changement de domaine

Lire `references/migration.md`. Conserver une correspondance URL par URL et rediriger directement chaque ancienne page vers son équivalent. Ne pas rediriger tout vers l'accueil.

- Garder l'ancien domaine renouvelé, sécurisé et redirigé durablement.
- Vérifier possession des deux domaines et Search Console.
- Mettre à jour liens internes, canonicals, sitemap, emails, OAuth, documents et profils externes.
- Mesurer 404, erreurs DNS/SSL, trafic et indexation pendant plusieurs semaines.
- Ne pas supprimer trop tôt l'ancien hébergement, certificat ou zone.

## 10. Valider de bout en bout

Depuis des résolveurs/réseaux distincts, vérifier :

- registrar, nameservers, SOA et résolution DNS ;
- DNSSEC sans erreur ;
- apex/www et chaque sous-domaine attendu ;
- absence d'AAAA obsolète ou record conflictuel ;
- HTTPS, certificat, renouvellement et redirections ;
- site, API, auth, uploads, admin et parcours principal ;
- email entrant/sortant et authentification ;
- webhooks et callbacks ;
- sitemap/canonicals/Search Console ;
- universal/app links sur appareil si mobile ;
- anciens hôtes/URLs selon le plan de migration.

Surveiller au moins pendant la fenêtre des anciens TTL. Conserver les preuves et anomalies dans `docs/domain-dns.md`.

## Résultat attendu

- domaine et comptes détenus par le client ;
- inventaire/export de zone complet ;
- architecture cible et matrice de changement ;
- rollback praticable ;
- DNSSEC, SSL, email et services validés ;
- ancien domaine/URLs préservés si migration ;
- accès, renouvellement et maintenance documentés.

Terminer par **Propriété**, **Zone active**, **Sécurité**, **Services vérifiés**, **Rollback**, **Actions manuelles**, **Prochaine expiration**.
