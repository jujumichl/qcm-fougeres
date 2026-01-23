## **Documentation complète** pour installer et configurer **Stimulus avec Symfony UX et Webpack Encore**

---

#  Documentation : Installer et configurer Stimulus avec Symfony UX

##  1) Qu’est‑ce que Stimulus avec Symfony UX ?

Stimulus est un léger **framework JavaScript** qui permet d’ajouter de l’interactivité à ton front‑end en connectant facilement du JavaScript à des éléments HTML. Symfony UX propose une intégration facilitée avec Webpack Encore grâce à un **bridge** qui :

* lie automatiquement tes contrôleurs Stimulus définis dans `assets/controllers/`
* charge aussi les controllers fournis par des packages UX installés (via `controllers.json`)
* permet le **lazy‑loading** pour ne charger le JS que si nécessaire ([GitHub][1])

---

##  2) Installation

### a) PHP – Symfony UX Stimulus Bundle

Installe le bundle Symfony UX qui configure la partie PHP :

```bash
composer require symfony/stimulus-bundle
```

➡ Ce bundle ajoute quelques helpers Twig et prépare Symfony pour Stimulus. ([Symfony][2])

---

### b) JavaScript – Stimulus & Stimulus Bridge

Installe les dépendances frontend avec npm ou yarn :

```bash
npm install @symfony/stimulus-bridge @hotwired/stimulus --save-dev
```

ou avec Yarn :

```bash
yarn add @symfony/stimulus-bridge @hotwired/stimulus --dev
```

➡ Cela installe **Stimulus** et le **Symfony UX Stimulus Bridge** qui lie les controllers à Webpack Encore. ([npm][3])

---

## 3) Fichier de configuration : controllers.json

Crée (ou vérifie) le fichier `assets/controllers.json` :

```json
{
  "controllers": [],
  "entrypoints": []
}
```

* Symfony Flex peut automatiquement **ajouter des entrées** ici lorsqu’un package UX est installé.
* Ce fichier permet au bridge de **savoir quels controllers externes sont disponibles**. ([GitHub][1])

---

## 4) Configurer Webpack Encore

Ouvre ton `webpack.config.js` et **active le Stimulus Bridge** :

```js
const Encore = require('@symfony/webpack-encore');

Encore
  .setOutputPath('public/build/')
  .setPublicPath('/build')
  .enableStimulusBridge('./assets/controllers.json')   // => essentiel
  .addEntry('app', './assets/app.js')
  .enableSassLoader()
  .enableSingleRuntimeChunk()
;

module.exports = Encore.getWebpackConfig();
```

 `enableStimulusBridge('./assets/controllers.json')` indique à Webpack où se trouve `controllers.json` pour charger les controllers UX et ceux de ton dossier `controllers/`. ([GitHub][1])

---

## 5) Initialiser Stimulus

Symfony UX crée (ou tu peux créer) un fichier comme :

```
assets/stimulus.bootstrap.js
```

Son contenu ressemble à :

```js
import { startStimulusApp } from '@symfony/stimulus-bridge';

// startStimulusApp : initialise Stimulus & charge les controllers
export const app = startStimulusApp(require.context(
  '@symfony/stimulus-bridge/lazy-controller-loader!./controllers',
  true,
  /\.(j|t)sx?$/
));

// Tu peux enregistrer aussi des controllers manuellement ici
// app.register('myController', MyController);
```

### Explication

* `startStimulusApp(...)` initialise l’application Stimulus.
* `require.context(...)` est une fonctionnalité Webpack qui va automatiquement scanner tous les fichiers dans `assets/controllers/` pour les enregistrer comme controllers.
* Le préfixe `@symfony/stimulus-bridge/lazy-controller-loader!` permet un **lazy loading** des controllers : ils ne sont chargés que si le HTML contient l’attribut correspondant. ([GitHub][1])

---

## 6) Charger Stimulus dans ton JS principal

Dans `assets/app.js` :

```js
import './styles/app.scss';
import 'bootstrap';

// Charger Stimulus
import './stimulus.bootstrap.js';
```

* Cela garantit que Stimulus est inclus dans ton build `app.js`, et que tous les controllers sont disponibles. ([Symfony][4])

---

## 7) Créer des Controllers Stimulus

Crée un fichier controller dans :

```
assets/controllers/hello_controller.js
```

Contenu minimal :

```js
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  connect() {
    console.log("Stimulus fonctionne !");
  }
}
```

* Par convention, le nom du fichier se termine en `_controller.js`.
* Ainsi Stimulus enregistrera automatiquement le controller sous le nom `hello`. ([GitHub][1])

---

## 8) Utiliser un controller dans Twig

Dans ton template :

```twig
<div data-controller="hello">
  Contenu interactif ici
</div>
```

 Stimulus va détecter ce contrôleur et appeler `connect()` automatiquement lorsque la page est chargée. ([GitHub][1])

---

## 9) Compiler les assets

Compile les assets pour voir les changements dans le navigateur :

```bash
npm run dev
```

ou en mode écoute :

```bash
npm run watch
```

---

## 10) Utilisation avancée (UX & helpers)

Symfony UX fournit aussi des **helpers Twig** qui facilitent l’usage de Stimulus :

* `stimulus_controller()` → génère automatiquement `data-controller`
* `stimulus_action()` → génère `data-action`
* `stimulus_target()` → génère `data-xxx-target` ([Symfony UX][5])

Exemple :

```twig
<div {{ stimulus_controller('hello') }}>
  <button {{ stimulus_action('hello', 'save', 'click') }}>Save</button>
</div>
```

Cela équivaut à :

```html
<div data-controller="hello">
  <button data-action="click->hello#save">Save</button>
</div>
```

---

## Résumé – étapes essentielles

1. Installer le bundle UX

   ```bash
   composer require symfony/stimulus-bundle
   ```
2. Installer les JS nécessaires

   ```bash
   npm install @symfony/stimulus-bridge @hotwired/stimulus --save-dev
   ```
3. Activer dans Webpack Encore

   ```js
   .enableStimulusBridge('./assets/controllers.json')
   ```
4. Initialiser Stimulus (stimulus.bootstrap.js)
5. Importer ce fichier dans `app.js`
6. Créer des controllers dans `assets/controllers/`
7. Utiliser `data-controller` dans Twig
8. Compiler avec npm/yarn

---

 Cette configuration est **auto‑extensible** : chaque fois que tu installes un package UX (ex. UX Chart.js, UX Dropzone…), Webpack Encore mettra à jour `controllers.json` et le bridge ajoutera leurs controllers automatiquement. ([GitHub][1])

---

Si tu veux, je peux te faire une **checklist étape par étape avec commandes prêtes à copier‑coller**, adaptée à ton projet actuel. Dis‑moi juste si tu veux la version “simple” ou la version “pro avec lazy‑controllers et helpers Twig”.

[1]: https://github.com/symfony/stimulus-bridge?utm_source=chatgpt.com "GitHub - symfony/stimulus-bridge: Stimulus integration bridge for Symfony projects"
[2]: https://symfony.com/bundles/StimulusBundle/current/index.html?utm_source=chatgpt.com "StimulusBundle Documentation"
[3]: https://www.npmjs.com/package/%40symfony/stimulus-bridge?utm_source=chatgpt.com "@symfony/stimulus-bridge - npm"
[4]: https://symfony.com/doc/6.2/frontend/encore/installation.html?utm_source=chatgpt.com "Installing Encore (Symfony 6.2 Docs)"
[5]: https://ux.symfony.com/stimulus?utm_source=chatgpt.com "Stimulus - Central Bridge of Symfony UX - Symfony UX"
