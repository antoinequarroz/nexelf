# Formats d'échange

- CSV : définir UTF-8, délimiteur, guillemets, retours ligne et protection contre les formules. Fournir un modèle réel.
- XLSX : limiter feuilles/cellules/taille, ignorer macros, ne jamais exécuter formules ou liens externes, sélectionner explicitement la feuille.
- JSON : versionner le schéma, limiter profondeur/taille et refuser clés inattendues selon le contrat.
- Dates : préférer ISO 8601 dans les formats machine ; demander fuseau pour tout instant.
- Nombres : stocker valeur canonique ; devise dans une colonne distincte. Ne pas deviner virgule/point ambigu.
- Booléens/enums : publier les valeurs acceptées, localiser seulement l'affichage.
