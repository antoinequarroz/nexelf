# Banque de questions — App mobile (Expo / React Native)

Le mobile ajoute une dimension que le web n'a pas : le cycle de vie de l'app, le hors ligne, les stores. Ce sont ces trois-là qui coûtent cher.

## 1. Le contexte d'usage

- Où et quand l'app est-elle utilisée ? (transports, terrain, canapé, en réunion)
- Une main ou deux ? Debout ou assis ? (change la position des actions principales)
- Session courte et répétée, ou longue et rare ?
- Il existe aussi une version web ? Les deux doivent-elles rester synchronisées en temps réel ?

## 2. Plateformes et matériel

- iOS, Android, ou les deux ? À partir de quelles versions ?
- Tablette prévue, ou téléphone seulement ?
- Mode sombre suivant le réglage système ?
- Y a-t-il des utilisateurs sur des appareils anciens ou d'entrée de gamme ? (décide du budget performance)

## 3. Hors ligne — la question qui change l'architecture

- Que doit-il se passer **sans réseau** ? Écran d'erreur, lecture seule sur données en cache, ou création possible avec synchronisation différée ?
- Si création hors ligne : que faire en cas de conflit à la reconnexion ?
- Quelles données doivent être disponibles hors ligne, et lesquelles peuvent attendre ?

Répondre « on verra » ici, c'est accepter de réécrire la couche de données plus tard.

## 4. Permissions et capacités natives

Pour chacune : est-elle vraiment nécessaire, ou confortable ?

- Appareil photo, galerie
- Localisation — à l'usage seulement, ou en arrière-plan ? (l'arrière-plan déclenche un examen renforcé par les stores)
- Notifications push
- Contacts, calendrier, biométrie, Bluetooth, santé

**Quand la permission est-elle demandée ?** Au premier lancement, c'est le meilleur moyen de se la faire refuser. La demander au moment où l'utilisateur comprend pourquoi.
**Et si elle est refusée ?** L'app doit rester utilisable, ou expliquer clairement ce qui est bloqué.

## 5. Notifications push

- Quels événements déclenchent une notification ?
- L'utilisateur peut-il choisir lesquelles recevoir ?
- Que se passe-t-il quand on tape dessus ? (chaque notification a une destination à concevoir)
- Badge sur l'icône ? Qui le remet à zéro ?

## 6. Abonnements et achats

- Monétisation : achat unique, abonnement, freemium, gratuit ?
- **Rappel : le contenu numérique passe obligatoirement par les achats in-app.** RevenueCat gère les deux plateformes ; jamais Stripe directement dans l'app.
- Essai gratuit ? Restauration des achats sur un nouvel appareil (obligatoire chez Apple) ?
- L'abonnement est-il partagé avec une version web ? Un utilisateur qui a payé sur le web doit-il être reconnu dans l'app ?

## 7. Cycle de vie et distribution

- Mise à jour du contenu sans repasser en revue : correctifs OTA via `expo-updates` ?
- Que se passe-t-il si l'utilisateur a une version ancienne et que l'API a changé ? Écran de mise à jour obligatoire ?
- Comptes de test pour la revue Apple : qui les fournit ? (rejet classique)
- Qui possède les comptes App Store et Google Play — Antoine ou le client ? **À trancher avant de commencer.**
- Fiches des stores : captures, description, mots-clés — qui les rédige ?

## Les oubliés — passe 3

- **Premier lancement, aucune donnée.** L'écran vide est un écran à concevoir.
- **Suppression de compte depuis l'app** — Apple l'exige quand l'app permet d'en créer un. Rejet garanti sinon.
- **Politique de confidentialité et étiquette de confidentialité** — obligatoires au dépôt.
- **Que se passe-t-il si l'app est mise en arrière-plan au milieu d'un formulaire ?**
- **Batterie et données mobiles** : y a-t-il de la synchronisation en arrière-plan ? À quel rythme ?
- **Deep links** : ouvrir l'app sur un contenu précis depuis un email ou un SMS ?
- **Accessibilité** : lecteur d'écran, tailles de texte agrandies. Un écran qui casse à 200 % de taille de police est un écran non fini.
- **Délai de revue des stores** — compter plusieurs jours dans le planning, et davantage pour une première soumission.
