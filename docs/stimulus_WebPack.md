# Documentation Stimulus & Webpack Encore (Symfony)

---

## 1) **Stimulus vs JavaScript classique (en bref)**

**JavaScript classique** :
Tu écris du code qui sélectionne manuellement des éléments (`querySelector`, `getElementById`)  
Tu ajoutes des événements toi‑même (`addEventListener`)  
C’est bien pour du simple script isolé.

**Stimulus** :  
Tu réorganises ton JS en **controllers** liés à ton HTML   via `data-controller`, `data-action`, etc.  
Symfony UX + Stimulus trouve automatiquement les controllers dans `assets/controllers/` et les active selon les éléments présents dans la page.  
C’est très propre, structuré et facile à maintenir pour des interactions complexes.  

---

## 2) **Qu’est‑ce que `symfony/webpack-encore-bundle` ?**

`webpack-encore-bundle` est un bundle Symfony qui :

Installe et configure **Webpack Encore** dans ton projet (outil Node.js qui compile ton CSS/JS).  
Ajoute des helpers Twig comme `{{ encore_entry_link_tags() }}` et `{{ encore_entry_script_tags() }}` pour injecter automatiquement tes fichiers compilés dans les templates.  
Prépare ton projet pour fonctionner avec des outils modernes comme Stimulus.  

Il ne compile pas lui‑même les fichiers : il prépare le système de build qui sera exécuté par npm/yarn.

---

## 3) **La compilation avec `npm run dev` — à quoi ça sert**

1. Tu écris des fichiers sources **dans `assets/`** (JS, SCSS, CSS).
2. `Webpack Encore` lit ces fichiers et leurs **importations**.
3. Il transforme :

   * SCSS → CSS
   * ES6+ JavaScript → JavaScript compatible navigateurs
   * Regroupe les fichiers en bundles (`app.css`, `app.js`).
4. Le résultat est placé dans **`public/build/`** (prêt pour le navigateur).

`npm run dev` :
Compile une fois (développement)
`npm run watch` :
Surveille les changements et recompile automatiquement

C’est indispensable pour utiliser du SCSS, des modules JS, et Stimulus proprement.

---

## 4) **Bases de Stimulus**

### C’est quoi un controller ?

Un **controller Stimulus** est un petit module JavaScript qui se lie automatiquement à une section de ton HTML.

---

### Exemple simple (Counter)

**Fichier** `assets/controllers/counter_controller.js` :

```js
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
    static values = { count: Number }

    connect() {
        this.countValue = this.countValue ?? 0;
        this.element.textContent = `Compteur : ${this.countValue}`;
    }

    increment() {
        this.countValue++;
        this.element.textContent = `Compteur : ${this.countValue}`;
    }
}
```

**HTML** :

```html
<div data-controller="counter" data-counter-count-value="0">
    <button data-action="click->counter#increment">+1</button>
</div>
```

Stimulus reconnaît automatiquement ton controller car il porte le même nom que l’attribut `data-controller`.

---

## 🟪 5) **Documentation avancée Stimulus**

### 🟡 Actions et targets

```html
<div data-controller="example">
  <button data-action="click->example#doSomething">Click</button>
  <span data-example-target="name"></span>
</div>
```

```js
export default class extends Controller {
  static targets = ["name"]

  doSomething() {
    this.nameTarget.textContent = "Clicked!"
  }
}
```

`data-action` appelle une fonction du controller  
`data‑…‑target` référence des éléments du controller

---

## 🟫 6) **Le rôle du dossier `assets/`**

C’est le dossier **source** de tous tes assets front‑end :

* `assets/styles/` :
  Tous tes fichiers SCSS/CSS → compilés en CSS final. ([symfonycasts.com][2])

* `assets/js/` :
  Scripts JavaScript “classiques” ou modules → importés dans `app.js`.

* `assets/controllers/` :
  **Controllers Stimulus** → liés au HTML automatiquement. ([Symfony UX][1])

* `assets/bootstrap.js` :
  Initialise Stimulus et enregistre tous les controllers dans l’app. ([symfony.com][3])

---

## 7) **CSS / SCSS vs JS dans `assets/`**

| Type                | Où le mettre          | Pourquoi                               |
| ------------------- | --------------------- | -------------------------------------- |
| SCSS / CSS          | `assets/styles/`      | Pré‑traitement Sass, variables, mixins |
| JS “classique”      | `assets/js/`          | Code global ou spécifique modulable    |
| Stimulus controller | `assets/controllers/` | Comportements interfacés avec HTML     |
| Images / icons      | `assets/images/`*     | Stockage, import possible avec Webpack |

> *Images et icônes : place les dans `assets/images/` (non obligatoire mais recommandé). Webpack Encore peut les copier ou tu peux les lier facilement dans Twig avec `asset()`.*

---

## 8) **Où stocker les images / icônes**

📍 Conseil :
Place‑les dans `assets/images/` ou `assets/icons/` selon ton organisation.

Puis soit :

```twig
<img src="{{ asset('build/images/logo.png') }}" alt="logo">
```

