---
name: aq-nlpd
description: Points de conformite nLPD (Suisse) et RGPD a couvrir sur un projet web ou mobile livre a un client. A utiliser quand un projet collecte des donnees personnelles, quand on redige une politique de confidentialite, quand on choisit un hebergeur ou un outil d'analytics, ou quand le client demande "est-ce que c'est aux normes". Ce n'est pas un conseil juridique.
---

# nLPD / RGPD — checklist projet

**Cette skill n'est pas un conseil juridique.** Elle liste les points a couvrir techniquement et ceux a faire valider par le client ou son juriste.

## Ce qui declenche quoi

| Situation | Consequence |
|---|---|
| Formulaire de contact | Finalite affichee, duree de conservation definie |
| Compte utilisateur | Acces, rectification et suppression possibles |
| Clients ou visiteurs dans l'UE | RGPD en plus de la nLPD |
| Donnees de sante, religion, biometrie, poursuites | Donnees sensibles : consentement explicite, hebergement a cadrer |
| Sous-traitant hors Suisse/UE | Verifier le pays et le contrat de sous-traitance |
| Cookies non essentiels | Banniere avec refus aussi simple que l'acceptation |

## Cote technique

- Analytics sans cookie (Plausible, Umami) evite la banniere et simplifie tout le reste. C'est le defaut recommande.
- Chiffrement en transit partout, chiffrement au repos pour les donnees sensibles.
- Journaliser les acces aux donnees sensibles.
- Prevoir une procedure d'export et de suppression d'un compte **des la conception**, pas apres la premiere demande.
- Minimiser : ne pas collecter un champ "au cas ou".

## A faire valider par le client

- [ ] Politique de confidentialite (qui la redige, qui la signe)
- [ ] Registre des activites de traitement, si l'entreprise y est soumise
- [ ] Contrat de sous-traitance avec chaque prestataire (hebergeur, mailing, paiement)
- [ ] Procedure en cas de violation de donnees : qui previent qui, dans quel delai
- [ ] Duree de conservation par type de donnee

## Formulation type dans le brief

> Le client confirme que les finalites de collecte listees ci-dessus sont completes. La redaction de la politique de confidentialite est a sa charge / est fournie par le prestataire sur la base d'un modele, sans garantie juridique.
