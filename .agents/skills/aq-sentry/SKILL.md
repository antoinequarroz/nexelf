---
name: aq-sentry
description: >-
  Installe, configure et valide Sentry sur un projet AQ Nuxt ou Expo — propriété du compte, région, erreurs client/serveur/mobile, environnements, releases, source maps, performance, confidentialité, filtrage et alertes. A utiliser quand un projet n'a pas encore de monitoring, quand Sentry existe mais n'est pas vérifié, avant une mise en production, ou quand l'utilisateur dit "ajoute Sentry", "monitoring", "source maps", "alertes erreurs", "je veux voir les crashes" ou "Sentry ne remonte rien". Pose les questions de cadrage avant l'installation et déclenche une erreur contrôlée de bout en bout. Ne pas utiliser pour analyser des incidents Sentry existants sans modifier la configuration.
---

# Sentry AQ

Obtenir un monitoring utile, sobre et vérifié. Un SDK installé sans source maps, environnement, alerte et test réel n'est pas une intégration terminée.

## Répartition avec la skill officielle

Si `getsentry/skills` est installée, l'utiliser pour les détails d'API et de configuration propres à la version courante. Cette skill AQ garde la main sur les décisions : propriété, région, données autorisées, sampling, alertes et définition de fini.

## 1. Préflight

Lire `AGENTS.md`, `package.json`, la configuration Sentry existante, les variables d'environnement, le CI et la plateforme de déploiement.

Identifier le parcours :

- Nuxt : lire `references/nuxt.md`.
- Expo/React Native : lire `references/expo.md`.

Ne pas lancer de wizard à l'aveugle sur un projet déjà configuré. Inspecter d'abord son diff potentiel et préserver les adaptations existantes.

## 2. Poser les questions

Poser un bloc à la fois et proposer le défaut AQ.

### Propriété et périmètre

- À qui appartient l'organisation Sentry : Antoine ou le client ? Défaut projet client : le client.
- Quelles surfaces surveiller : navigateur, serveur Nuxt, mobile iOS/Android, fonctions externes ?
- Quels environnements existent réellement : development, preview, production ?
- Qui est responsable de répondre aux alertes ?

### Données et conformité

- Le projet traite-t-il des données personnelles ou sensibles ?
- Une région de données particulière est-elle exigée ? Choisir la région à la création, avant d'envoyer le premier événement.
- Quels identifiants utilisateur sont nécessaires au diagnostic ? Défaut : identifiant interne opaque seulement.
- Session Replay est-il réellement nécessaire ? Défaut : désactivé tant que confidentialité, consentement et budget ne sont pas décidés.

### Volume et alertes

- Erreurs seulement ou aussi performance, profiling/replay et logs ? Défaut : erreurs + performance échantillonnée.
- Quel canal reçoit les alertes et à quelles heures ?
- Quels parcours sont critiques : connexion, formulaire, paiement, publication, achat mobile ?

Écrire les réponses dans `docs/monitoring.md` avec `assets/monitoring.md`.

## 3. Créer ou sélectionner les projets Sentry

- Réutiliser un projet correspondant à la bonne application et plateforme ; ne pas créer de doublon.
- Séparer des applications réellement distinctes. Ne pas multiplier les projets uniquement pour séparer dev et prod : utiliser les environnements.
- Nommer projet, équipe et propriétaire clairement.
- Ajouter Sentry à la liste des sous-traitants et noter la région retenue dans la documentation de conformité.

Ne jamais créer une organisation ou choisir une région irréversible sans confirmation.

## 4. Installer le SDK

- Nuxt : `@sentry/nuxt` avec la méthode recommandée pour les versions Nuxt/Sentry installées.
- Expo : `@sentry/react-native` via `npx expo install`, puis plugin/configuration Expo selon la documentation courante.
- Ne pas faire de mise à jour large des dépendances pour installer Sentry.
- Conserver la DSN en variable d'environnement. Une DSN n'est pas un secret d'administration, mais ne pas la disperser en dur.
- Stocker `SENTRY_AUTH_TOKEN` uniquement dans le CI ou l'environnement de build. Jamais dans le front, le dépôt ou une variable publique.
- Ajouter toutes les variables attendues dans `.env.example` avec valeurs factices et commentaires.

