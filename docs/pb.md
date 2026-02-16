# Problème d'auto exécution du initialize et du connect
## Description du pb
Ma variable `this.typeValue` est rénitialisée à sa valeur par défaut à chaque fois que le controller est connecté, même si j'ai changé sa valeur dans le code. Par exemple, si j'ai une variable `typeValue` qui est initialisée à "unique", et que je la change à "liste" dans une fonction, elle reviendra à "unique" à chaque fois que je supprimais une liste.

## Résolution
Le problème vient du fait que lorsque le controller est connecté, les fonctions `initialize()` et `connect()` sont automatiquement appelées. Donc, si on a une variable dans le controller qui a une valeur par défaut, elle sera rénitialisée à chaque fois que le controller sera connecté, même si on a changé sa valeur dans le code. Il faut donc faire attention à ou on place `notre data-controller="edition"`. Si on le place sur un élément qui est supprimé et recréé, le controller sera reconnecté et les fonctions `initialize()` et `connect()` seront appelées à chaque fois, ce qui réinitialisera les variables à leur valeur par défaut. Il faut donc placer le `data-controller` sur un élément qui n'est pas supprimé et recréé, ou alors gérer la réinitialisation des variables dans les fonctions `initialize()` et `connect()`.


# Problème sur l'ajout d'une option à plusieurs select

La méthode suivante ne fonctionne pas correctement :

```js
addOpt(text){
  let opt = document.createElement('option');
  opt.textContent = text;

  for (let select of this.selectTargets){
    select.append(opt);
  }
}
```

## Symptôme

L’option n’apparaît que dans le dernier `<select>` de `this.selectTargets`.

---

## Cause

Un élément DOM ne peut exister qu’à un seul endroit dans le document.

Dans la boucle, le même objet `opt` est ajouté à plusieurs `<select>`.
À chaque itération, il est déplacé vers le nouveau `<select>`.
Résultat : il ne reste que dans le dernier.

---

## Solution 1 

Créer une nouvelle `<option>` à chaque itération :

```js
addOpt(text){
  for (let select of this.selectTargets){
    let opt = document.createElement('option');
    opt.textContent = text;
    select.append(opt);
  }
}
```

---

## Solution 2 

Cloner l’élément :

```js
addOpt(text){
  let opt = document.createElement('option');
  opt.textContent = text;

  for (let select of this.selectTargets){
    select.append(opt.cloneNode(true));
  }
}
```

---

## Résumé

Un nœud DOM ne peut pas être partagé entre plusieurs parents.
Il faut soit en créer un nouveau à chaque ajout, soit le cloner.
