# 07 — Contrôler la mémoire de Nexelf

Statut : à faire  
Taille : L  
Dépend de : 06

## Récit

En tant qu'utilisateur, je veux voir et contrôler ce que Nexelf retient afin de bénéficier de la personnalisation sans perdre ma vie privée.

## Critères d'acceptation

- [ ] Chaque souvenir proposé affiche catégorie, source et date avant confirmation.
- [ ] L'utilisateur peut corriger, supprimer ou désactiver la mémoire.
- [ ] Une conversation peut être exclue de la mémoire.
- [ ] L'export de compte inclut la mémoire.

## Cas limites

- État vide : Nexelf explique qu'aucune information n'est mémorisée silencieusement.
- Erreur : une suppression locale est marquée en attente puis réessayée.
- Chargement : l'écran distingue les éléments synchronisés et en attente.
- Permissions : aucun administrateur ne voit le contenu sans consentement explicite.

## Hors périmètre de cette story

- Recherche sémantique avancée et règles personnalisées.

## Notes techniques

Séparer faits durables, préférences, contraintes et observations temporaires.
