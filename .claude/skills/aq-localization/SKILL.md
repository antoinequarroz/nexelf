---
name: aq-localization
description: >-
  Cadre, implémente et valide la localisation d'une vitrine, CMS, SaaS ou app
  mobile AQ : langues et variantes régionales, @nuxtjs/i18n/Expo, routes,
  fallback, formats de dates/nombres/devises, contenu CMS, emails,
  notifications, SEO international, traduction humaine, workflow éditorial,
  pseudo-localisation et tests. À utiliser pour ajouter une langue, préparer un
  lancement international ou corriger des chaînes et formats codés en dur.
---

# Localisation AQ

Concevoir une expérience locale complète, pas seulement remplacer des chaînes. `fr-CH`, `fr-FR`, `de-CH` et `de-DE` ne partagent pas automatiquement formats, ton, droit ou SEO.

## 1. Cadrer

Demander : marchés, langues/locales, priorité, traducteur, contenu concerné, langue source, fallback, URLs, domaines, devises, fuseaux, support et date. Distinguer interface, contenu éditorial, emails, documents, données utilisateur et contenu généré.

Poser les questions UX/UI : sélecteur, détection, persistance, changement au milieu d'un formulaire, textes longs, mobile, langues RTL potentielles et contenu manquant.

Copier `assets/localization-plan.md` vers `docs/localization.md`.

## 2. Définir les locales

- Utiliser tags BCP 47 explicites lorsque la région change formats ou contenu.
- Choisir une locale canonique source et une chaîne de fallback documentée.
- Ne jamais utiliser la langue pour déduire pays légal, devise, fuseau ou résidence.
- Persister le choix explicite de l'utilisateur ; la détection navigateur/appareil ne sert que de défaut initial.
- Définir comportement des contenus non traduits : fallback visible, masquer ou bloquer publication selon le produit.

## 3. Structurer les chaînes

- Aucune chaîne UI en dur ; utiliser clés sémantiques stables.
- Employer interpolation nommée, pluriels natifs et formats Intl ; ne pas concaténer des fragments traduits.
- Conserver ponctuation et ordre dans le message traduisible.
- Fournir contexte, capture et contraintes au traducteur.
- Séparer copie légale/marketing nécessitant validation humaine.
- Ne pas stocker HTML arbitraire dans les traductions ; composer des composants sûrs.

Lire `references/content-seo.md` pour CMS et web public.

## 4. Formater les données

Utiliser `Intl` ou API plateforme pour dates, heures, nombres, pourcentages, devises, unités et listes. Stocker valeurs canoniques : instants UTC + fuseau métier, montants en unité mineure + devise, nombres non formatés.

Ne jamais parser une valeur métier depuis sa représentation localisée sans locale explicite et validation. Vérifier espaces insécables, ordre jour/mois, semaine, 12/24 h, séparateurs et arrondis.

## 5. Routes, SEO et stores

- Pour le web public, choisir stratégie d'URL stable, canonical, alternates `hreflang`, sitemap et redirections avec `aq-seo`.
- Ne pas rediriger agressivement les robots ou utilisateurs selon IP/langue sans issue manuelle.
- Traduire métadonnées, Open Graph, données structurées et erreurs publiques.
- Pour mobile, localiser nom/description/captures stores et permissions système selon les capacités actuelles.
- Deep links doivent conserver locale quand pertinent sans créer de frontière de sécurité.

## 6. Contenu, emails et notifications

- Modéliser état par locale : brouillon, à relire, validé, publié et obsolète.
- Une modification source doit signaler les traductions potentiellement périmées.
- Prévoir slug unique, relation entre variantes et aperçu.
- Utiliser la locale du destinataire enregistrée lors de l'envoi ; fallback déterministe.
- Tester templates `aq-email`, `aq-notifications`, CGV/politique et documents dans chaque locale.
- Ne pas envoyer automatiquement une traduction machine de contenu juridique ou à fort impact sans validation.

## 7. Workflow de traduction

Définir propriétaire, glossaire, ton, mémoire/outil, export/import, revue et critères de publication. La traduction automatique peut préparer un brouillon si confidentialité et fournisseur sont validés ; marquer son état et faire relire selon impact.

Éviter que les clés supprimées s'accumulent. Ajouter un contrôle CI pour clés manquantes, inutilisées, placeholders divergents et JSON invalide.

## 8. Tester

Tester chaque locale, fallback et préférence ; pseudo-localisation avec texte allongé et caractères accentués ; pluriels 0/1/2/autres ; formats et fuseaux limites ; routes/canonical/hreflang ; contenu manquant ; emails ; erreurs ; clavier/lecteur d'écran ; petits écrans ; changement de langue pendant auth, paiement et formulaire ; absence de chaînes codées en dur.

Terminer par **Locales**, **Fallback**, **Chaînes**, **Formats**, **Contenu**, **SEO/stores**, **Workflow**, **Reste manuel**.
