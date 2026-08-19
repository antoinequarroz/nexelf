---
name: aq-product-spec
description: Entretien de spécification produit approfondi pour un projet AQ — passe en revue toutes les fonctionnalités nécessaires d'un SaaS, d'un CMS, d'une app mobile ou d'un site vitrine, y compris les cas que personne ne pense à demander, puis produit l'inventaire des features, les user stories et l'arbitrage MVP. À utiliser avant de scaffolder un projet, quand on liste ce que le produit doit faire, quand on prépare un devis détaillé, ou quand l'utilisateur dit "on liste les features", "qu'est-ce que le SaaS doit faire", "spec", "cahier des charges". Ne pas utiliser pour cadrer le contexte commercial d'un client — c'est aq-brief.
---

# Spécification produit

<objective>
Sortir d'une session avec l'inventaire complet de ce que le produit doit faire, découpé en stories, et un MVP réellement arbitré — pas une liste de souhaits. La valeur de cette skill est dans les questions que personne ne pense à poser, pas dans celles qui sont évidentes.
</objective>

<place_dans_le_flux>
`aq-brief` (le client, le contexte, le budget) → **`aq-product-spec`** (le produit, les features, le MVP) → `aq-init` (le code)

Si `docs/brief.md` existe, le lire d'abord et **ne pas reposer ce qui y est déjà**.
Si le projet n'a pas de client (produit perso), sauter `aq-brief` et commencer ici.
</place_dans_le_flux>

<strict_order>
Cinq passes, dans cet ordre. Ne pas mélanger : chaque passe suppose la précédente.

1. **Le noyau** — le job à faire, l'utilisateur, le parcours de bout en bout
2. **Les domaines** — la banque de questions du type de projet (`references/`)
3. **Les oubliés** — cycle de vie, états dégradés, administration
4. **Le non-fonctionnel** — volumétrie, conformité, hors ligne, langues
5. **L'arbitrage** — MVP, phase 2, jamais

Ne pas produire de document avant la passe 5. Une liste de features non arbitrée n'est pas une spec, c'est une liste de courses.
</strict_order>

## Banques de questions par type

| Type | Fichier |
|---|---|
| SaaS | `references/saas.md` |
| CMS | `references/cms.md` |
| App mobile | `references/mobile.md` |
| Site vitrine | `references/vitrine.md` |

Lire le fichier correspondant **avant** la passe 2. Sur un projet web + mobile, lire les deux et signaler ce qui doit être partagé.

## Passe 1 — Le noyau

Court, mais il conditionne tout le reste.

1. **Quel problème le produit résout-il, pour qui ?** Une phrase. Si la réponse fait un paragraphe, le produit n'est pas encore clair.
2. **Que fait la personne aujourd'hui sans ce produit ?** Excel, WhatsApp, papier, un concurrent, rien ? C'est la vraie référence contre laquelle le produit sera jugé.
3. **Le parcours principal, de bout en bout.** De « je découvre le produit » à « j'ai obtenu ce que je voulais ». Étape par étape, à voix haute. Noter chaque étape : ce sont les premières stories.
4. **Comment on saura que ça marche ?** Un chiffre.
5. **Combien de types d'utilisateurs différents ?** Chaque type ajoute un parcours complet, donc du budget. Si la réponse dépasse trois, challenger.

## Passe 2 — Les domaines

Dérouler la banque de questions du type de projet, **un domaine à la fois**.

Pour chaque fonctionnalité évoquée, poser systématiquement les trois questions qui révèlent le vrai coût :

- **Qui peut le faire ?** (tous, certains rôles, l'admin seul)
- **Que se passe-t-il si ça échoue ?** (erreur réseau, données invalides, action concurrente)
- **Est-ce annulable ?** (et si oui, pendant combien de temps)

C'est là que les fonctionnalités « simples » révèlent leur coût réel.

## Passe 3 — Les oubliés

Le cœur de la valeur. Ces questions ne viennent jamais du client, et ce sont elles qui explosent le planning si on les découvre tard. Elles sont listées en fin de chaque fichier de `references/`.

## Passe 4 — Le non-fonctionnel

- **Volumétrie** — combien d'utilisateurs, d'enregistrements, de fichiers dans un an ? Un écran qui marche à 50 lignes et pas à 50 000 est un écran non spécifié.
- **Performance perçue** — qu'est-ce qui doit être instantané, qu'est-ce qui peut prendre 3 secondes ?
- **Conformité** — appliquer `aq-nlpd`. Export et suppression des données personnelles sont des **fonctionnalités**, à chiffrer, pas des cases à cocher.
- **Langues** — quelles langues, qui traduit, le contenu créé par les utilisateurs est-il traduit ?
- **Hors ligne** — que se passe-t-il sans réseau ? Sur mobile, cette réponse change l'architecture, pas seulement l'UI.
- **Accessibilité** — clavier et contraste sont le plancher, jamais une option.

## Passe 5 — L'arbitrage

Sans cette passe, tout le reste est inutile.

1. Reprendre la liste complète et classer chaque item : **MVP / Phase 2 / Jamais**. La colonne « Jamais » doit contenir quelque chose — sinon l'arbitrage n'a pas eu lieu.
2. Poser la question qui force : **« Si tu ne pouvais livrer que trois fonctionnalités, lesquelles ? »** Tout ce qui n'est pas dans ces trois-là est suspect en MVP.
3. Vérifier que le MVP couvre le parcours principal de la passe 1 **de bout en bout**. Un MVP qui s'arrête au milieu du parcours n'est pas livrable.
4. Pour chaque item MVP, estimer en taille relative (S / M / L). Pas en heures.
5. Signaler les dépendances : ce qui ne peut pas commencer avant autre chose.

## Sortie

Trois fichiers, produits seulement à la fin :

- `docs/features.md` — l'inventaire complet, avec la colonne d'arbitrage (`templates/features.md`)
- `docs/stories/` — une story par fichier, format INVEST (`templates/story.md`)
- `docs/roadmap.md` — MVP, phase 2, écarté, avec les dépendances (`templates/roadmap.md`)

Puis proposer `aq-init` si le projet n'existe pas encore.

## Règles de conduite

- **Un domaine à la fois.** Ne jamais envoyer trente questions d'un coup.
- **Proposer un défaut sur chaque question**, pour qu'on puisse répondre « ok » et avancer.
- **Ne jamais accepter « ce serait bien de pouvoir aussi »** sans le ranger immédiatement en MVP, Phase 2 ou Jamais.
- **Marquer `[à confirmer]`** tout ce dont l'utilisateur n'est pas sûr, et regrouper ces points en fin de session.
- **Dire à voix haute quand une réponse coûte cher.** « Multi-utilisateurs avec rôles, ça double la surface de tests » se dit pendant la spec, pas dans le devis.
- **Faire des pauses.** Après chaque passe, résumer en cinq lignes et demander si on continue. Une session d'une heure sans respiration produit des réponses de complaisance.
- **Ne pas concevoir l'UI ici.** La direction artistique est l'étape 2 de `aq-init`.
