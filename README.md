Voici une version professionnelle du README adaptée exactement à ton architecture actuelle et orientée déploiement.

---

# Projet QCM

Application de gestion de QCM développée avec :

* Backend : Symfony
* ORM : Doctrine ORM
* Frontend : Bootstrap
* JavaScript : Stimulus (Hotwired)
* Bundler : Webpack Encore

---

# Architecture du projet

```
├── assets/
│   ├── controllers/        # Contrôleurs Stimulus
│   ├── styles/             # Fichiers SCSS
│   ├── vendor/             # Dépendances front (@hotwired)
│   ├── app.js              # Entrée principale JS
│   └── controllers.json
│
├── config/                 # Configuration Symfony
│   ├── packages/           # Doctrine, Security, Twig, etc.
│   ├── routes/
│   ├── bundles.php
│   └── services.yaml
│
├── docs/                   # Documentation interne
│
├── migrations/             # Migrations Doctrine
│
├── public/                 # Point d’entrée web
│   ├── index.php
│   └── bundles/
│
├── src/
│   ├── Controller/         # Contrôleurs HTTP
│   ├── Entity/             # Entités Doctrine
│   ├── Repository/         # Repositories
│   └── Kernel.php
│
├── templates/              # Templates Twig
├── tests/                  # Tests PHPUnit
├── translations/           # Fichiers de traduction
│
├── compose.yaml            # Docker (si utilisé)
├── composer.json
├── package.json
├── webpack.config.js
└── README.md
```

---

# Prérequis

* PHP ≥ 8.x
* Composer
* Node.js ≥ 18
* MySQL ou MariaDB
* Apache ou Nginx
* (Optionnel) Docker + Docker Compose

---

# Installation

## 1. Cloner le projet

```bash
git clone <repository-url>
cd projet-qcm
```

## 2. Installer les dépendances

```bash
composer install
npm install
```

En production :

```bash
composer install --no-dev --optimize-autoloader
```

---

# Configuration de l’environnement

Créer ou adapter le fichier :

```
.env.local
```

Configuration minimale :

```
APP_ENV=prod
APP_DEBUG=0
DATABASE_URL="mysql://user:password@127.0.0.1:3306/qcm_db"
```

Ne jamais versionner `.env.local`.

---

# Base de données et entités (Doctrine)

Les entités sont situées dans :

```
src/Entity/
```

Les repositories sont dans :

```
src/Repository/
```

Les migrations versionnées sont dans :

```
migrations/
```

## Création de la base (si nécessaire)

```bash
php bin/console doctrine:database:create
```

## Application des migrations

En environnement de déploiement, ne jamais utiliser :

```
doctrine:schema:update --force
```

Utiliser uniquement les migrations :

```bash
php bin/console doctrine:migrations:migrate --no-interaction
```

Cela garantit la synchronisation entre :

* Les entités (`src/Entity`)
* Les fichiers de migration
* La base de données

## Validation du mapping

```bash
php bin/console doctrine:schema:validate
```

Permet de vérifier la cohérence entre le mapping Doctrine et la base.

## Fixtures (développement uniquement)

```bash
php bin/console doctrine:fixtures:load
```

Attention : supprime les données existantes.
Ne pas utiliser en production sauf initialisation contrôlée.

---

# Assets et Webpack Encore

Les sources frontend sont dans :

```
assets/
```

Point d’entrée principal :

```
assets/app.js
```

Configuration :

```
webpack.config.js
```

## Compilation en développement

```bash
npm run dev
```

## Compilation en production

```bash
npm run build
```

Ne pas versionner les fichiers compilés si générés dynamiquement.

---

# Cache (production)

```bash
php bin/console cache:clear --env=prod
php bin/console cache:warmup
```

---

# Permissions

Vérifier les droits d’écriture sur :

```
var/
```

Exemple Linux :

```bash
chmod -R 775 var
```

---

# Déploiement avec Docker (si utilisé)

Fichiers présents :

```
compose.yaml
compose.override.yaml
```

Lancement :

```bash
docker compose up -d
```

Puis exécuter les migrations dans le conteneur :

```bash
docker compose exec php php bin/console doctrine:migrations:migrate --no-interaction
```

---

# Checklist de déploiement

* Installer dépendances PHP
* Installer dépendances Node
* Configurer `.env.local`
* Créer la base de données
* Exécuter les migrations
* Compiler les assets (`npm run build`)
* Vider et réchauffer le cache
* Vérifier permissions
* Vérifier configuration serveur (DocumentRoot → `public/`)

---

# Bonnes pratiques

* Toute modification d’entité doit générer une migration
* Les migrations doivent être versionnées
* Ne jamais modifier la base directement en production
* Ne pas exposer les fichiers d’environnement
* Ne pas utiliser `schema:update --force` en production