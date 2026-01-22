Commande installer twig : `composer require symfony/twig-bundle`

Un dossier **templates** est créer :

=> Ce dossier contient toutes les pages HTML qui serviront pour le front

Le fichier **base.html.twig** sert de template principale dont les autres templates pourront hérités.

- Pour afficher une variable on utilise les doubles accolades : `{{ Ma variable }}`

- Pour mettre en commentaire on utilise : `{# mon commentaire #}`

- syntaxe d'un **if** : `{% if {condition} %}` `...{% endif %}`

- Pour hériter de la page principale : `{% extends 'base.html.twig' %}`

- Comment inclure une template : `{% include 'repertoire/nom.html.twig' %}`

Lien vers les tags : https://twig.symfony.com/doc/3.x/tags/index.html

Lien vers les filtres : https://twig.symfony.com/doc/3.x/filters/index.html

Lien vers les fontions : https://twig.symfony.com/doc/3.x/functions/index.html



## Où mettre le JS en Symfony ?

### Solution simple (sans Node)

-> **`public/js/`**

* rapide
* pas de compilation
* bien pour petits projets

```twig
<script src="{{ asset('js/app.js') }}"></script>
```

---

### Solution pro : `assets/` + Encore

-> **`assets/app.js`**

* meilleure organisation
* compatible Bootstrap, npm, modules JS
* standard Symfony

---
## Solution simple

1. **Créer le fichier JS**
   `public/js/app.js`

   ```js
   // app.js
   console.log("JS chargé !");
   ```

2. **Inclure dans le Twig**

   ```twig
   {% block javascripts %}
     <script src="{{ asset('js/app.js') }}"></script>
   {% endblock %}
   ```

3. **Ajouter le block dans `base.html.twig`** (si absent)

   ```twig
   {% block javascripts %}{% endblock %}
   ```

---

## Encore

1. **Installer Encore**

```bash
composer require symfony/webpack-encore-bundle
npm install
```

2. **JS dans `assets/app.js`**

```js
import 'bootstrap';
```

3. **Inclure dans Twig**

```twig
{{ encore_entry_script_tags('app') }}
```

---

## Résumé rapide

| Projet                    | Où mettre le JS |
| ------------------------- | --------------- |
| Petit / rapide            | `public/js`     |
| Symfony propre / scalable | `assets/`     |

**Sur Symfony + Bootstrap + JS**, la bonne pratique est **`assets/`**.
