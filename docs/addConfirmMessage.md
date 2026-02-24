Pour ajouter un message de confirmation, vous devez suivre les étapes suivantes :
1. Dans votre contrôleur, vous devez ajouter cette ligne : `import { confirmMess } from './helpers/confirmMess.js';`
2. Ensuite, vous pouvez utiliser la fonction `confirmMess` pour afficher un message de confirmation. Par exemple :
```javascript
// Il est important de laisser le this.application en premier, sinon la fonction ne fonctionnera pas correctement
// vous pouvez personnaliser le message en changeant le texte dans les guillemets. 
// Vous pouvez aussi choisir le type de message en ajoutant un argument après le message, les types de messages sont : 
// 'conf' pour un message de confirmation avec les boutons confirmer/annuler, 
// 'ok' pour un message d'information avec le bouton ok et 'warn' pour un message d'attention avec les boutons oui/non.
// Par défaut, le type de message est 'conf'.
const ok = confirmMess(this.application, 'Êtes-vous sûr de vouloir supprimer cet élément ?');
if (ok) {
    // Code si l'utilisateur confirme
}
else{
    // Code si l'utilisateur annule
}
```
3. Vous devez ajouter dans votre fichier `.html.twig` le code suivant :
```html
<div data-controller="confirm">
    
    {# La modal pour le message de confirmation par défaut (réponse confirmer/annuler) #}
    {% include './MessConfirm/defaultConf.html.twig' %}

    {# La modal pour le message de d'information par défaut (réponse ok) #}
    {% include './MessConfirm/defaultOk.html.twig' %}

    {# La modal pour le message d'attention par défaut (réponse oui/non) #}
    {% include './MessConfirm/defaultWarn.html.twig' %}
</div>
```
> la balise peux être placée n'importe où dans votre fichier `.html.twig`, si vous avez créer un message de confirmation personnalisé, vous devez ajouter ou modifier le code ci-dessus en fonction de votre message de confirmation personnalisé.

Pour modifier les messages personnalisés vous devrez `copier` le fichier `default.html.twig` et le `renommer` afin de ne pas écraser le fichier original ensuite vous pourrez le modifier et `l'inclure` dans votre html.