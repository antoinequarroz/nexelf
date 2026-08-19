---
name: aq-better-auth
description: Met en place Better Auth sur un projet Convex — web (Nuxt) ou mobile (Expo) — avec versions épinglées, vérification d'identité côté serveur, connexion sociale, et les cas oubliés (reset, vérification mail, suppression de compte). À utiliser quand un projet a besoin de comptes utilisateurs, de connexion, d'inscription, de 2FA, ou quand l'utilisateur dit "ajoute l'auth", "setup better auth", "il faut un login". Ne pas utiliser pour Supabase Auth ou Directus.
---

# Setup Better Auth + Convex

<objective>
Obtenir une authentification qui marche en dev et en prod, dont la frontière de sécurité est côté serveur, et dont les versions sont épinglées pour ne pas casser à la prochaine mise à jour.
</objective>

<strict_order>
Ne pas réordonner. L'auth est une frontière de sécurité : elle se construit du serveur vers le client, jamais l'inverse.

1. Préflight — versions et compatibilité
2. Composant Convex et `convex/auth.ts`
3. Vérification d'identité dans les fonctions
4. Client et provider
5. Fournisseurs de connexion
6. Les cinq cas oubliés
7. Validation
</strict_order>

## Répartition avec la skill officielle

Si `better-auth/skills` est installée, l'utiliser pour tout **détail d'API** : signatures, options, adaptateurs, commandes CLI, plugins. Elle est maintenue en amont et sera toujours plus à jour que ce fichier.

Cette skill-ci garde la main sur ce qu'aucune skill amont ne connaît : l'**ordre** des étapes, la politique de **versions épinglées**, la frontière de sécurité, et les cinq cas oubliés. En cas de contradiction sur une décision, c'est ce fichier qui tranche.

```
npx skills add better-auth/skills
```

## 1. Préflight — versions épinglées

Le composant Convex impose une matrice de compatibilité stricte. Avant d'installer :

- Vérifier la version de `convex` du projet (minimum imposé par le composant).
- Consulter la doc du composant pour la version exacte de `better-auth` attendue.
- Installer **sans plage de version** : pas de `^`, pas de `~`. `--save-exact`.
- Pour Expo, `@better-auth/expo` doit correspondre exactement à `better-auth`.

Écrire dans `AGENTS.md` : *ne jamais lancer `pnpm update` large sur ces paquets*. Une montée de version d'auth est une opération à part entière — sa branche, son test de bout en bout, jamais mélangée à une story fonctionnelle.

## 2. Composant et `convex/auth.ts`

- Enregistrer le composant dans `convex/convex.config.ts`.
- Créer `convex/auth.config.ts` déclarant Better Auth comme fournisseur.
- Créer `convex/auth.ts` avec le client du composant et la fabrique `createAuth`.
- Générer et stocker le secret de chiffrement en variable d'environnement Convex. **Jamais dans le dépôt.**
- `baseURL` vient de l'URL du site Convex, en variable d'environnement — elle diffère entre dev et prod.

Sur Expo, ajouter le plugin `expo` à la configuration Better Auth et utiliser `expo-secure-store` pour le stockage des sessions. C'est le point où le setup est le plus capricieux : si un exemple de la doc ne fonctionne pas, vérifier les paramètres manquants côté `createAuth` avant de chercher ailleurs.

## 3. Vérification d'identité — la règle qui compte

Chaque fonction Convex publique commence par résoudre l'identité, **avant toute lecture de données**. Pas d'identité, on rejette.

- Ne jamais déduire une autorisation d'un état client. Le client dit qui il prétend être ; le serveur décide.
- Ne jamais filtrer par `userId` reçu en argument. L'identité vient du contexte d'auth, pas des paramètres.
- Écrire un helper unique (`requireUser(ctx)`) et l'utiliser partout. Une seule façon de faire.

## 4. Client et provider

Envelopper l'app avec le provider Better Auth de Convex. Sur mobile, mettre en pause les requêtes tant que l'utilisateur n'est pas authentifié plutôt que d'afficher des états vides trompeurs.

## 5. Fournisseurs de connexion

Défaut : email + mot de passe, plus Google si le public est grand-public.

- Déclarer les URL de callback pour **dev et prod** dès maintenant chez chaque fournisseur. C'est l'oubli qui coûte une heure au premier déploiement.
- Magic link ou OTP : bons pour du B2B, mais dépendants de la délivrabilité des mails — voir ci-dessous.

## 6. Les cinq cas oubliés

À implémenter maintenant, pas après la mise en production :

1. Réinitialisation de mot de passe, et le mail correspondant.
2. Vérification de l'adresse mail.
3. Suppression de compte **avec purge des données liées** — exigence nLPD/RGPD.
4. Que devient une donnée partagée quand son propriétaire supprime son compte ?
5. Sessions : durée, révocation, déconnexion de tous les appareils.

Les mails d'auth partent d'un domaine qui doit avoir SPF, DKIM et DMARC configurés. Sans ça ils finissent en spam et le client croit que l'inscription est cassée.

## 7. Validation

- Inscription, connexion, déconnexion, reset : parcourus à la main une fois.
- Un utilisateur non authentifié ne peut lire aucune donnée protégée — vérifié en appelant la fonction directement, pas seulement via l'UI.
- Un utilisateur A ne peut pas lire les données d'un utilisateur B. **Ce test devient un test e2e permanent.**
- Les versions sont épinglées dans `package.json`, sans plage.

## Ne pas faire

- Ne pas coder d'écran de login avant que le serveur ne soit sûr.
- Ne pas stocker de token en `AsyncStorage` sur mobile : `expo-secure-store`.
- Ne pas ajouter Clerk « en plus, pour tester ». Un système d'auth par projet.
