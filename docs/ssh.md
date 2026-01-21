# Configuration SSH pour plusieurs comptes GitLab

Dans notre projet, nous travaillons sur **la même machine virtuelle distante**.  
Pour faciliter l’utilisation de deux comptes GitLab différents sur cette machine, nous allons créer un fichier `config` dans le dossier `~/.ssh` permettant de spécifier quelle clé SSH utiliser pour chaque compte.

---

## 1️. Créer le fichier `config`

Si le fichier n’existe pas, vous pouvez le créer avec la commande suivante :

```bash
nano ~/.ssh/config
```

## 2. Ajouter les configurations pour les deux comptes

```bash
# Compte user1 sur GitLab
Host git-user1                     # Alias que l'on utilise pour ce compte
    HostName gitlab.fr             # Adresse du serveur GitLab
    User git                       # Nom de l'utilisateur système SSH (toujours 'git' pour GitLab)
    IdentityFile ~/.ssh/ed.rsaTest # Chemin vers la clé privée
    IdentitiesOnly yes             # Force l'utilisation de cette clé uniquement

# Compte user2 sur GitLab
Host git-user2
    HostName gitlab.fr
    User git
    IdentityFile ~/.ssh/id_rsaTest2
    IdentitiesOnly yes
```

Remarque : S'assurer que les permissions du **fichier** et du **dossier SSH** sont correctes 

```bash
chmod 600 ~/.ssh/config
chmod 700 ~/.ssh
```

## 3. Tester la connexion SSH

Pour vérifier la connexion avec le premier compte : `ssh -T git@git-user1`

Le message attendu est : **Welcome to GitLab, @user1**

## Conclusion

En configurant correctement le fichier `~/.ssh/config` avec des **alias(host)** pour chaque compte et en utilisant IdentitiesOnly yes, on s’assure que :

- Chaque compte GitLab utilise la bonne clé SSH.
- Il n’y a aucune confusion entre les clés lors des connexions.
- La gestion des dépôts Git sur une machine partagée devient simple et sécurisée.

Cette méthode permet de travailler sur plusieurs comptes GitLab sur la même machine virtuelle distante sans conflit.