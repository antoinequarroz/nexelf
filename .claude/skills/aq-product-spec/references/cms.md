# Banque de questions — CMS

Base par défaut : back-office maison (Convex + Better Auth). Ces questions déterminent s'il tient, ou s'il faut basculer sur Directus.

## 1. Les types de contenu

- Lister **tous** les types de contenu éditables. Page, article, service, membre de l'équipe, témoignage, offre d'emploi…
- Pour chacun : quels champs exactement ? (titre, texte riche, image, date, lien, prix…)
- Combien d'éléments par type, à un an ?
- Y a-t-il des relations ? (un article a un auteur, un service a des témoignages)

**Seuil de bascule : au-delà de 8 à 10 types distincts, Directus devient plus raisonnable qu'un back-office maison.** Compter à voix haute pendant cette passe.

## 2. Qui édite, et comment

- Combien de personnes éditent ? Quel est leur niveau réel avec un ordinateur ?
- Un seul rôle, ou éditeur / administrateur ?
- Quelqu'un doit-il **valider** avant publication ?
- À quelle fréquence : plusieurs fois par semaine, ou trois fois par an ? (trois fois par an = peut-être pas de CMS du tout)
- L'édition se fait-elle depuis un téléphone ? (change la conception du back-office)

## 3. L'expérience d'édition

- Texte riche : quelles options sont vraiment utiles ? (gras, lien, titres… une barre d'outils complète invite à casser la mise en page)
- Images : upload, recadrage, texte alternatif obligatoire ?
- L'éditeur peut-il **prévisualiser** avant publication ?
- Peut-il programmer une publication à une date ?
- Peut-il réorganiser l'ordre des éléments ? Par glisser-déposer ?
- Peut-il créer de nouvelles pages, ou seulement modifier celles qui existent ? (créer librement = besoin de règles de navigation et de SEO)

## 4. Structure et navigation

- Le menu est-il éditable, ou figé dans le code ?
- Les URL sont-elles éditables ? Que se passe-t-il si l'éditeur change une URL déjà indexée ? (redirection automatique, ou 404 en production)
- Pages spéciales : accueil, contact, mentions légales — éditables ou non ?

## 5. Multilingue

- Chaque contenu existe-t-il dans toutes les langues, ou certaines pages sont-elles mono-langue ?
- Que voit un visiteur quand une traduction manque ? Langue par défaut, ou page masquée ?
- Qui traduit, et à quel moment du flux d'édition ?

## 6. Médias

- Bibliothèque de médias partagée, ou upload par contenu ?
- Redimensionnement et formats modernes automatiques ?
- Texte alternatif obligatoire ? (accessibilité, et ça se gagne à l'édition, pas après)
- Volume et poids attendus ? Vidéos ?

## Les oubliés — passe 3

- **Que se passe-t-il si l'éditeur supprime quelque chose par erreur ?** Corbeille, historique, ou rien ?
- **Historique des modifications** : qui a changé quoi, quand ? Minimum vital dès qu'il y a deux éditeurs.
- **Un brouillon en cours peut-il être perdu** en fermant l'onglet ? Sauvegarde automatique ?
- **Deux éditeurs sur le même contenu en même temps.**
- **Le contenu doit-il rester lisible si le back-office tombe ?** (contenu servi en statique = oui)
- **Formation et documentation** : qui forme l'éditeur, sous quelle forme ? Compter une session et un mémo écrit.
- **Que devient le site si le client arrête de payer l'hébergement du back-office ?**
- **Champs obligatoires** : que se passe-t-il si l'éditeur publie sans image ? Le design doit tenir sans.
