# Choix d'architecture

## Option A — plugin Organization Better Auth

À choisir uniquement si la documentation du composant Convex et les versions exactes installées confirment le support des tables/options nécessaires.

- Better Auth possède organisations, appartenances et invitations.
- Convex récupère l'identité et vérifie côté serveur l'appartenance/capacité avant d'accéder aux ressources métier.
- Les rôles/capacités serveur et client utilisent la même définition typée, sans faire confiance au résultat client.
- Les migrations suivent la procédure spécifique au composant : un install local et le composant préconfiguré n'ont pas les mêmes possibilités de schéma.

Documentation actuelle : <https://better-auth.com/docs/plugins/organization> et <https://labs.convex.dev/better-auth>. Certaines pages peuvent décrire une version bêta plus récente que le projet.

## Option B — organisations applicatives Convex

À choisir si le plugin n'est pas compatible, si le besoin métier dépasse son modèle, ou si le projet doit rester sur ses versions épinglées.

- Better Auth possède utilisateurs/sessions.
- Les tables applicatives Convex possèdent organisations, membres, invitations et permissions.
- Les mutations Convex exécutent le cycle de vie ; les emails partent dans des actions après enregistrement transactionnel.
- Web et mobile consomment exactement les mêmes queries/mutations.

## Interdit — double écriture

Ne pas écrire une appartenance dans Better Auth puis dans une table Convex sans transaction commune ni mécanisme de reprise. Si une projection est indispensable, définir source, événement, idempotence, reconciliation, alerte de divergence et reconstruction complète.

Écrire dans l'ADR : versions, option choisie, source de vérité, raison, porte de sortie et stratégie de migration.
