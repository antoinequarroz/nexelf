---
name: aq-email
description: Conçoit, configure et valide les emails transactionnels, de sécurité, d'onboarding et marketing d'un projet AQ avec Resend. À utiliser pour un formulaire de contact, une confirmation, Better Auth, une invitation, une réinitialisation, un reçu, un email Stripe ou RevenueCat, une relance d'onboarding, un template, SPF, DKIM, DMARC, délivrabilité, webhooks, rebonds, plaintes, consentement ou désinscription. Fonctionne pour vitrine, CMS, SaaS et backend mobile ; pose les questions métier avant d'envoyer et maintient tout secret côté serveur.
---

# Email AQ

Envoyer le bon message, une seule fois, depuis un domaine crédible et avec une issue claire en cas d'échec. Ne pas ajouter d'email parce qu'il « se fait habituellement ».

## 1. Cadrer progressivement

Lire `AGENTS.md`, la spec, les parcours d'auth, onboarding et paiement. Demander un bloc à la fois :

1. Quels événements exigent un email et quelle action le destinataire doit-il accomplir ?
2. Transactionnel, sécurité, produit ou marketing ? Quel consentement et quelle base de traitement ?
3. Qui possède le compte Resend, le domaine DNS et les adresses de réponse ?
4. Quelles langues, identité visuelle, expéditeur, support et délais ?
5. Quels volumes, pics, environnements et exigences de résidence/rétention ?

Séparer les messages indispensables des relances optionnelles. Pour le marketing, appeler `aq-nlpd` et ne pas mélanger consentement marketing et emails nécessaires au service.

## 2. Écrire le plan

Copier `assets/email.md` vers `docs/email.md`. Pour chaque message, définir déclencheur, destinataire, finalité, template, variables, langue, CTA, idempotence, expiration, retries et événement de livraison utile.

Lire `references/messages.md` pour les cas auth, CMS, SaaS et mobile. Obtenir l'accord avant l'implémentation.

## 3. Configurer le domaine

Lire `references/resend.md` et la documentation officielle actuelle.

- Le client possède le compte et le domaine.
- Préférer un sous-domaine d'envoi dédié pour isoler la réputation.
- Ajouter exactement les entrées SPF et DKIM données par Resend ; ne jamais créer un second enregistrement SPF concurrent.
- Déployer DMARC progressivement : observation, analyse de toutes les sources, puis politique plus stricte.
- Définir des adresses `from` stables et un `reply-to` réellement surveillé.
- Séparer production des tests ; ne jamais envoyer à de vrais clients depuis local ou preview.

Documenter chaque action DNS manuelle et vérifier les en-têtes reçus, pas seulement le statut du dashboard.

## 4. Implémenter côté serveur

- Garder la clé API et le secret webhook hors du client Nuxt/Expo et de Git.
- Envoyer depuis une action ou route serveur ; jamais depuis une mutation Convex ni directement depuis Expo.
- Valider et normaliser les destinataires et variables avant rendu.
- Utiliser une clé d'idempotence stable par message métier et conserver aussi l'état d'envoi côté application quand la garantie dépasse la fenêtre du fournisseur.
- Mettre les envois différables dans une file ou un job avec retries bornés et backoff.
- Ne pas journaliser corps, tokens ou données personnelles inutiles.
- Prévoir une version texte, une langue déterministe et une URL absolue autorisée.

Un clic sur « envoyer » ne doit pas bloquer une transaction métier externe. Enregistrer l'intention, effectuer l'envoi hors transaction, puis stocker le résultat.

## 5. Construire les templates

- Une intention et un CTA principal par email.
- Sujet et préheader explicites, identité d'expéditeur reconnaissable.
- HTML simple et robuste, largeur mobile, contraste, ordre de lecture et liens visibles.
- Version texte utile ; informations essentielles jamais uniquement dans une image.
- Chaînes traduites et variables échappées ; aucune couleur ou copie métier dispersée dans le code.
- Liens de sécurité à usage unique, durée limitée, sans secret dans les analytics.
- Pour marketing : identité de l'expéditeur, préférences et désinscription fonctionnelle.

Tester avec des données minimales, longues, absentes et dans chaque langue.

## 6. Traiter les événements

Vérifier la signature de tout webhook avec le corps brut et le secret prévu. Dédupliquer avec l'identifiant unique de l'événement avant tout effet.

- `delivered` informe la délivrabilité, pas la lecture.
- Un hard bounce ou une plainte bloque les futurs envois non indispensables à l'adresse.
- Les soft bounces ont des retries limités.
- Les ouvertures et clics sont imparfaits et peuvent nécessiter consentement ; ne pas les activer par réflexe.
- Les erreurs permanentes doivent être visibles dans l'admin ou l'observabilité sans exposer le contenu.

## 7. Valider

Tester en environnement dédié :

- SPF, DKIM et DMARC dans les en-têtes ;
- rendu mobile/desktop, texte brut, mode sombre et images bloquées ;
- toutes les langues et variables limites ;
- lien, expiration, usage unique et mauvaise identité ;
- double déclenchement sans double email ;
- retry après erreur temporaire ;
- webhook valide, signature invalide et événement dupliqué ;
- bounce, plainte, désinscription et arrêt des relances ;
- absence de clé ou contenu sensible dans client, logs et analytics.

Terminer par **Messages décidés**, **Domaine validé**, **Envois testés**, **Événements traités**, **Reste manuel**.
