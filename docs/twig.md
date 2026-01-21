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