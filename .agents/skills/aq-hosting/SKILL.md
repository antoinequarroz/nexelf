---
name: aq-hosting
description: >-
  Choix de l'hebergement pour un projet AQ, entre Infomaniak, Vercel et Cloudflare, et consequences sur le choix de la base de donnees. A utiliser quand on decide ou deployer, quand un client demande un hebergement suisse, quand on configure un preset Nitro ou un pipeline de deploiement, ou quand on compare les couts d'hebergement. Declencheurs : hebergement, deploiement, Infomaniak, Vercel, Cloudflare, Workers, ou on met le site, hebergement suisse, souverainete.
---

# Hebergement : Infomaniak ou Vercel

L'hebergement n'est **pas** une propriete du template. C'est une variable de build. Un projet Nuxt du kit doit pouvoir partir chez l'un ou l'autre sans changer une ligne de code applicatif.

## Regle de decision

Poser la question dans cet ordre. La premiere qui repond tranche.

1. **Le client exige-t-il que les donnees restent en Suisse ?** → Infomaniak. Fin de la discussion.
2. **Le projet traite-t-il des donnees sensibles au sens de la nLPD** (sante, religion, biometrie, poursuites) ? → Infomaniak par defaut, sauf accord ecrit du client.
3. **Le client a-t-il deja son domaine et ses mails chez Infomaniak ?** → Infomaniak, pour garder un seul point d'acces et une seule facture.
4. **Le client veut-il une facture suisse en CHF avec un support en francais ?** → Infomaniak.
5. **Sinon** → Vercel : previews de PR, deploiement en une commande, rien a administrer.

## Cloudflare : couche reseau oui, hebergeur pas encore

Distinction a tenir.

**Comme couche reseau, on l'utilise des maintenant, quel que soit l'hebergeur derriere** : DNS, CDN, Turnstile pour proteger les formulaires (gratuit, sans cookie, plus propre que reCAPTCHA du point de vue nLPD), R2 pour les fichiers lourds.

**Comme hebergeur, pas encore par defaut.** Le runtime Workers n'est pas Node : pas d'acces `fs`, APIs Node limitees. Consequences :

| Projet | Cloudflare comme hebergeur |
|---|---|
| Vitrine statique | Excellent, et quasi gratuit |
| CMS Directus | Non. Directus exige un vrai serveur Node. Front seulement |
| SaaS sur Convex | Techniquement possible, mais on decouvre les limites du runtime au mauvais moment |

Regle : avant de mettre un client sur Cloudflare, l'avoir deploye une fois sur un projet perso. Deux hebergeurs maitrises valent mieux que trois approximatifs.

Cloudflare est une societe americaine : ca ne repond pas a une exigence de residence suisse.

## Ce que ca implique techniquement

| | Vercel | Infomaniak |
|---|---|---|
| Preset Nitro | `vercel` | `node-server` (Node.js manage ou Jelastic Cloud) |
| Preset Nitro, si Cloudflare | `cloudflare_module` (Workers, pas Pages) | — |
| Site statique | build statique | hebergement web classique + CDN |
| Previews par PR | natif | a construire soi-meme, ou s'en passer |
| Cron / taches planifiees | natif | a mettre en place |
| Version de Node | declaree dans le projet | a figer dans le panel, **et a aligner** |
| Cout a petit trafic | souvent gratuit | quelques CHF/mois, previsible |
| Cout en cas de pic | variable, peut surprendre | previsible |

Jelastic Cloud chez Infomaniak fait tourner Nuxt en SSR avec build, demarrage et mise a l'echelle geres. L'offre Node.js manage suffit pour un site vitrine ou un CMS a trafic normal.

## La consequence qu'on oublie : la base de donnees

Choisir un hebergement suisse ne sert a rien si les donnees partent quand meme aux Etats-Unis via la base.

| Contrainte | Base possible |
|---|---|
| Aucune contrainte de residence | Convex (defaut SaaS et mobile) |
| Residence UE acceptee | Supabase, region europeenne |
| Residence suisse exigee | Postgres auto-heberge chez Infomaniak, ou Directus auto-heberge |

**Convex ne permet pas de choisir une region suisse.** Si la reponse au point 1 est oui, Convex est hors jeu pour ce projet, et il faut le dire au client avant de chiffrer, pas apres.

Meme raisonnement pour les services annexes : mailing, analytics, paiement, monitoring. Chacun est un transfert de donnees. Les lister dans le brief.

## A faire a chaque fois

- Ecrire une ADR qui dit quel hebergeur, pourquoi, et quelle contrainte l'a impose.
- Mettre le compte d'hebergement au nom du **client**, avec Antoine en acces delegue. Un hebergement sur le compte personnel du prestataire est une dette qu'on paie a la rupture.
- Noter dans le brief qui paie l'hebergement, et a partir de quand.
