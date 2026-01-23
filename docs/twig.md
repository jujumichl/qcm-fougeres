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


<div style="border: 1px solid orange; padding: 10px; background-color: #fff3cd; color: #000000;"> Explication générer par CHATGPT
</div>
<br>

Le langage **Twig** est un **moteur de templates** utilisé principalement avec le framework **Symfony**, mais aussi dans d'autres environnements PHP. Il permet de **séparer la logique métier du rendu HTML**, en simplifiant la génération de pages web dynamiques.

---

### 🌱 **Concepts de base**

#### 🔧 1. **Syntaxe**

Twig utilise trois types de délimiteurs :

* `{{ ... }}` : pour **afficher une variable**
* `{% ... %}` : pour **exécuter des instructions** (conditions, boucles, etc.)
* `{# ... #}` : pour **écrire des commentaires** (non visibles dans le HTML)

#### Exemple :

```twig
<h1>Bienvenue {{ nom }} !</h1>

{% if age >= 18 %}
    <p>Vous êtes majeur.</p>
{% else %}
    <p>Vous êtes mineur.</p>
{% endif %}
```

---

### 🔄 **2. Structures de contrôle**

Twig propose les classiques :

* `if`, `else`, `elseif`
* `for`
* `set` (pour assigner une variable)

```twig
{% for produit in produits %}
    <li>{{ produit.nom }} - {{ produit.prix }} €</li>
{% endfor %}
```

---

### 🧰 **3. Filtres**

Les **filtres** permettent de **transformer** les données affichées.

#### Exemple :

```twig
{{ nom|upper }}           {# MAJUSCULES #}
{{ liste|length }}        {# Nombre d’éléments #}
{{ date|date('d/m/Y') }}  {# Format de date #}
```

---

### 🧱 **4. Héritage de templates**

Twig permet de créer un **template de base** que les autres templates peuvent **étendre**.

#### base.html.twig

```twig
<html>
  <head>
    <title>{% block title %}Titre par défaut{% endblock %}</title>
  </head>
  <body>
    {% block body %}{% endblock %}
  </body>
</html>
```

#### page.html.twig

```twig
{% extends 'base.html.twig' %}

{% block title %}Page d'accueil{% endblock %}

{% block body %}
  <p>Contenu de la page.</p>
{% endblock %}
```

---

### 🔐 **5. Sécurité**

Twig est **sécurisé par défaut** : il échappe automatiquement les variables HTML (`{{ variable }}`) pour éviter les failles XSS. Si tu veux afficher du HTML volontairement :

```twig
{{ mon_html|raw }}
```

---

### 💡 Résumé

| Fonction        | Syntaxe                                 |            |
| --------------- | --------------------------------------- | ---------- |
| Affichage       | `{{ variable }}`                        |            |
| Condition       | `{% if ... %} ... {% endif %}`          |            |
| Boucle          | `{% for ... in ... %} ... {% endfor %}` |            |
| Commentaire     | `{# ceci est un commentaire #}`         |            |
| Template parent | `{% extends 'base.html.twig' %}`        |            |
| Bloc modifiable | `{% block nom %} ... {% endblock %}`    |            |
| Filtres         | `{{ var                                 | filter }}` |

---

Si tu veux, je peux t’aider à **écrire un template Twig complet** à partir de ton projet Symfony.
