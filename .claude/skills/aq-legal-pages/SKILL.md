---
name: aq-legal-pages
description: >-
  Cadre, rédige, intègre et maintient les pages et mentions légales d'un projet
  AQ à partir de faits vérifiés : politique de confidentialité,
  impressum/mentions légales, cookies, CGU, CGV, abonnements, remboursements,
  suppression de compte, formulaires, pricing et informations App Store/Google
  Play. À utiliser pour une vitrine, un CMS, un SaaS ou une app mobile avant
  publication, après ajout d'un sous-traitant ou changement de données/paiements.
  Travaille avec nLPD suisse, RGPD et règles des stores, signale chaque point à
  faire valider et ne remplace jamais un avocat, une fiduciaire ou un conseil
  juridique.
---

# Pages légales AQ

Transformer les pratiques réelles du produit en informations claires et accessibles. Ne jamais rendre un projet « conforme » en copiant un modèle que son fonctionnement contredit.

## Avertissement obligatoire

Cette skill fournit un cadrage technique et des **brouillons**, pas un conseil juridique. Le client reste responsable des informations et doit faire valider les textes selon son activité, ses marchés et son niveau de risque.

- Ne jamais inventer identité juridique, finalité, base légale, durée, garantie, remboursement, TVA, juridiction ou limitation de responsabilité.
- Ne jamais copier les conditions d'un concurrent.
- Marquer chaque inconnue avec `[À FOURNIR]` et chaque décision professionnelle avec `[À VALIDER — JURISTE]` ou `[À VALIDER — FIDUCIAIRE]`.
- Ne pas publier automatiquement un brouillon contenant un marqueur non résolu.
- Les écrans, consentements et processus techniques doivent correspondre aux textes.

## 1. Choisir le niveau d'intervention

Lire `AGENTS.md`, brief, spec, stack, `docs/pricing.md`, `docs/analytics.md`, `docs/email.md`, sous-traitants, formulaires, auth, paiements et stores.

Demander : **inventaire**, **brouillons**, ou **brouillons validés puis intégration**. Proposer le dernier parcours, avec une étape de validation humaine obligatoire avant publication.

Choisir les guides pertinents :

- confidentialité nLPD/RGPD : `references/privacy.md` et `aq-nlpd` ;
- vente, abonnement et utilisation : `references/commerce.md` ;
- stores et suppression de compte : `references/mobile.md`.

## 2. Mener l'entretien factuel

Poser un bloc à la fois. Réutiliser les réponses documentées et demander au client de confirmer les faits sensibles.

### Exploitant et périmètre

- Personne/entreprise responsable, forme juridique, adresse, pays, registre/IDE/TVA si applicable, email de contact.
- Nom du service/app, domaines, entités qui vendent et qui traitent les données.
- Marchés et langues visés, B2B/B2C, catégories réglementées et âge minimum.

### Données

- Données collectées directement, observées, déduites et reçues de tiers.
- Finalité concrète de chaque traitement et caractère obligatoire/facultatif.
- Destinataires, sous-traitants, pays/régions, transferts et contrats.
- Conservation réellement appliquée, sauvegardes, export, rectification, opposition et suppression.
- Cookies/stockage local, analytics, publicité, emails et notifications.
- Données sensibles, mineurs, profilage ou décisions automatisées.

### Produit et contenu

- Comptes, organisations, rôles, contenu utilisateur, modération et licences nécessaires.
- Disponibilité promise, support, maintenance, suspension et résiliation.
- Propriété intellectuelle du service et droits du client sur ses données/contenus.

### Vente et paiement

- Produit/service vendu, prix/devise, taxes, fréquence, essai et carte requise.
- Renouvellement, annulation, accès après annulation, prorata, impayés et changements de prix.
- Paiement unique, crédits, usage, sièges, acomptes ou devis.
- Remboursement/rétractation réellement proposé et exceptions à valider.
- Stripe, Apple, Google ou autre marchand/prestataire et qui émet la facture/reçu.

Ne pas transformer « je ne sais pas » en clause. L'ajouter à la liste de décisions.

## 3. Construire la matrice de vérité

Copier `assets/legal-brief.md` vers `docs/legal/legal-brief.md`. Pour chaque affirmation juridique, relier : fait produit, source/preuve, texte concerné, implémentation et responsable de validation.

Comparer ensuite le projet aux textes :

- un sous-traitant installé mais absent de la politique est un écart ;
- une durée écrite mais sans purge technique est un écart ;
- une désinscription écrite mais non fonctionnelle est un écart ;
- une suppression annoncée mais limitée à une désactivation est un écart ;
- un renouvellement ou prix masqué par l'UI est un écart.

Résoudre l'écart dans le produit ou corriger le brouillon avant publication.

## 4. Déterminer les documents nécessaires

Ne pas générer tous les documents par réflexe.

### Tous projets collectant des données

- politique de confidentialité ;
- information courte au point de collecte ;
- impressum/mentions légales selon activité et marchés ;
- politique/paramètres cookies si des traceurs ou stockages le justifient.

