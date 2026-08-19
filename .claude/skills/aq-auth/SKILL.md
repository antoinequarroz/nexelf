---
name: aq-auth
description: >-
  Choix et mise en place de l'authentification sur un projet AQ (Better Auth, Convex, Supabase, Clerk, Directus). A utiliser quand un projet a besoin de comptes utilisateurs, de connexion sociale, de 2FA, de gestion d'organisations, ou quand on cable l'auth a la base de donnees. Declencheurs : auth, login, connexion, inscription, comptes utilisateurs, session, OAuth, Clerk, Better Auth, magic link.
---

# Authentification

## Le defaut : Better Auth

Sur toute stack Convex, web ou mobile : `@convex-dev/better-auth`. Trois raisons, dans cet ordre :

1. Les utilisateurs vivent dans **notre** base Convex. Pas de service tiers qui detient les comptes du client.
2. Pas de facturation a l'utilisateur actif. Le cout ne grossit pas quand le produit marche.
3. Aucun sous-traitant supplementaire a declarer pour la nLPD.

Bonus non negligeable : le meme code d'auth sert au SaaS web et a l'app mobile.

## Par type de projet

| Projet | Auth |
|---|---|
| Vitrine | Aucune |
| CMS maison (defaut) | Better Auth + `@convex-dev/better-auth`, avec roles editeur/admin |
| CMS Directus (bascule) | Les utilisateurs Directus, rien a coder |
| SaaS Convex | Better Auth + `@convex-dev/better-auth` |

Les roles ne sont pas de l'authentification. Better Auth dit **qui** est connecte ; c'est le schema Convex qui dit **ce qu'il a le droit de faire**. Stocker le role sur l'utilisateur cote Convex, le verifier cote serveur, jamais dans le front.
| SaaS Supabase (residence CH/UE) | Supabase Auth, integre aux policies RLS |
| Mobile Expo | Better Auth + `@better-auth/expo` + `expo-secure-store` |

## Quand prendre Clerk a la place

Uniquement si **tous** ces points sont vrais :

- le client a besoin d'organisations, d'equipes et d'invitations des le lancement
- il y a une demande de SSO entreprise (SAML, OIDC)
- le budget accepte une facturation a l'utilisateur actif
- aucune contrainte de residence des donnees

Sinon, Better Auth. Ne pas prendre Clerk juste parce que l'UI est prete : c'est une semaine gagnee contre un sous-traitant permanent et une ligne de cout qui grossit avec le succes.

C'est un arbitrage **commercial**. Il se tranche dans le brief et se documente en ADR, pas au moment de coder.

## Versions epinglees — regle stricte

Le composant Convex exige des versions compatibles precises (Convex >= 1.25, une version donnee de Better Auth, la version Expo assortie).

- Epingler exactement dans `package.json`, sans `^` ni `~`.
- Ne **jamais** lancer une mise a jour large (`pnpm update`) sur un projet en production sans verifier la matrice de compatibilite.
- Une montee de version d'auth est une operation a part entiere : sa propre branche, son propre test de bout en bout, jamais melangee a une story fonctionnelle.

## Mise en place — ordre de travail

1. Schema et `convex/auth.ts` d'abord. L'auth est une frontiere de securite, elle se construit cote serveur.
2. Verifier l'identite **au debut de chaque fonction publique**, avant toute lecture. Pas d'identite, on jette.
3. Ne jamais deduire une autorisation d'un etat client. Le client dit qui il pretend etre, le serveur decide.
4. UI de connexion en dernier. C'est la partie la plus visible et la moins risquee.

## A prevoir des le depart, pas apres

- Reinitialisation de mot de passe, et le mail qui va avec
- Verification d'adresse mail
- Suppression de compte, avec purge des donnees liees (exigence nLPD/RGPD)
- Que se passe-t-il quand un compte est supprime alors qu'il possede des donnees partagees ?
- Sessions : duree, revocation, deconnexion de tous les appareils

Ces cinq points sont ceux qu'on decouvre en production quand on ne les a pas cadres.

## Pieges connus

- **Expo** : le setup est le plus capricieux. Prevoir une demi-journee la premiere fois. Une fois qu'un `convex/auth.ts` fonctionne, le reprendre tel quel sur les projets suivants.
- Les mails d'auth partent d'un domaine qui doit avoir SPF, DKIM et DMARC configures, sinon ils finissent en spam et le client pense que l'inscription est cassee.
- En dev, l'URL de callback OAuth differe de la prod. La declarer des le debut chez chaque fournisseur.
