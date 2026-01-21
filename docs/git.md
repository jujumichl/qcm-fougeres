# Documentation pratique git
## Initialiser un dépôt distant
### Créer (ou aller dans) ton dossier de projet

```bash
cd /chemin/vers/ton/projet
```

Ou créer un nouveau projet :

```bash
mkdir mon-projet
cd mon-projet
```

---

### Initialiser Git

```bash
git init
```

👉 Résultat :

```
Initialized empty Git repository in /mon-projet/.git/
```

Ton dossier devient un **dépôt Git local**.

---

### Vérifier l’état du dépôt

```bash
git status
```

Tu verras :

* fichiers non suivis (untracked)
* fichiers modifiés
* etc.

---

### Créer un `.gitignore` (fortement recommandé)

```bash
touch .gitignore
```

Exemple de contenu :

```gitignore
/node_modules
/vendor
.env
.DS_Store
```

Puis :

```bash
git add .gitignore
git commit -m "Ajout du .gitignore"
```

---

### Ajouter les fichiers au suivi Git

#### Ajouter tout le projet

```bash
git add .
```

#### Ou un fichier précis

```bash
git add index.php
```

---

### Faire le premier commit

```bash
git commit -m "Initialisation du projet"
```

> /!\ Si Git te demande ton identité :

```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton@email.com"
```

---

### Vérifier la branche

```bash
git branch
```

Par défaut maintenant :

* `main` (ou parfois `master`)

Pour renommer si besoin :

```bash
git branch -M main
```

---

### Lier à un dépôt distant (GitHub / GitLab)

#### Exemple GitHub :

```bash
git remote add origin https://github.com/ton-user/mon-projet.git
```

Vérifier :

```bash
git remote -v
```

---

### Envoyer ton code sur le dépôt distant

```bash
git push -u origin main
```

---

### Commandes utiles après `git init`

| Action               | Commande                |
| -------------------- | ----------------------- |
| Voir l’historique    | `git log --oneline`     |
| Voir les différences | `git diff`              |
| Annuler un add       | `git reset fichier.txt` |
| Supprimer Git        | `rm -rf .git`           |

## Alias 

### Qu'est ce que c'est ?
Un alias Git est un `raccourci` créé dans la configuration Git.
Il est défini dans la section `[alias]` du fichier `.gitconfig`

### À quoi ça sert ?

Les alias Git servent à __simplifier__ et __accélérer__ l’utilisation de Git en remplaçant des commandes longues par des commandes courtes.

### Pourquoi les utiliser ?

- Pour gagner du temps
- Pour éviter de retaper des commandes longues
- Pour réduire les erreurs de frappe
- Pour créer des commandes personnalisées (ex : un alias pour changer d’identité)
#### Exemples concrets :
| Commande longue            | Alias              |
| -------------------------- | ------------------ |
| `git status`               | `git st`           |
| `git checkout`             | `git co`           |
| `git commit -m "message"`  | `git cm "message"` |
| `git config user.name ...` | `git owen`         |


### Deux types d'alias existent

#### Alias git
Ce sont des raccourcis pour des commandes Git existantes.

Exemple :
```ini
[alias]
    st = status
```

#### Alias shell
Ils permettent d’exécuter __plusieurs commandes__ ou des commandes non-Git.  
Ils doivent commencer par `!`.

Exemple :
```ini
[alias]
    test = "!git config user.name 'test User' && git config user.email 'testUser@test.fr' && git config user.name && git config user.email"
```

### Comment le créer ?
#### En ligne de commande
##### Alias simple 
```bash
git config --global alias.st status
```

Test :
```bash
git st
```

##### Alias shell 
```bash
git config --global alias.test "!git config user.name 'test User' && git config user.email 'testUser@test.fr' && git config user.name && git config user.email"
```

test : 
```bash
git test
```


#### Via le fichier `.gitconfig`
##### Ouvrir le fichier
```bash
nano ~/.gitconfig
```

##### Ajouter l’alias dans la section `[alias]`

```ini
[alias]
    st = status
    co = checkout
    cm = commit
    test = "!git config user.name 'Test User' && git config user.email 'user@test'"
```

##### Sauvegarder et tester

git st
git test


### Résumer rapide 
| Action                 | Commande                                     |
| ---------------------- | -------------------------------------------- |
| Créer un alias simple  | `git config --global alias.st status`        |
| Créer un alias shell   | `git config --global alias.owen "!commande"` |
| Voir un alias          | `git config --global --get alias.st`         |
| Supprimer un alias     | `git config --global --unset alias.st`       |
| Voir le fichier config | `cat ~/.gitconfig`                           |