### Comptes, CMS ou SaaS

- CGU ou conditions de service ;
- règles de contenu/modération si contenu utilisateur ;
- procédure de suppression et page publique si nécessaire ;
- conditions de support/SLA seulement si promises.

### Vente

- CGV/conditions d'abonnement ;
- politique d'annulation/remboursement ;
- mentions pricing/checkout/facture à faire valider ;
- conditions de devis/acompte pour services.

### Mobile

- politique accessible dans l'app et dans les métadonnées stores ;
- page web publique de suppression pour Google Play si comptes ;
- suppression initiable dans l'app pour Apple si création de compte ;
- informations et liens d'abonnement conformes au store.

## 5. Rédiger les brouillons

Créer les fichiers nécessaires dans `docs/legal/`, avec un fichier par document et une date/version. Rédiger en langage clair, cohérent avec la langue du public, avec navigation et coordonnées faciles à trouver.

Une politique de confidentialité doit au minimum refléter les faits vérifiés : responsable/contact, catégories de données, collecte, finalités, destinataires/sous-traitants, transferts, conservation, sécurité à un niveau approprié, droits et méthode de demande, cookies/analytics, mises à jour.

Les conditions doivent refléter offre, compte, usage permis/interdit, propriété, paiement, renouvellement, résiliation, contenu utilisateur, support et responsabilités **uniquement selon décisions validées**.

Séparer clairement :

- texte destiné à être publié ;
- commentaires de travail non publiables ;
- marqueurs à résoudre ;
- journal des validations et versions.

## 6. Traiter consentements et points de collecte

- Une checkbox n'est pas une base universelle : demander à `aq-nlpd` quelle logique technique est attendue et faire valider juridiquement.
- Consentement marketing séparé, facultatif, non précoché et prouvable.
- Refus des cookies non essentiels aussi accessible que l'acceptation ; préférences modifiables.
- Formulaires : finalité courte et lien vers la politique avant envoi.
- Checkout/paywall : prix, période, renouvellement, essai et conséquence du CTA visibles avant engagement.
- Inscription : distinguer acceptation nécessaire des conditions et inscription marketing facultative.

Conserver version du texte accepté, horodatage et preuve minimale quand nécessaire, sans journaliser plus de données que requis.

## 7. Aligner suppression, abonnement et données

Définir avec `aq-auth`, `aq-organizations`, `aq-stripe`/`aq-revenuecat` et `aq-backup` :

- qui peut demander la suppression et comment réauthentifier ;
- suppression immédiate, délai, annulation et données légalement conservées ;
- organisations, contenu partagé, factures, audit et sauvegardes ;
- abonnement store qui peut continuer après suppression du compte ;
- export préalable et état des intégrations tierces ;
- page externe Google Play et parcours in-app Apple/Google.

Ne pas promettre la suppression de données que le système ne sait pas identifier ou purger. Ne pas conserver « au cas où ».

## 8. Faire valider

Avant publication, produire trois listes :

1. faits confirmés par le client ;
2. décisions juriste/fiduciaire encore ouvertes ;
3. écarts techniques à corriger.

Le validateur reçoit les brouillons, la matrice, la liste des sous-traitants, marchés, modèle de paiement et flux de suppression — pas seulement une page isolée.

Enregistrer date, personne, version et périmètre de validation. Une validation ancienne ne couvre pas automatiquement un nouveau fournisseur, pays ou modèle commercial.

## 9. Intégrer après validation

- Convertir uniquement la version validée vers les routes/composants/CMS du projet.
- Utiliser i18n ou contenu versionné ; aucune chaîne dispersée.
- Conserver titres, listes, liens et lisibilité mobile/accessibilité via `aq-accessibility`.
- Ajouter liens persistants dans footer, formulaires, inscription, checkout, paramètres et stores selon pertinence.
- Afficher date d'entrée en vigueur/version.
- Protéger les pages publiques nécessaires de l'auth et de `noindex` accidentel, notamment confidentialité et suppression.
- Tester tous les liens, formulaires de droits, préférences et suppression de bout en bout.

Ne pas déployer si un `[À FOURNIR]` ou `[À VALIDER` reste dans le contenu publié.

## 10. Maintenir

Déclencher une revue après : nouveau fournisseur/SDK, nouvelle donnée/finalité, nouveau pays, analytics/publicité, changement de pricing/paiement, contenu utilisateur, IA, incident, changement d'entité ou règle store.

Ajouter la revue annuelle à `aq-maintenance`. Garder anciennes versions et dates pour savoir ce qui était présenté/accepté, sans exposer les commentaires juridiques internes.

## Résultat attendu

- matrice factuelle et documents réellement nécessaires ;
- brouillons clairement marqués et non publiés avant validation ;
- décisions juriste/fiduciaire explicites ;
- pratiques techniques alignées aux textes ;
- parcours consentement, paiement et suppression testés ;
- pages accessibles, versionnées et maintenables.

Terminer par **Documents requis**, **Faits confirmés**, **À valider**, **Écarts techniques**, **Version publiable**, **Prochaine revue**.
