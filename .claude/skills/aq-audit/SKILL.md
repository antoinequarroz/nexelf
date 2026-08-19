---
name: aq-audit
description: >-
  Audit de securite d'un projet AQ avant livraison : secrets, autorisations, entrees utilisateur, dependances, en-tetes, donnees personnelles. A utiliser avant une mise en production, lors d'une revue de securite, ou quand on demande si le code est sur. Declencheurs : audit, securite, faille, RLS, secrets, avant livraison.
---

# Audit securite AQ

Enchaine dans cet ordre, en t'arretant pour signaler tout resultat critique.

1. **Secrets** — cherche cles, tokens et mots de passe dans le code et dans l'historique git. Une cle commitee un jour est compromise, meme retiree depuis : elle doit etre **revoquee**, pas juste supprimee.
2. **Autorisation** — pour chaque endpoint, fonction Convex ou table Supabase : qui peut lire, qui peut ecrire ? Une table Supabase sans policy RLS et une fonction Convex publique sans verification d'identite sont des findings critiques.
3. **Entrees utilisateur** — validation cote serveur (pas seulement cote client), upload de fichiers (type, taille, execution), injection.
4. **Dependances** — `pnpm audit`, et signale les paquets non maintenus depuis plus de 18 mois.
5. **En-tetes et config** — CSP, HSTS, cookies `httpOnly`/`secure`/`sameSite`, CORS, `.env` non expose.
6. **Donnees personnelles** — croise avec `docs/brief.md` : collecte-t-on plus que ce qui a ete annonce au client ? La duree de conservation est-elle definie ?

## Triage avant de remonter un finding

Verifie les trois :
- l'entree est-elle vraiment controlable par un attaquant ?
- le point vulnerable est-il atteignable depuis l'exterieur ?
- quel est le rayon d'impact reel ?

Si les trois ne sont pas etablis, classe en "a verifier", pas en "critique". Un rapport a 80 % de faux positifs ne sera pas lu, et le vrai finding sera noye dedans.

## Sortie

Critique / important / a verifier. Pour chacun : fichier, ligne, correctif propose.

Utilise la skill `owasp-security` si elle est installee, et `aq-nlpd` pour le volet donnees personnelles.