Ou si tu veux utiliser encore pour copier automatiquement, tu peux configurer `webpack.config.js` pour gérer les assets.

---

## Résumé pratique

`Stimulus` → framework JS léger qui organise l’interaction via HTML (`data‑controller`, `data‑action`). 

`Webpack Encore` → outil de build qui compile tout ton front‑end avec npm.

`npm run dev` → construit les fichiers que le navigateur peut lire.

`assets/` → dossier source des styles, JS, controllers et images.




Voici une **explication claire du principe des *targets*** dans Stimulus, avec des exemples, afin que tu comprennes parfaitement comment ça fonctionne et à quoi ça sert 👇

---

# 🎯 **Qu’est‑ce qu’un *target* dans Stimulus ?**

Un **target** permet à un controller Stimulus de **repérer facilement des éléments spécifiques dans le DOM** sans avoir à écrire toi‑même des sélecteurs (`querySelector`, etc.). Stimulus gère automatiquement la recherche pour toi si tu déclares correctement les targets dans le HTML *et* dans ton controller. ([stimulus.hotwired.dev][1])

---

## 🧠 **Comment ça fonctionne ?**

### 1️⃣ **Déclaration dans le HTML**

Dans ton élément HTML, tu écris :

```html
<div data-controller="example">
    <span data-example-target="output"></span>
</div>
```

➡️ Ici `output` est le nom du *target*.
On utilise la convention :

```
data-<nom‑controller>-target="<nom‑du‑target>"
```

---

### 2️⃣ **Déclaration dans le controller**

Dans ton fichier JS Stimulus :

```js
export default class extends Controller {
    static targets = ["output"]
}
```

➡️ `static targets = [ "output" ]` dit à Stimulus :
« Je veux avoir un target “output” lié à ce controller. » ([stimulus.hotwired.dev][1])

---

### 3️⃣ **Accéder aux éléments target dans ton controller**

Une fois déclarés, Stimulus te fournit automatiquement des propriétés :

| Propriété              | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `this.outputTarget`    | Le **premier élément** correspondant au target   |
| `this.outputTargets`   | **Tous les éléments** correspondants, en tableau |
| `this.hasOutputTarget` | `true` si au moins un élément existe             |

➡️ Tu peux les utiliser comme si tu avais fait un *querySelector* ou *querySelectorAll* toi‑même. ([stimulus.hotwired.dev][1])

---

## 🔥 Exemple concret

### 📌 Controller Stimulus

```js
export default class extends Controller {
    static targets = ["input", "output"]

    greet() {
        this.outputTarget.textContent = `Bonjour ${this.inputTarget.value}!`
    }
}
```

### 📌 HTML

```html
<div data-controller="greet">
    <input data-greet-target="input" type="text">
    <button data-action="click->greet#greet">Dire bonjour</button>
    <div data-greet-target="output"></div>
</div>
```

👉 Quand tu cliques sur le bouton, Stimulus trouve automatiquement :

* l’input (`this.inputTarget`)
* le bloc de sortie (`this.outputTarget`)

et met à jour le texte sans que tu aies à chercher ces éléments manuellement. ([webcrunch.com][2])

---

## 📌 Pourquoi les *targets* sont utiles

### ✨ Pas besoin de `querySelector`

Sans Stimulus tu aurais écrit :

```js
document.querySelector("#moninput")
document.querySelectorAll(".quelqueChose")
```

Avec Stimulus tu dis juste :

```js
this.myTarget
```

➡️ C’est plus clair et moins sujet aux erreurs. ([Smashing Magazine][3])

---

### 🎯 Plusieurs cibles du même nom

Si tu as plusieurs éléments avec le même target :

```html
<div data-example-target="item"></div>
<div data-example-target="item"></div>
```

➡️ Stimulus te donne :

```js
this.itemTargets  // tableau de tous les éléments
```

👉 utile pour boucler ou manipuler plusieurs éléments similaires. ([stimulus.hotwired.dev][1])

---

## 📌 Résumé simple

✅ Un *target* est une **cible DOM référencée par ton controller**
✅ Tu le déclares dans le **HTML** et dans le **JS**
✅ Stimulus te donne des propriétés toutes faites (`this.outputTarget`, etc.)
✅ Pas besoin d’écrire des sélecteurs manuels à chaque fois 💪 ([stimulus.hotwired.dev][1])

---

Si tu veux, je peux te donner un exemple Stimulus avec **plusieurs targets et des actions complexes** (comme une galerie d’images, une liste à trier, etc.) 😉

[1]: https://stimulus.hotwired.dev/reference/targets?utm_source=chatgpt.com "Stimulus Reference"
[2]: https://webcrunch.com/posts/a-tour-of-stimulus-js?utm_source=chatgpt.com "A Tour of Stimulus JS | Webcrunch"
[3]: https://www.smashingmagazine.com/2020/07/introduction-stimulusjs/?utm_source=chatgpt.com "An Introduction To Stimulus.js — Smashing Magazine"