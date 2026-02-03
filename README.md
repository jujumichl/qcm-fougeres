# Projet QCM (Symfony + Bootstrap + Webpack Encore)

## Description
Application de gestion de QCM avec interface Bootstrap.  
Utilise Symfony pour le backend et Webpack Encore pour compiler les assets (JS/CSS).

---

## Structure
- `assets/` : fichiers sources (JS, SCSS)
- `public/build/` : fichiers compilés (générés par Webpack Encore)
- `templates/` : templates Twig

---


## Installation (dev)


### 1. Installer les dépendances
```bash
composer install
npm install
```

### 2. Lancer Webpack Encore (dev)

```bash
npm run dev
```
---

## Prérequis PHP (erreur Composer possible)

### 1. Arrêter XAMPP

Dans le **XAMPP Control Panel** :

* Stop **Apache**
* Stop **MySQL**

---

### 2️. Télécharger PHP

* Allez sur **[www.php.net](https://www.php.net/downloads.php)**
* Téléchargez **la version adéquate**
* Version **Thread Safe**
* Architecture **x64**
* Format **ZIP**

---

### 3️. Sauvegarder l’ancien PHP

Dans `C:\xampp\` :

* Renommez le dossier `php` en `php_old` (ou `php_backup`)

---

### 4️. Installer le nouveau PHP

* Dézippez PHP 8.4
* Renommez le dossier en `php`
* Placez-le dans :

```
C:\xampp\php
```

---

### 5️⃣ Copier la configuration

Depuis l’ancien dossier PHP :

* Copiez `php.ini`
* Collez-le dans le nouveau dossier `php`

---

### 6️⃣ Vérifier les extensions

Dans `C:\xampp\php\php.ini` :

* Vérifize que `extension_dir="ext"`
* Activez les extensions nécessaires (`pdo_mysql`, `intl`, etc.)

---

### 7️⃣ Redémarrer Apache

Dans XAMPP :

* Start **Apache**

---

### 8️⃣ Vérifier la version

```bash
php -v
```

Et dans le navigateur :

```
http://localhost/dashboard/phpinfo.php
```

---

### 9️⃣ Vérifier Composer

```bash
where php
composer update
```


## Commandes utiles

### Compilation en mode dev

```bash
npm run dev
```

### Compilation en mode production

```bash
npm run build
```

### Serveur Symfony

```bash
symfony server:start
```

---

## Assets (SCSS / JS)

Les fichiers sources se trouvent dans :

* `assets/app.js`
* `assets/styles/app.scss`

Ils sont compilés dans :

* `public/build/app.js`
* `public/build/app.css`

---

## IMPORTANT (Git)

Le dossier `public/build/` **ne doit pas** être commité.

## Astuce

Si le build ne fonctionne pas :

```bash
npm run dev
```

Si `encore` n’est pas reconnu :

```bash
npm install @symfony/webpack-encore --save-dev
```

---

## Stimulus

Stimulus est un micro-framework JS utilisé pour organiser le JS côté front.

Fichiers :

* `assets/controllers/`
* `assets/stimulus_bootstrap.js`

---
