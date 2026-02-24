# Documentation synthétique : ID hexadécimal aléatoire pour QCM

## Objectif

Générer un identifiant unique, court (8 caractères hexadécimaux), stable et utilisable pour créer, éditer ou supprimer un QCM via les routes et le front-end.

---

## Mise en place

1. **Entity QCM**

   * Le champ `id` devient une chaîne de 8 caractères unique.
   * L’ID est généré automatiquement côté serveur lors de l’instanciation du QCM.
   * Exemple de génération : `bin2hex(random_bytes(4))` → 8 caractères hex.

2. **Controller Symfony**

   * Lors de la création d’un QCM (`/qcm/create`), l’ID est renvoyé dans la réponse JSON.
   * L’ID est ensuite utilisé côté JavaScript pour référencer le QCM dans le DOM ou pour les appels API (rename, delete).

3. **Front-end / Stimulus**

   * Récupérer l’ID depuis la réponse JSON après création.
   * Utiliser cet ID pour ajouter le QCM dans le DOM et pour toutes les actions futures (édition, suppression, navigation).

---

## Avantages

* ID court et lisible pour les URLs.
* Généré côté serveur → garanti unique et stable.
* Compatible avec les actions front-end et les routes API.
* Permet de ne pas dépendre d’ID auto-incrémentés ou d’IDs générés côté JavaScript.

---

## Flux de l’ID hexadécimal pour un QCM

```
[ Front-end (JS / Stimulus) ]
          |
          | 1. Création du QCM (click bouton "Créer")
          v
[ Fetch POST /qcm/create ]  ---> Serveur génère ID hex 8 caractères
          |
          v
[ Symfony / Doctrine ]
- QCM instancié
- ID généré : bin2hex(random_bytes(4)) → 8 caractères
- Persisté en base
          |
          v
[ JSON Response ]
{ id: "a3f91b7c", name: "Nouveau QCM" }
          |
          v
[ Front-end ]
- Ajoute le QCM dans le DOM avec cet ID
- ID utilisé pour :
    • Sélectionner l’élément
    • Renommer (/qcm/{id} PATCH)
    • Supprimer (/qcm/{id} DELETE)
    • Naviguer vers /qcm/{id}

```

