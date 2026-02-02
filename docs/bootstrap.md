**Documentation claire et complète** pour **installer Bootstrap + Bootstrap Icons dans un projet Symfony avec Webpack Encore**

# Documentation – Installation de Bootstrap et des icônes dans Symfony

## 1. Objectif

Cette documentation explique comment :

* installer **Bootstrap**
* installer **Bootstrap Icons**
* compiler les assets avec **Webpack Encore**
* utiliser Bootstrap et ses icônes dans les templates Twig

---

## 2. Prérequis

* Symfony installé
* Composer
* Node.js et NPM
* Webpack Encore configuré

Si Webpack Encore n’est pas encore installé :

```bash
composer require symfony/webpack-encore-bundle
npm install
```

---

## 3. Installation de Bootstrap

### 3.1 Installation via NPM

À la racine du projet :

```bash
npm install bootstrap --save
```

Pour le JavaScript de Bootstrap (obligatoire pour certains composants) :

```bash
npm install @popperjs/core --save
```

---

### 3.2 Import de Bootstrap

#### a) Fichier JavaScript principal

Dans `assets/app.js` :

```js
import 'bootstrap';
import './styles/app.scss';
```

---

#### b) Fichier SCSS Bootstrap

Créer ou modifier `assets/styles/app.scss` :

```scss
@import "~bootstrap/scss/bootstrap";
```

⚠️ Si Sass n’est pas installé :

```bash
npm install sass sass-loader --save-dev
```

---

## 4. Installation des icônes Bootstrap

### 4.1 Installation via NPM

```bash
npm install bootstrap-icons --save
```

---

### 4.2 Import des icônes

Dans `assets/app.js` :

```js
import 'bootstrap-icons/font/bootstrap-icons.css';
```

---

## 5. Configuration Webpack Encore

Vérifier que `webpack.config.js` contient :

```js
Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/app.js')
    .enableSassLoader()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
;
```

---

## 6. Compilation des assets

Lancer la compilation :

```bash
npm run dev
```

Ou en mode automatique :

```bash
npm run watch
```

Les fichiers compilés sont générés dans :

```
public/build/
```

---

## 7. Chargement dans Twig

Dans le template principal (souvent `base.html.twig`) :

```twig
{{ encore_entry_link_tags('app') }}
{{ encore_entry_script_tags('app') }}
```

---

## 8. Utilisation de Bootstrap

### Exemple Bootstrap

```html
<button class="btn btn-primary">
    Bouton Bootstrap
</button>
```

---

### Exemple Bootstrap Icons

```html
<i class="bi bi-person-fill"></i>
<i class="bi bi-trash"></i>
<i class="bi bi-alarm"></i>
```

---

## 9. Structure finale du projet

```
assets/
├── app.js
├── styles/
│   └── app.scss
public/
└── build/
```

---

## 10. Problèmes courants

### Bootstrap ne s’affiche pas

* Vérifier que `npm run dev` a été exécuté
* Vérifier la présence de `encore_entry_link_tags`

### Icônes non visibles

* Vérifier l’import `bootstrap-icons.css`
* Vérifier les classes `bi bi-xxx`

---

## 11. Résumé

* Bootstrap et les icônes s’installent via **NPM**
* Les styles sont importés via **SCSS**
* La compilation est faite par **Webpack Encore**
* L’intégration dans Symfony se fait via **Twig**

