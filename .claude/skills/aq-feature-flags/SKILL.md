---
name: aq-feature-flags
description: >-
  Cadre, choisit, implémente et valide les feature flags d'un CMS, SaaS ou app
  mobile AQ : activation globale, bêta, allowlist, pourcentage progressif,
  ciblage par organisation, kill switch, configuration distante, cohérence
  Nuxt/Expo/Convex, audit, observabilité, rollback et suppression des flags.
  À utiliser pour livrer une fonctionnalité progressivement, tester avec des
  clients pilotes, désactiver un risque sans redéployer ou séparer déploiement
  et lancement. Ne jamais utiliser un flag comme autorisation, abonnement ou
  unique protection de sécurité.
---

# Feature flags AQ

Séparer le déploiement du lancement sans créer une seconde architecture permanente. Chaque flag doit avoir un propriétaire, une date de fin et un plan de suppression.

## Principes non négociables

- Un flag décide d'une expérience ou d'un comportement, jamais d'une permission de sécurité.
- Vérifier rôles, organisation et entitlements côté serveur même si l'interface est masquée.
- Distinguer **flag**, **configuration**, **expérience** et **entitlement payé**.
- Évaluer de façon déterministe pour un même sujet ; éviter qu'un utilisateur change de variante à chaque requête.
- Définir une valeur sûre lorsque le fournisseur, le réseau ou l'identité est indisponible.
- Ne jamais conserver un flag terminé « au cas où ».

## 1. Cadrer le besoin

Lire `AGENTS.md`, l'architecture, l'auth, les organisations, les plans et le parcours concerné. Poser un bloc à la fois :

- Que cherche-t-on : bêta privée, lancement progressif, kill switch, migration, test produit ou configuration opérationnelle ?
- Quel est le sujet stable : installation, utilisateur ou organisation ?
- Qui décide et qui peut modifier le flag en production ?
- Quelle population commence, quels garde-fous et quel critère d'élargissement ?
- Que se passe-t-il pour les données créées si le flag est ensuite désactivé ?
- Faut-il la même décision sur Nuxt, Convex et Expo, y compris hors ligne ?
- Quelle date ou condition déclenche la suppression du flag ?

Refuser un flag si une constante de configuration, un rôle, un plan tarifaire, une branche courte ou une migration explicite répond mieux au besoin.

## 2. Classer le flag

Choisir une seule intention principale :

- **release** : masque temporairement du code déployé ;
- **experiment** : compare des variantes avec hypothèse et mesure ;
- **ops** : kill switch ou limitation opérationnelle ;
- **permission bêta** : accès temporaire à une population pilote, en plus des autorisations réelles ;
- **migration** : bascule contrôlée entre deux comportements ou modèles de données ;
- **configuration** : valeur distante bornée, si elle exige réellement un changement sans déploiement.

Lire `references/model.md`, puis copier `assets/flags-plan.md` vers `docs/feature-flags.md`. Faire valider propriétaire, exposition, fallback, métriques, rollback et suppression avant de coder.

## 3. Choisir la source de vérité

Comparer le besoin à l'infrastructure existante :

- Pour quelques flags internes sur un produit Convex, préférer un modèle Convex simple, audité et typé.
- Pour ciblage avancé, expérimentations, streaming mondial ou équipe produit autonome, évaluer un fournisseur dédié à partir de sa documentation, ses régions, son coût et son SDK actuel.
- Pour une app mobile, prévoir une configuration distante compatible avec les versions déjà distribuées ; ne jamais envoyer une valeur que l'ancienne app ne sait pas interpréter.

Éviter deux sources modifiables. Si un fournisseur externe est utilisé, définir cache, timeout, valeur par défaut, synchronisation serveur/client et comportement en panne. Documenter la décision dans une ADR si elle engage le produit.

## 4. Définir contrat et ciblage

Chaque flag possède : clé stable, type, description, propriétaire, environnements, valeur par défaut, règles ordonnées, sujet, date de création, expiration, lien de suivi et stratégie de suppression.

- Utiliser un identifiant opaque et stable pour le bucketing, pas email, nom ou donnée sensible.
- Pour une fonctionnalité collaborative, cibler généralement l'organisation afin que tous ses membres voient le même comportement.
- Produire un pourcentage déterministe par hash `flag + sujet`, avec une méthode versionnée.
- Définir la précédence : override d'urgence, exclusions, allowlist, règles, pourcentage, défaut.
- Borner les configurations numériques/chaînes par schéma et fallback ; ne pas exécuter du code distant.

Un changement de rôle ou de plan est évalué par les systèmes d'autorisation/facturation, pas recopié dans le flag.