## 5. Configurer les événements

- Environnements distincts et stables : `development`, `preview`, `production`.
- Release liée au commit/build et identique entre événements et source maps.
- Envoyer les erreurs non gérées ; capturer manuellement seulement les erreurs attendues qui nécessitent une action.
- Ajouter des tags métier peu nombreux et bornés. Ne jamais mettre un contenu libre ou secret dans un tag.
- Associer un identifiant utilisateur opaque seulement si utile ; pas d'email par défaut.
- Définir `sendDefaultPii` explicitement et nettoyer cookies, headers d'auth, corps de requêtes, formulaires, tokens et URLs sensibles.
- Utiliser `beforeSend`/hooks équivalents pour supprimer, pas seulement masquer dans l'UI Sentry.

Ne pas appeler un service réseau externe depuis une mutation Convex. La télémétrie backend doit respecter la frontière query/mutation/action et ne pas casser une transaction.

## 6. Échantillonnage et bruit

- Conserver les erreurs à 100 % au départ, sauf contrainte de volume démontrée.
- Démarrer la performance à un taux modeste (0.1 comme hypothèse), puis l'ajuster avec des données réelles et le budget.
- Préférer un sampler contextuel pour conserver les parcours critiques et réduire le bruit des routes de santé, bots et tâches fréquentes.
- Désactiver ou masquer intégralement les champs de Session Replay avant toute activation. Ne jamais enregistrer mots de passe, paiements, santé ou contenu privé.
- Filtrer uniquement les erreurs prouvées non actionnables : extensions, annulations utilisateur, bots identifiés. Documenter chaque filtre.
- Ne pas ignorer une classe d'erreurs pour faire baisser un compteur.

## 7. Source maps et releases

- Générer et uploader les source maps pendant un build preview/production, pas en watch mode.
- Utiliser un token d'organisation à permissions minimales dans le CI.
- Vérifier l'upload dans Sentry avant de supprimer les artefacts locaux.
- Éviter de servir publiquement les `.map`; les supprimer du bundle publié après upload ou bloquer leur accès selon la plateforme.
- Vérifier qu'une erreur minifiée affiche fichier, fonction et ligne source de la release courante.

## 8. Alertes et triage

Configurer au minimum :

- nouvelle erreur non vue de priorité élevée ;
- régression d'une erreur résolue ;
- hausse anormale du volume d'erreurs ou crashs ;
- échec d'un parcours critique si la donnée existe.

Chaque alerte a un propriétaire, un canal, une règle de déduplication/escalade et une action attendue. Éviter l'alerte sur chaque événement : le bruit détruit la confiance.

Définir une routine simple : nouveau → assigné/trié → corrigé → résolu dans une release → surveillé pour régression.

## 9. Validation obligatoire

Créer temporairement une erreur de test contrôlée et non accessible en production publique sans garde-fou.

Vérifier :

1. L'événement arrive dans le bon projet et environnement.
2. La release et le commit sont associés.
3. La stack trace est déminifiée par les source maps.
4. Les données sensibles prévues sont absentes de l'événement brut.
5. L'alerte atteint le bon canal et propriétaire.
6. L'erreur client puis serveur/mobile pertinente est couverte.

Retirer le déclencheur de test avant commit, mais conserver un test ou une procédure reproductible documentée. Lancer les checks du projet et vérifier `git diff`.

## Sortie

Terminer par quatre blocs : **Surveillé**, **Données exclues**, **Alertes**, **Test de preuve**. Ne jamais déclarer Sentry opérationnel sans lien ou identifiant d'événement de test vérifié.
