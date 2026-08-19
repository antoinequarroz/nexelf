# Sécurité et évaluations IA

## Jeu d'évaluation

Inclure exemples attendus, erreurs fréquentes, entrées vides/longues, langues, données contradictoires, injection, demande interdite et action sans permission. Versionner entrée, résultat attendu, rubric, prompt, modèle et paramètres.

## Actions

Le modèle n'obtient jamais un outil générique de base de données ou réseau. Chaque outil possède schéma strict, autorisation serveur, limites, idempotence et confirmation selon impact.

## RAG

Filtrer les documents par permission avant récupération, puis vérifier à nouveau la ressource citée. Ne jamais compter sur le modèle pour ignorer les documents d'un autre tenant. Afficher sources seulement si elles sont réellement accessibles.

## Production

Observer erreurs, latence, tokens/coût, refus et feedback sans stocker prompts/réponses personnels par défaut. Prévoir kill switch et voie non-IA.