## 5. Évaluer au bon endroit

Lire `references/runtime.md`.

- Les décisions ayant un effet sur les données, paiements ou appels externes sont réévaluées côté serveur avant l'action.
- Le client peut utiliser le même résultat pour l'UX, jamais comme preuve d'accès.
- Avec Nuxt SSR, fournir une décision cohérente au rendu serveur et à l'hydratation pour éviter flash et divergence.
- Avec Expo, gérer cache, démarrage sans réseau, reconnexion et compatibilité avec l'ancienne version.
- Ne pas inclure la liste complète des règles sensibles dans le bundle client.
- Éviter une évaluation réseau dans chaque fonction Convex ; utiliser une stratégie de cache ou réplication dont la fraîcheur est documentée.

Pour une mutation destructive ou coûteuse, un kill switch doit échouer dans le sens sûr. Pour une amélioration visuelle, conserver l'expérience stable disponible.

## 6. Concevoir l'UX de bêta et de panne

- Expliquer « bêta » lorsqu'elle change les attentes de fiabilité ou de support.
- Donner un moyen de feedback relié à `aq-support` si une cohorte pilote est impliquée.
- Ne pas afficher des contrôles qui échoueront systématiquement côté serveur.
- Lors d'une désactivation, préserver l'accès aux données déjà créées ou proposer une sortie claire.
- Éviter de modifier navigation, formulaire ou terminologie en plein parcours à cause d'un rafraîchissement de flag.
- Sur mobile, ne pas rendre l'app inutilisable parce que la configuration distante manque.

Poser les questions UX/UI : visibilité de la bêta, opt-in/opt-out, état existant, communication, support et comportement multi-appareils.

## 7. Déployer progressivement

Procéder par étapes adaptées au risque : équipe interne → organisations pilotes → petit pourcentage → paliers mesurés → généralisation.

À chaque palier :

- vérifier erreurs Sentry, performance, métrique produit et support ;
- comparer à une baseline définie ;
- attendre une fenêtre suffisante pour le risque observé ;
- documenter décision d'étendre, maintenir ou revenir en arrière.

Un pourcentage d'utilisateurs n'est pas une stratégie de rollback pour une migration irréversible. Employer dual read/write ou migration versionnée lorsque les données changent.

## 8. Administrer et auditer

- Limiter la modification des flags de production à des rôles explicites.
- Exiger confirmation renforcée pour kill switch, 100 % ou modification globale.
- Journaliser qui, quoi, avant/après, environnement, raison et date.
- Séparer production, preview et développement ; ne jamais tester un changement risqué sur tous les clients.
- Prévoir une procédure manuelle si l'interface d'administration est indisponible.
- Ne pas exposer ciblage nominatif, secrets ou données personnelles dans les logs et analytics.

Utiliser `aq-admin-dashboard` seulement si l'équipe a réellement besoin d'une interface maison. Un fichier typé contrôlé par déploiement peut être plus sûr pour un petit projet.

## 9. Tester les deux branches et les transitions

Tester au minimum :

- défaut, activé, désactivé et valeur invalide ;
- fournisseur lent, erreur, cache expiré et absence de réseau ;
- utilisateur anonyme/authentifié, deux organisations et switch rapide ;
- client masqué mais appel serveur direct toujours autorisé/refusé correctement ;
- cohérence SSR/hydratation et web/mobile ;
- bucketing stable, limites de pourcentage et changement de règles ;
- désactivation après création de données ;
- kill switch pendant deux opérations concurrentes ;
- anciennes versions mobiles face à de nouvelles configurations ;
- audit et droits de modification ;
- rollback, migration et suppression complète du flag.

## 10. Supprimer le flag

Quand la décision est prise :

1. choisir le comportement final ;
2. attendre la compatibilité nécessaire des clients mobiles ;
3. supprimer la branche morte, règles, instrumentation et UI admin ;
4. migrer ou nettoyer les données temporaires ;
5. supprimer la définition et les tests devenus inutiles ;
6. vérifier qu'aucune clé ne reste dans le code, les dashboards ou la documentation.

Suivre l'âge et le propriétaire des flags. Traiter tout flag expiré comme dette active.

## Résultat attendu

- intention et source de vérité documentées ;
- contrat typé et ciblage déterministe ;
- serveur protégé indépendamment du client ;
- comportement panne/hors ligne défini ;
- rollout et rollback mesurables ;
- audit des changements de production ;
- deux branches et transitions testées ;
- date et plan de suppression réels.

Terminer par **Flags**, **Ciblage**, **Runtime**, **Fallback**, **Rollout**, **Audit**, **Suppression**, **Reste manuel**.
