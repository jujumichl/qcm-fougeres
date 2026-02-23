Pour ajouter un message de confirmation, vous devez suivre les étapes suivantes :
1. Dans votre contrôleur, vous devez ajouter cette ligne : `import { confirmMess } from './helpers/confirmMess.js';`
2. Ensuite, vous pouvez utiliser la fonction `confirmMess` pour afficher un message de confirmation. Par exemple :
```javascript
// Il est important de laisser le this.application en premier, sinon la fonction ne fonctionnera pas correctement
// vous pouvez personnaliser le message en changeant le texte dans les guillemets
const ok = confirmMess(this.application, 'Êtes-vous sûr de vouloir supprimer cet élément ?');
if (ok) {
    // Code si l'utilisateur confirme
}
else{
    // Code si l'utilisateur annule
}
```
3. Vous devez ajouter dans votre fichier `.html.twig` la balise twig suivante :
```twig
{% include 'MessConfirm/confirmMessage.html.twig' %}
```
> la balise peux être placée n'importe où dans votre fichier `.html.twig`, si vous avez créer un message de confirmation personnalisé, vous devez remplacer `confirmMessage.html.twig` par le nom de votre fichier.

Vous pouvez changer le desing du message de confirmation en modifiant le fichier `confirmMessage.html.twig` qui se trouve dans le dossier `templates/MessConfirm`.

Cependant vous devrez copier le fichier `confirmMessage.html.twig` et le renommer afin de ne pas écraser le fichier original.