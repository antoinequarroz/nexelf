---
name: aq-accessibility
description: Audite, conçoit, corrige et valide l'accessibilité d'un projet AQ web Nuxt ou mobile Expo selon WCAG 2.2 AA et les conventions natives iOS/Android. À utiliser pour un audit a11y, navigation clavier, focus, lecteur d'écran, contrastes, taille de texte, formulaires, erreurs, modales, menus, tableaux, graphiques, médias, animations, zones tactiles, VoiceOver, TalkBack, axe, Playwright ou Maestro. Fonctionne pour vitrine, CMS, SaaS et mobile, pose les questions d'usage avant les corrections et exige des tests manuels en plus des outils automatisés.
---

# Accessibilité AQ

Rendre les parcours importants utilisables avec différentes capacités, technologies d'assistance et conditions d'usage. Un score automatisé n'est ni un audit complet ni une preuve de conformité.

## Cadre

- Viser WCAG 2.2 niveau AA sur le web, sauf exigence contractuelle différente.
- Pour Expo, appliquer les principes WCAG pertinents et les conventions/accessibility APIs natives iOS et Android.
- Ne pas déclarer une conformité légale sans audit adapté au périmètre et validation humaine.
- Distinguer défaut vérifié, bonne pratique, préférence utilisateur et amélioration hors périmètre.
- Ne jamais corriger un problème en masquant le contenu aux technologies d'assistance ou en supprimant une fonctionnalité utile sans alternative.

## 1. Cadrer l'intervention

Lire `AGENTS.md`, `docs/design.md`, composants, routes/écrans, analytics, retours utilisateurs et exigences client. Demander progressivement :

1. Audit seul, corrections prioritaires ou mise en conformité du périmètre complet ?
2. Quelles plateformes, langues, navigateurs/appareils et versions sont supportés ?
3. Quels sont les trois parcours essentiels : contact, achat, auth, onboarding, publication ou tâche métier ?
4. Des utilisateurs ou contraintes connus : basse vision, daltonisme, mobilité, cognition, audition, clavier, lecteur d'écran, texte agrandi ?
5. Quel niveau/cadre est contractuel et qui valide l'acceptation ?

Définir un échantillon représentatif : templates uniques, composants complexes, états et parcours critiques. Un audit de l'accueil seul ne couvre pas un produit.

## 2. Établir la méthode et la référence

Copier `assets/accessibility.md` vers `docs/accessibility.md`. Noter versions, environnement, viewport, technologie d'assistance et données de test.

Choisir la référence :

- Web : lire `references/web.md`.
- Expo/React Native : lire `references/mobile.md`.
- Tests et preuves : lire `references/testing.md`.

Mesurer avant de corriger pour garder une liste reproductible. Classer chaque constat par critère, impact utilisateur, fréquence et blocage du parcours — pas seulement par sévérité de l'outil.

## 3. Auditer la structure et la compréhension

Vérifier sur chaque template :

- langue de page/élément et changement de langue ;
- titre de page/écran et hiérarchie compréhensible ;
- landmarks/régions, ordre de lecture et navigation cohérente ;
- liens et boutons nommés par leur action/destination ;
- texte utile disponible autrement qu'en image, couleur ou position ;
- instructions, labels et erreurs compréhensibles sans jargon ;
- contenu traduit long, zoom et texte agrandi sans perte.

La sémantique native est préférable à une imitation par `div`/gestes et ARIA. ARIA ne répare pas un comportement absent.

## 4. Auditer clavier, focus et gestes

### Web

- Tout accomplir avec Tab, Shift+Tab, Entrée, Espace, flèches et Échap selon le composant.
- Ordre de focus logique, visible et non masqué par header, modal ou bandeau.
- Aucun piège clavier ; retour du focus au déclencheur après fermeture.
- Skip link vers le contenu et navigation répétée évitable quand pertinente.
- Drag-and-drop, hover et gestes complexes ont une alternative simple.

### Mobile

- Ordre VoiceOver/TalkBack cohérent et éléments décoratifs ignorés.
- Actions, rôles, états, valeurs et hints annoncés sans duplication.
- Alternatives aux gestes complexes et actions accessibles disponibles.
- Focus déplacé/annoncé lors d'un changement majeur sans provoquer de bruit permanent.
- Clavier logiciel, switch control, clavier externe et orientation testés selon le support.

## 5. Auditer perception et présentation

