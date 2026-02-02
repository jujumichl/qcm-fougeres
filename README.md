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

## 💡 Astuce

Si le build ne fonctionne pas :

```bash
npm run dev
```

Si `encore` n’est pas reconnu :

```bash
npm install @symfony/webpack-encore --save-dev
```

---

## 🧠 Stimulus

Stimulus est un micro-framework JS utilisé pour organiser le JS côté front.

Fichiers :

* `assets/controllers/`
* `assets/stimulus_bootstrap.js`

---