- Contraste du texte, icônes informatives, bordures/états et focus selon le critère applicable.
- Information jamais transmise uniquement par couleur.
- Zoom web jusqu'au niveau requis et reflow étroit sans défilement bidimensionnel inutile.
- Texte mobile dynamique sans troncature, chevauchement ni contrôle inaccessible.
- Zones tactiles suffisamment grandes/espacées ; viser plus généreux que le minimum quand possible.
- `prefers-reduced-motion` et réglages natifs réduisent ou retirent les mouvements non essentiels.
- Aucun flash dangereux, autoplay sonore ou mouvement impossible à arrêter.
- Images alternatives selon leur fonction ; décorations ignorées.
- Vidéos parlées sous-titrées et contenu pertinent transcrit via `aq-media`.

## 6. Auditer formulaires et authentification

- Label programmatique, nom accessible et indication visuelle pour chaque champ.
- Type/autocomplete approprié et clavier mobile adapté.
- Champs obligatoires et format expliqués avant l'erreur.
- Erreur reliée au champ, résumée si nécessaire, annoncée et conservant la saisie valide.
- Succès, chargement et progression annoncés sans déplacer le focus arbitrairement.
- Pas de délai court sans extension/contrôle.
- Authentification compatible avec gestionnaires de mots de passe, copier-coller et alternatives aux tests cognitifs.
- Confirmation et possibilité de corriger avant action financière, juridique ou destructive.

Ne jamais désactiver le collage dans un mot de passe ou code par réflexe.

## 7. Auditer les composants complexes

Tester comportement et annonce, pas seulement attributs :

- dialogs, drawers, popovers et menus ;
- tabs, accordéons, combobox/autocomplete et date pickers ;
- toasts, alertes, progression et contenu temps réel ;
- tables, tri, filtres, pagination et sélection ;
- graphiques avec résumé, données ou alternative ;
- carrousels avec contrôle et sans rotation imposée ;
- états vide, chargement, erreur, interdit, hors ligne et paywall.

Utiliser les composants Nuxt UI/natifs existants s'ils sont accessibles, mais vérifier leur usage et leur version. Une bibliothèque ne garantit pas la page assemblée.

## 8. Corriger par impact

Prioriser :

1. parcours impossible ou information absente ;
2. auth, paiement, formulaire, publication et navigation ;
3. composant partagé qui corrige plusieurs pages ;
4. problèmes fréquents de contraste, focus, zoom et texte ;
5. améliorations de confort.

Corriger dans la primitive ou le composant source quand le défaut est partagé. Respecter i18n et tokens : aucune chaîne/couleur locale de contournement. Ajouter un test de régression pour chaque bug reproductible important.

Ne pas changer une identité visuelle structurante sans expliquer le problème, proposer des options et obtenir la validation appropriée.

## 9. Tester automatiquement

L'automatisation détecte une partie limitée mais répétable :

- intégrer axe aux parcours Playwright représentatifs sur web ;
- utiliser sélecteurs par rôle/nom accessible ;
- garder lint et tests unitaires des helpers/composants ;
- pour Expo, utiliser les assertions accessibles disponibles et Maestro pour les parcours, sans prétendre remplacer VoiceOver/TalkBack ;
- tester états et thèmes, pas seulement la page chargée heureuse.

Éviter de désactiver une règle axe globalement. Documenter une exception avec critère, raison, portée et date de revue.

## 10. Tester manuellement

### Web minimum

- parcours critiques uniquement au clavier ;
- lecteur d'écran sur au moins une combinaison réellement supportée ;
- zoom/reflow, contraste/états, réduction de mouvement ;
- mobile tactile et contenu traduit long.

### Mobile minimum

- VoiceOver sur appareil/simulateur approprié et TalkBack sur appareil/émulateur équipé ;
- texte système agrandi, gras/contraste si supportés ;
- réduction des animations, orientation et tailles d'écran ;
- permissions refusées, hors ligne et erreurs.

Enregistrer étapes, résultat et technologie exacte. « Testé au lecteur d'écran » sans parcours ni plateforme n'est pas une preuve.

## 11. Rapporter et valider

Pour chaque problème : emplacement, scénario, résultat actuel, résultat attendu, critère/référence, impact, preuve et correction proposée. Après correction, retester avec la même méthode puis le parcours complet.

- Lancer `pnpm check`, tests ciblés et e2e.
- Vérifier qu'aucun composant voisin ne régresse.
- Marquer ce qui reste non testé, non applicable ou dépend d'une validation externe.
- Ajouter les contrôles essentiels à `aq-ship`/`aq-maintenance` sans recopier tout l'audit.

Terminer par **Périmètre**, **Bloquants**, **Corrigé**, **Tests automatiques**, **Tests manuels**, **Limites**, **Prochaine revue**.
